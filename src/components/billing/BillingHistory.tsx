import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  FileText,
  CreditCard,
  Calendar,
  DollarSign,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  created_at: string;
  pdf_url?: string;
}

interface BillingHistoryProps {
  subscriptionStatus: string;
  planName: string;
  planExpiresAt: string | null;
}

// Mock data - in production, fetch from Stripe via edge function
const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv_001",
    number: "INV-2026-001",
    amount: 2900,
    currency: "usd",
    status: "paid",
    created_at: "2026-01-15T10:00:00Z",
    pdf_url: "#",
  },
  {
    id: "inv_002",
    number: "INV-2025-012",
    amount: 2900,
    currency: "usd",
    status: "paid",
    created_at: "2025-12-15T10:00:00Z",
    pdf_url: "#",
  },
];

export const BillingHistory = ({ subscriptionStatus, planName, planExpiresAt }: BillingHistoryProps) => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingRefund, setIsRequestingRefund] = useState(false);

  const handleRefreshInvoices = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from Stripe via edge function
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Invoices refreshed");
    } catch (error) {
      toast.error("Failed to refresh invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.pdf_url) {
      toast.success("Invoice download started");
      // In production, this would open the actual PDF
    }
  };

  const handleRequestRefund = async () => {
    setIsRequestingRefund(true);
    try {
      // In production, this would create a support ticket or Stripe refund request
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Refund request submitted. We'll be in touch within 24 hours.");
    } catch (error) {
      toast.error("Failed to submit refund request");
    } finally {
      setIsRequestingRefund(false);
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
      toast.error(error.message || "Failed to open subscription management");
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      paid: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "outline",
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Subscription Overview
          </CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-lg font-semibold capitalize">{planName}</p>
              <Badge variant={subscriptionStatus === "active" ? "default" : "secondary"}>
                {subscriptionStatus}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-lg font-semibold">
                  {planExpiresAt ? formatDate(planExpiresAt) : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Cost</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <p className="text-lg font-semibold">
                  {planName === "pro" ? "$29/mo" : planName === "starter" ? "$15/mo" : "$0"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleManageSubscription} className="btn-secondary">
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
            {subscriptionStatus === "active" && planName !== "free" && (
              <Button
                variant="outline"
                onClick={handleRequestRefund}
                disabled={isRequestingRefund}
              >
                {isRequestingRefund ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Request Refund
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Billing History
              </CardTitle>
              <CardDescription>View and download past invoices</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRefreshInvoices} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No invoices yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{formatDate(invoice.created_at)}</TableCell>
                    <TableCell>{formatAmount(invoice.amount, invoice.currency)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice)}
                        disabled={!invoice.pdf_url}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
