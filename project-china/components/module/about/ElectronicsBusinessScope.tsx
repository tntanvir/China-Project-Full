"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  Wrench,
  Boxes,
  Microchip,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  Maximize2,
  X,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Search,
  Check,
  Clock,
  Award,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Microscope,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface BusinessScopeItem {
  id: string;
  category: "design" | "testing" | "materials" | "hdi";
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  fullDescEn: string;
  fullDescZh: string;
  capabilitiesEn: string[];
  capabilitiesZh: string[];
  specsEn: string[];
  specsZh: string[];
  placeholderText: string;
  placeholderUrl: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  tagEn: string;
  tagZh: string;
}

export const BUSINESS_SCOPE_ITEMS: BusinessScopeItem[] = [
  {
    id: "pcb-design",
    category: "design",
    titleEn: "PCB Design & Prototyping",
    titleZh: "PCB 设计与快速打样",
    descEn: "custom circuit boards, schematics, and layout prototypes",
    descZh: "定制电路板设计、电路原理图绘制与高精多层布线打样",
    fullDescEn:
      "End-to-end bare PCB engineering and rapid turnaround prototyping from schematic capture to precision fabrication. Specializing in high-density multi-layer bare boards, controlled impedance routing, laser microvias, and quick-turn precision manufacturing.",
    fullDescZh:
      "从电路原理图绘制到高精多层裸板布线与极速工程打样。精研差分阻抗控制、高频射频微波板与 HDI 盲埋孔叠层裸板制造。",
    capabilitiesEn: [
      "Bare PCB Schematic Capture & DRC Rules",
      "High-Speed Differential Impedance Routing (±5%)",
      "2 to 32 Layer Bare PCB Stackup Modeling",
      "24H - 48H Quick-Turn Bare Board Prototype Turnaround",
    ],
    capabilitiesZh: [
      "裸板原理图设计与高频布线规则检查",
      "高速差分阻抗精确布线与仿真 (±5%)",
      "2 至 32 层高密度多层裸板叠层建模",
      "24-48 小时加急工程裸板极速交付",
    ],
    specsEn: ["Layers: 1-32L Rigid FR4", "Min Trace: 3/3 mil", "Impedance: ±5%", "Turnaround: 24H-48H"],
    specsZh: ["板层范围: 1-32层刚性FR4", "最小线宽线距: 3/3 mil", "特性阻抗: ±5%", "加急交期: 24-48小时"],
    placeholderText: "PCB+Design+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=Bare+PCB+Design+Photo",
    imageUrl: "/images/generated/rigid_pcb.png",
    icon: Layers,
    tagEn: "Bare PCB Prototyping",
    tagZh: "裸板设计与工程打样",
  },
  {
    id: "device-repair",
    category: "testing",
    titleEn: "PCB Quality Diagnostics & E-Testing",
    titleZh: "裸板电气测试与高精飞针诊断",
    descEn: "bare board flying-probe testing, netlist continuity, and isolation",
    descZh: "裸板飞针电测、网表通断率检测与高阻抗开短路隔离诊断",
    fullDescEn:
      "Comprehensive bare PCB electrical testing bench capabilities covering IPC Class 2/3 netlist verification, dual-sided flying probe isolation testing, 4-wire Kelvin micro-resistance measurement, and thermal stress impedance validation.",
    fullDescZh:
      "配备工业级裸板电气测试中心，覆盖 IPC Class 2/3 网表电气连续性检测、双面高速飞针开短路测试、四线开尔文微欧姆测量及热应力阻抗一致性验证。",
    capabilitiesEn: [
      "100% Netlist Flying-Probe Continuity Testing",
      "4-Wire Kelvin Micro-Ohm Via Resistance Measurement",
      "High-Voltage Spark & Hi-Pot Isolation Testing",
      "TDR Impedance Coupon Polar Analysis (±5%)",
    ],
    capabilitiesZh: [
      "100% 网表高速飞针连续性与通断测试",
      "四线开尔文微电阻孔铜导通测量",
      "高压火花与耐压击穿绝缘测试",
      "Polar CITS TDR 阻抗测试条精准分析 (±5%)",
    ],
    specsEn: ["100% E-Tested", "Hi-Pot: 250V-500V", "4-Wire Kelvin Via Test", "Standard: IPC-6012 Class 3"],
    specsZh: ["100% 网表通断测试", "高压绝缘: 250V-500V", "四线开尔文微欧姆测量", "验收规范: IPC-6012 Class 3"],
    placeholderText: "PCB+Testing+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=Bare+PCB+Testing+Photo",
    imageUrl: "/images/categories/pcb-manufacture/testing-1.jpg",
    icon: Wrench,
    tagEn: "Bare Board Inspection & E-Test",
    tagZh: "裸板电测与出厂品控",
  },
  {
    id: "component-sourcing",
    category: "materials",
    titleEn: "Specialty Laminates & High-Tg Raw Materials",
    titleZh: "高频特殊覆铜基板与高精铜箔配套",
    descEn: "Shengyi, Rogers, Panasonic Megtron, aluminum core, and high-Tg substrates",
    descZh: "生益高Tg基材、罗杰斯高频板材、松下极低损耗板材与导热金属基板配套",
    fullDescEn:
      "Direct certified sourcing of premium Copper Clad Laminates (CCL), prepregs, and specialized dielectric materials. Authorized partnerships with Shengyi (S1000-2M), Rogers (RO4350B, RO4003C), Panasonic (Megtron 6), and Bergquist thermal metal substrates.",
    fullDescZh:
      "直联全球顶级覆铜板（CCL）与半固化片（PP）原厂。长期现货备库生益科技（S1000-2M、IT-180A）、罗杰斯（RO4350B、RO4003C）、松下（Megtron 6）及贝格斯高导热金属基材。",
    capabilitiesEn: [
      "Authentic Shengyi High-Tg S1000-2M & Rogers RF Materials",
      "Polyimide (PI) Film for Dynamic Flexible Circuits",
      "Heavy Copper Substrates up to 12oz (420µm)",
      "Strict Traceability with Factory Material Certificates (COC)",
    ],
    capabilitiesZh: [
      "生益科技高Tg、罗杰斯高频高导热正品基板直供",
      "高弯折无胶聚酰亚胺 (PI) 柔性电路基膜",
      "特种厚铜基板 (最高支持 12oz/420µm)",
      "全流程出厂原厂材质质量保证书 (COC)",
    ],
    specsEn: ["CCL: Shengyi S1000-2M", "RF: Rogers 4350B/4003C", "Copper: 1/3oz - 12oz", "Certification: 100% COC"],
    specsZh: ["主流覆铜板: 生益 S1000-2M", "射频板材: 罗杰斯 4350B/4003C", "铜厚范围: 1/3oz - 12oz", "品质溯源: 100% 原厂COC"],
    placeholderText: "PCB+Materials+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=Bare+PCB+Materials+Photo",
    imageUrl: "/images/generated/pcb2.png",
    icon: Boxes,
    tagEn: "Bare PCB Substrates & CCL",
    tagZh: "高精裸板基材与覆铜板",
  },
  {
    id: "embedded-systems",
    category: "hdi",
    titleEn: "HDI & Flexible PCB Engineering",
    titleZh: "HDI 高密度互联与柔性/刚柔结合板研发",
    descEn: "any-layer HDI, laser microvias, and dynamic flex substrates",
    descZh: "任意阶HDI盲埋孔板、激光微孔工艺与高耐折柔性电路板研发",
    fullDescEn:
      "Cutting-edge bare circuit board manufacturing specializing in Any-Layer HDI (1+N+1 to 4+N+4), stacked laser microvias, ultra-thin flexible circuits (FPC), and rigid-flex board integration engineered for automotive electronics and aerospace telemetry.",
    fullDescZh:
      "专业制造任意层高密度互联（Any-Layer HDI）、激光叠孔微孔工艺、超薄高频柔性印制板（FPC）及刚柔结合板，专为汽车电子及高精传感器研发设计。",
    capabilitiesEn: [
      "Any-Layer HDI (up to 4-Stage Laser Microvias)",
      "Dynamic Bending FPC & Rigid-Flex Boards",
      "Controlled Impedance on Ultra-Thin Dielectrics",
      "Halogen-Free & Lead-Free RoHS / REACH Compliance",
    ],
    capabilitiesZh: [
      "任意阶 HDI 激光盲埋孔与叠孔工艺",
      "动态耐弯折纯柔性板与刚柔结合一体板",
      "超薄介质层高精度特性阻抗公差控制",
      "全系列无卤素环保工艺，符合 RoHS / REACH",
    ],
    specsEn: ["Any-Layer HDI 1-4 Stage", "Min Microvia: 0.10mm Laser", "Flex Layers: 1-8L PI", "Dynamic Bend: >100k Cycles"],
    specsZh: ["任意阶HDI: 1-4阶激光叠孔", "微盲孔径: 0.10mm", "柔性层数: 1-8层聚酰亚胺", "弯折寿命: >10万次"],
    placeholderText: "HDI+Flex+PCB+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=Bare+Flex+PCB+Photo",
    imageUrl: "/images/generated/flexible_pcb.png",
    icon: Microchip,
    tagEn: "HDI & Flex Bare Circuit Boards",
    tagZh: "HDI与柔性裸板研发",
  },
];

export default function ElectronicsBusinessScope() {
  const { locale } = useLanguage();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeImage, setActiveImage] = useState<BusinessScopeItem | null>(null);

  const isZh = locale === "zh";

  // Prevent background scrolling when image lightbox modal is open
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  // Filter items by category tab and live search keyword
  const filteredItems = useMemo(() => {
    return BUSINESS_SCOPE_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = item.titleEn.toLowerCase().includes(q) || item.titleZh.includes(q);
      const descMatch = item.descEn.toLowerCase().includes(q) || item.descZh.includes(q);
      const capMatch = (isZh ? item.capabilitiesZh : item.capabilitiesEn).some((c) =>
        c.toLowerCase().includes(q)
      );
      return titleMatch || descMatch || capMatch;
    });
  }, [activeCategory, searchQuery, isZh]);

  const categories = [
    { id: "all", labelEn: "All Scope Pillars (4)", labelZh: "全范围业务 (4)" },
    { id: "design", labelEn: "PCB Prototyping", labelZh: "电路设计打样" },
    { id: "testing", labelEn: "Quality Diagnostics", labelZh: "飞针电测质检" },
    { id: "materials", labelEn: "Specialty CCL", labelZh: "高频板材覆铜" },
    { id: "hdi", labelEn: "HDI & Flexible", labelZh: "HDI与柔性印制" },
  ];

  return (
    <section id="business-scope" className="scroll-mt-28 py-10 sm:py-16 w-full min-w-0">
      
      {/* ---------------- 1. Section Header & Quick Stats Strip ---------------- */}
      <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6 border-b border-slate-200 dark:border-slate-800 pb-6 sm:pb-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3 max-w-3xl min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 sm:px-3.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-400 shadow-2xs">
              <Boxes className="size-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">
                {isZh ? "飞天电子 • 官方业务经营范围" : "FT Company • Official Business Scope"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {isZh ? "电子业务经营范围" : "Electronics Business Scope"}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              {isZh
                ? "武平飞天电子科技依托28年实体制造与研发积累，为全球客户提供覆盖电路设计打样、板级检修诊断、特殊覆铜板材及高频柔性电路的全生命周期裸板硬件服务。"
                : "Leveraging 28 years of precision manufacturing and R&D engineering, FT Company provides comprehensive electronics solutions from initial PCB design and diagnostics to genuine high-frequency CCL laminates and dynamic flex circuits."}
            </p>
          </div>

          {/* View Mode Switcher: Desktop & Mobile 50/50 Button Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                viewMode === "table"
                  ? "bg-emerald-600 text-white font-black shadow-xs ring-1 ring-emerald-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TableIcon className="size-3.5 shrink-0" />
              <span>{isZh ? "原版对照表格" : "Official Table View"}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                viewMode === "cards"
                  ? "bg-emerald-600 text-white font-black shadow-xs ring-1 ring-emerald-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="size-3.5 shrink-0" />
              <span>{isZh ? "对侧交互卡片" : "Opposite Split View"}</span>
            </button>
          </div>
        </div>

        {/* 4 Core Verification Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
          <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-2 sm:p-2.5 shadow-2xs min-w-0">
            <div className="size-7 sm:size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="size-3.5 sm:size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">{isZh ? "实业经验" : "Experience"}</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">28+ {isZh ? "年实体制造" : "Years"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-2 sm:p-2.5 shadow-2xs min-w-0">
            <div className="size-7 sm:size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layers className="size-3.5 sm:size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">{isZh ? "层数范围" : "Stackup"}</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">1-32 {isZh ? "层高密度板" : "Layers"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-2 sm:p-2.5 shadow-2xs min-w-0">
            <div className="size-7 sm:size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Microscope className="size-3.5 sm:size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">{isZh ? "电气测试" : "Testing"}</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">100% {isZh ? "网表飞针电测" : "Netlist E-Test"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-2 sm:p-2.5 shadow-2xs min-w-0">
            <div className="size-7 sm:size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="size-3.5 sm:size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase truncate">{isZh ? "月度产能" : "Capacity"}</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">100,000 m² {isZh ? "/月" : "/Mo"}</div>
            </div>
          </div>
        </div>

        {/* Interactive Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 pt-1">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 min-w-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-lg px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
                }`}
              >
                {isZh ? cat.labelZh : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isZh ? "快速检索经营范围与工艺..." : "Search scope or capabilities..."}
              className="h-8.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ---------------- 2. TABLE VIEW: DESKTOP TABULAR + MOBILE ADAPTIVE CARDS ---------------- */}
      {viewMode === "table" && (
        <div className="w-full min-w-0 space-y-4">
          
          {/* A. DESKTOP TABULAR VIEW (>= md): Authentic Side-by-Side Verification Matrix */}
          <Card className="hidden md:block rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-950/80">
                    <th className="py-4 px-6 text-sm lg:text-base font-black text-slate-900 dark:text-white w-7/12 border-r border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-emerald-500" />
                        <span>{isZh ? "电子业务经营范围 (Electronics Business Scope)" : "Electronics Business Scope"}</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-sm lg:text-base font-black text-slate-900 dark:text-white w-5/12">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="size-4 text-emerald-500" />
                        <span>{isZh ? "对侧对应实景配图 (Picture on the Opposite Side)" : "Picture on the Opposite Side"}</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-emerald-50/30 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Left Column: Scope Name, Description, Specs & Capabilities */}
                        <td className="py-5 px-6 align-top border-r border-slate-200 dark:border-slate-800">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2.5">
                              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                                <Icon className="size-5" />
                              </span>
                              <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                  {isZh ? `${item.titleEn} (${item.titleZh})` : item.titleEn}
                                </h3>
                                <span className="text-[10.5px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  {isZh ? item.tagZh : item.tagEn}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed pl-1">
                              <strong className="text-slate-900 dark:text-white">{item.titleEn} – </strong>
                              {item.descEn}
                            </p>

                            {isZh && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 pl-1 leading-normal">
                                {item.descZh}
                              </p>
                            )}

                            {/* Engineering Tech Specs Grid */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1 pl-1">
                              {(isZh ? item.specsZh : item.specsEn).map((sp, si) => (
                                <div key={si} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="truncate">{sp}</span>
                                </div>
                              ))}
                            </div>

                            {/* Quick capability tags */}
                            <div className="pt-2 flex flex-wrap gap-1.5 pl-1">
                              {(isZh ? item.capabilitiesZh : item.capabilitiesEn).map((cap, ci) => (
                                <span
                                  key={ci}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                >
                                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span>{cap}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Right Column: Picture on the Opposite Side with Spec Header & Actions */}
                        <td className="py-5 px-6 align-middle">
                          <div className="space-y-2.5 max-w-sm mx-auto">
                            {/* Interactive Image Container */}
                            <div
                              onClick={() => setActiveImage(item)}
                              className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-md group/img cursor-pointer aspect-[16/11]"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.titleEn}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = item.placeholderUrl;
                                }}
                              />

                              {/* Technical Optical Baseline Reference Badge */}
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-emerald-300 font-bold border border-emerald-500/30">
                                320 × 220 Baseline
                              </div>

                              {/* Hover overlay hint */}
                              <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                <Maximize2 className="size-4 text-emerald-400" />
                                <span>{isZh ? "点击全屏查看" : "Click to Enlarge"}</span>
                              </div>
                            </div>

                            {/* Image Verification Footer & Direct Action Link */}
                            <div className="flex items-center justify-between gap-2 px-1">
                              <button
                                type="button"
                                onClick={() => setActiveImage(item)}
                                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="size-3" />
                                <span>{isZh ? "查看实景原图" : "Inspect Photo"}</span>
                              </button>

                              <Button
                                asChild
                                size="sm"
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-2.5 shadow-sm shadow-emerald-600/20"
                              >
                                <Link href="/pcb-quote">
                                  <span>{isZh ? "获取此项报价" : "Quote"}</span>
                                  <ArrowRight className="size-3 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* B. MOBILE ADAPTIVE VIEW (< md): Touch-Friendly Structured Stacked Cards */}
          <div className="block md:hidden space-y-4">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-3.5 w-full min-w-0"
                >
                  {/* Card Header & Scope Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {isZh ? item.titleZh : item.titleEn}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                          {isZh ? item.tagZh : item.tagEn}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      IPC-A-600
                    </span>
                  </div>

                  {/* Primary Description */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.titleEn} – </strong>
                    {item.descEn}
                  </p>

                  {/* Picture on the Opposite Side (Mobile aspect) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="size-3 text-emerald-500" />
                        {isZh ? "对侧对应实景配图" : "Picture on the Opposite Side"}
                      </span>
                      <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">320 × 220</span>
                    </div>

                    <div
                      onClick={() => setActiveImage(item)}
                      className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs aspect-[16/10] cursor-pointer"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.titleEn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = item.placeholderUrl;
                        }}
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] text-white font-bold flex items-center gap-1">
                        <Maximize2 className="size-3 text-emerald-400" />
                        <span>{isZh ? "放大" : "Zoom"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Capabilities Chips */}
                  <div className="pt-1 flex flex-wrap gap-1">
                    {(isZh ? item.capabilitiesZh : item.capabilitiesEn).map((cap, ci) => (
                      <span
                        key={ci}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                      >
                        <CheckCircle2 className="size-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{cap}</span>
                      </span>
                    ))}
                  </div>

                  {/* Action Button Row */}
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      asChild
                      className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs h-8 shadow-xs shadow-emerald-600/20"
                    >
                      <Link href="/pcb-quote" className="inline-flex items-center justify-center">
                        <span>{isZh ? "获取工程报价" : "Quote Now"}</span>
                        <ArrowRight className="size-3 ml-1" />
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveImage(item)}
                      className="flex-1 rounded-xl text-xs h-8 font-bold border-slate-200 dark:border-slate-700"
                    >
                      <Eye className="size-3 mr-1" />
                      <span>{isZh ? "实景图" : "View Photo"}</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      )}

      {/* ---------------- 3. SPLIT OPPOSITE CARDS VIEW: ALTERNATING HIGH-TECH PANELS ---------------- */}
      {viewMode === "cards" && (
        <div className="space-y-6 sm:space-y-8 w-full min-w-0">
          {filteredItems.map((item, idx) => {
            const Icon = item.icon;
            const isEven = idx % 2 === 0;

            return (
              <Card
                key={item.id}
                className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all hover:shadow-2xl w-full min-w-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full min-w-0">
                  
                  {/* Text Column (7 Cols on desktop, order-1 on even, order-2 on odd) */}
                  <div className={`space-y-3.5 sm:space-y-4 min-w-0 ${isEven ? "lg:col-span-7 lg:order-1" : "lg:col-span-7 lg:order-2"}`}>
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      <Icon className="size-3.5 shrink-0" />
                      <span className="truncate">{isZh ? item.tagZh : item.tagEn}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                      {isZh ? `${item.titleEn} (${item.titleZh})` : item.titleEn}
                    </h3>

                    <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.titleEn} –{" "}
                      </span>
                      {item.descEn}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isZh ? item.fullDescZh : item.fullDescEn}
                    </p>

                    {/* Engineering Specs Matrix */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {(isZh ? item.specsZh : item.specsEn).map((sp, si) => (
                        <div key={si} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                          <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">{sp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Feature bullets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {(isZh ? item.capabilitiesZh : item.capabilitiesEn).map((cap, ci) => (
                        <div
                          key={ci}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <Button asChild className="w-full sm:w-auto rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md shadow-emerald-600/20 text-xs sm:text-sm">
                        <Link href="/pcb-quote" className="inline-flex items-center justify-center">
                          <span>{isZh ? "获取工程报价" : "Request Engineering Quote"}</span>
                          <ArrowRight className="size-4 ml-1.5" />
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveImage(item)}
                        className="w-full sm:w-auto rounded-full text-xs font-bold border-slate-200 dark:border-slate-700"
                      >
                        <Maximize2 className="size-3.5 mr-1.5 text-emerald-500" />
                        <span>{isZh ? "查看实景高清图" : "View Photo (Opposite Side)"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Picture on the Opposite Side (5 Cols on desktop, order-2 on even, order-1 on odd) */}
                  <div className={`space-y-2 min-w-0 ${isEven ? "lg:col-span-5 lg:order-2" : "lg:col-span-5 lg:order-1"}`}>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3 text-emerald-500" />
                        <span>{isZh ? "对侧对应实景配图" : "Picture on the Opposite Side"}</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">320 × 220 Baseline</span>
                    </div>

                    <div
                      onClick={() => setActiveImage(item)}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xl group cursor-pointer aspect-[16/11]"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = item.placeholderUrl;
                        }}
                      />

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-emerald-300 font-bold border border-emerald-500/40">
                        {item.placeholderText}
                      </div>

                      <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <Maximize2 className="size-4 text-emerald-400" />
                        <span>{isZh ? "点击放大查看" : "Click to Expand"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
                      <span className="truncate">CAM Optical Micrograph</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Verified</span>
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ---------------- 4. High-Resolution Image Lightbox Modal ---------------- */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="min-w-0">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                  {isZh ? `${activeImage.titleEn} (${activeImage.titleZh})` : activeImage.titleEn}
                </h4>
                <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                  {isZh ? activeImage.tagZh : activeImage.tagEn} • CAM Physical Verification
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* High-res Image View */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[16/10] max-h-[58vh] flex items-center justify-center">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.titleEn}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = activeImage.placeholderUrl;
                }}
              />
            </div>

            {/* Modal Specs & Description */}
            <div className="space-y-3 pt-1">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {isZh ? activeImage.fullDescZh : activeImage.fullDescEn}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(isZh ? activeImage.specsZh : activeImage.specsEn).map((sp, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-[10.5px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {sp}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Strict Factory NDA • Guaranteed Production Quality</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveImage(null)}
                  className="flex-1 sm:flex-initial rounded-full text-xs"
                >
                  {isZh ? "关闭" : "Close"}
                </Button>
                <Button asChild className="flex-1 sm:flex-initial rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/20">
                  <Link href="/pcb-quote">
                    <span>{isZh ? "询价此项业务" : "Inquire This Scope"}</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
