import type { Metadata } from "next";
import PcbProcessFlowchart from "@/components/module/pcb/PcbProcessFlowchart";

export const metadata: Metadata = {
  title: "PCB生产工艺流程圖 | PCB Production Process Flow Chart | 武平飞天电子科技 Wuping Feitian",
  description:
    "武平飞天电子科技有限公司 (Wuping Feitian Electronic Technology Co.,Ltd) 官方PCB生产工艺流程圖与SOP工序参数表。涵盖开料、内层微影、真空层压、CNC钻孔、化学沉铜、VCP垂直连续电镀、图形电镀、外层蚀刻、阻焊印刷、表面处理、100%电测与FQC出货全流程。",
  keywords: [
    "武平飞天电子科技有限公司",
    "Wuping Feitian Electronic Technology Co.,Ltd",
    "PCB生产工艺流程圖",
    "PCB Production Process Flow Chart",
    "PCB Process Flowchart",
    "PCB SOP",
    "Multilayer PCB Fabrication Process",
    "VCP Plating",
    "IPC-A-600 Quality Gates",
  ],
  openGraph: {
    title: "武平飞天电子科技有限公司 PCB生产工艺流程圖 (PCB Production Process Flow Chart)",
    description:
      "Wuping Feitian Electronic Technology Co.,Ltd official multilayer PCB production process flow chart, interactive diagram, and XLS spreadsheet SOP.",
    type: "article",
  },
};

export default function ProcessFlowchartPage() {
  return <PcbProcessFlowchart />;
}
