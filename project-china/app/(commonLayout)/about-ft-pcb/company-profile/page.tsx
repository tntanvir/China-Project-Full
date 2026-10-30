import type { Metadata } from "next";
import AboutFtPcbClient from "@/components/module/about/AboutFtPcbClient";

export const metadata: Metadata = {
  title: "Company Profile | FT PCB Corporate Dossier & Monograph",
  description:
    "Explore FT PCB's 42-slide interactive corporate profile, 28-year manufacturing history, 15,000m² Wuping production base, IATF 16949 certification, and Shenzhen University R&D.",
  keywords: [
    "FT PCB Company Profile",
    "PCB Factory Profile PDF",
    "Wuping Feitian Electronic Technology",
    "IATF 16949 PCB Manufacturer",
    "China PCB Factory Dossier",
  ],
};

export default function CompanyProfilePage() {
  return <AboutFtPcbClient />;
}
