"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Cpu, Globe2, ShieldCheck, Timer } from "lucide-react";

function seededValue(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
const fiberColors = ["#1d4ed8", "#06b6d4", "#22d3ee", "#8b5cf6", "#a855f7", "#22c55e"];

function makeFibers(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const row = index / Math.max(1, count - 1);
    const startY = 4 + row * 88;
    const targetY = 48 + Math.sin(index * 0.19) * 8;
    const c1x = 24 + Math.sin(index * 0.43) * 9;
    const c2x = 48 + Math.cos(index * 0.29) * 12;
    const c1y = startY + Math.sin(index * 0.31) * 15;
    const c2y = targetY + (startY - targetY) * 0.14 + Math.cos(index * 0.23) * 8;

    return {
      d: `M -8 ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, 68 ${targetY}`,
      color: fiberColors[index % fiberColors.length],
      width: index % 19 === 0 ? 0.16 : index % 7 === 0 ? 0.1 : 0.055,
      opacity: index % 11 === 0 ? 0.68 : index % 5 === 0 ? 0.42 : 0.24,
      delay: `${(index % 47) * 0.025}s`,
      duration: `${0.55 + (index % 17) * 0.045}s`,
    };
  });
}

function makePackets(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const startY = 5 + ((index * 23) % 88);
    const targetY = 48 + Math.sin(index * 0.57) * 7;
    const c1x = 25 + Math.sin(index * 0.37) * 12;
    const c2x = 51 + Math.cos(index * 0.41) * 11;

    return {
      path: `M -7 ${startY} C ${c1x} ${startY + Math.sin(index) * 14}, ${c2x} ${targetY + Math.cos(index) * 8}, 69 ${targetY}`,
      color: fiberColors[(index * 2) % fiberColors.length],
      delay: `${index * 0.045}s`,
      duration: `${0.7 + (index % 11) * 0.055}s`,
      r: index % 8 === 0 ? 0.7 : 0.42,
    };
  });
}

const traceLines = [
  "M 14 18 H 70 V 28 H 108", "M 18 34 H 82 V 46 H 116", "M 12 60 H 58 V 72 H 110",
  "M 96 16 V 46 H 132", "M 126 34 H 178 V 58", "M 124 74 H 188 V 92",
  "M 30 92 H 76 V 108 H 148", "M 152 18 V 48 H 198", "M 164 112 H 218",
  "M 44 24 V 56 H 96", "M 202 44 V 96 H 238", "M 74 118 H 118 V 136",
];

export default function UltraPcbSignalFlowAnimation() {
  const fibers = useMemo(() => makeFibers(360), []);
  const packets = useMemo(() => makePackets(90), []);
  const sparks = useMemo(
    () => Array.from({ length: 150 }, (_, index) => ({
      left: `${28 + seededValue(index + 11) * 64}%`,
      top: `${8 + seededValue(index + 23) * 84}%`,
      size: 2 + seededValue(index + 37) * 5,
      delay: `${(index % 30) * 0.08}s`,
      duration: `${1.8 + seededValue(index + 51) * 2.4}s`,
    })),
    []
  );

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#020617] text-white lg:min-h-[820px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(124,58,237,0.22),transparent_28%),radial-gradient(circle_at_52%_48%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_84%_68%,rgba(34,197,94,0.12),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.028)_1px,transparent_1px)] bg-[size:42px_42px] opacity-50" />

      {sparks.map((spark, index) => (
        <motion.span
          key={index}
          className="absolute z-10 rounded-full bg-cyan-300/70 blur-[2px]"
          style={{ left: spark.left, top: spark.top, width: spark.size, height: spark.size }}
          animate={{ opacity: [0.05, 0.8, 0.08], y: [0, -18, 0], scale: [0.7, 1.35, 0.8] }}
          transition={{ duration: Number.parseFloat(spark.duration), delay: Number.parseFloat(spark.delay), repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-20 mx-auto grid min-h-[720px] max-w-7xl grid-cols-1 items-center gap-8 px-5 py-16 lg:min-h-[820px] lg:grid-cols-[0.42fr_0.58fr] lg:px-10">
        <div className="relative z-30 max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">PCB Signal Flow</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Data <span className="text-violet-400">→</span> PCB <span className="text-cyan-300">→</span>
            <br />Manufacturing
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            From millions of data points to high-quality PCB manufacturing.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-linear-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-black text-white shadow-[0_0_34px_rgba(34,211,238,0.25)]">
              Explore Capabilities
            </button>
            <button className="inline-flex items-center gap-2 text-sm font-black text-cyan-300">
              <span className="grid size-8 place-items-center rounded-full border border-cyan-300/40">▶</span>
              Watch Process
            </button>
          </div>

          <div className="mt-8 w-full max-w-[230px] rounded-lg border border-white/10 bg-slate-950/45 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl">
            {[
              [Cpu, "50,000+", "PCB Models"],
              [Timer, "25+", "Years Experience"],
              [Globe2, "120+", "Export Countries"],
              [ShieldCheck, "99.9%", "On-Time Delivery"],
            ].map(([Icon, value, label]) => {
              const ItemIcon = Icon as typeof Cpu;
              return (
                <div key={label as string} className="flex items-center gap-4 border-b border-white/8 py-3 last:border-0">
                  <ItemIcon className="h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="text-xl font-black text-cyan-300">{value as string}</p>
                    <p className="text-xs text-slate-300">{label as string}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative min-h-[560px] lg:min-h-[700px]">
          <svg className="absolute inset-0 z-10 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="fiberFlowGradient" x1="0" x2="1">
                <stop stopColor="#1d4ed8" stopOpacity="0" />
                <stop offset="0.34" stopColor="#7c3aed" stopOpacity="0.55" />
                <stop offset="0.64" stopColor="#06b6d4" stopOpacity="0.95" />
                <stop offset="1" stopColor="#67e8f9" stopOpacity="0.1" />
              </linearGradient>
              <filter id="heroFiberGlow" x="-20%" y="-70%" width="150%" height="240%">
                <feGaussianBlur stdDeviation="0.75" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="heroPacketGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#heroFiberGlow)">
              {fibers.map((fiber, index) => (
                <path
                  key={`${fiber.d}-${index}`}
                  d={fiber.d}
                  fill="none"
                  stroke={index % 5 === 0 ? fiber.color : "url(#fiberFlowGradient)"}
                  strokeWidth={fiber.width}
                  strokeLinecap="round"
                  strokeDasharray="0.35 2.7"
                  opacity={fiber.opacity}
                >
                  <animate attributeName="stroke-dashoffset" values="0;-16" dur={fiber.duration} begin={fiber.delay} repeatCount="indefinite" />
                  <animate attributeName="opacity" values={`${fiber.opacity * 0.45};${Math.min(0.9, fiber.opacity * 1.75)};${fiber.opacity * 0.55}`} dur={`${0.9 + (index % 15) * 0.05}s`} begin={fiber.delay} repeatCount="indefinite" />
                </path>
              ))}
            </g>

            {packets.map((packet, index) => (
              <circle key={`${packet.path}-${index}`} r={packet.r} fill={packet.color} filter="url(#heroPacketGlow)">
                <animateMotion dur={packet.duration} begin={packet.delay} repeatCount="indefinite" path={packet.path} />
                <animate attributeName="opacity" values="0;1;0" dur={packet.duration} begin={packet.delay} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>

          <motion.div
            className="absolute right-[-5%] top-[12%] z-20 h-[520px] w-[590px] origin-center rotate-[10deg] rounded-[2rem] border border-cyan-300/20 bg-[#042a2a] shadow-[0_0_80px_rgba(34,211,238,0.18)] lg:right-[-8%] lg:h-[620px] lg:w-[710px]"
            animate={{ y: [0, -10, 0], rotate: [10, 9.2, 10] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-5 rounded-[1.45rem] border border-cyan-400/20 bg-[#032020]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 620" aria-hidden="true">
              <defs>
                <filter id="pcbTraceGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {traceLines.map((trace, index) => (
                <motion.path
                  key={trace}
                  d={trace}
                  transform="translate(145 100) scale(2.35)"
                  fill="none"
                  stroke={index % 4 === 0 ? "#22d3ee" : "#d6a84f"}
                  strokeWidth={index % 4 === 0 ? 1.5 : 1.15}
                  strokeLinecap="round"
                  filter={index % 4 === 0 ? "url(#pcbTraceGlow)" : undefined}
                  animate={{ opacity: [0.45, 1, 0.52], strokeDashoffset: [0, -24] }}
                  transition={{ duration: 1.4 + index * 0.05, repeat: Infinity, ease: "linear" }}
                  strokeDasharray="7 9"
                />
              ))}

              {Array.from({ length: 46 }).map((_, index) => (
                <circle key={index} cx={70 + index * 13} cy="545" r="4" fill="#d6a84f" opacity="0.75" />
              ))}
              {Array.from({ length: 34 }).map((_, index) => (
                <rect key={index} x={58 + index * 17} y="565" width="11" height="38" rx="2" fill={index % 5 === 0 ? "#e9d5ff" : "#94a3b8"} />
              ))}
            </svg>

            <motion.div className="absolute left-[42%] top-[39%] h-36 w-36 rounded-lg bg-[#0f172a] shadow-[0_0_50px_rgba(37,99,235,0.4)]" animate={{ boxShadow: ["0 0 28px rgba(37,99,235,0.28)", "0 0 72px rgba(34,211,238,0.5)", "0 0 28px rgba(37,99,235,0.28)"] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <motion.div className="absolute inset-9 rounded-full bg-blue-600" animate={{ scale: [0.88, 1.12, 0.9], opacity: [0.75, 1, 0.8] }} transition={{ duration: 1, repeat: Infinity }} />
              <div className="absolute inset-12 rounded-full bg-cyan-300/80" />
            </motion.div>
            <div className="absolute left-[38%] top-[37%] h-44 w-44 rounded-full border border-cyan-300/35 shadow-[0_0_44px_rgba(34,211,238,0.28)]" />
          </motion.div>

          <div className="absolute right-0 top-8 z-30 hidden w-52 border-l border-cyan-300/30 pl-4 text-xs text-slate-300 lg:block">
            <p className="font-black uppercase tracking-[0.14em] text-violet-300">Data Stream</p>
            <p className="mt-1">Millions of data points collected & analyzed</p>
          </div>
          <div className="absolute left-[27%] top-[55%] z-30 hidden w-56 border-l border-cyan-300/30 pl-4 text-xs text-slate-300 lg:block">
            <p className="font-black uppercase tracking-[0.14em] text-cyan-300">Signal Routing</p>
            <p className="mt-1">High-speed routing with precision</p>
          </div>
          <div className="absolute bottom-16 right-8 z-30 hidden w-48 rounded-lg border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl lg:block">
            <svg viewBox="0 0 160 48" className="h-12 w-full" aria-hidden="true">
              <polyline points="0,30 10,28 18,18 25,34 34,12 45,32 54,24 63,29 74,20 86,31 98,22 108,27 120,17 132,33 144,14 156,26" fill="none" stroke="#22d3ee" strokeWidth="2" />
              <polyline points="0,34 16,32 32,36 48,28 64,33 80,25 96,31 112,24 128,29 144,18 160,12" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            </svg>
            <p className="mt-2 text-[10px] text-slate-400">Signal Flow Monitor</p>
          </div>
        </div>
      </div>
    </section>
  );
}

