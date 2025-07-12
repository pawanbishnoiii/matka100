
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
    console.log('=== Payment Verification Started ===');

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
      console.error('Authentication failed: No user found');
      throw new Error('Authentication required')
    }

    console.log('User authenticated:', user.id);

    const requestBody = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyRequest = requestBody;

    console.log('Payment verification details:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      hasSignature: !!razorpay_signature
    });

    // Get Razorpay secret using service role
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('Fetching Razorpay secret...');
    const { data: settings, error: settingsError } = await supabaseService
      .from('payment_settings')
      .select('razorpay_key_secret')
      .limit(1)
      .single()

    if (settingsError || !settings?.razorpay_key_secret) {
      console.error('Failed to fetch Razorpay secret:', settingsError);
      throw new Error('Payment verification failed - configuration error')
    }

    // Verify signature
    console.log('Verifying payment signature...');
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', settings.razorpay_key_secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature verification failed', {
        expected: expectedSignature,
        received: razorpay_signature
      });
      throw new Error('Payment signature verification failed')
    }

    console.log('Payment signature verified successfully');

    // Get transaction using service role
    console.log('Fetching transaction record...');
    const { data: transaction, error: transactionError } = await supabaseService
      .from('transactions')
      .select('*')
      .eq('external_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single()

    if (transactionError || !transaction) {
      console.error('Transaction not found:', transactionError);
      throw new Error('Transaction record not found')
    }

    console.log('Transaction found:', { id: transaction.id, amount: transaction.amount });

    // Update transaction status
    console.log('Updating transaction status to completed...');
    const { error: updateError } = await supabaseService
      .from('transactions')
      .update({
        status: 'completed',
        metadata: {
          ...transaction.metadata,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          verified_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id)

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      throw new Error('Failed to update transaction status')
    }

    console.log('Transaction updated successfully');

    // Update user balance using the RPC function
    console.log('Updating user balance...');
    const { error: balanceError } = await supabaseService.rpc('update_user_balance', {
      user_uuid: user.id,
      amount: transaction.amount,
      currency: transaction.currency || 'INR'
    })

    if (balanceError) {
      console.error('Failed to update balance:', balanceError);
      throw new Error('Payment verified but balance update failed - contact support')
    }

    console.log('User balance updated successfully');
    console.log('=== Payment Verification Completed Successfully ===');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified and balance updated successfully',
        amount: transaction.amount,
        currency: transaction.currency || 'INR'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('=== Payment Verification Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
