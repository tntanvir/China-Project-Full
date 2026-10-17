"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useDictionary } from "@/components/providers/language-provider";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cpu,
  FileCheck2,
  Layers,
  Pause,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  UploadCloud,
  Zap,
} from "lucide-react";

export interface StackupLayer {
  layer: string;
  type: string;
  material: string;
  thickness: string;
  color: string;
}

export interface InspectionData {
  aoi: string;
  etest: string;
  impedance: string;
  warp: string;
  hipot: string;
}

export interface LogisticsData {
  carrier: string;
  dispatchFacility: string;
  packaging: string;
  trackingType: string;
}

export interface HardwareTestimonial {
  id: string;
  channel: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  location: string;
  country: string;
  flag: string;
  avatarGradient: string;
  category: "Multilayer & HDI" | "Turnkey SMT & PCBA" | "High-Freq & Rogers" | "Flex & Rigid-Flex";
  rating: number;
  headline: string;
  text: string;
  specs: string[];
  poNumber: string;
  turnaround: string;
  date: string;
  yieldRate: string;
  stackup: StackupLayer[];
  inspection: InspectionData;
  logistics: LogisticsData;
}

export const testimonialsData: HardwareTestimonial[] = [
  {
    id: "de-industrial",
    channel: "CH 01",
    name: "Dr. Markus Weber",
    initials: "MW",
    role: "Lead Hardware Architect",
    company: "Industrial Control Systems GmbH",
    location: "Munich, Germany",
    country: "Germany",
    flag: "🇩🇪",
    avatarGradient: "from-emerald-600 to-teal-700",
    category: "Multilayer & HDI",
    rating: 5,
    headline: "Flawless 8-Layer Impedance Control & Rapid 24h DFM Review",
    text: "FT PCB stabilized our prototype supply chain with exceptional quality and flawless solder mask definition. Their CAM team caught an unintended differential pair clearance issue during the free DFM review, saving us two costly board spins. Microstrip impedance matched our Keysight simulation within ±3%.",
    specs: ["8-Layer High-TG170", "Impedance ±5%", "ENIG 2u\" Gold", "100% Flying Probe"],
    poNumber: "PO-DE-82914",
    turnaround: "48H Express Turn",
    date: "Verified 2 weeks ago",
    yieldRate: "100% Pass",
    stackup: [
      { layer: "L1 (Top)", type: "Diff-Pair Signals", material: "ENIG 2u\" Gold / 1oz Cu", thickness: "35µm", color: "bg-amber-400" },
      { layer: "Dielectric", type: "Prepreg 1080", material: "High-TG170 FR-4", thickness: "75µm", color: "bg-emerald-200" },
      { layer: "L2 (Inner)", type: "Ground Reference", material: "Solid Copper 1oz", thickness: "35µm", color: "bg-amber-500" },
      { layer: "Core", type: "FR-4 Core High-TG", material: "TG170 Dielectric", thickness: "0.40mm", color: "bg-emerald-300" },
      { layer: "L3-L6", type: "High-Speed Bus", material: "Controlled 50Ω / 100Ω", thickness: "35µm", color: "bg-amber-500" },
      { layer: "L7-L8", type: "Ground & Bottom", material: "ENIG 2u\" / 1oz Cu", thickness: "35µm", color: "bg-amber-400" },
    ],
    inspection: {
      aoi: "0 Defects / 100% Netlist Pass",
      etest: "Flying Probe 100% Verified",
      impedance: "Z0 = 50.2Ω (Target: 50Ω ± 5%)",
      warp: "< 0.35% (IPC Standard < 0.75%)",
      hipot: "Passed 500V DC Isolation Test",
    },
    logistics: {
      carrier: "DHL Express Priority (Air Tracked)",
      dispatchFacility: "Wuping Smart Cleanroom Fab",
      packaging: "ESD Moisture-Barrier Vacuum Sealed",
      trackingType: "Real-Time Sensor Milestone Tracking",
    },
  },
  {
    id: "us-iot-robotics",
    channel: "CH 02",
    name: "Sarah Jenkins",
    initials: "SJ",
    role: "VP of Hardware Engineering",
    company: "Apex Robotics & Sensor Labs",
    location: "Austin, Texas, USA",
    country: "United States",
    flag: "🇺🇸",
    avatarGradient: "from-blue-600 to-emerald-600",
    category: "Turnkey SMT & PCBA",
    rating: 5,
    headline: "Turnkey SMT Boards Arrived Flawlessly Assembled & Tested",
    text: "The turnkey PCBA boards arrived neatly vacuum-packed with desiccant, full 3D X-ray BGA inspection reports, and 100% AOI pass logs. Sourcing genuine 0201 passives and microcontrollers during global supply pinches was completely handled by their procurement team. Plug-and-play on day one.",
    specs: ["Turnkey PCBA (0201 SMT)", "0.4mm Pitch BGA", "3D X-Ray & AOI Tested", "ESD Vacuum Pack"],
    poNumber: "PO-US-49201",
    turnaround: "6-Day Turnkey Delivery",
    date: "Verified 3 weeks ago",
    yieldRate: "99.9% Yield",
    stackup: [
      { layer: "Stencil", type: "Laser Stencil", material: "SUS304 Stainless Electropolished", thickness: "0.12mm", color: "bg-slate-300" },
      { layer: "Solder Paste", type: "Lead-Free SAC305", material: "Senju Eco Solder Type 4", thickness: "Fine Pitch", color: "bg-gray-400" },
      { layer: "Top SMT", type: "0201 Passives + BGA", material: "Yamaha High-Speed Placement", thickness: "0.4mm BGA", color: "bg-emerald-500" },
      { layer: "Reflow", type: "10-Zone N2 Reflow", material: "Nitrogen Thermal Profile 245°C", thickness: "Conveyor", color: "bg-amber-400" },
      { layer: "Bottom SMT", type: "Through-Hole Connectors", material: "Selective Wave Soldering", thickness: "IPC Class 3", color: "bg-emerald-400" },
    ],
    inspection: {
      aoi: "3D AOI 100% Component Verification",
      etest: "Automated Functional Firmware Pass",
      impedance: "BGA Solder Joint Voiding < 4.2%",
      warp: "IPC-A-610 Class 3 Workmanship",
      hipot: "Full Power-On Self Test Passed",
    },
    logistics: {
      carrier: "FedEx International Priority",
      dispatchFacility: "Shenzhen Precision Assembly Hub",
      packaging: "Anti-Static Bubble Foam + Desiccant",
      trackingType: "Customs Cleared Door-to-Door",
    },
  },
  {
    id: "jp-radar-lab",
    channel: "CH 03",
    name: "Kenji Tanaka",
    initials: "KT",
    role: "Senior RF Electronics Designer",
    company: "Telematics & Radar Sensor Lab",
    location: "Nagoya, Japan",
    country: "Japan",
    flag: "🇯🇵",
    avatarGradient: "from-emerald-700 to-green-600",
    category: "High-Freq & Rogers",
    rating: 5,
    headline: "Outstanding 77GHz Radar Hybrid Rogers Stackup",
    text: "Outstanding dielectric tolerance on our 6-layer Rogers RO4350B + FR-4 hybrid boards. Microstrip transmission lines showed virtually zero RF insertion loss across our 24GHz and 77GHz test vectors. Their factory transparency and engineering precision make them our primary PCB partner in Asia.",
    specs: ["Rogers RO4350B + FR4", "Immersion Silver Finish", "Blind/Buried Microvias", "IPC Class 3 Standard"],
    poNumber: "PO-JP-77312",
    turnaround: "5-Day Precision Build",
    date: "Verified 1 month ago",
    yieldRate: "100% Pass",
    stackup: [
      { layer: "L1 (Top)", type: "77GHz Microstrip", material: "Immersion Silver / 0.5oz Cu", thickness: "18µm", color: "bg-slate-200" },
      { layer: "RF Dielectric", type: "Rogers RO4350B", material: "Hydrocarbon Ceramic Dk 3.48", thickness: "0.254mm", color: "bg-amber-300" },
      { layer: "L2 (RF GND)", type: "Solid Reference Plane", material: "Rolled Copper Foil 1oz", thickness: "35µm", color: "bg-amber-500" },
      { layer: "Core", type: "FR-4 High-TG Core", material: "Digital Ground & Power Bus", thickness: "0.80mm", color: "bg-emerald-300" },
      { layer: "L3-L6", type: "Digital Baseband", material: "Standard FR-4 Multilayer", thickness: "35µm", color: "bg-amber-400" },
    ],
    inspection: {
      aoi: "Laser Profilometry Trace Measurement",
      etest: "TDR High-Frequency Impedance Match",
      impedance: "RF Insertion Loss: -0.14dB @ 77GHz",
      warp: "Dielectric Constant Tolerance ±0.04",
      hipot: "IPC-6018 High Frequency Verification",
    },
    logistics: {
      carrier: "DHL Express Air Courier",
      dispatchFacility: "Wuping Microwave Cleanroom",
      packaging: "Nitrogen Purged ESD Sealed Pack",
      trackingType: "Direct Nagoya Hub Express",
    },
  },
  {
    id: "se-medtech",
    channel: "CH 04",
    name: "Elena Rostova",
    initials: "ER",
    role: "Chief Technology Officer",
    company: "BioSens Medical Wearables",
    location: "Stockholm, Sweden",
    country: "Sweden",
    flag: "🇸🇪",
    avatarGradient: "from-teal-600 to-cyan-700",
    category: "Flex & Rigid-Flex",
    rating: 5,
    headline: "Ultra-Durable Polyimide Flex Passed 100K Dynamic Bends",
    text: "Wearable biomedical monitoring requires zero-defect copper ductility and tight dynamic bend radii. Feitian PCB's 4-layer polyimide flex circuits passed 100,000 bending cycles in our accelerated mechanical stress chamber without a single trace fracture. Truly exceptional medical-grade reliability.",
    specs: ["4-Layer Polyimide Flex", "RA Rolled Annealed Cu", "Coverlay Immersion Gold", "Dynamic Flex Tested"],
    poNumber: "PO-SE-30918",
    turnaround: "72H Express Flex",
    date: "Verified 1 month ago",
    yieldRate: "100% Pass",
    stackup: [
      { layer: "Top Coverlay", type: "Polyimide Film", material: "Amber Polyimide 1 mil + Epoxy", thickness: "25µm", color: "bg-amber-300" },
      { layer: "L1 (Flex Signal)", type: "Dynamic Flex Trace", material: "RA Rolled Annealed Cu", thickness: "18µm", color: "bg-amber-500" },
      { layer: "Flex Core", type: "Adhesiveless Base", material: "DuPont Pyralux AP Polyimide", thickness: "50µm", color: "bg-amber-400" },
      { layer: "L2 (Flex GND)", type: "Hatched Shield Plane", material: "RA Rolled Annealed Cu", thickness: "18µm", color: "bg-amber-500" },
      { layer: "Bot Coverlay", type: "Polyimide Film", material: "Amber Polyimide 1 mil", thickness: "25µm", color: "bg-amber-300" },
    ],
    inspection: {
      aoi: "Optical Microscope 100% Trace Scan",
      etest: "Continuity & Resistance 100% Match",
      impedance: "100,000 Dynamic Bending Cycles Pass",
      warp: "Zero Delamination / Zero Fractures",
      hipot: "Passed 1,000V DC Dielectric Voltage",
    },
    logistics: {
      carrier: "UPS Worldwide Express Saver",
      dispatchFacility: "Shenzhen Flexible Circuits Division",
      packaging: "Custom Stiffened ESD Trays",
      trackingType: "Stockholm Arlanda Airport Direct",
    },
  },
  {
    id: "ca-ev-power",
    channel: "CH 05",
    name: "David Tremblay",
    initials: "DT",
    role: "Power Electronics Specialist",
    company: "EV Dynamics Power Corp",
    location: "Montreal, Canada",
    country: "Canada",
    flag: "🇨🇦",
    avatarGradient: "from-green-700 to-emerald-800",
    category: "Multilayer & HDI",
    rating: 5,
    headline: "Heavy Copper 3oz Thermal Performance for 800V Inverter",
    text: "Thermal dissipation was critical for our 800V silicon-carbide inverter gate drivers. Feitian's heavy copper 3oz inner layer etching was razor sharp with perfect dielectric isolation. High-voltage hipot testing passed flawlessly at 3.5kV DC with zero breakdown or corona discharge.",
    specs: ["Heavy Copper 3oz / 105µm", "High-TG180 Laminate", "Hipot Tested 3.5kV DC", "IPC-A-600 Class 3"],
    poNumber: "PO-CA-66120",
    turnaround: "4-Day Fast Dispatch",
    date: "Verified 2 weeks ago",
    yieldRate: "100% Pass",
    stackup: [
      { layer: "L1 (Top)", type: "High-Current Trace (40A)", material: "Heavy Copper 3oz (105µm)", thickness: "105µm", color: "bg-amber-600" },
      { layer: "Isolation", type: "High-TG180 Prepreg", material: "High Dielectric Breakdown FR4", thickness: "200µm", color: "bg-emerald-300" },
      { layer: "L2 (Inner)", type: "Busbar Ground Plane", material: "Heavy Copper 3oz (105µm)", thickness: "105µm", color: "bg-amber-600" },
      { layer: "Core", type: "TG180 Core", material: "Shengyi S1000-2 Thermal Core", thickness: "0.60mm", color: "bg-emerald-400" },
      { layer: "L3-L4", type: "Gate Drive & Bottom", material: "Heavy Copper 3oz + ENIG", thickness: "105µm", color: "bg-amber-600" },
    ],
    inspection: {
      aoi: "Heavy Copper Etch Profile Verified",
      etest: "Hipot High-Voltage Passed 3.5kV DC",
      impedance: "DC Resistance < 0.72mΩ Per Trace",
      warp: "Thermal Shock: 288°C Solder Float 3x",
      hipot: "Zero Corona / Zero Breakdown",
    },
    logistics: {
      carrier: "FedEx International Priority",
      dispatchFacility: "Wuping Heavy Copper Division",
      packaging: "Reinforced Rigid Moisture Packs",
      trackingType: "Montreal Mirabel Cargo Gateway",
    },
  },
  {
    id: "uk-smart-grid",
    channel: "CH 06",
    name: "Oliver Smith",
    initials: "OS",
    role: "Lead Embedded Architect",
    company: "Smart Grid Avionics Ltd",
    location: "Cambridge, United Kingdom",
    country: "United Kingdom",
    flag: "🇬🇧",
    avatarGradient: "from-slate-700 to-emerald-700",
    category: "Turnkey SMT & PCBA",
    rating: 5,
    headline: "100% First-Pass Yield Across 500 Sub-GHz Gateway Boards",
    text: "From initial Gerber upload to automated online quotation and CAM feedback, the entire ordering process was remarkably smooth. 500 turnkey assembled gateways delivered directly to our warehouse in Cambridge with zero solder bridging, correct orientation on all QFNs, and 100% functional yield.",
    specs: ["500 Pcs Volume Run", "Turnkey BOM Sourcing", "Selective Solder & AOI", "100% Functional Test"],
    poNumber: "PO-UK-11849",
    turnaround: "Full Turnkey Batch",
    date: "Verified 3 weeks ago",
    yieldRate: "100% Pass",
    stackup: [
      { layer: "L1 (Top)", type: "SMT Fine Pitch Component", material: "ENIG 2u\" Gold / 1oz Cu", thickness: "35µm", color: "bg-amber-400" },
      { layer: "Assembly", type: "Yamaha YS24 Pick & Place", material: "0402 Passives & QFN ICs", thickness: "Automatic", color: "bg-emerald-500" },
      { layer: "Selective", type: "Through-Hole Connectors", material: "Mini-Wave Nitrogen Solder", thickness: "IPC Class 2", color: "bg-slate-300" },
      { layer: "Protection", type: "Conformal Coating", material: "Polyurethane Moisture Barrier", thickness: "50µm", color: "bg-teal-300" },
    ],
    inspection: {
      aoi: "Double-Sided 3D AOI 100% Verified",
      etest: "Sub-GHz RF Wireless Packet Test Pass",
      impedance: "500 / 500 Units Flawless First-Pass",
      warp: "Moisture Barrier Pack with HIC Pass",
      hipot: "Firmware Automated Flash Verified",
    },
    logistics: {
      carrier: "DHL Express Worldwide",
      dispatchFacility: "Shenzhen Turnkey PCBA Center",
      packaging: "Custom Antistatic Compartment Crates",
      trackingType: "Heathrow Direct Express Dispatch",
    },
  },
];

export default function TestimonialsSlider() {
  const dictionary = useDictionary();
  const testCopy = dictionary.sections.testimonials;
  const tHub = dictionary.testimonialsHub;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inspectorTab, setInspectorTab] = useState<"story" | "stackup" | "inspection" | "logistics">("story");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeReview = useMemo(() => testimonialsData[currentIndex], [currentIndex]);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const durationMs = 7000;
  const tickMs = 50;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    setProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    setProgress(0);
  }, []);

  const selectSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Autoplay timer with progress calculation
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (tickMs / durationMs) * 100;
        if (next >= 100) {
          goToNext();
          return 0;
        }
        return next;
      });
    }, tickMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, isHovered, goToNext]);

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            {tHub?.eyebrow || testCopy?.badge || "Verified Hardware Engineering Reviews"}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {tHub?.title || testCopy?.title || "What Global Hardware Teams Say"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300 sm:text-base">
            {tHub?.description || testCopy?.description || "Interactive production reviews, CAD stackup verification, and real test reports from engineers across 60+ countries."}
          </p>
        </div>

        {/* Top Social Proof KPI Metric Bar */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/60 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{tHub?.kpis?.reviewsValue || "4.98"}<span className="text-base text-gray-400 font-bold">/5.0</span></span>
              <span suppressHydrationWarning className="inline-flex items-center gap-1 rounded-md bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <BadgeCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Top Rated
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-emerald-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-emerald-500 text-emerald-500" />
              ))}
            </div>
            <p className="mt-2 text-xs font-bold text-gray-900 dark:text-slate-100">{tHub?.kpis?.reviewsLabel || "Verified Hardware Score"}</p>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">{tHub?.kpis?.reviewsSub || "Based on 3,420+ client production orders"}</p>
          </div>

          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/60 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{tHub?.kpis?.deliveryValue || "99.4%"}</span>
              <span suppressHydrationWarning className="inline-flex items-center gap-1 rounded-md bg-blue-100/70 dark:bg-blue-950 px-2 py-0.5 text-[11px] font-bold text-blue-800 dark:text-blue-300">
                <Truck className="size-3.5 text-blue-600 dark:text-blue-400" /> Express
              </span>
            </div>
            <div className="mt-2 text-xs font-bold text-gray-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              {tHub?.kpis?.deliveryLabel || "On-Time Global Delivery"}
            </div>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-slate-400">{tHub?.kpis?.deliverySub || "Insured door-to-door dispatch via DHL, FedEx, UPS"}</p>
            <p className="mt-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">⚡ 24h & 48h Expedited Available</p>
          </div>

          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/60 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{tHub?.kpis?.impedanceValue || "99.85%"}</span>
              <span suppressHydrationWarning className="inline-flex items-center gap-1 rounded-md bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <Zap className="size-3.5 text-emerald-600 dark:text-emerald-400" /> 100% Tested
              </span>
            </div>
            <div className="mt-2 text-xs font-bold text-gray-900 dark:text-slate-100">{tHub?.kpis?.impedanceLabel || "Electrical First-Pass Yield"}</div>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-slate-400">{tHub?.kpis?.impedanceSub || "Flying probe, AOI & 3D X-Ray BGA inspection"}</p>
            <p className="mt-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">✓ Zero-Defect Fabrication Policy</p>
          </div>

          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/60 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">IPC Class 2/3</span>
              <span suppressHydrationWarning className="inline-flex items-center gap-1 rounded-md bg-purple-100/70 dark:bg-purple-950 px-2 py-0.5 text-[11px] font-bold text-purple-800 dark:text-purple-300">
                <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" /> Certified
              </span>
            </div>
            <div className="mt-2 text-xs font-bold text-gray-900 dark:text-slate-100">{tHub?.kpis?.turnaroundLabel || "Industry Standard Guarantee"}</div>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-slate-400">{tHub?.kpis?.turnaroundSub || "ISO 9001:2015, UL 94V-0, RoHS & REACH compliant"}</p>
            <p className="mt-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">🛡️ 30-Day Quality Warranty</p>
          </div>
        </div>

        {/* Unique Hardware Station Scrubber & Channel Track */}
        <div className="mt-10 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 p-3 sm:p-4 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-slate-200">
                Active Test Channel:
              </span>
              <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-mono font-bold text-white shadow-xs">
                {activeReview.channel} &bull; {activeReview.country} {activeReview.flag}
              </span>
            </div>

            {/* Quick Channel Jumpers */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {testimonialsData.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSlide(idx)}
                    className={`group relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-emerald-300 dark:border-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-white/60 dark:bg-slate-900/60 text-gray-600 dark:text-slate-400 border border-gray-200/80 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-200"
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span className="font-mono text-[11px]">{item.channel}</span>
                    <span className="hidden xl:inline text-[11px] text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-200">
                      {item.specs[0].split(" ")[0]}
                    </span>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Auto-Play Toggle & Channel Counter */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-2xs transition"
                title={isPlaying ? "Pause auto-scroll" : "Resume auto-scroll"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="size-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px]">Auto</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3 text-gray-400" />
                    <span className="text-[11px]">Paused</span>
                  </>
                )}
              </button>

              <div className="text-xs font-mono font-bold text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2 py-1 rounded-lg">
                <span className="text-emerald-700 dark:text-emerald-400">{currentIndex + 1}</span> / {testimonialsData.length}
              </div>
            </div>
          </div>

          {/* Animated Laser Progress Line */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Interactive CAD / Testbench Showcase Stage */}
        <div
          className="mt-6 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Hardware Navigation Arrow Buttons */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous hardware review"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex size-10 sm:size-12 items-center justify-center rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 text-gray-700 dark:text-slate-200 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-300 active:scale-95"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next hardware review"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex size-10 sm:size-12 items-center justify-center rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 text-gray-700 dark:text-slate-200 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-300 active:scale-95"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Master Slide Card */}
          <div className="overflow-hidden rounded-3xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-all duration-500">
            
            {/* Top Bar of the Active Slide */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-850/70 px-6 py-3.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Verified Hardware PO &bull; <span className="font-mono text-emerald-950 dark:text-emerald-200 font-bold">{activeReview.poNumber}</span>
                </span>
                <span className="hidden sm:inline-block rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-slate-300">
                  {activeReview.category}
                </span>
              </div>

              {/* Unique Inspector Mode Switcher Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-white dark:bg-slate-800 p-1 border border-gray-200 dark:border-slate-700 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setInspectorTab("story")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    inspectorTab === "story"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <Quote className="size-3.5" />
                  <span>Review Story</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab("stackup")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    inspectorTab === "stackup"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>CAD Stackup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab("inspection")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    inspectorTab === "inspection"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <FileCheck2 className="size-3.5" />
                  <span>Test Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectorTab("logistics")}
                  className={`hidden md:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    inspectorTab === "logistics"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <Truck className="size-3.5" />
                  <span>Dispatch Trace</span>
                </button>
              </div>
            </div>

            {/* Main Stage Content: Dual-Pane Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Pane: The Testimonial & Hardware Team Details (7 Cols) */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-emerald-500">
                      {[...Array(activeReview.rating)].map((_, i) => (
                        <Star key={i} className="size-5 fill-emerald-500 text-emerald-500" />
                      ))}
                      <span className="ml-1.5 text-sm font-black text-gray-900 dark:text-white">5.0 / 5.0</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                        <Zap className="size-3 text-emerald-600 dark:text-emerald-400" /> {activeReview.yieldRate}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">{activeReview.date}</span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-snug tracking-tight">
                    &ldquo;{activeReview.headline}&rdquo;
                  </h3>

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-slate-300 italic">
                    &ldquo;{activeReview.text}&rdquo;
                  </p>

                  {/* Technical Board Specs Tags */}
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800">
                    <div className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-400 mb-2.5">
                      Verified Board Fabrication Specifications:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeReview.specs.map((spec, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1 text-xs font-bold text-gray-800 dark:text-slate-200 shadow-2xs"
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Left Pane Footer: Engineer Author Profile */}
                <div className="mt-8 pt-5 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`relative size-12 rounded-full bg-gradient-to-br ${activeReview.avatarGradient} text-white font-black text-sm flex items-center justify-center shadow-md ring-4 ring-emerald-50 dark:ring-emerald-950/40`}>
                      {activeReview.initials}
                      <span className="absolute -bottom-1 -right-1 text-base drop-shadow-sm" title={activeReview.country}>
                        {activeReview.flag}
                      </span>
                    </div>
                    <div>
                      <div className="text-base font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                        {activeReview.name}
                        <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {activeReview.role}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                        {activeReview.company} &bull; {activeReview.location}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Clock3 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> {activeReview.turnaround}
                  </span>
                </div>
              </div>

              {/* Right Pane: Interactive Hardware Inspector (5 Cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-gray-50/60 dark:bg-slate-900/40 flex flex-col justify-between">
                
                {/* 1. Review Story Summary Tab */}
                {inspectorTab === "story" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Cpu className="size-4 text-emerald-600 dark:text-emerald-400" /> Hardware Project Summary
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                        IPC Class 3
                      </span>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 p-4 shadow-2xs space-y-2.5">
                      <div className="text-xs text-gray-500 dark:text-slate-400 font-semibold">Project Domain:</div>
                      <div className="text-sm font-extrabold text-gray-900 dark:text-white">{activeReview.category}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 font-semibold pt-1">Client Institution:</div>
                      <div className="text-xs font-bold text-gray-800 dark:text-slate-200">{activeReview.company} ({activeReview.country})</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 font-semibold pt-1">Testing Method:</div>
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">100% Flying Probe Netlist & 3D AOI Inspection</div>
                    </div>

                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-4">
                      <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-extrabold text-xs">
                        <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" /> CAM Engineering Highlight:
                      </div>
                      <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                        Our engineering team performed full Design for Manufacturing (DFM) check before tooling. Netlist impedance verified to within ±3% target value.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectorTab("stackup")}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-2xs transition"
                    >
                      Inspect Physical Layer Stackup <ArrowRight className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </div>
                )}

                {/* 2. Interactive Layer Stackup Visualizer Tab */}
                {inspectorTab === "stackup" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Layers className="size-4 text-emerald-600 dark:text-emerald-400" /> Physical CAD Cross-Section
                      </span>
                      <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400">
                        {activeReview.stackup.length} Layers
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {activeReview.stackup.map((l, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 shadow-2xs text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`size-2.5 rounded-full ${l.color} shadow-xs ring-1 ring-gray-300 dark:ring-slate-600`} />
                            <div>
                              <span className="font-extrabold text-gray-900 dark:text-slate-100">{l.layer}</span>
                              <span className="text-gray-400 dark:text-slate-500 mx-1.5">&bull;</span>
                              <span className="text-gray-600 dark:text-slate-400 font-medium">{l.type}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">{l.thickness}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-snug italic pt-1">
                      Cross-section micro-inspection verified compliant with IPC-A-600 Class 2/3 tolerances.
                    </p>
                  </div>
                )}

                {/* 3. Quality Test Certificate Tab */}
                {inspectorTab === "inspection" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                        <FileCheck2 className="size-4 text-emerald-600 dark:text-emerald-400" /> 100% Quality Pass Report
                      </span>
                      <span className="rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                        PASS CERTIFICATE
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Automated Optical Inspection:</div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{activeReview.inspection.aoi}</div>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Electrical Flying Probe Continuity:</div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{activeReview.inspection.etest}</div>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Impedance & Signal Performance:</div>
                        <div className="text-xs font-bold text-gray-900 dark:text-slate-100 mt-0.5">{activeReview.inspection.impedance}</div>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Warp & Twist Standard / Hi-Pot:</div>
                        <div className="text-xs font-bold text-gray-900 dark:text-slate-100 mt-0.5">{activeReview.inspection.warp}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Logistics & Dispatch Trace Tab */}
                {inspectorTab === "logistics" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Truck className="size-4 text-blue-600 dark:text-blue-400" /> Courier & Dispatch Details
                      </span>
                      <span className="rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5">
                        DELIVERED
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Global Carrier:</div>
                        <div className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5">{activeReview.logistics.carrier}</div>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Origin Facility:</div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{activeReview.logistics.dispatchFacility}</div>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Packaging Specification:</div>
                        <div className="text-xs font-bold text-gray-800 dark:text-slate-200 mt-0.5">{activeReview.logistics.packaging}</div>
                      </div>

                      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400">Delivery Status:</div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">Direct to Lab &bull; Zero Damage Reported</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Oscilloscope Signal Pulse Footer */}
                <div className="mt-5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold uppercase text-gray-600 dark:text-slate-400">
                        SIGNAL WAVEFORM: 100% INTEGRITY
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      PO {activeReview.poNumber}
                    </span>
                  </div>

                  {/* SVG Animated Oscilloscope Waveform */}
                  <div className="mt-2 h-7 w-full overflow-hidden rounded bg-gray-900 p-1 flex items-center">
                    <svg className="h-5 w-full text-emerald-400" preserveAspectRatio="none" viewBox="0 0 300 20">
                      <path
                        d="M0 10 Q 25 0, 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="opacity-40"
                      />
                      <path
                        d="M0 10 L 40 10 L 50 2 L 60 18 L 70 10 L 140 10 L 150 2 L 160 18 L 170 10 L 240 10 L 250 2 L 260 18 L 270 10 L 300 10"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.75"
                      />
                    </svg>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Bottom Thumbnail Strip for Fast Interactive Carousel Scrubbing */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {testimonialsData.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSlide(idx)}
                className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? "bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20 -translate-y-1"
                    : "bg-gray-50/70 dark:bg-slate-900/60 border border-gray-200/90 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base">{item.flag}</span>
                    <span className={`text-[10px] font-mono font-bold ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400 dark:text-slate-500"}`}>
                      {item.channel}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-black text-gray-900 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                    {item.company}
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{item.specs[0].split(" ")[0]}</span>
                  <span className="text-gray-400 dark:text-slate-500">{item.country.slice(0, 3)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom IPC Quality Warranty & CTA Strip */}
        <div className="mt-12 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="size-12 shrink-0 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                    {tHub?.warranty?.title || "100% Quality & Workmanship Guarantee • IPC Class 2/3 Certified"}
                  </h4>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {tHub?.warranty?.description || "Every circuit board batch includes free automated DFM design validation, 100% flying probe electrical testing, and our zero-defect remake guarantee. If anything fails your engineering specifications, we remake or refund within 24 hours."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/pcb-quote"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all"
              >
                {tHub?.warranty?.ctaBtn || "Start Instant PCB Quote"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gerber-view"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-xs sm:text-sm font-extrabold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-xs transition-all"
              >
                <UploadCloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> {tHub?.warranty?.uploadBtn || "Free DFM Analysis"}
              </Link>
            </div>
          </div>

          {/* Certifications badges list */}
          <div className="mt-6 pt-5 border-t border-emerald-100/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-between gap-3 text-xs text-gray-600 dark:text-slate-400 font-semibold">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-bold">Standard Compliance:</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> ISO 9001:2015 Certified</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> UL 94V-0 Flammability</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> RoHS & REACH Compliant</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> IPC-A-600 Class 2 & 3</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> IPC-A-610 Workmanship</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> ESD Moisture-Barrier Vacuum Pack</span>
          </div>
        </div>

      </div>
    </section>
  );
}
