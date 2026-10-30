import type { Metadata } from "next";
import PcbProcessFlowchart from "@/components/module/pcb/PcbProcessFlowchart";

export const metadata: Metadata = {
  title: "PCB生产工艺流程圖 | PCB Production Process Flow Chart | 武平飞天电子科技 Wuping Feitian",
  description:
    "武平飞天电子科技有限公司 (Wuping Feitian Electronic Technology Co.,Ltd) 官方PCB生产工艺流程圖与SOP工序参数表。涵盖双面板与多层板全流程制作规范。",
  keywords: [
    "武平飞天电子科技有限公司",
    "Wuping Feitian Electronic Technology Co.,Ltd",
    "PCB生产工艺流程圖",
    "PCB Production Process Flow Chart",
    "PCB Process Flowchart",
  ],
};

export default function ProcessFlowchartShortcutPage() {
  return <PcbProcessFlowchart />;
}

