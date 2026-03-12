import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Globe,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
  websiteName: string;
  onDomainAdded: () => void;
}

export const CustomDomainModal = ({
  isOpen,
  onClose,
  websiteId,
  websiteName,
  onDomainAdded,
}: CustomDomainModalProps) => {
  const [step, setStep] = useState<"input" | "dns" | "verifying" | "success">("input");
  const [domain, setDomain] = useState("");
  const [domainId, setDomainId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const DNS_RECORDS = {
    aRecord: {
      type: "A",
      name: "@",
      value: "185.158.133.1",
    },
    wwwRecord: {
      type: "A",
      name: "www",
      value: "185.158.133.1",
    },
    txtRecord: {
      type: "TXT",
      name: "_phosify",
      value: `phosify-verify=${websiteId}`,
    },
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmitDomain = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    // Validate domain format
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      toast.error("Please enter a valid domain name");
      return;
    }

    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Save domain to database
      const { data, error } = await supabase
        .from("domains")
        .insert({
          domain: domain.toLowerCase(),
          website_id: websiteId,
          user_id: userData.user.id,
          verification_token: websiteId,
        })
        .select()
        .single();

      if (error) throw error;

      setDomainId(data.id);
      setStep("dns");
    } catch (error: any) {
      console.error("Error adding domain:", error);
      toast.error(error.message || "Failed to add domain");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!domainId) return;

    setStep("verifying");
    try {
      const { data, error } = await supabase.functions.invoke("verify-domain", {
        body: { domainId, domain },
      });

      if (error) throw error;

      if (data.verified) {
        setStep("success");
        onDomainAdded();
      } else {
        toast.error(data.message || "Domain not verified. Please check your DNS settings.");
        setStep("dns");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
      setStep("dns");
    }
  };

  const handleClose = () => {
    setStep("input");
    setDomain("");
    setDomainId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Connect Custom Domain
          </DialogTitle>
          <DialogDescription>
            {step === "input" && "Enter your domain to connect it to your website."}
            {step === "dns" && "Add these DNS records to your domain registrar."}
            {step === "verifying" && "Verifying your domain configuration..."}
            {step === "success" && "Your domain is now connected!"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Enter Domain */}
        {step === "input" && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value.toLowerCase())}
                className="input-field"
              />
              <p className="text-xs text-muted-foreground">
                Enter your domain without http:// or www
              </p>
            </div>
            <Button
              className="w-full btn-primary"
              onClick={handleSubmitDomain}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: DNS Instructions */}
        {step === "dns" && (
          <div className="space-y-4 pt-4">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-sm text-yellow-200">
                  Add these DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* A Record */}
              <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">A Record (Root)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                    Required
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-mono">{DNS_RECORDS.aRecord.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-mono">{DNS_RECORDS.aRecord.name}</p>
                  </div>
                  <div className="flex items-end gap-1">
                    <div className="flex-1">
                      <span className="text-muted-foreground">Value:</span>
                      <p className="font-mono">{DNS_RECORDS.aRecord.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(DNS_RECORDS.aRecord.value, "a")}
                    >
                      {copied === "a" ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* WWW Record */}
              <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">A Record (WWW)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                    Recommended
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-mono">{DNS_RECORDS.wwwRecord.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-mono">{DNS_RECORDS.wwwRecord.name}</p>
                  </div>
                  <div className="flex items-end gap-1">
                    <div className="flex-1">
                      <span className="text-muted-foreground">Value:</span>
                      <p className="font-mono">{DNS_RECORDS.wwwRecord.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(DNS_RECORDS.wwwRecord.value, "www")}
                    >
                      {copied === "www" ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* TXT Record */}
              <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">TXT Record (Verification)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                    Required
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-mono">{DNS_RECORDS.txtRecord.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-mono">{DNS_RECORDS.txtRecord.name}</p>
                  </div>
                  <div className="flex items-end gap-1">
                    <div className="flex-1 min-w-0">
                      <span className="text-muted-foreground">Value:</span>
                      <p className="font-mono text-xs truncate">{DNS_RECORDS.txtRecord.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => copyToClipboard(DNS_RECORDS.txtRecord.value, "txt")}
                    >
                      {copied === "txt" ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              DNS changes can take up to 48 hours to propagate. You can verify again later if needed.
            </p>

            <Button className="w-full btn-primary" onClick={handleVerifyDomain}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verify Domain
            </Button>
          </div>
        )}

        {/* Step 3: Verifying */}
        {step === "verifying" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Checking DNS configuration...</p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Domain Connected!</h3>
              <p className="text-muted-foreground text-sm">
                Your website is now live at{" "}
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {domain}
                </a>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              SSL certificate has been automatically enabled.
            </p>
            <Button className="btn-primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
