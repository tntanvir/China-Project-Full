"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Mail,
  HelpCircle,
  UploadCloud,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Cpu,
  ShieldCheck,
  Package,
  Globe,
  Activity,
  Check,
  Plane,
  DollarSign,
  SlidersHorizontal,
  RefreshCw,
  Clock,
  Radio,
  Eye,
  Scan,
  Search,
  FileText,
  AlertCircle,
  Truck,
  Box,
  Gauge,
  Thermometer,
  Droplets,
  Wind,
  Flame,
  Award,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { getHowItWorksTranslation } from "@/lib/how-it-works-translations";

// Real-world sample boards for interactive CAD inspection
interface SampleBoardPreset {
  id: string;
  name: string;
  fileName: string;
  layersCount: number;
  dimensions: string;
  finish: string;
  maskColor: string;
  maskHex: string;
  price: string;
  leadTime: string;
  traces: "can" | "iot" | "fpga";
  description: string;
  specs: {
    tg: string;
    copperWeight: string;
    minDrill: string;
    minTrack: string;
    impedance: string;
  };
}

const SAMPLE_PRESETS: SampleBoardPreset[] = [
  {
    id: "stm32",
    name: "STM32 CAN-Bus Gateway",
    fileName: "STM32-Dual-CAN-Gateway.zip",
    layersCount: 4,
    dimensions: "100 × 80 mm",
    finish: "ENIG (Immersion Gold)",
    maskColor: "Classic Green",
    maskHex: "#064e3b",
    price: "$18.50 / 5 pcs",
    leadTime: "24h Rapid Turnaround",
    traces: "can",
    description: "4-Layer high-speed automotive gateway with matched differential impedance.",
    specs: {
      tg: "Tg150 FR4",
      copperWeight: "1 oz Outer / 0.5 oz Inner",
      minDrill: "0.25 mm",
      minTrack: "4 / 4 mil",
      impedance: "120Ω CAN-Bus Matched",
    },
  },
  {
    id: "esp32",
    name: "ESP32-S3 AIoT Sensor Hub",
    fileName: "ESP32-S3-AIoT-Sensor.zip",
    layersCount: 2,
    dimensions: "65 × 45 mm",
    finish: "Lead-Free HASL",
    maskColor: "Matte Black",
    maskHex: "#18181b",
    price: "$2.00 / 5 pcs",
    leadTime: "24h Express Dispatch",
    traces: "iot",
    description: "2-Layer ultra-low power wireless sensor with integrated PCB trace antenna.",
    specs: {
      tg: "Standard Tg135",
      copperWeight: "1 oz Finished Copper",
      minDrill: "0.30 mm",
      minTrack: "5 / 5 mil",
      impedance: "50Ω RF Antenna Trace",
    },
  },
  {
    id: "fpga",
    name: "Xilinx FPGA PCIe Carrier",
    fileName: "FPGA-UltraScale-PCIe.zip",
    layersCount: 6,
    dimensions: "135 × 90 mm",
    finish: "Hard Gold (PCIe Fingers)",
    maskColor: "Royal Blue",
    maskHex: "#1e3a8a",
    price: "$46.00 / 5 pcs",
    leadTime: "48h Multilayer Turnaround",
    traces: "fpga",
    description: "6-Layer High-Tg170 controlled impedance with 484-ball BGA matrix.",
    specs: {
      tg: "High-Tg170 Shengyi S1000-2",
      copperWeight: "2 oz Heavy Copper",
      minDrill: "0.20 mm Microvias",
      minTrack: "3.5 / 3.5 mil",
      impedance: "85Ω PCIe Gen4 Diff Pairs",
    },
  },
];

// Color palette options for interactive solder mask customization
const SOLDER_MASK_OPTIONS = [
  { name: "Classic Green", hex: "#064e3b", silkColor: "#ffffff", border: "#10b981" },
  { name: "Matte Black", hex: "#18181b", silkColor: "#ffffff", border: "#71717a" },
  { name: "Royal Blue", hex: "#1e3a8a", silkColor: "#ffffff", border: "#3b82f6" },
  { name: "Signal Red", hex: "#7f1d1d", silkColor: "#ffffff", border: "#ef4444" },
  { name: "Golden Yellow", hex: "#78350f", silkColor: "#000000", border: "#eab308" },
  { name: "Arctic White", hex: "#f1f5f9", silkColor: "#000000", border: "#cbd5e1" },
  { name: "Deep Purple", hex: "#581c87", silkColor: "#ffffff", border: "#a855f7" },
];

export default function HowItWorksClient() {
  const { locale } = useLanguage();
  const t = getHowItWorksTranslation(locale);

  // Video playback simulation states (real timers)
  const [playingState, setPlayingState] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const [playbackSeconds, setPlaybackSeconds] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const videoDurations: Record<number, number> = {
    1: 43,
    2: 32,
    3: 82,
    4: 30,
  };

  // Video playback timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaybackSeconds((prev) => {
        const next = { ...prev };
        let updated = false;
        for (const [idStr, isPlaying] of Object.entries(playingState)) {
          const id = Number(idStr);
          if (isPlaying) {
            const maxD = videoDurations[id] || 40;
            next[id] = (prev[id] || 0) >= maxD ? 0 : (prev[id] || 0) + 1;
            updated = true;
          }
        }
        return updated ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playingState]);

  const togglePlay = (id: number) => {
    setPlayingState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };


  // Block 1: CAD Layer Inspector vs Video
  const [activeMediaMode1, setActiveMediaMode1] = useState<"cad" | "video">("cad");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("stm32");
  const currentPreset =
    SAMPLE_PRESETS.find((p) => p.id === selectedPresetId) || SAMPLE_PRESETS[0];

  // Custom solder mask color state (live interactive board coloring)
  const [selectedMaskColor, setSelectedMaskColor] = useState<string>(currentPreset.maskHex);
  const [isLaserScanning, setIsLaserScanning] = useState<boolean>(true);

  // Update mask color when preset changes
  useEffect(() => {
    setSelectedMaskColor(currentPreset.maskHex);
  }, [currentPreset.maskHex]);

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    "Top Silk": true,
    "Solder Mask": true,
    "Top Copper (L1)": true,
    "Inner GND (L2)": false,
    "Inner PWR (L3)": false,
    "Bottom Copper (L4)": true,
  });

  // Block 2: Response Donut vs CAM DRC Simulator
  const [activeMediaMode2, setActiveMediaMode2] = useState<"chart" | "drc">("chart");
  const [activeDonutBracket, setActiveDonutBracket] = useState<string | null>("0-3h");
  const [isDrcScanning, setIsDrcScanning] = useState(false);
  const [drcScanned, setDrcScanned] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [expandedDrcRule, setExpandedDrcRule] = useState<number | null>(null);

  // Block 3: IoT Telemetry vs Machinery Video
  const [activeMediaMode3, setActiveMediaMode3] = useState<"telemetry" | "video">("telemetry");
  const [activeLineId, setActiveLineId] = useState<string>("ldi");
  const currentLine =
    t.shortenTurnaround.lines.find((l) => l.id === activeLineId) || t.shortenTurnaround.lines[0];

  // Block 4: Transit Flight Route vs Conveyor Video
  const [activeMediaMode4, setActiveMediaMode4] = useState<"transit" | "video">("transit");
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const selectedCountry =
    t.fasterDelivery.countries[selectedCountryIndex] || t.fasterDelivery.countries[0];
  const [activePackagingLayer, setActivePackagingLayer] = useState<number>(0);

  // Cost Transparency Quantity Selector (5 pcs, 50 pcs, 500 pcs)
  const [costBatchQty, setCostBatchQty] = useState<5 | 50 | 500>(5);

  // Section 6: Gerber Pre-Flight Dropzone Simulator State
  const [dropzoneState, setDropzoneState] = useState<"idle" | "analyzing" | "parsed">("idle");
  const [dropzoneResult, setDropzoneResult] = useState<{
    name: string;
    layers: number;
    dimensions: string;
    finish: string;
    price: string;
    turnaround: string;
    netsCount: number;
  }>({
    name: "STM32-Dual-CAN-Gateway.zip",
    layers: 4,
    dimensions: "100 × 80 mm",
    finish: "ENIG (Immersion Gold)",
    price: "$18.50 / 5 pcs",
    turnaround: "24h Rapid Turnaround",
    netsCount: 14820,
  });

  const simulateDropzone = (sample: {
    name: string;
    layers: number;
    dimensions: string;
    finish: string;
    price: string;
    turnaround: string;
    netsCount: number;
  }) => {
    setDropzoneState("analyzing");
    setTimeout(() => {
      setDropzoneResult(sample);
      setDropzoneState("parsed");
    }, 1100);
  };

  // FAQ Accordion & Category Filter
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>("");

  const toggleLayer = (layerName: string) => {
    setActiveLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const runDrcScan = () => {
    setIsDrcScanning(true);
    setDrcScanned(false);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDrcScanning(false);
          setDrcScanned(true);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };


  // Helper to split flight route string into individual airport steps
  const flightSteps = selectedCountry.flightRoute
    ? selectedCountry.flightRoute.split(/→|✈/).map((s) => s.trim())
    : ["Factory Hub", "International Port", "Destination"];

  // Filter FAQs based on search and category
  const filteredFaqs = t.faq.items.filter((item) => {
    const matchesSearch =
      faqSearchQuery === "" ||
      item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesSearch;
  });

  // Smooth scroll handler for the 4-phase journey bar
  const scrollToStep = (stepId: string) => {
    const el = document.getElementById(stepId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main
      key={locale}
      className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] text-slate-800 dark:text-slate-100 font-sans pb-28 relative overflow-x-hidden selection:bg-blue-600 selection:text-white"
    >
      {/* ========================================================================= */}
      {/* AMBIENT TECH BACKGROUND EFFECTS (Futuristic glow & cyber grid)           */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Glow Blob */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl opacity-70 dark:opacity-40" />
        {/* Subtle Side Ambient Blobs */}
        <div className="absolute top-[30%] -left-60 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-60 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl" />
        {/* Cyber Circuit Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-30 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_20%,#000_60%,transparent_100%)]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HERO & INTERACTIVE 4-PHASE STEERING BAR                            */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-10 sm:pt-14 pb-10 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md bg-white/70 dark:bg-slate-900/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              {/* Futuristic Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-3.5 shadow-xs">
                <span className="size-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-ping" />
                <span>FT PCB • Smart Factory & Turnkey Assembly</span>
                <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600">|</span>
                <span className="hidden sm:inline-block text-emerald-600 dark:text-emerald-400 font-bold lowercase">
                  live telemetry
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-cyan-300 bg-clip-text text-transparent">
                  {t.pageTitle}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {t.pageSubtitle}
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Link href="/pcb-quote">
                  <Zap className="mr-2 size-4" />
                  {t.quickActions.quotePcb}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-all"
              >
                <Link href="/pcb-assembly">
                  <Cpu className="mr-2 size-4 text-slate-500 dark:text-slate-400" />
                  {t.quickActions.quotePcba}
                </Link>
              </Button>
            </div>
          </div>

          {/* Smart Factory KPI Ticker Bar */}
          <div className="mt-8 pt-4 pb-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-6 overflow-x-auto text-[11px] font-mono text-slate-600 dark:text-slate-300 scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-white">Genesis2000 CAM:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">&lt; 2h Response</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-blue-500" />
              <span className="font-bold text-slate-800 dark:text-white">LDI Cleanroom:</span>
              <span>Class 10,000 ISO 7</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-amber-500" />
              <span className="font-bold text-slate-800 dark:text-white">Prototype Lead:</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">24h Rapid Turn</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-purple-500" />
              <span className="font-bold text-slate-800 dark:text-white">Quality Standard:</span>
              <span>IPC-6012 Class 2 / 3</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="size-2 rounded-full bg-cyan-500" />
              <span className="font-bold text-slate-800 dark:text-white">Air Cargo Priority:</span>
              <span>DHL / FedEx Priority</span>
            </div>
          </div>

          {/* Interactive 4-Phase Stepper Tracker (Click to jump to step) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
            {[
              {
                id: "step-1",
                num: "01",
                title: "Instant Quoting",
                sub: "CAD & Gerber DFM Parser",
                icon: Zap,
                gradient: "from-blue-600 to-cyan-600",
              },
              {
                id: "step-2",
                num: "02",
                title: "CAM Engineering",
                sub: "< 2h Response Window",
                icon: ShieldCheck,
                gradient: "from-cyan-600 to-blue-600",
              },
              {
                id: "step-3",
                num: "03",
                title: "Smart Fabrication",
                sub: "24h Rapid Prototype",
                icon: Activity,
                gradient: "from-indigo-600 to-blue-600",
              },
              {
                id: "step-4",
                num: "04",
                title: "Global Express",
                sub: "2-3 Days Priority Door-to-Door",
                icon: Plane,
                gradient: "from-emerald-600 to-teal-600",
              },
            ].map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => scrollToStep(step.id)}
                className="group p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 hover:border-blue-500/80 dark:hover:border-cyan-400/80 shadow-xs hover:shadow-md transition-all duration-300 text-left cursor-pointer relative overflow-hidden"
              >
                {/* Subtle Hover Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className={`size-9 rounded-xl bg-gradient-to-br ${step.gradient} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    {step.num}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {step.sub}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE ZIG-ZAG 4-BLOCK WORKFLOW                                          */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 space-y-20 sm:space-y-32 relative z-10">
        {/* --------------------------------------------------------------------- */}
        {/* BLOCK 1: Realize Easier Ordering (Video/CAD Left, Card Right)         */}
        {/* --------------------------------------------------------------------- */}
        <div id="step-1" className="scroll-mt-24 relative grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual / Interactive Box (Left) */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between aspect-[16/12] sm:aspect-[16/11] relative group">
            {/* Top Switcher Bar */}
            <div className="p-3 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-20 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMediaMode1("cad")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode1 === "cad"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Eye className="size-3.5" />
                  <span>CAD Visualizer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaMode1("video")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode1 === "video"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Play className="size-3.5" />
                  <span>Factory Video</span>
                </button>
              </div>

              {/* Sample Preset Selector */}
              {activeMediaMode1 === "cad" ? (
                <div className="flex items-center gap-1">
                  {SAMPLE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(p.id);
                        setSelectedMaskColor(p.maskHex);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                        selectedPresetId === p.id
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white/10 text-slate-300 hover:text-white"
                      }`}
                      title={p.description}
                    >
                      {p.id.toUpperCase()}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                  {currentPreset.price}
                </div>
              )}
            </div>

            {/* Media Body */}
            {activeMediaMode1 === "cad" ? (
              <div className="relative flex-1 p-3 sm:p-4 flex flex-col justify-between bg-[#040812] overflow-hidden">
                {/* Laser AOI Scanner line */}
                {isLaserScanning && (
                  <motion.div
                    className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-30 pointer-events-none"
                    animate={{ top: ["8%", "82%", "8%"] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Simulated Circuit Board Graphic with Layer Stack */}
                <div className="relative flex-1 rounded-xl border border-blue-500/25 bg-[#03060f] p-2.5 sm:p-3 flex flex-col justify-center items-center overflow-hidden">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:16px_16px]" />

                  {/* SVG CAD Board Preview */}
                  <div
                    className="relative z-10 w-full max-w-[370px] aspect-[16/10] rounded-xl border-2 border-emerald-500/60 p-3 shadow-2xl flex flex-col justify-between overflow-hidden transition-colors duration-500"
                    style={{ backgroundColor: activeLayers["Solder Mask"] ? selectedMaskColor : "#111827" }}
                  >
                    {/* Header info */}
                    <div className="flex justify-between items-start text-[9px] font-mono text-emerald-300 z-10">
                      <span className="font-bold truncate max-w-[210px] drop-shadow">
                        FT-PCB • {currentPreset.name}
                      </span>
                      <span className="text-amber-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">
                        {currentPreset.dimensions}
                      </span>
                    </div>

                    {/* SVG Circuit Artwork Rendering based on layer states & current preset */}
                    <div className="relative flex-1 my-1">
                      <svg
                        viewBox="0 0 320 120"
                        className="w-full h-full"
                        style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.6))" }}
                      >
                        {/* 4 Corner M3 Mounting Holes */}
                        <circle cx="15" cy="15" r="7" fill="#040913" stroke="#eab308" strokeWidth="2" />
                        <circle cx="305" cy="15" r="7" fill="#040913" stroke="#eab308" strokeWidth="2" />
                        <circle cx="15" cy="105" r="7" fill="#040913" stroke="#eab308" strokeWidth="2" />
                        <circle cx="305" cy="105" r="7" fill="#040913" stroke="#eab308" strokeWidth="2" />

                        {/* Inner Ground Plane (L2) */}
                        {activeLayers["Inner GND (L2)"] && (
                          <rect
                            x="25"
                            y="10"
                            width="270"
                            height="100"
                            rx="4"
                            fill="#0284c7"
                            fillOpacity="0.35"
                            stroke="#38bdf8"
                            strokeWidth="1"
                            strokeDasharray="4 2"
                          />
                        )}

                        {/* Inner Power Plane (L3) */}
                        {activeLayers["Inner PWR (L3)"] && (
                          <rect
                            x="35"
                            y="18"
                            width="250"
                            height="84"
                            rx="4"
                            fill="#9333ea"
                            fillOpacity="0.3"
                            stroke="#c084fc"
                            strokeWidth="1"
                          />
                        )}

                        {/* Bottom Copper (L4) */}
                        {activeLayers["Bottom Copper (L4)"] && (
                          <g stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.55" fill="none">
                            <path d="M 40 85 L 110 85 L 140 100 L 220 100" />
                            <path d="M 50 95 L 115 95 L 145 108 L 240 108" />
                          </g>
                        )}

                        {/* Top Copper Traces (L1) based on preset */}
                        {activeLayers["Top Copper (L1)"] && (
                          <g fill="none">
                            {currentPreset.traces === "can" && (
                              <>
                                {/* Central IC (STM32 LQFP) */}
                                <rect
                                  x="135"
                                  y="35"
                                  width="50"
                                  height="50"
                                  fill="#1e293b"
                                  stroke="#eab308"
                                  strokeWidth="1.5"
                                />
                                {[42, 49, 56, 63, 70, 77].map((y, idx) => (
                                  <React.Fragment key={idx}>
                                    <rect x="127" y={y} width="7" height="3" fill="#fbbf24" rx="0.5" />
                                    <rect x="186" y={y} width="7" height="3" fill="#fbbf24" rx="0.5" />
                                  </React.Fragment>
                                ))}
                                {[142, 149, 156, 163, 170, 177].map((x, idx) => (
                                  <React.Fragment key={idx}>
                                    <rect x={x} y="27" width="3" height="7" fill="#fbbf24" rx="0.5" />
                                    <rect x={x} y="86" width="3" height="7" fill="#fbbf24" rx="0.5" />
                                  </React.Fragment>
                                ))}
                                <path
                                  d="M 50 45 L 85 45 L 105 60 L 127 60"
                                  stroke="#fbbf24"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M 50 51 L 83 51 L 103 66 L 127 66"
                                  stroke="#fbbf24"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <rect x="220" y="42" width="12" height="6" fill="#fbbf24" rx="1" />
                                <rect x="220" y="52" width="12" height="6" fill="#fbbf24" rx="1" />
                                <path
                                  d="M 186 48 L 220 45"
                                  stroke="#fbbf24"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M 186 55 L 220 55"
                                  stroke="#fbbf24"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </>
                            )}

                            {currentPreset.traces === "iot" && (
                              <>
                                {/* ESP32 Module Footprint & Meandered Antenna */}
                                <rect
                                  x="140"
                                  y="25"
                                  width="70"
                                  height="70"
                                  fill="#1e293b"
                                  stroke="#eab308"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M 40 30 L 70 30 L 70 40 L 50 40 L 50 50 L 70 50 L 70 60 L 50 60 L 50 70 L 80 70"
                                  stroke="#fbbf24"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                />
                                <rect x="240" y="45" width="14" height="20" fill="#fbbf24" rx="1" />
                                <path
                                  d="M 210 55 L 240 55"
                                  stroke="#fbbf24"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </>
                            )}

                            {currentPreset.traces === "fpga" && (
                              <>
                                {/* High-Density BGA Grid & PCIe Fingers */}
                                <rect
                                  x="130"
                                  y="25"
                                  width="60"
                                  height="60"
                                  fill="#0f172a"
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                />
                                {[35, 45, 55, 65, 75].map((x) =>
                                  [32, 42, 52, 62, 72].map((y) => (
                                    <circle key={`${x}-${y}`} cx={x + 100} cy={y} r="1.5" fill="#fbbf24" />
                                  ))
                                )}
                                {[20, 28, 36, 44, 52, 60, 68, 76, 84, 92].map((y, idx) => (
                                  <rect key={idx} x="10" y={y} width="16" height="5" fill="#f59e0b" rx="0.5" />
                                ))}
                                <path d="M 30 45 L 80 45 L 100 50 L 130 50" stroke="#38bdf8" strokeWidth="1.5" />
                                <path d="M 30 55 L 80 55 L 100 60 L 130 60" stroke="#38bdf8" strokeWidth="1.5" />
                              </>
                            )}

                            {/* Vias with Gold Annular Rings */}
                            {[
                              [75, 30],
                              [95, 30],
                              [115, 30],
                              [250, 40],
                              [270, 40],
                              [250, 80],
                              [270, 80],
                            ].map(([vx, vy], idx) => (
                              <g key={idx}>
                                <circle cx={vx} cy={vy} r="4" fill="#fbbf24" />
                                <circle cx={vx} cy={vy} r="2" fill="#040913" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* Top Silkscreen White Markings */}
                        {activeLayers["Top Silk"] && (
                          <g fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold">
                            <text x="160" y="65" textAnchor="middle" fill="#ffffff" fontSize="7">
                              {currentPreset.id.toUpperCase()}
                            </text>
                            <circle cx="132" cy="38" r="1.5" fill="#ffffff" />
                            <text x="40" y="24" fontSize="6">
                              {currentPreset.fileName}
                            </text>
                            <text x="210" y="105" fontSize="6">
                              FT-PCB IPC-6012
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* Bottom Status */}
                    <div className="flex justify-between items-end text-[9px] font-mono text-slate-300 z-10">
                      <span>{currentPreset.layersCount}L FR4 • {currentPreset.finish}</span>
                      <span className="text-emerald-400 font-bold bg-black/40 px-1.5 py-0.5 rounded">
                        {currentPreset.leadTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Solder Mask Color Switcher & AOI Laser Toggle */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Mask:
                    </span>
                    <div className="flex items-center gap-1">
                      {SOLDER_MASK_OPTIONS.map((mask) => (
                        <button
                          key={mask.name}
                          type="button"
                          onClick={() => setSelectedMaskColor(mask.hex)}
                          className={`size-4 rounded-full border transition-transform cursor-pointer ${
                            selectedMaskColor === mask.hex
                              ? "scale-125 ring-2 ring-blue-400 border-white"
                              : "border-white/30 hover:scale-110"
                          }`}
                          style={{ backgroundColor: mask.hex }}
                          title={mask.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Laser Scan Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsLaserScanning(!isLaserScanning)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1 border ${
                      isLaserScanning
                        ? "bg-cyan-950 text-cyan-300 border-cyan-700"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <Scan className="size-3" />
                    <span>AOI Scanner: {isLaserScanning ? "ON" : "OFF"}</span>
                  </button>
                </div>

                {/* Layer Toggle Pills */}
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {t.easierOrdering.layers.map((layer) => {
                      const isActive = activeLayers[layer] ?? true;
                      return (
                        <button
                          key={layer}
                          type="button"
                          onClick={() => toggleLayer(layer)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer border ${
                            isActive
                              ? "bg-blue-600/90 text-white border-blue-400 shadow-xs"
                              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          {isActive ? "✓ " : "○ "}
                          {layer}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex-1 bg-black flex items-center justify-center group/video">
                <Image
                  src="/images/company-profile/page_14.jpg"
                  alt="Realize Easier Ordering"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover brightness-95"
                />

                <button
                  type="button"
                  onClick={() => togglePlay(1)}
                  className="size-16 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-sm transition z-10 cursor-pointer shadow-lg hover:scale-110"
                  aria-label="Play video"
                >
                  {playingState[1] ? <Pause className="size-7" /> : <Play className="size-7 ml-1" />}
                </button>
              </div>
            )}

            {/* Video Controls Bottom Bar with Real Scrubber Progress */}
            <div className="bg-slate-950 p-2.5 px-4 z-10 flex items-center justify-between text-white text-xs select-none border-t border-white/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => togglePlay(1)}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  {playingState[1] ? <Pause className="size-4" /> : <Play className="size-4" />}
                </button>
                <span className="font-mono text-[11px] opacity-90">
                  {formatSeconds(playbackSeconds[1])} / 0:43
                </span>
              </div>

              <div
                className="flex-1 mx-4 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setPlaybackSeconds((prev) => ({ ...prev, 1: Math.round(pos * 43) }));
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(playbackSeconds[1] / 43) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-3 opacity-80 hover:opacity-100">
                <Volume2 className="size-4 cursor-pointer" />
                <Maximize2 className="size-4 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Luxury Info Card (Right) */}
          <div className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-xl relative space-y-6">
            {/* Step Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider">
              <span>Step 01 • Instant Gerber Parser</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {t.easierOrdering.titlePrefix}
                <span className="text-blue-600 dark:text-cyan-400 font-black">
                  {t.easierOrdering.highlightWord}
                </span>
                {t.easierOrdering.titleSuffix}
              </h2>
              {/* Vibrant Accent Line */}
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mt-3" />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.easierOrdering.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Spec Matrix Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Dielectric</div>
                <div className="text-xs font-extrabold text-slate-800 dark:text-white mt-0.5">
                  {currentPreset.specs.tg}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Min Track/Space</div>
                <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {currentPreset.specs.minTrack}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Min Drill</div>
                <div className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 mt-0.5">
                  {currentPreset.specs.minDrill}
                </div>
              </div>
            </div>

            {t.easierOrdering.bulletPoints && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {t.easierOrdering.bulletPoints.map((bp, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button
                asChild
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                <Link href="/pcb-quote">
                  Upload Gerber to Test Parser →
                </Link>
              </Button>
            </div>
          </div>

        </div>

        {/* --------------------------------------------------------------------- */}
        {/* BLOCK 2: Make Customer Service Efficient (Card Left, Graphic Right)   */}
        {/* --------------------------------------------------------------------- */}
        <div id="step-2" className="scroll-mt-24 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Luxury Card (Left) */}
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-xl relative space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-900 text-cyan-700 dark:text-cyan-400 text-xs font-black uppercase tracking-wider">
              <span>Step 02 • Dedicated CAM Review</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {t.customerService.titlePrefix}
                <span className="text-blue-600 dark:text-cyan-400 font-black">
                  {t.customerService.highlightWord}
                </span>
                {t.customerService.titleSuffix}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-3" />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.customerService.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Engineer Availability Badge Grid */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {t.customerService.engineersOnline}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Shenzhen & Huizhou Engineering Centers
                  </div>
                </div>
              </div>
              <span className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {t.customerService.bulletPoints && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {t.customerService.bulletPoints.map((bp, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Response Time Donut Chart / DRC Simulator (Right) */}
          <div className="lg:col-span-6 order-1 lg:order-2 rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[16/12] sm:aspect-[16/11] flex flex-col justify-between">
            {/* Top Switcher */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMediaMode2("chart")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode2 === "chart"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Clock className="size-3.5" />
                  <span>Response Time</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaMode2("drc")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode2 === "drc"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Scan className="size-3.5" />
                  <span>CAM DRC Simulator</span>
                </button>
              </div>

              <div className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Audited Genesis2000 Records</span>
              </div>
            </div>

            {/* Mode 1: Donut Chart */}
            {activeMediaMode2 === "chart" ? (
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="text-center mb-4">
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 tracking-wide">
                    {t.customerService.chartTitle}
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 my-auto">
                  {/* Circular SVG Donut */}
                  <div className="relative size-36 sm:size-44 flex items-center justify-center shrink-0">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth="11"
                        className="dark:stroke-slate-800"
                      />
                      {/* Segment 1: 0-3 hours (78%) - Cyan */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#0284c7"
                        strokeWidth="11"
                        strokeDasharray="238.7"
                        strokeDashoffset="52.5"
                        strokeLinecap="round"
                        className="cursor-pointer hover:opacity-80 transition"
                        onClick={() => setActiveDonutBracket("0-3h")}
                      />
                      {/* Segment 2: 3-6 hours (16%) - Emerald */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="11"
                        strokeDasharray="238.7"
                        strokeDashoffset="200"
                        className="cursor-pointer hover:opacity-80 transition"
                        onClick={() => setActiveDonutBracket("3-6h")}
                      />
                      {/* Segment 3: 6-12 hours (6%) - Slate */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#64748b"
                        strokeWidth="11"
                        strokeDasharray="238.7"
                        strokeDashoffset="224"
                        className="cursor-pointer hover:opacity-80 transition"
                        onClick={() => setActiveDonutBracket("6-12h")}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {t.customerService.chartAvgValue}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 max-w-[85px] leading-tight mt-0.5">
                        {t.customerService.chartAvgLabel}
                      </span>
                    </div>
                  </div>

                  {/* Legend Stack */}
                  <div className="space-y-2.5 text-xs sm:text-sm font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveDonutBracket("0-3h")}
                      className={`flex items-center gap-2.5 text-left transition cursor-pointer p-1.5 rounded-xl ${
                        activeDonutBracket === "0-3h"
                          ? "bg-blue-100 dark:bg-blue-950/80 ring-1 ring-blue-500/50"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="size-3 rounded-full bg-[#0284c7] shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">{t.customerService.legend1}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDonutBracket("3-6h")}
                      className={`flex items-center gap-2.5 text-left transition cursor-pointer p-1.5 rounded-xl ${
                        activeDonutBracket === "3-6h"
                          ? "bg-emerald-100 dark:bg-emerald-950/80 ring-1 ring-emerald-500/50"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="size-3 rounded-full bg-[#10b981] shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">{t.customerService.legend2}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDonutBracket("6-12h")}
                      className={`flex items-center gap-2.5 text-left transition cursor-pointer p-1.5 rounded-xl ${
                        activeDonutBracket === "6-12h"
                          ? "bg-slate-200 dark:bg-slate-800 ring-1 ring-slate-500/50"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="size-3 rounded-full bg-[#64748b] shrink-0" />
                      <span className="text-slate-800 dark:text-slate-200">{t.customerService.legend3}</span>
                    </button>
                    <div className="text-[10px] text-slate-400 font-normal pt-1">
                      {t.customerService.chartFootnote}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mode 2: Live Interactive DRC Simulator */
              <div className="flex-1 p-5 flex flex-col justify-between bg-white dark:bg-slate-900 space-y-3 relative overflow-hidden">
                {isDrcScanning && (
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] z-20 transition-all duration-300"
                    style={{ top: `${scanProgress}%` }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-800 dark:text-white">
                    {t.customerService.interactiveTitle}
                  </div>
                  <Button
                    size="sm"
                    onClick={runDrcScan}
                    disabled={isDrcScanning}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] h-7 px-3 rounded-lg cursor-pointer"
                  >
                    {isDrcScanning ? `${scanProgress}% Checking...` : t.customerService.drcBtn}
                  </Button>
                </div>

                {/* Rules List with Real PASS Badges and Clickable details */}
                <div className="space-y-1.5 flex-1">
                  {t.customerService.drcRules.map((rule, idx) => {
                    const isExpanded = expandedDrcRule === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setExpandedDrcRule(isExpanded ? null : idx)}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs cursor-pointer hover:border-blue-400/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-blue-500" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {rule.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                              {rule.result}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                              PASS
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                            Verified against IPC-2221 Class 2/3 tolerances. Zero acid traps, slivers, or starved thermal relief detected by Genesis2000 CAM kernel.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] text-center font-bold text-emerald-600 dark:text-emerald-400">
                  {drcScanned ? t.customerService.drcComplete : "Automated 120+ Rule Pre-Flight Inspection Ready"}
                </div>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="bg-slate-950 p-2.5 px-4 z-10 flex items-center justify-between text-white text-xs select-none">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => togglePlay(2)}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  {playingState[2] ? <Pause className="size-4" /> : <Play className="size-4" />}
                </button>
                <span className="font-mono text-[11px] opacity-90">
                  {formatSeconds(playbackSeconds[2])} / 0:32
                </span>
              </div>

              <div
                className="flex-1 mx-4 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setPlaybackSeconds((prev) => ({ ...prev, 2: Math.round(pos * 32) }));
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(playbackSeconds[2] / 32) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2.5 opacity-80">
                <Volume2 className="size-3.5" />
                <Maximize2 className="size-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* BLOCK 3: Shorten Turnaround Time (Video/IoT Left, Card Right)         */}
        {/* --------------------------------------------------------------------- */}
        <div id="step-3" className="scroll-mt-24 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Smart Factory Line Telemetry Box (Left) */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200/90 dark:border-slate-800 aspect-[16/12] sm:aspect-[16/11] flex flex-col justify-between relative group">
            {/* Top Switcher */}
            <div className="p-3 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-20 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMediaMode3("telemetry")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode3 === "telemetry"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Activity className="size-3.5" />
                  <span>Cleanroom IoT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaMode3("video")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode3 === "video"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Play className="size-3.5" />
                  <span>Machinery Video</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>SCADA Live Stream</span>
              </span>
            </div>

            {/* Middle: Machinery Photo Background + Live Telemetry Cards */}
            {activeMediaMode3 === "telemetry" ? (
              <div className="relative flex-1 p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden">
                <Image
                  src="/images/company-profile/page_26.jpg"
                  alt="Shorten Turnaround Time"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover brightness-35 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Cleanroom Sensor Bar */}
                <div className="relative z-10 grid grid-cols-3 gap-2 text-[10px] font-mono bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-white/15 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="size-3.5 text-emerald-400" />
                    <span>22.2°C</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplets className="size-3.5 text-cyan-400" />
                    <span>51.8% RH</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Wind className="size-3.5 text-amber-400" />
                    <span className="truncate">ISO 7 / 10k</span>
                  </div>
                </div>

                {/* 3 Machine Line Selectors */}
                <div className="relative z-10 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none my-auto">
                  {t.shortenTurnaround.lines.map((line) => {
                    const isSel = line.id === activeLineId;
                    return (
                      <button
                        key={line.id}
                        type="button"
                        onClick={() => setActiveLineId(line.id)}
                        className={`px-3 py-1.5 rounded-xl text-left text-xs transition cursor-pointer border shrink-0 ${
                          isSel
                            ? "bg-blue-600/90 text-white border-blue-400 shadow-md"
                            : "bg-black/75 text-slate-300 border-white/10 hover:text-white"
                        }`}
                      >
                        <div className="font-bold text-[11px] truncate">{line.name.split(":")[0]}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Line Live Telemetry HUD */}
                <div className="relative z-10 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 p-3.5 text-white space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xs text-blue-300 truncate max-w-[220px]">
                      {currentLine.name}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ● {currentLine.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {currentLine.machine}
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-[11px] font-mono text-emerald-400 font-bold">
                    <span>{currentLine.metric}</span>
                    <span className="text-slate-400 font-normal">OEE: 99.4% Active</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex-1 bg-black flex items-center justify-center group/video">
                <Image
                  src="/images/company-profile/page_26.jpg"
                  alt="Shorten Turnaround Video"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover brightness-95"
                />

                <button
                  type="button"
                  onClick={() => togglePlay(3)}
                  className="size-16 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-sm transition z-10 cursor-pointer shadow-lg hover:scale-110"
                  aria-label="Play video"
                >
                  {playingState[3] ? <Pause className="size-7" /> : <Play className="size-7 ml-1" />}
                </button>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="bg-slate-950 p-2.5 px-4 z-10 flex items-center justify-between text-white text-xs select-none border-t border-white/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => togglePlay(3)}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  {playingState[3] ? <Pause className="size-4" /> : <Play className="size-4" />}
                </button>
                <span className="font-mono text-[11px] opacity-90">
                  {formatSeconds(playbackSeconds[3])} / 1:22
                </span>
              </div>

              <div
                className="flex-1 mx-4 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setPlaybackSeconds((prev) => ({ ...prev, 3: Math.round(pos * 82) }));
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(playbackSeconds[3] / 82) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-3 opacity-80 hover:opacity-100">
                <Volume2 className="size-4 cursor-pointer" />
                <Maximize2 className="size-4 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Luxury Card (Right) */}
          <div className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-xl relative space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
              <span>Step 03 • Smart Factory Fabrication</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {t.shortenTurnaround.titlePrefix}
                <span className="text-blue-600 dark:text-cyan-400 font-black">
                  {t.shortenTurnaround.highlightWord}
                </span>
                {t.shortenTurnaround.titleSuffix}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mt-3" />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.shortenTurnaround.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Quick Stat Pill Grid */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50/50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {t.shortenTurnaround.stat1Label}
                </div>
                <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
                  {t.shortenTurnaround.stat1Value}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {t.shortenTurnaround.stat2Label}
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {t.shortenTurnaround.stat2Value}
                </div>
              </div>
            </div>

            {t.shortenTurnaround.bulletPoints && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {t.shortenTurnaround.bulletPoints.map((bp, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* BLOCK 4: Make Delivery Faster (Card Left, Graphic Right)              */}
        {/* --------------------------------------------------------------------- */}
        <div id="step-4" className="scroll-mt-24 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Luxury Card (Left) */}
          <div className="lg:col-span-6 order-2 lg:order-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 shadow-xl relative space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
              <span>Step 04 • Express Logistics</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {t.fasterDelivery.titlePrefix}
                <span className="text-blue-600 dark:text-cyan-400 font-black">
                  {t.fasterDelivery.highlightWord}
                </span>
                {t.fasterDelivery.titleSuffix}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-3" />
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.fasterDelivery.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Courier Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              {t.fasterDelivery.couriers.map((c, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-2xs"
                >
                  <Plane className="size-3.5 text-blue-500" />
                  <span>{c}</span>
                </span>
              ))}
            </div>

            {t.fasterDelivery.bulletPoints && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {t.fasterDelivery.bulletPoints.map((bp, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logistics Transit & Flight Route Simulator Box (Right) */}
          <div className="lg:col-span-6 order-1 lg:order-2 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200/90 dark:border-slate-800 aspect-[16/12] sm:aspect-[16/11] flex flex-col justify-between relative group">
            {/* Top Bar Switcher */}
            <div className="p-3 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-20 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMediaMode4("transit")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode4 === "transit"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Plane className="size-3.5" />
                  <span>Air Route Explorer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaMode4("video")}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 ${
                    activeMediaMode4 === "video"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Play className="size-3.5" />
                  <span>Logistics Video</span>
                </button>
              </div>

              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800 flex items-center gap-1">
                <Box className="size-3" />
                <span>{t.fasterDelivery.statShipping}</span>
              </span>
            </div>

            {/* Interactive Country Selector & Result HUD */}
            {activeMediaMode4 === "transit" ? (
              <div className="relative flex-1 p-3.5 sm:p-5 flex flex-col justify-between bg-[#060c18]">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-bold text-slate-300">
                      {t.fasterDelivery.selectCountryLabel}
                    </label>
                    <select
                      value={selectedCountryIndex}
                      onChange={(e) => setSelectedCountryIndex(Number(e.target.value))}
                      className="rounded-xl bg-slate-800 border border-slate-700 text-white text-xs px-3 py-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      {t.fasterDelivery.countries.map((c, idx) => (
                        <option key={idx} value={idx}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Flight Itinerary Progression */}
                  <div className="p-3 rounded-2xl bg-slate-950/90 border border-blue-500/30 text-white space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400 flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5">
                        <Plane className="size-3 text-blue-400" />
                        <span>{t.fasterDelivery.flightRouteLabel}</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-normal">Daily Cutoff: 18:00 (GMT+8)</span>
                    </div>

                    {/* Step-by-step Airport Hops */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px] font-mono">
                      {flightSteps.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-200 shrink-0">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-bold">{step}</span>
                          </div>
                          {idx < flightSteps.length - 1 && (
                            <span className="text-slate-500 text-[10px]">✈</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Country Calculation HUD Card */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-white space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{t.fasterDelivery.transitLabel}</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {selectedCountry.transit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{t.fasterDelivery.courierLabel}</span>
                      <span className="font-bold text-slate-200">
                        {selectedCountry.courier}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">{t.fasterDelivery.customsLabel}</span>
                      <span className="text-amber-300 font-medium">
                        {selectedCountry.customs}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5-Layer Packaging Standard Box */}
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/10 text-white space-y-1.5 mt-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Package className="size-3.5" />
                      <span>{t.fasterDelivery.packagingTitle}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">Click to inspect</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300">
                    {t.fasterDelivery.packagingLayers.slice(0, 4).map((layer, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePackagingLayer(idx)}
                        className={`flex items-center gap-1.5 truncate p-1 rounded-lg text-left transition cursor-pointer ${
                          activePackagingLayer === idx
                            ? "bg-blue-900/50 text-cyan-300 border border-blue-700/50"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span className="truncate">{layer}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex-1 bg-black flex items-center justify-center group/video">
                <Image
                  src="/images/company-profile/page_12.jpg"
                  alt="Logistics Conveyor Video"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover brightness-95"
                />

                <button
                  type="button"
                  onClick={() => togglePlay(4)}
                  className="size-16 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-sm transition z-10 cursor-pointer shadow-lg hover:scale-110"
                  aria-label="Play video"
                >
                  {playingState[4] ? <Pause className="size-7" /> : <Play className="size-7 ml-1" />}
                </button>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="bg-slate-950 p-2.5 px-4 z-10 flex items-center justify-between text-white text-xs select-none border-t border-white/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => togglePlay(4)}
                  className="hover:text-blue-400 transition cursor-pointer"
                >
                  {playingState[4] ? <Pause className="size-4" /> : <Play className="size-4" />}
                </button>
                <span className="font-mono text-[11px] opacity-90">
                  {formatSeconds(playbackSeconds[4])} / 0:30
                </span>
              </div>

              <div
                className="flex-1 mx-4 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setPlaybackSeconds((prev) => ({ ...prev, 4: Math.round(pos * 30) }));
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(playbackSeconds[4] / 30) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-3 opacity-80 hover:opacity-100">
                <Volume2 className="size-4 cursor-pointer" />
                <Maximize2 className="size-4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 100% FACTORY DIRECT COST TRANSPARENCY                                  */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 relative z-10">
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-900">
                <DollarSign className="size-3.5" />
                <span>{t.costTransparency.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {t.costTransparency.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
                {t.costTransparency.desc}
              </p>
            </div>

            {/* Batch Size Selector Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 px-2">Batch:</span>
              {[5, 50, 500].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setCostBatchQty(qty as 5 | 50 | 500)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    costBatchQty === qty
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {qty} pcs
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-black text-slate-400 uppercase tracking-wider">
                  <th className="pb-3.5 pr-4">Production Cost Element</th>
                  <th className="pb-3.5 px-4 text-blue-600 dark:text-cyan-400">
                    {t.costTransparency.factoryLabel}
                  </th>
                  <th className="pb-3.5 pl-4 text-slate-500 dark:text-slate-400">
                    {t.costTransparency.brokerLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {t.costTransparency.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-blue-500" />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.factory}
                    </td>
                    <td className="py-3.5 pl-4 font-mono text-slate-500 dark:text-slate-400">
                      {item.broker}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              <span>{t.costTransparency.savingsNote}</span>
            </div>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              <Link href="/pcb-quote">
                Calculate Exact Factory Price →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TECHNICAL DFM & PRODUCTION FAQ SECTION                                 */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider mb-3 border border-blue-200 dark:border-blue-900">
            <HelpCircle className="size-3.5" />
            <span>Engineering Knowledgebase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.faq.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mx-auto mt-3" />
        </div>

        {/* FAQ Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. Gerber, stackup, turnaround, shipping)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {faqSearchQuery && (
            <button
              type="button"
              onClick={() => setFaqSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* FAQ List */}
        <div className="space-y-3.5 max-w-4xl mx-auto">
          {filteredFaqs.map((item, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 border ${
                  isExpanded
                    ? "bg-white dark:bg-slate-900/90 border-blue-500/50 shadow-md ring-1 ring-blue-500/20"
                    : "bg-white/70 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-blue-600 dark:hover:text-cyan-400 transition cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="size-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0">
                      Q
                    </span>
                    <span>{item.q}</span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="size-4 shrink-0 text-blue-600 dark:text-cyan-400" />
                  ) : (
                    <ChevronDown className="size-4 shrink-0 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THREE DIRECT SUPPORT CONTACT CHANNELS                                  */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#070e1c] border border-slate-700/80 p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-700/80">
            {/* Channel 1: Online Chat */}
            <div className="pt-4 md:pt-0 md:px-6 first:pt-0 first:px-0 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <MessageSquare className="size-4" />
                </div>
                <Link
                  href="/contact"
                  className="text-base font-black text-white hover:text-blue-400 transition inline-flex items-center gap-1"
                >
                  {t.contactBar.chatTitle} →
                </Link>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.contactBar.chatDesc}
              </p>
              <div className="text-[11px] text-cyan-400 font-mono font-bold">
                {t.contactBar.chatTime}
              </div>
            </div>

            {/* Channel 2: Email Us */}
            <div className="pt-4 md:pt-0 md:px-6 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Mail className="size-4" />
                </div>
                <a
                  href="mailto:sales@ftpcb.com"
                  className="text-base font-black text-white hover:text-emerald-400 transition inline-flex items-center gap-1"
                >
                  {t.contactBar.emailTitle} →
                </a>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.contactBar.emailDesc}
              </p>
              <div className="text-[11px] text-emerald-400 font-mono font-bold">
                {t.contactBar.emailTime}
              </div>
            </div>

            {/* Channel 3: Help Center */}
            <div className="pt-4 md:pt-0 md:px-6 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <HelpCircle className="size-4" />
                </div>
                <Link
                  href="/contact"
                  className="text-base font-black text-white hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  {t.contactBar.helpTitle} →
                </Link>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.contactBar.helpDesc}
              </p>
              <div className="text-[11px] text-amber-400 font-mono font-bold">
                {t.contactBar.helpTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ADVANCED DFM LAUNCHPAD & FINAL CTA SECTION                             */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#060e1d] via-[#09172f] to-[#040812] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-blue-500/30 overflow-hidden">
          {/* Subtle Ambient Glows & Grid */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Value Proposition & Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
                <span>{t.ctaBanner.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                {t.ctaBanner.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {t.ctaBanner.desc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Link href="/pcb-quote">
                    <Zap className="mr-2 size-4" />
                    {t.ctaBanner.quotePcbBtn} →
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl cursor-pointer"
                >
                  <Link href="/pcb-assembly">
                    <Cpu className="mr-2 size-4 text-cyan-400" />
                    {t.ctaBanner.quotePcbaBtn}
                  </Link>
                </Button>

                <div className="w-full sm:w-auto pt-2 sm:pt-0">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white font-semibold transition"
                  >
                    <MessageSquare className="size-3.5 text-blue-400" />
                    <span>{t.ctaBanner.talkCamBtn} →</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Pre-Flight Gerber Dropzone Terminal */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-dashed border-cyan-400/40 hover:border-cyan-400/70 bg-black/50 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 text-center relative group">
                {dropzoneState === "analyzing" ? (
                  <div className="py-8 space-y-4">
                    <div className="size-14 mx-auto rounded-full bg-blue-600/20 border border-blue-400/40 flex items-center justify-center animate-spin">
                      <RefreshCw className="size-6 text-cyan-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-xs font-bold text-cyan-300">
                        [CAM Pre-Flight] Parsing RS-274X Dataset...
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Inspecting copper clearances, solder dams & via aspect ratios
                      </div>
                    </div>
                    <div className="w-48 mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 animate-pulse w-3/4 rounded-full" />
                    </div>
                  </div>
                ) : dropzoneState === "parsed" ? (
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span className="font-mono text-xs font-bold text-emerald-300 truncate max-w-[180px]">
                          {dropzoneResult.name}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold">
                        PASS DRC
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="text-[10px] text-slate-400">Stackup:</div>
                        <div className="font-bold text-slate-200">{dropzoneResult.layers} Layers FR-4</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="text-[10px] text-slate-400">Dimensions:</div>
                        <div className="font-bold text-slate-200">{dropzoneResult.dimensions}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="text-[10px] text-slate-400">Finish:</div>
                        <div className="font-bold text-slate-200 truncate">{dropzoneResult.finish}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="text-[10px] text-slate-400">Turnaround:</div>
                        <div className="font-bold text-emerald-400 truncate">{dropzoneResult.turnaround}</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-mono">Direct Factory Price:</div>
                        <div className="text-lg font-black text-emerald-400 font-mono">{dropzoneResult.price}</div>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm cursor-pointer"
                      >
                        <Link href="/pcb-quote">
                          Order Now →
                        </Link>
                      </Button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setDropzoneState("idle")}
                        className="text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer underline"
                      >
                        Reset / Test Another Sample
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="size-12 mx-auto rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <UploadCloud className="size-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white">
                        {t.ctaBanner.dropzoneTitle}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t.ctaBanner.dropzoneSub}
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                      {t.ctaBanner.dropzoneFormats.map((fmt, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs py-2 rounded-xl shadow-md cursor-pointer"
                      >
                        <Link href="/pcb-quote">
                          <UploadCloud className="mr-1.5 size-3.5" />
                          Upload Gerber Archive (.ZIP)
                        </Link>
                      </Button>
                    </div>

                    {/* Sample Simulation Pills */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-[10px] text-slate-400 mb-1.5">
                        {t.ctaBanner.sampleTestPrompt}
                      </div>
                      <div className="flex justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            simulateDropzone({
                              name: "STM32_CAN_Gateway.zip",
                              layers: 4,
                              dimensions: "100 × 80 mm",
                              finish: "ENIG Gold",
                              price: "$18.50 / 5 pcs",
                              turnaround: "24h Rapid",
                              netsCount: 14820,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          STM32 (4L)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            simulateDropzone({
                              name: "ESP32_IoT_Sensor.zip",
                              layers: 2,
                              dimensions: "65 × 45 mm",
                              finish: "Lead-Free HASL",
                              price: "$2.00 / 5 pcs",
                              turnaround: "24h Express",
                              netsCount: 4120,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          ESP32 (2L)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            simulateDropzone({
                              name: "FPGA_UltraScale.zip",
                              layers: 6,
                              dimensions: "135 × 90 mm",
                              finish: "Hard Gold",
                              price: "$46.00 / 5 pcs",
                              turnaround: "48h Multilayer",
                              netsCount: 38400,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-900/60 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          FPGA (6L)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom 4 Factory Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 mt-10 border-t border-white/10 relative z-10">
            {t.ctaBanner.guarantees.map((g, idx) => {
              const icons = [DollarSign, Clock, CheckCircle2, ShieldCheck];
              const IconComp = icons[idx] || ShieldCheck;
              const colors = ["text-amber-400", "text-cyan-400", "text-emerald-400", "text-purple-400"];
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <IconComp className={`size-4 ${colors[idx] || "text-blue-400"}`} />
                    <span className="font-bold text-xs text-white tracking-wide">{g.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{g.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
