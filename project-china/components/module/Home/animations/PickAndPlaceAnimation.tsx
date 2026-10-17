"use client";

import { motion } from "motion/react";
import { Cpu, Crosshair } from "lucide-react";

const chips = [
  { x: 18, y: 28 },
  { x: 42, y: 68 },
  { x: 68, y: 34 },
  { x: 80, y: 72 },
];

export default function PickAndPlaceAnimation() {
  return (
    <div className="relative h-60 overflow-hidden rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="absolute inset-5 rounded-lg bg-[#07111f]" />
      <div className="absolute inset-9 rounded-lg border border-cyan-300/20 bg-cyan-300/5" />
      {chips.map((chip, index) => (
        <motion.div
          key={`${chip.x}-${chip.y}`}
          className="absolute z-20 grid h-7 w-10 place-items-center rounded bg-emerald-300 text-slate-950 shadow-[0_0_22px_rgba(52,211,153,0.35)]"
          style={{ left: `${chip.x}%`, top: `${chip.y}%` }}
          animate={{ opacity: [0.2, 1, 1], scale: [0.7, 1.08, 1] }}
          transition={{ duration: 1.8, delay: index * 0.35, repeat: Infinity }}
        >
          <Cpu className="h-4 w-4" />
        </motion.div>
      ))}
      <motion.div
        className="absolute z-30 flex items-center gap-2 rounded-full border border-cyan-200/35 bg-slate-950/80 px-3 py-2 text-xs font-black text-cyan-100 shadow-lg backdrop-blur"
        animate={{ left: ["12%", "70%", "34%", "78%", "12%"], top: ["16%", "24%", "62%", "66%", "16%"] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Crosshair className="h-4 w-4 text-cyan-300" /> SMT head
      </motion.div>
    </div>
  );
}
