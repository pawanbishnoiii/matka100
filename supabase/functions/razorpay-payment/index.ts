
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
    console.log('Payment request received');

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
      console.error('No user found');
      throw new Error('No user found')
    }

    console.log('User authenticated:', user.id);

    // Get Razorpay credentials from payment_settings using service role
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: settings, error: settingsError } = await supabaseService
      .from('payment_settings')
      .select('razorpay_key_id, razorpay_key_secret')
      .limit(1)
      .single()

    if (settingsError) {
      console.error('Settings error:', settingsError);
      // Create default settings if none exist
      const { error: insertError } = await supabaseService
        .from('payment_settings')
        .insert({
          razorpay_key_id: 'rzp_test_sample',
          razorpay_key_secret: 'sample_secret',
          min_deposit_amount: 10,
          max_deposit_amount: 100000
        });
      
      if (insertError) {
        console.error('Failed to create default settings:', insertError);
      }
      
      throw new Error('Razorpay not configured - please contact admin')
    }

    if (!settings?.razorpay_key_id || !settings?.razorpay_key_secret) {
      throw new Error('Razorpay credentials not configured')
    }

    const { amount, currency = 'INR', receipt, notes }: PaymentRequest = await req.json()

    console.log('Creating Razorpay order for amount:', amount);

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
      const errorText = await orderResponse.text();
      console.error('Razorpay order creation failed:', errorText);
      throw new Error('Failed to create Razorpay order')
    }

    const order = await orderResponse.json()
    console.log('Razorpay order created:', order.id);

    // Store transaction record using service role
    const { error: transactionError } = await supabaseService
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
