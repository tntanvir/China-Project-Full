import { getBackendOrigin } from "@/lib/api-config";

export interface CatalogSpecItem {
  label: string;
  value: string;
}

export function resolveCatalogImageUrl(imageUrl?: string): string {
  if (!imageUrl) return "/images/generated/bare_rigid_pcb.png";
  if (imageUrl.startsWith("/uploads/")) {
    return `${getBackendOrigin()}${imageUrl}`;
  }
  return imageUrl;
}

export interface ProductFamilyItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  imageUrl: string;
  description: string;
  specs: CatalogSpecItem[];
  turnaround: string;
  bestFor: string;
  quoteUrl: string;
}

export const CATALOG_CATEGORIES = [
  "Rigid & Multilayer PCB",
  "Flex & Rigid-Flex PCB",
  "Advanced & RF Substrates",
  "Specialty & Metal Core PCB",
] as const;

export const CATALOG_PRESET_IMAGES = [
  { label: "Rigid PCB", url: "/images/generated/bare_rigid_pcb.png" },
  { label: "HDI Microvia", url: "/images/generated/bare_hdi_pcb.png" },
  { label: "Heavy Copper", url: "/images/generated/bare_heavy_copper.png" },
  { label: "Flexible FPC", url: "/images/generated/bare_flex_fpc.png" },
  { label: "Rigid-Flex", url: "/images/generated/bare_rigid_flex.png" },
  { label: "Aluminum MCPCB", url: "/images/generated/bare_aluminum_mcpcb.png" },
  { label: "Rogers RF", url: "/images/generated/bare_rogers_rf.png" },
] as const;

export const DEFAULT_CATALOG_FAMILIES: ProductFamilyItem[] = [
  {
    id: "rigid-multilayer",
    title: "Standard & High-TG Rigid PCB",
    subtitle: "High-Density FR-4 Multilayer Fabrication",
    category: "Rigid & Multilayer PCB",
    badge: "1-32 Layers",
    imageUrl: "/images/generated/bare_rigid_pcb.png",
    description:
      "High-precision 1 to 32 layer rigid circuit boards built with Shengyi/KB high-TG170 laminates, controlled differential impedance, and laser microvias.",
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
    imageUrl: "/images/generated/bare_hdi_pcb.png",
    description:
      "Fine-line laser microvias, stacked/staggered via-in-pad (VIPPO), and high-density interconnect routing for ultra-miniaturized electronics.",
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
    imageUrl: "/images/generated/bare_heavy_copper.png",
    description:
      "High-current circuit boards with up to 6oz (210µm) inner and outer copper weights designed for extreme current loads and rapid thermal transfer.",
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
    imageUrl: "/images/generated/bare_flex_fpc.png",
    description:
      "Ultra-thin, featherweight polyimide flex circuits engineered for dynamic bending, tight enclosures, and high-vibration environments.",
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
    imageUrl: "/images/generated/bare_rigid_flex.png",
    description:
      "Eliminates bulky wire harnesses and solder connectors by integrating rigid multi-layer FR-4 sections directly with flexible polyimide circuits.",
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
    imageUrl: "/images/generated/bare_aluminum_mcpcb.png",
    description:
      "Metal-backed circuit boards providing direct heat dissipation from high-power components to the chassis without requiring extra heatsinks.",
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
    imageUrl: "/images/generated/bare_rogers_rf.png",
    description:
      "Low dielectric loss (Df 0.002) and controlled dielectric constant (Dk 2.2 - 10.2) laminates engineered for high-frequency signal integrity up to 77GHz+.",
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
    id: "aluminum-metal-core",
    title: "Aluminum & Metal Core Substrates",
    subtitle: "High Thermal Dissipation Base for Power Systems",
    category: "Specialty & Metal Core PCB",
    badge: "1-4W/m-K Thermal Base",
    imageUrl: "/images/generated/bare_aluminum_mcpcb.png",
    description:
      "Thermally conductive insulated metal substrates (IMS) featuring pure aluminum or copper backing, designed for automotive headlights, power converters, and high-intensity LED matrices.",
    specs: [
      { label: "Base Materials", value: "Aluminum (1060/5052), Copper Core" },
      { label: "Thermal Conductivity", value: "1.0 - 4.0 W/m-K" },
      { label: "Dielectric Layer", value: "High-voltage breakdown (3-5kV)" },
      { label: "Surface Finish", value: "HASL Lead-Free, ENIG, OSP" },
    ],
    turnaround: "⚡ 2-4 Days Prototype",
    bestFor: "LED lighting, power supplies, automotive EV inverters, motor controllers",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "heavy-copper-pcb",
    title: "Heavy Copper High-Power PCB",
    subtitle: "3oz to 12oz Extreme Current Carrying Bare Boards",
    category: "Specialty & Metal Core PCB",
    badge: "Up to 12oz Copper",
    imageUrl: "/images/generated/bare_heavy_copper.png",
    description:
      "Heavy copper bare boards with up to 420µm outer/inner copper thickness, engineered to conduct hundreds of amperes without overheating or thermal delamination.",
    specs: [
      { label: "Copper Weight", value: "3oz - 12oz (105µm - 420µm)" },
      { label: "Thermal Relief", value: "Integrated thermal vias & heat sinks" },
      { label: "Dielectric Tg", value: "High-Tg FR-4 (Tg170°C - 180°C)" },
      { label: "Quality Inspection", value: "100% Netlist Flying-Probe & Hi-Pot" },
    ],
    turnaround: "⚡ 3-5 Days Turnaround",
    bestFor: "High-power distribution, battery management systems (BMS), industrial robotics",
    quoteUrl: "/pcb-quote",
  },
  {
    id: "high-density-hdi",
    title: "Any-Layer HDI Microvia Boards",
    subtitle: "Laser Microvias & Blind/Buried Stacks",
    category: "Specialty & Metal Core PCB",
    badge: "1+N+1 to 4+N+4 HDI",
    imageUrl: "/images/generated/bare_hdi_pcb.png",
    description:
      "Ultra-compact Any-Layer HDI bare boards with sub-3mil line/space width, copper filled microvias, and stacked laser via structures for ultra-dense packaging.",
    specs: [
      { label: "Microvia Technology", value: "CO2 / UV Laser (0.10mm microvia)" },
      { label: "Min Line/Space", value: "2.5 mil / 2.5 mil (0.065mm)" },
      { label: "Aspect Ratio", value: "0.8:1 - 1:1 Copper-Filled Via" },
      { label: "Surface Finish", value: "ENIG (Electroless Nickel Immersion Gold)" },
    ],
    turnaround: "⚡ 3-5 Days Quick-Turn",
    bestFor: "Mobile electronics, aerospace sensors, medical endoscopy, high-density wearables",
    quoteUrl: "/pcb-quote",
  },
];
