"use client";

import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";

const stats = [
  ["60+", "Regions"],
  ["99%", "QC target"],
  ["24/7", "Support"],
];

export default function StatsPulseAnimation() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm">
      <p className="mb-4 flex items-center gap-2 text-sm font-black text-foreground"><BarChart3 className="h-5 w-5 text-primary" /> Manufacturing signals</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map(([value, label], index) => (
          <motion.div key={label} className="rounded-lg border border-border bg-background p-4 text-center" animate={{ y: [0, -5, 0], boxShadow: ["0 0 0 rgba(37,99,235,0)", "0 18px 42px rgba(37,99,235,0.16)", "0 0 0 rgba(37,99,235,0)"] }} transition={{ duration: 2, delay: index * 0.22, repeat: Infinity }}>
            <p className="text-3xl font-black text-primary">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
