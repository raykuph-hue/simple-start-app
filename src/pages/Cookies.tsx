import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="section-container py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-2 mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 31, 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">What Are Cookies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device 
                when you visit a website. They are widely used to make websites work more efficiently 
                and provide information to the owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">We use cookies for the following purposes:</p>
              
              <h3 className="text-lg font-medium mt-6 mb-3">Essential Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are necessary for the website to function properly. They enable core 
                functionality such as security, network management, and accessibility.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">Authentication Cookies</h3>
              <p className="text-muted-foreground mb-4">
                We use cookies to identify you when you visit our website and as you navigate our 
                website. This helps us provide you with a personalized experience.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">Analytics Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies help us understand how visitors interact with our website by collecting 
                and reporting information anonymously.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">Preference Cookies</h3>
              <p className="text-muted-foreground">
                These cookies enable the website to remember information that changes the way the 
                website behaves or looks, like your preferred language or theme.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Cookie Name</th>
                      <th className="text-left py-3 px-4">Purpose</th>
                      <th className="text-left py-3 px-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">sb-auth-token</td>
                      <td className="py-3 px-4">Authentication</td>
                      <td className="py-3 px-4">Session</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">theme</td>
                      <td className="py-3 px-4">User preferences</td>
                      <td className="py-3 px-4">1 year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">_ga</td>
                      <td className="py-3 px-4">Analytics</td>
                      <td className="py-3 px-4">2 years</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">cookie_consent</td>
                      <td className="py-3 px-4">Cookie preferences</td>
                      <td className="py-3 px-4">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                In addition to our own cookies, we may also use various third-party cookies to 
                report usage statistics, deliver advertisements, and so on. These include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Google Analytics - for website analytics</li>
                <li>Stripe - for payment processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>View cookies stored on your computer</li>
                <li>Delete all or specific cookies</li>
                <li>Block all cookies or specific types</li>
                <li>Set preferences for certain websites</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Please note that blocking all cookies may affect your experience on our website 
                and limit certain features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Your Consent</h2>
              <p className="text-muted-foreground">
                By continuing to use our website, you consent to our use of cookies as described 
                in this policy. You can withdraw your consent at any time by clearing cookies from 
                your browser or adjusting your cookie preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@phosify.app" className="text-primary hover:underline">
                  privacy@phosify.app
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

export default Cookies;
