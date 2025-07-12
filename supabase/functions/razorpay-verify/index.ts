
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.190.0/node/crypto.ts"

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
    console.log('=== Razorpay Payment Verification Started ===');

    // Create Supabase client for user authentication
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
      error: authError
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('Authentication required')
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const requestBody = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyRequest = requestBody;

    console.log('Verification data:', { razorpay_order_id, razorpay_payment_id });

    // Use service role to access all data
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get Razorpay credentials
    const { data: settings, error: settingsError } = await supabaseService
      .from('payment_settings')
      .select('razorpay_key_secret')
      .limit(1)
      .single()

    if (settingsError || !settings?.razorpay_key_secret) {
      console.error('Settings error:', settingsError);
      throw new Error('Razorpay configuration not found')
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', settings.razorpay_key_secret)
      .update(body)
      .digest('hex');

    console.log('Signature verification:', { 
      received: razorpay_signature, 
      expected: expectedSignature,
      match: razorpay_signature === expectedSignature 
    });

    if (razorpay_signature !== expectedSignature) {
      console.error('Signature verification failed');
      
      // Mark transaction as failed
      await supabaseService
        .from('transactions')
        .update({
          status: 'failed',
          metadata: {
            error: 'Signature verification failed',
            verification_failed_at: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('external_id', razorpay_order_id)
        .eq('user_id', user.id);

      throw new Error('Payment verification failed - invalid signature')
    }

    // Find the transaction
    const { data: transaction, error: transactionError } = await supabaseService
      .from('transactions')
      .select('*')
      .eq('external_id', razorpay_order_id)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single()

    if (transactionError || !transaction) {
      console.error('Transaction not found:', transactionError);
      throw new Error('Transaction not found or already processed')
    }

    console.log('Transaction found:', transaction.id, 'Amount:', transaction.amount);

    // Update transaction to completed
    const { error: updateError } = await supabaseService
      .from('transactions')
      .update({
        status: 'completed',
        metadata: {
          ...transaction.metadata,
          razorpay_payment_id,
          verified_at: new Date().toISOString(),
          signature_verified: true
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      throw new Error('Failed to update transaction status')
    }

    // Update user balance instantly
    const balanceUpdateResult = await supabaseService.rpc('update_user_balance', {
      user_uuid: user.id,
      amount: transaction.amount,
      currency: transaction.currency || 'INR'
    });

    console.log('Balance update result:', balanceUpdateResult);

    if (!balanceUpdateResult.data) {
      console.error('Failed to update user balance');
      // Rollback transaction status
      await supabaseService
        .from('transactions')
        .update({ status: 'pending' })
        .eq('id', transaction.id);
      
      throw new Error('Failed to update user balance')
    }

    console.log('Payment verified and balance updated successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified successfully',
        transaction_id: transaction.id,
        amount: transaction.amount,
        balance_updated: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('=== Payment Verification Error ===');
    console.error('Error:', error?.message);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error?.message || 'Payment verification failed',
        timestamp: new Date().toISOString()
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
