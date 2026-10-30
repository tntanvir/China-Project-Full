"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface CapabilityItem {
  spec: string;
  category: "layers" | "traces" | "drilling" | "finishes" | "materials";
  standard: string;
  advanced: string;
  unit?: string;
  isPrecision?: boolean;
}

const CAPABILITIES_EN: CapabilityItem[] = [
  {
    spec: "Layer Count",
    category: "layers",
    standard: "2 - 16 Layers",
    advanced: "Up to 30 Layers",
    isPrecision: true,
  },
  {
    spec: "Min Line Width / Space (Inner)",
    category: "traces",
    standard: "3 / 3 mil (0.075 mm)",
    advanced: "2 / 2 mil (0.05 mm)",
    isPrecision: true,
  },
  {
    spec: "Min Line Width / Space (Outer)",
    category: "traces",
    standard: "3.5 / 3.5 mil (0.09 mm)",
    advanced: "2.5 / 2.5 mil (0.065 mm)",
    isPrecision: true,
  },
  {
    spec: "Min Mechanical Hole Diameter",
    category: "drilling",
    standard: "10 mil (0.25 mm)",
    advanced: "8 mil (0.20 mm)",
    isPrecision: true,
  },
  {
    spec: "Laser Microvia Diameter",
    category: "drilling",
    standard: "6 mil (0.15 mm)",
    advanced: "4 mil (0.10 mm)",
    isPrecision: true,
  },
  {
    spec: "Drilling Aspect Ratio",
    category: "drilling",
    standard: "8 : 1",
    advanced: "12 : 1",
    isPrecision: true,
  },
  {
    spec: "Max Panel Dimensions",
    category: "layers",
    standard: "457 × 610 mm (18\" × 24\")",
    advanced: "508 × 610 mm (20\" × 24\")",
  },
  {
    spec: "Finished Board Thickness",
    category: "layers",
    standard: "0.4 mm - 2.4 mm",
    advanced: "0.20 mm - 3.2 mm (8 - 126 mil)",
  },
  {
    spec: "Layer-to-Layer Registration",
    category: "layers",
    standard: "± 5 mil (± 0.12 mm)",
    advanced: "± 4 mil (± 0.10 mm)",
  },
  {
    spec: "Solder Mask Alignment",
    category: "traces",
    standard: "± 3.5 mil (± 0.09 mm)",
    advanced: "± 3 mil (± 0.075 mm)",
  },
  {
    spec: "Min Solder Dam / Bridge",
    category: "traces",
    standard: "5 mil (0.125 mm)",
    advanced: "4 mil (0.10 mm)",
    isPrecision: true,
  },
  {
    spec: "V-CUT Residual Thickness & Accuracy",
    category: "layers",
    standard: "± 0.15 mm",
    advanced: "± 0.10 mm (Angle: 30°/45°/60°)",
  },
  {
    spec: "CNC Routing Tolerance",
    category: "layers",
    standard: "± 0.20 mm",
    advanced: "± 0.13 mm (Punching: ±0.10 mm)",
  },
  {
    spec: "Hole-Wall Copper Thickness",
    category: "drilling",
    standard: "≥ 20 µm (IPC Class 2)",
    advanced: "≥ 25 µm (IPC Class 3)",
    isPrecision: true,
  },
  {
    spec: "Max Finished Copper Weight",
    category: "materials",
    standard: "1 - 3 oz (35 - 105 µm)",
    advanced: "Up to 10 oz Heavy Copper",
    isPrecision: true,
  },
  {
    spec: "Impedance Control Tolerance",
    category: "traces",
    standard: "± 10%",
    advanced: "± 5% High Precision",
    isPrecision: true,
  },
  {
    spec: "Substrate Laminate Materials",
    category: "materials",
    standard: "FR-4 Standard (TG130-140)",
    advanced: "High TG170, Rogers, PTFE Teflon, Taconic, Metal Core",
  },
  {
    spec: "Surface Finishing Options",
    category: "finishes",
    standard: "HASL Lead-Free, OSP",
    advanced: "ENIG (Immersion Gold 1-3µ\"), Hard Gold (50µ\"), Immersion Silver/Tin",
  },
];

const CAPABILITIES_ZH: CapabilityItem[] = [
  {
    spec: "多层板层数能力",
    category: "layers",
    standard: "2 - 16 层常规板",
    advanced: "最高达 30 层高密度板",
    isPrecision: true,
  },
  {
    spec: "内层最小线宽/线距",
    category: "traces",
    standard: "3 / 3 mil (0.075 mm)",
    advanced: "2 / 2 mil (0.05 mm)",
    isPrecision: true,
  },
  {
    spec: "外层最小线宽/线距",
    category: "traces",
    standard: "3.5 / 3.5 mil (0.09 mm)",
    advanced: "2.5 / 2.5 mil (0.065 mm)",
    isPrecision: true,
  },
  {
    spec: "机械钻孔最小孔径",
    category: "drilling",
    standard: "10 mil (0.25 mm)",
    advanced: "8 mil (0.20 mm)",
    isPrecision: true,
  },
  {
    spec: "激光微孔 (Microvia) 孔径",
    category: "drilling",
    standard: "6 mil (0.15 mm)",
    advanced: "4 mil (0.10 mm)",
    isPrecision: true,
  },
  {
    spec: "机械/激光钻孔深径比",
    category: "drilling",
    standard: "8 : 1 常规深径比",
    advanced: "最高达 12 : 1",
    isPrecision: true,
  },
  {
    spec: "最大工作拼板尺寸",
    category: "layers",
    standard: "457 × 610 mm (18\" × 24\")",
    advanced: "508 × 610 mm (20\" × 24\")",
  },
  {
    spec: "成品板厚范围",
    category: "layers",
    standard: "0.4 mm - 2.4 mm",
    advanced: "0.20 mm - 3.2 mm (8 - 126 mil)",
  },
  {
    spec: "层间对准度公差",
    category: "layers",
    standard: "± 5 mil (± 0.12 mm)",
    advanced: "± 4 mil (± 0.10 mm)",
  },
  {
    spec: "阻焊对准公差",
    category: "traces",
    standard: "± 3.5 mil (± 0.09 mm)",
    advanced: "± 3 mil (± 0.075 mm)",
  },
  {
    spec: "最小阻焊桥宽度",
    category: "traces",
    standard: "5 mil (0.125 mm)",
    advanced: "4 mil (0.10 mm)",
    isPrecision: true,
  },
  {
    spec: "V-CUT 余厚与残厚精度",
    category: "layers",
    standard: "± 0.15 mm",
    advanced: "± 0.10 mm (角度: 30°/45°/60°)",
  },
  {
    spec: "数控成型/铣边公差",
    category: "layers",
    standard: "± 0.20 mm",
    advanced: "± 0.13 mm (冲板: ±0.10 mm)",
  },
  {
    spec: "通孔孔壁铜厚 (PTH)",
    category: "drilling",
    standard: "≥ 20 µm (IPC 2 级)",
    advanced: "≥ 25 µm (IPC 3 级 / 车规)",
    isPrecision: true,
  },
  {
    spec: "最大成品铜厚 (超厚铜)",
    category: "materials",
    standard: "1 - 3 oz (35 - 105 µm)",
    advanced: "最高达 10 oz 超厚铜",
    isPrecision: true,
  },
  {
    spec: "特征阻抗控制公差",
    category: "traces",
    standard: "± 10% 常规公差",
    advanced: "± 5% 高精度差分阻抗",
    isPrecision: true,
  },
  {
    spec: "基板板材原厂选型",
    category: "materials",
    standard: "生益/建滔标准 FR-4 (TG130-140)",
    advanced: "生益高TG170、罗杰斯Rogers、PTFE特氟龙、泰康尼、铝基板",
  },
  {
    spec: "表面涂覆处理工艺",
    category: "finishes",
    standard: "环保无铅喷锡、OSP抗氧化",
    advanced: "化学沉金 ENIG (1-3µ\")、电镀硬金 (50µ\")、沉银、沉锡",
  },
];

const CATEGORIES_EN = [
  { key: "all", label: "All Tolerances (18 Specs)" },
  { key: "layers", label: "Layers & Dimensions" },
  { key: "traces", label: "Fine Pitch & Traces" },
  { key: "drilling", label: "Drilling & Microvias" },
  { key: "materials", label: "Heavy Copper & Materials" },
  { key: "finishes", label: "Surface Finishes" },
];

const CATEGORIES_ZH = [
  { key: "all", label: "全部工艺公差 (18项核心指标)" },
  { key: "layers", label: "层数与外形尺寸" },
  { key: "traces", label: "精细线宽线距" },
  { key: "drilling", label: "数控钻孔与微孔" },
  { key: "materials", label: "超厚铜与特种基材" },
  { key: "finishes", label: "表面处理工艺" },
];

export default function InteractiveProcessCapabilities() {
  const { locale } = useLanguage();
  const isZh = locale === "zh";

  const categories = isZh ? CATEGORIES_ZH : CATEGORIES_EN;
  const capabilities = isZh ? CAPABILITIES_ZH : CAPABILITIES_EN;

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = capabilities.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.advanced.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Controls: Search and Categories */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Pills with Sliding Indicator */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none relative">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.key
                  ? "text-white"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-blue-500/50"
              }`}
            >
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="capTabIndicator"
                  className="absolute inset-0 rounded-full bg-blue-600 shadow-sm shadow-blue-600/30"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
          <input
            type="text"
            placeholder={
              isZh
                ? "搜索工艺参数 (如 2 mil, 罗杰斯, PTFE, 12:1)..."
                : "Search specs (e.g. 2 mil, Rogers, PTFE, 12:1)..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 pl-9 pr-4 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Specifications Table with Smooth Row Transitions */}
      <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/80 text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-slate-400">
                <th className="py-3 px-5">
                  {isZh ? "工程制造参数" : "Engineering Parameter"}
                </th>
                <th className="py-3 px-5">
                  {isZh ? "常规打样标准" : "Standard Prototype"}
                </th>
                <th className="py-3 px-5">
                  {isZh ? "先进极限能力" : "Advanced Precision Limit"}
                </th>
                <th className="py-3 px-4 text-right">
                  {isZh ? "质检等级" : "Class"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80 text-xs">
              <AnimatePresence>
                {filteredItems.map((item, idx) => (
                  <motion.tr
                    key={item.spec}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.2) }}
                    className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3 px-5 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{item.spec}</span>
                        {item.isPrecision && (
                          <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[9px] font-black px-1.5 py-0.2 shrink-0">
                            {isZh ? "精密指标" : "Precision"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-gray-600 dark:text-slate-300">
                      {item.standard}
                    </td>
                    <td className="py-3 px-5 font-black text-emerald-600 dark:text-emerald-400">
                      {item.advanced}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[9px] font-black px-2 py-0.5">
                        IPC Class 2/3
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-xs text-gray-400">
            {isZh
              ? `未找到与 “${searchQuery}” 匹配的工艺参数。`
              : `No specifications found matching "${searchQuery}".`}
          </div>
        )}
      </div>

      {/* IPC Notice & Quote Prompt */}
      <div className="rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div className="text-xs text-gray-700 dark:text-slate-300">
            <strong>
              {isZh
                ? "需要更严苛公差或特种叠层设计？"
                : "Need tighter tolerances or custom stackups?"}
            </strong>{" "}
            {isZh
              ? "所有参数均直接核验自 FT PCB 官方制造手册第34页。"
              : "All parameters are validated directly against Page 34 of the official FT PCB specification book."}
          </div>
        </div>

        <Link
          href="/pcb-quote"
          className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-black shrink-0 shadow-sm transition active:scale-95"
        >
          <span>{isZh ? "在线配置 PCB 报价" : "Configure PCB Quote"}</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
