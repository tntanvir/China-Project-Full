import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Boxes, FileSpreadsheet, Download, ArrowRight, ShieldCheck } from "lucide-react";
import ElectronicsBusinessScope from "@/components/module/about/ElectronicsBusinessScope";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Electronics Business Scope | FT Company (Feitian Electronic Technology)",
  description:
    "Official Electronics Business Scope of FT Company (Wuping Feitian Electronic Technology Co., Ltd.): PCB Design & Prototyping, Device Repair & Diagnostics, Component Sourcing & Supply, and Embedded Systems & Sensors.",
  keywords: [
    "FT Company Business Scope",
    "Electronics Business Scope",
    "PCB Design & Prototyping",
    "Device Repair & Diagnostics",
    "Component Sourcing & Supply",
    "Embedded Systems & Sensors",
    "Wuping Feitian Electronic Technology",
  ],
};

export default function BusinessScopePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28">
      {/* Sticky Top Breadcrumb Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-emerald-600 transition flex items-center gap-1">
              <Home className="size-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <Link href="/about-ft-pcb" className="hover:text-emerald-600 transition">
              About FT-PCB
            </Link>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-white">Business Scope</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
              <Link href="/about-ft-pcb#company-profile">Company Profile (42 Slides)</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
              <Link href="/pcb-quote">Request Quote</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <ElectronicsBusinessScope />

        {/* Bottom Conversion Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-900/40 p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300">
              <ShieldCheck className="size-4" />
              <span>Direct Source Factory Turnkey Assurance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Need Custom PCB Design, Diagnostics or Sourcing?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Contact our engineering team in Wuping and Shenzhen for rapid DFM reviews, genuine component BOM matching, or prototype assembly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg">
              <Link href="/pcb-quote">
                <span>Start PCB Quote</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
              <Link href="/contact">Contact Engineers</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

