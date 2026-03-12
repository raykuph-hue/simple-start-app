import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="section-container py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-2 mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 31, 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-muted-foreground">
                We want you to be completely satisfied with your purchase. This Refund Policy 
                outlines our guidelines for refunds on our subscription plans and one-time purchases.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Starter Plan ($0.99 One-Time)</h2>
              <p className="text-muted-foreground mb-4">
                The Starter plan is a one-time purchase that removes ads and watermarks from your websites.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Refunds are available within 7 days of purchase</li>
                <li>You must not have published any websites after the upgrade</li>
                <li>Refunds will be processed to your original payment method</li>
                <li>Processing time: 5-10 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Pro Plan ($9/month Subscription)</h2>
              <p className="text-muted-foreground mb-4">
                The Pro plan is a monthly subscription with advanced features.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Cancel anytime through your dashboard - no questions asked</li>
                <li>Cancellation takes effect at the end of your billing period</li>
                <li>Prorated refunds are available within 48 hours of billing for unused time</li>
                <li>No refunds for partial months after the 48-hour window</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">How to Request a Refund</h2>
              <p className="text-muted-foreground mb-4">To request a refund:</p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Email us at <a href="mailto:billing@phosify.app" className="text-primary hover:underline">billing@phosify.app</a></li>
                <li>Include your account email and order/subscription ID</li>
                <li>Briefly explain the reason for your refund request</li>
                <li>We will respond within 1-2 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Exceptions</h2>
              <p className="text-muted-foreground mb-4">Refunds may not be available if:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Your account has been terminated for Terms of Service violations</li>
                <li>You have previously received a refund on the same product</li>
                <li>The refund request is outside the eligible timeframe</li>
                <li>There is evidence of abuse or fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Subscription Cancellation</h2>
              <p className="text-muted-foreground mb-4">
                You can cancel your Pro subscription at any time:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Go to your Dashboard</li>
                <li>Click "Manage Subscription"</li>
                <li>Select "Cancel Subscription"</li>
                <li>Your access continues until the end of the billing period</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Downgrades</h2>
              <p className="text-muted-foreground">
                If you downgrade from Pro to a lower tier, you will retain Pro features until 
                the end of your current billing period. No prorated refunds are provided for 
                voluntary downgrades.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                For billing questions or refund requests, contact us at{" "}
                <a href="mailto:billing@phosify.app" className="text-primary hover:underline">
                  billing@phosify.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Refund;
