"use client";

import { useState, useId } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ExternalLink,
  ZoomIn,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface EquipmentItem {
  id: string;
  name: string;
  category: "drilling" | "plating" | "imaging" | "testing" | "material";
  categoryLabel: string;
  slideNumber: number;
  imageSrc: string;
  specs: { label: string; value: string }[];
  highlight: string;
  description: string;
}

const EQUIPMENT_DATA_EN: EquipmentItem[] = [
  {
    id: "cnc-drilling",
    name: "Linear High-Precision CNC Drilling Rigs",
    category: "drilling",
    categoryLabel: "Mechanical & Drilling",
    slideNumber: 26,
    imageSrc: "/images/company-profile/page_26.jpg",
    highlight: "12:1 Aspect Ratio • 0.20mm (8 mil) Min Hole",
    description:
      "High-speed air-bearing multi-spindle drilling rigs equipped with automatic tool changers, laser diameter verification, and broken-bit detection for high layer-count multilayer boards.",
    specs: [
      { label: "Min Hole Diameter", value: "0.20 mm (8 mil)" },
      { label: "Aspect Ratio", value: "Up to 12 : 1" },
      { label: "Hole Position Accuracy", value: "±0.05 mm (2 mil)" },
      { label: "Spindle Speed", value: "200,000 RPM Max" },
    ],
  },
  {
    id: "vcp-plating",
    name: "Insoluble Positive VCP Continuous Copper Plating Line",
    category: "plating",
    categoryLabel: "Electroplating & DPTH",
    slideNumber: 27,
    imageSrc: "/images/company-profile/page_27.jpg",
    highlight: "Uniform Through-Hole Copper ≥20µm",
    description:
      "Advanced Vertical Continuous Plating (VCP) system utilizing insoluble anodes and specialized pulse reverse rectification for superior copper throwing power inside microvias and blind vias.",
    specs: [
      { label: "Hole-Wall Copper", value: "≥ 20-25 µm Uniform" },
      { label: "Throwing Power", value: "≥ 95% Across Panel" },
      { label: "Plating Type", value: "Insoluble Titanium Anode" },
      { label: "Surface Copper", value: "0.5 oz to 10 oz Heavy" },
    ],
  },
  {
    id: "ldi-exposure",
    name: "Fully Automatic LDI Laser Direct Imaging Cleanroom",
    category: "imaging",
    categoryLabel: "Photolithography & LDI",
    slideNumber: 28,
    imageSrc: "/images/company-profile/page_28.jpg",
    highlight: "Sub-2 mil Line / Space • 10,000-Class Cleanroom",
    description:
      "Direct laser exposure onto photosensitive dry film eliminating traditional film stretch, temperature distortion, and registration drift for fine-pitch HDI circuits.",
    specs: [
      { label: "Min Trace / Spacing", value: "2 / 2 mil (0.05 mm)" },
      { label: "Alignment Accuracy", value: "± 0.075 mm (±3 mil)" },
      { label: "Cleanroom Standard", value: "Class 10,000 Temperature Controlled" },
      { label: "Exposure Speed", value: "Continuous Automated Feed" },
    ],
  },
  {
    id: "solder-screen",
    name: "Automatic Dual-Sided Solder Resist Screen Printing",
    category: "imaging",
    categoryLabel: "Solder Mask & Finishing",
    slideNumber: 29,
    imageSrc: "/images/company-profile/page_29.jpg",
    highlight: "Crisp 4 mil Solder Dams • Bubble-Free Coating",
    description:
      "Controlled cleanroom screen printing lines ensuring consistent solder mask thickness across high-density circuit traces, BGA arrays, and via tenting.",
    specs: [
      { label: "Min Solder Dam", value: "4 mil (0.10 mm)" },
      { label: "Registration Tolerance", value: "± 0.075 mm (±3 mil)" },
      { label: "Available Colors", value: "Green, Blue, Black, White, Red, Matt" },
      { label: "Coating Uniformity", value: "± 2 µm Cross-Panel" },
    ],
  },
  {
    id: "kelvin-testing",
    name: "Four-Wire Kelvin Low Resistance E-Testing System",
    category: "testing",
    categoryLabel: "Testing & Laboratory",
    slideNumber: 31,
    imageSrc: "/images/company-profile/page_31.jpg",
    highlight: "Micro-Ohm Accuracy • 100% Trace Continuity",
    description:
      "Specialized four-terminal sensing system that eliminates test lead resistance, detecting micro-cracks inside plated through-holes, thermal stress fractures, and heavy-copper resistance anomalies.",
    specs: [
      { label: "Measurement Range", value: "0.1 mΩ to 100 MΩ" },
      { label: "Testing Standard", value: "IPC-9252 Class 3" },
      { label: "Test Voltage", value: "Up to 300 V Isolation" },
      { label: "Coverage", value: "100% Netlist Verification" },
    ],
  },
  {
    id: "avi-inspection",
    name: "High-Speed AVI Automated Visual Inspection Machine",
    category: "testing",
    categoryLabel: "Testing & Laboratory",
    slideNumber: 32,
    imageSrc: "/images/company-profile/page_32.jpg",
    highlight: "Micro-Short / Open Detection • AI Optical Recognition",
    description:
      "High-speed line-scan camera system scanning outer layers and finished circuit boards, instantly flagging copper spurs, mousebites, pad pinholes, and soldermask misalignments.",
    specs: [
      { label: "Optical Resolution", value: "5 µm Pixel Pitch" },
      { label: "Defect Types", value: "Opens, Shorts, Pits, Dish-Down" },
      { label: "Scan Velocity", value: "Sub-Second Full Panel" },
      { label: "Verification", value: "Automated Dual-Station Review" },
    ],
  },
  {
    id: "physics-lab",
    name: "Physics & Chemistry Metallographic Microsection Lab",
    category: "testing",
    categoryLabel: "Testing & Laboratory",
    slideNumber: 33,
    imageSrc: "/images/company-profile/page_33.jpg",
    highlight: "Solder Float Thermal Stress • Chemical Composition Analysis",
    description:
      "Fully equipped internal testing laboratory featuring microsection mounting, polishing, metallurgical microscopy, X-ray fluorescence plating thickness gauges, and copper bath titration.",
    specs: [
      { label: "Thermal Stress Test", value: "288°C 10s × 3 Cycles Float" },
      { label: "Microscopy", value: "1,000× Cross-Section Analysis" },
      { label: "Plating Thickness", value: "XRF Gold & Copper Analysis" },
      { label: "Ionic Contamination", value: "Rose Cleanliness Testing" },
    ],
  },
  {
    id: "smart-warehouse",
    name: "High-Density Material & Intelligent Slicing Center",
    category: "material",
    categoryLabel: "Material & Warehouse",
    slideNumber: 25,
    imageSrc: "/images/company-profile/page_25.jpg",
    highlight: "Shengyi & ITEQ Certified Laminates • Constant Temp/Humidity",
    description:
      "Automated sheet cutting and high-density racking facilities keeping FR-4, high-TG170, halogen-free, and PTFE microwave laminates in conditioned storage with strict FIFO tracking.",
    specs: [
      { label: "Storage Control", value: "22±2°C / 55±5% RH Constant" },
      { label: "Laminate Brands", value: "Shengyi (SY), ITEQ, Rogers, Taconic" },
      { label: "Cutting Tolerance", value: "± 0.20 mm Automated Shearing" },
      { label: "Traceability", value: "Lot Barcode Tagged to Panel" },
    ],
  },
];

const EQUIPMENT_DATA_ZH: EquipmentItem[] = [
  {
    id: "cnc-drilling",
    name: "高精度直线导轨数控钻孔机组",
    category: "drilling",
    categoryLabel: "机械加工与精密钻孔",
    slideNumber: 26,
    imageSrc: "/images/company-profile/page_26.jpg",
    highlight: "12:1 极限深径比 • 0.20mm (8 mil) 最小机械孔",
    description:
      "高速气浮主轴多轴钻机，配备自动换刀刀库、激光孔径校验与断刀自动探测系统，专用于高多层板超精密钻孔。",
    specs: [
      { label: "最小孔径", value: "0.20 mm (8 mil)" },
      { label: "最大深径比", value: "最高达 12 : 1" },
      { label: "孔位精度", value: "±0.05 mm (2 mil)" },
      { label: "主轴转速", value: "最高 200,000 RPM" },
    ],
  },
  {
    id: "vcp-plating",
    name: "不溶性阳极 VCP 垂直连续沉铜电镀线",
    category: "plating",
    categoryLabel: "电镀与通孔沉铜",
    slideNumber: 27,
    imageSrc: "/images/company-profile/page_27.jpg",
    highlight: "孔壁铜厚均匀度 ≥20-25µm • 贯通力≥95%",
    description:
      "先进垂直连续电镀 (VCP) 系统，采用不溶性钛阳极与脉冲反向整流技术，确保高多层板深盲孔与通孔具有优异的填孔与孔铜厚度一致性。",
    specs: [
      { label: "孔壁铜厚", value: "≥ 20-25 µm 均匀受控" },
      { label: "电镀贯通力", value: "全板均匀度 ≥ 95%" },
      { label: "阳极类型", value: "不溶性钛阳极 (Ti)" },
      { label: "表面铜厚", value: "0.5 oz 至 10 oz 超厚铜" },
    ],
  },
  {
    id: "ldi-exposure",
    name: "全自动 LDI 激光直接成像万级洁净车间",
    category: "imaging",
    categoryLabel: "光刻与 LDI 成像",
    slideNumber: 28,
    imageSrc: "/images/company-profile/page_28.jpg",
    highlight: "2/2 mil 极限精细线宽线距 • 万级恒温洁净车间",
    description:
      "紫外激光束直接将 CAD 图形曝光至感光干膜，彻底杜绝传统底片涨缩变形、环境温湿度干扰及菲林对准漂移误差。",
    specs: [
      { label: "最小线宽线距", value: "2 / 2 mil (0.05 mm)" },
      { label: "层间对准精度", value: "± 0.075 mm (±3 mil)" },
      { label: "车间洁净标准", value: "Class 10,000 级恒温恒湿" }
    ],
  },
  {
    id: "solder-screen",
    name: "全自动双面防焊油墨丝印与阻焊产线",
    category: "imaging",
    categoryLabel: "阻焊防焊与表面处理",
    slideNumber: 29,
    imageSrc: "/images/company-profile/page_29.jpg",
    highlight: "4 mil 精密阻焊桥 • 均匀无气泡涂覆",
    description:
      "恒温无尘车间自动化丝网印刷产线，保障高密度走线、细间距 BGA 焊盘及导孔盖油塞孔的阻焊厚度平整度与附着力。",
    specs: [
      { label: "最小阻焊桥", value: "4 mil (0.10 mm)" },
      { label: "对准公差", value: "± 0.075 mm (±3 mil)" },
      { label: "可选阻焊颜色", value: "绿色、蓝色、黑色、白色、红色、哑光" },
      { label: "涂层均匀度", value: "全板偏差 ± 2 µm" },
    ],
  },
  {
    id: "kelvin-testing",
    name: "四线开尔文低电阻微欧级电测系统",
    category: "testing",
    categoryLabel: "电气测试与理化实验室",
    slideNumber: 31,
    imageSrc: "/images/company-profile/page_31.jpg",
    highlight: "微欧级检测灵敏度 • 100% 网络通断网表验证",
    description:
      "专有四端子开尔文传感技术消除测试引线电阻影响，精准捕获镀通孔内部微裂纹、热应力疲劳微开路及厚铜阻值异常。",
    specs: [
      { label: "测量量程", value: "0.1 mΩ 至 100 MΩ" },
      { label: "测试执行标准", value: "IPC-9252 Class 3 级" },
      { label: "绝缘耐压", value: "最高 300 V 隔离绝缘" },
      { label: "网表覆盖率", value: "100% CAD 网表全检" },
    ],
  },
  {
    id: "avi-inspection",
    name: "高速 AVI 全自动光学外观综合检查机",
    category: "testing",
    categoryLabel: "电气测试与理化实验室",
    slideNumber: 32,
    imageSrc: "/images/company-profile/page_32.jpg",
    highlight: "微短路/微开路自动识别 • AI 机器视觉深度学习",
    description:
      "高速线阵彩色相机全速扫描外层蚀刻与阻焊成品板，秒级标记微小铜刺、残铜、鼠咬缺口、针孔及阻焊偏位瑕疵。",
    specs: [
      { label: "光学分辨率", value: "5 µm 级微米像素" },
      { label: "缺陷检出项", value: "开路、短路、缺口、凹坑、残铜" },
      { label: "全板扫描速度", value: "整板亚秒级扫描分析" },
      { label: "复核机制", value: "双工位数字化人机协同复核" },
    ],
  },
  {
    id: "physics-lab",
    name: "物理与化学金相微切片理化实验室",
    category: "testing",
    categoryLabel: "电气测试与理化实验室",
    slideNumber: 33,
    imageSrc: "/images/company-profile/page_33.jpg",
    highlight: "288°C 浮焊热应力试验 • X-Ray 荧光测厚与滴定",
    description:
      "配置完备的金相冷镶嵌、研磨抛光机、金相显微镜、X-Ray 荧光镀层测厚仪及化学镀铜槽液全自动在线滴定系统。",
    specs: [
      { label: "热应力浮焊试验", value: "288°C 10秒 × 3次循环" },
      { label: "金相显微观察", value: "最高 1,000× 显微切片分析" },
      { label: "镀层厚度测量", value: "XRF 荧光金厚/铜厚无损分析" },
      { label: "离子洁净度", value: "ROSE 动态离子污染度测试" },
    ],
  },
  {
    id: "smart-warehouse",
    name: "高密度板材恒温恒湿立体开料中心",
    category: "material",
    categoryLabel: "智能开料与仓储物流",
    slideNumber: 25,
    imageSrc: "/images/company-profile/page_25.jpg",
    highlight: "生益/联茂原厂认证板材 • 恒温恒湿立体储存",
    description:
      "全自动数控剪切开料机与高密度立库，生益FR-4、高TG170、无卤素及PTFE高频微波板材在恒定温湿度环境下储存并严格遵循先进先出。",
    specs: [
      { label: "恒温恒湿控制", value: "温度 22±2°C / 湿度 55±5% RH" },
      { label: "合作品牌板材", value: "生益 (Shengyi)、联茂 (ITEQ)、罗杰斯 (Rogers)" },
      { label: "开料尺寸公差", value: "数控精剪 ±0.20 mm" },
      { label: "全流程追溯", value: "批次二维码精准绑定每片生产板" },
    ],
  },
];

const CATEGORIES_EN = [
  { key: "all", label: "All Machinery (8 Systems)" },
  { key: "drilling", label: "Drilling & Routing" },
  { key: "plating", label: "VCP Copper Plating" },
  { key: "imaging", label: "LDI & Screen Printing" },
  { key: "testing", label: "Testing & Lab" },
  { key: "material", label: "Material & Warehouse" },
];

const CATEGORIES_ZH = [
  { key: "all", label: "全部生产机组 (8 大系统)" },
  { key: "drilling", label: "精密数控钻铣" },
  { key: "plating", label: "VCP 垂直连续电镀" },
  { key: "imaging", label: "LDI 激光成像与丝印" },
  { key: "testing", label: "电气测试与理化室" },
  { key: "material", label: "智能开料与恒温仓库" },
];

export default function InteractiveEquipmentGallery() {
  const { locale } = useLanguage();
  const isZh = locale === "zh";

  const categories = isZh ? CATEGORIES_ZH : CATEGORIES_EN;
  const equipmentData = isZh ? EQUIPMENT_DATA_ZH : EQUIPMENT_DATA_EN;

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMachineId, setSelectedMachineId] = useState<string>("cnc-drilling");

  const selectedMachine =
    equipmentData.find((item) => item.id === selectedMachineId) || equipmentData[0];

  const filteredItems =
    activeCategory === "all"
      ? equipmentData
      : equipmentData.filter((item) => item.category === activeCategory);

  const handleJumpToSlide = (slideNum: number) => {
    const viewerElement = document.getElementById("profile-viewer");
    if (viewerElement) {
      viewerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Pills with Smooth Spring Animation */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.key
                ? "text-white"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-emerald-500/50"
            }`}
          >
            {activeCategory === cat.key && (
              <motion.div
                layoutId="equipCategoryIndicator"
                className="absolute inset-0 rounded-full bg-emerald-600 shadow-md shadow-emerald-600/25"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Machine Showcase Card */}
      <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-12 items-stretch">
          {/* Machine Photo Preview from Slide with Inspection Laser */}
          <div className="lg:col-span-7 relative bg-slate-950 min-h-[320px] sm:min-h-[420px] flex items-center justify-center p-4 overflow-hidden group">
            {/* Animated Laser Scanning Reticle */}
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] pointer-events-none z-20 opacity-70"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMachine.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="relative w-full h-full max-h-[480px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={selectedMachine.imageSrc}
                  alt={selectedMachine.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain bg-black/90 group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </AnimatePresence>

            {/* Slide Badge */}
            <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white border border-white/20">
              <FileText className="size-3 text-emerald-400" />
              <span>
                {isZh
                  ? `官方画册第 ${selectedMachine.slideNumber} 页`
                  : `Brochure Slide ${selectedMachine.slideNumber}`}
              </span>
            </div>

            <button
              onClick={() => handleJumpToSlide(selectedMachine.slideNumber)}
              className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-black shadow-lg backdrop-blur-md transition active:scale-95 cursor-pointer"
            >
              <span>{isZh ? "在42页阅读器中查看" : "View in 42-Page Reader"}</span>
              <ExternalLink className="size-3.5" />
            </button>
          </div>

          {/* Machine Specs & Details with Smooth Motion */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMachine.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-3 py-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-3">
                  <Cpu className="size-3" />
                  <span>{selectedMachine.categoryLabel}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight">
                  {selectedMachine.name}
                </h3>

                <div className="mt-2 text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {selectedMachine.highlight}
                </div>

                <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {selectedMachine.description}
                </p>

                {/* Technical Specifications Matrix */}
                <div className="mt-6 space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    {isZh ? "运行工艺参数与技术极限" : "Operating Parameters & Limits"}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMachine.specs.map((spec, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/60 p-2.5 transition-shadow"
                      >
                        <div className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                          {spec.label}
                        </div>
                        <div className="text-xs font-black text-gray-900 dark:text-white mt-0.5">
                          {spec.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">
                {isZh ? "经 FT PCB 实体工厂实地认证" : "Verified from FT PCB Factory Floor"}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                {isZh ? "正常运行中" : "Operational"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All Machinery Cards with Motion Layout */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredItems.map((item) => {
          const isSelected = selectedMachine.id === item.id;
          return (
            <motion.button
              layout
              key={item.id}
              onClick={() => setSelectedMachineId(item.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-lg"
                  : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40 hover:shadow-md"
              }`}
            >
              <div className="w-full">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-950">
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded">
                    {isZh ? `第 ${item.slideNumber} 页` : `Slide ${item.slideNumber}`}
                  </span>
                </div>

                <div className="text-[10px] font-bold text-gray-400 uppercase">
                  {item.categoryLabel}
                </div>
                <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mt-1 group-hover:text-emerald-600 transition line-clamp-2">
                  {item.name}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {item.highlight.split("•")[0]}
                </span>
                <span className="text-gray-400 group-hover:text-emerald-500 transition">
                  {isZh ? "详情 &rarr;" : "Details &rarr;"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
