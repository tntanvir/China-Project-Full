"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cpu,
  Factory,
  Mail,
  MessageCircle,
  Microscope,
  Phone,
  Quote,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  UploadCloud,
  Zap,
} from "lucide-react";
import { ProductCard } from "@/app/(commonLayout)/products/ProductCard";
import { useDictionary } from "@/components/providers/language-provider";
import { getPcbYoutubeEmbedUrl } from "@/lib/youtube-videos";
import type { IProduct } from "@/services/product.service";
import type { IPage } from "@/services/page.service";
import { GerberService } from "@/services/gerber.service";
import { toast } from "sonner";
import GlobalNetworkGlobe from "./GlobalNetworkGlobe";
import TestimonialsSlider from "./TestimonialsSlider";
import ProductCategoriesHub from "./ProductCategoriesHub";
import { SocialLinksRow, WhatsAppIcon } from "@/components/ui/SocialLinksBar";

const pcbImages = [
  "/images/generated/pcb1.png",
  "/images/generated/pcb2.png",
  "/images/generated/pcb3.png",
  "/images/generated/pcb4.png",
];

const stats = [
  { value: "15+", label: "Years Manufacturing Experience", desc: "Trusted by 10,000+ engineers globally" },
  { value: "18,000 m²", label: "Automated Production Facility", desc: "Fujian & Shenzhen smart factories" },
  { value: "50,000 m²", label: "Monthly PCB Capacity", desc: "From fast prototype to volume runs" },
  { value: "60+", label: "Global Export Regions", desc: "Express delivery via DHL, FedEx, UPS" },
];



const fallbackShowcaseProducts = [
  ["Multilayer Industrial PCB", "Premium 4-8 layer fabrication for industrial automation and IoT gateway controllers."],
  ["Turnkey SMT Assembled Board", "Surface mount assembled board with genuine BOM sourcing and full AOI quality verification."],
  ["High-TG Impedance Controlled Board", "Precision differential impedance matched boards for high-speed digital communications."],
  ["Double-Sided Aluminum Core PCB", "Thermal management metal-core circuit board for high-output LED arrays."],
  ["Flexible Sensor Circuit", "Ultra-thin polyimide flex board for wearable medical monitoring devices."],
  ["High-Density HDI Smartphone Board", "Microvia 1+N+1 laser drilled circuit board for compact portable electronics."],
];

const advantages = [
  ["Guaranteed High Quality", "100% E-test, flying probe testing, AOI visual inspection, and cross-section analysis.", ShieldCheck],
  ["24h Quick-Turn Delivery", "Fast prototyping and responsive production scheduling built for urgent deadlines.", Clock3],
  ["Factory Direct Pricing", "Transparent quotation with zero hidden markups from our own manufacturing plants.", Zap],
  ["Cutting-Edge Technology", "Any-layer HDI, blind/buried vias, heavy copper (up to 6oz), and controlled impedance.", Cpu],
  ["Global Express Logistics", "Worldwide insured door-to-door courier shipping via DHL, FedEx, and UPS.", Truck],
];

const certifications = ["ISO 9001:2015", "RoHS Compliant", "UL 94V-0 Certified", "IPC-A-600 Class 2/3", "IPC-A-610 Workmanship", "REACH Compliant"];



const processSteps = [
  { step: "01", title: "Online Quote", desc: "Select board specs or upload Gerber files for instant pricing." },
  { step: "02", title: "DFM Review", desc: "Free engineering design rule check before fabrication begins." },
  { step: "03", title: "Cam & Tooling", desc: "High-precision photo tooling, drilling, and laser setup." },
  { step: "04", title: "Fabrication", desc: "Copper plating, etching, solder mask, silkscreen, and surface finish." },
  { step: "05", title: "Quality Control", desc: "100% flying probe testing, AOI inspection, and dimensional checks." },
  { step: "06", title: "Vacuum Packing", desc: "Moisture-barrier ESD packing with desiccant and protective carton." },
  { step: "07", title: "Express Delivery", desc: "Dispatched with real-time tracking via DHL, FedEx, or UPS." },
];

const articles = [
  ["How DFM Analysis Improves PCB Production Yield", "Practical manufacturing tips for hardware engineers to avoid costly circuit board revisions and component fit issues.", "Engineering Guide"],
  ["Choosing ENIG vs HASL for Your Circuit Board", "An in-depth breakdown of surface finishes, solderability, shelf-life, and contact pad durability for SMT.", "Material Selection"],
  ["Turnkey SMT Assembly Checklist Before Production", "What files and BOM details hardware teams must prepare for error-free pick-and-place component assembly.", "Assembly Tips"],
];

const videos = [
  ["Automated SMT Assembly Line", "Yamaha pick-and-place machine mounting 0201 passive components and BGA packages at 45,000 CPH."],
  ["PCB Laser Drilling & Etching", "High-precision CNC drilling and chemical etching creating clean fine-line conductor traces."],
  ["AOI & Flying Probe Inspection", "Automated Optical Inspection and electrical testing ensuring 100% defect-free circuit continuity."],
];

const facilityZones = [
  {
    id: "smt",
    title: "High-Speed SMT Assembly",
    subtitle: "Surface Mount Technology",
    badge: "6 Automated Lines",
    tagline: "Ultra-fast Yamaha YSM20R modular mounters with 0201 chip capability and 10-zone nitrogen reflow profiling.",
    image: "/images/generated/smt_assembly.png",
    specs: [
      { label: "Placement Speed", val: "60,000 CPH / line" },
      { label: "Component Min", val: "0201 (0.6×0.3mm)" },
      { label: "BGA Pitch", val: "0.25mm Ultra-Fine" },
      { label: "Reflow Oven", val: "10-Zone Nitrogen (N₂)" },
    ],
    highlights: [
      "Yamaha & Panasonic high-speed modular placement machines",
      "Automatic solder paste stencil printers with 2D paste inspection",
      "Inline 3D AOI (Automated Optical Inspection) post-soldering",
      "ESD Class 0 electro-static dissipative controlled clean environment",
    ],
  },
  {
    id: "cleanroom",
    title: "Cleanroom LDI Exposure",
    subtitle: "PCB Fabrication Core",
    badge: "Class 10,000 Cleanroom",
    tagline: "Orbotech Laser Direct Imaging for precise sub-3mil fine traces, blind/buried vias, and zero defect exposure.",
    image: "/images/generated/fallback_hero.png",
    specs: [
      { label: "Cleanroom Standard", val: "ISO Class 7 (10,000)" },
      { label: "Min Trace/Space", val: "3 mil / 3 mil (0.075mm)" },
      { label: "Laser Microvia", val: "0.10mm (4 mil) Dia." },
      { label: "Layer Alignment", val: "±0.025mm Optical Pin" },
    ],
    highlights: [
      "Orbotech Laser Direct Imaging (LDI) for sub-3mil fine conductor lines",
      "Schmoll high-speed CNC drilling and UV laser microvia machining",
      "Multi-opening vacuum hot-press laminators with computerized temp curves",
      "Vertical continuous automated copper plating for uniform hole barrels",
    ],
  },
  {
    id: "testing",
    title: "100% E-Testing & QA Lab",
    subtitle: "IPC Class 2/3 Verification",
    badge: "Zero-Defect Standard",
    tagline: "Dual-sided flying probe electrical testing, automated optical inspection, and cross-section metallurgical analysis.",
    image: "/images/generated/pcb1.png",
    specs: [
      { label: "Flying Probe", val: "100% Netlist Continuity" },
      { label: "Impedance Control", val: "Polar CITS TDR ±5%" },
      { label: "3D X-Ray", val: "BGA/QFN Void Inspection" },
      { label: "Microsection", val: "Copper Thickness & Vias" },
    ],
    highlights: [
      "Takaya high-speed flying probe test systems verifying all prototypes",
      "Nordson Dage 3D X-Ray system for non-destructive BGA void analysis",
      "Ionic contamination and solderability testing per IPC-TM-650",
      "Metallographic cross-section microscope for via barrel copper thickness",
    ],
  },
  {
    id: "surface",
    title: "Surface Finishing & Chem Lab",
    subtitle: "Chemical Plating",
    badge: "RoHS & REACH",
    tagline: "Automated ENIG electroless nickel immersion gold lines, lead-free HASL, and electropolished SMD stencils.",
    image: "/images/generated/pcb4.png",
    specs: [
      { label: "ENIG Gold", val: "Au: 1-3u\", Ni: 120-200u\"" },
      { label: "Lead-Free HASL", val: "Sn-Cu-Ni RoHS Compliant" },
      { label: "Immersion Silver", val: "Flat Co-planarity" },
      { label: "Laser Stencils", val: "Electropolished Stainless" },
    ],
    highlights: [
      "Chemical immersion gold plating lines with automated chemical dosing",
      "High-precision laser stencil cutting with electropolished aperture walls",
      "Automated optical measurement for solder mask thickness and dams",
      "Moisture-barrier vacuum packaging with humidity indicator cards",
    ],
  },
];

function SectionHeader({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
        <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        {badge}
      </span>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export default function PremiumWupingHomepage({ products = [] }: { products?: IProduct[]; sections?: IPage[] }) {
  const dictionary = useDictionary();
  const sectionCopy = dictionary.sections;
  const statsItems = dictionary.stats?.items || stats;
  const facilityData = dictionary.facility;

  const zonesList = (facilityData?.zones && facilityData.zones.length)
    ? facilityZones.map((fz, idx) => ({
        ...fz,
        title: facilityData.zones[idx]?.title || fz.title,
        subtitle: facilityData.zones[idx]?.subtitle || fz.subtitle,
        badge: facilityData.zones[idx]?.badge || fz.badge,
        tagline: facilityData.zones[idx]?.tagline || fz.tagline,
        specs: facilityData.zones[idx]?.specs || fz.specs,
        highlights: facilityData.zones[idx]?.highlights || fz.highlights,
      }))
    : facilityZones;

  const advantagesList = (dictionary.advantages?.items && dictionary.advantages.items.length)
    ? advantages.map(([title, desc, Icon], idx) => [
        dictionary.advantages.items[idx]?.title || title,
        dictionary.advantages.items[idx]?.desc || desc,
        Icon,
      ])
    : advantages;

  const processList = (dictionary.processSteps?.items && dictionary.processSteps.items.length)
    ? processSteps.map((ps, idx) => ({
        ...ps,
        title: dictionary.processSteps.items[idx]?.title || ps.title,
        desc: dictionary.processSteps.items[idx]?.desc || ps.desc,
      }))
    : processSteps;

  const inquiryCopy = dictionary.inquiryForm;

  const [facilityZoneIndex, setFacilityZoneIndex] = useState(0);
  const activeZone = zonesList[facilityZoneIndex] || zonesList[0];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("Name") as string,
      email: formData.get("Email") as string,
      phone: formData.get("Phone") as string,
      boardType: formData.get("PCB Type") as string,
      description: formData.get("Project Requirement") as string,
    };

    if (!payload.fullName || !payload.email || !payload.description) {
      toast.error("Please fill in Name, Email, and Project Requirement.");
      return;
    }

    try {
      setIsSubmitting(true);
      await GerberService.uploadPublicInquiry([], payload);
      toast.success("Inquiry sent successfully. An engineer will contact you shortly.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 selection:bg-emerald-100 dark:selection:bg-emerald-900/60 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-300">
      
      {/* 1. Factory Stats & Capability Bar (Clean PCBWay White Style) */}
      <section className="border-b border-gray-100 dark:border-slate-800/80 bg-gray-50/60 dark:bg-slate-900/40 py-8 lg:py-10">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {statsItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md"
              >
                <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                  {item.value}
                </div>
                <div className="mt-1 text-sm font-bold text-gray-900 dark:text-slate-100">
                  {item.label}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Unified PCB & PCBA Product Families Hub */}
      <ProductCategoriesHub />

      {/* 4. Featured Electronics & PCB Catalog */}
      <section className="py-14 sm:py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-6 sm:flex-row">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                Online Catalog
              </span>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Featured Electronics & Boards
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 transition hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              View Full Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              fallbackShowcaseProducts.map(([title, description], index) => (
                <article
                  key={title}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-800">
                      <Image
                        src={pcbImages[index % pcbImages.length]}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-gray-900 dark:text-slate-100">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                      {description}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-slate-800 pt-4">
                    <button
                      type="button"
                      onClick={() => toast.success(`${title} added to cart.`)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-gray-700 dark:text-slate-200 transition hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                    </button>
                    <Link
                      href="/pcb-quote"
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      Instant Quote
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Modern Visual Factory Showcase & Video Tour */}
      <section className="py-14 sm:py-20 bg-gray-50/70 dark:bg-slate-900/60 border-t border-gray-200 dark:border-slate-800">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <SectionHeader
            badge={facilityData?.badge || sectionCopy.factory.eyebrow || "Factory Facility"}
            title={facilityData?.title || "Smart Automated Manufacturing Facility"}
            description={facilityData?.description || "Inspect our automated cleanroom production lines, high-speed SMT placement, automated optical inspection, and flying probe test labs."}
          />

          {/* Interactive Zone Switcher Tabs */}
          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {zonesList.map((zone, idx) => {
              const isActive = facilityZoneIndex === idx;
              return (
                <button
                  key={zone.id || idx}
                  type="button"
                  onClick={() => setFacilityZoneIndex(idx)}
                  className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                    isActive
                      ? "border-emerald-600 dark:border-emerald-500 bg-white dark:bg-slate-900 shadow-md shadow-emerald-600/10 ring-2 ring-emerald-500/20"
                      : "border-gray-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400 dark:text-slate-500"}`}>
                      Zone 0{idx + 1}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                      isActive ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                    }`}>
                      {zone.badge}
                    </span>
                  </div>
                  <h4 className="mt-1.5 text-xs sm:text-sm font-black text-gray-900 dark:text-slate-100 leading-tight">
                    {zone.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400 line-clamp-1">
                    {zone.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Master 12-Column Facility Showcase */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            
            {/* Left: Active Department Image + Machine Specs + Process Checklist (7 Cols) */}
            <div className="flex flex-col justify-between rounded-3xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl shadow-gray-200/50 dark:shadow-none lg:col-span-7">
              <div>
                {/* Visual Header Image with Glassmorphism Overlays */}
                <div className="relative h-[280px] sm:h-[340px] w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800">
                  <Image
                    src={activeZone.image}
                    alt={activeZone.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />
                  
                  {/* Floating Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gray-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white border border-white/20 shadow-xs">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Workshop: {activeZone.title}</span>
                  </div>

                  {/* Image Bottom Typography */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                      {activeZone.badge}
                    </span>
                    <h3 className="mt-1.5 text-lg sm:text-xl font-black text-white">
                      {activeZone.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-200 leading-relaxed max-w-xl">
                      {activeZone.tagline}
                    </p>
                  </div>
                </div>

                {/* Machine Specs Grid (4 Cols) */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeZone.specs.map((spec) => (
                    <div key={spec.label} className="rounded-xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/60 p-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400">
                        {spec.label}
                      </div>
                      <div className="mt-0.5 text-xs sm:text-[13px] font-black text-emerald-700 dark:text-emerald-400">
                        {spec.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quality & Process Highlights (2x2 Checklist) */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <div className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                    Verified Process Standards:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    {activeZone.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-gray-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Strip */}
              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-slate-400 font-medium">IPC Class 2/3 and ISO 9001:2015 compliant line</span>
                <Link
                  href="/pcb-quote"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition"
                >
                  Configure on this line <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Live Video Tour Embed + Cleanroom Control (5 Cols) */}
            <div className="flex flex-col justify-between gap-5 lg:col-span-5">
              
              {/* Live Factory Video Card */}
              <div className="overflow-hidden rounded-3xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/80 px-4 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-slate-200">
                    <span className="size-2 rounded-full bg-red-600 animate-ping" />
                    <span className="size-2 rounded-full bg-red-600" />
                    <span>Live Video Tour: Automated Production</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 rounded px-2 py-0.5">
                    HD 1080P
                  </span>
                </div>

                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="h-full w-full"
                    src={getPcbYoutubeEmbedUrl("company-overview", 1)}
                    title="Wuping Feitian company production video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-4">
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-slate-100 leading-snug">
                    Automated SMT & Multi-Layer PCB Production Line Tour
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                    Watch our automated Yamaha high-speed placement lines, vacuum laminators, and automated optical inspection systems operating in real-time.
                  </p>
                </div>
              </div>

              {/* Environmental Control Card */}
              <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      <Microscope className="size-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-slate-100">Class 10,000 Cleanroom Environment</h4>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400">Constant Temperature (22±2°C) & Humidity (55±5%)</p>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                    ISO Class 7
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-slate-300 leading-relaxed">
                  Positive pressure laminar airflow filters out airborne particles down to 0.5 microns, ensuring zero particulate defects on inner-layer dry films and solder mask application.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Link
                  href="/pcb-quote"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition active:scale-95"
                >
                  <Zap className="size-3.5 fill-current" />
                  Instant Factory Quote
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                >
                  Book In-Person Tour
                </a>
              </div>

            </div>

          </div>

          {/* Under-Showcase 4-Pillar Capacity Highlights Strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Building2 className="size-5" />
              </span>
              <div>
                <div className="text-base sm:text-lg font-black text-gray-900 dark:text-slate-100 leading-tight">18,000 m²</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Smart Manufacturing Base</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Cpu className="size-5" />
              </span>
              <div>
                <div className="text-base sm:text-lg font-black text-gray-900 dark:text-slate-100 leading-tight">6 SMT Lines</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Yamaha & Panasonic High-Speed</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Factory className="size-5" />
              </span>
              <div>
                <div className="text-base sm:text-lg font-black text-gray-900 dark:text-slate-100 leading-tight">50,000 m²/mo</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">Monthly Output Capacity</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                <Award className="size-5" />
              </span>
              <div>
                <div className="text-base sm:text-lg font-black text-gray-900 dark:text-slate-100 leading-tight">100% Tested</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">AOI, Flying Probe & X-Ray</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Why Choose FT PCB (Engineering Advantages) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <SectionHeader
            badge={dictionary.advantages?.eyebrow || sectionCopy.about.eyebrow || "Engineering Advantage"}
            title={dictionary.advantages?.title || "Why Hardware Engineers Choose FT PCB"}
            description={dictionary.advantages?.description || "We combine direct manufacturing control, rigorous IPC quality standards, and responsive customer service."}
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {advantagesList.map(([title, description, Icon]) => (
              <div
                key={title as string}
                className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-gray-900 dark:text-white">
                  {title as string}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                  {description as string}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications Bar */}
          <div className="mt-10 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/60 p-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                International Quality Certifications:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1 text-xs font-bold text-gray-800 dark:text-slate-200 shadow-xs"
                  >
                    <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Standard 7-Step Production Workflow */}
      <section className="py-14 sm:py-20 bg-gray-50/70 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-800">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <SectionHeader
            badge={dictionary.processSteps?.eyebrow || sectionCopy.capability.eyebrow || "Production Process"}
            title={dictionary.processSteps?.title || "Transparent 7-Step Manufacturing Pipeline"}
            description={dictionary.processSteps?.description || "From digital CAD upload to automated production and vacuum-sealed dispatch."}
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {processList.map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md"
              >
                <div>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-sm font-extrabold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Global Logistics & Worldwide Delivery */}
      <GlobalNetworkGlobe />

      {/* 9. Verified Client Testimonials Slider */}
      <TestimonialsSlider />

      {/* 10. Engineering Knowledge Base & Articles */}
      <section className="py-14 sm:py-20 bg-gray-50/70 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-800">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <SectionHeader
            badge="PCB Knowledge Base"
            title="PCB Engineering Insights & Design Guides"
            description="Technical tips written by CAM engineers to optimize manufacturability and lower PCB costs."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map(([title, description, tag], index) => (
              <article
                key={title}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-800">
                    <Image
                      src={pcbImages[index % pcbImages.length]}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                      {tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                    {description}
                  </p>
                </div>

                <div className="mt-5 border-t border-gray-100 dark:border-slate-800 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                    Read Engineering Guide <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Fast Custom Inquiry Form & Contact Details (Clean White / PCBWay Style) */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <div className="grid gap-10 rounded-3xl border border-gray-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50/40 via-white to-gray-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 shadow-xl sm:p-10 lg:grid-cols-12 lg:items-start">
            
            {/* Contact Details */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                Direct Factory Contact
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Ready to Build Your Circuit Board?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                Send your Gerber design, BOM, or custom PCB requirements directly to our factory CAM engineering team. Fast quotation within 2 hours.
              </p>

              <div className="mt-8 space-y-4 text-xs font-bold text-gray-700 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span>ft-osr@feitianpcb.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span>+86 189 2742 6587 (Direct Line)</span>
                </div>
                <a
                  href="https://wa.me/message/KOW2GMXJ7DKHG1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 transition group"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs group-hover:scale-105 transition-transform">
                    <WhatsAppIcon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <span className="font-bold block text-xs">WhatsApp: +86 189 2742 6587</span>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Click for 24/7 instant engineering chat ↗</span>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 mt-0.5">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-medium leading-relaxed text-gray-600 dark:text-slate-400">
                    Factory: Yanqian Industrial Cluster, Wuping County, Longyan City, Fujian Province, China | Shenzhen Tech Office: Fenghuang Zhi Gu, Baoan District, Shenzhen
                  </span>
                </div>

                {/* FT Company Official Social Channels */}
                <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                    FT Official Social Media Channels
                  </span>
                  <SocialLinksRow />
                </div>
              </div>
            </div>

            {/* Public Quick Inquiry Form */}
            <form
              onSubmit={handleContactSubmit}
              className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md lg:col-span-7"
            >
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-4">
                {inquiryCopy?.title || "Quick Project Inquiry / DFM Question"}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">{inquiryCopy?.nameLabel || "Full Name"} *</span>
                  <input
                    name="Name"
                    required
                    className="h-10 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-gray-800 dark:text-slate-100 outline-none transition focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="John Doe"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">{inquiryCopy?.emailLabel || "Corporate Email"} *</span>
                  <input
                    name="Email"
                    type="email"
                    required
                    className="h-10 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-gray-800 dark:text-slate-100 outline-none transition focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="john@company.com"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">{inquiryCopy?.phoneLabel || "Phone / WhatsApp"}</span>
                  <input
                    name="Phone"
                    type="tel"
                    className="h-10 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-gray-800 dark:text-slate-100 outline-none transition focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="+1 555 123 4567"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">{inquiryCopy?.boardTypeLabel || "Board Type"}</span>
                  <select
                    name="PCB Type"
                    className="h-10 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-semibold text-gray-800 dark:text-slate-100 outline-none transition focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Rigid PCB">Standard Rigid PCB</option>
                    <option value="PCB Assembly">Turnkey PCB Assembly (PCBA)</option>
                    <option value="Flexible PCB">Flexible PCB (FPC)</option>
                    <option value="Rigid-Flex PCB">Rigid-Flex Circuit</option>
                    <option value="Aluminum PCB">Aluminum Metal Core PCB</option>
                    <option value="HDI PCB">HDI Microvia PCB</option>
                  </select>
                </label>
              </div>

              <label className="mt-3 block space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400">{inquiryCopy?.requirementLabel || "Project Requirements"} *</span>
                <textarea
                  name="Project Requirement"
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-gray-800 dark:text-slate-100 outline-none transition placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Include layer count, board dimensions, target quantity, surface finish (ENIG/HASL), and delivery timeline."
                />
              </label>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/pcb-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-slate-300 transition hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  <UploadCloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Detailed PCB Quote Calculator
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting ? (inquiryCopy?.submitting || "Submitting...") : (inquiryCopy?.submitBtn || "Send Factory Inquiry")}
                  <Zap className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
