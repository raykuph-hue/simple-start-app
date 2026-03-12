import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSubmitted(true);
        toast.success("Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Back to Sign In */}
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          {/* Logo */}
          <div className="mb-8">
            <Logo size="lg" linkTo="/" />
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center glow-md">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Check your email</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Click the link in the email to reset your password.
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full btn-secondary"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try a different email
                </Button>
                <Link to="/auth" className="block">
                  <Button className="w-full btn-primary">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
                <p className="text-muted-foreground">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="btn-primary w-full py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <p className="text-center mt-6 text-muted-foreground">
                Remember your password?{" "}
                <Link to="/auth" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-20" />
        <div className="absolute inset-0 bg-hero-glow opacity-80" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
        
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl overflow-hidden glow-lg">
              <img src="/logo.png" alt="Phosify" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Secure Password Reset</h2>
            <p className="text-muted-foreground text-lg">
              We'll help you get back into your account safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
