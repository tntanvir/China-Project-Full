"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDictionary } from "@/components/providers/language-provider";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cpu,
  Grid,
  Layers,
  Microscope,
  ShieldCheck,
  Sparkles,
  Table,
  Truck,
  UploadCloud,
  Zap,
} from "lucide-react";

export interface ProductFamilyItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Rigid & Multilayer PCB" | "Flex & Rigid-Flex PCB" | "Advanced & RF Substrates" | "Turnkey PCBA & Assembly";
  badge: string;
  imageUrl: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  turnaround: string;
  bestFor: string;
  quoteUrl: string;
}

export const productFamiliesData: ProductFamilyItem[] = [
  {
    id: "rigid-multilayer",
    title: "Standard & High-TG Rigid PCB",
    subtitle: "High-Density FR-4 Multilayer Fabrication",
    category: "Rigid & Multilayer PCB",
    badge: "1-32 Layers",
    imageUrl: "/images/generated/rigid_pcb.png",
    description: "High-precision 1 to 32 layer rigid circuit boards built with Shengyi/KB high-TG170 laminates, controlled differential impedance, and laser microvias.",
    specs: [
      { label: "Layer Count", value: "1-32 Layers" },
      { label: "Min Trace/Space", value: "3/3 mil (0.075mm)" },
      { label: "Min Hole Size", value: "0.15mm (Mechanical)" },
      { label: "Surface Finish", value: "ENIG 2u\", HASL, OSP, Hard Gold" },
    ],
    turnaround: "⚡ 24h Quick Turn",
    bestFor: "Industrial controllers, computing gateways, IoT & consumer electronics",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "hdi-microvia",
    title: "Any-Layer HDI Microvia PCB",
    subtitle: "Laser-Drilled Via-in-Pad Interconnects",
    category: "Rigid & Multilayer PCB",
    badge: "Any-Layer HDI",
    imageUrl: "/images/generated/hdi_pcb.png",
    description: "Fine-line laser microvias, stacked/staggered via-in-pad (VIPPO), and high-density interconnect routing for ultra-miniaturized electronics.",
    specs: [
      { label: "Stackup Architecture", value: "1+N+1 to Any-Layer HDI" },
      { label: "Laser Microvia", value: "0.075mm (3 mil)" },
      { label: "Via Filling", value: "Copper / Epoxy Filled (VIPPO)" },
      { label: "Aspect Ratio", value: "10:1 Through-Hole" },
    ],
    turnaround: "⚡ 4-5 Days Dispatch",
    bestFor: "Smartphones, portable medical monitors, drone avionics, FPGA boards",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "heavy-copper",
    title: "Heavy Copper High-Power PCB",
    subtitle: "Thermal Power Dissipation & Busbars",
    category: "Rigid & Multilayer PCB",
    badge: "Up to 6oz Copper",
    imageUrl: "/images/categories/pcb-manufacture/material-1.jpg",
    description: "High-current circuit boards with up to 6oz (210µm) inner and outer copper weights designed for extreme current loads and rapid thermal transfer.",
    specs: [
      { label: "Copper Thickness", value: "2oz - 6oz (70µm - 210µm)" },
      { label: "Current Capacity", value: "Up to 100A+ Continuous" },
      { label: "Substrate Laminate", value: "High-TG180 Halogen-Free" },
      { label: "Dielectric Isolation", value: "Tested to 3,500V DC" },
    ],
    turnaround: "⚡ 3-4 Days Turn",
    bestFor: "EV motor inverters, power supply busbars, solar charge controllers",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "flexible-fpc",
    title: "Flexible Polyimide FPC",
    subtitle: "Ultra-Thin Dynamic Bending Circuits",
    category: "Flex & Rigid-Flex PCB",
    badge: "1-6 Layers Flex",
    imageUrl: "/images/generated/flexible_pcb.png",
    description: "Ultra-thin, featherweight polyimide flex circuits engineered for dynamic bending, tight enclosures, and high-vibration environments.",
    specs: [
      { label: "Base Film", value: "DuPont Pyralux Polyimide" },
      { label: "Board Thickness", value: "0.08mm - 0.25mm" },
      { label: "Dynamic Bending", value: "> 100,000 Flex Cycles" },
      { label: "Copper Foil", value: "RA Rolled Annealed Copper" },
    ],
    turnaround: "⚡ 48h Express Flex",
    bestFor: "Wearable biomedical sensors, foldable displays, camera modules, IoT",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "rigid-flex-pcb",
    title: "Integrated Rigid-Flex PCB",
    subtitle: "Hybrid Rigid & Polyimide Flex Integration",
    category: "Flex & Rigid-Flex PCB",
    badge: "Aerospace Grade",
    imageUrl: "/images/generated/rigid_flex_pcb.png",
    description: "Eliminates bulky wire harnesses and solder connectors by integrating rigid multi-layer FR-4 sections directly with flexible polyimide circuits.",
    specs: [
      { label: "Structure", value: "2-16 Rigid + Flex Layers" },
      { label: "Transition Zone", value: "Seamless (Zero Connectors)" },
      { label: "Standards", value: "IPC-6013 Class 3 Compliant" },
      { label: "Stiffener Options", value: "FR-4, Stainless Steel, Aluminum" },
    ],
    turnaround: "⚡ 5-7 Days Precision Run",
    bestFor: "Aerospace avionics, military radar, surgical robotics, rugged sensors",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "aluminum-mcpcb",
    title: "Aluminum & Metal-Core PCB",
    subtitle: "Superior Heat Dissipation Substrates",
    category: "Advanced & RF Substrates",
    badge: "1-3 W/m.K Thermal",
    imageUrl: "/images/generated/aluminum_pcb.png",
    description: "Metal-backed circuit boards providing direct heat dissipation from high-power components to the chassis without requiring extra heatsinks.",
    specs: [
      { label: "Thermal Conductivity", value: "1.0 - 3.0 W/m.K" },
      { label: "Metal Base Type", value: "Aluminum 5052 / 6061 / Copper" },
      { label: "Breakdown Voltage", value: "> 3,000V AC Isolation" },
      { label: "Maximum Panel", value: "Up to 1200mm × 500mm" },
    ],
    turnaround: "⚡ 48h Quick Turn",
    bestFor: "High-lumen LED lighting, automotive headlights, audio amplifiers",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "high-frequency-rogers",
    title: "High Frequency RF & Microwave PCB",
    subtitle: "Low Loss Hydrocarbon & PTFE Substrates",
    category: "Advanced & RF Substrates",
    badge: "Rogers / PTFE",
    imageUrl: "/images/generated/high_freq_pcb.png",
    description: "Low dielectric loss (Df 0.002) and controlled dielectric constant (Dk 2.2 - 10.2) laminates engineered for high-frequency signal integrity up to 77GHz+.",
    specs: [
      { label: "Laminate Types", value: "Rogers RO4350B, RO4003C, Taconic" },
      { label: "Dielectric Constant", value: "Dk 2.2 - 10.2 (±0.04 Tolerance)" },
      { label: "Dissipation Factor", value: "Df 0.002 @ 10GHz" },
      { label: "Surface Finish", value: "Immersion Silver, ENIG, Hard Gold" },
    ],
    turnaround: "⚡ 3-5 Days High-Freq",
    bestFor: "5G telecom antennas, 77GHz automotive radar, RF transceivers, satellite",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "smt-assembly",
    title: "Automated High-Speed SMT Assembly",
    subtitle: "0201 Components & 0.4mm Fine-Pitch BGA",
    category: "Turnkey PCBA & Assembly",
    badge: "0201 & BGA Ready",
    imageUrl: "/images/generated/smt_assembly.png",
    description: "State-of-the-art automated pick-and-place lines featuring Yamaha and Panasonic mounters, 10-zone nitrogen reflow, and 3D AOI inspection.",
    specs: [
      { label: "Component Capability", value: "0201 passives, 0.4mm pitch BGA, QFN" },
      { label: "Placement Capacity", value: "60,000 components/hour/line" },
      { label: "Stencil Technology", value: "Electropolished Laser Stencil" },
      { label: "Quality Inspection", value: "3D AOI & 3D X-Ray BGA Testing" },
    ],
    turnaround: "⚡ 24h-48h Assembly",
    bestFor: "High-density microelectronics, IoT boards, consumer tech, robotics",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "tht-selective-soldering",
    title: "Through-Hole THT & Selective Soldering",
    subtitle: "Dual-Wave & Nitrogen Mini-Wave Soldering",
    category: "Turnkey PCBA & Assembly",
    badge: "Wave & Selective",
    imageUrl: "/images/generated/tht_assembly.png",
    description: "Automated selective wave soldering and manual through-hole assembly for rugged power connectors, inductors, transformers, and relays.",
    specs: [
      { label: "Soldering Tech", value: "Selective Nitrogen Wave Soldering" },
      { label: "Components Handled", value: "Heavy connectors, transformers, relays" },
      { label: "Workmanship Standard", value: "IPC-A-610 Class 2 & Class 3" },
      { label: "Board Wash", value: "Automated DI Water Ultrasonic Cleaning" },
    ],
    turnaround: "⚡ 3-5 Days Assembly",
    bestFor: "Industrial power supplies, automotive relay modules, audio equipment",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "full-turnkey-pcba",
    title: "Full Turnkey PCBA & Box Build",
    subtitle: "Complete BOM Sourcing, Assembly & System Integration",
    category: "Turnkey PCBA & Assembly",
    badge: "End-to-End Turnkey",
    imageUrl: "/images/generated/pcb4.png",
    description: "One-stop manufacturing: PCB fabrication, authentic component sourcing via authorized distributors, SMT/THT assembly, firmware flashing, and box build.",
    specs: [
      { label: "Component Sourcing", value: "100% Genuine Authorized Sources" },
      { label: "Testing Coverage", value: "ICT, Functional FCT, Hipot, Burn-In" },
      { label: "Box Build Services", value: "Custom enclosures, cables, packaging" },
      { label: "Quality Warranty", value: "100% Functional & Quality Guarantee" },
    ],
    turnaround: "⚡ Full Turnkey Batch",
    bestFor: "Startups, OEMs, volume product launches seeking single-source accountability",
    quoteUrl: "/pcb-quote",
  },
];

const categoryTabs = [
  "All Families",
  "Rigid & Multilayer PCB",
  "Flex & Rigid-Flex PCB",
  "Advanced & RF Substrates",
  "Turnkey PCBA & Assembly",
] as const;

export default function ProductCategoriesHub() {
  const dictionary = useDictionary();
  const prodCopy = dictionary.sections.products;
  const catCopy = dictionary.productCategories;

  const [activeTab, setActiveTab] = useState<string>("All Families");
  const [viewMode, setViewMode] = useState<"grid" | "matrix">("grid");
  const [activePreviewId, setActivePreviewId] = useState<string>(productFamiliesData[0].id);

  const categoryTabLabels: Record<string, string> = {
    "All Families": catCopy?.categories?.all || "All Families",
    "Rigid & Multilayer PCB": catCopy?.categories?.rigid || "Rigid & Multilayer PCB",
    "Flex & Rigid-Flex PCB": catCopy?.categories?.flex || "Flex & Rigid-Flex PCB",
    "Advanced & RF Substrates": catCopy?.categories?.advanced || "Advanced & RF Substrates",
    "Turnkey PCBA & Assembly": catCopy?.categories?.pcba || "Turnkey PCBA & Assembly",
  };

  const localizedFamilies = useMemo(() => {
    return productFamiliesData.map((item) => {
      const trans = catCopy?.items?.[item.id];
      if (!trans) return item;
      return {
        ...item,
        title: trans.title || item.title,
        subtitle: trans.subtitle || item.subtitle,
        description: trans.description || item.description,
        turnaround: trans.turnaround || item.turnaround,
        bestFor: trans.bestFor || item.bestFor,
      };
    });
  }, [catCopy]);

  const filteredFamilies = useMemo(() => {
    if (activeTab === "All Families") return localizedFamilies;
    return localizedFamilies.filter((item) => item.category === activeTab);
  }, [activeTab, localizedFamilies]);

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            {catCopy?.eyebrow || prodCopy.eyebrow || "Comprehensive Manufacturing Spectrum"}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {catCopy?.title || prodCopy.title || "PCB & PCBA Product Categories"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300 sm:text-base">
            {catCopy?.description || prodCopy.description || "Explore our main product families quickly with visual examples, physical stackup capabilities, and technical tolerances for each board type and assembly service."}
          </p>
        </div>

        {/* Interactive Controls & Category Switcher Bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
            {categoryTabs.map((tab) => {
              const count = tab === "All Families"
                ? productFamiliesData.length
                : productFamiliesData.filter((item) => item.category === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20"
                      : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400"
                  }`}
                >
                  <span>{categoryTabLabels[tab] || tab}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-2xs"
                  : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Grid className="size-3.5" />
              <span>{catCopy?.viewGrid || "Card Grid"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "matrix"
                  ? "bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-2xs"
                  : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Table className="size-3.5" />
              <span>{catCopy?.viewMatrix || "Comparison Matrix"}</span>
            </button>
          </div>
        </div>

        {/* View 1: Rich Visual Card Grid */}
        {viewMode === "grid" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFamilies.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-emerald-500/70 dark:hover:border-emerald-500 hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Visual Example Image Banner with Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-md bg-gray-900/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-black text-white shadow-xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        <Clock3 className="size-2.5" /> {item.turnaround}
                      </span>
                    </div>

                    {/* Gradient Overlay for subtle polish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Body Information */}
                  <div className="p-5 sm:p-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {item.category}
                    </div>

                    <h3 className="mt-1 text-lg font-black text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400 font-medium">
                      {item.subtitle}
                    </p>

                    <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-slate-300">
                      {item.description}
                    </p>

                    {/* Technical Specifications Grid */}
                    <div className="mt-5 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60 p-3.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-400 mb-2">
                        {catCopy?.labels?.specs || "Manufacturing Tolerances & Specs:"}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {item.specs.map((spec, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium">{spec.label}</span>
                            <span className="font-bold text-gray-900 dark:text-slate-100 truncate" title={spec.value}>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best For Tagline */}
                    <div className="mt-4 flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-slate-400">
                      <span className="font-bold text-gray-700 dark:text-slate-300 shrink-0">{catCopy?.labels?.bestFor || "Best for:"}</span>
                      <span className="leading-snug">{item.bestFor}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-gray-100 dark:border-slate-800 p-5 pt-4 bg-gray-50/30 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                  <Link
                    href={item.quoteUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition"
                  >
                    <span>{catCopy?.labels?.instantQuote || "Instant Custom Quote"}</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/gerber-view"
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-2xs transition"
                  >
                    <UploadCloud className="size-3 text-emerald-600 dark:text-emerald-400" /> {catCopy?.labels?.viewSpecs || "Free DFM"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View 2: Technical Comparison Matrix */}
        {viewMode === "matrix" && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/90 dark:bg-slate-800/90 text-gray-700 dark:text-slate-300">
                    <th className="px-5 py-4 font-black text-gray-900 dark:text-white">{catCopy?.labels?.matrixHeaderProduct || "Product Family"}</th>
                    <th className="px-4 py-4 font-extrabold">{catCopy?.labels?.matrixHeaderArch || "Classification"}</th>
                    <th className="px-4 py-4 font-extrabold">Layer Capacity</th>
                    <th className="px-4 py-4 font-extrabold">Min Trace / Space</th>
                    <th className="px-4 py-4 font-extrabold">Core Materials</th>
                    <th className="px-4 py-4 font-extrabold">{catCopy?.labels?.matrixHeaderTurn || "Turnaround Speed"}</th>
                    <th className="px-5 py-4 font-extrabold text-right">{catCopy?.labels?.matrixHeaderAction || "Instant Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredFamilies.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900 dark:text-slate-100">{item.title}</div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400">{item.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-md bg-gray-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-gray-700 dark:text-slate-300">
                          {item.category.split(" ")[0]}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900 dark:text-slate-100">
                        {item.badge}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {item.specs.find(s => s.label.includes("Trace"))?.value || item.specs[1]?.value || "Standard"}
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-slate-300 max-w-xs truncate" title={item.specs.find(s => s.label.includes("Surface") || s.label.includes("Substrate") || s.label.includes("Base"))?.value}>
                        {item.specs.find(s => s.label.includes("Surface") || s.label.includes("Substrate") || s.label.includes("Base"))?.value || "Standard IPC"}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                          {item.turnaround}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={item.quoteUrl}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition"
                        >
                          {catCopy?.labels?.instantQuote || "Quote"} <ArrowRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Fast Track: Drag-and-Drop Gerber & BOM Sourcing Shortcut */}
        <div className="mt-12 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/60 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 shrink-0 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <UploadCloud className="size-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {catCopy?.customTrack?.title || "Ready to fabricate your circuit boards or turnkey PCBA?"}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {catCopy?.customTrack?.description || "Upload your RS-274X Gerber, ODB++, or BOM file. Our automated CAM software validates your design rules with instant DFM analysis and direct factory pricing."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/pcb-quote"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all"
              >
                {catCopy?.customTrack?.uploadBtn || "Launch Instant Quote"} <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/gerber-view"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-xs sm:text-sm font-extrabold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-2xs transition-all"
              >
                <Microscope className="size-4 text-emerald-600 dark:text-emerald-400" /> {catCopy?.customTrack?.supportPill || "Free DFM Gerber Viewer"}
              </Link>
            </div>
          </div>

          {/* Quick Capability Guarantees */}
          <div className="mt-6 pt-5 border-t border-gray-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-between gap-4 text-xs text-gray-600 dark:text-slate-400 font-semibold">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> 1-32 Layers Rigid Multilayer</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> 0201 Passives & 0.4mm BGA Placement</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Rogers High-Frequency & DuPont Flex</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> 100% AOI & Flying Probe Testing</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> 24h & 48h Expedited Delivery</span>
          </div>
        </div>

      </div>
    </section>
  );
}
