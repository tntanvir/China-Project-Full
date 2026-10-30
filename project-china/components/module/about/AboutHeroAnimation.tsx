"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Globe2, MapPin, Cpu, ShieldCheck, Zap } from "lucide-react";

interface NodePoint {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  metrics: string;
  icon: any;
  color: string;
}

const NODES: NodePoint[] = [
  {
    id: "wuping",
    name: "Wuping Production Base",
    role: "15,000m² Automated Factory Hub",
    x: 48,
    y: 38,
    metrics: "100,000 m²/mo • 3 Buildings",
    icon: Building2,
    color: "#10b981", // Emerald
  },
  {
    id: "shenzhen",
    name: "Shenzhen Global Center",
    role: "International Marketing & Sales",
    x: 80,
    y: 72,
    metrics: "Fenghuang Zhi Gu, Bao'an",
    icon: Globe2,
    color: "#3b82f6", // Blue
  },
  {
    id: "xiamen",
    name: "Xiamen Design Center",
    role: "CAM Engineering & Regional Hub",
    x: 22,
    y: 76,
    metrics: "Ridong Road, Jimei District",
    icon: MapPin,
    color: "#a855f7", // Purple
  },
];

export default function AboutHeroAnimation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>("wuping");

  const activeNode = NODES.find((n) => n.id === hoveredNode) || NODES[0];

  return (
    <div className="relative w-full rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-6 shadow-2xl overflow-hidden select-none">
      {/* Background Animated PCB Circuit Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 300"
      >
        <defs>
          <pattern
            id="circuit-grid"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(16, 185, 129, 0.12)"
              strokeWidth="0.8"
            />
            <circle cx="25" cy="0" r="1" fill="rgba(16, 185, 129, 0.25)" />
          </pattern>

          {/* Linear Gradients for Traces */}
          <linearGradient id="trace-wuping-sz" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="trace-wuping-xm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="trace-xm-sz" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuit-grid)" />

        {/* Ambient Signal Pulse Circles */}
        <motion.circle
          cx="192"
          cy="114"
          r="48"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ scale: 0.8, opacity: 0.1 }}
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inter-Hub High-Speed Circuit Traces */}
        {/* Wuping to Shenzhen Trace */}
        <path
          d="M 192 114 L 250 114 L 320 180 L 320 216"
          fill="none"
          stroke="url(#trace-wuping-sz)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 4"
          className="opacity-70"
        />

        {/* Wuping to Xiamen Trace */}
        <path
          d="M 192 114 L 140 114 L 88 180 L 88 228"
          fill="none"
          stroke="url(#trace-wuping-xm)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 4"
          className="opacity-70"
        />

        {/* Xiamen to Shenzhen Trace */}
        <path
          d="M 88 228 L 180 250 L 320 216"
          fill="none"
          stroke="url(#trace-xm-sz)"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="opacity-40"
        />

        {/* Flowing Circuit Packets (Motion SVGs) */}
        {/* Packet 1: Wuping -> Shenzhen */}
        <motion.circle
          r="3.5"
          fill="#34d399"
          filter="drop-shadow(0 0 6px #10b981)"
          animate={{
            cx: [192, 250, 320, 320],
            cy: [114, 114, 180, 216],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Packet 2: Wuping -> Xiamen */}
        <motion.circle
          r="3.5"
          fill="#c084fc"
          filter="drop-shadow(0 0 6px #a855f7)"
          animate={{
            cx: [192, 140, 88, 88],
            cy: [114, 114, 180, 228],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: 1,
            ease: "easeInOut",
          }}
        />

        {/* Packet 3: Shenzhen -> Xiamen Back-Channel */}
        <motion.circle
          r="3"
          fill="#60a5fa"
          filter="drop-shadow(0 0 6px #3b82f6)"
          animate={{
            cx: [320, 180, 88],
            cy: [216, 250, 228],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Foreground Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            Live Synchronized Network
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Yunshang Feitian Cloud MES
        </span>
      </div>

      {/* Nodes Map Visualization */}
      <div className="relative z-10 h-64 sm:h-72 my-2">
        {NODES.map((node) => {
          const isSelected = hoveredNode === node.id;
          const Icon = node.icon;

          return (
            <motion.div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute cursor-pointer group"
              onMouseEnter={() => setHoveredNode(node.id)}
              onClick={() => setHoveredNode(node.id)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulsing Ripple */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: node.color }}
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{ opacity: 0, scale: 2.4 }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              {/* Node Core Icon */}
              <div
                className={`relative size-11 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 border ${
                  isSelected
                    ? "ring-4 ring-white/20 shadow-emerald-500/40 scale-110"
                    : "opacity-85 group-hover:opacity-100"
                }`}
                style={{
                  backgroundColor: `${node.color}ee`,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                <Icon className="size-5 stroke-[2.2]" />
              </div>

              {/* Label Chip */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap shadow-md backdrop-blur-md transition-all ${
                  isSelected
                    ? "bg-white text-slate-950 ring-2 ring-emerald-500"
                    : "bg-black/75 text-slate-200 border border-white/10"
                }`}
              >
                {node.name.split(" ")[0]}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      <motion.div
        key={activeNode.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 flex items-center justify-between text-white"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: activeNode.color }}
            />
            <span className="text-xs font-black tracking-wide">
              {activeNode.name}
            </span>
          </div>
          <p className="text-[11px] text-slate-300">{activeNode.role}</p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
            {activeNode.metrics}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
