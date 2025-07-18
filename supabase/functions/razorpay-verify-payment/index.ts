import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret not configured");
    }

    // Verify signature
    const generatedSignature = createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    const supabaseClient = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: { persistSession: false }
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) throw new Error("Invalid user");

    // Get payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from("razorpay_payments")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment record not found");
    }

    // Update payment status
    await supabaseClient
      .from("razorpay_payments")
      .update({
        razorpay_payment_id,
        status: "captured",
        updated_at: new Date().toISOString()
      })
      .eq("id", payment.id);

    // Update user balance
    const amount = payment.amount / 100; // Convert from paise
    await supabaseClient.rpc("update_user_balance", {
      user_uuid: user.id,
      amount: amount,
      currency: payment.currency
    });

    // Create transaction record
    await supabaseClient.from("transactions").insert({
      user_id: user.id,
      type: "deposit",
      amount: amount,
      currency: payment.currency,
      status: "completed",
      description: `Razorpay payment - ${razorpay_payment_id}`,
      external_id: razorpay_payment_id,
      payment_method: "razorpay"
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Payment verified and balance updated" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});