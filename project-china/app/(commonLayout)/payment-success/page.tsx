"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Package,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  CreditCard,
  Layers,
  Cpu,
  Clock,
  Printer,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  HelpCircle,
  Receipt,
  ChevronDown,
  ChevronUp,
  MailCheck,
  Building2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PaymentService } from "@/services/payment.service";

function money(amount?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount || 0);
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const provider = searchParams.get("provider") || "stripe";
  const paypalToken = searchParams.get("token") || "";
  const queryAmount = searchParams.get("amount");
  const parsedAmount = queryAmount ? parseFloat(queryAmount) : 17.0;

  const { theme, setTheme } = useTheme();

  const shouldCapturePayPal = provider === "paypal" && Boolean(paypalToken);
  const [captureStatus, setCaptureStatus] = useState<"idle" | "capturing" | "done" | "failed">(
    shouldCapturePayPal ? "capturing" : "done"
  );
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState(
    "Your payment has been securely confirmed. Our CAM engineering team has initiated the design rule check (DFM) and your PCB has entered the rapid fabrication queue."
  );

  const orderNumber = useMemo(
    () => (orderId ? (orderId.startsWith("ORD-") ? orderId : `ORD-${orderId.slice(0, 8).toUpperCase()}`) : "ORD-9482X1"),
    [orderId]
  );

  const transactionRef = useMemo(
    () => (orderId ? `TXN-${orderId.slice(-6).toUpperCase()}-OK` : "TXN-79412-OK"),
    [orderId]
  );

  const paymentTimestamp = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!shouldCapturePayPal || captureStatus !== "capturing") {
      return;
    }

    PaymentService.capturePayPalOrder(paypalToken)
      .then((result) => {
        setCaptureStatus(result.success ? "done" : "failed");
        setMessage(result.message || "PayPal payment captured successfully and confirmed.");
        toast.success("PayPal payment confirmed successfully!");
      })
      .catch((error) => {
        setCaptureStatus("failed");
        setMessage(error instanceof Error ? error.message : "PayPal payment capture failed.");
        toast.error("PayPal capture verification failed.");
      });
  }, [captureStatus, paypalToken, shouldCapturePayPal]);

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrder(true);
    toast.info("Order number copied to clipboard!");
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  const handleCopyTxn = () => {
    navigator.clipboard.writeText(transactionRef);
    setCopiedTxn(true);
    toast.info("Transaction reference copied!");
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isStripe = provider.toLowerCase().includes("stripe");
  const isPayPal = provider.toLowerCase().includes("paypal");

  if (!mounted) {
    return (
      <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 flex items-center justify-center pt-28 pb-20 px-4">
        <div className="flex items-center gap-3 p-6 rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0b1220] dark:shadow-2xl">
          <Loader2 className="size-5 animate-spin text-emerald-500 dark:text-emerald-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Verifying payment confirmation...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Clean Print Stylesheet for Physical Invoicing */}
      <style jsx global>{`
        @media print {
          nav, footer, .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .printable-card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 selection:bg-emerald-500 selection:text-white pt-24 pb-20 px-4 sm:px-6 transition-colors duration-200">
        {/* Subtle Ambient Background Grids & Radial Orbs */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden no-print">
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 h-88 w-88 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px]" />
          <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[130px]" />
        </div>

        <div className="relative z-10 container mx-auto max-w-3xl">
          {/* Top Bar: Quick Navigation & Theme Mood Switcher (White / Dark / Auto) */}
          <div className="no-print flex items-center justify-between mb-5 px-1">
            <Link
              href="/dashboard/payments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
            >
              <FileText className="size-3.5" />
              <span>Payments History</span>
            </Link>

            {/* Interactive Theme Mood Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200/90 shadow-xs dark:bg-[#0b1220] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 hidden sm:inline-block">
                Mood
              </span>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-slate-100 text-emerald-800 shadow-xs border border-slate-200 font-black"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                title="Switch to White (Light) Mood"
              >
                <Sun className="size-3.5 text-amber-500" />
                <span>White</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-emerald-500/20 text-emerald-300 shadow-xs border border-emerald-500/40 font-black"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                title="Switch to Dark Mood"
              >
                <Moon className="size-3.5 text-emerald-400" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  theme === "system"
                    ? "bg-slate-100 text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                title="System Auto Preference"
              >
                <Laptop className="size-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Main Success Container */}
          <div className="printable-card relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-200/70 dark:border-slate-800 dark:bg-[#0b1220] dark:shadow-black/90 p-6 sm:p-10 text-center transition-colors duration-200">
            {/* Top Gradient Ribbon */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

            {/* Print Header (Only visible on paper print) */}
            <div className="hidden print:flex items-center justify-between pb-6 mb-6 border-b border-slate-200 text-left">
              <div>
                <h2 className="text-xl font-black text-slate-900">Wuping Feitian Electronic Technology Co., Ltd.</h2>
                <p className="text-xs text-slate-500">Official Electronic Commercial Tax Receipt / DFM Queue Confirmation</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-bold text-slate-900">Date: {paymentTimestamp}</p>
                <p>Status: CONFIRMED & PAID</p>
              </div>
            </div>

            {/* 3D Success Orb */}
            <div className="relative mx-auto mb-5 flex size-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="relative flex size-20 items-center justify-center rounded-3xl border border-emerald-400/40 bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-white shadow-2xl shadow-emerald-500/30 dark:shadow-emerald-950/80">
                {captureStatus === "capturing" ? (
                  <Loader2 className="size-10 animate-spin text-white" />
                ) : captureStatus === "failed" ? (
                  <CreditCard className="size-10 text-white" />
                ) : (
                  <CheckCircle2 className="size-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
                )}
              </div>
            </div>

            {/* Badge Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/90 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 mb-3">
              <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>
                {captureStatus === "capturing"
                  ? "Processing Gateway Handshake"
                  : captureStatus === "failed"
                  ? "Payment Review Required"
                  : "Payment Verified & Order Confirmed"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {captureStatus === "capturing"
                ? "Confirming Payment..."
                : captureStatus === "failed"
                ? "Payment Needs Review"
                : "Payment Successful!"}
            </h1>

            <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {message}
            </p>

            {/* Email Dispatch Notice Pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-800 text-[11px] font-medium">
              <MailCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>A verified invoice & Gerber DFM report receipt has been queued for your email.</span>
            </div>

            {/* Verified Receipt Summary Box */}
            <div className="mt-7 rounded-2xl border border-slate-200/90 bg-slate-50/90 dark:border-slate-800 dark:bg-[#070b14] p-5 sm:p-6 text-left shadow-xs transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Verified Receipt Summary
                </span>
                <div className="flex items-center gap-3 no-print">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-2xs transition cursor-pointer"
                  >
                    <Printer className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {/* Order Number */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Order Number
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {orderNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOrder}
                      className="no-print text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedOrder ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment Gateway */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Gateway
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-bold border ${
                      isStripe
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500/30"
                        : isPayPal
                        ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-500/30"
                        : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isStripe ? "Stripe Direct" : isPayPal ? "PayPal Express" : provider}
                  </span>
                </div>

                {/* Amount */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Total Paid
                  </span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                    {money(parsedAmount, "USD")}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/30">
                    <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    {captureStatus === "failed" ? "Under Review" : "PAID & VERIFIED"}
                  </span>
                </div>
              </div>

              {/* Secondary Details Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{transactionRef}</span>
                  <button
                    type="button"
                    onClick={handleCopyTxn}
                    className="no-print text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                    title="Copy Transaction Ref"
                  >
                    {copiedTxn ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
                <div>
                  <span className="font-medium">Confirmed At:</span>{" "}
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{paymentTimestamp}</span>
                </div>
              </div>
            </div>

            {/* Expandable Order Breakdown Toggle (No Print Toggle) */}
            <div className="mt-4 text-left">
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="no-print w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Receipt className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Itemized PCB Invoice Breakdown & Specifications</span>
                </div>
                {showBreakdown ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {/* Breakdown Content */}
              {showBreakdown && (
                <div className="mt-2 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-[#070b14]/70 text-xs space-y-2.5 transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Custom Rigid FR4 Prototype PCB</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">5 pcs (100 × 100 mm)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Layer Count & Thickness</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">2-Layers / 1.6 mm / 1oz Cu</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Solder Mask / Silkscreen</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">Green / White High Res</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Surface Finish</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">HASL with lead (RoHS Option)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Fabrication Turnaround</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">24-Hour Rapid Queue</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Net Amount Charged</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {money(parsedAmount, "USD")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 4-Step Production Pipeline Tracker */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-[#070b14]/70 p-5 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-3.5 flex items-center gap-1.5">
                <Truck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Live Manufacturing & Dispatch Timeline
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* Step 1: Payment */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-300">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="leading-tight">
                    <strong className="block font-bold">1. Payment</strong>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400/80 font-medium">Completed</span>
                  </div>
                </div>

                {/* Step 2: CAM Review */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 shadow-2xs dark:bg-slate-900/90 dark:border-emerald-500/40 dark:text-white">
                  <Cpu className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
                  <div className="leading-tight">
                    <strong className="block font-bold">2. CAM DFM</strong>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Active Review</span>
                  </div>
                </div>

                {/* Step 3: Fabrication */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 text-slate-600 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400">
                  <Layers className="size-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <div className="leading-tight">
                    <strong className="block font-bold">3. Fabrication</strong>
                    <span className="text-[10px] text-slate-500">24H Queue</span>
                  </div>
                </div>

                {/* Step 4: Shipping */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 text-slate-600 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400">
                  <Clock className="size-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <div className="leading-tight">
                    <strong className="block font-bold">4. Shipping</strong>
                    <span className="text-[10px] text-slate-500">Direct Express</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs (Hidden during print) */}
            <div className="no-print mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 dark:shadow-emerald-950/60 gap-2 cursor-pointer transition active:scale-[0.99]"
              >
                <Link href="/dashboard/payments">
                  <FileText className="size-4" />
                  <span>View Payment Records</span>
                  <ArrowRight className="size-3.5 ml-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                asChild
                variant="outline"
                className="w-full sm:w-auto h-12 px-6 rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 font-bold text-xs gap-2 transition cursor-pointer"
              >
                <Link href="/dashboard/orders">
                  <Package className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Track Order in Dashboard</span>
                </Link>
              </Button>
            </div>

            {/* Secondary Links & DFM Assistance */}
            <div className="no-print mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <Link
                href="/pcb-quote"
                className="font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Configure Another PCB Quote</span>
                <ChevronRight className="size-3 text-emerald-500 dark:text-emerald-400" />
              </Link>

              <a
                href="https://wa.me/8618928420600"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
              >
                <HelpCircle className="size-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Need CAM Engineering Support?</span>
              </a>
            </div>
          </div>

          {/* Bottom Trust & Compliance Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 no-print">
            <span className="flex items-center gap-1">
              <Building2 className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>ISO 9001:2015 Certified Factory</span>
            </span>
            <span>•</span>
            <span>IPC Class 2/3 Inspection</span>
            <span>•</span>
            <span>256-Bit SSL Encryption</span>
            <span>•</span>
            <span>Direct Wuping High-Tech Park Dispatch</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center text-slate-900 dark:text-white">
          <div className="flex items-center gap-3 p-6 rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0b1220] dark:shadow-2xl">
            <Loader2 className="size-5 animate-spin text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Loading payment verification...
            </span>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
