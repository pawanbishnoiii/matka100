
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
    console.log('=== Razorpay Payment Request Started ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);

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

    console.log('User authenticated successfully:', user.id);

    // Get Razorpay credentials from payment_settings using service role
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('Fetching payment settings...');
    const { data: settings, error: settingsError } = await supabaseService
      .from('payment_settings')
      .select('razorpay_key_id, razorpay_key_secret, min_deposit_amount, max_deposit_amount')
      .limit(1)
      .single()

    if (settingsError) {
      console.error('Settings fetch error:', settingsError);
      // Create default settings if none exist
      if (settingsError.code === 'PGRST116') {
        console.log('Creating default payment settings...');
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
          throw new Error('Payment system not configured - please contact admin')
        }
        
        throw new Error('Payment system being configured - please try again in a moment')
      }
      throw new Error('Failed to fetch payment configuration')
    }

    if (!settings?.razorpay_key_id || !settings?.razorpay_key_secret) {
      console.error('Razorpay credentials missing:', { 
        hasKeyId: !!settings?.razorpay_key_id, 
        hasSecret: !!settings?.razorpay_key_secret 
      });
      throw new Error('Razorpay credentials not configured - please contact admin')
    }

    console.log('Payment settings loaded successfully');

    const requestBody = await req.json();
    console.log('Request body received:', { ...requestBody, amount: requestBody.amount });

    const { amount, currency = 'INR', receipt, notes }: PaymentRequest = requestBody;

    // Validate amount
    if (!amount || amount < (settings.min_deposit_amount || 10)) {
      throw new Error(`Minimum deposit amount is ₹${settings.min_deposit_amount || 10}`)
    }

    if (amount > (settings.max_deposit_amount || 100000)) {
      throw new Error(`Maximum deposit amount is ₹${settings.max_deposit_amount || 100000}`)
    }

    console.log('Creating Razorpay order for amount:', amount);

    // Create Razorpay order
    const razorpayAuth = btoa(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`)
    
    const orderPayload = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || { purpose: 'Wallet deposit' },
    };

    console.log('Razorpay order payload:', orderPayload);

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    console.log('Razorpay API response status:', orderResponse.status);

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Razorpay order creation failed:', {
        status: orderResponse.status,
        statusText: orderResponse.statusText,
        error: errorText
      });
      
      if (orderResponse.status === 401) {
        throw new Error('Invalid Razorpay credentials - please check configuration')
      } else if (orderResponse.status === 400) {
        throw new Error('Invalid payment parameters - please check amount and currency')
      } else {
        throw new Error(`Razorpay API error: ${orderResponse.statusText}`)
      }
    }

    const order = await orderResponse.json()
    console.log('Razorpay order created successfully:', { 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });

    // Store transaction record using service role
    console.log('Creating transaction record...');
    const { error: transactionError } = await supabaseService
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'deposit',
        amount: amount,
        currency,
        status: 'pending',
        external_id: order.id,
        payment_method: 'razorpay',
        description: 'Razorpay deposit',
        metadata: { 
          order,
          user_email: user.email,
          created_via: 'razorpay_payment_function'
        }
      })

    if (transactionError) {
      console.error('Transaction insert error:', transactionError)
      // Don't fail the payment for this, just log it
    } else {
      console.log('Transaction record created successfully');
    }

    const responseData = {
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: settings.razorpay_key_id,
      receipt: order.receipt
    };

    console.log('=== Payment Request Completed Successfully ===');

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('=== Razorpay Payment Error ===');
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
