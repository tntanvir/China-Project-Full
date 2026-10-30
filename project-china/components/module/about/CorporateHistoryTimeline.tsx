"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Building2,
  Cpu,
  Award,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";

interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  slideRef: number;
  description: string;
  achievements: string[];
  badge: string;
}

const MILESTONES_EN: Milestone[] = [
  {
    year: "1997",
    title: "Company Founding & Academic Inception",
    subtitle: "Shenzhen University Engineering Roots",
    slideRef: 15,
    badge: "Foundation",
    description:
      "Founded by Professor Chen Jingqiu and the engineering research faculty of Shenzhen University in the Pearl River Delta, focused on high-density circuit fabrication and polymer chemistry research.",
    achievements: [
      "Inaugural double-sided & 4-layer production lines",
      "Academic partnership with Shenzhen University materials lab",
      "Initial UL 94V-0 flammability certification",
    ],
  },
  {
    year: "2008",
    title: "Multi-Layer Expansion & High-Mix Scaling",
    subtitle: "8 to 16 Layer Commercial Capability",
    slideRef: 15,
    badge: "Expansion",
    description:
      "Invested in automated multi-layer hot-press lamination lines and precision CNC drilling, scaling to supply automotive instrument and industrial power electronics across China and Southeast Asia.",
    achievements: [
      "Expansion to 16-layer controlled impedance boards",
      "ISO 9001:2008 & ISO 14001 certification audited",
      "Flying-probe 100% electrical test integration",
    ],
  },
  {
    year: "2016",
    title: "15,000m² Wuping Production Base Launched",
    subtitle: "Western Fujian High-Tech Zone Campus",
    slideRef: 7,
    badge: "New Campus",
    description:
      "Constructed 3 standardized production buildings in Wuping High-Tech Zone with 30 Million RMB registered capital, integrating automated Insoluble Positive VCP copper plating and zero-discharge wastewater recycling.",
    achievements: [
      "15,000 m² factory footprint across 3 facilities",
      "Monthly capacity reached 60,000 m²/month",
      "Western Fujian strategic electronic corridor hub",
    ],
  },
  {
    year: "2020",
    title: "IATF 16949 & 5G Patent Breakthrough",
    subtitle: "#1 5G Patent Base in Longyan City",
    slideRef: 20,
    badge: "Automotive & 5G",
    description:
      "Awarded IATF 16949:2016 automotive certification and recognized as the enterprise with the most authorized 5G invention patents in Longyan City for PTFE Teflon high-frequency bonding.",
    achievements: [
      "IATF 16949 automotive zero-defect standard certified",
      "PTFE microwave antenna circuit mass production",
      "Proprietary 'Yunshang Feitian' Cloud MES deployed",
    ],
  },
  {
    year: "2024 - 2026",
    title: "100,000 m²/Month Smart Digital Factory",
    subtitle: "National 'Little Giant' Enterprise Recognition",
    slideRef: 15,
    badge: "Little Giant",
    description:
      "Recognized by MIIT as a Specialized 'Little Giant' enterprise with 100,000 m²/month capacity, 30-layer high-density capability, 2/2 mil fine-pitch LDI, and global customer coordination across 50+ countries.",
    achievements: [
      "100,000 m²/month output (80k multi-layer + 20k specialty)",
      "450M CNY ($67M) sales revenue target",
      "Sub-2 mil LDI laser imaging & Kelvin 4-wire testing",
    ],
  },
];

const MILESTONES_ZH: Milestone[] = [
  {
    year: "1997",
    title: "企业创立与深大产学研奠基",
    subtitle: "深大材料工程学院博士研究背景",
    slideRef: 15,
    badge: "创立奠基",
    description:
      "由深圳大学陈景秋教授联合科研技术团队在珠三角创立，专注于高密度互连电路板试制与高分子材料改性研究。",
    achievements: [
      "首批双面及四层板专业产线投产",
      "与深圳大学高分子材料实验室共建产学研",
      "首度通过美国 UL 94V-0 国际阻燃安全认证",
    ],
  },
  {
    year: "2008",
    title: "多层板扩产与高多层商业化",
    subtitle: "8-16层高多层板全面商业量产",
    slideRef: 15,
    badge: "规模扩产",
    description:
      "投资引进全自动真空热压机组与高精高速数控钻机，面向汽车仪表与工业电源提供高可靠性电路板。",
    achievements: [
      "突破 16 层阻抗可控多层板加工",
      "通过 ISO 9001 与 ISO 14001 质量环境实审",
      "全线标配 100% 飞针测试与光学外观检查",
    ],
  },
  {
    year: "2016",
    title: "武平 15,000m² 高新产业基地落成",
    subtitle: "闽西电子信息产业走廊战略实体基地",
    slideRef: 7,
    badge: "新园区投产",
    description:
      "在福建龙岩武平高新技术产业园建设3栋标准化工业厂房，实收注册资本3000万元，引入垂直连续VCP电镀线与环保污水零排放循环处理工程。",
    achievements: [
      "3栋现代化独栋厂房建筑群落地",
      "月综合产能跃升突破 60,000 m²",
      "入选闽西承接粤港澳大湾区产业转移示范项目",
    ],
  },
  {
    year: "2020",
    title: "IATF 16949 车规认证与 5G 专利突破",
    subtitle: "龙岩市 5G 发明专利数量第一的实体企业",
    slideRef: 20,
    badge: "车规与5G",
    description:
      "通过国际权威 IATF 16949:2016 汽车级管理认证，并以聚四氟乙烯 PTFE 射频微波复合材料高难度压合技术荣登龙岩市 5G 发明专利企业榜首。",
    achievements: [
      "全线执行 IATF 16949 汽车零缺陷质控准则",
      "PTFE 特种聚四氟乙烯微波天线板规模量产",
      "自主知识产权“云上飞天”智能MES全面部署",
    ],
  },
  {
    year: "2024 - 2026",
    title: "100,000 m²/月 智能化数字标杆工厂",
    subtitle: "工信部专精特新“小巨人”企业荣誉",
    slideRef: 15,
    badge: "国家小巨人",
    description:
      "荣膺国家级专精特新“小巨人”企业，具备单月10万平方米产能、30层极限加工能力、2/2 mil 激光成像精度，服务全球 50+ 个国家与地区硬件团队。",
    achievements: [
      "单月10万m²综合产能 (8万m²高多层 + 2万m²特种板)",
      "实现年销售营收 4.5 亿元人民币跨越目标",
      "引入2mil级 LDI 激光直写与4线开尔文低阻电测",
    ],
  },
];

export default function CorporateHistoryTimeline() {
  const { locale } = useLanguage();
  const milestones = locale === "zh" ? MILESTONES_ZH : MILESTONES_EN;
  const [selectedYear, setSelectedYear] = useState<string>("2024 - 2026");
  const selectedMilestone = milestones.find((m) => m.year === selectedYear) || milestones[4];

  return (
    <div className="space-y-8">
      {/* Horizontal Interactive Timeline Bar */}
      <div className="relative border-b border-gray-200 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          {milestones.map((m: Milestone) => {
            const isSelected = m.year === selectedMilestone.year;
            return (
              <button
                key={m.year}
                onClick={() => setSelectedYear(m.year)}
                className={`relative px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer shrink-0 ${
                  isSelected
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <span className="text-lg sm:text-xl font-black tracking-tight">{m.year}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{m.badge}</span>

                {isSelected && (
                  <motion.div
                    layoutId="timelineIndicator"
                    className="absolute -bottom-4 inset-x-2 h-1 bg-emerald-600 rounded-full shadow-[0_0_8px_#10b981]"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detail Card with Smooth Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMilestone.year}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {selectedMilestone.year}
                </span>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-black px-2.5 py-0.5">
                  {selectedMilestone.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                {selectedMilestone.title}
              </h3>
              <div className="text-xs font-bold text-gray-400">
                {selectedMilestone.subtitle}
              </div>
            </div>

            <span className="self-start sm:self-auto rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-xs font-mono font-bold px-3 py-1">
              {locale === "zh" ? `官方画册第 ${selectedMilestone.slideRef} 页` : `Brochure Slide ${selectedMilestone.slideRef}`}
            </span>
          </div>

          <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
            {selectedMilestone.description}
          </p>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
              {locale === "zh" ? "历史标志性里程碑与权威资质认证" : "Historical Milestones & Accreditations"}
            </span>
            <div className="grid sm:grid-cols-3 gap-3">
              {selectedMilestone.achievements.map((ach, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/60 p-3 flex items-start gap-2"
                >
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                    {ach}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
