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
  Star,
  Truck,
  UploadCloud,
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
    <section className="py-14 sm:py-20 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            {tHub?.eyebrow || testCopy?.badge || "Client Reviews"}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {tHub?.title || testCopy?.title || "Trusted by Global Hardware Teams"}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-slate-300 sm:text-base">
            {tHub?.description || testCopy?.description || "Verified production feedback and test reports from engineering teams worldwide."}
          </p>
        </div>

        {/* Clean 4-Metric KPI Strip */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/50 p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {tHub?.kpis?.reviewsValue || "4,850+"}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {tHub?.kpis?.reviewsLabel || "Verified Orders"}
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
              {tHub?.kpis?.reviewsSub || "Global hardware teams"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/50 p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {tHub?.kpis?.deliveryValue || "99.4%"}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {tHub?.kpis?.deliveryLabel || "On-Time Delivery"}
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
              {tHub?.kpis?.deliverySub || "DHL & FedEx Express"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/50 p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {tHub?.kpis?.impedanceValue || "±3%"}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {tHub?.kpis?.impedanceLabel || "Impedance Tolerance"}
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
              {tHub?.kpis?.impedanceSub || "TDR tested accuracy"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/50 p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {tHub?.kpis?.turnaroundValue || "2.4h"}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {tHub?.kpis?.turnaroundLabel || "CAM DFM Review"}
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
              {tHub?.kpis?.turnaroundSub || "Average engineering reply"}
            </p>
          </div>
        </div>

        {/* Main Clean Review Card */}
        <div
          className="mt-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden rounded-3xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            
            {/* Clean Top Bar: Order Reference + Tab Switcher + Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900 px-5 sm:px-7 py-3.5">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span>PO {activeReview.poNumber}</span>
                </span>
                <span className="text-gray-300 dark:text-slate-700">•</span>
                <span className="font-semibold text-gray-600 dark:text-slate-300">
                  {activeReview.category}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Inspector Mode Switcher Tabs */}
                <div className="flex items-center gap-1 rounded-xl bg-white dark:bg-slate-800 p-1 border border-gray-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setInspectorTab("story")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      inspectorTab === "story"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Quote className="size-3.5" />
                    <span>Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectorTab("stackup")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      inspectorTab === "stackup"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Layers className="size-3.5" />
                    <span>Stackup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectorTab("inspection")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      inspectorTab === "inspection"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <FileCheck2 className="size-3.5" />
                    <span>QA Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectorTab("logistics")}
                    className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      inspectorTab === "logistics"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Truck className="size-3.5" />
                    <span>Dispatch</span>
                  </button>
                </div>

                {/* Clean Navigation Controls */}
                <div className="flex items-center gap-1 border-l border-gray-200 dark:border-slate-800 pl-2">
                  <button
                    type="button"
                    onClick={goToPrev}
                    aria-label="Previous review"
                    className="flex size-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    aria-label="Next review"
                    className="flex size-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? "Pause rotation" : "Resume rotation"}
                    className="flex size-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                  >
                    {isPlaying ? <Pause className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Play className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Subtle Progress Hairline */}
            <div className="h-0.5 w-full bg-gray-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Main Stage Content: Dual-Pane Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Pane: Client Testimonial (7 Cols) */}
              <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-emerald-500">
                      {[...Array(activeReview.rating)].map((_, i) => (
                        <Star key={i} className="size-4 fill-emerald-500 text-emerald-500" />
                      ))}
                      <span className="ml-1.5 text-xs font-bold text-gray-500 dark:text-slate-400">{activeReview.yieldRate}</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">{activeReview.date}</span>
                  </div>

                  <h3 className="mt-4 text-lg sm:text-2xl font-black text-gray-900 dark:text-white leading-snug tracking-tight">
                    &ldquo;{activeReview.headline}&rdquo;
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-slate-300">
                    &ldquo;{activeReview.text}&rdquo;
                  </p>

                  {/* Board Specs Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeReview.specs.slice(0, 4).map((spec, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-slate-200"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Engineer Author Profile */}
                <div className="mt-8 pt-5 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`relative size-11 rounded-full bg-gradient-to-br ${activeReview.avatarGradient} text-white font-black text-xs flex items-center justify-center shadow-xs`}>
                      {activeReview.initials}
                      <span className="absolute -bottom-1 -right-1 text-sm" title={activeReview.country}>
                        {activeReview.flag}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                        {activeReview.name}
                        <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                        {activeReview.role} &bull; {activeReview.company}, {activeReview.country}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Clock3 className="size-3.5 text-emerald-600 dark:text-emerald-400" /> {activeReview.turnaround}
                  </span>
                </div>
              </div>

              {/* Right Pane: Clean Technical Details (5 Cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-gray-50/50 dark:bg-slate-900/40 flex flex-col justify-between">
                
                {/* 1. Project Overview */}
                {inspectorTab === "story" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Cpu className="size-4 text-emerald-600 dark:text-emerald-400" /> Project Summary
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        IPC Class 3
                      </span>
                    </div>

                    <div className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/90 p-4 space-y-3">
                      <div>
                        <div className="text-[11px] text-gray-400 dark:text-slate-400 font-semibold">Application</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{activeReview.category}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400 dark:text-slate-400 font-semibold">Company</div>
                        <div className="text-xs font-bold text-gray-800 dark:text-slate-200">{activeReview.company} ({activeReview.location})</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400 dark:text-slate-400 font-semibold">Verification</div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{activeReview.inspection.etest}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectorTab("stackup")}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                    >
                      View Layer Stackup <ArrowRight className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    </button>
                  </div>
                )}

                {/* 2. Layer Stackup */}
                {inspectorTab === "stackup" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Layers className="size-4 text-emerald-600 dark:text-emerald-400" /> Layer Stackup
                      </span>
                      <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400">
                        {activeReview.stackup.length} Layers
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {activeReview.stackup.map((l, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-gray-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`size-2.5 shrink-0 rounded-full ${l.color} ring-1 ring-gray-300 dark:ring-slate-600`} />
                            <div className="truncate">
                              <span className="font-bold text-gray-900 dark:text-slate-100">{l.layer}</span>
                              <span className="text-gray-400 mx-1.5">&bull;</span>
                              <span className="text-gray-600 dark:text-slate-400">{l.type}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0 ml-2">{l.thickness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. QA Test Report */}
                {inspectorTab === "inspection" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                        <FileCheck2 className="size-4 text-emerald-600 dark:text-emerald-400" /> QA Test Report
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        PASSED
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                        <div className="text-[10px] uppercase font-bold text-gray-400">AOI Inspection</div>
                        <div className="text-xs font-bold text-gray-900 dark:text-slate-100 mt-0.5">{activeReview.inspection.aoi}</div>
                      </div>
                      <div className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                        <div className="text-[10px] uppercase font-bold text-gray-400">Electrical Test</div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{activeReview.inspection.etest}</div>
                      </div>
                      <div className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                        <div className="text-[10px] uppercase font-bold text-gray-400">Impedance Control</div>
                        <div className="text-xs font-bold text-gray-900 dark:text-slate-100 mt-0.5">{activeReview.inspection.impedance}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Dispatch Details */}
                {inspectorTab === "logistics" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800 pb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Truck className="size-4 text-emerald-600 dark:text-emerald-400" /> Dispatch Details
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        DELIVERED
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                        <div className="text-[10px] uppercase font-bold text-gray-400">Carrier</div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{activeReview.logistics.carrier}</div>
                      </div>
                      <div className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                        <div className="text-[10px] uppercase font-bold text-gray-400">Origin Campus</div>
                        <div className="text-xs font-bold text-gray-900 dark:text-slate-100 mt-0.5">{activeReview.logistics.dispatchFacility}</div>
                      </div>
                      <div className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
                        <div className="text-[10px] uppercase font-bold text-gray-400">Packaging</div>
                        <div className="text-xs font-bold text-gray-800 dark:text-slate-200 mt-0.5">{activeReview.logistics.packaging}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 pt-3 border-t border-gray-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
                  <span>{activeReview.country} {activeReview.flag}</span>
                  <span>{currentIndex + 1} of {testimonialsData.length}</span>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Clean 6-Client Selector Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {testimonialsData.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSlide(idx)}
                className={`rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? "bg-white dark:bg-slate-800 border-2 border-emerald-500 shadow-sm"
                    : "bg-gray-50/70 dark:bg-slate-900/50 border border-gray-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{item.flag}</span>
                  <span className={`text-[10px] font-bold ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400"}`}>
                    {item.specs[0].split(" ")[0]}
                  </span>
                </div>
                <div className="mt-1.5 text-xs font-bold text-gray-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                  {item.company}
                </div>
              </button>
            );
          })}
        </div>

        {/* Clean Bottom Guarantee CTA */}
        <div className="mt-10 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-slate-900 p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="size-11 shrink-0 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                  {tHub?.warranty?.title || "Quality & Workmanship Guarantee"}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-slate-300 max-w-2xl">
                  {tHub?.warranty?.description || "Every batch includes free DFM review, 100% flying probe testing, and our zero-defect remake guarantee."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/pcb-quote"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:bg-emerald-700 transition-all"
              >
                {tHub?.warranty?.ctaBtn || "Start PCB Quote"} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gerber-view"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
              >
                <UploadCloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> {tHub?.warranty?.uploadBtn || "Free DFM Check"}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
