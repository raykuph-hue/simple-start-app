import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PLAN_CONFIG = {
  starter: {
    productId: "prod_Tt6hKxeVoQkVNq",
    sitesLimit: 5,
  },
  pro: {
    productId: "prod_Tt6h8xlz5Otqi5",
    sitesLimit: 999,
  },
};

const FREE_PLAN_RESPONSE = {
  plan: "free",
  subscribed: false,
  sitesLimit: 1,
  hasAds: true,
  hasWatermark: true,
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

/** Safely parse a unix timestamp (seconds) to ISO string. Returns null on failure. */
const safeTimestampToISO = (ts: unknown): string | null => {
  try {
    if (ts === null || ts === undefined) return null;
    const num = Number(ts);
    if (!Number.isFinite(num) || num <= 0) return null;
    const d = new Date(num * 1000);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for Stripe customer
    let customers;
    try {
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
    } catch (e) {
      logStep("Stripe customer lookup failed, returning free plan", { error: String(e) });
      return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (customers.data.length === 0) {
      logStep("No customer found, returning free plan");
      return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscription (Pro plan)
    let subscriptions;
    try {
      subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
    } catch (e) {
      logStep("Subscription lookup failed, returning free plan", { error: String(e) });
      return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const productId = subscription.items?.data?.[0]?.price?.product as string | undefined;
      const subscriptionEnd = safeTimestampToISO(subscription.current_period_end);

      logStep("Active subscription found", { productId, subscriptionEnd });

      // Update profile in database (safe — subscriptionEnd may be null)
      await supabaseClient
        .from("profiles")
        .update({
          plan: "pro",
          subscription_status: "active",
          plan_expires_at: subscriptionEnd,
          sites_limit: PLAN_CONFIG.pro.sitesLimit,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
        })
        .eq("user_id", user.id);

      return new Response(JSON.stringify({
        plan: "pro",
        subscribed: true,
        subscriptionEnd,
        sitesLimit: PLAN_CONFIG.pro.sitesLimit,
        hasAds: false,
        hasWatermark: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check for one-time Starter purchase
    let starterFound = false;
    try {
      const paymentIntents = await stripe.paymentIntents.list({
        customer: customerId,
        limit: 100,
      });

      starterFound = paymentIntents.data.some(
        (pi: { status: string; metadata?: Record<string, string> }) =>
          pi.status === "succeeded" && pi.metadata?.plan === "starter"
      );

      if (!starterFound) {
        const sessions = await stripe.checkout.sessions.list({
          customer: customerId,
          limit: 100,
        });

        starterFound = sessions.data.some(
          (s: { payment_status: string; metadata?: Record<string, string> | null }) =>
            s.payment_status === "paid" && s.metadata?.plan === "starter"
        );
      }
    } catch (e) {
      logStep("Starter check failed, returning free plan", { error: String(e) });
    }

    if (starterFound) {
      logStep("Starter plan purchase found");

      await supabaseClient
        .from("profiles")
        .update({
          plan: "starter",
          subscription_status: "active",
          sites_limit: PLAN_CONFIG.starter.sitesLimit,
          stripe_customer_id: customerId,
        })
        .eq("user_id", user.id);

      return new Response(JSON.stringify({
        plan: "starter",
        subscribed: true,
        sitesLimit: PLAN_CONFIG.starter.sitesLimit,
        hasAds: false,
        hasWatermark: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Default to free plan
    logStep("No paid plan found, returning free");
    return new Response(JSON.stringify(FREE_PLAN_RESPONSE), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    // NEVER return 500 — always return a safe fallback
    return new Response(JSON.stringify({
      ...FREE_PLAN_RESPONSE,
      error: errorMessage,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
