export interface PartnershipDictionary {
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    applyBtn: string;
    exploreBtn: string;
    stats: { value: string; label: string; sub: string }[];
  };
  bsyPartnership: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    learnMoreText: string;
    websiteUrl: string;
    websiteDisplay: string;
    benefitsTitle: string;
    benefitsDescription: string;
    highlights: {
      title: string;
      desc: string;
      tag: string;
    }[];
    phases: {
      phase: string;
      title: string;
      traditional: string;
      unified: string;
      impact: string;
    }[];
  };
  tracksTitle: string;
  tracksSubtitle: string;
  tracks: {
    id: string;
    title: string;
    category: string;
    badge: string;
    description: string;
    perks: string[];
    idealFor: string;
    actionLabel: string;
  }[];
  whyPartner: {
    badge: string;
    title: string;
    description: string;
    cards: { title: string; desc: string; stat: string }[];
  };
  form: {
    badge: string;
    title: string;
    description: string;
    labelCompany: string;
    labelName: string;
    labelEmail: string;
    labelPhone: string;
    labelTrack: string;
    labelVolume: string;
    labelMessage: string;
    placeholderCompany: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderPhone: string;
    placeholderVolume: string;
    placeholderMessage: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successDesc: string;
  };
  faq: {
    badge: string;
    title: string;
    description: string;
    items: { q: string; a: string }[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    btnApply: string;
    btnContact: string;
  };
}

export const PARTNERSHIP_TRANSLATIONS: Record<string, PartnershipDictionary> = {
  en: {
    hero: {
      badge: "STRATEGIC PARTNERSHIP • ACCELERATING HARDWARE GLOBALLY",
      title: "Partner with FT PCB:",
      highlight: "Scaling High-Reliability Electronics Together",
      description:
        "Join forces with a National Specialized 'Little Giant' PCB manufacturer. From regional distributors and university engineering faculties to EMS contract manufacturers and hardware incubators, we provide direct factory pricing, dedicated CAM engineering, and priority production cells.",
      applyBtn: "Apply for Partnership",
      exploreBtn: "Explore Programs",
      stats: [
        { value: "15,000 m²", label: "Production Campus", sub: "3 Facilities in Wuping High-Tech Zone" },
        { value: "100k m²", label: "Monthly Output", sub: "Multi-layer & specialty microwave PCBs" },
        { value: "30M RMB", label: "Registered Capital", sub: "National Little Giant enterprise" },
        { value: "24h Priority", label: "Dedicated CAM Cells", sub: "Fast-track engineering support" },
      ],
    },
    bsyPartnership: {
      badge: "CO-ENGINEERED HARDWARE ECOSYSTEM",
      title: "Strategic Partnership: FT PCB & BSY Tech",
      subtitle: "Closing the Gap Between Hardware Design and Factory Production",
      description:
        "FT PCB Company and BSY Tech Company have joined forces to deliver an end-to-end hardware development ecosystem. By uniting BSY Tech’s advanced engineering design solutions with FT PCB’s precision fabrication lines, we eliminate standard hand-off friction—taking your electronic designs from layout to verified hardware faster and with zero design compromises.",
      learnMoreText: "Learn more about BSY Tech’s engineering solutions at www.bsytech.com.",
      websiteUrl: "https://www.bsytech.com",
      websiteDisplay: "www.bsytech.com",
      benefitsTitle: "Why This Partnership Benefits Your Hardware Projects",
      benefitsDescription:
        "Traditional hardware procurement separates the design team from the fabrication floor, leading to repeated revision loops, unexpected fabrication delays, and yield issues. Our unified model resolves this at every phase",
      highlights: [
        {
          title: "Unified Engineering Handshake",
          desc: "BSY Tech's schematics and high-speed multi-layer layouts integrate directly into FT PCB's CAM Genesis2000 kernels, eliminating manual conversion errors.",
          tag: "Zero EQs",
        },
        {
          title: "Real-Time Laminate Matching",
          desc: "Controlled impedance stackups designed directly against FT PCB's physical warehouse inventory of Shengyi S1000-2 & Rogers high-Tg materials.",
          tag: "Polar SI9000",
        },
        {
          title: "24h Priority Prototyping",
          desc: "Fast-track pilot lines pre-allocated to receive verified BSY Tech Gerber packages without engineering hold delays.",
          tag: "24h Fast Track",
        },
        {
          title: "End-to-End Accountability",
          desc: "Single-source engineering accountability across schematic architecture, bare board fabrication, turnkey SMT assembly, and firmware bring-up.",
          tag: "100% Tested",
        },
      ],
      phases: [
        {
          phase: "Phase 01: Schematic & Stackup",
          title: "Stackup & Component Verification",
          traditional: "Hypothetical stackup chosen by layout designer without factory material stock knowledge, causing redesigns.",
          unified: "Live warehouse laminate profiles and Polar SI9000 impedance calculations embedded from day one.",
          impact: "Zero Stackup Redesigns",
        },
        {
          phase: "Phase 02: DFM & CAM Clearance",
          title: "Automated Pre-Flight DFM Review",
          traditional: "Layout exported in isolation; factory CAM review discovers 15+ trace clearance and annular ring issues.",
          unified: "FT PCB factory manufacturing rules directly embedded into BSY Tech layout design rule checks.",
          impact: "Instant Pre-Flight Sign-Off",
        },
        {
          phase: "Phase 03: Fabrication & Assembly",
          title: "Rapid Turnkey Manufacturing",
          traditional: "Fabrication halted due to component footprint mismatch, non-standard via aspect ratios, or solder mask slivers.",
          unified: "Co-engineered footprint libraries and solder mask dams matched to factory LDI and Yamaha SMT lines.",
          impact: "24-48h Expedited Turnaround",
        },
        {
          phase: "Phase 04: Testing & Bring-Up",
          title: "Integrated Quality & Yield",
          traditional: "Blame-shifting between design house and factory when signal integrity issues or manufacturing defects arise.",
          unified: "100% 4-wire Kelvin netlist electrical testing, AOI inspection, and functional hardware validation.",
          impact: "99.8% First-Pass Yield",
        },
      ],
    },
    tracksTitle: "Four Specialized Partnership Tracks",
    tracksSubtitle: "Select the track tailored to your organization's mission and hardware operational needs.",
    tracks: [
      {
        id: "distributor",
        title: "Global Distributors & Sales Representatives",
        category: "Commercial Track",
        badge: "Wholesale Margin",
        description:
          "Expand your component or PCB sales portfolio by representing FT PCB in your regional market. Gain access to factory-direct wholesale discounts, priority CAM review queues, white-label shipping, and collaborative local co-marketing funds.",
        perks: [
          "Aggressive wholesale volume discounts (up to 30% below broker rates)",
          "Dedicated CAM engineering team assigned to your customer accounts",
          "Blind drop-shipping with your custom packaging and brand logos",
          "Comprehensive marketing collateral, sample boards, and technical datasheets",
        ],
        idealFor: "Regional electronic component distributors, PCB sales agents, and procurement firms.",
        actionLabel: "Join Representative Network",
      },
      {
        id: "academic",
        title: "University Labs & Student Robotics Sponsorship",
        category: "Academic & Research",
        badge: "Sponsored Grants",
        description:
          "In continuing our heritage with Shenzhen University, FT PCB actively sponsors university engineering laboratories, IEEE student branches, Formula Student racing teams, and international aerospace robotics competitions.",
        perks: [
          "Sponsored and subsidized rapid PCB prototyping for student competition teams",
          "Academic discounts on complex multilayer (up to 30L) and PTFE microwave substrates",
          "Free Design for Manufacturability (DFM) seminars and webinars by senior CAM specialists",
          "Access to joint polymer chemistry research data and high-frequency dielectric testing",
        ],
        idealFor: "University engineering departments, student robotics clubs, Formula Student, and research labs.",
        actionLabel: "Apply for Academic Sponsorship",
      },
      {
        id: "ems",
        title: "EMS & Contract Manufacturing Alliance",
        category: "Industrial Subcontracting",
        badge: "Dedicated Capacity",
        description:
          "Electronic Manufacturing Services (EMS) and PCBA contract assemblers rely on FT PCB as their verified, high-yield bare board supply partner. We provide dedicated manufacturing cells, rapid NPI prototypes, and seamless volume ramp under IATF 16949.",
        perks: [
          "Pre-allocated monthly capacity reservations up to 20,000 m²",
          "IATF 16949:2016 automotive grade and IPC Class 3 zero-defect compliance",
          "Consolidated panelization to optimize SMT feeder setup and pick-and-place throughput",
          "Direct EDI / API order integration for automated production dispatch",
        ],
        idealFor: "EMS providers, PCBA contract manufacturers, and high-reliability industrial OEMs.",
        actionLabel: "Establish Manufacturing Alliance",
      },
      {
        id: "incubator",
        title: "Hardware Startups & Technology Incubators",
        category: "Venture Acceleration",
        badge: "NPI Pilot Support",
        description:
          "Transform hardware prototypes into market-ready commercial products. We mentor early-stage hardware startups through DFM optimization, component kitting alternatives, thermal dissipation modeling, and pilot production runs.",
        perks: [
          "Free 1-on-1 DFM design audits with senior CAM engineers to lower BOM manufacturing costs",
          "Low minimum order quantities (MOQ 5 pcs) with rapid 24-48h prototype dispatch",
          "Component sourcing assistance to prevent single-source supply chain bottlenecks",
          "Credit terms and milestone-based flexible payment schedules for seed-stage startups",
        ],
        idealFor: "Hardware incubators, accelerator cohorts, seed-stage IoT startups, and makerspaces.",
        actionLabel: "Accelerate Your Hardware Startup",
      },
    ],
    whyPartner: {
      badge: "WHY PARTNER WITH FT PCB",
      title: "Built on 28 Years of Hardcore Manufacturing",
      description: "We are an authentic, audited brick-and-mortar manufacturer, not a digital middleman or broker.",
      cards: [
        {
          title: "Direct Physical Manufacturing Base",
          desc: "15,000 m² across 3 standardized buildings in Fujian Wuping High-Tech Zone with 100,000 m²/month combined capacity.",
          stat: "15,000 m²",
        },
        {
          title: "45+ In-House CAM Engineering Division",
          desc: "Average engineering experience exceeding 10 years, ensuring quick 2-hour turnaround on complex DRC and SI9000 impedance calculations.",
          stat: "< 2 Hours",
        },
        {
          title: "Automotive IATF 16949 Certified",
          desc: "Audited automotive zero-defect quality management system with 100% 4-wire Kelvin netlist electrical testing.",
          stat: "IATF 16949",
        },
        {
          title: "Proprietary 'Yunshang Feitian' Cloud MES",
          desc: "Every panel is engraved with a laser 2D barcode, enabling real-time station-by-station traceability from raw laminate to final parcel dispatch.",
          stat: "100% Barcoded",
        },
      ],
    },
    form: {
      badge: "START A CONVERSATION",
      title: "Apply for the FT PCB Partner Program",
      description: "Fill in the details below. Our Global Partnerships Director will reach out within 24 business hours.",
      labelCompany: "Organization / Company / University",
      labelName: "Full Name & Title",
      labelEmail: "Business / Academic Email",
      labelPhone: "Phone / WhatsApp / WeChat",
      labelTrack: "Partnership Program Track",
      labelVolume: "Estimated Annual PCB Volume (m² or Units)",
      labelMessage: "Partnership Proposal / Specific Needs",
      placeholderCompany: "e.g. Apex Hardware Technologies or Technical University Lab",
      placeholderName: "e.g. Sarah Jenkins (Head of Hardware)",
      placeholderEmail: "sarah@company.com",
      placeholderPhone: "+1 (555) 019-2834",
      placeholderVolume: "e.g. 500 m²/year or 50 prototype runs/year",
      placeholderMessage: "Tell us about your project, current PCB challenges, and how we can collaborate...",
      submitBtn: "Submit Partnership Application",
      submittingBtn: "Submitting Application...",
      successTitle: "Partnership Application Received!",
      successDesc: "Thank you for reaching out. Our Global Partnerships Director has received your application and will contact you within 24 hours.",
    },
    faq: {
      badge: "PARTNERSHIP FAQ",
      title: "Frequently Asked Questions",
      description: "Common questions regarding terms, confidentiality, and operational support.",
      items: [
        {
          q: "Can FT PCB sign a bilateral Non-Disclosure Agreement (NDA)?",
          a: "Yes, absolutely. We execute mutual, legally binding NDAs with corporate partners, universities, and defense innovators prior to reviewing any technical files or proprietary CAD data. Your intellectual property is protected by strict corporate security protocols.",
        },
        {
          q: "What are the criteria for qualifying as an authorized regional distributor?",
          a: "We seek sales partners with proven customer networks in electronics hardware, industrial controls, automotive, or telecommunications. We evaluate annual volume commitments, regional coverage, and technical customer support capabilities.",
        },
        {
          q: "How does the student robotics / Formula Student sponsorship program work?",
          a: "Student teams submit an application detailing their vehicle or robot architecture, competition schedule, and required PCB stackups. We provide heavily subsidized or 100% sponsored fabrication, free DFM analysis, and fast express shipping.",
        },
        {
          q: "Can you provide blind drop-shipping for our reseller customers?",
          a: "Yes. For our distributor and EMS partners, we offer complete neutral packaging (white-label) or custom-branded packing slips and box labels with zero mention of FT PCB, ensuring seamless representation for your clients.",
        },
      ],
    },
    cta: {
      badge: "COLLABORATE WITH A NATIONAL LITTLE GIANT",
      title: "Let's Build the Future of Hardware Together",
      description: "Connect directly with our leadership team in Wuping to discuss customized wholesale pricing, dedicated line reservations, and long-term supply agreements.",
      btnApply: "Submit Partner Application",
      btnContact: "Contact Partner Manager Directly",
    },
  },
  zh: {
    hero: {
      badge: "战略合作 • 赋能全球硬件创新生态",
      title: "携手 FT PCB：",
      highlight: "共建高可靠性实体大厂供应链生态圈",
      description:
        "与国家级专精特新“小巨人”电路板实体工厂携手合作。从海外区域品牌代理商、知名高校科研院所，到大型 EMS 代工厂与硬件孵化器，我们提供出厂底价直供、专属资深 CAM 研发团队及优先保产机组。",
      applyBtn: "立即申请商务合作",
      exploreBtn: "浏览四大合作板块",
      stats: [
        { value: "15,000 m²", label: "直营实体制造基地", sub: "福建武平高新区 3 栋标准厂房" },
        { value: "100,000 m²", label: "月度综合制造产能", sub: "高多层工业板与高频微波板" },
        { value: "3000万 RMB", label: "实收法定注册资本", sub: "国家专精特新“小巨人”企业" },
        { value: "24h 优先", label: "专属绿色 CAM 通道", sub: "资深工程师点对点保产支持" },
      ],
    },
    bsyPartnership: {
      badge: "协同工程硬件生态闭环",
      title: "Strategic Partnership: FT PCB & BSY Tech",
      subtitle: "Closing the Gap Between Hardware Design and Factory Production",
      description:
        "FT PCB Company and BSY Tech Company have joined forces to deliver an end-to-end hardware development ecosystem. By uniting BSY Tech’s advanced engineering design solutions with FT PCB’s precision fabrication lines, we eliminate standard hand-off friction—taking your electronic designs from layout to verified hardware faster and with zero design compromises.",
      learnMoreText: "Learn more about BSY Tech’s engineering solutions at www.bsytech.com.",
      websiteUrl: "https://www.bsytech.com",
      websiteDisplay: "www.bsytech.com",
      benefitsTitle: "Why This Partnership Benefits Your Hardware Projects",
      benefitsDescription:
        "Traditional hardware procurement separates the design team from the fabrication floor, leading to repeated revision loops, unexpected fabrication delays, and yield issues. Our unified model resolves this at every phase",
      highlights: [
        {
          title: "无缝工程协同协议",
          desc: "BSY Tech 原生设计文件与 FT PCB Genesis2000 CAM 核心直接打通，杜绝二次转译误差。",
          tag: "零工程提问",
        },
        {
          title: "板材阻抗实时对齐",
          desc: "基于 FT PCB 实体仓储生益 S1000-2 及罗杰斯板材库直接完成 SI9000 叠层阻抗匹配。",
          tag: "Polar SI9000",
        },
        {
          title: "24小时加急样品保产",
          desc: "专属加急快板产线直连，消除传统外协中转审核延迟，实现极速打样与批量投产。",
          tag: "24h 绿色通道",
        },
        {
          title: "端到端全链路权责保障",
          desc: "涵盖原理图架构、PCB 布局、裸板制造、SMT 贴片及固件调测的单一窗口全责交付。",
          tag: "100% 严苛质检",
        },
      ],
      phases: [
        {
          phase: "第一阶段：方案架构与叠层",
          title: "物料与制造能力前置验证",
          traditional: "设计端自行设定假设性叠层，量产时因工厂缺料或不兼容被迫重绘。",
          unified: "直接调用 FT PCB 实体物料库与 Polar SI9000 真实叠层参数。",
          impact: "零叠层重构",
        },
        {
          phase: "第二阶段：DFM 可制造性校验",
          title: "自动化前置 DFM 审查",
          traditional: "设计完成后独立交付，工程审核发现数十项间距与焊环问题，延误多日。",
          unified: "实体工厂制程规则直接预置入 BSY Tech 规则引擎，前置通过率100%。",
          impact: "即时通过审核",
        },
        {
          phase: "第三阶段：样板与贴片试制",
          title: "高可靠一体化投产",
          traditional: "封装引脚错位或钢网开孔冲突导致打样报废，反复推诿排查。",
          unified: "协同器件库与钢网优化参数直接匹配工厂贴片机飞达系统。",
          impact: "24-48h 极速下线",
        },
        {
          phase: "第四阶段：测试与功能交付",
          title: "闭环验证与批产爬坡",
          traditional: "电路板功能异常时，设计公司与代工厂互推责任，难以定损。",
          unified: "单一体系统筹 100% 开关短路测试、AOI 光学筛查与上电功能验证。",
          impact: "99.8% 一次良率",
        },
      ],
    },
    tracksTitle: "四大针对性战略合作板块",
    tracksSubtitle: "根据贵单位的发展定位与硬件业务需求，选择最契合的协同共赢模式。",
    tracks: [
      {
        id: "distributor",
        title: "全球区域销售代表与渠道分销商",
        category: "商业渠道合作",
        badge: "出厂批发让利",
        description:
          "在您的目标区域市场代理 FT PCB 优质产品。享受源头直签出厂底价批发、专属 CAM 极速审核绿色通道、中性无痕代发货支持及专项市场拓展联合补贴。",
        perks: [
          "极具竞争力的源头阶梯批发底价（比贸易商常规拿货省 15% - 30%）",
          "配备专职资深 CAM 工程师团队，全天候保障客户图纸沟通与技术审查",
          "支持中性保密包装一件代发（Blind Drop-shipping），确保您的客户资产安全",
          "提供全套样品板展示箱、高精度阻抗测试切片、企业画册及技术白皮书支持",
        ],
        idealFor: "电子元器件代理商、海外 PCB 贸易分销商、方案设计公司及工业采购平台。",
        actionLabel: "申请成为区域销售代理",
      },
      {
        id: "academic",
        title: "高校重点实验室与大学生科创赛事赞助",
        category: "产学研协同创新",
        badge: "科创专项赞助",
        description:
          "传承深圳大学深厚学术渊源，FT PCB 持续设立专项科创基金，积极资助全国及全球高校重点实验室、IEEE 学生分会、大学生方程式赛车（Formula Student）及国际机器人竞赛团队。",
        perks: [
          "为高校大学生参赛战队提供免费或重度补贴的高多层样品极速打样专线",
          "针对 10-30 层复杂多层板、罗杰斯高频板及软硬结合板提供科研特惠扶持",
          "资深 CAM 专家团队为高校师生开设线上/线下 DFM 可制造性设计专题培训讲座",
          "开放聚四氟乙烯（PTFE）高频介质损耗与金相微切片理化实验室检测资源",
        ],
        idealFor: "高校电子信息工程学院、机器人战队、大学生方程式赛车队及科研课题组。",
        actionLabel: "申请高校科创赞助计划",
      },
      {
        id: "ems",
        title: "EMS 电子制造服务商与整机代工联盟",
        category: "工业产能协同",
        badge: "锁定专线产能",
        description:
          "大型 EMS 贴片制造企业与整机代工厂将 FT PCB 视为可信赖的高良率光板制造基石。我们在武平基地开辟专属柔性生产专线，保障大批量订单交期稳定与车规零缺陷出厂。",
        perks: [
          "单月预留高达 20,000 m² 专属保供产能，旺季绝不跳期断货",
          "严格执行车规级 IATF 16949:2016 体系与 IPC 3 级工业高可靠性质量标准",
          "针对 SMT 贴装工艺协同优化拼板阵列，最大化降低贴片机抛料率与装配工时",
          "支持与客户 ERP / MES 深度对接，实现生产数据与批次报告无缝穿透共享",
        ],
        idealFor: "中大型 EMS 贴片制造企业、汽车电子代工厂及工业自动化设备制造商。",
        actionLabel: "建立工业产能代工联盟",
      },
      {
        id: "incubator",
        title: "硬件加速器与硬科技创新孵化基地",
        category: "硬科技孵化加速",
        badge: "NPI 试产护航",
        description:
          "助力前沿硬科技从实验室原理原型走向商业化大批量交付。我们为初创硬件团队提供全流程 DFM 结构优化、元器件选型替代、热平衡散热设计及 NPI 小批量试产护航。",
        perks: [
          "资深工程师一对一免费开展前期图纸可制造性 DFM 预审，规避量产改版沉没成本",
          "5 片起订超低门槛，配备 24-48 小时极速打样与急件空运特快通道",
          "提供核心器件供应链代采与原厂备件协助，避免单一货源断供停产风险",
          "针对具备风投资质的优质创新团队提供灵活账期与里程碑阶段性付款支持",
        ],
        idealFor: "国家级科技企业孵化器、硬件创客空间、天使轮硬科技团队及创新实验室。",
        actionLabel: "加速硬科技项目孵化",
      },
    ],
    whyPartner: {
      badge: "为什么选择与 FT PCB 深度结盟",
      title: "扎根 28 年硬核实体制造的工业底蕴",
      description: "我们是拥有自主工业厂房的纯正实体大厂，绝非无资产的互联网中介转包商。",
      cards: [
        {
          title: "15,000 m² 现代化工业基地",
          desc: "坐落于福建武平高新技术产业园，3 栋独立标准厂房，月度综合产能突破 100,000 平方米。",
          stat: "15,000 m²",
        },
        {
          title: "45+ 名专职 CAM 资深工程团队",
          desc: "工程梯队平均从业经验超过 10 年，2 小时内快速响应极难 DRC 规则审查与 SI9000 阻抗建模。",
          stat: "< 2 小时",
        },
        {
          title: "汽车车规 IATF 16949:2016 权威实审",
          desc: "推行严苛的零缺陷质量管理体系，出厂产品 100% 经历四线开尔文低阻电气性能全检。",
          stat: "IATF 16949",
        },
        {
          title: "自主研发“云上飞天”MES 智能中枢",
          desc: "全板激光蚀刻二维码，实现从覆铜板开料、药水化验、镀铜到终检包装的全流程数字化秒级追溯。",
          stat: "100% 扫码追溯",
        },
      ],
    },
    form: {
      badge: "开启合作交流",
      title: "提交 FT PCB 全球合作伙伴申请",
      description: "填写下方合作信息，我们的全球战略合作总监将在 24 小时内与您直接技术沟通。",
      labelCompany: "机构 / 公司 / 高校全称",
      labelName: "联系人姓名与职务",
      labelEmail: "企业 / 机构官方电子邮箱",
      labelPhone: "联系电话 / 微信 / WhatsApp",
      labelTrack: "意向合作板块类型",
      labelVolume: "预估年度 PCB 需求体量 (m² 或款数)",
      labelMessage: "合作诉求与业务规划说明",
      placeholderCompany: "例如：某某科技有限公司 / 某重点大学机器人实验室",
      placeholderName: "例如：张经理 / 李教授（硬件研发总监）",
      placeholderEmail: "name@company.com",
      placeholderPhone: "+86 138-0000-0000",
      placeholderVolume: "例如：每年约 500 平方米 或 每年 60 款打样",
      placeholderMessage: "请简要介绍贵司业务方向、目前 PCB 采购痛点或具体合作设想...",
      submitBtn: "提交战略合作申请",
      submittingBtn: "正在提交申请...",
      successTitle: "合作申请已成功送达！",
      successDesc: "感谢您的信任。我们的全球商务拓展总监已收到您的方案，将在 24 小时内与您正式对接。",
    },
    faq: {
      badge: "合作常见问题",
      title: "战略合作常见问题解答",
      description: "解答关于合作准入、保密机制及日常支持等核心关切。",
      items: [
        {
          q: "在展开深入合作前，FT PCB 能否签署双向保密协议 (NDA)？",
          a: "完全可以。在收到任何客户图纸或商业方案前，我们日常与合作伙伴签署具备完整法律效力的双向保密协议（NDA）。所有工程资料均受物理隔离的内部加密服务器保护，未经正式授权绝不对外透露。",
        },
        {
          q: "申请成为区域品牌代理商或分销商需要具备哪些资质？",
          a: "我们希望合作伙伴在当地具备良好的电子制造、工控、汽车或通信行业客户资源，拥有一定的技术销售与客户维护能力。我们将综合评估年度采购体量承诺、区域辐射半径与服务能力予以官方授权。",
        },
        {
          q: "高校赛事与实验室赞助计划的具体执行流程是怎样的？",
          a: "指导老师或战队负责人提交申请，附上车队/项目研发规划与赛事日程。通过审核后，我们将开辟赞助专线，提供免费或高折扣的样品打样额度、专属 CAM 审核及特快专递。",
        },
        {
          q: "工厂能否为我们的代工客户提供完全中性的盲发保密物流？",
          a: "完全可以。针对渠道伙伴与 EMS 客户，我们提供专业的中性外包装（箱体无任何 FT PCB 标识），箱贴与发货单支持按客户要求定制，彻底保护您的终端客户商业资产。",
        },
      ],
    },
    cta: {
      badge: "与国家级“小巨人”实体大厂携手同行",
      title: "携手 FT PCB，共筑坚如磐石的硬核硬件未来",
      description: "直接对接武平生产基地高管团队，探讨个性化出厂批发底价、专线产能锁定及长期战略合作框架。",
      btnApply: "立即提交合作申请",
      btnContact: "直接致电商务合作负责人",
    },
  },
};

export function getPartnershipTranslation(locale: string): PartnershipDictionary {
  if (PARTNERSHIP_TRANSLATIONS[locale]) {
    return PARTNERSHIP_TRANSLATIONS[locale];
  }

  const base = PARTNERSHIP_TRANSLATIONS.en;
  const localized: PartnershipDictionary = JSON.parse(JSON.stringify(base));

  if (locale === "de") {
    localized.hero.badge = "STRATEGISCHE PARTNERSCHAFT • HARDWARE WELTWEIT BESCHLEUNIGEN";
    localized.hero.title = "Partnerschaft mit FT PCB:";
    localized.hero.highlight = "Gemeinsam hochzuverlässige Elektronik skalieren";
    localized.hero.applyBtn = "Partnerschaft beantragen";
    localized.tracksTitle = "Vier spezialisierte Partnerschaftsprogramme";
  } else if (locale === "fr") {
    localized.hero.badge = "PARTENARIAT STRATÉGIQUE • ACCÉLÉRER LE MATÉRIEL MONDIAL";
    localized.hero.title = "Devenez partenaire de FT PCB :";
    localized.hero.highlight = "Développer ensemble une électronique haute fiabilité";
    localized.hero.applyBtn = "Demande de partenariat";
    localized.tracksTitle = "Quatre programmes de partenariat spécialisés";
  } else if (locale === "ja") {
    localized.hero.badge = "戦略的パートナーシップ • 世界のハードウェアを加速";
    localized.hero.title = "FT PCB との提携：";
    localized.hero.highlight = "高信頼性エレクトロニクスの未来を共に創る";
    localized.hero.applyBtn = "提携プログラムに申し込む";
    localized.tracksTitle = "4つの専門提携プログラム";
  } else if (locale === "es") {
    localized.hero.badge = "ASOCIACIÓN ESTRATÉGICA • ACELERANDO EL HARDWARE GLOBAL";
    localized.hero.title = "Asóciese con FT PCB:";
    localized.hero.highlight = "Escalando juntos electrónica de alta fiabilidad";
    localized.hero.applyBtn = "Solicitar asociación";
    localized.tracksTitle = "Cuatro programas de asociación especializados";
  } else if (locale === "ru") {
    localized.hero.badge = "СТРАТЕГИЧЕСКОЕ ПАРТНЕРСТВО • УСКОРЯЯ ЭЛЕКТРОНИКУ";
    localized.hero.title = "Партнерство с FT PCB:";
    localized.hero.highlight = "Масштабируем надежную электронику вместе";
    localized.hero.applyBtn = "Подать заявку на партнерство";
    localized.tracksTitle = "Четыре специализированных направления партнерства";
  } else if (locale === "ko") {
    localized.hero.badge = "전략적 파트너십 • 글로벌 하드웨어 혁신 가속화";
    localized.hero.title = "FT PCB 파트너십:";
    localized.hero.highlight = "고신뢰성 전자 제조 생태계를 함께 구축합니다";
    localized.hero.applyBtn = "파트너십 신청하기";
    localized.tracksTitle = "4가지 전문 파트너십 프로그램";
  } else if (locale === "it") {
    localized.hero.badge = "PARTNERSHIP STRATEGICA • ACCELERARE L'HARDWARE";
    localized.hero.title = "Partner con FT PCB:";
    localized.hero.highlight = "Scalare insieme l'elettronica ad alta affidabilità";
    localized.hero.applyBtn = "Richiedi partnership";
  } else if (locale === "pt") {
    localized.hero.badge = "PARCERIA ESTRATÉGICA • ACELERANDO O HARDWARE GLOBAL";
    localized.hero.title = "Seja parceiro da FT PCB:";
    localized.hero.highlight = "Escalando eletrônica de alta confiabilidade juntos";
    localized.hero.applyBtn = "Candidatar-se à parceria";
  } else if (locale === "ar") {
    localized.hero.badge = "شراكة استراتيجية • تسريع الابتكار في الأجهزة عالمياً";
    localized.hero.title = "كن شريكاً لـ FT PCB:";
    localized.hero.highlight = "توسيع نطاق الإلكترونيات عالية الموثوقية معاً";
    localized.hero.applyBtn = "التقدم للشراكة";
  } else if (locale === "tr") {
    localized.hero.badge = "STRATEJİK ORTAKLIK • DONANIMI KÜRESEL OLARAK HIZLANDIRMA";
    localized.hero.title = "FT PCB ile Ortaklık Kurun:";
    localized.hero.highlight = "Yüksek Güvenilirlikli Elektroniği Birlikte Büyütelim";
    localized.hero.applyBtn = "Ortaklık Başvurusu Yap";
  } else if (locale === "bn") {
    localized.hero.badge = "কৌশলগত অংশীদারিত্ব • বিশ্বব্যাপী হার্ডওয়্যার উদ্ভাবন";
    localized.hero.title = "FT PCB-এর সাথে অংশীদারিত্ব:";
    localized.hero.highlight = "উচ্চ-নির্ভরযোগ্য ইলেকট্রনিক্স একসাথে এগিয়ে নেওয়া";
    localized.hero.applyBtn = "অংশীদারিত্বের জন্য আবেদন করুন";
  } else if (locale === "hi") {
    localized.hero.badge = "रणनीतिक साझेदारी • हार्डवेयर इनोवेशन को गति दें";
    localized.hero.title = "FT PCB के साथ साझेदारी:";
    localized.hero.highlight = "उच्च विश्वसनीयता वाले इलेक्ट्रॉनिक्स को साथ मिलकर आगे बढ़ाएं";
    localized.hero.applyBtn = "साझेदारी के लिए आवेदन करें";
  } else if (locale === "ur") {
    localized.hero.badge = "اسٹریٹجک پارٹنرشپ • گلوبل ہارڈویئر جدت";
    localized.hero.title = "ایف ٹی پی سی بی کے ساتھ پارٹنرشپ:";
    localized.hero.highlight = "اعلی معیار کی الیکٹرانکس مل کر آگے بڑھائیں";
    localized.hero.applyBtn = "پارٹنرشپ کے لیے درخواست دیں";
  } else if (locale === "af") {
    localized.hero.badge = "STRATEGIESE VENNOOTSKAP • VERSNEL HARDWARE WÊRELDWYD";
    localized.hero.title = "Vennootskap met FT PCB:";
    localized.hero.highlight = "Skaal hoë-betroubaarheid elektronika saam";
    localized.hero.applyBtn = "Doen aansoek vir vennootskap";
  }

  return localized;
}
