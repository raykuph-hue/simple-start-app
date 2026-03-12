import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="section-container py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-2 mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 31, 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Phosify.app ("the Service"), you agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Phosify.app is an AI-powered website builder platform that allows users to create, 
                edit, and publish websites. We offer various subscription tiers with different 
                features and limitations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">To use our Service, you must:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Be at least 13 years of age</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Subscription and Payments</h2>
              <p className="text-muted-foreground mb-4">
                We offer free and paid subscription plans. By subscribing to a paid plan:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You authorize us to charge your payment method on a recurring basis</li>
                <li>Prices may change with 30 days notice</li>
                <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
                <li>Refunds are subject to our Refund Policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. User Content</h2>
              <p className="text-muted-foreground mb-4">
                You retain ownership of content you create using our Service. However, you grant us 
                a license to host, store, and display your content as necessary to provide the Service.
              </p>
              <p className="text-muted-foreground">You agree not to create content that:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Violates any law or regulation</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware or harmful code</li>
                <li>Is defamatory, obscene, or offensive</li>
                <li>Promotes illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Prohibited Activities</h2>
              <p className="text-muted-foreground mb-4">You may not:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Circumvent any limitations on your account</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Use automated tools to access the Service excessively</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service, including its design, features, and code, is owned by Phosify and 
                protected by copyright and trademark laws. You may not copy, modify, or distribute 
                our intellectual property without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PHOSIFY SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account at any time for violations of these Terms. 
                Upon termination, your right to use the Service ceases immediately. You may cancel 
                your account at any time through your dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes via email or through the Service. Continued use after changes 
                constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@phosify.app" className="text-primary hover:underline">
                  legal@phosify.app
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

export default Terms;
