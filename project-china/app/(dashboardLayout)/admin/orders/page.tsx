import AdminOrdersManager from "@/components/module/Dashboard/AdminOrdersManager";

export const metadata = {
  title: "Orders & Direct Inquiries Manager | FT PCB Admin",
  description: "Review customer orders, direct factory inquiries, and DFM engineering review requests.",
};

export default function AdminOrdersPage() {
  return <AdminOrdersManager />;
}
