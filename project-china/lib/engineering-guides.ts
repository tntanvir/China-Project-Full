import { resolveCatalogImageUrl } from "@/lib/catalog-families";

export interface EngineeringGuideItem {
  id: string;
  title: string;
  description: string;
  content: string;
  tag: string;
  readTime: string;
  imageUrl: string;
  author: string;
}

export const GUIDE_TAGS = ["Engineering", "Materials", "Assembly", "DFM", "Quality"] as const;

export const GUIDE_PRESET_IMAGES = [
  { label: "PCB Layout", url: "/images/generated/pcb1.png" },
  { label: "Surface Finish", url: "/images/generated/pcb2.png" },
  { label: "SMT Assembly", url: "/images/generated/pcb3.png" },
  { label: "Testing Lab", url: "/images/generated/pcb4.png" },
] as const;

export const DEFAULT_ENGINEERING_GUIDES: EngineeringGuideItem[] = [
  {
    id: "dfm-analysis-yield",
    title: "How DFM Analysis Improves Yield",
    description: "Avoid common layout revisions and component fit issues before fabrication.",
    content:
      "Design for Manufacturing (DFM) checks catch spacing violations, insufficient annular rings, acid traps, and silkscreen-over-pad issues before tooling begins.\n\nKey CAM guidelines:\n1. Keep minimum trace/space at 3/3 mil (4/4 mil or higher for cost efficiency).\n2. Maintain at least 0.10mm annular ring on mechanical vias.\n3. Verify solder mask dam clearance (>= 4 mil) between fine-pitch QFN/BGA pads to prevent solder bridging during reflow.\n4. Include an IPC-356 netlist so 100% flying-probe electrical testing guarantees zero opens or shorts.",
    tag: "Engineering",
    readTime: "4 min read",
    imageUrl: "/images/generated/pcb1.png",
    author: "Feitian CAM Engineering Desk",
  },
  {
    id: "enig-vs-hasl-finish",
    title: "Choosing ENIG vs HASL Finish",
    description: "Compare solderability, flatness, and shelf life for SMT assembly.",
    content:
      "Selecting the right PCB surface finish directly impacts SMT yield, reliability, and total cost.\n\n• Lead-Free HASL: Best value for standard 1-4 layer boards with >= 0.5mm pitch parts. Rugged solderability with minor surface unevenness.\n• ENIG (Electroless Nickel Immersion Gold): Ultra-flat co-planarity ideal for 0.4mm pitch BGAs, 0201 passives, wire bonding, and long shelf life (12+ months).\n• Recommendation: Use Lead-Free HASL for general prototypes and power boards; upgrade to ENIG 2u\" when your BOM includes fine-pitch QFNs, BGAs, or exposed edge contacts.",
    tag: "Materials",
    readTime: "3 min read",
    imageUrl: "/images/generated/pcb2.png",
    author: "Feitian CAM Engineering Desk",
  },
  {
    id: "turnkey-smt-checklist",
    title: "Turnkey SMT Assembly Checklist",
    description: "Prepare Gerber, BOM, and pick-and-place files for smooth production.",
    content:
      "Clean assembly documentation eliminates engineering holds and speeds up 24-48h SMT turnarounds.\n\nBefore submitting a turnkey PCBA order:\n1. Export RS-274X or ODB++ Gerbers with clear board outline, solder paste layers (GTP/GBP), and drill files.\n2. Provide an Excel/CSV BOM containing Manufacturer Part Numbers (MPNs), designators, quantities, and approved alternates.\n3. Include Centroid / Pick-and-Place (CPL) coordinates with Pin-1 polarity markers matched to your assembly drawing.\n4. Note any conformal coating, selective wave soldering, or functional test (FCT) fixtures required.",
    tag: "Assembly",
    readTime: "5 min read",
    imageUrl: "/images/generated/pcb3.png",
    author: "Feitian SMT Production Team",
  },
];

export { resolveCatalogImageUrl as resolveGuideImageUrl };
