"use client";

import { motion } from "motion/react";
import { Cpu, FileCheck2, PackageCheck, ScanSearch, Truck, UploadCloud } from "lucide-react";

const steps = [
  { label: "Quote", icon: UploadCloud },
  { label: "DFM", icon: FileCheck2 },
  { label: "Fabrication", icon: Cpu },
  { label: "AOI", icon: ScanSearch },
  { label: "Pack", icon: PackageCheck },
  { label: "Ship", icon: Truck },
];

export default function ManufacturingTimelineAnimation() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="absolute left-10 right-10 top-1/2 h-px bg-border" />
      <motion.div
        className="absolute left-10 top-1/2 h-px bg-linear-to-r from-cyan-400 via-primary to-emerald-400"
        animate={{ width: ["0%", "78%", "0%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative grid grid-cols-3 gap-4 lg:grid-cols-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              className="flex flex-col items-center text-center"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.1, delay: index * 0.16, repeat: Infinity }}
            >
              <div className="grid size-12 place-items-center rounded-full border border-primary/25 bg-background shadow-sm">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-foreground">{step.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
