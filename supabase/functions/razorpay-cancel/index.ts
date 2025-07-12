
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CancelRequest {
  order_id: string;
  reason?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Payment Cancellation Started ===');

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
      throw new Error('Authentication required')
    }

    const requestBody = await req.json();
    const { order_id, reason = 'cancelled_by_user' }: CancelRequest = requestBody;

    console.log('Cancelling payment for order:', order_id);

    // Use service role to update transaction
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find and cancel the transaction
    const { data: transaction, error: findError } = await supabaseService
      .from('transactions')
      .select('*')
      .eq('external_id', order_id)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single()

    if (findError || !transaction) {
      console.log('Transaction not found or already processed');
      return new Response(
        JSON.stringify({ success: true, message: 'Transaction not found or already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update transaction status to cancelled
    const { error: updateError } = await supabaseService
      .from('transactions')
      .update({
        status: 'cancelled',
        metadata: {
          ...transaction.metadata,
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id)

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      throw new Error('Failed to cancel transaction')
    }

    console.log('Transaction cancelled successfully:', transaction.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment cancelled successfully',
        transaction_id: transaction.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('=== Payment Cancellation Error ===');
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
