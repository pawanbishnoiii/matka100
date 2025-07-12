
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
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

    // Get Razorpay credentials from payment_settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('payment_settings')
      .select('razorpay_key_id, razorpay_key_secret')
      .single()

    if (settingsError || !settings?.razorpay_key_id || !settings?.razorpay_key_secret) {
      throw new Error('Razorpay not configured')
    }

    const { amount, currency = 'INR', receipt, notes }: PaymentRequest = await req.json()

    // Create Razorpay order
    const razorpayAuth = btoa(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`)
    
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
        receipt,
        notes,
      }),
    })

    if (!orderResponse.ok) {
      throw new Error('Failed to create Razorpay order')
    }

    const order = await orderResponse.json()

    // Store transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'deposit',
        amount,
        currency,
        status: 'pending',
        external_id: order.id,
        payment_method: 'razorpay',
        description: 'Razorpay deposit',
        metadata: { order }
      })

    if (transactionError) {
      console.error('Transaction insert error:', transactionError)
    }

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: settings.razorpay_key_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Razorpay payment error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
