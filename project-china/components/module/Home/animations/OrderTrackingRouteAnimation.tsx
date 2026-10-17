"use client";

import { motion } from "motion/react";
import { PackageCheck, Truck } from "lucide-react";

const checkpoints = ["Order", "Build", "QC", "Pack", "Ship"];

export default function OrderTrackingRouteAnimation() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="relative h-44 rounded-lg bg-[#07111f] p-5 text-white">
        <div className="absolute left-8 right-8 top-1/2 h-1 rounded-full bg-white/10" />
        <motion.div className="absolute left-8 top-1/2 h-1 rounded-full bg-cyan-300" animate={{ width: ["0%", "78%", "0%"] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-[calc(50%-18px)] grid size-9 place-items-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.5)]" animate={{ left: ["7%", "82%", "7%"] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
          <Truck className="h-5 w-5" />
        </motion.div>
        <div className="relative flex h-full items-end justify-between">
          {checkpoints.map((point, index) => (
            <div key={point} className="text-center">
              <div className="mx-auto grid size-8 place-items-center rounded-full border border-cyan-200/30 bg-white/10 text-xs font-black">{index + 1}</div>
              <p className="mt-2 text-xs font-bold text-slate-300">{point}</p>
            </div>
          ))}
        </div>
        <PackageCheck className="absolute right-4 top-4 h-6 w-6 text-emerald-300" />
      </div>
    </div>
  );
}
