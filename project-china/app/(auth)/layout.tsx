import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Cpu } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* High-Tech Ambient Grid & Soft Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient radial glows positioned softly in far corners */}
        <div className="absolute -top-[10%] left-[5%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute -bottom-[15%] right-[5%] h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[150px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-5xl px-4 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-300 shadow-lg backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5 text-emerald-400" />
            <span>Back to Home</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3.5 py-1.5 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted Portal</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-2xl px-4 py-8 mx-auto flex-1 flex flex-col justify-center">
        {children}
      </main>

      {/* Bottom Trust & Compliance Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-500 border-t border-slate-900/60 bg-slate-950/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="size-3 text-emerald-500" />
            <span>Feitian Technology (SYS-PCB) Direct Turnaround Platform</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>ISO 9001:2015</span>
            <span>•</span>
            <span>IPC Class 2/3</span>
            <span>•</span>
            <span>RoHS & UL94V-0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
