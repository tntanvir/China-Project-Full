"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Globe2,
  FileText,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface TourStop {
  id: string;
  tabLabel: string;
  icon: any;
  title: string;
  subtitle: string;
  slideNumber: number;
  imageSrc: string;
  highlights: string[];
  description: string;
  metrics: { label: string; value: string }[];
}

const TOUR_STOPS_EN: TourStop[] = [
  {
    id: "campus",
    tabLabel: "15,000m² Production Base",
    icon: Building2,
    title: "Wuping High-Tech Industrial Zone Campus",
    subtitle: "Western Fujian 'Golden Triangle' Strategic Electronic Hub",
    slideNumber: 7,
    imageSrc: "/images/company-profile/page_7.jpg",
    description:
      "Spanning 15,000 square meters across three standardized factory buildings, FT PCB operates fully automated multi-layer and specialty PCB production lines with dedicated wastewater treatment recycling facilities and central cleanrooms.",
    highlights: [
      "3 Standalone Production Buildings (Fabrication, Plating, Testing)",
      "100,000 m²/month total production capacity",
      "Zero-discharge environmental wastewater recycling plant",
      "Fast logistics connectivity to Shenzhen, Guangzhou, and Xiamen ports",
    ],
    metrics: [
      { label: "Factory Area", value: "15,000 m²" },
      { label: "Buildings", value: "3 Facilities" },
      { label: "Registered Capital", value: "30M RMB" },
      { label: "Monthly Output", value: "100k m²" },
    ],
  },
  {
    id: "smart-factory",
    tabLabel: "Smart Cloud MES & ERP",
    icon: Cpu,
    title: "Proprietary 'Yunshang Feitian' Cloud Architecture",
    subtitle: "AI-Assisted Scheduling & Panel-Level Barcode Traceability",
    slideNumber: 14,
    imageSrc: "/images/company-profile/page_14.jpg",
    description:
      "Independently engineered by Professor Chen Jingqiu and the engineering software team, our Yunshang Feitian ERP and Yunshang Chuyang mobile ordering system provide real-time visibility from CAD Gerber ingestion to chemical plating and delivery tracking.",
    highlights: [
      "2D Barcode tracking laser-etched onto every production panel",
      "Dynamic production bottleneck balancing and automated lead-time prediction",
      "Mobile WeChat / Web portal for customers to track real-time machine progress",
      "Automated CAM rule-checking verifying over 120 DFM design parameters",
    ],
    metrics: [
      { label: "Traceability", value: "100% Barcode" },
      { label: "CAM Turnaround", value: "2 Hours" },
      { label: "Rapid Prototype", value: "24-48 Hours" },
      { label: "MES System", value: "In-House Cloud" },
    ],
  },
  {
    id: "academic-rd",
    tabLabel: "Shenzhen Univ. R&D Lab",
    icon: GraduationCap,
    title: "Academic Research & 5G High-Frequency Patents",
    subtitle: "Headed by Professor Chen Jingqiu, Doctor of Engineering",
    slideNumber: 20,
    imageSrc: "/images/company-profile/page_20.jpg",
    description:
      "Collaborating directly with the advanced laboratories at Shenzhen University, our R&D group holds the highest number of authorized 5G invention patents in Longyan City, specializing in PTFE high-frequency microwave boards and micro-aperture plating dynamics.",
    highlights: [
      "Sole certified R&D base for 5G high-frequency circuit boards in western Fujian",
      "Breakthrough PTFE Teflon bonding and low-loss microstrip design",
      "Postgraduate internship and doctoral engineering research base",
      "National High-Tech Enterprise and Fujian 'Little Giant' accreditation",
    ],
    metrics: [
      { label: "Founder", value: "Prof. Chen Jingqiu" },
      { label: "Academic Partner", value: "Shenzhen Univ." },
      { label: "Invention Patents", value: "#1 in Longyan" },
      { label: "Specialty", value: "5G & PTFE Teflon" },
    ],
  },
  {
    id: "automotive",
    tabLabel: "IATF 16949 Automotive Line",
    icon: ShieldCheck,
    title: "IATF 16949 Certified Automotive Fabrication",
    subtitle: "Zero-Defect Standard for Powertrain & Safety Electronics",
    slideNumber: 35,
    imageSrc: "/images/company-profile/page_35.jpg",
    description:
      "Automotive printed circuit boards require strict reliability under thermal cycling and vibration. Our certified automotive production cells manufacture instrument clusters, LED matrix headlights, horn controllers, and battery management boards.",
    highlights: [
      "Strict compliance with IATF 16949:2016 automotive quality management system",
      "Thermal stress resistance tested at 288°C solder float without delamination",
      "Kelvin 4-wire resistance testing ensuring trace continuity down to 0.1 mΩ",
      "Supplying major tier-1 automotive electronics suppliers globally",
    ],
    metrics: [
      { label: "Quality Standard", value: "IATF 16949" },
      { label: "Automotive Share", value: "35% of Output" },
      { label: "Thermal Float", value: "288°C 10s × 3" },
      { label: "Flammability", value: "UL 94V-0" },
    ],
  },
  {
    id: "global-network",
    tabLabel: "Global Centers & Logistics",
    icon: Globe2,
    title: "Three Coordinated Strategic Hubs",
    subtitle: "Fujian Production Base • Shenzhen Sales HQ • Xiamen CAM Center",
    slideNumber: 42,
    imageSrc: "/images/company-profile/page_42.jpg",
    description:
      "Our multi-hub network connects high-speed manufacturing in Wuping with our global sales and technical support office in Shenzhen's Bao'an High-Tech corridor, along with CAM engineering support in Xiamen.",
    highlights: [
      "Wuping Production Base: 15,000m² factory floor & primary manufacturing",
      "Shenzhen Center: Room 1603, Block A, Fenghuang Zhi Gu, Country Garden, Bao'an",
      "Xiamen Center: No. 2 Ridong Road, Jimei District (CAM engineering & regional sales)",
      "Daily international express dispatch to North America, Europe, and Asia",
    ],
    metrics: [
      { label: "Production HQ", value: "Wuping, Fujian" },
      { label: "Global Marketing", value: "Shenzhen, Bao'an" },
      { label: "Design Center", value: "Xiamen, Jimei" },
      { label: "Export Markets", value: "Worldwide" },
    ],
  },
];

const TOUR_STOPS_ZH: TourStop[] = [
  {
    id: "campus",
    tabLabel: "15,000m² 现代化生产基地",
    icon: Building2,
    title: "武平高新技术产业园区生产基地",
    subtitle: "闽西粤东“金三角”战略电子信息枢纽",
    slideNumber: 7,
    imageSrc: "/images/company-profile/page_7.jpg",
    description:
      "占地面积15,000平方米，拥有三栋标准化独栋现代厂房。FT PCB运行全自动高多层与特种电路板生产流水线，建有配套环保废水零排放处理站与中央万级洁净室。",
    highlights: [
      "3栋独栋标准化生产车间（制板、电镀、成型与终检测试）",
      "全厂月综合产出能力达 100,000 m²",
      "工业废水深度达标回收处理与绿色循环生态系统",
      "便捷连通深圳、广州、厦门等国际主要口岸与机场",
    ],
    metrics: [
      { label: "厂房总面积", value: "15,000 m²" },
      { label: "独栋厂房", value: "3 栋建筑" },
      { label: "注册资本", value: "3,000 万元" },
      { label: "月综合产能", value: "100,000 m²" },
    ],
  },
  {
    id: "smart-factory",
    tabLabel: "工业云 MES 与智能排产",
    icon: Cpu,
    title: "自主研发“云上飞天”工业云架构",
    subtitle: "AI辅助动态智能排产与板级二维条码追溯",
    slideNumber: 14,
    imageSrc: "/images/company-profile/page_14.jpg",
    description:
      "由陈景秋教授领衔软件研发团队自主研发的“云上飞天”MES系统与“云上初阳”移动订货平台，实现从Gerber工程文件下发到化学电镀、测试包装全流程透明追溯。",
    highlights: [
      "生产板逐张激光雕刻2D二维数据矩阵码，实现全工序追踪",
      "动态生产瓶颈负载均衡算法与自动化交期精准预测",
      "客户专属微信小程序/网页端实时查看机台生产动态",
      "CAM工程规则自动校验，覆盖超过120项DFM设计参数",
    ],
    metrics: [
      { label: "全流程追溯", value: "100% 条码追溯" },
      { label: "CAM审核反馈", value: "< 2 小时" },
      { label: "加急样品打样", value: "24-48 小时" },
      { label: "MES软件系统", value: "自主知识产权" },
    ],
  },
  {
    id: "academic-rd",
    tabLabel: "深大联合实验室与专利",
    icon: GraduationCap,
    title: "学院派产学研与5G高频发明专利",
    subtitle: "工学博士陈景秋教授亲自领衔科研攻关",
    slideNumber: 20,
    imageSrc: "/images/company-profile/page_20.jpg",
    description:
      "与深圳大学先进材料重点实验室开展深度产学研合作，在龙岩市拥有排名第一的5G电路发明专利矩阵，专攻PTFE聚四氟乙烯高频微波板与微孔深镀技术。",
    highlights: [
      "闽西地区唯一经权威认定的5G高频电路板产学研联合研发基地",
      "突破PTFE高频微波低损耗微带线压合与钻孔技术壁垒",
      "深圳大学研究生培养实践基地与博士后联合攻坚课题",
      "国家级高新技术企业与福建省“专精特新”小巨人认证",
    ],
    metrics: [
      { label: "创始人/首席科学家", value: "陈景秋 教授" },
      { label: "科研合作高校", value: "深圳大学" },
      { label: "5G发明专利总数", value: "龙岩市第一" },
      { label: "特色专精领域", value: "5G & PTFE特种板" },
    ],
  },
  {
    id: "automotive",
    tabLabel: "IATF 16949 汽车级专线",
    icon: ShieldCheck,
    title: "IATF 16949 汽车电子严苛品质专线",
    subtitle: "汽车动力总成与关键安全件零缺陷制造标准",
    slideNumber: 35,
    imageSrc: "/images/company-profile/page_35.jpg",
    description:
      "汽车级印制电路板需承受严苛的长期冷热交变与高频机械振动。FT PCB通过IATF 16949体系认证，大批量交付仪表盘、LED矩阵大灯驱动、喇叭控制器与BMS保护板。",
    highlights: [
      "严格执行 IATF 16949:2016 汽车行业国际质量管理体系规范",
      "耐热冲击可靠性测试：288°C 浸锡热应力测试确保无爆板起泡",
      "开尔文4线低阻导通测试，保证微裂纹零漏检（0.1 mΩ精度）",
      "长期直供国内外知名汽车一级零部件供应商（Tier-1）",
    ],
    metrics: [
      { label: "质量认证体系", value: "IATF 16949" },
      { label: "阻焊耐温热冲击", value: "288°C / 10s" },
      { label: "成品电气测试", value: "100% 开尔文4线" },
      { label: "目标良品率", value: "≥ 99.2%" },
    ],
  },
  {
    id: "footprint",
    tabLabel: "武平 • 深圳 • 厦门 全球网络",
    icon: Globe2,
    title: "武平源头实体大厂与全国营销技术辐射",
    subtitle: "生产制造中心 + 深圳海外营销 + 厦门CAM技术中心",
    slideNumber: 6,
    imageSrc: "/images/company-profile/page_6.jpg",
    description:
      "FT PCB构建了“源头实体大厂集中制造、深圳辐射全球海外市场、厦门驻守技术工程支持”的高效联动三角网络，极速响应客户的多样化交期需求。",
    highlights: [
      "制造总部：福建武平高新技术产业园区武东大道（15,000m²生产实体基地）",
      "海外营销运营中心：深圳宝安福永（极速对接外贸海空运与国际客户）",
      "厦门技术中心：集美区日东路2号（资深CAM工程团队与售前技术对接）",
      "DHL、FedEx、UPS国际航空快递每日定点出货，通达欧美亚非45+国家",
    ],
    metrics: [
      { label: "实体制造总部", value: "福建武平高新区" },
      { label: "全球营销中心", value: "深圳宝安" },
      { label: "CAM工程中心", value: "厦门集美" },
      { label: "全球服务版图", value: "45+ 海外国家" },
    ],
  },
];

export default function VirtualFactoryTour() {
  const { locale } = useLanguage();
  const tourStops = locale === "zh" ? TOUR_STOPS_ZH : TOUR_STOPS_EN;
  const [activeTab, setActiveTab] = useState("campus");

  const currentStop =
    tourStops.find((stop) => stop.id === activeTab) || tourStops[0];

  const handleJumpToSlide = (slideNum: number) => {
    const viewerElement = document.getElementById("profile-viewer");
    if (viewerElement) {
      viewerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tour Stops Tab Navigation with Animated Sliding Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none relative">
        {tourStops.map((stop) => {
          const Icon = stop.icon;
          const isActive = stop.id === activeTab;
          return (
            <button
              key={stop.id}
              onClick={() => setActiveTab(stop.id)}
              className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white/70 dark:bg-slate-900/70 border border-gray-200/80 dark:border-slate-800"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tourTabIndicator"
                  className="absolute inset-0 rounded-2xl bg-slate-900 dark:bg-emerald-600 shadow-md shadow-emerald-600/25"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <Icon
                className={`size-4 relative z-10 transition-colors ${
                  isActive ? "text-emerald-400 dark:text-white" : "text-gray-400 dark:text-slate-500"
                }`}
              />
              <span className="relative z-10">{stop.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tour Stop Display */}
      <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-12 items-stretch">
          {/* Visual Photograph Card with Smooth Animation */}
          <div className="lg:col-span-7 relative bg-slate-950 min-h-[340px] sm:min-h-[460px] flex items-center justify-center p-4 overflow-hidden group">
            {/* Laser Scanning Line Animation */}
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] pointer-events-none z-20 opacity-70"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStop.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative w-full h-full max-h-[500px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={currentStop.imageSrc}
                  alt={currentStop.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain bg-black/90 group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white border border-white/20">
              <FileText className="size-3 text-emerald-400" />
              <span>
                {locale === "zh"
                  ? `官方画册第 ${currentStop.slideNumber} 页`
                  : `Brochure Slide ${currentStop.slideNumber}`}
              </span>
            </div>

            <button
              onClick={() => handleJumpToSlide(currentStop.slideNumber)}
              className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-black shadow-lg backdrop-blur-md transition active:scale-95 cursor-pointer"
            >
              <span>{locale === "zh" ? "在阅读器中查阅" : "Inspect in Reader"}</span>
              <ExternalLink className="size-3.5" />
            </button>
          </div>

          {/* Details & Specifications with Smooth Content Transition */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStop.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 px-3 py-1 text-[11px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  <Sparkles className="size-3" />
                  <span>{currentStop.subtitle}</span>
                </div>

                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                  {currentStop.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {currentStop.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    {locale === "zh" ? "制造基地核心优势亮点" : "Core Operational Highlights"}
                  </span>
                  <ul className="space-y-2">
                    {currentStop.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                        className="flex items-start gap-2 text-xs text-gray-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Verified Metrics Counter */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {currentStop.metrics.map((m, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      className="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60 p-2.5 transition-shadow hover:shadow-xs"
                    >
                      <div className="text-[10px] text-gray-400 font-medium">{m.label}</div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {m.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">
                {locale === "zh" ? "经 FT PCB 实体制造基地认证" : "Verified FT PCB Production Campus"}
              </span>
              <Link
                href="/pcb-quote"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 transition"
              >
                <span>{locale === "zh" ? "获取源头工厂报价" : "Request Quotation"}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
