export interface HowItWorksSection {
  titlePrefix: string;
  highlightWord: string;
  titleSuffix: string;
  paragraphs: string[];
  bulletPoints?: string[];
  badge?: string;
  videoDuration: string;
}

export interface HowItWorksDictionary {
  pageTitle: string;
  pageSubtitle: string;
  quickActions: {
    quotePcb: string;
    quotePcba: string;
    uploadGerber: string;
    orderNow: string;
  };
  floatingAssist: {
    greeting: string;
    chatBtn: string;
    status: string;
    placeholder: string;
  };
  easierOrdering: HowItWorksSection & {
    interactiveTitle: string;
    interactiveDesc: string;
    layers: string[];
    sampleBoardName: string;
    samplePrice: string;
    sampleTurnaround: string;
    togglePrompt: string;
  };
  customerService: HowItWorksSection & {
    chartTitle: string;
    chartAvgLabel: string;
    chartAvgValue: string;
    legend1: string;
    legend2: string;
    legend3: string;
    chartFootnote: string;
    interactiveTitle: string;
    drcBtn: string;
    drcRunning: string;
    drcComplete: string;
    engineersOnline: string;
    drcRules: { name: string; result: string; pass: boolean }[];
  };
  shortenTurnaround: HowItWorksSection & {
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    interactiveTitle: string;
    lines: { id: string; name: string; machine: string; metric: string; status: string }[];
  };
  fasterDelivery: HowItWorksSection & {
    badgeDelivery: string;
    statShipping: string;
    couriers: string[];
    interactiveTitle: string;
    selectCountryLabel: string;
    transitLabel: string;
    courierLabel: string;
    customsLabel: string;
    flightRouteLabel: string;
    countries: {
      name: string;
      transit: string;
      courier: string;
      customs: string;
      flightRoute: string;
    }[];
    packagingTitle: string;
    packagingLayers: string[];
  };
  costTransparency: {
    badge: string;
    title: string;
    desc: string;
    factoryLabel: string;
    brokerLabel: string;
    savingsNote: string;
    items: { name: string; factory: string; broker: string }[];
  };
  contactBar: {
    chatTitle: string;
    chatDesc: string;
    chatTime: string;
    emailTitle: string;
    emailDesc: string;
    emailTime: string;
    helpTitle: string;
    helpDesc: string;
    helpTime: string;
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  ctaBanner: {
    badge: string;
    title: string;
    desc: string;
    dropzoneTitle: string;
    dropzoneSub: string;
    dropzoneFormats: string[];
    sampleTestPrompt: string;
    quotePcbBtn: string;
    quotePcbaBtn: string;
    talkCamBtn: string;
    guarantees: { title: string; desc: string }[];
  };
}

export const HOW_IT_WORKS_TRANSLATIONS: Record<string, HowItWorksDictionary> = {
  en: {
    pageTitle: "How FT PCB Works",
    pageSubtitle: "Transparent, Automated & Direct Factory PCB & PCBA Manufacturing",
    quickActions: {
      quotePcb: "Instant PCB Quote",
      quotePcba: "Instant PCBA Quote",
      uploadGerber: "Upload Gerber Files",
      orderNow: "Order Now",
    },
    floatingAssist: {
      greeting: "👋 Welcome to FT PCB! May I assist with your Gerber DFM review?",
      chatBtn: "Chat with CAM",
      status: "Live CAM Engineer Online",
      placeholder: "Ask technical question...",
    },
    easierOrdering: {
      titlePrefix: "Realize ",
      highlightWord: "Easier",
      titleSuffix: " Ordering",
      paragraphs: [
        "Ordering PCBs at FT PCB is extremely easy for you to get a quote online instantly, and our self-service platform takes you a few minutes to upload files and order boards.",
        "We are fully transparent in our operations; you can know everything about your orders in real-time since every step can be tracked and informed on FT PCB.",
      ],
      bulletPoints: [
        "Instant Gerber RS-274X and ODB++ dimensional recognition in seconds",
        "Transparent real-time factory pricing with zero middleman markup",
        "Full support for 1-piece quick prototypes up to mass volume production",
      ],
      badge: "Self-Service Ordering",
      videoDuration: "0:00 / 0:43",
      interactiveTitle: "Interactive Gerber Layer Inspector & Live Spec Parser",
      interactiveDesc: "Toggle individual PCB layers below to inspect how our automated engine parses your design.",
      layers: ["Top Silk", "Solder Mask", "Top Copper (L1)", "Inner GND (L2)", "Inner PWR (L3)", "Bottom Copper (L4)"],
      sampleBoardName: "Project: STM32-Dual-CAN-Gateway.zip",
      samplePrice: "$18.50 / 5 pcs",
      sampleTurnaround: "24h Rapid Turnaround",
      togglePrompt: "Click layers to toggle rendering view",
    },
    customerService: {
      titlePrefix: "Make Customer Service ",
      highlightWord: "Efficient",
      titleSuffix: "",
      paragraphs: [
        "Our customer support and engineering teams are at your disposal 24 hours a day from Monday to Saturday via telephone, livechat, or e-mail. Every CAM technician is rigorously trained and skilled. You can always get effective help and support from them.",
        "About 10% of the data packs we receive contain elements or features that need clarification. A prolonged engineering questions process will negatively impact delivery and total cost. Our technicians work systematically to clarify uncertainties in your specification. This way of working is more efficient, helping to complete the engineering questions process faster reducing the time to production.",
      ],
      bulletPoints: [
        "2-Hour rapid CAM engineering clarification window",
        "Free Design for Manufacturability (DFM) check on 120+ design rules",
        "Direct engineer-to-engineer communication without sales rep delay",
      ],
      badge: "24h Dedicated CAM Support",
      videoDuration: "0:00 / 0:32",
      chartTitle: "FT PCB Response Time",
      chartAvgLabel: "Avg response time",
      chartAvgValue: "< 2h 30m",
      legend1: "0-3 hours  78%",
      legend2: "3-6 hours  16%",
      legend3: "6-12 hours  6%",
      chartFootnote: "*Audited over the last 12 months",
      interactiveTitle: "Live CAM Pre-Flight DRC Simulation",
      drcBtn: "Run Automated 120+ DRC Pre-Flight Check",
      drcRunning: "Simulating Genesis2000 & SI9000 DRC Check...",
      drcComplete: "Pre-Flight DRC Verification Complete: 5/5 PASSED",
      engineersOnline: "18 Senior CAM Specialists Online Now",
      drcRules: [
        { name: "Min Trace Width & Spacing", result: "2.4 mil (Limit: 2.0 mil)", pass: true },
        { name: "PTH Annular Ring Clearance", result: "4.1 mil (Limit: 3.5 mil)", pass: true },
        { name: "Solder Mask Dam Retention", result: "4.2 mil (Limit: 4.0 mil)", pass: true },
        { name: "BGA Microvia Aspect Ratio", result: "0.20 mm (Aspect 8:1)", pass: true },
        { name: "Polar SI9000 Differential Impedance", result: "90Ω ±3.8% (Target: 90Ω ±5%)", pass: true },
      ],
    },
    shortenTurnaround: {
      titlePrefix: "",
      highlightWord: "Shorten",
      titleSuffix: " Turnaround Time",
      paragraphs: [
        "We can make PCB prototype as short as 24 hours, because of the smart technologies and fully automatic equipments applied in our production lines.",
        "Our intelligent platform automatically collects and analyzes data gathered by sensors and monitoring devices on equipments and helps us to take corrective action to increase efficiency. Secondarily, we utilize the available capacity of our factories network so that system can match your orders to one of our factories which is best suited, in the shortest turnaround time.",
      ],
      bulletPoints: [
        "24-48h expedited turnaround for 2-to-16 layer multi-layer boards",
        "Automated Laser Direct Imaging (LDI) and air-bearing CNC drilling at 200,000 RPM",
        "Continuous Vertical Plating (VCP) lines ensuring uniform hole-wall copper ≥20-25µm",
      ],
      badge: "15,000m² Smart Factory",
      videoDuration: "0:00 / 1:22",
      stat1Label: "Fastest Prototype Delivery",
      stat1Value: "24 Hours",
      stat2Label: "Monthly Production Output",
      stat2Value: "100,000 m²",
      interactiveTitle: "Live Smart Factory Machine Line Telemetry (Wuping Campus)",
      lines: [
        {
          id: "ldi",
          name: "Line 1: Orbotech Laser Direct Imaging (LDI)",
          machine: "Class 10,000 Cleanroom • Automated Robotic Feeder",
          metric: "Resolution: 2 / 2 mil (0.05mm)",
          status: "Running • Batch #FT-9841",
        },
        {
          id: "cnc",
          name: "Line 2: Posalux Multi-Spindle High-Speed CNC Drilling",
          machine: "200,000 RPM Air Bearing • Laser Broken-Bit Detection",
          metric: "Aspect Ratio: Up to 12 : 1",
          status: "Running • 0.20mm Microvias",
        },
        {
          id: "vcp",
          name: "Line 3: Insoluble Titanium Anode VCP Plating Line",
          machine: "Vertical Continuous Plating • Pulse Reverse Rectifier",
          metric: "Hole Copper: ≥ 22 - 25 µm",
          status: "Running • Bath Temp: 24.2°C",
        },
      ],
    },
    fasterDelivery: {
      titlePrefix: "Make Delivery ",
      highlightWord: "Faster",
      titleSuffix: "",
      paragraphs: [
        "Have your PCBs delivered directly from our factories to your door. FT PCB's factory is 2 hours away from international airport. FT PCB has built strategic partnerships with top logistics companies like DHL, FedEx, and UPS, parcels from FT PCB have the priority to arrange flights first. Most of packages can be shipped the same day.",
        "Moreover, in order to serve international customers' customs problems and provide them cheaper shipping, FT PCB provides full DDP/DDU clearance support, commercial invoices, and global door-to-door express tracking.",
      ],
      bulletPoints: [
        "Priority air cargo booking with DHL Express, FedEx, and UPS Worldwide",
        "Industrial moisture-barrier ESD vacuum sealing with humidity indicator cards",
        "2 to 4 business days direct door-to-door transit to North America, Europe & Asia",
      ],
      badge: "Express Priority Logistics",
      videoDuration: "0:00 / 0:30",
      badgeDelivery: "Worldwide Door-to-Door",
      statShipping: "10,000+ packages shipped each day",
      couriers: ["DHL Express", "FedEx Priority", "UPS Worldwide", "SF Air"],
      interactiveTitle: "Interactive Global Express Transit Calculator",
      selectCountryLabel: "Select Destination Country:",
      transitLabel: "Estimated Transit:",
      courierLabel: "Preferred Courier:",
      customsLabel: "Customs Protocol:",
      flightRouteLabel: "Express Air Route:",
      countries: [
        {
          name: "United States",
          transit: "2 - 3 Business Days",
          courier: "DHL Express / FedEx Priority",
          customs: "Duty-Free under $800 de minimis",
          flightRoute: "Xiamen (XMN) → Anchorage (ANC) → Memphis (MEM) → New York (JFK)",
        },
        {
          name: "Germany",
          transit: "2 - 4 Business Days",
          courier: "DHL Express Direct Flight",
          customs: "DDP / IOSS Customs Cleared",
          flightRoute: "Shenzhen (SZX) → Dubai (DXB) → Frankfurt (FRA)",
        },
        {
          name: "Japan",
          transit: "1 - 2 Business Days",
          courier: "SF Air / DHL Express",
          customs: "Tokyo/Osaka Direct Port Entry",
          flightRoute: "Guangzhou (CAN) → Tokyo Narita (NRT) Direct Flight",
        },
        {
          name: "United Kingdom",
          transit: "2 - 4 Business Days",
          courier: "UPS Worldwide / FedEx Priority",
          customs: "DDP Cleared with VAT Invoice",
          flightRoute: "Hong Kong (HKG) → London Heathrow (LHR) Priority Express",
        },
        {
          name: "France",
          transit: "2 - 4 Business Days",
          courier: "DHL Express / Chronopost",
          customs: "Full EU Commercial Customs Clearance",
          flightRoute: "Shenzhen (SZX) → Paris Charles de Gaulle (CDG)",
        },
        {
          name: "Australia",
          transit: "3 - 4 Business Days",
          courier: "DHL Express Worldwide",
          customs: "Direct Sydney/Melbourne Air Port",
          flightRoute: "Guangzhou (CAN) → Sydney Kingsford Smith (SYD)",
        },
        {
          name: "Canada",
          transit: "2 - 3 Business Days",
          courier: "FedEx International Priority",
          customs: "Commercial Clearance Door-to-Door",
          flightRoute: "Hong Kong (HKG) → Vancouver (YVR) → Toronto (YYZ)",
        },
      ],
      packagingTitle: "Industrial 5-Layer ESD Protection Standard:",
      packagingLayers: [
        "Heavy-duty anti-static ESD moisture-barrier foil bag",
        "Activated silica gel desiccant pack (MIL-D-3464E standard)",
        "Cobalt-free Humidity Indicator Card (HIC 10%-60%)",
        "Yunshang Feitian Cloud MES laser 2D barcode traveler",
        "Reinforced 5-ply shock-absorbing corrugated export carton",
      ],
    },
    costTransparency: {
      badge: "100% FACTORY DIRECT COST TRANSPARENCY",
      title: "Where Does Every Dollar Go?",
      desc: "Compare our pure factory production cost breakdown with traditional brokers who add 30-40% markup without owning any machinery.",
      factoryLabel: "FT PCB Direct Factory Wholesale",
      brokerLabel: "Traditional PCB Broker (Marked Up)",
      savingsNote: "You save ~28% by eliminating intermediary broker commissions",
      items: [
        { name: "Raw Laminate (Shengyi TG170 / KB FR4)", factory: "$8.20", broker: "$11.50" },
        { name: "Laser LDI & CNC Multi-Spindle Drilling", factory: "$4.50", broker: "$6.20" },
        { name: "Vertical Continuous Plating (≥20µm Cu)", factory: "$3.10", broker: "$4.80" },
        { name: "100% 4-Wire Kelvin Netlist Electrical Testing", factory: "$0.00 (Included)", broker: "$3.00 (Extra Surcharge)" },
        { name: "ESD Moisture-Barrier Vacuum Packaging", factory: "$1.20", broker: "$2.00" },
        { name: "Intermediary Trading Broker Commission", factory: "$0.00 (Zero)", broker: "$8.50 (Broker Margin)" },
      ],
    },
    contactBar: {
      chatTitle: "Online Chat",
      chatDesc: "Chat with our live CAM agent for fast reply.",
      chatTime: "Mon-Sat 24 Hours (GMT+8)",
      emailTitle: "Email Us",
      emailDesc: "Contact us at sales@ftpcb.com",
      emailTime: "Typically reply within 2 hours",
      helpTitle: "Help Center",
      helpDesc: "Get instant DFM answers & guide.",
      helpTime: "24/7 Available",
    },
    faq: {
      title: "Frequently Asked Questions about FT PCB Operations",
      items: [
        {
          q: "How fast can I get a quotation after uploading my Gerber files?",
          a: "For standard rigid PCBs (1 to 8 layers), our online instant calculator provides an accurate quote within seconds. For complex stackups (10 to 30L) or turnkey PCBA assemblies, our CAM team reviews your files and issues a formal quote within 1 to 2 hours.",
        },
        {
          q: "Can FT PCB help fix minor design rule check (DRC) issues in my files?",
          a: "Yes. Our 45+ in-house CAM specialists frequently resolve minor issues like solder mask slivers, silkscreen on pads, and non-functional pads on inner layers free of charge. For trace width adjustments, we provide detailed DFM screenshots and request your sign-off before manufacturing.",
        },
        {
          q: "Can you sign a Non-Disclosure Agreement (NDA) before I upload files?",
          a: "Absolutely. We routinely execute mutual, legally binding NDAs with automotive Tier-1s, defense aerospace contractors, and hardware technology startups before receiving any engineering datasets. Your files are stored on isolated, encrypted internal servers.",
        },
        {
          q: "What is your standard production turnaround time for prototypes?",
          a: "We offer expedited 24-hour manufacturing for 2-layer rapid prototypes and 48-hour turnarounds for 4-to-10 layer boards. Standard volume production typically takes 5 to 7 business days depending on surface finish and layer complexity.",
        },
      ],
    },
    ctaBanner: {
      badge: "READY TO BUILD YOUR CIRCUIT BOARDS?",
      title: "From Gerber Upload to Factory Floor in 2 Hours",
      desc: "Get an instant quote in seconds, upload your Gerber or ODB++ files, and enjoy 2-hour CAM review, 100% 4-wire Kelvin testing, and express air cargo dispatch directly from our smart manufacturing plant.",
      dropzoneTitle: "Drop Gerber Archive (.ZIP / .RAR) Here",
      dropzoneSub: "Instant automated clearance & stackup pre-flight parsing (Max 50MB)",
      dropzoneFormats: ["RS-274X", "ODB++", "IPC-2581", "NC Drill"],
      sampleTestPrompt: "Or simulate with test file:",
      quotePcbBtn: "Instant PCB Quote & Calculator",
      quotePcbaBtn: "Turnkey PCBA Assembly Quote",
      talkCamBtn: "Live CAM DFM Consultation",
      guarantees: [
        {
          title: "100% Factory Direct",
          desc: "Pure wholesale manufacturing from our 15,000m² Wuping campus with zero middleman broker markups.",
        },
        {
          title: "2-Hour CAM Verification",
          desc: "45+ dedicated CAM specialists audit every trace, hole, and clearance to prevent fabrication defects.",
        },
        {
          title: "100% Free Kelvin E-Test",
          desc: "Full 4-wire netlist electrical continuity & flying probe testing included at $0 surcharge.",
        },
        {
          title: "Mutual NDA Protection",
          desc: "Legally binding non-disclosure agreements with encrypted file handling on isolated servers.",
        },
      ],
    },
  },
  zh: {
    pageTitle: "FT PCB 运作流程",
    pageSubtitle: "全数字化透明、高精密实体源头大厂制造体验",
    quickActions: {
      quotePcb: "PCB 极速在线计价",
      quotePcba: "PCBA 贴片代工询价",
      uploadGerber: "立即上传 Gerber 文件",
      orderNow: "立即下单",
    },
    floatingAssist: {
      greeting: "👋 您好！欢迎访问 FT PCB，需要为您预审 Gerber 资料吗？",
      chatBtn: "对接在线工程技师",
      status: "在编 CAM 工程师在线",
      placeholder: "输入您的工程问题...",
    },
    easierOrdering: {
      titlePrefix: "实现 ",
      highlightWord: "极简便捷",
      titleSuffix: " 的在线下单体验",
      paragraphs: [
        "在 FT PCB 订购电路板极为简单快捷。您可以通过我们的在线自助服务平台即时获取精准出厂报价，仅需数分钟即可完成工程文件上传与订单提交。",
        "我们坚持全流程生产透明化，自主研发的数字化系统让您实时掌握订单在车间的每一步流转状态，工序节点全程扫码可查、安心无忧。",
      ],
      bulletPoints: [
        "秒级智能解析 Gerber RS-274X 与 ODB++ 外形尺寸及层数",
        "透明纯正出厂底价，彻底剔除中介贸易佣金加价",
        "全面支持从 5 片极速工程打样到百万片大规模量产",
      ],
      badge: "极速自助下单",
      videoDuration: "0:00 / 0:43",
      interactiveTitle: "交互式 Gerber 分层透视与参数自动解析器",
      interactiveDesc: "点击下方线路板各功能层，直观查看算法如何解析您的设计图纸：",
      layers: ["顶层丝印", "顶层阻焊", "顶层线路 (L1)", "内部接地 (L2)", "内部电源 (L3)", "底层线路 (L4)"],
      sampleBoardName: "样例项目：STM32-Dual-CAN-Gateway.zip",
      samplePrice: "￥85.00 / 5 片",
      sampleTurnaround: "24 小时加急出厂",
      togglePrompt: "点击上方图层按钮切换渲染视窗",
    },
    customerService: {
      titlePrefix: "提供 ",
      highlightWord: "高效专业",
      titleSuffix: " 的工程与客户服务",
      paragraphs: [
        "我们的专业技术客服与 CAM 工程师团队周一至周六提供 24 小时全天候技术支持，支持电话、在线客服及电子邮件多种直连沟通渠道。每位工程客服均受过严格的印制电路板工艺培训，确保随时为您提供精准实用的技术解答。",
        "在接收到的工程数据包中，约有 10% 存在需要与客户进一步澄清的工艺疑点（EQ）。冗长低效的工程确认过程会严重延误交期并增加总成本。我们的资深 CAM 技师团队工作严密规范，系统化地快速厘清工艺公差，帮助在 2 小时内完成工程确认，大幅缩短投产等待周期。",
      ],
      bulletPoints: [
        "2 小时内极速出具详尽工程审查（DFM）与优化建议报告",
        "免费提供开短路隐患修正与高频阻抗测试条建模",
        "资深 CAM 工程师与客户点对点直连对接，避免销售传话误差",
      ],
      badge: "24h 专属 CAM 工程支持",
      videoDuration: "0:00 / 0:32",
      chartTitle: "FT PCB 工程响应时效",
      chartAvgLabel: "平均工程响应时间",
      chartAvgValue: "< 2小时",
      legend1: "0-3 小时  78%",
      legend2: "3-6 小时  16%",
      legend3: "6-12 小时  6%",
      chartFootnote: "*最近12个月实测统计数据",
      interactiveTitle: "在线 CAM 产前 DRC 仿真检测引擎",
      drcBtn: "运行 120+ 项自动化 DRC 产前检测",
      drcRunning: "正在模拟 Genesis2000 & SI9000 规则扫描...",
      drcComplete: "产前工程 DRC 检测通过：5/5 项严苛标准已合格",
      engineersOnline: "18 位资深 CAM 工程师当前在线值守",
      drcRules: [
        { name: "最小线宽与线间距", result: "2.4 mil (极限标准: 2.0 mil)", pass: true },
        { name: "PTH 孔铜焊环安全余量", result: "4.1 mil (工艺极限: 3.5 mil)", pass: true },
        { name: "绿油阻焊桥留存宽度", result: "4.2 mil (工艺极限: 4.0 mil)", pass: true },
        { name: "BGA 盲埋孔深径比", result: "0.20 mm (深径比 8:1)", pass: true },
        { name: "Polar SI9000 差分阻抗公差", result: "90Ω ±3.8% (目标: 90Ω ±5%)", pass: true },
      ],
    },
    shortenTurnaround: {
      titlePrefix: "大幅 ",
      highlightWord: "缩短",
      titleSuffix: " 制造交货周期",
      paragraphs: [
        "得益于现代化智能工厂引入的全自动化生产设备与数字控制算法，我们能够为客户提供最快 24 小时交付的加急样板制造服务。",
        "我们的智能制造平台实时采集分析产线各工位传感器与监控设备的数据，帮助动态优化设备排产与良率把控。同时，充分调配武平高新区 15,000m² 现代化制造基地内 3 栋厂房的综合产能，智能匹配最优机组，以最短的生产周期交付高品质产品。",
      ],
      bulletPoints: [
        "2-16 层高多层板最快 24-48 小时极速出厂",
        "采用万级洁净室 LDI 激光直写与 200,000 转高速数控钻孔",
        "垂直连续电镀（VCP）线配不溶性钛阳极，保障孔壁铜厚 ≥20-25µm",
      ],
      badge: "15,000m² 智能化大厂",
      videoDuration: "0:00 / 1:22",
      stat1Label: "样品极速出厂时效",
      stat1Value: "24 小时",
      stat2Label: "月度综合制造产能",
      stat2Value: "100,000 m²",
      interactiveTitle: "武平实体工厂各核心产线实时运行工况",
      lines: [
        {
          id: "ldi",
          name: "1号线：以色列奥宝 LDI 激光直接成像产线",
          machine: "万级恒温洁净车间 • 机械臂全自动上下料",
          metric: "精细线宽: 2 / 2 mil (0.05mm)",
          status: "运行中 • 批次 #FT-9841",
        },
        {
          id: "cnc",
          name: "2号线：Posalux 高速空气轴承精密数控钻孔机",
          machine: "200,000 转主轴 • 激光断刀与孔径在线检测",
          metric: "深径比: 最高达 12 : 1",
          status: "运行中 • 0.20mm 微孔",
        },
        {
          id: "vcp",
          name: "3号线：不溶性阳极垂直连续电镀 (VCP) 专线",
          machine: "垂直连续电镀 • 脉冲反向整流技术",
          metric: "孔铜厚度: ≥ 22 - 25 µm",
          status: "运行中 • 药水槽温: 24.2°C",
        },
      ],
    },
    fasterDelivery: {
      titlePrefix: "打造 ",
      highlightWord: "极速准时",
      titleSuffix: " 的门到门物流网络",
      paragraphs: [
        "成品电路板直接从我们实体工厂装箱直发，送达您的办公桌。FT PCB 生产基地毗邻国际航空物流枢纽，并与顺丰特快、DHL、FedEx、UPS 等国际快递巨头建立了长期战略级合作，享有特约航班舱位优先配载权，大多数急件均可实现当天完工、当天起运。",
        "此外，为了解决全球客户的清关申报与关税问题，FT PCB 物流团队提供完备的 DDP/DDU 清关服务、正规商业发票及门到门全程实时物流追踪。",
      ],
      bulletPoints: [
        "顺丰航空与 DHL、FedEx 专机直飞，保障紧急研发进度",
        "工业级无尘防静电铝箔真空包装，内置防潮干燥剂与湿度指示卡",
        "国内次日达，欧美亚主要国家 2 至 4 个工作日送达",
      ],
      badge: "特快专线直达",
      videoDuration: "0:00 / 0:30",
      badgeDelivery: "全球门到门极速派送",
      statShipping: "每日稳定发货 10,000+ 工业包裹",
      couriers: ["顺丰特快", "DHL Express", "FedEx Priority", "UPS Worldwide"],
      interactiveTitle: "全球航空特快专线时效与清关模拟器",
      selectCountryLabel: "选择收件目的国家 / 地区：",
      transitLabel: "预计派送时效：",
      courierLabel: "推荐承运特快：",
      customsLabel: "关税清关通道：",
      flightRouteLabel: "专线空运航线：",
      countries: [
        {
          name: "中国 (国内全境)",
          transit: "顺丰次日达 (部分地区隔日)",
          courier: "顺丰航空特快专线",
          customs: "增值税正规专用发票",
          flightRoute: "龙岩武平基地 → 顺丰厦门航空枢纽 → 全国重点城市机场",
        },
        {
          name: "美国 (United States)",
          transit: "2 - 3 个工作日",
          courier: "DHL Express / FedEx 优先",
          customs: "800 美元以下免征额绿色清关",
          flightRoute: "厦门 (XMN) → 安克雷奇 (ANC) → 孟菲斯 (MEM) → 纽约 (JFK)",
        },
        {
          name: "德国 (Germany)",
          transit: "2 - 4 个工作日",
          courier: "DHL 专机直飞法兰克福",
          customs: "DDP / IOSS 完税快捷清关",
          flightRoute: "深圳 (SZX) → 迪拜 (DXB) → 法兰克福 (FRA) 每日直航",
        },
        {
          name: "日本 (Japan)",
          transit: "1 - 2 个工作日",
          courier: "顺丰国际航空 / DHL",
          customs: "成田/关西机场当天快速放行",
          flightRoute: "广州 (CAN) → 东京成田 (NRT) 专机直飞",
        },
        {
          name: "英国 (United Kingdom)",
          transit: "2 - 4 个工作日",
          courier: "UPS Worldwide / FedEx",
          customs: "DDP 完税带正式商业发票",
          flightRoute: "香港 (HKG) → 伦敦希思罗 (LHR) 国际特快",
        },
        {
          name: "法国 (France)",
          transit: "2 - 4 个工作日",
          courier: "DHL Express / Chronopost",
          customs: "欧盟正规进出口报关清关",
          flightRoute: "深圳 (SZX) → 巴黎戴高乐 (CDG) 航空专线",
        },
        {
          name: "澳大利亚 (Australia)",
          transit: "3 - 4 个工作日",
          courier: "DHL Express 专线",
          customs: "悉尼/墨尔本快速通关",
          flightRoute: "广州 (CAN) → 悉尼机场 (SYD) 直达",
        },
      ],
      packagingTitle: "实体工厂 5 重工业级防静电防潮封装标准：",
      packagingLayers: [
        "加厚铝箔防静电 ESD 防潮屏蔽真空袋",
        "MIL-D-3464E 军工级活性硅胶干燥剂",
        "无钴环保型湿度指示卡 (HIC 10%-60%)",
        "“云上飞天”MES 激光打标二维码追溯流程卡",
        "加厚五层高强耐压抗震瓦楞纸外装箱",
      ],
    },
    costTransparency: {
      badge: "100% 实体大厂出厂底价穿透公示",
      title: "您的每一分采购预算花在哪里？",
      desc: "拒绝贸易中间商层层转包抽成。对比 FT PCB 纯正大厂成本与中介公司的加价结构：",
      factoryLabel: "FT PCB 实体工厂出厂底价",
      brokerLabel: "普通贸易中介公司 (含高额抽成)",
      savingsNote: "剔除中间商佣金，直接为您的硬件研发项目节省约 28% 采购资金",
      items: [
        { name: "原厂覆铜板材料 (生益 TG170 / 建滔)", factory: "￥42.00", broker: "￥58.00" },
        { name: "激光 LDI 曝光与数控精密钻铣", factory: "￥22.50", broker: "￥31.00" },
        { name: "垂直连续 VCP 电镀孔铜 (≥20µm)", factory: "￥15.50", broker: "￥24.00" },
        { name: "100% 4线开尔文低阻电气测试", factory: "￥0.00 (免费标配)", broker: "￥15.00 (额外加收)" },
        { name: "防潮防静电铝箔真空工业包装", factory: "￥5.00", broker: "￥10.00" },
        { name: "贸易中介加成利润与销售提成", factory: "￥0.00 (源头直销)", broker: "￥45.00 (中介暴利)" },
      ],
    },
    contactBar: {
      chatTitle: "在线技术咨询",
      chatDesc: "与在编 CAM 工程师即时在线沟通",
      chatTime: "周一至周六 24小时 (北京时间)",
      emailTitle: "官方电子邮箱",
      emailDesc: "直发 sales@ftpcb.com",
      emailTime: "通常在 2 小时内正式回复",
      helpTitle: "帮助与技术中心",
      helpDesc: "查阅 DFM 规范与投产指南",
      helpTime: "7×24小时全天候在线",
    },
    faq: {
      title: "关于 FT PCB 运作流程的常见疑问",
      items: [
        {
          q: "上传 Gerber 文件后，需要多久才能拿到正式报价？",
          a: "对于常规的 1 至 8 层刚性电路板，我们的在线计价器可在 10 秒内即时给出精准出厂底价。对于特殊高多层（10 至 30 层）、高频板或整机 PCBA 组装订单，我们的 CAM 团队将在 1 至 2 小时内完成工程核算并出具正式明细报价单。",
        },
        {
          q: "如果我的设计文件中存在轻微 DRC 错误，工厂能协助修正吗？",
          a: "完全可以。我们的 45+ 名资深 CAM 团队会免费协助优化常见问题（如阻焊碎屑、无用焊盘、字符压焊盘等）。如涉及走线连接或线宽变更，工程师会第一时间出具带高亮截图的 DFM 报告，并在获得您的正式书面确认后再行投产。",
        },
        {
          q: "在发送图纸前，FT PCB 能否与我们签署正式保密协议 (NDA)？",
          a: "完全可以。我们日常与汽车 Tier-1、防务科研院所及科技创新团队签署具备法律效力的双向保密协议（NDA）。客户所有 Gerber、CAD 图纸与 BOM 清单均受物理隔离的内部加密服务器保护，未经授权绝不对外透露。",
        },
        {
          q: "加急研发样板最快多久能交货？",
          a: "我们针对双面板提供 24 小时加急打样服务，4 至 10 层多层样板最快 48 小时极速出厂。常规中小批量订单交期一般为 5 至 7 个工作日，具体视板层结构与表面处理工艺而定。",
        },
      ],
    },
    ctaBanner: {
      badge: "准备好制造您的印制电路板了吗？",
      title: "从图纸上传到进入车间产线，仅需 2 小时",
      desc: "数秒即可在线完成智能算价。上传您的 Gerber 或 ODB++ 生产文件，尊享 2 小时加急 CAM 产前预审、100% 四线开尔文飞针全测与国际特快空运专线，由武平 15,000m² 智能化大厂直发到门。",
      dropzoneTitle: "拖拽 Gerber 压缩包 (.ZIP / .RAR) 至此",
      dropzoneSub: "秒级自动化线宽孔径与层叠结构预检（最大 50MB）",
      dropzoneFormats: ["RS-274X", "ODB++", "IPC-2581", "NC 钻孔"],
      sampleTestPrompt: "或点击加载测试样例：",
      quotePcbBtn: "PCB 极速在线计价与下单",
      quotePcbaBtn: "PCBA 元器件代购与贴片询价",
      talkCamBtn: "在线对接资深 CAM 工程师",
      guarantees: [
        {
          title: "100% 实体源头工厂底价",
          desc: "武平高新区 15,000m² 自有实体制造基地直发，彻底剔除中介贸易商层层加价。",
        },
        {
          title: "2 小时 CAM 极速预审保障",
          desc: "45+ 名资深工艺技师严格排查隐患，杜绝生产缺陷与延期风险。",
        },
        {
          title: "100% 免费四线飞针开短路全测",
          desc: "每块出厂板卡均经过 100% 网表飞针电测试，绝无额外附加收费。",
        },
        {
          title: "严格双向保密协议 (NDA)",
          desc: "与全球客户日常签署具备法律效力的 NDA，内部物理隔离服务器严密守护知识产权。",
        },
      ],
    },
  },
};

export function getHowItWorksTranslation(locale: string): HowItWorksDictionary {
  if (HOW_IT_WORKS_TRANSLATIONS[locale]) {
    return HOW_IT_WORKS_TRANSLATIONS[locale];
  }

  const base = HOW_IT_WORKS_TRANSLATIONS.en;
  const localized: HowItWorksDictionary = JSON.parse(JSON.stringify(base));

  if (locale === "de") {
    localized.pageTitle = "Wie FT PCB Funktioniert";
    localized.pageSubtitle = "Transparente, automatisierte & direkte PCB- und PCBA-Fertigung ab Werk";
    localized.easierOrdering.titlePrefix = "";
    localized.easierOrdering.highlightWord = "Einfachere";
    localized.easierOrdering.titleSuffix = " Bestellung realisieren";
    localized.customerService.titlePrefix = "Kundenservice ";
    localized.customerService.highlightWord = "effizient";
    localized.customerService.titleSuffix = " gestalten";
    localized.shortenTurnaround.titlePrefix = "Lieferzeit ";
    localized.shortenTurnaround.highlightWord = "verkürzen";
    localized.shortenTurnaround.titleSuffix = "";
    localized.fasterDelivery.titlePrefix = "Lieferung ";
    localized.fasterDelivery.highlightWord = "schneller";
    localized.fasterDelivery.titleSuffix = " machen";
  } else if (locale === "fr") {
    localized.pageTitle = "Comment Fonctionne FT PCB";
    localized.pageSubtitle = "Fabrication de PCB & PCBA transparente, automatisée et directe d'usine";
  } else if (locale === "ja") {
    localized.pageTitle = "FT PCB の製造プロセス";
    localized.pageSubtitle = "完全透明・自動化された工場直接 PCB/PCBA 製造サービス";
  } else if (locale === "es") {
    localized.pageTitle = "Cómo Funciona FT PCB";
    localized.pageSubtitle = "Fabricación de PCB y PCBA transparente, automatizada y directa de fábrica";
  } else if (locale === "ru") {
    localized.pageTitle = "Как работает FT PCB";
    localized.pageSubtitle = "Прозрачное, автоматизированное и прямое производство печатных плат";
  } else if (locale === "ko") {
    localized.pageTitle = "FT PCB 이용 프로세스";
    localized.pageSubtitle = "투명하고 자동화된 공장 직영 PCB 및 PCBA 제조";
  } else if (locale === "it") {
    localized.pageTitle = "Come Funziona FT PCB";
    localized.pageSubtitle = "Produzione di PCB e PCBA trasparente, automatizzata e diretta di fabbrica";
  } else if (locale === "pt") {
    localized.pageTitle = "Como Funciona a FT PCB";
    localized.pageSubtitle = "Fabricação de PCB e PCBA transparente, automatizada e direta da fábrica";
  } else if (locale === "ar") {
    localized.pageTitle = "كيف تعمل FT PCB";
    localized.pageSubtitle = "تصنيع شفاف ومؤتمت ومباشر من المصنع للوحات الدوائر الإلكترونية";
  } else if (locale === "tr") {
    localized.pageTitle = "FT PCB Nasıl Çalışır";
    localized.pageSubtitle = "Şeffaf, Otomatik ve Doğrudan Fabrikadan PCB & PCBA Üretimi";
  } else if (locale === "bn") {
    localized.pageTitle = "FT PCB কীভাবে কাজ করে";
    localized.pageSubtitle = "স্বচ্ছ, স্বয়ংক্রিয় এবং সরাসরি ফ্যাক্টরি PCB ও PCBA উৎপাদন";
  } else if (locale === "hi") {
    localized.pageTitle = "FT PCB कैसे काम करता है";
    localized.pageSubtitle = "पारदर्शी, स्वचालित और सीधे कारखाने से PCB एवं PCBA निर्माण";
  } else if (locale === "ur") {
    localized.pageTitle = "ایف ٹی پی سی بی کیسے کام کرتا ہے";
    localized.pageSubtitle = "شفاف، خودکار اور براہ راست فیکٹری پی سی بی مینوفیکچرنگ";
  } else if (locale === "af") {
    localized.pageTitle = "Hoe FT PCB Werk";
    localized.pageSubtitle = "Deursigtige, outomatiese en direkte fabriek PCB & PCBA vervaardiging";
  }

  return localized;
}
