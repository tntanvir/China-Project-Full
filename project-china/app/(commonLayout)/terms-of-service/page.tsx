import type { Metadata } from "next";
import LegalDocumentLayout from "@/components/module/Legal/LegalDocumentLayout";
import { termsOfServiceData } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Terms of Service | Wuping Feitian Electronic Technology Co., Ltd. (FT PCB)",
  description:
    "Terms of Service covering PCB/PCBA quoting, CAM DFM verification, IPC Class 2/3 manufacturing tolerances, shipping, IP protection, and warranty.",
};

export default function TermsOfServicePage() {
  return <LegalDocumentLayout document={termsOfServiceData} />;
}
