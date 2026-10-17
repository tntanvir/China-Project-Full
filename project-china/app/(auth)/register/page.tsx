"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";
import { CountryPhoneSelect, allCountryCodes } from "@/components/ui/country-phone-select";
import { isValidPhoneNumber } from "libphonenumber-js";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { getRoleDashboardPath } from "@/lib/auth-routes";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = React.useState(false);
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = React.useState("BD");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreedTerms, setAgreedTerms] = React.useState(true);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    phoneRaw: "",
    address: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const red = params.get("redirect");
      if (red) setRedirectUrl(red);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&#^~_\-]/.test(pass)) score++;
    return score;
  };

  const pwdScore = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Trim and sanitize inputs
    const trimmedName = formData.name.trim().replace(/\s+/g, " ");
    const trimmedCompany = formData.companyName.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedPhone = formData.phoneRaw.trim();
    const address = formData.address.trim();

    // Name Validation
    if (!trimmedName) {
      newErrors.name = "Full name is required";
    } else if (trimmedName.length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
    } else if (/\d/.test(trimmedName)) {
      newErrors.name = "Numbers are not allowed in full name";
    } else if (!/^[a-zA-Z\s.]+$/.test(trimmedName)) {
      newErrors.name = "Special characters are not allowed in full name";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Full name cannot exceed 100 characters";
    }

    // Company Name Validation
    if (!trimmedCompany) {
      newErrors.companyName = "Company name is required";
    } else if (trimmedCompany.length < 2) {
      newErrors.companyName = "Please enter a valid company name";
    } else if (trimmedCompany.length > 150) {
      newErrors.companyName = "Company name cannot exceed 150 characters";
    }

    // Email Validation
    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Validation
    const selectedCountry = allCountryCodes.find((c) => c.country === selectedCountryCode);
    const fullPhone = `${selectedCountry?.code}${trimmedPhone.replace(/^0+/, "")}`;

    if (!trimmedPhone) {
      newErrors.phoneRaw = "Phone number is required";
    } else if (/[a-zA-Z\s]/.test(trimmedPhone)) {
      newErrors.phoneRaw = "Letters and spaces are not allowed in phone number";
    } else {
      try {
        if (!isValidPhoneNumber(fullPhone)) {
          newErrors.phoneRaw = "Phone number does not match the selected country code";
        }
      } catch {
        newErrors.phoneRaw = "Phone number does not match the selected country code";
      }
    }

    // Strict Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passRegex.test(formData.password)) {
        newErrors.password = "Password must contain uppercase, lowercase, number and special character";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedTerms) {
      newErrors.terms = "Please accept terms of service to continue";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await AuthService.register({
        name: trimmedName,
        email: trimmedEmail,
        password: formData.password,
        companyName: trimmedCompany,
        phone: fullPhone,
        address,
      });

      // Automatically sign in the user upon successful registration
      try {
        const loggedInUser = await AuthService.login({
          email: trimmedEmail,
          password: formData.password,
        });
        login(loggedInUser);
        toast.success("Account created and signed in successfully!");

        const targetDestination = redirectUrl || getRoleDashboardPath(loggedInUser?.role);
        router.replace(targetDestination);
        return;
      } catch (autoLoginErr) {
        console.warn("Auto-login fallback after registration:", autoLoginErr);
      }

      toast.success("Registration successful. Please log in.");
      router.push(redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process registration.";
      setErrors({ server: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
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
          Enterprise Customer Registration
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">FT PCB</span> Account
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
          Access direct factory quotes, 24H rapid turnaround prototypes, and automated CAM DFM verification.
        </p>
      </div>

      {/* Main Register Card - Unified Single Background */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0b1220] shadow-2xl shadow-black/80">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-90" />

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="px-6 pt-6">
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#070b14] rounded-2xl border border-slate-800/80">
            <Link
              href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
              className="py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition text-center flex items-center justify-center cursor-pointer"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="py-2.5 rounded-xl font-black text-xs bg-emerald-600 text-white shadow-md shadow-emerald-950/50 transition cursor-default"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Quote In Progress Banner */}
        {redirectUrl?.includes("resumeQuote") && (
          <div className="mx-6 mt-4 flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            <Sparkles className="size-4 shrink-0 text-emerald-400 animate-pulse" />
            <div className="leading-tight">
              <strong className="block font-bold">Quote In Progress</strong>
              <span className="text-[11px] text-emerald-400/90">
                You will be automatically signed in and redirected to checkout upon registering!
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 px-6 sm:px-8 pt-5 pb-7">
          {/* Row 1: Full Name & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="name">
                <User className="size-3.5 text-emerald-400" />
                <span>Full Name</span>
              </label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`h-11 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium transition ${
                  errors.name ? "border-red-500/50" : ""
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-400 font-semibold">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="companyName">
                <Building2 className="size-3.5 text-emerald-400" />
                <span>Company / Organization</span>
              </label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Tech Labs Ltd."
                value={formData.companyName}
                onChange={handleChange}
                className={`h-11 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium transition ${
                  errors.companyName ? "border-red-500/50" : ""
                }`}
              />
              {errors.companyName && <p className="text-[11px] text-red-400 font-semibold">{errors.companyName}</p>}
            </div>
          </div>

          {/* Row 2: Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="email">
              <Mail className="size-3.5 text-emerald-400" />
              <span>Work Email Address</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="engineer@company.com"
              value={formData.email}
              onChange={handleChange}
              className={`h-11 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium transition ${
                errors.email ? "border-red-500/50" : ""
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-400 font-semibold">{errors.email}</p>}
          </div>

          {/* Row 3: Phone Number with Country Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="phoneRaw">
              <Phone className="size-3.5 text-emerald-400" />
              <span>Phone / WhatsApp</span>
            </label>
            <div className="flex gap-2">
              <CountryPhoneSelect
                value={selectedCountryCode}
                onChange={(newCountryCode) => {
                  setSelectedCountryCode(newCountryCode);
                  if (errors.phoneRaw) {
                    setErrors((prev) => ({ ...prev, phoneRaw: "" }));
                  }
                }}
              />
              <Input
                id="phoneRaw"
                name="phoneRaw"
                type="tel"
                placeholder="1712345678"
                value={formData.phoneRaw}
                onChange={handleChange}
                className={`flex-1 h-11 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium transition ${
                  errors.phoneRaw ? "border-red-500/50" : ""
                }`}
              />
            </div>
            {errors.phoneRaw && <p className="text-[11px] text-red-400 font-semibold">{errors.phoneRaw}</p>}
          </div>

          {/* Row 4: Address (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="address">
              <MapPin className="size-3.5 text-emerald-400" />
              <span>Shipping / Delivery Address (Optional)</span>
            </label>
            <Input
              id="address"
              name="address"
              placeholder="Suite 500, High-Tech Industrial Park, City, Country"
              value={formData.address}
              onChange={handleChange}
              className="h-11 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium transition"
            />
          </div>

          {/* Row 5: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="password">
                <Lock className="size-3.5 text-emerald-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className={`h-11 pr-10 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium transition ${
                    errors.password ? "border-red-500/50" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-400 font-semibold">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5" htmlFor="confirmPassword">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={`h-11 pr-10 rounded-xl border border-slate-800 bg-[#070b14] text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium transition ${
                    errors.confirmPassword ? "border-red-500/50" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 font-semibold">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="p-3 rounded-2xl bg-[#070b14] border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-semibold">Password Strength:</span>
                <span
                  className={`font-black ${
                    pwdScore <= 1
                      ? "text-red-400"
                      : pwdScore === 2
                      ? "text-amber-400"
                      : pwdScore === 3
                      ? "text-cyan-400"
                      : "text-emerald-400"
                  }`}
                >
                  {pwdScore <= 1 ? "Weak" : pwdScore === 2 ? "Fair" : pwdScore === 3 ? "Good" : "Strong"}
                </span>
              </div>
              {/* 4-segment progress bar */}
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className={`h-full rounded-full transition-all duration-300 ${
                      pwdScore >= seg
                        ? seg <= 1
                          ? "bg-red-500"
                          : seg === 2
                          ? "bg-amber-400"
                          : seg === 3
                          ? "bg-cyan-400"
                          : "bg-emerald-400"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-0.5">
                <span className={`flex items-center gap-1 ${formData.password.length >= 8 ? "text-emerald-400 font-bold" : ""}`}>
                  <Check className="size-3" /> 8+ chars
                </span>
                <span className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? "text-emerald-400 font-bold" : ""}`}>
                  <Check className="size-3" /> Upper & lowercase
                </span>
                <span className={`flex items-center gap-1 ${/\d/.test(formData.password) ? "text-emerald-400 font-bold" : ""}`}>
                  <Check className="size-3" /> Number
                </span>
                <span className={`flex items-center gap-1 ${/[@$!%*?&#^~_\-]/.test(formData.password) ? "text-emerald-400 font-bold" : ""}`}>
                  <Check className="size-3" /> Special char
                </span>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 size-4 rounded border-slate-700 bg-slate-950 accent-emerald-500 focus:ring-emerald-500/40"
              />
              <span className="text-[11px] leading-relaxed">
                I agree to the Feitian Technology (SYS-PCB) Terms of Service, Privacy Policy, and CAM Manufacturing Guidelines.
              </span>
            </label>
            {errors.terms && <p className="text-[11px] text-red-400 font-semibold mt-1">{errors.terms}</p>}
          </div>

          {/* Server Error Message */}
          {errors.server && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <span>{errors.server}</span>
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
                  <span>Creating Enterprise Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            <div className="text-center text-xs font-medium text-slate-400">
              Already have an account?{" "}
              <Link
                href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
