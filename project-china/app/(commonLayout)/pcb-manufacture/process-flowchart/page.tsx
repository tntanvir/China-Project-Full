import type { Metadata } from "next";
import PcbProcessFlowchart from "@/components/module/pcb/PcbProcessFlowchart";

export const metadata: Metadata = {
  title: "PCB Production Process Flow Chart | Wuping Feitian Electronic Technology",
  description:
    "Wuping Feitian Electronic Technology Co.,Ltd official PCB production process flow chart & SOP parameter sheet. Covers cutting, inner imaging, lamination, CNC drilling, PTH, VCP plating, outer etching, solder mask, surface finish, E-test, and FQC.",
  keywords: [
    "Feitian PCB",
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
    title: "PCB Production Process Flow Chart | Wuping Feitian Electronic Technology Co.,Ltd",
    description:
      "Wuping Feitian Electronic Technology Co.,Ltd official multilayer PCB production process flow chart, interactive diagram, and XLS spreadsheet SOP.",
    type: "article",
  },
};

export default function ProcessFlowchartPage() {
  return <PcbProcessFlowchart />;
}
