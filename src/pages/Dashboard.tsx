import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CustomDomainModal } from "@/components/domain/CustomDomainModal";
import { WebsiteEditor } from "@/components/website/WebsiteEditor";
import { Logo } from "@/components/brand/Logo";
import {
  Plus,
  Globe,
  CreditCard,
  Settings,
  LogOut,
  Loader2,
  ExternalLink,
  Crown,
  Zap,
  Pencil,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  plan: "free" | "starter" | "pro";
  subscription_status: "active" | "cancelled" | "expired" | "pending";
  sites_limit: number;
  sites_created: number;
  plan_expires_at: string | null;
}

interface Website {
  id: string;
  name: string;
  subdomain: string;
  is_published: boolean;
  created_at: string;
  html_content: string | null;
  has_ads: boolean;
  has_watermark: boolean;
}

const Dashboard = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
      checkSubscription();
    }
  }, [user]);

  // Handle payment success/cancel from URL params
  useEffect(() => {
    const payment = searchParams.get("payment");
    const plan = searchParams.get("plan");
    
    if (payment === "success") {
      toast.success(`Successfully upgraded to ${plan || "paid"} plan!`);
      checkSubscription();
      // Clean up URL
      navigate("/dashboard", { replace: true });
    } else if (payment === "cancelled") {
      toast.info("Payment was cancelled");
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, navigate]);

  const fetchData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData as Profile);

      const { data: websitesData, error: websitesError } = await supabase
        .from("websites")
        .select("id, name, subdomain, is_published, created_at, html_content, has_ads, has_watermark")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (websitesError) throw websitesError;
      setWebsites(websitesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async () => {
    setIsCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;
      
      if (data) {
        // Refresh profile data after subscription check
        await fetchData();
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleUpgrade = async (plan: "starter" | "pro") => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      toast.error(error.message || "Failed to open subscription management");
    }
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return;

    try {
      const { error } = await supabase.from("websites").delete().eq("id", websiteId);
      if (error) throw error;

      setWebsites(websites.filter((w) => w.id !== websiteId));
      toast.success("Website deleted");
    } catch (error) {
      toast.error("Failed to delete website");
    }
  };

  const handleEditWebsite = (website: Website) => {
    if (!website.html_content) {
      toast.error("No content to edit");
      return;
    }
    setEditingWebsite(website);
    setShowEditor(true);
  };

  const handleSaveWebsite = async (newHtml: string) => {
    if (!editingWebsite) return;

    try {
      const { error } = await supabase
        .from("websites")
        .update({ html_content: newHtml })
        .eq("id", editingWebsite.id);

      if (error) throw error;

      setWebsites(
        websites.map((w) =>
          w.id === editingWebsite.id ? { ...w, html_content: newHtml } : w
        )
      );
      setShowEditor(false);
      setEditingWebsite(null);
    } catch (error) {
      throw error;
    }
  };

  const handleConnectDomain = (website: Website) => {
    if (profile?.plan !== "pro") {
      toast.error("Custom domains are available on Pro plan only");
      return;
    }
    setSelectedWebsite(website);
    setShowDomainModal(true);
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "pro":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full gradient-primary text-primary-foreground text-sm font-medium">
            <Crown className="w-3 h-3" />
            Pro
          </span>
        );
      case "starter":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            <Zap className="w-3 h-3" />
            Starter
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            Free
          </span>
        );
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Editor Overlay */}
      {showEditor && editingWebsite && (
        <WebsiteEditor
          htmlContent={editingWebsite.html_content || ""}
          onSave={handleSaveWebsite}
          onClose={() => {
            setShowEditor(false);
            setEditingWebsite(null);
          }}
        />
      )}

      {/* Custom Domain Modal */}
      {selectedWebsite && (
        <CustomDomainModal
          isOpen={showDomainModal}
          onClose={() => {
            setShowDomainModal(false);
            setSelectedWebsite(null);
          }}
          websiteId={selectedWebsite.id}
          websiteName={selectedWebsite.name}
          onDomainAdded={fetchData}
        />
      )}

      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" linkTo="/dashboard" />

            <div className="flex items-center gap-4">
              {getPlanBadge(profile?.plan || "free")}
              <Button
                variant="ghost"
                size="icon"
                onClick={checkSubscription}
                disabled={isCheckingSubscription}
              >
                <RefreshCw className={`w-5 h-5 ${isCheckingSubscription ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.name || "Creator"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your AI-generated websites and subscription
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-glass">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Plan</span>
              {getPlanBadge(profile?.plan || "free")}
            </div>
            <p className="text-2xl font-bold capitalize">{profile?.plan || "Free"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.subscription_status === "active" ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="card-glass">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Websites</span>
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">
              {profile?.sites_created || 0} / {profile?.plan === "pro" ? "∞" : profile?.sites_limit || 1}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Sites created</p>
          </div>

          <div className="card-glass">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Next Billing</span>
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">
              {profile?.plan === "pro" && profile?.plan_expires_at
                ? new Date(profile.plan_expires_at).toLocaleDateString()
                : "—"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.plan === "free" ? "No subscription" : "Renewal date"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(profile?.sites_created || 0) >= (profile?.sites_limit || 1) && profile?.plan === "free" ? (
            <Button
              className="btn-primary w-full h-auto py-4 flex flex-col gap-2 opacity-90"
              onClick={() => toast.info("You've reached your free plan limit. Upgrade to create more websites!")}
            >
              <Plus className="w-6 h-6" />
              <span>Upgrade to Create More</span>
            </Button>
          ) : (
            <Link to="/builder">
              <Button className="btn-primary w-full h-auto py-4 flex flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Create New Website</span>
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            className="btn-secondary w-full h-auto py-4 flex flex-col gap-2"
            onClick={handleManageSubscription}
            disabled={profile?.plan === "free"}
          >
            <CreditCard className="w-6 h-6" />
            <span>Manage Subscription</span>
          </Button>

          <Button
            variant="outline"
            className="btn-secondary w-full h-auto py-4 flex flex-col gap-2"
            disabled={profile?.plan !== "pro"}
            onClick={() => {
              if (websites.length > 0) {
                handleConnectDomain(websites[0]);
              } else {
                toast.info("Create a website first");
              }
            }}
          >
            <Globe className="w-6 h-6" />
            <span>Connect Domain</span>
          </Button>

          <Button
            variant="outline"
            className="btn-secondary w-full h-auto py-4 flex flex-col gap-2"
            onClick={() => toast.info("Settings coming soon")}
          >
            <Settings className="w-6 h-6" />
            <span>Settings</span>
          </Button>
        </div>

        {/* Upgrade Banner (for free users) */}
        {profile?.plan === "free" && (
          <div className="gradient-border rounded-xl p-1 mb-8">
            <div className="glass-card rounded-lg p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center glow-sm">
                    <Crown className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Upgrade Your Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Remove ads & watermarks, get more sites, and connect custom domains
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    className="btn-secondary"
                    onClick={() => handleUpgrade("starter")}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Starter $15/mo
                  </Button>
                  <Button className="btn-primary" onClick={() => handleUpgrade("pro")}>
                    <Crown className="w-4 h-4 mr-2" />
                    Pro $29/mo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Starter Upgrade (for starter users) */}
        {profile?.plan === "starter" && (
          <div className="gradient-border rounded-xl p-1 mb-8">
            <div className="glass-card rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center glow-sm">
                  <Crown className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Go Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlimited sites, custom domains, premium templates
                  </p>
                </div>
              </div>
              <Button className="btn-primary" onClick={() => handleUpgrade("pro")}>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}

        {/* Websites List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Websites</h2>
            {(profile?.sites_created || 0) >= (profile?.sites_limit || 1) && profile?.plan === "free" ? (
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => toast.info("You've reached your free plan limit. Upgrade to create more websites!")}>
                <Plus className="w-4 h-4" />
                Upgrade to Add
              </Button>
            ) : (
              <Link to="/builder">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Site
                </Button>
              </Link>
            )}
          </div>

          {websites.length === 0 ? (
            <div className="card-glass text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No websites yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first AI-generated website in minutes
              </p>
              <Link to="/builder">
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Website
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {websites.map((site) => (
                <div key={site.id} className="card-glass group">
                  <div className="aspect-video rounded-lg bg-secondary/50 mb-4 flex items-center justify-center overflow-hidden relative">
                    {site.html_content ? (
                      <iframe
                        srcDoc={site.html_content}
                        className="w-full h-full border-0 pointer-events-none scale-50 origin-top-left"
                        style={{ width: "200%", height: "200%" }}
                        title={site.name}
                      />
                    ) : (
                      <Globe className="w-8 h-8 text-muted-foreground" />
                    )}
                    {/* Overlay badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {site.has_ads && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                          Ads
                        </span>
                      )}
                      {site.has_watermark && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">
                          Watermark
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">{site.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {site.subdomain}.phosify.app
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        site.is_published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {site.is_published ? "Published" : "Draft"}
                    </span>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditWebsite(site)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {profile?.plan === "pro" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleConnectDomain(site)}
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteWebsite(site.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        if (site.html_content) {
                          setEditingWebsite(site);
                          setShowEditor(true);
                        } else {
                          toast.info("This website has no content yet");
                        }
                      }}
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
