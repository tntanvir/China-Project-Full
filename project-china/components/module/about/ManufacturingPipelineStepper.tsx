"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  FileCode,
  Crosshair,
  Droplets,
  Zap,
  Palette,
  Boxes,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface PipelineStep {
  step: string;
  name: string;
  category: string;
  slideRef: number;
  image: string;
  duration: string;
  tolerance: string;
  description: string;
  machines: string[];
}

const STEPS_EN: PipelineStep[] = [
  {
    step: "01",
    name: "CAM DFM Verification & Array Panelization",
    category: "Pre-Production Engineering",
    slideRef: 14,
    image: "/images/company-profile/page_14.jpg",
    duration: "Within 2 Hours",
    tolerance: "120+ DRC Automated Rules",
    description:
      "Automated design-rule checking (DRC) through Genesis/InCAM engines, optimizing impedance calculation (±5%), copper balance, solder dam retention, and panel nesting efficiency.",
    machines: ["Genesis2000 & InCAM CAM Stations", "Polar SI9000 Impedance Simulator", "Automated Panelization Engines"],
  },
  {
    step: "02",
    name: "High-Speed CNC Mechanical & Laser Drilling",
    category: "Substrate Penetration",
    slideRef: 26,
    image: "/images/company-profile/page_26.jpg",
    duration: "Continuous Shift",
    tolerance: "Min Hole: 0.20mm (8 mil) • Aspect: 12:1",
    description:
      "Linear air-bearing multi-spindle drilling machines operating up to 200,000 RPM with automated tool changers, broken bit sensors, and laser hole diameter verification.",
    machines: ["Posalux Linear Multi-Spindle Drills", "Mitsubishi CO2 Laser Microvia Drills", "Laser Bit Diameter Verification Gauges"],
  },
  {
    step: "03",
    name: "Insoluble Positive VCP Continuous Copper Plating",
    category: "Through-Hole Metallization",
    slideRef: 27,
    image: "/images/company-profile/page_27.jpg",
    duration: "Continuous Flow",
    tolerance: "Hole-Wall Copper ≥ 20 - 25 µm",
    description:
      "Advanced Vertical Continuous Plating line utilizing titanium insoluble anodes and pulse reverse rectification, ensuring uniform copper barrel thickness and throwing power exceeding 95%.",
    machines: ["Insoluble Positive VCP Plating Line", "Direct Current Pulse Rectifiers", "Automatic Chemical Dosing & Titration System"],
  },
  {
    step: "04",
    name: "Class 10,000 Cleanroom LDI Laser Direct Imaging",
    category: "Photolithography & Etch",
    slideRef: 28,
    image: "/images/company-profile/page_28.jpg",
    duration: "Continuous Sub-Second Feed",
    tolerance: "Min Trace/Space: 2 / 2 mil (0.05 mm)",
    description:
      "Direct digital laser exposure onto photosensitive dry film inside positive-pressure cleanrooms, completely eliminating traditional film stretch, registration drift, and temperature distortion.",
    machines: ["Orbotech Diamond LDI Systems", "Automatic Cleanroom Pre-Clean Laminators", "Vacuum Differential Alkaline Etching Lines"],
  },
  {
    step: "05",
    name: "Dual-Sided Screen Solder Mask & ENIG Finishing",
    category: "Surface Protection",
    slideRef: 29,
    image: "/images/company-profile/page_29.jpg",
    duration: "Oven Cure Controlled",
    tolerance: "Solder Dam: 4 mil • ENIG Gold: 1-3 µin",
    description:
      "Cleanroom solder mask coating for crisp solder dams and BGA tenting, followed by chemical surface finishing: ENIG immersion gold, lead-free HASL, immersion silver, or OSP.",
    machines: ["Automatic Screen Printing Lines", "Tunnel IR Thermal Curing Ovens", "Automated Electroless Nickel Immersion Gold (ENIG) Line"],
  },
  {
    step: "06",
    name: "High-Speed SMT Pick-and-Place Assembly",
    category: "Component Populating",
    slideRef: 4,
    image: "/images/company-profile/page_35.jpg",
    duration: "High-Speed CPH",
    tolerance: "01005 Chips & 0.35mm Pitch BGA",
    description:
      "Automated Surface Mount Technology lines: 10-zone nitrogen reflow ovens, high-precision Yamaha pick-and-place, and Koh Young 3D SPI solder paste inspection.",
    machines: ["Yamaha YRM20 High-Speed Mounters", "10-Zone Nitrogen Reflow Soldering Ovens", "Koh Young 3D Solder Paste Inspection (SPI)"],
  },
  {
    step: "07",
    name: "Four-Wire Kelvin E-Testing & 3D Optical AVI",
    category: "Quality Inspection & QA",
    slideRef: 31,
    image: "/images/company-profile/page_31.jpg",
    duration: "100% Netlist Verification",
    tolerance: "Micro-Ohm Sensitivity (0.1 mΩ)",
    description:
      "Every finished board undergoes dedicated Kelvin 4-wire testing to detect micro-cracks inside plated through-holes, accompanied by automated optical visual inspection (AVI) for zero-defect shipment.",
    machines: ["Four-Terminal Kelvin Low Resistance Testers", "Automated Visual Inspection (AVI) Cameras", "X-Ray Fluorescence Plating Gauges"],
  },
];

const STEPS_ZH: PipelineStep[] = [
  {
    step: "01",
    name: "CAM工程审核与拼板优化 (DFM)",
    category: "产前工程处理",
    slideRef: 14,
    image: "/images/company-profile/page_14.jpg",
    duration: "2小时内极速反馈",
    tolerance: "120+项DRC自动化校验规则",
    description:
      "基于Genesis2000与InCAM工程软件进行自动化设计规则检查，精准优化微带线阻抗计算（±5%公差）、铜皮平衡、阻焊桥保留及拼板利用率。",
    machines: ["Genesis2000 & InCAM CAM工作站", "Polar SI9000 阻抗建模仿真", "自动拼板排版算法引擎"],
  },
  {
    step: "02",
    name: "超高速数控机械钻孔与激光微孔",
    category: "基板机械通孔穿透",
    slideRef: 26,
    image: "/images/company-profile/page_26.jpg",
    duration: "三班24小时连续运转",
    tolerance: "最小孔径: 0.20mm (8 mil) • 厚径比: 12:1",
    description:
      "采用Posalux等高精度空气轴承多轴数控钻孔机，主轴转速高达200,000 RPM，配备自动换刀系统、断刀红外感应与激光孔径在线校验。",
    machines: ["Posalux 线性多主轴数控钻机", "三菱 CO2 激光盲孔钻孔机", "激光钻咀直径精密测定仪"],
  },
  {
    step: "03",
    name: "不溶性钛阳极 VCP 垂直连续电镀",
    category: "通孔沉铜与加厚铜电镀",
    slideRef: 27,
    image: "/images/company-profile/page_27.jpg",
    duration: "全流程自动化行车流水",
    tolerance: "孔壁铜厚 ≥ 20 - 25 µm 均匀度高",
    description:
      "引入先进垂直连续电镀（VCP）线，搭配钛基不溶性阳极与脉冲反向整流技术，确保孔内深镀能力超过95%，杜绝空洞缺陷。",
    machines: ["不溶性正极 VCP 垂直连续电镀线", "高频脉冲直流整流器", "全自动化学药水在线分析与滴定系统"],
  },
  {
    step: "04",
    name: "万级无尘洁净室 LDI 激光直接成像",
    category: "线路光刻与真空微蚀刻",
    slideRef: 28,
    image: "/images/company-profile/page_28.jpg",
    duration: "连续亚秒级光曝光",
    tolerance: "最小线宽/线距: 2 / 2 mil (0.05 mm)",
    description:
      "在Class 10,000万级正压洁净车间内，采用直接数字激光光刻技术直接曝光干膜，彻底杜绝传统菲林胀缩、套刻偏差与环境温湿度变形。",
    machines: ["Orbotech Diamond LDI 激光直接成像机", "全自动洁净室预清洗压膜机组", "真空差压碱性微蚀刻生产线"],
  },
  {
    step: "05",
    name: "双面阻焊字符印刷与 ENIG 化金工艺",
    category: "表面绝缘防护与化学涂层",
    slideRef: 29,
    image: "/images/company-profile/page_29.jpg",
    duration: "红外隧道烘炉精确固化",
    tolerance: "阻焊桥: 4 mil • ENIG金厚: 1-3 µin",
    description:
      "万级无尘环境下精密涂布高品质阻焊油墨，精准显影BGA绿油塞孔与微小绿油桥；并配套沉金（ENIG）、无铅喷锡（HASL）、沉银及OSP表面处理。",
    machines: ["全自动丝网印刷及连线烘干机", "隧道式红外温控热固化烘炉", "全自动化学沉镍浸金（ENIG）线"],
  },
  {
    step: "06",
    name: "高速 SMT 贴片与高精度回流焊接",
    category: "元件自动化装配与焊接",
    slideRef: 4,
    image: "/images/company-profile/page_35.jpg",
    duration: "超高速元件贴装 (CPH)",
    tolerance: "01005 超微阻容 & 0.35mm Pitch BGA",
    description:
      "配备雅马哈最新一代高速多功能表面贴装机、十温区氮气回流焊炉与Koh Young 3D SPI锡膏测厚仪，保障高密度主板的焊接良率。",
    machines: ["Yamaha YRM20 高速多功能贴片机", "十温区高精度氮气回流焊接炉", "高迎 Koh Young 3D 锡膏检测系统 (SPI)"],
  },
  {
    step: "07",
    name: "四线开尔文电测与 3D 光学外观检验",
    category: "成品终检与零缺陷出厂",
    slideRef: 31,
    image: "/images/company-profile/page_31.jpg",
    duration: "100% 网络表全检测试",
    tolerance: "微欧姆级灵敏度 (0.1 mΩ)",
    description:
      "出厂前所有成品板必须经过4线开尔文接触式低阻抗电测，精准甄别孔壁隐性微裂纹，并经全自动AVI光学扫描仪进行表面零缺陷筛查。",
    machines: ["四端子开尔文微电阻综合测试机", "自动视觉外观检测机 (AVI)", "X射线荧光镀层测厚仪 (XRF)"],
  },
];

export default function ManufacturingPipelineStepper() {
  const { locale } = useLanguage();
  const steps = locale === "zh" ? STEPS_ZH : STEPS_EN;
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="space-y-8">
      {/* Horizontal Pipeline Steps Track */}
      <div className="relative overflow-x-auto pb-4 scrollbar-none">
        <div className="flex items-center gap-2 min-w-[760px]">
          {steps.map((s, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = idx < activeStepIndex;

            return (
              <button
                key={s.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex-1 p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-black ${
                      isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                    }`}
                  >
                    {locale === "zh" ? `第 ${s.step} 步` : `Step ${s.step}`}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">p.{s.slideRef}</span>
                </div>
                <div className="text-xs font-black text-gray-900 dark:text-white line-clamp-1">
                  {s.name.split(" ")[0]} {s.name.split(" ")[1]}
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">{s.category}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Deep Dive Display */}
      <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-12 items-stretch">
          {/* Photo & Machine Preview */}
          <div className="lg:col-span-6 relative bg-slate-950 min-h-[300px] sm:min-h-[380px] p-4 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.step}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.28 }}
                className="relative w-full h-full max-h-[420px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={currentStep.image}
                  alt={currentStep.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain bg-black/90"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white border border-white/20">
              <Clock className="size-3 text-emerald-400" />
              <span>{currentStep.duration}</span>
            </div>

            <div className="absolute bottom-6 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-800">
              <span>{currentStep.tolerance}</span>
            </div>
          </div>

          {/* Details & Specifications */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <div className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    {locale === "zh" ? `第 ${currentStep.step} 道工序` : `Stage ${currentStep.step}`} • {currentStep.category}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 leading-tight">
                    {currentStep.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {currentStep.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    {locale === "zh" ? "核心工艺机组配置与品质管控标准" : "Specialized Machine Equipment & Standards"}
                  </span>
                  <div className="space-y-1.5">
                    {currentStep.machines.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="text-gray-500 hover:text-emerald-600 disabled:opacity-30 disabled:pointer-events-none font-bold cursor-pointer"
              >
                &larr; {locale === "zh" ? "上一工序" : "Previous Stage"}
              </button>

              <span className="font-mono text-gray-400">
                {locale === "zh"
                  ? `第 ${activeStepIndex + 1} / ${steps.length} 道工序`
                  : `${activeStepIndex + 1} of ${steps.length} Stages`}
              </span>

              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStepIndex === steps.length - 1}
                className="text-emerald-600 hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none font-bold cursor-pointer"
              >
                {locale === "zh" ? "下一工序" : "Next Stage"} &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
