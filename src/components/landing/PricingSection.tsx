import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Phosify",
    features: [
      "1 website",
      "Subdomain hosting (site.phosify.app)",
      "Basic AI templates",
      "Community support",
    ],
    limitations: [
      "Includes Phosify branding",
      "Ad-supported",
    ],
    cta: "Get Started Free",
    ctaLink: "/auth?mode=signup&plan=free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$15",
    period: "per month",
    description: "For creators ready to grow",
    features: [
      "Everything in Free",
      "Up to 10 websites",
      "No ads on your sites",
      "Remove Phosify branding",
      "Priority AI generation",
      "Email support",
    ],
    limitations: [],
    cta: "Start Starter",
    ctaLink: "/auth?mode=signup&plan=starter",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals and agencies",
    features: [
      "Everything in Starter",
      "Unlimited websites",
      "Custom domain support",
      "Premium AI templates",
      "Advanced analytics",
      "Priority support",
      "API access",
      "White-label exports",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    ctaLink: "/auth?mode=signup&plan=pro",
    popular: true,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-2 mb-4">
              Simple,{" "}
              <span className="gradient-text-teal">transparent</span>{" "}
              pricing
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Start free, upgrade when you're ready. No hidden fees, no surprises.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                plan.popular
                  ? "gradient-border bg-card glow-md scale-105"
                  : "glass-card hover:glow-sm"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1 rounded-full gradient-primary text-primary-foreground text-sm font-medium">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? 'gradient-text-premium' : ''}`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-5 h-5 shrink-0 mt-0.5 text-center">•</span>
                    <span className="text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={plan.ctaLink}>
                <Button
                  className={`w-full ${plan.popular ? "btn-primary" : "btn-secondary"}`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
