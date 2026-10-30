import AdminOrdersManager from "@/components/module/Dashboard/AdminOrdersManager";

export const metadata = {
  title: "Orders & Direct Inquiries Manager | Super Admin Command Center",
  description: "Review live customer PCB orders, factory direct inquiries, and engineering DFM requirements.",
};

export default function SuperAdminOrdersPage() {
  return <AdminOrdersManager />;
}
