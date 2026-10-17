export type Locale =
  | "en"
  | "zh"
  | "bn"
  | "de"
  | "ja"
  | "ko"
  | "hi"
  | "ur"
  | "fr"
  | "it"
  | "es"
  | "ru"
  | "pt"
  | "ar"
  | "tr"
  | "af";

export type CountryCode =
  | "US"
  | "GB"
  | "CA"
  | "AU"
  | "CN"
  | "BD"
  | "DE"
  | "JP"
  | "KR"
  | "IN"
  | "PK"
  | "FR"
  | "IT"
  | "ES"
  | "RU"
  | "BR"
  | "SA"
  | "AE"
  | "TR"
  | "ZA";

export type CountryOption = {
  countryCode: CountryCode;
  locale: Locale;
  label: string;
  nativeLabel: string;
  shortLabel: string;
};

export const countryGoogleLangMap: Record<CountryCode, string> = {
  CN: "zh-CN", // China -> Chinese
  US: "en",    // United States -> English
  GB: "en",    // United Kingdom -> English
  DE: "de",    // Germany -> German
  JP: "ja",    // Japan -> Japanese
  KR: "ko",    // South Korea -> Korean
  CA: "en",    // Canada -> English
  AU: "en",    // Australia -> English
  BD: "bn",    // Bangladesh -> Bangla
  IN: "hi",    // India -> Hindi
  PK: "ur",    // Pakistan -> Urdu
  FR: "fr",    // France -> French
  IT: "it",    // Italy -> Italian
  ES: "es",    // Spain -> Spanish
  RU: "ru",    // Russia -> Russian
  BR: "pt",    // Brazil -> Portuguese
  SA: "ar",    // Saudi Arabia -> Arabic
  AE: "ar",    // United Arab Emirates -> Arabic
  TR: "tr",    // Turkey -> Turkish
  ZA: "af",    // South Africa -> Afrikaans
};

export type NavItem = {
  title: string;
  items: string[];
};

export type Dictionary = {
  navbar: {
    companyName: string;
    logoAlt: string;
    badge: string;
    countries: string;
    selectCountry: string;
    navigation: string;
    explore: string;
    login: string;
    homePanelTitle: string;
    homePanelDescription: string;
    navItems: NavItem[];
    homeHighlights: {
      label: string;
      description: string;
    }[];
    theme: {
      toggle: string;
      light: string;
      dark: string;
      system: string;
    };
  };
  home: {
    title: string;
    description: string;
    selectedLanguage: string;
  };
  sections: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      quoteBtn: string;
      productsBtn: string;
      badges: string[];
    };
    about: {
      eyebrow: string;
      title: string;
      description: string;
      videoTitle: string;
    };
    products: {
      eyebrow: string;
      title: string;
      description: string;
      allLink: string;
      videoTitle: string;
      items: string[];
    };
    capability: {
      eyebrow: string;
      title: string;
      description: string;
      videoTitle: string;
      items: string[];
    };
    assembly: {
      eyebrow: string;
      title: string;
      description: string;
      videoTitle: string;
      items: string[];
    };
    quality: {
      eyebrow: string;
      title: string;
      description: string;
      videoTitle: string;
      steps: string[];
    };
    industries: {
      eyebrow: string;
      title: string;
      description: string;
      videoTitle: string;
      items: string[];
    };
    factory: {
      eyebrow: string;
      title: string;
      description: string;
      videoTitle: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      description: string;
      salesBtn: string;
      supportBtn: string;
      videoTitle: string;
    };
    network: {
      badge: string;
      title: string;
      description: string;
    };
    testimonials: {
      badge: string;
      title: string;
      description: string;
    };
  };
  footer: {
    description: string;
    aboutTitle: string;
    productsTitle: string;
    capabilitiesTitle: string;
    contactTitle: string;
    addressLabel: string;
    addressVal: string;
    phoneLabel: string;
    phoneVal: string;
    emailLabel: string;
    emailVal: string;
    copyright: string;
  };
  heroSlider: {
    badge: string;
    quoteTitle: string;
    tabPcb: string;
    tabPcba: string;
    boardType: string;
    layers: string;
    quantity: string;
    dimensions: string;
    material: string;
    surfaceFinish: string;
    instantPrice: string;
    calculateBtn: string;
    uploadGerber: string;
    badges: string[];
  };
  stats: {
    items: { value: string; label: string; desc: string }[];
  };
  advantages: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; desc: string }[];
  };
  processSteps: {
    eyebrow: string;
    title: string;
    description: string;
    items: { step: string; title: string; desc: string }[];
  };
  facility: {
    badge: string;
    title: string;
    description: string;
    liveVideo: string;
    zones: {
      title: string;
      subtitle: string;
      badge: string;
      tagline: string;
      specs: { label: string; val: string }[];
      highlights: string[];
    }[];
  };
  inquiryForm: {
    title: string;
    description: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    boardTypeLabel: string;
    requirementLabel: string;
    submitBtn: string;
    submitting: string;
  };
  productCategories?: {
    eyebrow: string;
    title: string;
    description: string;
    viewGrid: string;
    viewMatrix: string;
    categories: {
      all: string;
      rigid: string;
      flex: string;
      advanced: string;
      pcba: string;
    };
    labels: {
      turnaround: string;
      specs: string;
      bestFor: string;
      instantQuote: string;
      viewSpecs: string;
      matrixHeaderProduct: string;
      matrixHeaderArch: string;
      matrixHeaderTurn: string;
      matrixHeaderApps: string;
      matrixHeaderAction: string;
    };
    customTrack: {
      title: string;
      description: string;
      uploadBtn: string;
      supportPill: string;
    };
    items?: Record<string, {
      title: string;
      subtitle: string;
      description: string;
      turnaround: string;
      bestFor: string;
    }>;
  };
  networkGlobe?: {
    badge: string;
    title: string;
    description: string;
    telemetry: {
      coverageLabel: string;
      coverageValue: string;
      coverageSub: string;
      airTransitLabel: string;
      airTransitValue: string;
      airTransitSub: string;
      customsLabel: string;
      customsValue: string;
      customsSub: string;
    };
    corridorTitle: string;
    corridorSubtitle: string;
    panel: {
      title: string;
      originLabel: string;
      originValue: string;
      hubLabel: string;
      hubValue: string;
      carrierLabel: string;
      leadTimeLabel: string;
      customsLabel: string;
      customsValue: string;
      calculateBtn: string;
    };
    carrierTicker: {
      insured: string;
    };
    routes?: Record<string, {
      destCity: string;
      transitTime: string;
      carrier: string;
      notes: string;
    }>;
  };
  testimonialsHub?: {
    eyebrow: string;
    title: string;
    description: string;
    kpis: {
      reviewsValue: string;
      reviewsLabel: string;
      reviewsSub: string;
      deliveryValue: string;
      deliveryLabel: string;
      deliverySub: string;
      impedanceValue: string;
      impedanceLabel: string;
      impedanceSub: string;
      turnaroundValue: string;
      turnaroundLabel: string;
      turnaroundSub: string;
    };
    scrubberTitle: string;
    tabs: {
      stackup: string;
      inspection: string;
      logistics: string;
      oscilloscope: string;
    };
    warranty: {
      badge: string;
      title: string;
      description: string;
      ctaBtn: string;
      uploadBtn: string;
    };
  };
};

export const defaultLocale = "en" as const;

export const countryOptions: CountryOption[] = [
  {
    countryCode: "CN",
    locale: "zh",
    label: "China",
    nativeLabel: "中文 (Chinese)",
    shortLabel: "CN",
  },
  {
    countryCode: "US",
    locale: "en",
    label: "United States",
    nativeLabel: "English (US)",
    shortLabel: "US",
  },
  {
    countryCode: "GB",
    locale: "en",
    label: "United Kingdom",
    nativeLabel: "English (UK)",
    shortLabel: "UK",
  },
  {
    countryCode: "DE",
    locale: "de",
    label: "Germany",
    nativeLabel: "German (Deutsch)",
    shortLabel: "DE",
  },
  {
    countryCode: "JP",
    locale: "ja",
    label: "Japan",
    nativeLabel: "Japanese (日本語)",
    shortLabel: "JP",
  },
  {
    countryCode: "KR",
    locale: "ko",
    label: "South Korea",
    nativeLabel: "Korean (한국어)",
    shortLabel: "KR",
  },
  {
    countryCode: "CA",
    locale: "en",
    label: "Canada",
    nativeLabel: "English (CA)",
    shortLabel: "CA",
  },
  {
    countryCode: "AU",
    locale: "en",
    label: "Australia",
    nativeLabel: "English (AU)",
    shortLabel: "AU",
  },
  {
    countryCode: "BD",
    locale: "bn",
    label: "Bangladesh",
    nativeLabel: "Bangla (বাংলা)",
    shortLabel: "BD",
  },
  {
    countryCode: "IN",
    locale: "hi",
    label: "India",
    nativeLabel: "Hindi (हिन्दी)",
    shortLabel: "IN",
  },
  {
    countryCode: "PK",
    locale: "ur",
    label: "Pakistan",
    nativeLabel: "Urdu (اردو)",
    shortLabel: "PK",
  },
  {
    countryCode: "FR",
    locale: "fr",
    label: "France",
    nativeLabel: "French (Français)",
    shortLabel: "FR",
  },
  {
    countryCode: "IT",
    locale: "it",
    label: "Italy",
    nativeLabel: "Italian (Italiano)",
    shortLabel: "IT",
  },
  {
    countryCode: "ES",
    locale: "es",
    label: "Spain",
    nativeLabel: "Spanish (Español)",
    shortLabel: "ES",
  },
  {
    countryCode: "RU",
    locale: "ru",
    label: "Russia",
    nativeLabel: "Russian (Русский)",
    shortLabel: "RU",
  },
  {
    countryCode: "BR",
    locale: "pt",
    label: "Brazil",
    nativeLabel: "Portuguese (Português)",
    shortLabel: "BR",
  },
  {
    countryCode: "SA",
    locale: "ar",
    label: "Saudi Arabia",
    nativeLabel: "Arabic (العربية)",
    shortLabel: "SA",
  },
  {
    countryCode: "AE",
    locale: "ar",
    label: "United Arab Emirates",
    nativeLabel: "Arabic (العربية)",
    shortLabel: "AE",
  },
  {
    countryCode: "TR",
    locale: "tr",
    label: "Turkey",
    nativeLabel: "Turkish (Türkçe)",
    shortLabel: "TR",
  },
  {
    countryCode: "ZA",
    locale: "af",
    label: "South Africa",
    nativeLabel: "Afrikaans",
    shortLabel: "ZA",
  },
];

export const sourceDictionary: Dictionary = {
  navbar: {
    companyName: "Feitian PCB (Wuping Feitian Electronic Technology)",
    logoAlt: "Feitian PCB Logo",
    badge: "Direct Factory PCB & PCBA Partner",
    countries: "Global Region",
    selectCountry: "Select Country / Language",
    navigation: "Navigation",
    explore: "Explore",
    login: "Login",
    homePanelTitle: "Explore Feitian PCB at a Glance",
    homePanelDescription: "Direct manufacturing factory, cleanroom capabilities, and customer support.",
    navItems: [
      {
        title: "Home",
        items: ["Welcome", "News & Updates", "Careers"],
      },
      {
        title: "About FT PCB",
        items: [
          "Company Profile",
          "Our Team",
          "Our Advantage",
          "Service",
          "Why Choose Us",
          "Testimonials",
          "Industries",
          "Privacy Policy",
          "PCB Blogs",
        ],
      },
      {
        title: "Products",
        items: ["PCB Products", "PCBA Products"],
      },
      {
        title: "PCB Manufacture",
        items: [
          "Overview",
          "Equipments",
          "Material",
          "Impedance PCB",
          "Testing",
          "Prototype",
          "FAQ",
        ],
      },
      {
        title: "PCB Assembly",
        items: [
          "Overview",
          "Equipments",
          "Prototype Assembly",
          "Low Volume",
          "High Volume",
          "Fast Turn",
          "Turnkey",
          "Partial Turnkey",
          "FAQ",
        ],
      },
      {
        title: "Capability",
        items: [
          "Rigid PCB",
          "SMT",
          "Metal Core",
          "Flex PCB",
          "Testing",
          "Quality Control",
        ],
      },
      {
        title: "Value Add Service",
        items: [
          "Components Sourcing",
          "Cable Harness",
          "Coating",
          "Programming",
          "Stencil",
        ],
      },
      {
        title: "Contact",
        items: ["Sales Inquiry", "Support Team", "Office Address"],
      },
    ],
    homeHighlights: [
      {
        label: "Welcome",
        description: "Direct manufacturing from our 18,000 m² cleanroom factory.",
      },
      {
        label: "News & Updates",
        description: "Latest production line expansions and monthly capacity updates.",
      },
      {
        label: "Careers",
        description: "Join our electronics hardware engineering team in Fujian and Shenzhen.",
      },
    ],
    theme: {
      toggle: "Toggle Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
  home: {
    title: "Welcome to Feitian PCB",
    description: "Choose a country from the navbar to translate the entire website dynamically.",
    selectedLanguage: "Current Language",
  },
  sections: {
    hero: {
      eyebrow: "Precision PCB & Turnkey PCBA Direct Factory",
      title: "Reliable PCB Production & SMT Assembly for Modern Electronics.",
      description: "Feitian PCB supports bare circuit board fabrication, automated SMT/THT assembly, testing, and component sourcing for hardware engineering teams across 60+ countries.",
      quoteBtn: "Instant PCB Quote",
      productsBtn: "Explore Products",
      badges: ["Prototype to Volume", "100% E-Testing", "IPC Class 2/3"],
    },
    about: {
      eyebrow: "Engineering Advantage",
      title: "Direct Factory Control from Digital Gerber to Global Delivery",
      description: "Direct factory pricing with zero trading markups, ISO 9001:2015 quality control, and responsive CAM engineering feedback.",
      videoTitle: "Smart Factory Tour Video",
    },
    products: {
      eyebrow: "Product Families",
      title: "PCB & PCBA Product Categories",
      description: "Show users the main product families quickly, with visual examples for each board type and assembly service.",
      allLink: "All Products",
      videoTitle: "Product Showcase Video",
      items: [
        "Rigid Multi-Layer PCB",
        "Flexible Circuits (FPC)",
        "Rigid-Flex PCB",
        "Aluminum MCPCB",
        "High-Frequency Rogers PCB",
        "Any-Layer HDI Microvia",
      ],
    },
    capability: {
      eyebrow: "Capability",
      title: "Advanced PCB & SMT Manufacturing Capabilities",
      description: "1-32 layers, 0201 SMT passives, 0.4mm pitch BGA, controlled impedance ±5%, and heavy copper up to 6oz.",
      videoTitle: "Factory Capability Walkthrough",
      items: [
        "1-32 Layers Multilayer Rigid & HDI",
        "Controlled Impedance & Microstrip Matching",
        "Fast Prototype & High-Volume Production",
        "ENIG 2u\", Immersion Silver/Tin, HASL Finish",
        "100% AOI, Flying Probe & X-Ray Testing",
        "Free Engineering DFM Review Before Production",
      ],
    },
    assembly: {
      eyebrow: "Turnkey PCBA",
      title: "Full Turnkey PCB Assembly Services",
      description: "High-speed automated Yamaha SMT lines, through-hole wave soldering, genuine BOM parts procurement, and complete functional testing.",
      videoTitle: "Automated SMT Assembly Process",
      items: [
        "High-Speed SMT Pick & Place",
        "Through-Hole Selective Soldering",
        "100% Genuine Component Sourcing",
        "24h-48h Quick-Turn Assembly",
        "Box Build & Enclosure Integration",
        "Complete Functional Testing (FCT)",
      ],
    },
    quality: {
      eyebrow: "Quality Assurance",
      title: "Rigorous Zero-Defect Quality Control at Every Process",
      description: "Compliant with IPC-A-600 & IPC-A-610 Class 2/3 standards, ISO 9001:2015, UL 94V-0, and RoHS/REACH regulations.",
      videoTitle: "Quality Control Laboratory",
      steps: [
        "Incoming Raw Material Chemical Verification",
        "Laser Direct Imaging (LDI) Inner/Outer Layer Check",
        "Automated Optical Inspection (AOI)",
        "100% Electrical Flying Probe Netlist Testing",
        "X-Ray BGA Voiding & Solder Joint Verification",
        "Vacuum Moisture-Barrier Packaging with Desiccant",
      ],
    },
    industries: {
      eyebrow: "Industries Served",
      title: "Trusted by Mission-Critical Electronics Teams Globally",
      description: "Powering hardware in industrial control, automotive sensors, medical robotics, 5G wireless telematics, and aerospace avionics.",
      videoTitle: "Industry Applications Video",
      items: [
        "Industrial Automation & Robotics",
        "Automotive & EV Power Electronics",
        "Wireless & 5G Telecom Infrastructure",
        "Medical Wearables & Surgical Devices",
        "IoT Gateways & Smart Sensors",
        "Clean Energy & Power Inverters",
      ],
    },
    factory: {
      eyebrow: "Smart Cleanroom Facility",
      title: "Automated Cleanroom Manufacturing Plant",
      description: "Inspect our automated cleanroom production lines, high-speed SMT placement, automated optical inspection, and flying probe test labs.",
      videoTitle: "Factory Live Tour Video",
    },
    contact: {
      eyebrow: "Instant Quote",
      title: "Ready to Start Your PCB or PCBA Build?",
      description: "Upload your Gerber files for instant pricing and free DFM engineering review, or consult with our CAM engineers.",
      salesBtn: "Contact Sales Engineering",
      supportBtn: "24/7 Technical Support",
      videoTitle: "Customer Communication Video",
    },
    network: {
      badge: "Worldwide Air Express • Direct Connecting Flight Links",
      title: "Global Precision PCB & PCBA Supply Chain",
      description: "Direct 3D flight routes connecting our Wuping manufacturing campus to over 60 countries. Seamless DHL, FedEx, and UPS air express networks with real-time tracking.",
    },
    testimonials: {
      badge: "Verified Hardware Engineering Reviews",
      title: "What Global Hardware Teams Say",
      description: "Interactive production reviews, CAD stackup verification, and real test reports from engineers across 60+ countries.",
    },
  },
  footer: {
    description: "Feitian PCB (Wuping Feitian Electronic Technology Co., Ltd.) is a precision PCB and PCBA manufacturing partner for prototype, low-volume, and high-volume electronics production.",
    aboutTitle: "About Us",
    productsTitle: "Product Families",
    capabilitiesTitle: "Capabilities",
    contactTitle: "Contact Factory",
    addressLabel: "Factory Address",
    addressVal: "Yanqian Industrial Cluster, Wuping County, Longyan City, Fujian Province, China | Shenzhen Center: Fenghuang Zhi Gu, Baoan District, Shenzhen, China",
    phoneLabel: "Direct Phone",
    phoneVal: "+86 189 2742 6587",
    emailLabel: "Engineering Email",
    emailVal: "ft-osr@feitianpcb.com",
    copyright: "© 2026 Feitian PCB (Wuping Feitian Electronic Technology Co., Ltd.). All rights reserved.",
  },
  heroSlider: {
    badge: "1-32 Layers • Rigid FR4",
    quoteTitle: "Fast PCB & PCBA Instant Quote",
    tabPcb: "Standard PCB",
    tabPcba: "SMT Assembly",
    boardType: "Board Type",
    layers: "Layers",
    quantity: "Quantity",
    dimensions: "Dimensions",
    material: "Material",
    surfaceFinish: "Surface Finish",
    instantPrice: "Est. Price",
    calculateBtn: "Quote Now",
    uploadGerber: "Drop or browse your Gerber zip file",
    badges: ["100% E-Tested", "24H Turnaround", "Free DFM Review", "Direct Factory"],
  },
  stats: {
    items: [
      { value: "15+", label: "Years Manufacturing Experience", desc: "Trusted by 10,000+ engineers globally" },
      { value: "18,000 m²", label: "Automated Production Facility", desc: "Fujian & Shenzhen smart factories" },
      { value: "50,000 m²", label: "Monthly PCB Capacity", desc: "From fast prototype to volume runs" },
      { value: "60+", label: "Global Export Regions", desc: "Express delivery via DHL, FedEx, UPS" },
    ],
  },
  advantages: {
    eyebrow: "Factory Advantages",
    title: "Why Hardware Teams Choose Feitian PCB",
    description: "End-to-end manufacturing precision with transparent factory direct pricing.",
    items: [
      { title: "Guaranteed High Quality", desc: "100% E-test, flying probe testing, AOI visual inspection, and cross-section analysis." },
      { title: "24h Quick-Turn Delivery", desc: "Fast prototyping and responsive production scheduling built for urgent deadlines." },
      { title: "Factory Direct Pricing", desc: "Transparent quotation with zero hidden markups from our own manufacturing plants." },
      { title: "Cutting-Edge Technology", desc: "Any-layer HDI, blind/buried vias, heavy copper (up to 6oz), and controlled impedance." },
      { title: "Global Express Logistics", desc: "Worldwide insured door-to-door courier shipping via DHL, FedEx, and UPS." },
    ],
  },
  processSteps: {
    eyebrow: "Production Workflow",
    title: "7-Step Precision Manufacturing Process",
    description: "From Gerber design to dispatch, our automated line delivers consistent reliability.",
    items: [
      { step: "01", title: "Online Quote", desc: "Select board specs or upload Gerber files for instant pricing." },
      { step: "02", title: "DFM Review", desc: "Free engineering design rule check before fabrication begins." },
      { step: "03", title: "CAM & Tooling", desc: "High-precision photo tooling, drilling, and laser setup." },
      { step: "04", title: "Fabrication", desc: "Copper plating, etching, solder mask, silkscreen, and surface finish." },
      { step: "05", title: "Quality Control", desc: "100% flying probe testing, AOI inspection, and dimensional checks." },
      { step: "06", title: "Vacuum Packing", desc: "Moisture-barrier ESD packing with desiccant and protective carton." },
      { step: "07", title: "Express Delivery", desc: "Dispatched with real-time tracking via DHL, FedEx, or UPS." },
    ],
  },
  facility: {
    badge: "Smart Cleanroom Facility",
    title: "Automated Cleanroom Manufacturing Plant",
    description: "Inspect our automated cleanroom production lines, high-speed SMT placement, automated optical inspection, and flying probe test labs.",
    liveVideo: "Live Video Tour: Automated Production",
    zones: [
      {
        title: "High-Speed SMT Placement Cleanroom",
        subtitle: "Yamaha Pick & Place • 3D SPI • Reflow",
        badge: "Class 10,000 Cleanroom",
        tagline: "45,000 CPH high-speed surface-mount lines capable of 0201 passives and 0.4mm pitch BGA placement with 10-zone nitrogen reflow.",
        specs: [
          { label: "Placement Accuracy", val: "±0.025 mm" },
          { label: "Max Speed", val: "45,000 CPH" },
          { label: "Smallest Package", val: "0201 Passives" },
          { label: "BGA Pitch", val: "Min 0.35 mm" },
        ],
        highlights: [
          "10-Zone Nitrogen Reflow with Real-Time Thermal Profiling",
          "Automated Solder Paste Printing with 3D SPI Closed-Loop Control",
          "Real-time X-Ray Component Voiding & Solder Joint Verification",
          "ESD-Safe Grounded Cleanroom Flooring with Humidity Control",
        ],
      },
      {
        title: "LDI Laser Direct Imaging & Drilling",
        subtitle: "Direct Imaging • Laser Microvias • CNC Drills",
        badge: "Fine Pitch HDI",
        tagline: "Sub-mil registration accuracy with 250,000 RPM high-speed CNC spindle drilling and UV laser microvia ablation.",
        specs: [
          { label: "Imaging Resolution", val: "25 μm (1 mil)" },
          { label: "Spindle Speed", val: "250,000 RPM" },
          { label: "Min Microvia", val: "0.075 mm (3 mil)" },
          { label: "Impedance Control", val: "±5% Tolerance" },
        ],
        highlights: [
          "Laser Direct Imaging eliminating phototool expansion errors",
          "High-speed air bearing drilling spindles for clean hole walls",
          "Controlled depth milling for rigid-flex cavity construction",
          "Automated optical alignment registering inner layers to ±15μm",
        ],
      },
      {
        title: "Continuous Chemical Plating Line",
        subtitle: "VCP Copper • Pulse Plating • ENIG Immersion",
        badge: "High Aspect Ratio",
        tagline: "Vertical Continuous Plating (VCP) lines delivering uniform hole-wall copper thickness even at high 10:1 board aspect ratios.",
        specs: [
          { label: "Hole Copper", val: "≥20-25 μm" },
          { label: "Max Aspect Ratio", val: "10:1 Depth" },
          { label: "ENIG Gold", val: "1-3 μin Gold" },
          { label: "Chemical Control", val: "Online Auto-Dosing" },
        ],
        highlights: [
          "Uniform micro-throwing power for blind via copper filling",
          "Electroless Nickel Immersion Gold (ENIG) with zero black pad risk",
          "Automated chemical analysis with closed-loop dosing pumps",
          "Zero-discharge industrial wastewater treatment compliant",
        ],
      },
      {
        title: "100% AOI & Flying Probe Testing Lab",
        subtitle: "Netlist E-Test • 3D AOI • Cross-Section Lab",
        badge: "Zero Defect Policy",
        tagline: "Every bare board is electrically tested against the original CAD netlist before SMT assembly or vacuum sealing.",
        specs: [
          { label: "Test Voltage", val: "50-300 V" },
          { label: "Isolation Test", val: "100 MΩ" },
          { label: "TDR Bandwidth", val: "20 GHz" },
          { label: "Microsection", val: "1000x Optical" },
        ],
        highlights: [
          "High-density flying probe netlist electrical testing (100%)",
          "High-speed 3D AOI checking solder bridges, tombstoning, and polarity",
          "Time Domain Reflectometry (TDR) controlled impedance verification",
          "Metallurgical cross-section micro-etching quality reports",
        ],
      },
    ],
  },
  inquiryForm: {
    title: "Ready to Start Your PCB or PCBA Build?",
    description: "Upload your Gerber files for instant pricing and free DFM engineering review, or consult with our CAM engineers.",
    nameLabel: "Your Name",
    emailLabel: "Work Email",
    phoneLabel: "Phone Number",
    boardTypeLabel: "PCB Type",
    requirementLabel: "Project Requirement",
    submitBtn: "Send Inquiry & Request DFM Review",
    submitting: "Sending Inquiry...",
  },
  productCategories: {
    eyebrow: "PCB & PCBA Product Families",
    title: "Core Electronics Manufacturing Catalog",
    description: "Show users the main product families quickly, with visual examples for each board type and assembly service.",
    viewGrid: "Card Grid",
    viewMatrix: "Spec Matrix",
    categories: {
      all: "All Products",
      rigid: "Rigid & Multilayer PCB",
      flex: "Flex & Rigid-Flex PCB",
      advanced: "Advanced & RF Substrates",
      pcba: "Turnkey PCBA & Assembly",
    },
    labels: {
      turnaround: "Turnaround",
      specs: "Specifications",
      bestFor: "Best For",
      instantQuote: "Instant Quote",
      viewSpecs: "View Specs",
      matrixHeaderProduct: "Product Family",
      matrixHeaderArch: "Key Architecture",
      matrixHeaderTurn: "Turnaround",
      matrixHeaderApps: "Typical Applications",
      matrixHeaderAction: "Action",
    },
    customTrack: {
      title: "Need a custom stackup or non-standard laminate?",
      description: "Upload your CAD / Gerber archive or speak directly with our senior CAM engineering desk in Fujian.",
      uploadBtn: "Upload Gerber File",
      supportPill: "Live DFM Support",
    },
    items: {
      "rigid-multilayer": {
        title: "Standard & High-TG Rigid PCB",
        subtitle: "High-Density FR-4 Multilayer Fabrication",
        description: "High-precision 1 to 32 layer rigid circuit boards built with Shengyi/KB high-TG170 laminates, controlled differential impedance, and laser microvias.",
        turnaround: "⚡ 24h Quick Turn",
        bestFor: "Industrial controllers, computing gateways, IoT & consumer electronics",
      },
      "hdi-microvia": {
        title: "Any-Layer HDI Microvia PCB",
        subtitle: "Laser-Drilled Via-in-Pad Interconnects",
        description: "Fine-line laser microvias, stacked/staggered via-in-pad (VIPPO), and high-density interconnect routing for ultra-miniaturized electronics.",
        turnaround: "⚡ 4-5 Days Dispatch",
        bestFor: "Smartphones, portable medical monitors, drone avionics, FPGA boards",
      },
      "heavy-copper": {
        title: "Heavy Copper High-Power PCB",
        subtitle: "Thermal Power Dissipation & Busbars",
        description: "High-current circuit boards with up to 6oz (210µm) inner and outer copper weights designed for extreme current loads and rapid thermal transfer.",
        turnaround: "⚡ 3-4 Days Turn",
        bestFor: "EV motor inverters, power supply busbars, solar charge controllers",
      },
      "flexible-fpc": {
        title: "Flexible Polyimide FPC",
        subtitle: "Ultra-Thin Dynamic Bending Circuits",
        description: "Single, double, and multilayer flexible circuits using DuPont Kapton polyimide films with adhesiveless copper foils for repeated flexing.",
        turnaround: "⚡ 3-5 Days Turn",
        bestFor: "Wearables, camera modules, automotive headlights, folding devices",
      },
      "rigid-flex": {
        title: "Rigid-Flex Hybrid Solutions",
        subtitle: "Integrated 3D Interconnect Assemblies",
        description: "Hybrid boards combining rigid FR-4 zones with polyimide dynamic flex layers, eliminating ribbon cables, connectors, and weight.",
        turnaround: "⚡ 5-7 Days Dispatch",
        bestFor: "Aerospace avionics, robotic joints, medical endoscopes, defense tech",
      },
      "rogers-rf": {
        title: "High-Frequency & RF Microwave",
        subtitle: "Low-Loss Rogers / Taconic / Teflon",
        description: "Engineered microwave RF substrates with tightly controlled dielectric constants (Dk 2.2-10.2) and ultra-low loss dissipation factor.",
        turnaround: "⚡ 3-5 Days Turn",
        bestFor: "5G base stations, radar sensors, phased-array antennas, satellite comms",
      },
      "aluminum-mcpcb": {
        title: "Metal Core Aluminum PCB",
        subtitle: "High Thermal Conductivity Substrates",
        description: "Thermally optimized metal-backed circuit boards featuring 1-3 W/m-K dielectric layers for rapid heat extraction away from active components.",
        turnaround: "⚡ 48h Rapid Turn",
        bestFor: "High-power LED luminaires, automotive headlights, power regulators",
      },
      "turnkey-pcba": {
        title: "Turnkey SMT & Box-Build Assembly",
        subtitle: "High-Speed SMT + 100% Genuine BOM Sourcing",
        description: "Complete electronics manufacturing services: 45,000 CPH surface-mount placement down to 0201 passives, BGA X-ray, ICT, and firmware flashing.",
        turnaround: "⚡ 24-48h SMT Turn",
        bestFor: "Complete end-to-end prototypes, pilot production runs, OEM mass builds",
      },
    },
  },
  networkGlobe: {
    badge: "Worldwide Air Express • Direct Connecting Flight Links",
    title: "Global Precision PCB & PCBA Supply Chain",
    description: "Direct 3D flight routes connecting our Wuping manufacturing campus to over 60 countries. Seamless DHL, FedEx, and UPS air express networks with real-time tracking.",
    telemetry: {
      coverageLabel: "Coverage",
      coverageValue: "60+",
      coverageSub: "Countries",
      airTransitLabel: "Air Transit",
      airTransitValue: "2-3 D",
      airTransitSub: "DHL/FedEx Air",
      customsLabel: "Customs",
      customsValue: "99.8%",
      customsSub: "Direct Clearance",
    },
    corridorTitle: "Select Flight Corridor",
    corridorSubtitle: "Click any country corridor to focus the 3D globe and inspect lead times:",
    panel: {
      title: "Air Corridor Telemetry",
      originLabel: "Origin Campus",
      originValue: "Yanqian Industrial Hub, Wuping",
      hubLabel: "Flight Hub",
      hubValue: "Xiamen (XMN) & Shenzhen (SZX)",
      carrierLabel: "Carrier Network",
      leadTimeLabel: "Estimated Delivery",
      customsLabel: "Duty & Customs",
      customsValue: "Direct Airport Customs Dispatch",
      calculateBtn: "Calculate Route Shipping",
    },
    carrierTicker: {
      insured: "100% Insured Air Transit",
    },
  },
  testimonialsHub: {
    eyebrow: "Global Hardware Teams Say",
    title: "Verified Engineering Reviews & DFM Traceability",
    description: "Real prototype reviews, CAM reports, stackup analyses, and electrical test certificates from verified hardware engineering teams worldwide.",
    kpis: {
      reviewsValue: "4,850+",
      reviewsLabel: "Verified Reviews",
      reviewsSub: "Global Hardware Teams",
      deliveryValue: "99.4%",
      deliveryLabel: "On-Time Air Delivery",
      deliverySub: "DHL / FedEx Priority",
      impedanceValue: "±3%",
      impedanceLabel: "Impedance Yield",
      impedanceSub: "TDR Tested Accuracy",
      turnaroundValue: "2.4h",
      turnaroundLabel: "Rapid CAM Turnaround",
      turnaroundSub: "Average DFM Response",
    },
    scrubberTitle: "Active Hardware Channels",
    tabs: {
      stackup: "Physical Layer Stackup",
      inspection: "Automated QA & E-Test Report",
      logistics: "Logistics & Traceability",
      oscilloscope: "Signal Integrity Analyzer",
    },
    warranty: {
      badge: "IPC-A-600 / IPC-A-610 Class 2 & 3 Workmanship Warranty",
      title: "Manufacturing Reliability Guaranteed",
      description: "All bare boards undergo 100% flying-probe electrical test, optical inspection (AOI), and cross-sectional micro-section analysis before vacuum packaging.",
      ctaBtn: "Start Your PCB Project",
      uploadBtn: "Upload Gerber For Free DFM",
    },
  },
};

import {
  localeOverrides,
  localizedNavItems,
  type PartialDictionary,
  type PartialDictionaryObject,
} from "./locales/index";

export type { PartialDictionary, PartialDictionaryObject };
export { localizedNavItems, localeOverrides };

function mergeDictionary<T extends Record<string, unknown>>(base: T, override?: PartialDictionaryObject<T>): T {
  if (!override) {
    return structuredClone(base);
  }

  const output = structuredClone(base) as Record<string, unknown>;

  Object.entries(override).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    const currentValue = output[key];
    const shouldMergeObject =
      value &&
      currentValue &&
      typeof value === "object" &&
      typeof currentValue === "object" &&
      !Array.isArray(value) &&
      !Array.isArray(currentValue);

    output[key] = shouldMergeObject
      ? mergeDictionary(currentValue as Record<string, unknown>, value as PartialDictionaryObject<Record<string, unknown>>)
      : value;
  });

  return output as T;
}

export function getDictionary(locale: Locale): Dictionary {
  if (locale === "en") {
    return sourceDictionary;
  }
  const override = localeOverrides[locale];
  if (!override) {
    return sourceDictionary;
  }
  return mergeDictionary(
    sourceDictionary as unknown as Record<string, unknown>,
    override as unknown as PartialDictionaryObject<Record<string, unknown>>
  ) as Dictionary;
}
