"use client";

import { motion } from "motion/react";
import { RadioTower } from "lucide-react";

const nodes = [
  { x: 50, y: 48, label: "CN" },
  { x: 22, y: 44, label: "US" },
  { x: 44, y: 28, label: "DE" },
  { x: 66, y: 36, label: "JP" },
  { x: 76, y: 66, label: "AU" },
];

export default function NetworkMeshAnimation() {
  return (
    <div className="relative h-60 overflow-hidden rounded-lg border border-border bg-card shadow-sm dark:bg-[#07111f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_62%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        {nodes.slice(1).map((node, index) => (
          <motion.path key={node.label} d={`M 50 48 Q ${(50 + node.x) / 2} ${Math.min(30, node.y - 14)} ${node.x} ${node.y}`} fill="none" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="0.7" strokeDasharray="2 2" animate={{ strokeDashoffset: [0, -18] }} transition={{ duration: 0.95 + index * 0.12, repeat: Infinity, ease: "linear" }} />
        ))}
      </svg>
      {nodes.map((node, index) => (
        <motion.div key={node.label} className="absolute grid size-10 place-items-center rounded-full border border-cyan-200/35 bg-slate-950/80 text-xs font-black text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.22)]" style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.4, delay: index * 0.16, repeat: Infinity }}>
          {node.label}
        </motion.div>
      ))}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-3 py-2 text-xs font-black text-cyan-100 backdrop-blur">
        <RadioTower className="h-4 w-4 text-cyan-300" /> Fast global network
      </div>
    </div>
  );
}
