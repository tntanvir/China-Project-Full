"use client";

import { motion } from "motion/react";
import { ScanSearch, ShieldCheck } from "lucide-react";

const pads = Array.from({ length: 28 }, (_, index) => index);

export default function QualityScannerAnimation() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-black text-foreground"><ShieldCheck className="h-5 w-5 text-primary" /> AOI quality scanner</p>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-success">Pass</p>
      </div>
      <div className="relative h-40 overflow-hidden rounded-lg bg-[#07111f] p-5">
        <div className="grid grid-cols-7 gap-3">
          {pads.map((pad) => (
            <motion.span key={pad} className="h-3 rounded-full bg-cyan-300/35" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.5, delay: (pad % 7) * 0.06, repeat: Infinity }} />
          ))}
        </div>
        <motion.div className="absolute inset-y-0 left-0 w-14 bg-linear-to-r from-transparent via-emerald-300/45 to-transparent" animate={{ x: [-64, 360] }} transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }} />
        <ScanSearch className="absolute bottom-4 right-4 h-8 w-8 text-emerald-300" />
      </div>
    </div>
  );
}
