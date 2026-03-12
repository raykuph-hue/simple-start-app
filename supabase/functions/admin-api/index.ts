import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-API] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    
    const userId = userData.user?.id;
    if (!userId) throw new Error("User not found");

    logStep("User authenticated", { userId });

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      throw new Error("Unauthorized: Admin access required");
    }

    logStep("Admin verified");

    // Parse request
    const { action, ...params } = await req.json();
    logStep("Action requested", { action });

    let result;

    switch (action) {
      case "get_stats": {
        // Get overview stats
        const [usersResult, sitesResult, proUsersResult] = await Promise.all([
          supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
          supabaseAdmin.from("websites").select("id", { count: "exact", head: true }),
          supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
        ]);

        result = {
          totalUsers: usersResult.count || 0,
          totalSites: sitesResult.count || 0,
          proSubscriptions: proUsersResult.count || 0,
        };
        break;
      }

      case "list_users": {
        const { page = 1, limit = 20, search = "" } = params;
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
          .from("profiles")
          .select("id, user_id, name, email, plan, subscription_status, sites_created, sites_limit, is_suspended, ads_disabled, created_at", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (search) {
          query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { data, count, error } = await query;
        if (error) throw error;

        result = { users: data, total: count };
        break;
      }

      case "list_sites": {
        const { page = 1, limit = 20, userId: filterUserId } = params;
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
          .from("websites")
          .select("id, name, subdomain, is_published, has_ads, has_watermark, created_at, user_id", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (filterUserId) {
          query = query.eq("user_id", filterUserId);
        }

        const { data, count, error } = await query;
        if (error) throw error;

        result = { sites: data, total: count };
        break;
      }

      case "suspend_user": {
        const { targetUserId, suspended } = params;
        
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ is_suspended: suspended })
          .eq("user_id", targetUserId);

        if (error) throw error;

        // Log audit
        await supabaseAdmin.from("admin_audit_logs").insert({
          admin_user_id: userId,
          action: suspended ? "suspend_user" : "unsuspend_user",
          target_user_id: targetUserId,
        });

        result = { success: true };
        break;
      }

      case "toggle_user_ads": {
        const { targetUserId, adsDisabled } = params;
        
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ ads_disabled: adsDisabled })
          .eq("user_id", targetUserId);

        if (error) throw error;

        // Log audit
        await supabaseAdmin.from("admin_audit_logs").insert({
          admin_user_id: userId,
          action: adsDisabled ? "disable_user_ads" : "enable_user_ads",
          target_user_id: targetUserId,
        });

        result = { success: true };
        break;
      }

      case "delete_site": {
        const { siteId } = params;
        
        // Get site info first for audit
        const { data: siteData } = await supabaseAdmin
          .from("websites")
          .select("user_id, name")
          .eq("id", siteId)
          .single();

        const { error } = await supabaseAdmin
          .from("websites")
          .delete()
          .eq("id", siteId);

        if (error) throw error;

        // Log audit
        await supabaseAdmin.from("admin_audit_logs").insert({
          admin_user_id: userId,
          action: "delete_site",
          target_user_id: siteData?.user_id,
          target_website_id: siteId,
          details: { site_name: siteData?.name },
        });

        result = { success: true };
        break;
      }

      case "get_audit_logs": {
        const { page = 1, limit = 50 } = params;
        const offset = (page - 1) * limit;

        const { data, count, error } = await supabaseAdmin
          .from("admin_audit_logs")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        result = { logs: data, total: count };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    logStep("Action completed", { action });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: message.includes("Unauthorized") ? 403 : 500,
    });
  }
});
