import CustomerGerberManager from "@/components/module/Dashboard/CustomerGerberManager";

export const metadata = {
  title: "Gerber Files & DFM Analysis | Customer Dashboard",
  description: "Upload manufacturing archives, track automated DFM reviews, and download verified CAM packages.",
};

export default function GerberDashboardPage() {
  return <CustomerGerberManager />;
}
