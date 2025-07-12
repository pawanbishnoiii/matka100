
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
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

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

    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    if (!user) {
      console.error('No user found in JWT');
      throw new Error('Authentication required - no user found')
    }

    console.log('User authenticated successfully:', user.id, user.email);

    // Get Razorpay credentials from payment_settings using service role
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('Fetching payment settings from database...');
    const { data: settings, error: settingsError } = await supabaseService
      .from('payment_settings')
      .select('razorpay_key_id, razorpay_key_secret, min_deposit_amount, max_deposit_amount')
      .limit(1)
      .single()

    if (settingsError) {
      console.error('Settings fetch error:', settingsError);
      
      // If no settings exist, create default ones
      if (settingsError.code === 'PGRST116') {
        console.log('No payment settings found, creating default settings...');
        const { error: insertError } = await supabaseService
          .from('payment_settings')
          .insert({
            razorpay_key_id: '',
            razorpay_key_secret: '',
            min_deposit_amount: 10,
            max_deposit_amount: 100000,
            withdrawal_fee_percentage: 2
          });
        
        if (insertError) {
          console.error('Failed to create default settings:', insertError);
        }
        
        throw new Error('Razorpay credentials not configured. Please configure them in the admin panel first.')
      }
      
      throw new Error(`Failed to fetch payment settings: ${settingsError.message}`)
    }

    console.log('Payment settings loaded:', { 
      hasKeyId: !!settings?.razorpay_key_id, 
      hasSecret: !!settings?.razorpay_key_secret,
      keyIdLength: settings?.razorpay_key_id?.length,
      minAmount: settings?.min_deposit_amount,
      maxAmount: settings?.max_deposit_amount
    });

    if (!settings?.razorpay_key_id || !settings?.razorpay_key_secret) {
      console.error('Razorpay credentials missing in database');
      throw new Error('Razorpay credentials not configured. Please add your Razorpay Key ID and Secret in the admin panel.')
    }

    if (!settings.razorpay_key_id.startsWith('rzp_')) {
      console.error('Invalid Razorpay Key ID format:', settings.razorpay_key_id);
      throw new Error('Invalid Razorpay Key ID format. It should start with "rzp_"')
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed:', { ...requestBody, amount: requestBody?.amount });
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      throw new Error('Invalid JSON in request body')
    }

    const { amount, currency = 'INR', receipt, notes }: PaymentRequest = requestBody;

    // Validate required fields
    if (!amount || typeof amount !== 'number') {
      throw new Error('Valid amount is required')
    }

    if (amount < (settings.min_deposit_amount || 10)) {
      throw new Error(`Minimum deposit amount is ₹${settings.min_deposit_amount || 10}`)
    }

    if (amount > (settings.max_deposit_amount || 100000)) {
      throw new Error(`Maximum deposit amount is ₹${settings.max_deposit_amount || 100000}`)
    }

    console.log('Creating Razorpay order for amount:', amount, 'currency:', currency);

    // Create Razorpay order
    const razorpayAuth = btoa(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`)
    
    const orderPayload = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency: currency.toUpperCase(),
      receipt: receipt || `receipt_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        user_email: user.email,
        purpose: 'Wallet deposit',
        created_via: 'razorpay_payment_function',
        ...(notes || {})
      },
    };

    console.log('Razorpay order payload:', { 
      ...orderPayload, 
      amount: `${orderPayload.amount} paise (₹${amount})` 
    });

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    console.log('Razorpay API response status:', orderResponse.status);
    console.log('Razorpay API response headers:', Object.fromEntries(orderResponse.headers.entries()));

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Razorpay order creation failed:', {
        status: orderResponse.status,
        statusText: orderResponse.statusText,
        error: errorText,
        keyId: settings.razorpay_key_id.substring(0, 10) + '...'
      });
      
      if (orderResponse.status === 401) {
        throw new Error('Invalid Razorpay credentials. Please check your Key ID and Secret in the admin panel.')
      } else if (orderResponse.status === 400) {
        let errorMessage = 'Invalid payment parameters';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.description || errorJson.error?.field || errorMessage;
        } catch (e) {
          // Use default message if JSON parsing fails
        }
        throw new Error(`Razorpay API error: ${errorMessage}`)
      } else if (orderResponse.status >= 500) {
        throw new Error('Razorpay service is temporarily unavailable. Please try again later.')
      } else {
        throw new Error(`Razorpay API error (${orderResponse.status}): ${errorText}`)
      }
    }

    const order = await orderResponse.json()
    console.log('Razorpay order created successfully:', { 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      status: order.status
    });

    // Store transaction record using service role
    console.log('Creating transaction record...');
    const { error: transactionError } = await supabaseService
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'deposit',
        amount: amount,
        currency: currency.toUpperCase(),
        status: 'pending',
        external_id: order.id,
        payment_method: 'razorpay',
        description: `Razorpay deposit - Order: ${order.id}`,
        metadata: { 
          razorpay_order: order,
          user_email: user.email,
          created_via: 'razorpay_payment_function',
          request_timestamp: new Date().toISOString()
        }
      })

    if (transactionError) {
      console.error('Transaction insert error:', transactionError)
      // Don't fail the payment for this, just log it
      console.log('Continuing despite transaction record error...')
    } else {
      console.log('Transaction record created successfully');
    }

    const responseData = {
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: settings.razorpay_key_id,
      receipt: order.receipt,
      created_at: order.created_at,
      status: order.status
    };

    console.log('=== Payment Request Completed Successfully ===');
    console.log('Response data:', { ...responseData, key: responseData.key?.substring(0, 10) + '...' });

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('=== Razorpay Payment Error ===');
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Error details:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error?.message || 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        debug: {
          hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
          hasSupabaseAnonKey: !!Deno.env.get('SUPABASE_ANON_KEY'),
          hasSupabaseServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        }
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
