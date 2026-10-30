"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Globe2,
  Star,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Zap,
  MapPin,
  Building2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  ThermometerSnowflake,
  Radio,
  FileCheck2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

interface CaseStudy {
  id: string;
  country: string;
  flag: string;
  region: string;
  city: string;
  client: string;
  industry: string;
  author: string;
  role: string;
  rating: number;
  image: string;
  challenge: string;
  solution: string;
  specs: { label: string; value: string }[];
  quote: string;
}

const CASE_STUDIES_EN: CaseStudy[] = [
  {
    id: "germany",
    country: "Germany",
    flag: "🇩🇪",
    region: "Stuttgart, Germany",
    city: "Stuttgart",
    client: "Tier-1 Automotive Lighting Systems",
    industry: "Automotive Electronics (IATF 16949)",
    author: "Dr. Klaus Richter",
    role: "Head of Hardware Engineering",
    rating: 5,
    image: "/images/company-profile/page_35.jpg",
    challenge:
      "Automotive matrix LED headlights operate under extreme thermal fluctuations (-40°C to +125°C). Previous suppliers suffered from through-hole copper barrel cracking and solder mask peeling during reflow.",
    solution:
      "FT PCB deployed continuous Vertical Continuous Plating (VCP) to ensure 25µm+ uniform through-hole copper thickness. Passed 288°C 10-second thermal shock 3 times with zero delamination and 100% four-wire Kelvin netlist continuity.",
    specs: [
      { label: "Standard", value: "IATF 16949:2016" },
      { label: "Board Layers", value: "6-Layer TG170 FR4" },
      { label: "Through-Hole Copper", value: "≥ 25 µm (VCP)" },
      { label: "Thermal Float", value: "288°C × 3 Cycles" },
    ],
    quote:
      "FT PCB has been our certified PCB fabrication partner for automotive matrix LED headlight boards for over 3 years. Their IATF 16949 audit trail is spotless, and their VCP line achieves exceptional through-hole copper thickness uniformity that passes our strict thermal shock testing every single batch.",
  },
  {
    id: "usa",
    country: "United States",
    flag: "🇺🇸",
    region: "Austin, Texas, USA",
    city: "Austin",
    client: "SolarGrid Inverters & Energy Storage",
    industry: "High-Power Electronics",
    author: "Marcus Vance",
    role: "VP of Hardware & Power Electronics",
    rating: 5,
    image: "/images/company-profile/page_37.jpg",
    challenge:
      "Commercial solar inverters handle continuous currents exceeding 150 Amperes, requiring 6 oz heavy copper circuits without trace undercut or thermal solder bridging.",
    solution:
      "FT PCB's engineering team optimized differential chemical etching parameters and heavy copper resin filling, preventing voiding during multi-layer lamination. 50,000 units shipped without a single field defect.",
    specs: [
      { label: "Finished Copper", value: "6 oz (210 µm)" },
      { label: "Dielectric", value: "Shengyi S1000-2M (TG170)" },
      { label: "Surface Finish", value: "Immersion Gold (ENIG)" },
      { label: "E-Test", value: "Dedicated Bed of Nails" },
    ],
    quote:
      "Finding a factory that can reliably build 6 oz heavy copper boards with tight line spacing was difficult until we engaged FT PCB. Their CAM team in Shenzhen provided invaluable DFM recommendations within 2 hours, and our solar converter boards have exhibited zero field failures across 50,000 units.",
  },
  {
    id: "japan",
    country: "Japan",
    flag: "🇯🇵",
    region: "Tokyo, Japan",
    city: "Tokyo",
    client: "Nippon Telecom & Satellite Devices",
    industry: "5G & Satellite High-Frequency",
    author: "Kenji Sato",
    role: "Senior RF Hardware Lead",
    rating: 5,
    image: "/images/company-profile/page_39.jpg",
    challenge:
      "Ku-band satellite transceivers require ultra-low dielectric dissipation and strict microstrip trace impedance tolerances (±5%) across PTFE substrates.",
    solution:
      "Leveraging patent-backed high-frequency processing developed with Shenzhen University, FT PCB implemented plasma surface activation on Rogers 4350B PTFE laminates, achieving high adhesion and strict phase consistency.",
    specs: [
      { label: "Substrate", value: "Rogers RO4350B PTFE" },
      { label: "Impedance Control", value: "±5% Strict Tolerance" },
      { label: "Frequency Range", value: "Ku-Band (12 - 18 GHz)" },
      { label: "Patent Base", value: "#1 5G Patents in Longyan" },
    ],
    quote:
      "We rely on FT PCB's specialized PTFE Teflon circuit boards for our Ku-band satellite transceivers. Professor Chen Jingqiu's research team at Shenzhen University clearly understands microwave signal integrity — the dielectric constant consistency across the panel is on par with the best Japanese specialty fabs.",
  },
  {
    id: "sweden",
    country: "Sweden",
    flag: "🇸🇪",
    region: "Stockholm, Sweden",
    city: "Stockholm",
    client: "RoboTrack Automation Systems",
    industry: "Robotics & Industrial Automation",
    author: "Elena Rostova",
    role: "Principal Embedded Engineer",
    rating: 5,
    image: "/images/company-profile/page_14.jpg",
    challenge:
      "Agile hardware sprint cycles needed 10-layer robotics mainboards manufactured, tested, and delivered into Europe within 96 hours without compromising IPC Class 2 quality.",
    solution:
      "FT PCB activated its 48-Hour Rapid Build protocol. The automated CAM engine verified Gerbers in 45 minutes; live Cloud MES tracking provided real-time station video logs, and DHL Express delivered to Stockholm on day 4.",
    specs: [
      { label: "Turnaround", value: "48-Hour Expedited Fab" },
      { label: "Layer Count", value: "10-Layer Blind/Buried Vias" },
      { label: "Live Tracking", value: "'Yunshang Feitian' MES" },
      { label: "Delivery", value: "DHL Express Air (4 Days)" },
    ],
    quote:
      "The 'Yunshang Feitian' mobile tracking portal gives our remote engineering team total transparency. Seeing live machine photos of our boards during CNC drilling and optical AVI inspection gave us huge confidence. Our 10-layer prototype arrived in Stockholm in just 4 days from Gerber approval.",
  },
  {
    id: "france",
    country: "France",
    flag: "🇫🇷",
    region: "Lyon, France",
    city: "Lyon",
    client: "LumiSense Smart IoT Ecosystem",
    industry: "Turnkey PCBA & Consumer Electronics",
    author: "Antoine Dubois",
    role: "CTO & Co-Founder",
    rating: 5,
    image: "/images/company-profile/page_4.jpg",
    challenge:
      "Managing separate PCB fabrication shops, component procurement distributors, and SMT assembly vendors caused assembly finger-pointing and delayed time-to-market.",
    solution:
      "FT PCB provided full turnkey one-stop manufacturing: fabrication of 4-layer FR4 boards, authorized electronic component procurement, automated high-speed SMT assembly, and 100% 3D X-Ray BGA inspection.",
    specs: [
      { label: "Service", value: "Full Turnkey Box Build" },
      { label: "SMT Capability", value: "0201 Chip / 0.3mm BGA" },
      { label: "Inspection", value: "3D AOI & X-Ray BGA" },
      { label: "Monthly Run", value: "20,000 Units Ramped" },
    ],
    quote:
      "Transitioning from low-volume prototypes to 20,000 unit monthly builds was completely painless. FT PCB's engineering team handled component sourcing, SMT pick-and-place, and X-ray BGA verification flawlessly. Highly recommended for turnkey hardware teams.",
  },
];

const CASE_STUDIES_ZH: CaseStudy[] = [
  {
    id: "germany",
    country: "德国",
    flag: "🇩🇪",
    region: "德国斯图加特",
    city: "斯图加特",
    client: "Tier-1 汽车高阶矩阵大灯照明系统",
    industry: "汽车电子 (IATF 16949 体系)",
    author: "克劳斯·里希特 博士 (Dr. Klaus Richter)",
    role: "硬件工程研发总监",
    rating: 5,
    image: "/images/company-profile/page_35.jpg",
    challenge:
      "车载矩阵 LED 前大灯需在 -40°C 至 +125°C 剧烈温差下全工况运行。此前供应商在回流焊过程中屡次出现孔壁铜层断裂及阻焊脱皮不良。",
    solution:
      "FT PCB 启动垂直连续电镀 (VCP) 生产线，确保通孔孔壁铜厚稳定达到 25µm 以上。顺利通过 288°C 10秒 3次连续热应力浮焊测试，零分层爆板，并经100%四线开尔文低阻导通测试。",
    specs: [
      { label: "认证体系", value: "IATF 16949:2016" },
      { label: "电路层数", value: "6层 生益高TG170 FR4" },
      { label: "通孔铜厚", value: "≥ 25 µm (VCP电镀)" },
      { label: "热应力试验", value: "288°C × 3 次循环" },
    ],
    quote:
      "FT PCB 作为我们车规级矩阵大灯核心电路板认证代工伙伴已有3年多。他们的 IATF 16949 生产审计台账严谨完整，VCP 垂直连续电镀线实现的孔壁铜厚均匀度极其出色，每批次都顺利通过我们严苛的热冲击试验。",
  },
  {
    id: "usa",
    country: "美国",
    flag: "🇺🇸",
    region: "美国得克萨斯州奥斯汀",
    city: "奥斯汀",
    client: "SolarGrid 商用光伏逆变器与储能系统",
    industry: "大功率工业电源与新能源电子",
    author: "马库斯·万斯 (Marcus Vance)",
    role: "硬件与大功率电子副总裁",
    rating: 5,
    image: "/images/company-profile/page_37.jpg",
    challenge:
      "商用光伏逆变系统持续工作电流超 150 安培，必须采用 6 oz 超厚铜电路，严防线路侧蚀以及大焊盘热应力虚焊桥接。",
    solution:
      "FT PCB 工程团队针对差异化化学微蚀参数与超厚铜树脂压合填胶工艺进行专门优化，彻底消除多层压合内部气泡空洞。累计交付超 50,000 套零现场客诉。",
    specs: [
      { label: "成品铜厚", value: "6 oz (210 µm) 超厚铜" },
      { label: "板材牌号", value: "生益 S1000-2M (高TG170)" },
      { label: "表面工艺", value: "化学沉金 (ENIG 沉金)" },
      { label: "电气测试", value: "专用治具 100% 针床电测" },
    ],
    quote:
      "在接触 FT PCB 之前，极少有工厂能在超厚铜板上把密间距走线和无空洞树脂塞孔控制得如此可靠。深圳 CAM 团队在下单 2 小时内给出的优化建议非常专业，我们 5 万多套逆变器至今零返修。",
  },
  {
    id: "japan",
    country: "日本",
    flag: "🇯🇵",
    region: "日本东京都",
    city: "东京",
    client: "日本电信与低轨卫星通信射频单元",
    industry: "5G 与卫星微波高频通信",
    author: "佐藤健二 (Kenji Sato)",
    role: "资深射频微波硬件主管",
    rating: 5,
    image: "/images/company-profile/page_39.jpg",
    challenge:
      "Ku 波段卫星收发机对介质损耗角正切与微带线特征阻抗公差 (±5%) 有着极其苛刻的毫米级一致性要求。",
    solution:
      "依托与深圳大学联合攻关的高频专利成果，FT PCB 在 Rogers 4350B PTFE 板材上采用高真空等离子体表面活化改性工艺，实现极高结合力与稳定的高频相位一致性。",
    specs: [
      { label: "高频板材", value: "Rogers RO4350B PTFE" },
      { label: "阻抗精度", value: "±5% 严苛公差" },
      { label: "工作频段", value: "Ku 波段 (12 - 18 GHz)" },
      { label: "技术底蕴", value: "龙岩市 5G 专利数量第一" },
    ],
    quote:
      "我们高度依赖 FT PCB 生产的特种 PTFE 特氟龙电路板。深圳大学工程实验室在微波信号完整性上的造诣令人赞叹，介电常数在全板面上的均匀性完全媲美日本顶尖特种电路板厂。",
  },
  {
    id: "sweden",
    country: "瑞典",
    flag: "🇸🇪",
    region: "瑞典斯德哥尔摩",
    city: "斯德哥尔摩",
    client: "RoboTrack 工业智能机器人控制主板",
    industry: "智能机器人与工业自动化",
    author: "埃琳娜·罗斯托娃 (Elena Rostova)",
    role: "首席嵌入式系统工程师",
    rating: 5,
    image: "/images/company-profile/page_14.jpg",
    challenge:
      "敏捷硬件研发周期要求 10 层精密机器人主板在 96 小时内完成试产、全检并空运直达欧洲，且必须符合 IPC 2 级标准。",
    solution:
      "FT PCB 启动 48 小时加急快件制造流程。CAM 智能引擎 45 分钟完成工程解析与拼板优化；“云上飞天”MES 实时提供工位视频与进度追溯，DHL 专线第 4 天上午送达斯德哥尔摩。",
    specs: [
      { label: "制造时效", value: "48小时 极速出厂" },
      { label: "多层工艺", value: "10层 盲埋孔高密度板" },
      { label: "实时追踪", value: "“云上飞天”全流程二维码" },
      { label: "空运派送", value: "DHL 航运直达 (第4天签收)" },
    ],
    quote:
      "“云上飞天”手机追踪端给海外工程团队带来了空前的确定感。能随时调取数控钻孔与 AVI 光学检查的高清实测图像，让我们对品质充满信心。10层样板第4天就运到了斯德哥尔摩并一次点亮。",
  },
  {
    id: "france",
    country: "法国",
    flag: "🇫🇷",
    region: "法国里昂",
    city: "里昂",
    client: "LumiSense 智能物联网硬件生态",
    industry: "一站式 PCBA 代工与消费级物联网",
    author: "安托万·杜波依斯 (Antoine Dubois)",
    role: "首席技术官兼联合创始人",
    rating: 5,
    image: "/images/company-profile/page_4.jpg",
    challenge:
      "之前分别对接电路板厂、元器件代理商与 SMT 贴片加工厂，多头沟通互相推诿，导致试产严重滞后。",
    solution:
      "FT PCB 提供真正一站式交钥匙智造服务：4 层 FR4 精密制板、原厂正品元器件配齐代采、高速贴片机 SMT 贴装，以及 100% 3D X-Ray 检查 BGA 焊点。",
    specs: [
      { label: "服务模式", value: "一站式 PCBA 交钥匙代工" },
      { label: "贴装能力", value: "0201 微阻容 / 0.3mm BGA" },
      { label: "无损检测", value: "3D AOI 与 X-Ray BGA 探伤" },
      { label: "月度交付", value: "月交付 20,000 套爬坡量产" },
    ],
    quote:
      "从研发打样平稳爬坡至每月 2 万套量产，整个过程极为省心。FT PCB 团队将板材制造、BOM 配齐代采与 X-Ray BGA 焊接无损探伤无缝整合，强烈推荐给寻求一站式代工的硬件团队。",
  },
];

export default function GlobalCaseStudiesMap() {
  const { locale } = useLanguage();
  const isZh = locale === "zh";

  const caseStudies = isZh ? CASE_STUDIES_ZH : CASE_STUDIES_EN;
  const [selectedId, setSelectedId] = useState<string>("germany");
  const selectedStudy = caseStudies.find((s) => s.id === selectedId) || caseStudies[0];

  return (
    <div className="w-full space-y-10">
      {/* Country Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {caseStudies.map((study) => {
          const isSelected = study.id === selectedId;
          return (
            <button
              key={study.id}
              onClick={() => setSelectedId(study.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all border cursor-pointer ${
                isSelected
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xl scale-[1.03]"
                  : "bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              <span className="text-base">{study.flag}</span>
              <span>{study.country}</span>
              <span className="text-[11px] opacity-70 hidden sm:inline">({study.city})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Case Study Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStudy.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden"
        >
          <div className="grid lg:grid-cols-12">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[500px] bg-slate-950 flex flex-col justify-between p-6 overflow-hidden">
              <Image
                src={selectedStudy.image}
                alt={`${selectedStudy.country} Project - ${selectedStudy.client}`}
                fill
                className="object-cover opacity-60 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Badges Overlay */}
              <div className="relative z-10 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                  <MapPin className="size-3 text-emerald-400" />
                  <span>{selectedStudy.region}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold">
                  <ShieldCheck className="size-3" />
                  <span>{isZh ? "实测批量生产验证" : "Verified Production Run"}</span>
                </div>
              </div>

              {/* Bottom Project Overlay */}
              <div className="relative z-10 space-y-2 pt-12">
                <div className="text-xs uppercase tracking-widest font-black text-emerald-400">
                  {selectedStudy.industry}
                </div>
                <div className="text-2xl font-black text-white">
                  {selectedStudy.client}
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(selectedStudy.rating)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-white ml-2">
                    {isZh ? "5.0 / 5.0 卓越质量评级" : "5.0 / 5.0 Quality Rating"}
                  </span>
                </div>
              </div>
            </div>

            {/* Case Study Details Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Author Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedStudy.author}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {selectedStudy.role} • {selectedStudy.client}
                    </p>
                  </div>
                  <div className="text-3xl font-serif text-emerald-500 select-none">“</div>
                </div>

                {/* Direct Quote */}
                <blockquote className="text-sm sm:text-base italic leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border-l-4 border-emerald-500">
                  &quot;{selectedStudy.quote}&quot;
                </blockquote>

                {/* Challenge & Solution Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <Zap className="size-3.5" />
                      <span>{isZh ? "工程技术挑战" : "Technical Challenge"}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedStudy.challenge}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                    <div className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" />
                      <span>{isZh ? "FT PCB 解决方案" : "FT PCB Solution"}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedStudy.solution}
                    </p>
                  </div>
                </div>

                {/* Engineering Specifications Matrix */}
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Cpu className="size-3.5" />
                    <span>{isZh ? "实测工程制造参数" : "Verified Engineering Tolerances"}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedStudy.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center"
                      >
                        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {spec.label}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <FileCheck2 className="size-4 text-emerald-600" />
                  <span>
                    {isZh
                      ? "承诺符合 IPC 2/3 级与车规级制造标准"
                      : "IPC Class 2/3 & Automotive Standard Guaranteed"}
                  </span>
                </div>
                <Button asChild size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer">
                  <Link href="/pcb-quote">
                    {isZh ? "获取同类项目报价" : "Quote Similar Project"}{" "}
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
