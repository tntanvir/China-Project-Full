"use client";

import { motion } from "motion/react";

const traces = [
  "M 22 52 H 112 V 30 H 180",
  "M 22 92 H 82 V 128 H 184",
  "M 70 22 V 76 H 148 V 154",
  "M 200 44 H 254 V 104 H 306",
  "M 214 154 H 274 V 84 H 330",
];

export default function PcbCircuitTraceAnimation() {
  return (
    <div className="relative h-56 overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm dark:bg-[#07111f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.16),transparent_32%)]" />
      <div className="absolute inset-4 rounded-lg border border-cyan-300/20 bg-slate-950/80" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 220" aria-hidden="true">
        <defs>
          <linearGradient id="pcbTraceGlow" x1="0" x2="1">
            <stop stopColor="#22d3ee" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#67e8f9" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0.28" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, index) => (
            <path key={index} d={`M ${20 + index * 38} 20 V 200`} />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <path key={index} d={`M 20 ${32 + index * 38} H 340`} />
          ))}
        </g>
        {traces.map((trace, index) => (
          <motion.path
            key={trace}
            d={trace}
            fill="none"
            stroke="url(#pcbTraceGlow)"
            strokeLinecap="round"
            strokeWidth="4"
            strokeDasharray="18 18"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 1.1 + index * 0.12, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {[78, 148, 214, 286].map((x, index) => (
          <motion.circle
            key={x}
            cx={x}
            cy={index % 2 ? 128 : 76}
            r="5"
            fill="#22d3ee"
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.35, 0.8] }}
            transition={{ duration: 1.4, delay: index * 0.2, repeat: Infinity }}
          />
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/75 px-4 py-3 text-white backdrop-blur">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Signal routing</p>
          <p className="mt-1 text-sm font-bold">High speed PCB trace flow</p>
        </div>
        <div className="h-2 w-20 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-cyan-300" animate={{ x: ["-100%", "120%"] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        </div>
      </div>
    </div>
  );
}
