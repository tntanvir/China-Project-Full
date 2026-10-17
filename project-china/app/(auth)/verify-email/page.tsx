"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.verifyOtp({ email, otp });
      toast.success("Email verified successfully. You can login now.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await AuthService.resendOtp(email);
      toast.success("OTP resent successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process resend request.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="border-border/70 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Verify Your Email</CardTitle>
        <CardDescription>Enter the 6-digit OTP sent to {email || "your email address"}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 flex justify-center py-4">
          <InputOTP maxLength={6} value={otp} onChange={(value: string) => setOtp(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <Button type="submit" className="w-full" disabled={loading || !email || otp.length !== 6}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
          <div className="flex items-center justify-between w-full text-sm">
            <Button type="button" variant="ghost" onClick={handleResend} disabled={resending || !email} className="text-primary hover:text-primary/80 px-0">
              {resending ? "Resending..." : "Resend OTP"}
            </Button>
            <Link href="/login" className="text-muted-foreground hover:underline">Back to Login</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={
      <Card className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></Card>
    }>
      <VerifyEmailForm />
    </React.Suspense>
  );
}
