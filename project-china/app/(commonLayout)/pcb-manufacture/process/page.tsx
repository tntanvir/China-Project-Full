import type { Metadata } from "next";
import PcbProcessFlowchart from "@/components/module/pcb/PcbProcessFlowchart";

export const metadata: Metadata = {
  title: "PCB Production Process | FT PCB",
  description: "Standard Multilayer Printed Circuit Board Fabrication, In-Line Inspection, and Quality Assurance Gates.",
};

export default function PcbProcessPage() {
  return <PcbProcessFlowchart />;
}

