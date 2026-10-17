import {
  BrainCircuit,
  Cpu,
  Factory,
  Globe2,
  LineChart,
  Microscope,
  ShieldCheck,
  Zap,
  Target,
  Award,
  Settings
} from "lucide-react";

export interface PageContentData {
  tagline: string;
  description: string;
  heroImage: string;
  stats: { label: string; value: string }[];
  features: { title: string; desc: string; icon: any }[];
}

export function getPageContent(pageSlug: string, sectionSlug: string, pageTitle: string): PageContentData {
  const contentMap: Record<string, PageContentData> = {
    "company-profile": {
      tagline: "Pioneering the AI-Driven Electronics Era",
      description: "Founded on the principles of precision and innovation, Wuping Feitian Electronic Technology Company Limited has evolved into a global leader in PCB manufacturing. By integrating Artificial Intelligence into our Smart Factory infrastructure, we deliver unparalleled quality and speed.",
      heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
      stats: [
        { label: "Years Experience", value: "15+" },
        { label: "Global Clients", value: "10,000+" },
        { label: "Daily Production", value: "50,000㎡" }
      ],
      features: [
        { title: "Smart Factory", desc: "Fully automated, IoT-enabled production lines ensuring maximum efficiency.", icon: Factory },
        { title: "Global Reach", desc: "Shipping high-quality electronics to over 150 countries worldwide.", icon: Globe2 },
        { title: "AI DFM Core", desc: "Proprietary machine learning models pre-check all designs for zero defects.", icon: BrainCircuit }
      ]
    },
    "rigid-pcb": {
      tagline: "High-Density, Rock-Solid Reliability",
      description: "Our Rigid PCBs form the backbone of modern electronics. From 1 to 32 layers, we utilize advanced laser drilling and AI-monitored lamination to ensure every board withstands the most demanding electrical and thermal environments.",
      heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
      stats: [
        { label: "Max Layers", value: "32L" },
        { label: "Min Trace/Space", value: "3/3 mil" },
        { label: "Yield Rate", value: "99.9%" }
      ],
      features: [
        { title: "Precision Routing", desc: "CNC routers with micrometer accuracy.", icon: Target },
        { title: "Thermal Control", desc: "Advanced materials like Rogers and TG180 FR4.", icon: Zap },
        { title: "100% E-Tested", desc: "Flying probe and bed-of-nails electrical testing.", icon: Microscope }
      ]
    },
    "smt": {
      tagline: "Automated, AI-Optimized Surface Mount Technology",
      description: "Our Surface Mount Technology (SMT) lines are the heart of our PCBA service. Powered by AI-driven pick-and-place machines and 3D AOI inspection, we can place the smallest 01005 components with absolute precision at blazing speeds.",
      heroImage: "https://images.unsplash.com/photo-1563207153-f404bf989bfd?q=80&w=2000&auto=format&fit=crop",
      stats: [
        { label: "Placement Speed", value: "100k CPH" },
        { label: "Min Component Size", value: "01005" },
        { label: "AOI Accuracy", value: "99.99%" }
      ],
      features: [
        { title: "3D AOI Inspection", desc: "Machine vision algorithms detect the slightest solder defects.", icon: ShieldCheck },
        { title: "Smart Reflow", desc: "Dynamic temperature profiling for optimal solder joints.", icon: Settings },
        { title: "High-Speed Placement", desc: "Yamaha & Fuji automated SMT machines.", icon: Cpu }
      ]
    },
    "pcb-products": {
      tagline: "Any Board, Any Complexity",
      description: "Explore our massive range of PCB products. Whether you need standard FR4 for consumer electronics or high-frequency Rogers boards for aerospace applications, our AI-powered factory can manufacture it.",
      heroImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop",
      stats: [
        { label: "Product Types", value: "50+" },
        { label: "Material Options", value: "100+" },
        { label: "Daily Output", value: "10M pcs" }
      ],
      features: [
        { title: "HDI Boards", desc: "High-density interconnects for modern smartphones and IoT.", icon: Cpu },
        { title: "Metal Core", desc: "Superior heat dissipation for LED and power electronics.", icon: Zap },
        { title: "Flex-Rigid", desc: "Combining flexibility with structural integrity.", icon: BrainCircuit }
      ]
    },
    "overview": {
      tagline: "A Complete Overview of Our Capabilities",
      description: sectionSlug === 'pcb-assembly' 
        ? "Our PCBA overview highlights our turnkey assembly solutions. We handle component sourcing, SMT placement, DIP soldering, and final enclosure assembly, acting as your ultimate production partner."
        : "Our manufacturing overview details our step-by-step PCB fabrication process. From front-end CAM engineering to final electrical testing, we maintain strict ISO 9001 compliance powered by AI oversight.",
      heroImage: sectionSlug === 'pcb-assembly' 
        ? "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2000&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?q=80&w=2000&auto=format&fit=crop",
      stats: [
        { label: "ISO Certified", value: "9001:2015" },
        { label: "Quality Checks", value: "25+ Steps" },
        { label: "Delivery", value: "On-Time" }
      ],
      features: [
        { title: "End-to-End Control", desc: "We manage every single step of the production lifecycle.", icon: Settings },
        { title: "Data-Driven Analytics", desc: "Real-time production tracking available in your dashboard.", icon: LineChart },
        { title: "Quality Assured", desc: "Every product passes rigorous automated quality control.", icon: Award }
      ]
    }
  };

  // If a specific match exists, return it
  if (contentMap[pageSlug]) {
    return contentMap[pageSlug];
  }

  // Generic fallback generator based on the page title
  return {
    tagline: `Advanced Solutions for ${pageTitle}`,
    description: `At Wuping Feitian Electronic Technology, our ${pageTitle} services represent the pinnacle of modern manufacturing. By utilizing state-of-the-art equipment and AI-assisted workflows, we guarantee that every aspect of ${pageTitle.toLowerCase()} meets the highest global standards. Our engineering team is ready to support your most complex requirements.`,
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
    stats: [
      { label: "Precision", value: "Maximum" },
      { label: "Efficiency", value: "AI-Optimized" },
      { label: "Quality", value: "100% Tested" }
    ],
    features: [
      { title: `Optimized ${pageTitle}`, desc: "Engineered for maximum reliability and performance.", icon: Cpu },
      { title: "Smart Integration", desc: "Seamlessly integrated into our automated production pipeline.", icon: BrainCircuit },
      { title: "Global Compliance", desc: "Adhering to RoHS, REACH, and IPC standards.", icon: ShieldCheck }
    ]
  };
}
