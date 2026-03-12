import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  totalSites: number;
  proSubscriptions: number;
}

interface AdminUser {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  plan: string;
  subscription_status: string;
  sites_created: number;
  sites_limit: number;
  is_suspended: boolean;
  ads_disabled: boolean;
  created_at: string;
}

interface AdminSite {
  id: string;
  name: string;
  subdomain: string;
  is_published: boolean;
  has_ads: boolean;
  has_watermark: boolean;
  created_at: string;
  user_id: string;
}

interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  target_user_id: string | null;
  target_website_id: string | null;
  details: any;
  created_at: string;
}

export const useAdminApi = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const callAdminApi = useCallback(async (action: string, params: Record<string, any> = {}) => {
    const { data, error } = await supabase.functions.invoke("admin-api", {
      body: { action, ...params },
    });

    if (error) {
      throw new Error(error.message || "Admin API error");
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return data;
  }, []);

  const checkAdminAccess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin access:", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  const getStats = useCallback(async (): Promise<AdminStats> => {
    return callAdminApi("get_stats");
  }, [callAdminApi]);

  const listUsers = useCallback(async (page = 1, limit = 20, search = ""): Promise<{ users: AdminUser[]; total: number }> => {
    return callAdminApi("list_users", { page, limit, search });
  }, [callAdminApi]);

  const listSites = useCallback(async (page = 1, limit = 20, userId?: string): Promise<{ sites: AdminSite[]; total: number }> => {
    return callAdminApi("list_sites", { page, limit, userId });
  }, [callAdminApi]);

  const suspendUser = useCallback(async (targetUserId: string, suspended: boolean) => {
    const result = await callAdminApi("suspend_user", { targetUserId, suspended });
    toast.success(suspended ? "User suspended" : "User unsuspended");
    return result;
  }, [callAdminApi]);

  const toggleUserAds = useCallback(async (targetUserId: string, adsDisabled: boolean) => {
    const result = await callAdminApi("toggle_user_ads", { targetUserId, adsDisabled });
    toast.success(adsDisabled ? "Ads disabled for user" : "Ads enabled for user");
    return result;
  }, [callAdminApi]);

  const deleteSite = useCallback(async (siteId: string) => {
    const result = await callAdminApi("delete_site", { siteId });
    toast.success("Site deleted");
    return result;
  }, [callAdminApi]);

  const getAuditLogs = useCallback(async (page = 1, limit = 50): Promise<{ logs: AuditLog[]; total: number }> => {
    return callAdminApi("get_audit_logs", { page, limit });
  }, [callAdminApi]);

  return {
    isAdmin,
    isLoading,
    getStats,
    listUsers,
    listSites,
    suspendUser,
    toggleUserAds,
    deleteSite,
    getAuditLogs,
  };
};
