import type { Metadata } from "next";
import HowItWorksClient from "@/components/module/about/HowItWorksClient";

export const metadata: Metadata = {
  title: "How It Works | Fast, High Quality & Direct PCB Manufacturing | FT PCB",
  description:
    "Explore how FT PCB works: from online Gerber quote and 2-hour CAM DFM review to smart factory multilayer fabrication, turnkey SMT assembly, 4-wire Kelvin testing, and express worldwide delivery.",
  keywords: [
    "How PCB Works",
    "PCB Manufacturing Process",
    "FT PCB How It Works",
    "Turnkey PCBA Workflow",
    "Gerber File Upload",
    "DFM Engineering Check",
    "Direct PCB Factory",
  ],
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
