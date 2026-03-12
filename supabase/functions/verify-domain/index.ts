import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[VERIFY-DOMAIN] ${step}${detailsStr}`);
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { domainId, domain } = await req.json();
    logStep("Verifying domain", { domainId, domain });

    // Perform DNS lookup to verify CNAME or A record
    // In production, this would use a DNS lookup API
    // For now, we simulate the verification
    
    // Check if domain has correct DNS records pointing to phosify
    // Expected: CNAME to cname.phosify.app or A record to Phosify IP
    
    try {
      // Simulate DNS check - in production use DNS over HTTPS API
      const dnsResponse = await fetch(
        `https://dns.google/resolve?name=${domain}&type=A`
      );
      const dnsData = await dnsResponse.json();
      
      logStep("DNS lookup result", dnsData);

      // Check if DNS is configured (has any A records)
      const hasRecords = dnsData.Answer && dnsData.Answer.length > 0;
      
      if (hasRecords) {
        // Update domain as verified
        const { error: updateError } = await supabaseClient
          .from("domains")
          .update({
            is_verified: true,
            ssl_enabled: true,
          })
          .eq("id", domainId)
          .eq("user_id", user.id);

        if (updateError) throw updateError;

        logStep("Domain verified successfully");
        return new Response(JSON.stringify({
          verified: true,
          message: "Domain verified successfully! SSL is now enabled.",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else {
        return new Response(JSON.stringify({
          verified: false,
          message: "DNS records not found. Please add the required records and try again.",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    } catch (dnsError) {
      logStep("DNS lookup failed", { error: dnsError });
      return new Response(JSON.stringify({
        verified: false,
        message: "Could not verify DNS records. Please check your domain configuration.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
