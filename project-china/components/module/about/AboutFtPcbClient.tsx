"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Download,
  FileText,
  Award,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Globe2,
  MapPin,
  Clock,
  ArrowRight,
  Sliders,
  Check,
  Factory,
  BarChart3,
  Boxes,
  Atom,
  Binary,
  Microscope,
  DollarSign,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

import dynamic from "next/dynamic";
import { useDictionary, useLanguage } from "@/components/providers/language-provider";
import AboutHeroInteractiveCard from "@/components/module/about/AboutHeroInteractiveCard";
import CompanyProfilePdfViewer from "@/components/module/about/CompanyProfilePdfViewer";
import CorporateHistoryTimeline from "@/components/module/about/CorporateHistoryTimeline";
import LeadershipSpotlight from "@/components/module/about/LeadershipSpotlight";
import ManufacturingPipelineStepper from "@/components/module/about/ManufacturingPipelineStepper";
import VirtualFactoryTour from "@/components/module/about/VirtualFactoryTour";
import InteractiveEquipmentGallery from "@/components/module/about/InteractiveEquipmentGallery";
import InteractiveProcessCapabilities from "@/components/module/about/InteractiveProcessCapabilities";
import CostComparisonVisualizer from "@/components/module/about/CostComparisonVisualizer";
import ElectronicsBusinessScope from "@/components/module/about/ElectronicsBusinessScope";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AboutPcb3DViewer = dynamic(
  () => import("@/components/module/about/AboutPcb3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40 flex items-center justify-center text-xs text-muted-foreground">
        Loading 3D Visualizer...
      </div>
    ),
  }
);

const GlobalCaseStudiesMap = dynamic(
  () => import("@/components/module/about/GlobalCaseStudiesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/40 flex items-center justify-center text-xs text-muted-foreground">
        Loading Global Distribution Map...
      </div>
    ),
  }
);

function getStats(locale: string) {
  if (locale === "zh") {
    return [
      { value: "100,000 m²", label: "月度综合产能", sub: "80,000m² 高多层 + 20,000m² 特种板", icon: Layers },
      { value: "15,000 m²", label: "现代化实体制造基地", sub: "福建武平高新技术产业园 3 栋标准厂房", icon: Building2 },
      { value: "3000万 RMB", label: "实收注册资本", sub: "国家级专精特新“小巨人”企业", icon: ShieldCheck },
      { value: "3,000+ 款", label: "月交付产品款数", sub: "从工程打样到大批量量产全面支持", icon: Sliders },
      { value: "300+ 人", label: "专业技术研发团队", sub: "平均年龄29岁 • 45+位资深CAM工程师", icon: Cpu },
      { value: "28+ 年", label: "实体制造行业积淀", sub: "始创于1997年珠三角 • 扎根硬核制造", icon: TrendingUp },
    ];
  }
  return [
    { value: "100,000 m²", label: "Monthly Capacity", sub: "80k m² Multi-Layer + 20k m² Special", icon: Layers },
    { value: "15,000 m²", label: "Modern Factory Base", sub: "3 Buildings in Wuping High-Tech Zone", icon: Building2 },
    { value: "30M RMB", label: "Registered Capital", sub: "National Little Giant Enterprise", icon: ShieldCheck },
    { value: "3,000+", label: "Monthly Part Numbers", sub: "Quick-Turn Prototype to Mass Volume", icon: Sliders },
    { value: "300+", label: "Technical Specialists", sub: "Average Age 29 • 45+ CAM Engineers", icon: Cpu },
    { value: "28+ Years", label: "Industry Legacy", sub: "Founded in 1997 in Pearl River Delta", icon: TrendingUp },
  ];
}

function getMarketDistribution(locale: string) {
  if (locale === "zh") {
    return [
      { name: "工业控制与大功率电源", percent: 37, color: "bg-emerald-500" },
      { name: "汽车电子与车载智能模块", percent: 35, color: "bg-blue-500" },
      { name: "医疗仪器与健康智能设备", percent: 10, color: "bg-teal-500" },
      { name: "5G通信微基站与高速射频", percent: 9, color: "bg-purple-500" },
      { name: "智能家居与物联网硬件", percent: 6, color: "bg-amber-500" },
      { name: "高精专防务与特种电子", percent: 3, color: "bg-rose-500" },
    ];
  }
  return [
    { name: "Industrial Control & Power Supplies", percent: 37, color: "bg-emerald-500" },
    { name: "Automotive Electronics & Vehicle-Mounted", percent: 35, color: "bg-blue-500" },
    { name: "Healthcare & Medical Devices", percent: 10, color: "bg-teal-500" },
    { name: "5G Base Stations & High-Speed Telecom", percent: 9, color: "bg-purple-500" },
    { name: "Smart Home & Consumer IoT", percent: 6, color: "bg-amber-500" },
    { name: "High-Tech Defense & Specialized Electronics", percent: 3, color: "bg-rose-500" },
  ];
}

function getCertifications(locale: string) {
  if (locale === "zh") {
    return [
      { title: "IATF 16949:2016", issuer: "汽车行业质量管理体系", desc: "严格执行车规零缺陷质量管控，满足车载动力总成、车规LED与智能座舱严苛标准。", badge: "车规级认证" },
      { title: "ISO 9001:2015", issuer: "质量管理体系实审认证", desc: "从生益/建滔原材料入厂化学分析到最终金相微切片出厂全制程受控。", badge: "质量实审认证" },
      { title: "ISO 14001:2015", issuer: "环境管理体系认证", desc: "国家级清洁生产示范企业，自建工业污水全循环净化回收系统。", badge: "绿色环保示范" },
      { title: "UL 94V-0 (E360609)", issuer: "美国保险商实验室安全认证", desc: "国际权威阻燃等级实审，符合欧美全球出口认证准入规范。", badge: "UL权威认证" },
    ];
  }
  return [
    { title: "IATF 16949:2016", issuer: "Automotive Quality Management", desc: "Strict zero-defect compliance for automotive powertrain, LED lighting, and cockpit electronics.", badge: "Automotive Grade" },
    { title: "ISO 9001:2015", issuer: "Quality Management System", desc: "Certified end-to-end quality inspection from raw FR4 laminates to final micro-section dispatch.", badge: "Quality Standard" },
    { title: "ISO 14001:2015", issuer: "Environmental Management", desc: "National Clean Production Enterprise with zero-discharge wastewater treatment and recycling.", badge: "Green Production" },
    { title: "UL 94V-0 (E360609)", issuer: "Underwriters Laboratories USA", desc: "Recognized flammability rating with complete material traceability for European and US markets.", badge: "UL Listed" },
  ];
}

function getDossierFacts(locale: string) {
  if (locale === "zh") {
    return [
      { label: "官方企业注册全称", value: "福建省武平县飞天电子科技有限公司 (FT PCB)" },
      { label: "品牌历史发展沿革", value: "始创于 1997 年 (28 年实体制造深厚底蕴)" },
      { label: "实收法定注册资本", value: "30,000,000.00 元人民币 (实收资本验资实缴)" },
      { label: "高新制造基地厂区", value: "15,000 平方米 (3 栋独立现代化标准工业厂房)" },
      { label: "现行单月制造产能", value: "100,000 平方米 (80,000m² 高多层 + 20,000m² 特种板)" },
      { label: "专业工程研发梯队", value: "300+ 名高素质员工 (平均年龄 29 岁，45+ 名专业 CAM 工程师)" },
      { label: "汽车行业准入资质", value: "IATF 16949:2016 体系认证 (零缺陷制造标准)" },
      { label: "国际安全阻燃认证", value: "UL 94V-0 (认证档案编号: E360609)" },
      { label: "核心知识产权专利", value: "龙岩市授权 5G 发明专利数量第一的实体企业" },
      { label: "数字化 MES 智造系统", value: "自主研发“云上飞天”全流程二维码扫码追溯系统" },
    ];
  }
  return [
    { label: "Official Registered Entity", value: "FT PCB (Wuping Feitian Electronic Technology Co., Ltd.)" },
    { label: "Established / Inception", value: "1997 (28+ Years Manufacturing Legacy)" },
    { label: "Registered Capital", value: "30,000,000 RMB (~$4.5 Million USD)" },
    { label: "Production Campus", value: "15,000 m² across 3 standardized factory buildings" },
    { label: "Current Monthly Output", value: "100,000 m² (80,000 m² multi-layer + 20,000 m² special)" },
    { label: "Technical Workforce", value: "300+ employees (Average Age 29, 45+ CAM engineers)" },
    { label: "Automotive Accreditation", value: "IATF 16949:2016 Certified (Zero-Defect Standard)" },
    { label: "UL Flammability Rating", value: "UL 94V-0 (File Number: E360609)" },
    { label: "Intellectual Property", value: "#1 5G Authorized Invention Patent Holder in Longyan" },
    { label: "Cloud MES Architecture", value: "'Yunshang Feitian' 2D Barcode Traceability System" },
  ];
}

function getLabCapabilities(locale: string) {
  if (locale === "zh") {
    return [
      { title: "5G高频微波聚四氟乙烯研发中心", desc: "与深圳大学联合攻关超低介质损耗角正切与高低温热应力形变一致性。", icon: Atom, metric: "损耗角 < 0.002" },
      { title: "高多层差分阻抗精确建模 (±5%)", desc: "采用边界元法场求解器针对30层高密度背板精确阻抗匹配，辅以TDR实测验证。", icon: Binary, metric: "±5% 严苛公差" },
      { title: "自主知识产权“云上飞天”智能MES", desc: "陈景秋教授团队主导研发的算法排产系统，实时联动武平3栋现代化厂区自动化机组。", icon: Cpu, metric: "100% 工位扫码追溯" },
      { title: "高真空等离子体表面处理实验室", desc: "采用高真空氧/氩等离子体轰击微孔孔壁，增强特种微波板材料垂直连续电镀(VCP)铜结合力。", icon: Microscope, metric: "零孔铜分层隐患" },
    ];
  }
  return [
    { title: "5G High-Frequency Microwave PTFE", desc: "Research with Shenzhen University on low-loss dielectric constants and phase consistency under thermal cycling.", icon: Atom, metric: "Loss Tangent < 0.002" },
    { title: "Differential Impedance Modeling (±5%)", desc: "Field-solver boundary element calculation for 30-layer high-density backplanes with TDR validation.", icon: Binary, metric: "±5% Strict Precision" },
    { title: "Proprietary 'Yunshang Feitian' Cloud MES", desc: "Algorithmic production scheduling system developed under Dr. Chen Jingqiu linking all 3 buildings.", icon: Cpu, metric: "100% Station Traceability" },
    { title: "Plasma Surface Modification", desc: "High-vacuum oxygen/argon plasma etching to prepare fluoropolymer substrates for vertical continuous plating (VCP).", icon: Microscope, metric: "Zero Barrel Cracking" },
  ];
}

function getComparisonRows(locale: string) {
  if (locale === "zh") {
    return [
      { feature: "质量检测与审核标准", feitian: "IATF 16949:2016 / IPC 3 级工业标准", standard: "普通基础 ISO 9001 / IPC 2 级" },
      { feature: "机械与激光微孔深径比", feitian: "最高达 12 : 1 严苛深径比", standard: "8 : 1 普通标准" },
      { feature: "极限线宽线距能力", feitian: "2 / 2 mil (0.05 mm)", standard: "4 / 4 mil (0.10 mm)" },
      { feature: "孔壁铜层厚度", feitian: "≥ 20 - 25 µm (垂直连续VCP电镀线)", standard: "15 - 18 µm (普通挂镀)" },
      { feature: "单板与拼板全流程溯源", feitian: "全板激光蚀刻二维码 (云上飞天MES实时追踪)", standard: "仅附普通纸质流程卡" },
      { feature: "CAM DFM 审核时效", feitian: "2 小时内出具详尽报告 (45+名自营CAM团队)", standard: "12 - 24 小时 (转包外判中介)" },
      { feature: "网表百分之百电气测试", feitian: "100% 4线开尔文四端子低阻导通测试 (免加收)", standard: "抽检或加收开路电测费" },
      { feature: "基板原材料真伪保障", feitian: "100% 采购生益、建滔、Rogers原厂板材并附材质单", standard: "混用无牌翻新覆铜板" },
    ];
  }
  return [
    { feature: "Quality Audit Standard", feitian: "IATF 16949:2016 / IPC Class 3", standard: "Basic ISO 9001 / IPC Class 2" },
    { feature: "CNC Aspect Ratio", feitian: "Up to 12 : 1 Precision", standard: "8 : 1 Standard" },
    { feature: "Min Line / Space", feitian: "2 / 2 mil (0.05 mm)", standard: "4 / 4 mil (0.10 mm)" },
    { feature: "Hole-Wall Copper Thickness", feitian: "≥ 20 - 25 µm (VCP Continuous Plating)", standard: "15 - 18 µm (Standard Plating)" },
    { feature: "Panel Traceability", feitian: "Laser-etched 2D Barcode (Cloud MES)", standard: "Batch traveler sheet only" },
    { feature: "CAM DFM Turnaround", feitian: "Within 2 Hours (45+ In-House CAMs)", standard: "12 - 24 Hours via Sales Broker" },
    { feature: "Netlist Electrical Test", feitian: "100% 4-Wire Kelvin Continuity (Free)", standard: "Spot test or added surcharge" },
    { feature: "Raw Material Authenticity", feitian: "100% Shengyi, KB, Rogers + COC", standard: "Mixed generic unbranded laminate" },
  ];
}

function getServicesTiers(locale: string) {
  if (locale === "zh") {
    return [
      { title: "极速打样与小批量快件", turnaround: "24 - 48 小时极速出厂", badge: "快件打样", color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800", desc: "专为硬件研发试产团队打造的2-16层快速原型制造，2小时CAM审核响应，空运特快专线。", features: ["2小时急速CAM工程审核", "常规与特种叠层现货支持", "100%飞针网络电测与外观AOI"] },
      { title: "高多层工业量产制造", turnaround: "月产 100,000 m² 产能", badge: "规模量产", color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800", desc: "福建武平15,000m²制造基地，全自动垂直连续VCP电镀与高速CNC精密钻孔，良率行业领先。", features: ["单月8万m²高多层综合产能", "激光蚀刻全板二维码追溯", "全制程自动化机械臂上下料"] },
      { title: "汽车级IATF 16949模块板", turnaround: "车规零缺陷质量管控", badge: "车规制造", color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800", desc: "设立专职汽车电子生产专线，服务车载仪表、矩阵大灯与BMS电池管理系统。", features: ["通过IATF 16949:2016车规认证", "288°C 10秒×3次热应力浮焊试验", "4线开尔文微欧级低阻导通测试"] },
      { title: "5G高频微波与PTFE板材", turnaround: "射频天线特种基板", badge: "深大研发", color: "from-purple-500/20 to-violet-500/10 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800", desc: "与深圳大学产学研基地联合研制，专注罗杰斯Rogers、泰康尼及PTFE特种基材微波电路。", features: ["龙岩市5G发明专利拥有量第一", "高真空等离子体活化孔壁技术", "严苛高频差分阻抗公差 ±5%"] },
      { title: "超厚铜大电流功率板", turnaround: "最高达 10 oz 超厚铜", badge: "大功率散热", color: "from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800", desc: "用于光伏逆变器、新能源汽车电机驱动与储能母排的大功率高发热厚铜电路板。", features: ["成品铜厚最高达 10 oz (350 µm)", "选用生益TG170高耐热板材", "大铜皮热平衡与散热焊盘优化"] },
      { title: "一站式 SMT 贴片与元器件代采 (PCBA)", turnaround: "整机组装调试交钥匙", badge: "一站式代工", color: "from-cyan-500/20 to-teal-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800", desc: "富士与雅马哈高速全自动贴片线，支持0201微阻容与0.3mm BGA焊接，全BOM正品一站式齐套代采。", features: ["高精高速全自动SMT贴装产线", "3D AOI 与 X-Ray BGA 焊接无损探伤", "原厂供应链配齐代采与烧录测试"] },
    ];
  }
  return [
    { title: "Quick-Turn PCB Prototype", turnaround: "24 - 48 Hours", badge: "Fast Turn", color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800", desc: "Accelerated engineering turnaround for 2 to 16 layer prototypes. Automated CAM review within 2 hours and express shipping.", features: ["2-Hour automated CAM analysis", "Standard & advanced stackups", "Flying probe 100% e-tested"] },
    { title: "High-Volume Multi-Layer Fab", turnaround: "100,000 m² / Month", badge: "Mass Production", color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800", desc: "15,000m² manufacturing capacity across 3 buildings in Wuping High-Tech Zone. Standardized lines optimized for high yield.", features: ["80k m² Multi-layer capacity", "Laser 2D barcode tracking", "Automated VCP continuous plating"] },
    { title: "Automotive Electronics (IATF 16949)", turnaround: "Certified Zero-Defect", badge: "Automotive Grade", color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800", desc: "Dedicated automotive production cells producing instrument clusters, headlight matrices, and BMS boards under IATF 16949.", features: ["IATF 16949:2016 audited", "288°C 10s × 3 thermal float", "Kelvin 4-wire resistance testing"] },
    { title: "5G High-Frequency & PTFE Boards", turnaround: "Microwave Specialty", badge: "R&D Specialty", color: "from-purple-500/20 to-violet-500/10 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800", desc: "Engineered in partnership with Shenzhen University laboratories. Specializing in low-loss PTFE Teflon substrates and Rogers.", features: ["#1 in Longyan 5G invention patents", "PTFE Teflon plasma surface treating", "Controlled impedance ±5%"] },
    { title: "Heavy Copper & Power Electronics", turnaround: "Up to 10 oz Copper", badge: "Thermal Power", color: "from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800", desc: "High-current circuit boards for solar inverters, EV motor drives, and energy storage systems requiring thick copper traces.", features: ["Up to 10 oz (350 µm) finished copper", "High TG170 thermal endurance", "Thermal relief pad optimization"] },
    { title: "Turnkey PCBA Surface Mount (SMT)", turnaround: "Full Turnkey Box Build", badge: "Turnkey SMT", color: "from-cyan-500/20 to-teal-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800", desc: "High-speed SMT placement supporting 0201 passives, 0.3mm BGA pitches, conformal coating, ICT functional testing, and turnkey BOM.", features: ["Fuji & Yamaha high-speed lines", "3D AOI & X-Ray BGA inspection", "BOM procurement & kitting"] },
  ];
}

function getFinishes(locale: string) {
  if (locale === "zh") {
    return [
      { name: "沉金工艺 (ENIG 化镍浸金)", thickness: "金: 1-3 µin / 镍: 120-240 µin", shelf: "12 个月", bestFor: "细间距 BGA 封装、铝线键合、极高焊盘平整度" },
      { name: "沉银工艺 (Immersion Silver)", thickness: "银: 6-18 µin", shelf: "6 个月", bestFor: "高频高速射频微波板与超低信号损耗微带线" },
      { name: "沉锡工艺 (Immersion Tin)", thickness: "锡: ≥ 40 µin", shelf: "6 个月", bestFor: "压接针座连接器 (Press-fit) 与高密度通信背板" },
      { name: "防氧化工艺 (OSP 有机保焊膜)", thickness: "0.2 - 0.5 µm", shelf: "6 个月", bestFor: "超平整焊盘表面与大规模消费电子贴片" },
      { name: "环保无铅喷锡 (RoHS HASL)", thickness: "1 - 40 µm", shelf: "12 个月", bestFor: "经济型通孔插件焊接与多层工业控制板" },
      { name: "电镀硬金工艺 (Hard Gold)", thickness: "金: 20-50 µin / 镍: 150-300 µin", shelf: "24+ 个月", bestFor: "金手指边缘插头与高频次插拔接触触点" },
    ];
  }
  return [
    { name: "ENIG (Electroless Nickel Immersion Gold)", thickness: "Au: 1-3 µin / Ni: 120-240 µin", shelf: "12 Months", bestFor: "Fine-pitch BGA, Al wire bonding, flat coplanarity" },
    { name: "Immersion Silver (IAg)", thickness: "Ag: 6-18 µin", shelf: "6 Months", bestFor: "High-frequency RF & low loss microstrips" },
    { name: "Immersion Tin (ISn)", thickness: "Sn: ≥ 40 µin", shelf: "6 Months", bestFor: "Press-fit connectors & backplanes" },
    { name: "OSP (Organic Solderability Preservative)", thickness: "0.2 - 0.5 µm", shelf: "6 Months", bestFor: "Ultra-flat pads & consumer electronics" },
    { name: "Lead-Free HASL (RoHS)", thickness: "1 - 40 µm", shelf: "12 Months", bestFor: "Cost-effective through-hole assembly" },
    { name: "Hard Gold Electroplating", thickness: "Au: 20-50 µin / Ni: 150-300 µin", shelf: "24+ Months", bestFor: "Edge connectors & repeated insertion keys" },
  ];
}

function getFaqs(locale: string) {
  if (locale === "zh") {
    return [
      {
        q: "为什么直接从 FT PCB 实体源头工厂下单能省去 15%-30% 的采购成本？",
        a: "贸易商和中介转包公司会在订单成本上叠加 15% 到 35% 的中间利润，沟通多由缺乏电路工程经验的普通销售层层转达，且最终仍转交第三方工厂代工。通过直接对接 FT PCB 在武平高新区的 15,000m² 现代化直营大厂，您将享受纯正的出厂批发底价、2小时内资深CAM工程师出具的专业DFM报告，彻底剔除中介贸易差价。",
      },
      {
        q: "在发送 Gerber 核心工程文件前，FT PCB 是否可以签署严格的保密协议 (NDA)？",
        a: "完全可以。我们日常与众多汽车 Tier-1、防务科研单位及前沿科技创新团队签订具备法律效力的双向保密协议 (NDA)。您的所有 Gerber、CAD 资料与商业方案均受物理隔离的内部服务器加密保护，未经授权绝不对外透露。",
      },
      {
        q: "针对高频微波或高导热散热电路设计，工厂常备哪些知名原厂板材？",
        a: "我们在武平基地设立标准化恒温覆铜板仓库，常备生益科技 (S1000-2M TG170、S1141)、建滔化工 (KB-6160)、美国罗杰斯 Rogers (RO4350B、RO4003C)、联茂 ITEQ 与 Ventec 等高等级覆铜板材。每批原材料均附带可追溯的出厂合格证与美国 UL 94V-0 (E360609) 阻燃认证档案。",
      },
      {
        q: "针对紧急研发快件，FT PCB 如何保障交货时效与发运节奏？",
        a: "我们针对双面板提供 24 小时加急交付，4-10层多层板样品 48 小时极速出厂。自主研发的云上飞天系统在 Gerber 上传后 2 小时内自动完成工程审查，车间实行三班两倒 24 小时全天候连续作业。成品经严格测试后由特约顺丰航空、DHL、FedEx 或 UPS 全程门到门快速派送。",
      },
    ];
  }
  return [
    {
      q: "How does ordering directly from FT PCB save 15-30% compared to brokers?",
      a: "Trading companies and brokers add overhead margins to PCB orders, relay communications through non-technical sales staff, and subcontract your boards to random third-party facilities. By working directly with FT PCB's 15,000m² manufacturing plant in Wuping, you receive factory-wholesale pricing, free automated DFM reviews within 2 hours, and zero middleman markups.",
    },
    {
      q: "Can FT PCB sign a Non-Disclosure Agreement (NDA) before I send Gerbers?",
      a: "Yes, absolutely. We frequently execute mutual NDAs with automotive Tier-1s, defense contractors, and technology startups before receiving any engineering documentation or CAD files. Your intellectual property is protected by strict confidentiality protocols.",
    },
    {
      q: "What raw materials do you stock for high-frequency or high-thermal designs?",
      a: "We maintain extensive stocks of high-quality laminates: Shengyi (S1000-2M TG170, S1141), Kingboard (KB-6160), Rogers (RO4350B, RO4003C), ITEQ, and Ventec. Every material batch includes verifiable Mill Test Certificates and UL 94V-0 (E360609) documentation.",
    },
    {
      q: "How are urgent quick-turn prototype orders handled?",
      a: "We offer expedited 24-hour turnaround for 2-layer boards and 48-hour builds for 4-to-10 layer prototypes. Our automated CAM software processes Gerbers within 2 hours, and our continuous 3-shift production runs 24/7. International shipping via DHL, FedEx, or UPS ensures fast worldwide delivery.",
    },
  ];
}

export default function AboutFtPcbClient() {
  const dictionary = useDictionary();
  const { locale } = useLanguage();
  const t = dictionary.aboutPage;

  const stats = getStats(locale);
  const marketDistribution = getMarketDistribution(locale);
  const certifications = getCertifications(locale);
  const dossierFacts = getDossierFacts(locale);
  const labCapabilities = getLabCapabilities(locale);
  const comparisonRows = getComparisonRows(locale);
  const servicesTiers = getServicesTiers(locale);
  const finishes = getFinishes(locale);
  const faqs = getFaqs(locale);

  const pdfDownloadUrl = "/docs/FTpcb-Company-Profile.pdf";

  return (
    <main key={locale} className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-32">
      {/* ========================================================================= */}
      {/* SECTION 0: COMMAND CENTER HERO (id="overview")                             */}
      {/* ========================================================================= */}
      <section id="overview" className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Corporate Authority */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-3.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{t?.hero.badge || "FT PCB • National Specialized 'Little Giant' • Direct Factory"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                {t?.hero.title || "FT PCB"} <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  {t?.hero.highlight || "Precision Manufacturing"}
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {t?.hero.description ||
                  "Founded in 1997, FT PCB operates a 15,000m² manufacturing campus in the Wuping High-Tech Zone. Backed by Shenzhen University doctoral R&D and 45+ in-house CAM engineers, FT PCB delivers 100,000m²/mo of precision 2L-30L PCBs, automotive IATF 16949 modules, and turnkey SMT assemblies."}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild size="lg" className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30">
                  <a href={pdfDownloadUrl} download="FT-PCB-Company-Profile.pdf">
                    <Download className="mr-2 size-5" />
                    {t?.hero.downloadPdf || "Download Profile PDF (6.9 MB)"}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <a href="#company-profile">
                    <FileText className="mr-2 size-4 text-emerald-600" />
                    {t?.hero.browseSlides || "Browse 42 Slides"}
                  </a>
                </Button>
                <Button asChild variant="secondary" size="lg" className="rounded-full px-8">
                  <Link href="/pcb-quote">{t?.hero.requestQuote || "Request Factory Quote"}</Link>
                </Button>
              </div>

              {/* Fast Trust Indicators */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>{t?.hero.camReview || "2-Hour CAM Review"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-4 text-emerald-600" />
                  <span>{t?.hero.rapidBuild || "24H - 48H Rapid Build"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>{t?.hero.iatfStandard || "IATF 16949 Certified"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="size-4 text-emerald-600" />
                  <span>{t?.hero.directFactory || "Direct Source Factory"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Circuit Network & Dossier Card */}
            <div className="lg:col-span-5">
              <AboutHeroInteractiveCard pdfDownloadUrl={pdfDownloadUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* Verified Factory Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={i}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg hover:shadow-xl transition-all space-y-1 text-center group"
              >
                <div className="size-8 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <Icon className="size-4" />
                </div>
                <div className="text-xl font-black font-mono text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {stat.label}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {stat.sub}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Market Distribution & Certifications Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Market Sectors */}
          <Card className="lg:col-span-6 p-6 sm:p-8 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {locale === "zh" ? "多元化行业客户群" : "Diversified Client Portfolio"}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {locale === "zh" ? "目标市场行业分布" : "Target Market Distribution"}
              </h3>
            </div>
            <div className="space-y-3">
              {marketDistribution.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{m.name}</span>
                    <span className="font-mono text-slate-900 dark:text-white">{m.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quality Certifications Grid */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {certifications.map((cert, idx) => (
              <Card
                key={idx}
                className="p-5 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {cert.badge}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{cert.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{cert.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: COMPANY PROFILE & 42-SLIDE MONOGRAPH (id="company-profile")     */}
      {/* ========================================================================= */}
      <section id="company-profile" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* Section Header */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl mb-12 border border-blue-900/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-blue-300">
                <Award className="size-3.5 text-blue-400" />
                <span>{t?.section1.badge || "Section 01 • Executive Monograph & Archive"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                {t?.section1.title || "Official FT PCB Profile & 28-Year Chronology"}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t?.section1.description ||
                  "Review our complete corporate dossier, 28-year timeline from 1997 to 2026, and all 42 slides of the official company presentation with high-resolution slide inspection."}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black shadow-lg">
              <a href={pdfDownloadUrl} download="FT-PCB-Company-Profile.pdf">
                <Download className="mr-2 size-4" /> {t?.section1.downloadBtn || "Download 42 Slides PDF"}
              </a>
            </Button>
          </div>
        </div>

        {/* 28-Year Historical Timeline */}
        <div className="mb-16">
          <CorporateHistoryTimeline />
        </div>

        {/* The 42-Slide Interactive PDF Reader */}
        <div className="mb-16">
          <CompanyProfilePdfViewer />
        </div>

        {/* Official Due Diligence Registration Table */}
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t?.section1.dossierTitle || "Corporate Due Diligence & Registration Record"}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {t?.section1.dossierBadge || (locale === "zh" ? "国家专精特新“小巨人”企业" : "Little Giant Certified")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dossierFacts.map((fact, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-500 dark:text-slate-400 w-1/3 text-xs sm:text-sm">
                      {fact.label}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {fact.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: ACADEMIC PEDIGREE & EXECUTIVE TEAM (id="executive-team")        */}
      {/* ========================================================================= */}
      <section id="executive-team" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* Section Header */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 p-8 sm:p-12 text-white shadow-xl mb-12 border border-purple-900/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-purple-300">
                <GraduationCap className="size-3.5 text-purple-400" />
                <span>{t?.section2.badge || "Section 02 • Academic R&D & Executive Board"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                {t?.section2.title || "The Engineering Minds Behind FT PCB"}
              </h2>
              <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
                {t?.section2.description ||
                  "Founded by Prof. Chen Jingqiu (Doctor of Engineering, Shenzhen University). Explore the FT PCB executive board, 30+ invention patents, and the Shenzhen University Joint Microwave Laboratory."}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 bg-purple-500 hover:bg-purple-400 text-white font-black shadow-lg">
              <Link href="/contact">{t?.section2.connectBtn || "Connect with CAM Board"}</Link>
            </Button>
          </div>
        </div>

        {/* Master-Detail Interactive Leadership Spotlight */}
        <div className="mb-16">
          <LeadershipSpotlight />
        </div>

        {/* Shenzhen University Joint R&D Laboratory Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {labCapabilities.map((lab, i) => {
            const Icon = lab.icon;
            return (
              <Card
                key={i}
                className="p-6 rounded-3xl border border-purple-100 dark:border-purple-950/60 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {lab.metric}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lab.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lab.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: CORE ADVANTAGES & 3D WEBGL LAB (id="core-advantages")           */}
      {/* ========================================================================= */}
      <section id="core-advantages" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* Section Header */}
        <div className="rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-cyan-950 p-8 sm:p-12 text-white shadow-xl mb-12 border border-teal-900/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-teal-300">
                <Zap className="size-3.5 text-teal-400" />
                <span>{t?.section3.badge || "Section 03 • Technical Benchmarks & 3D Lab"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                {t?.section3.title || "FT PCB Core Advantages & Interactive 3D Inspection"}
              </h2>
              <p className="text-teal-200 text-sm sm:text-base leading-relaxed">
                {t?.section3.description ||
                  "Inspect multi-layer solder mask finishes, SMT components, and internal traces in our real-time Three.js WebGL laboratory, then review our head-to-head engineering comparison."}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black shadow-lg">
              <Link href="/pcb-quote">{t?.section3.dfmBtn || "Request DFM Review"}</Link>
            </Button>
          </div>
        </div>

        {/* 3D WebGL PCB Inspector (Front and Center) */}
        <div className="max-w-4xl mx-auto mb-16">
          <AboutPcb3DViewer />
        </div>

        {/* Head-to-Head Rigorous Benchmark Table */}
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden mb-16">
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-teal-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t?.section3.tableTitle || "Head-to-Head Technical Benchmark: FT PCB vs. Ordinary PCB Brokers"}
              </span>
            </div>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
              {t?.section3.tableBadge || "Audited Standards"}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300 w-1/3">
                    {t?.section3.colParameter || "Engineering Parameter"}
                  </th>
                  <th className="py-3 px-6 font-bold text-teal-600 dark:text-teal-400 w-1/3 bg-teal-50/40 dark:bg-teal-950/20">
                    {t?.section3.colDirectFactory || "FT PCB (Direct Factory)"}
                  </th>
                  <th className="py-3 px-6 font-bold text-slate-500 dark:text-slate-400 w-1/3">
                    {t?.section3.colBroker || "Standard Broker / Prototype Shop"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-6 bg-teal-50/20 dark:bg-teal-950/10 font-semibold text-teal-800 dark:text-teal-200 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-teal-600 shrink-0" />
                        <span>{row.feitian}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      <span>{row.standard}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: TURNKEY SERVICES & MANUFACTURING PIPELINE (id="turnkey-services")*/}
      {/* ========================================================================= */}
      <section id="turnkey-services" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* Section Header */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 p-8 sm:p-12 text-white shadow-xl mb-12 border border-amber-900/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                <Factory className="size-3.5 text-amber-400" />
                <span>{t?.section4.badge || "Section 04 • Turnkey Manufacturing Conveyor"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                {t?.section4.title || "FT PCB 7-Stage Precision Manufacturing Pipeline"}
              </h2>
              <p className="text-amber-200 text-sm sm:text-base leading-relaxed">
                {t?.section4.description ||
                  "Click through each automated station from Gerber ingestion and laser direct imaging to continuous VCP plating, optical AVI scanning, and 4-wire Kelvin continuity testing."}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg">
              <Link href="/pcb-quote">{t?.section4.quoteBtn || "Quote Turnkey PCBA"}</Link>
            </Button>
          </div>
        </div>

        {/* 7-Stage Horizontal Conveyor */}
        <div className="mb-16">
          <ManufacturingPipelineStepper />
        </div>

        {/* Turnkey Service Capability Tiers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {servicesTiers.map((srv, i) => (
            <Card
              key={i}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border bg-gradient-to-r ${srv.color}`}>
                    {srv.badge}
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="size-3.5" /> {srv.turnaround}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{srv.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  {srv.features.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="size-3.5 text-amber-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button asChild variant="outline" size="sm" className="w-full rounded-full cursor-pointer">
                  <Link href="/pcb-quote">
                    {locale === "zh" ? "获取此项服务报价" : "Quote This Service"}{" "}
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Surface Metallurgy Matrix */}
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden mb-16">
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t?.section4.surfaceFinishesTitle || "Available PCB Surface Finishes & Thickness Specs"}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300">
                    {locale === "zh" ? "表面处理工艺" : "Finish Name"}
                  </th>
                  <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300">
                    {locale === "zh" ? "工艺镀层厚度" : "Plating Thickness"}
                  </th>
                  <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300">
                    {locale === "zh" ? "保质期限" : "Shelf Life"}
                  </th>
                  <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300">
                    {locale === "zh" ? "最佳推荐应用场景" : "Best Applications"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {finishes.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-6 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{f.name}</td>
                    <td className="py-3 px-6 font-mono text-xs text-slate-600 dark:text-slate-400">{f.thickness}</td>
                    <td className="py-3 px-6 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{f.shelf}</td>
                    <td className="py-3 px-6 text-xs text-slate-600 dark:text-slate-400">{f.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Electronics Business Scope (PCB Design & Prototyping, Device Repair, Component Sourcing, Embedded Systems) */}
        <div className="mt-8">
          <ElectronicsBusinessScope />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: CAMPUS TOUR & MACHINERY SCANNER (id="factory-tour")            */}
      {/* ========================================================================= */}
      <section id="factory-tour" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Building2 className="size-3.5" /> {t?.section5.badge || "15,000m² Wuping Production Campus"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t?.section5.title || "FT PCB Virtual Factory Tour & Machinery Park"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {t?.section5.description ||
              "Take a self-guided walkthrough of Building 1, 2, and 3, and inspect our automated VCP plating, high-speed CNC drilling, and Class 10,000 cleanroom equipment with real scanning reticles."}
          </p>
        </div>

        {/* Virtual Campus Tour */}
        <div className="mb-16">
          <VirtualFactoryTour />
        </div>

        {/* Machinery Gallery with Scanlines */}
        <div className="mb-16">
          <InteractiveEquipmentGallery />
        </div>

        {/* Process Capabilities Tolerance Search */}
        <div className="mb-16">
          <InteractiveProcessCapabilities />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: WHY CHOOSE US & COST CALCULATOR (id="why-choose-us")             */}
      {/* ========================================================================= */}
      <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* Section Header */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-8 sm:p-12 text-white shadow-xl mb-12 border border-emerald-900/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>{t?.section6.badge || "Section 05 • Direct Factory Trust & Warranties"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                {t?.section6.title || "Why Hardware Teams Choose FT PCB Directly"}
              </h2>
              <p className="text-emerald-200 text-sm sm:text-base leading-relaxed">
                {t?.section6.description ||
                  "Eliminate the 15% - 35% middleman broker surcharge. Use our interactive volume calculator to calculate direct factory savings and review our 3 Ironclad Warranties."}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg">
              <Link href="/pcb-quote">{t?.section6.lockRatesBtn || "Lock In Direct Rates"}</Link>
            </Button>
          </div>
        </div>

        {/* Interactive Volume Savings Calculator & 3 Guarantees */}
        <div className="mb-16">
          <CostComparisonVisualizer />
        </div>

        {/* Hardware Engineer FAQs */}
        <div className="max-w-4xl mx-auto mb-16 space-y-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {t?.section6.faqTitle || "Frequently Asked Questions from Hardware Engineers"}
            </h3>
          </div>
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
            >
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: GLOBAL CASE STUDIES & CLIENT REVIEWS (id="client-reviews")       */}
      {/* ========================================================================= */}
      <section id="client-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* Section Header */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 p-8 sm:p-12 text-white shadow-xl mb-12 border border-sky-900/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-sky-300">
                <Globe2 className="size-3.5 text-sky-400" />
                <span>{t?.section7.badge || "Section 06 • Global Case Studies & Reviews"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                {t?.section7.title || "FT PCB Worldwide Engineering Case Studies"}
              </h2>
              <p className="text-sky-200 text-sm sm:text-base leading-relaxed">
                {t?.section7.description ||
                  "Inspect actual engineering case studies from Germany (Automotive LED), USA (6 oz Heavy Copper), Japan (Ku-Band PTFE), Sweden (48h Prototypes), and France (Turnkey SMT)."}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8 bg-sky-400 hover:bg-sky-300 text-slate-950 font-black shadow-lg">
              <Link href="/pcb-quote">{t?.section7.startProjectBtn || "Start Your Project"}</Link>
            </Button>
          </div>
        </div>

        {/* Interactive World Case Studies Map */}
        <div className="mb-16">
          <GlobalCaseStudiesMap />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* GRAND FINALE FACTORY CTA                                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 p-8 sm:p-14 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 size-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-black text-emerald-300">
              <Cpu className="size-3.5" />
              <span>{t?.cta.badge || "Direct Factory Turnaround • 2-Hour Free DFM Review"}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t?.cta.title || "Ready to Build Your Circuits at Source Factory Rates?"}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {t?.cta.description ||
                "Upload your Gerber files or contact our engineering team directly. You will receive an official quotation and detailed CAM DFM analysis within 2 hours."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild size="lg" className="rounded-full px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30 text-base">
                <Link href="/pcb-quote">
                  {t?.cta.uploadBtn || "Upload Gerber Files Now"} <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-white/20 bg-white/10 hover:bg-white/20 text-white">
                <a href={pdfDownloadUrl} download="FT-PCB-Company-Profile.pdf">
                  <Download className="mr-2 size-4" /> {t?.cta.downloadBtn || "Download Company PDF"}
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full px-6 text-slate-300 hover:text-white hover:bg-slate-800">
                <Link href="/contact">{t?.cta.contactBtn || "Contact CAM Engineers"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
