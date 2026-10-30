import type { Metadata } from "next";
import PartnershipClient from "@/components/module/about/PartnershipClient";

export const metadata: Metadata = {
  title: "Strategic Partnership: FT PCB & BSY Tech | Hardware Ecosystem Alliance | FT PCB",
  description:
    "FT PCB & BSY Tech Strategic Partnership: Closing the gap between hardware design and factory production. Eliminating hand-off friction from layout to verified hardware with zero design compromises.",
  keywords: [
    "Strategic Partnership FT PCB BSY Tech",
    "FT PCB BSY Tech",
    "Hardware Design and Factory Production",
    "FT PCB Partnership",
    "PCB Distributor Program",
    "EMS Contract Manufacturing Partner",
    "Hardware Incubator PCB",
    "www.bsytech.com",
  ],
};

export default function PartnershipPage() {
  return <PartnershipClient />;
}
