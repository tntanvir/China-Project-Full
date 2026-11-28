import type { Metadata } from "next";
import LegalDocumentLayout from "@/components/module/Legal/LegalDocumentLayout";
import { privacyPolicyData } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Privacy Policy | Wuping Feitian Electronic Technology Co., Ltd. (FT PCB)",
  description:
    "Learn how Wuping Feitian Electronic Technology Co., Ltd. protects customer account data, payment security, and Gerber/BOM intellectual property.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentLayout document={privacyPolicyData} />;
}
