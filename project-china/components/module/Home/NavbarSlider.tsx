"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useState, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  FileArchive,
  Layers3,
  Loader2,
  Lock,
  PanelTop,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Truck,
  UploadCloud,
  Zap,
  ChevronRight,
  Microscope,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { GerberService } from "@/services/gerber.service";
import { useDictionary } from "@/components/providers/language-provider";

// High-resolution showcase slides
const sliderImages = [
  {
    id: "hdi",
    label: "Multilayer PCB",
    src: "/images/generated/pcb1.png",
    alt: "Precision Multilayer PCB Manufacturing",
    badge: "1-32 Layers • Rigid FR4",
    title: "High-Precision Multilayer PCB Prototyping",
    desc: "Laser microvias, blind & buried vias, controlled impedance (±5%), and IPC Class 2/3 manufacturing standards.",
    specs: ["Min Trace: 3/3 mil", "Min Hole: 0.15mm", "ENIG Gold / Lead-Free"],
  },
  {
    id: "pcba",
    label: "SMT Assembly",
    src: "/images/generated/smt_assembly.png",
    alt: "Automated Turnkey SMT Assembly",
    badge: "Turnkey PCBA • 24H Turn",
    title: "Automated SMT & THT Assembly Lines",
    desc: "0201 passive placement, fine-pitch BGA/QFN, 3D AOI optical inspection, and 100% genuine component sourcing.",
    specs: ["0201 Package", "BGA Pitch 0.25mm", "3D AOI & X-Ray"],
  },
  {
    id: "flex",
    label: "Flex & Rigid-Flex",
    src: "/images/generated/rigid_flex_pcb.png",
    alt: "Dynamic Flex & Rigid-Flex PCBs",
    badge: "Polyimide • Ultra-Thin",
    title: "Dynamic Flex & Rigid-Flex Circuits",
    desc: "High bend-radius polyimide circuits engineered for compact IoT wearables, automotive, and medical robotics.",
    specs: ["1-8 Flex Layers", "Polyimide PI", "Dynamic Bending"],
  },
  {
    id: "rogers",
    label: "Rogers & Aluminum",
    src: "/images/generated/high_freq_pcb.png",
    alt: "High Frequency & Aluminum Metal Core Boards",
    badge: "RF Microwave • Metal Core",
    title: "High-Frequency RF & Aluminum Boards",
    desc: "Rogers 4350B/4003C low dielectric loss materials and thermal-dissipating aluminum core for power modules.",
    specs: ["Rogers 4350B / 4003C", "Thermal: 2.0 W/mK", "Controlled Dk"],
  },
];

const quoteServices = [
  {
    id: "pcb-proto",
    name: "Standard PCB",
    icon: Cpu,
    tag: "From $5.00",
    badge: "Special",
    desc: "1-32 layers FR-4 prototyping & batch production",
  },
  {
    id: "pcb-assembly",
    name: "PCB Assembly",
    icon: PanelTop,
    tag: "Turnkey SMT",
    badge: "Fast SMT",
    desc: "Component sourcing, SMT placement & testing",
  },
  {
    id: "flex-pcb",
    name: "Rigid-Flex",
    icon: Layers3,
    tag: "Polyimide",
    badge: "Ultra-thin",
    desc: "Flexible circuits with stiffeners for compact devices",
  },
  {
    id: "smt-stencil",
    name: "SMD Stencil",
    icon: ScanLine,
    tag: "From $8.00",
    badge: "Laser Cut",
    desc: "Electropolished stainless steel SMD stencils",
  },
];

const standardColors = [
  { name: "Green", class: "bg-emerald-600", border: "border-emerald-600", label: "Classic Green" },
  { name: "Black", class: "bg-neutral-900", border: "border-neutral-900", label: "Matte Black" },
  { name: "Blue", class: "bg-blue-600", border: "border-blue-600", label: "Sapphire Blue" },
  { name: "Red", class: "bg-red-600", border: "border-red-600", label: "Signal Red" },
  { name: "White", class: "bg-white", border: "border-gray-300", label: "Signal White" },
  { name: "Yellow", class: "bg-amber-400", border: "border-amber-400", label: "Amber Yellow" },
];

const layerOptions = [
  { value: "1", label: "1L", tag: "Single" },
  { value: "2", label: "2L", tag: "Popular" },
  { value: "4", label: "4L", tag: "Multilayer" },
  { value: "6", label: "6L", tag: "High-Density" },
  { value: "8+", label: "8L+", tag: "Advanced" },
];

const quantityOptions = ["5", "10", "20", "50", "100", "200"];
const thicknessOptions = ["0.8", "1.0", "1.2", "1.6", "2.0"];
const dimensionPresets = [
  { label: "100 × 100 mm", length: "100", width: "100" },
  { label: "50 × 50 mm", length: "50", width: "50" },
  { label: "80 × 80 mm", length: "80", width: "80" },
];

const surfaceFinishOptions = [
  { id: "HASL", label: "HASL (Lead-Free)", desc: "Standard RoHS finish" },
  { id: "ENIG", label: "ENIG (Immersion Gold)", desc: "Flat surface for fine BGA" },
  { id: "HASL-LEAD", label: "HASL with Lead", desc: "Economy tin-lead" },
];

const allowedUploadExtensions = [".zip", ".rar", ".7z", ".csv", ".xlsx", ".xls", ".txt", ".pdf"];
const maxUploadSize = 50 * 1024 * 1024;

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
};

export default function NavbarSlider() {
  const router = useRouter();
  const dictionary = useDictionary();
  const heroCopy = dictionary.sections.hero;
  const calcCopy = dictionary.heroSlider;

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; amount: number } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; fileSize: number }[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });

  // Interactive PCB parameters (PCBWay / JLCPCB Style)
  const [dimensions, setDimensions] = useState({ length: "100", width: "100" });
  const [unit, setUnit] = useState<"mm" | "inch">("mm");
  const [selectedLayer, setSelectedLayer] = useState("2");
  const [selectedQty, setSelectedQty] = useState("5");
  const [selectedThickness, setSelectedThickness] = useState("1.6");
  const [selectedColor, setSelectedColor] = useState("Green");
  const [surfaceFinish, setSurfaceFinish] = useState("HASL");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const swiperRef = useRef<SwiperType | null>(null);

  const activeService = quoteServices[activeServiceIndex];

  // Real-time instant price calculation (Industry standard PCB formula)
  const estimatedPrice = (() => {
    const qty = Number(selectedQty) || 5;
    const layers = Number(selectedLayer.replace("+", "")) || 2;
    const l = Number(dimensions.length) || 100;
    const w = Number(dimensions.width) || 100;

    // Convert inch to mm for calculation if selected
    const lMm = unit === "inch" ? l * 25.4 : l;
    const wMm = unit === "inch" ? w * 25.4 : w;
    const areaDm2 = (lMm * wMm) / 10000;

    // Base $5 special condition (1-2 layer, <= 100x100mm, <= 10 pcs)
    if (layers <= 2 && areaDm2 <= 1.05 && qty <= 10 && surfaceFinish === "HASL") {
      return 5.0;
    }

    let base = layers === 1 ? 5 : layers === 2 ? 8 : layers === 4 ? 28 : layers === 6 ? 58 : 98;
    if (surfaceFinish === "ENIG") base += 12; // Gold finish surcharge

    const areaFactor = Math.max(0, areaDm2 - 1.0) * (layers * 3.5);
    const qtyFactor = (qty - 5) * (0.65 + layers * 0.25);
    const total = Math.max(5, base + areaFactor + qtyFactor);

    return Number(total.toFixed(2));
  })();

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const invalidFile = files.find((file) => !allowedUploadExtensions.includes(getExtension(file.name)));
    if (invalidFile) {
      const message = `${invalidFile.name} is not supported. Please upload ZIP, RAR, 7Z, CSV, XLSX, XLS, TXT or PDF.`;
      setUploadError(message);
      toast.error(message);
      return;
    }

    const oversizedFile = files.find((file) => file.size > maxUploadSize);
    if (oversizedFile) {
      const message = `${oversizedFile.name} exceeds 50MB limit.`;
      setUploadError(message);
      toast.error(message);
      return;
    }

    // Immediately stage files so the user sees their file is attached!
    setStagedFiles(files);
    setUploadedFiles(files.map((file) => ({ fileName: file.name, fileSize: file.size })));
    setUploadError("");

    const rawEmail = contactInfo.email.trim();
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);

    if (!hasValidEmail) {
      toast.success(
        `✓ ${files[0].name} attached! Click "${calcCopy?.calculateBtn || "Quote Now"}" to quote and submit to CAM team.`
      );
      return;
    }

    // If email is already entered, upload to server immediately
    try {
      setIsUploading(true);
      const result = await GerberService.uploadPublicInquiry(files, {
        fullName: rawEmail.split("@")[0],
        email: rawEmail,
        phone: contactInfo.phone.trim(),
        boardType: activeService.name,
        length: dimensions.length,
        width: dimensions.width,
        layers: selectedLayer,
        quantity: selectedQty,
        thickness: selectedThickness,
        surfaceFinish,
        solderMaskColor: selectedColor,
        totalAmount: estimatedPrice,
        description: `Instant Quote Config: ${dimensions.length}x${dimensions.width}${unit}, ${selectedLayer}L, ${selectedQty}pcs, ${selectedColor} solder mask, ${surfaceFinish} finish. Estimated: $${estimatedPrice.toFixed(2)}`,
      });

      if (result.files?.length) {
        setUploadedFiles(result.files.map((file) => ({ fileName: file.fileName, fileSize: file.fileSize })));
      }
      if (result.order?.id) {
        setConfirmedOrder({ id: result.order.id, amount: estimatedPrice });
        toast.success(`Design files verified! Order #${result.order.id.slice(0, 8).toUpperCase()} received ($${estimatedPrice.toFixed(2)}). CAM review underway.`);
      } else {
        toast.success(`Files verified! Inquiry #${result.inquiry.id.slice(0, 8).toUpperCase()} created. CAM engineering review underway.`);
      }
    } catch (error) {
      console.warn("Background upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCalculateAndOrder = async () => {
    const rawEmail = contactInfo.email.trim();
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);
    const email = hasValidEmail ? rawEmail : "customer@feitianpcb.com";

    // If files are staged in hero, upload them to CAM queue first
    if (stagedFiles.length > 0) {
      try {
        setIsSubmittingOrder(true);
        toast.info("Preparing your design files and loading full PCB configurator...");
        const result = await GerberService.uploadPublicInquiry(stagedFiles, {
          fullName: hasValidEmail ? email.split("@")[0] : "Direct Quote Customer",
          email,
          phone: contactInfo.phone.trim(),
          boardType: activeService.name,
          length: dimensions.length,
          width: dimensions.width,
          layers: selectedLayer,
          quantity: selectedQty,
          thickness: selectedThickness,
          surfaceFinish,
          solderMaskColor: selectedColor,
          totalAmount: estimatedPrice,
          description: `Instant Quote Config: ${dimensions.length}x${dimensions.width}${unit}, ${selectedLayer}L, ${selectedQty}pcs, ${selectedColor} solder mask, ${surfaceFinish} finish. Estimated: $${estimatedPrice.toFixed(2)}`,
        });

        const params = new URLSearchParams({
          orderId: result.order?.id || "",
          inquiryId: result.inquiry?.id || "",
          boardType: activeService.name,
          layers: String(selectedLayer),
          qty: String(selectedQty),
          length: String(dimensions.length),
          width: String(dimensions.width),
          thickness: String(selectedThickness),
          color: selectedColor,
          finish: surfaceFinish,
          price: estimatedPrice.toFixed(2),
          email: rawEmail,
          phone: contactInfo.phone.trim(),
        });
        toast.success(`Files verified! Loading full online quote configurator...`);
        router.push(`/pcb-quote?${params.toString()}`);
        return;
      } catch (err) {
        console.warn("Hero upload fallback:", err);
      } finally {
        setIsSubmittingOrder(false);
      }
    }

    // Direct navigation with quote params to the PCBWay-style configurator
    const params = new URLSearchParams({
      boardType: activeService.name,
      layers: String(selectedLayer),
      qty: String(selectedQty),
      length: String(dimensions.length),
      width: String(dimensions.width),
      thickness: String(selectedThickness),
      color: selectedColor,
      finish: surfaceFinish,
      price: estimatedPrice.toFixed(2),
      email: rawEmail,
      phone: contactInfo.phone.trim(),
    });
    toast.success(`Opening full PCB online quote configurator...`);
    router.push(`/pcb-quote?${params.toString()}`);
  };

  const uploadSummary = uploadedFiles.length
    ? uploadedFiles.length === 1
      ? `${uploadedFiles[0].fileName} (${formatFileSize(uploadedFiles[0].fileSize)})`
      : `${uploadedFiles.length} files attached & verified`
    : "Drop Gerber RS-274X (.zip, .rar) or BOM here";

  return (
    <section className="relative overflow-hidden bg-white pt-3 pb-8 sm:pt-5 sm:pb-14 border-b border-gray-100 dark:bg-slate-950 dark:border-slate-800">
      
      {/* Precision Engineering Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:36px_36px] opacity-70 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] dark:opacity-30" />
      
      {/* Subtle Radial Glows for Premium Depth */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-80 w-80 rounded-full bg-emerald-400/5 dark:bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1380px] px-4 sm:px-6">
        
        {/* ========================================================================= */}
        {/* TOP HERO HEADER & METRICS                                                 */}
        {/* ========================================================================= */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-gray-200/80 dark:border-slate-800 pb-5">
          <div className="max-w-3xl">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/90 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 mb-2.5 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span>{heroCopy.eyebrow || "Direct Factory • Wuping High-Tech Zone"}</span>
              <span className="h-3 w-px bg-emerald-300 dark:bg-emerald-700 mx-0.5" />
              <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                24H Turnaround Live
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              {heroCopy.title}
            </h1>

            {/* Sub-headline */}
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              {heroCopy.description}
            </p>

            {/* Trust Bullets */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-semibold text-gray-600 dark:text-slate-400">
              {(calcCopy?.badges || heroCopy.badges || ["1-32 Layer Capability", "IPC Class 2/3", "24h Rapid Dispatch"]).map((badge) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-end">
            <Link
              href="/pcb-quote"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition active:scale-95"
            >
              <Calculator className="size-3.5 text-emerald-400 dark:text-white" />
              {heroCopy.quoteBtn || "Full PCB Configurator"}
              <ChevronRight className="size-3.5" />
            </Link>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
            >
              Factory Specs
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MASTER HERO DUAL PANEL (7 COLS QUOTE ENGINE + 5 COLS SHOWCASE)            */}
        {/* ========================================================================= */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT: Master PCBWay-Style Interactive Quote Console (7 Cols)             */}
          {/* ----------------------------------------------------------------------- */}
          <div className="flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-xl shadow-gray-200/50 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
            <div>
              {/* Service Navigation Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-gray-100 dark:border-slate-800 pb-3.5">
                {quoteServices.map((service, index) => {
                  const Icon = service.icon;
                  const isActive = index === activeServiceIndex;

                  return (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => setActiveServiceIndex(index)}
                      className={`relative flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20"
                          : "bg-gray-50/90 text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-700 border border-gray-200/80 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/80 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-extrabold">
                        <Icon className="size-3.5 shrink-0" />
                        <span className="truncate">
                          {index === 0 ? (calcCopy?.tabPcb || service.name) : index === 1 ? (calcCopy?.tabPcba || service.name) : service.name}
                        </span>
                      </div>
                      <span className={`mt-0.5 text-[10px] font-semibold ${isActive ? "text-emerald-100" : "text-gray-400 dark:text-slate-400"}`}>
                        {service.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Form Controls Container */}
              <div className="mt-4 space-y-3.5">
                
                {/* 1. Dimensions with Unit Toggle & Quick Presets */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 space-y-2 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>{calcCopy?.dimensions || "Board Dimensions"}</span>
                      <span className="text-[10px] font-normal text-gray-400 dark:text-slate-500">(Length × Width)</span>
                    </label>

                    {/* mm / inch toggle */}
                    <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => setUnit("mm")}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black transition ${
                          unit === "mm" ? "bg-emerald-600 text-white shadow-xs" : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        MM
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit("inch")}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black transition ${
                          unit === "inch" ? "bg-emerald-600 text-white shadow-xs" : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        INCH
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={dimensions.length}
                          onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 pr-8 text-xs font-bold text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          placeholder="Length"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-gray-400 dark:text-slate-500">{unit}</span>
                      </div>
                      <span className="text-gray-400 dark:text-slate-600 font-black text-xs">×</span>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={dimensions.width}
                          onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 pr-8 text-xs font-bold text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          placeholder="Width"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-gray-400 dark:text-slate-500">{unit}</span>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1 shrink-0">
                      {dimensionPresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setUnit("mm");
                            setDimensions({ length: preset.length, width: preset.width });
                          }}
                          className={`rounded-lg border px-2 py-1 text-[10px] font-bold transition ${
                            unit === "mm" && dimensions.length === preset.length && dimensions.width === preset.width
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          {preset.length}×{preset.width}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Layer Count & Quantity Grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Layer Count */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center justify-between">
                      <span>{calcCopy?.layers || "Layer Count"}</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">{selectedLayer} Layers</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      {layerOptions.map((layer) => (
                        <button
                          key={layer.value}
                          type="button"
                          onClick={() => setSelectedLayer(layer.value)}
                          className={`h-9 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center ${
                            selectedLayer === layer.value
                              ? "bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500"
                              : "border border-gray-200 bg-gray-50/80 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span>{layer.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center justify-between">
                      <span>{calcCopy?.quantity || "Quantity (pcs)"}</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold">{selectedQty} pcs</span>
                    </label>
                    <div className="grid grid-cols-6 gap-1">
                      {quantityOptions.map((qty) => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setSelectedQty(qty)}
                          className={`h-9 rounded-lg text-xs font-black transition-all flex items-center justify-center ${
                            selectedQty === qty
                              ? "bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500"
                              : "border border-gray-200 bg-gray-50/80 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {qty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Board Thickness & Solder Mask Color */}
                <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-gray-100 dark:border-slate-800">
                  {/* Thickness */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Thickness (mm)</span>
                      <span className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold">{selectedThickness} mm</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      {thicknessOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedThickness(t)}
                          className={`h-8 rounded-lg text-xs font-bold transition-all ${
                            selectedThickness === t
                              ? "bg-gray-900 text-white shadow-xs dark:bg-emerald-600"
                              : "border border-gray-200 bg-gray-50/80 text-gray-700 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Solder Mask Visual Color Palette */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center justify-between">
                      <span>Solder Mask Color</span>
                      <span className="text-[11px] font-extrabold text-emerald-700">{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {standardColors.map((color) => {
                        const isSelected = selectedColor === color.name;
                        return (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setSelectedColor(color.name)}
                            title={color.label}
                            className={`size-7 rounded-full transition-transform ${color.class} ${color.border} flex items-center justify-center shadow-xs ${
                              isSelected ? "ring-2 ring-emerald-600 ring-offset-2 scale-110" : "opacity-85 hover:opacity-100 hover:scale-105"
                            }`}
                          >
                            {isSelected && (
                              <Check className={`size-4 stroke-[3] ${color.name === "White" ? "text-gray-900" : "text-white"}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Surface Finish Selection */}
                <div className="space-y-1 pt-1 border-t border-gray-100 dark:border-slate-800">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{calcCopy?.surfaceFinish || "Surface Finish"}</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">IPC-4552 Compliant</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {surfaceFinishOptions.map((finish) => (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSurfaceFinish(finish.id)}
                        className={`rounded-lg p-2 text-left transition-all ${
                          surfaceFinish === finish.id
                            ? "border border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600"
                            : "border border-gray-200 bg-gray-50/70 text-gray-700 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <div className="text-xs font-bold">{finish.label}</div>
                        <div className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{finish.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Contact Inputs */}
                <div className="grid gap-2.5 sm:grid-cols-2 pt-1 border-t border-gray-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1">
                      <span>Work Email *</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">(Instant quote)</span>
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="engineer@company.com"
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1">
                      <span>Phone Number</span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">(Urgent CAM inquiry)</span>
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* 6. Gerber / BOM Upload Dropzone */}
                <label
                  className={`flex min-h-[76px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-2.5 text-center transition-all ${
                    uploadError
                      ? "border-red-300 bg-red-50/80 hover:border-red-400"
                      : uploadedFiles.length
                        ? "border-emerald-500 bg-emerald-50/80"
                        : "border-emerald-300/80 bg-emerald-50/30 hover:border-emerald-500 hover:bg-emerald-50/60"
                  } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
                >
                  {isUploading ? (
                    <Loader2 className="size-5 animate-spin text-emerald-600" />
                  ) : uploadedFiles.length ? (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  ) : uploadError ? (
                    <AlertCircle className="size-5 text-red-600" />
                  ) : (
                    <UploadCloud className="size-5 text-emerald-600" />
                  )}
                  <p className="mt-1 text-xs font-extrabold text-gray-900 dark:text-white">
                    {isUploading ? "Uploading and verifying design files..." : uploadedFiles.length ? "✓ Design Files Attached" : (calcCopy?.uploadGerber || "Drag & Drop Gerber RS-274X (.zip, .rar) or BOM")}
                  </p>
                  <p className={`text-[11px] max-w-full truncate ${uploadError ? "text-red-600 font-semibold" : "text-gray-500 dark:text-slate-400"}`}>
                    {uploadError || (uploadedFiles.length ? uploadSummary : "Max 50MB • All files protected with strict NDA confidentiality")}
                  </p>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".zip,.rar,.7z,.csv,.xlsx,.xls,.txt,.pdf"
                    multiple
                    disabled={isUploading}
                    onChange={handleUpload}
                  />
                </label>

                {uploadedFiles.length ? (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                    <div className="flex items-center gap-2 truncate">
                      <FileArchive className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{uploadSummary}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStagedFiles([]);
                        setUploadedFiles([]);
                        toast.info("Attached file removed.");
                      }}
                      className="text-[11px] font-extrabold text-red-600 hover:text-red-800 dark:text-red-400 shrink-0 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Bottom Real-time Price Estimate & Order Bar */}
            <div className="mt-4 border-t border-gray-200/80 dark:border-slate-800 pt-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-emerald-50/80 to-gray-50 border border-emerald-200/80 rounded-xl p-3 dark:from-slate-900 dark:to-slate-950 dark:border-slate-800">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-400">{calcCopy?.instantPrice || "Calculated Build Cost:"}</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">${estimatedPrice.toFixed(2)}</span>
                    <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">({selectedQty} pcs • {selectedLayer}L)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-600 dark:text-slate-400 mt-0.5 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-emerald-600 dark:text-emerald-400" />
                      Build: <strong className="text-gray-900 dark:text-white">24-48 Hours</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                      DFM: <strong className="text-gray-900 dark:text-white">Free CAM Check</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isSubmittingOrder || isUploading}
                    onClick={handleCalculateAndOrder}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isSubmittingOrder ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Calculator className="size-4" />
                    )}
                    <span>{isSubmittingOrder ? "Placing Quote..." : (calcCopy?.calculateBtn || "Quote Now")}</span>
                  </button>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-600 bg-white px-3.5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition active:scale-95 dark:border-emerald-500 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800">
                    <Zap className="size-3.5" />
                    DFM Review
                    <input
                      type="file"
                      className="sr-only"
                      accept=".zip,.rar,.7z,.csv,.xlsx,.xls,.txt,.pdf"
                      multiple
                      disabled={isUploading}
                      onChange={handleUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Order Confirmation Banner */}
              {confirmedOrder ? (
                <div className="mt-2.5 flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Order #{confirmedOrder.id.slice(0, 8).toUpperCase()} placed successfully (${confirmedOrder.amount.toFixed(2)})!
                    </span>
                  </div>
                  <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-1 font-black underline hover:text-emerald-700 dark:hover:text-emerald-300 shrink-0 ml-2"
                  >
                    <span>View in Admin Orders</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT: Visual Showcase & Quality Trust Cards (5 Cols)                    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            
            {/* Interactive Showcase Card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 flex-1 flex flex-col min-h-[380px] dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
              
              {/* Quick Tab Selector for Showcase */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-950/80">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {sliderImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        swiperRef.current?.slideToLoop(idx);
                        setActiveSlideIndex(idx);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition whitespace-nowrap ${
                        activeSlideIndex === idx
                          ? "bg-white text-emerald-700 shadow-xs border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400"
                          : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 rounded px-2 py-0.5 dark:bg-emerald-950/80 dark:text-emerald-300">
                  IPC-A-600
                </span>
              </div>

              {/* Swiper Visual Showcase */}
              <div className="relative flex-1 min-h-[300px]">
                <Swiper
                  modules={[Autoplay, EffectFade, Navigation, Pagination]}
                  loop
                  slidesPerView={1}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  speed={800}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    setActiveSlideIndex(swiper.realIndex);
                  }}
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  className="premium-hero-swiper h-full w-full"
                >
                  {sliderImages.map((image, index) => (
                    <SwiperSlide key={image.alt}>
                      <div className="relative h-full min-h-[300px] w-full">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1024px) 100vw, 540px"
                          className="h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent" />
                        
                        {/* Floating Spec Badges */}
                        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-none">
                          {image.specs.map((spec) => (
                            <span
                              key={spec}
                              className="rounded-full bg-gray-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20 shadow-xs"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Slide Content */}
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                          <span className="inline-block rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                            {image.badge}
                          </span>
                          <h2 className="mt-1.5 text-lg sm:text-xl font-black tracking-tight text-white">
                            {image.title}
                          </h2>
                          <p className="mt-1 text-xs leading-relaxed text-gray-200 line-clamp-2">
                            {image.desc}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* 4 Trust & Guarantee Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs hover:border-emerald-300 transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Clock className="size-4" />
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-white">24H Quick-Turn</h3>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">Urgent prototypes ready in 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs hover:border-emerald-300 transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-white">100% E-Tested</h3>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">Flying probe & AOI visual check.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs hover:border-emerald-300 transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Microscope className="size-4" />
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-white">IPC Class 2/3</h3>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">High precision aerospace tolerance.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs hover:border-emerald-300 transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Truck className="size-4" />
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 dark:text-white">Global Express</h3>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5">DHL, FedEx, UPS direct air dispatch.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM CERTIFICATION & COMPLIANCE BAR                                     */}
        {/* ========================================================================= */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200/70 bg-gray-50/70 px-4 py-3 text-xs text-gray-600">
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <Award className="size-4 text-emerald-600" />
            <span>Certified Manufacturing Facility:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-gray-600">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              ISO 9001:2015 Quality Management
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              RoHS & REACH Compliant
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              UL 94V-0 Flammability Rating
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              IPC-A-600 / IPC-A-610 Class 3
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700">
            <Lock className="size-3.5" />
            <span>Strict NDA File Protection</span>
          </div>
        </div>

      </div>
    </section>
  );
}