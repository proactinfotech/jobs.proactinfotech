import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
}

const OTP_LENGTH = 6;

export function OTPVerification({ email, onBack }: OTPVerificationProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length !== OTP_LENGTH) return;

    setVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "signup",
      });
      if (error) throw error;
      setVerified(true);
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification code resent!");
    }
  };

  if (verified) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-4 font-display text-2xl text-foreground">Email Verified!</h2>
          <p className="mt-2 text-muted-foreground">Your account has been created successfully.</p>
        </motion.div>
      </div>
    );
  }

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-6 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl text-foreground">Verify Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a 6-digit code to <span className="text-foreground">{email}</span>
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={setRef(i)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-12 w-12 rounded-xl border border-border bg-background text-center text-lg font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>

          <Button
            className="mt-8 w-full rounded-xl"
            size="lg"
            disabled={!isComplete || verifying}
            onClick={handleVerify}
          >
            {verifying ? "Verifying..." : "Verify"}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              className="font-medium text-primary hover:text-primary/80"
            >
              Resend
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
