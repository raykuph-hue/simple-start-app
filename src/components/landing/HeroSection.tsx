import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Globe, Sparkles, Play, CheckCircle } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.png";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-glow opacity-60" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      
      {/* Floating Orbs with premium colors */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-primary/15 to-purple-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-glow-secondary/10 to-pink-500/10 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-teal-500/10 to-cyan-500/10 blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />

      <div className="section-container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Website Builder</span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
              New
            </span>
          </div>

          {/* Headline with premium gradient */}
          <h1 className="heading-1 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Build{" "}
            <span className="gradient-text-premium glow-text">Stunning Websites</span>
            <br className="hidden sm:block" />{" "}
            in Minutes with AI
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up text-balance" style={{ animationDelay: '0.2s' }}>
            No coding required. Just describe your vision, and watch AI create a beautiful, 
            professional website tailored to your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="btn-primary text-lg px-8 py-6 group">
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/gallery">
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-6 gap-2">
                <Play className="w-4 h-4" />
                View Templates
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              Free hosting included
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              Launch in 2 minutes
            </div>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Instant AI Generation</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-foreground">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Custom Domains</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">50+ Premium Templates</span>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="gradient-border rounded-2xl p-1">
              <div className="glass-card rounded-xl overflow-hidden glow-lg">
                <div className="aspect-video bg-secondary/30 relative">
                  <img 
                    src={heroMockup} 
                    alt="Phosify Website Builder Dashboard" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Floating UI Elements */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    <div className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Live Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -left-4 top-1/4 w-24 h-24 rounded-xl glass-card p-3 hidden lg:block animate-float">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="absolute -right-4 top-1/3 w-20 h-20 rounded-xl glass-card p-2 hidden lg:block animate-float" style={{ animationDelay: '-2s' }}>
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
