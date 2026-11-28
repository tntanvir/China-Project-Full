import type { Metadata } from "next";
import PcbProcessFlowchart from "@/components/module/pcb/PcbProcessFlowchart";

export const metadata: Metadata = {
  title: "PCB Production Process Flow Chart | Wuping Feitian Electronic Technology",
  description:
    "Wuping Feitian Electronic Technology Co.,Ltd official PCB production process flow chart & SOP parameter sheet for double-sided and multilayer PCBs.",
  keywords: [
    "Feitian PCB",
    "Wuping Feitian Electronic Technology Co.,Ltd",
    "PCB生产工艺流程圖",
    "PCB Production Process Flow Chart",
    "PCB Process Flowchart",
  ],
};

export default function ProcessFlowchartShortcutPage() {
  return <PcbProcessFlowchart />;
}

