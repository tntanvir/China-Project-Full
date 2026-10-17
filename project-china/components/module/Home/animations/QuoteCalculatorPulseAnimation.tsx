"use client";

import { motion } from "motion/react";
import { Calculator, Layers3, Zap } from "lucide-react";

const rows = ["Layer 4", "Qty 100", "ENIG", "FR-4 TG170"];

export default function QuoteCalculatorPulseAnimation() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-black text-foreground">
          <Calculator className="h-5 w-5 text-primary" /> Instant quote
        </div>
        <motion.span className="rounded-full bg-success/10 px-3 py-1 text-xs font-black text-success" animate={{ opacity: [0.65, 1, 0.65] }} transition={{ duration: 1.2, repeat: Infinity }}>Live</motion.span>
      </div>
      <div className="mt-5 grid gap-3">
        {rows.map((row, index) => (
          <motion.div key={row} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, delay: index * 0.18, repeat: Infinity }}>
            <span className="text-xs font-bold text-muted-foreground">{row}</span>
            <Layers3 className="h-4 w-4 text-primary" />
          </motion.div>
        ))}
      </div>
      <div className="mt-5 rounded-lg bg-[#07111f] p-4 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Estimated total</p>
        <motion.p className="mt-2 text-3xl font-black" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1, repeat: Infinity }}>$248.60</motion.p>
        <p className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-300"><Zap className="h-4 w-4 text-cyan-300" /> Price refreshes while options change</p>
      </div>
    </div>
  );
}
