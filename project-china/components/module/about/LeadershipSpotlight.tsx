"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Cpu,
  Mail,
  Phone,
  CheckCircle2,
  Quote,
  FileText,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface Leader {
  id: string;
  name: string;
  role: string;
  title: string;
  slideRef: number;
  image: string;
  quote: string;
  bio: string;
  academic: string[];
  patents: string[];
}

const LEADERS_EN: Leader[] = [
  {
    id: "chen-jingqiu",
    name: "Prof. Chen Jingqiu",
    role: "Chairman & Chief Scientist",
    title: "PhD in Engineering • Professor at Shenzhen University",
    slideRef: 19,
    image: "/images/company-profile/page_19.jpg",
    quote: "True industrial precision is born at the intersection of rigorous university polymer science and real-time automated cloud control.",
    bio: "Doctor of Engineering from Huazhong University of Science and Technology. Professor and postgraduate research supervisor at Shenzhen University. With over 30 years dedicated to PCB polymer chemistry and signal integrity, Professor Chen is the principal inventor behind Longyan City's highest portfolio of 5G invention patents and the architect of FT PCB's proprietary 'Yunshang Feitian' Cloud MES.",
    academic: [
      "PhD, Huazhong University of Science and Technology",
      "Professor & Postgraduate Supervisor, Shenzhen University",
      "Specialist in 5G PTFE Teflon low-loss substrates",
    ],
    patents: [
      "Sole certified 5G PTFE microwave circuit R&D base in Longyan",
      "Patent on automated microvia copper barrel throwing power control",
      "Creator of Yunshang Feitian dynamic production scheduling algorithm",
    ],
  },
  {
    id: "he-liangying",
    name: "He Liangying",
    role: "Co-Founder & Supervisor",
    title: "Director of Global Operations & Quality Assurance",
    slideRef: 17,
    image: "/images/company-profile/page_17.jpg",
    quote: "Every circuit board leaving our factory base carries our reputation for zero-defect reliability across global Tier-1 hardware ecosystems.",
    bio: "Brings over 20 years of executive operational leadership spanning prominent American, Hong Kong, and domestic printed circuit board manufacturers. Oversees strategic factory logistics, customer partnerships across 50+ countries, and strict enforcement of IATF 16949 automotive quality standards.",
    academic: [
      "20+ Years senior management in multinational PCB corporations",
      "Certified IATF 16949 & IPC Class 3 quality system director",
      "Global logistics coordinator linking Wuping, Shenzhen & Xiamen",
    ],
    patents: [
      "Standardized 24-48h quick-turn high-mix CAM routing workflow",
      "Zero-defect automotive process control methodology",
    ],
  },
  {
    id: "zhang-huaiming",
    name: "Zhang Huaiming",
    role: "VP of Manufacturing Operations",
    title: "Head of 15,000m² Wuping Production Campus",
    slideRef: 14,
    image: "/images/company-profile/page_14.jpg",
    quote: "Automated precision requires zero shortcuts: from insoluble titanium VCP anodes to 200,000 RPM air-bearing drilling spindles.",
    bio: "25+ years semiconductor and PCB factory management veteran. Leads the daily operations of FT PCB's 3 standardized manufacturing buildings, optimizing vertical continuous plating (VCP), high-density laminate conditioning, and automated optical visual inspection (AVI).",
    academic: [
      "Senior engineer in automated chemical electroplating",
      "Former operations director at top Tier-1 multi-layer facilities",
      "Directs 300+ precision manufacturing technicians in Wuping",
    ],
    patents: [
      "Automated continuous copper bath titration monitoring",
      "Zero-discharge environmental wastewater recycling implementation",
    ],
  },
  {
    id: "liu-guogang",
    name: "Liu Guogang",
    role: "Chief Technology Officer (CTO)",
    title: "Senior CAM & High-Frequency Signal Integrity Engineer",
    slideRef: 20,
    image: "/images/company-profile/page_20.jpg",
    quote: "A flawless board starts with flawless CAM rules: we verify 120+ DFM engineering checks within 2 hours of file arrival.",
    bio: "Heads FT PCB's 45-member CAM department. Specializes in multi-layer impedance modeling (±5%), 30-layer high-density backplanes, heavy copper thermal dissipation (up to 10 oz), and high-frequency microwave radar boards.",
    academic: [
      "Senior Member, China Electronic Circuit Industry Association",
      "Expert in Polar SI9000 differential impedance modeling",
      "Directs CAM engineering offices in Wuping and Xiamen",
    ],
    patents: [
      "High-speed 12:1 aspect ratio through-hole drilling compensation",
      "Heavy copper thermal-relief trace optimization for power inverters",
    ],
  },
];

const LEADERS_ZH: Leader[] = [
  {
    id: "chen-jingqiu",
    name: "陈景秋 教授",
    role: "董事长兼首席科学家",
    title: "工学博士 • 深圳大学教授、硕士生导师",
    slideRef: 19,
    image: "/images/company-profile/page_19.jpg",
    quote: "真正的工业精密，源自严谨的高校高分子材料科学与实时云端智能调度的深度融合。",
    bio: "华中科技大学工学博士，深圳大学教授、硕士生导师。从事PCB高分子材料化学及信号完整性研究逾30年。陈教授是龙岩市拥有5G发明专利最多的专家领军人物，并主导研发了自主知识产权的“云上飞天”智能工业云MES系统。",
    academic: [
      "华中科技大学 工学博士",
      "深圳大学教授、硕士研究生导师",
      "5G微波PTFE聚四氟乙烯低损耗高频高多层基板材料专家",
    ],
    patents: [
      "闽西唯一经认定的5G高频微波电路板产学研联合研发基地",
      "微孔高深径比连续电镀深镀能力专利",
      "“云上飞天”智能动态排产算法创立者",
    ],
  },
  {
    id: "he-liangying",
    name: "何良营",
    role: "联合创始人兼监事长",
    title: "全球制造运营与品质保障总监",
    slideRef: 17,
    image: "/images/company-profile/page_17.jpg",
    quote: "从我们基地出厂的每一片电路板，都承载着全球Tier-1硬件客户对零缺陷严苛品质的托付。",
    bio: "拥有20余年美资、港资及国内大型知名PCB上市制造企业的全制程生产运营管理经验。全面统筹工厂精益制造、50多个国家客户服务以及IATF 16949汽车级质量体系的严苛执行。",
    academic: [
      "20余年跨国大型PCB集团高级制造运营实战经验",
      "IATF 16949与IPC Class 3级国际体系质量专家",
      "主导武平实体工厂与深圳、厦门全球服务中心的联动响应",
    ],
    patents: [
      "标准化24-48小时多品种中小批量CAM极速审核流水线",
      "全流程汽车级防错与品质管控管理法",
    ],
  },
  {
    id: "zhang-huaiming",
    name: "张怀明",
    role: "制造运营副总裁",
    title: "武平15,000m²制造基地负责人",
    slideRef: 14,
    image: "/images/company-profile/page_14.jpg",
    quote: "精密制造绝无捷径：从不溶性钛阳极VCP垂直连续电镀，到20万转空气轴承数控钻孔，步步严控。",
    bio: "25年半导体与印制电路板大厂现场管理实战专家。统领FT PCB武平3栋标准化生产车间日常运营，持续优化垂直连续电镀（VCP）、高密度板压合、全自动光学外观检（AVI）等工序。",
    academic: [
      "精密化学电镀与材料表面处理资深高级工程师",
      "曾任国内头部高多层板厂一线制造运营总监",
      "统领武平生产基地300余名精密制造技师团队",
    ],
    patents: [
      "全自动连续铜缸浓度在线分析滴定补给系统",
      "工厂工业废水零排放生态循环再利用体系",
    ],
  },
  {
    id: "liu-guogang",
    name: "刘国刚",
    role: "首席技术官 (CTO)",
    title: "资深CAM与高频信号完整性专家",
    slideRef: 20,
    image: "/images/company-profile/page_20.jpg",
    quote: "高品质好板始于严苛的CAM规则：文件送达后2小时内即可完成120+项自动化DFM可制造性工程审查。",
    bio: "领导FT PCB 45名CAM资深工程师团队。专精于多层阻抗精准建模（±5%以内）、30层超高层背板、10oz超厚铜大电流散热设计及高频微波雷达板的工程设计。",
    academic: [
      "中国电子电路行业协会（CPCA）资深技术委员",
      "精通Polar SI9000差分阻抗精确建模仿真",
      "主导武平与厦门两地CAM工程技术服务中心",
    ],
    patents: [
      "高速背钻12:1大厚径比通孔数控钻削补偿算法",
      "厚铜电源逆变器热阻隔离布线设计优化",
    ],
  },
];

export default function LeadershipSpotlight() {
  const { locale } = useLanguage();
  const leaders = locale === "zh" ? LEADERS_ZH : LEADERS_EN;
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>("chen-jingqiu");
  const selectedLeader = leaders.find((l) => l.id === selectedLeaderId) || leaders[0];

  return (
    <div className="space-y-8">
      {/* Horizontal Avatar Selector Dock */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {leaders.map((leader) => {
          const isSelected = leader.id === selectedLeader.id;
          return (
            <button
              key={leader.id}
              onClick={() => setSelectedLeaderId(leader.id)}
              className={`flex items-center gap-3 p-2.5 pr-5 rounded-2xl border text-left transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-md"
                  : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40"
              }`}
            >
              <div className="relative size-12 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="text-xs font-black text-gray-900 dark:text-white">
                  {leader.name}
                </div>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {leader.role}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Leader Spotlight Display */}
      <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-12 items-stretch">
          {/* Photo & Quote Card */}
          <div className="lg:col-span-5 relative bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-white/10 mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedLeader.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.28 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={selectedLeader.image}
                    alt={selectedLeader.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 text-white">
              <Quote className="size-5 text-emerald-400 mb-1 opacity-80" />
              <p className="text-xs leading-relaxed italic text-slate-200">
                "{selectedLeader.quote}"
              </p>
            </div>

            <div className="absolute top-8 right-8 inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-white border border-white/20">
              <FileText className="size-3 text-emerald-400" />
              <span>{locale === "zh" ? `官方画册第 ${selectedLeader.slideRef} 页` : `Slide ${selectedLeader.slideRef}`}</span>
            </div>
          </div>

          {/* Leader In-Depth Dossier */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLeader.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 px-3 py-1 text-[11px] font-black text-purple-700 dark:text-purple-300 mb-2">
                    <GraduationCap className="size-3" />
                    <span>{locale === "zh" ? "核心科研与产业领军阵容" : "Academic & Technical Leadership"}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                    {selectedLeader.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedLeader.role} • {selectedLeader.title}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  {selectedLeader.bio}
                </p>

                {/* Academic Highlights */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    {locale === "zh" ? "学术资质与前沿研究方向" : "Academic Qualifications & Research Focus"}
                  </span>
                  <div className="space-y-1.5">
                    {selectedLeader.academic.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-slate-300">
                        <CheckCircle2 className="size-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Patents & Systems */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    {locale === "zh" ? "主导研发发明专利与工业系统" : "Patents & Engineering Systems Engineered"}
                  </span>
                  <div className="space-y-1.5">
                    {selectedLeader.patents.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-slate-300">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-400">
              <span>{locale === "zh" ? "官方专家委员会权威备案" : "Verified Executive Faculty"}</span>
              <span className="font-mono text-emerald-600 font-bold">{locale === "zh" ? "深圳大学产学研战略合作基地" : "Shenzhen University Collaboration"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
