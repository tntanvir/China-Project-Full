import type { Metadata } from "next";
import AboutFtPcbClient from "@/components/module/about/AboutFtPcbClient";

export const metadata: Metadata = {
  title: "About FT PCB | Complete Corporate Profile & Capabilities",
  description:
    "FT PCB (Wuping Feitian Electronic Technology Co., Ltd.) - National High-Tech & Little Giant PCB manufacturer. 15,000m² factory campus, 100,000m²/mo output, IATF 16949 certified, 2L-30L precision PCBs, Shenzhen University R&D.",
  keywords: [
    "FT PCB",
    "FT-PCB",
    "China PCB Manufacturer",
    "Company Profile PDF",
    "IATF 16949 PCB",
    "Shenzhen University PCB",
    "High Precision PCB Turnkey",
  ],
};

export default function AboutPage() {
  return <AboutFtPcbClient />;
}
