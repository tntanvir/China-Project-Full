"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/services/auth.service";
import { getRoleDashboardPath } from "@/lib/auth-routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const red = params.get("redirect");
      if (red) setRedirectUrl(red);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const user = await AuthService.login(formData);
      login(user);
      toast.success("Login successful. Welcome back!");
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || getRoleDashboardPath(user?.role);
      router.replace(redirect);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in. Please verify your credentials.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role: "admin" | "customer") => {
    if (role === "admin") {
      setFormData({ email: "admin@example.com", password: "securepassword123" });
    } else {
      setFormData({ email: "customer@syspcb.com", password: "Password123!" });
    }
    setErrorMsg("");
    toast.info(`Filled ${role} demo credentials.`);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <div className="relative mb-3 flex size-20 items-center justify-center rounded-3xl border border-emerald-500/30 bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 p-2.5 shadow-2xl shadow-emerald-950/60 backdrop-blur-md">
          <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-xl" />
          <Image
            src="/image/chinaproject.png"
            alt="FT PCB Logo"
            width={58}
            height={58}
            className="relative z-10 object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Feitian Electronics Gateway
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">FT PCB</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Sign in to access your manufacturing portal, CAM engineering review, and active orders.
        </p>
      </div>

      {/* Main Login Card - Unified Single Background */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0b1220] shadow-2xl shadow-black/80">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-90" />

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="px-6 pt-6">
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#070b14] rounded-2xl border border-slate-800/80">
            <button
              type="button"
              className="py-2.5 rounded-xl font-black text-xs bg-emerald-600 text-white shadow-md shadow-emerald-950/50 transition cursor-default"
            >
              Sign In
            </button>
            <Link
              href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
              className="py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition text-center flex items-center justify-center cursor-pointer"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Quote In Progress Banner */}
        {redirectUrl?.includes("resumeQuote") && (
          <div className="mx-6 mt-4 flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            <Sparkles className="size-4 shrink-0 text-emerald-400 animate-pulse" />
            <div className="leading-tight">
              <strong className="block font-bold">Quote In Progress</strong>
              <span className="text-[11px] text-emerald-400/90">
                Sign in to automatically finalize your quote & connect directly to payment.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 px-6 sm:px-8 pt-5 pb-7">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="email">
              <Mail className="size-3.5 text-emerald-400" />
              <span>Email Address</span>
            </label>
            <div className="relative group">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="engineer@company.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-sm font-medium transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="password">
                <Lock className="size-3.5 text-emerald-400" />
                <span>Password</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="h-12 pr-11 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-sm font-medium transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-700 bg-slate-950 accent-emerald-500 focus:ring-emerald-500/40"
              />
              <span>Remember me on this browser</span>
            </label>

            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-400" />
              TLS 1.3
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 animate-in fade-in">
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons & Links */}
          <div className="flex flex-col space-y-4 pt-3">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-950/60 gap-2 cursor-pointer transition active:scale-[0.99]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            {/* Demo Quick Fill for testing convenience */}
            <div className="w-full text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>Quick Test:</span>
                <button
                  type="button"
                  onClick={() => handleFillDemo("customer")}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold transition cursor-pointer"
                >
                  Customer Demo
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => handleFillDemo("admin")}
                  className="text-teal-400 hover:text-teal-300 hover:underline font-semibold transition cursor-pointer"
                >
                  Admin Demo
                </button>
              </div>
            </div>

            <div className="text-center text-xs font-medium text-slate-400 pt-1">
              Don&apos;t have an account yet?{" "}
              <Link
                href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors hover:underline"
              >
                Create Account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
