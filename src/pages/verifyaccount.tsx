import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your account...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("No verification token found.");
      setIsError(true);
      return;
    }

    const verify = async () => {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "signup",
      });
      if (error) {
        setMessage("Activation failed: " + error.message);
        setIsError(true);
      } else {
        setMessage("Account activated! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        {!isError && <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />}
        <p className={isError ? "text-destructive" : "text-foreground"}>{message}</p>
      </div>
    </div>
  );
};

export default VerifyAccount;
