import CustomerOrdersManager from "@/components/module/Dashboard/CustomerOrdersManager";

export const metadata = {
  title: "My PCB Orders & Fab Inquiries | Customer Dashboard",
  description: "Track live cleanroom fabrication progress, download engineering CAM specs, and manage rapid prototype orders.",
};

export default function OrdersDashboardPage() {
  return <CustomerOrdersManager />;
}
