
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('No user found')
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyRequest = await req.json()

    // Get Razorpay secret
    const { data: settings, error: settingsError } = await supabaseClient
      .from('payment_settings')
      .select('razorpay_key_secret')
      .single()

    if (settingsError || !settings?.razorpay_key_secret) {
      throw new Error('Razorpay not configured')
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', settings.razorpay_key_secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid signature')
    }

    // Get transaction
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('external_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single()

    if (transactionError || !transaction) {
      throw new Error('Transaction not found')
    }

    // Update transaction status
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status: 'completed',
        metadata: {
          ...transaction.metadata,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id)

    if (updateError) {
      throw new Error('Failed to update transaction')
    }

    // Update user balance
    const { error: balanceError } = await supabaseClient.rpc('update_user_balance', {
      user_uuid: user.id,
      amount: transaction.amount,
      currency: transaction.currency || 'INR'
    })

    if (balanceError) {
      throw new Error('Failed to update balance')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
