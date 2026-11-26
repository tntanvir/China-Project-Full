import CustomerCartManager from "@/components/module/Dashboard/CustomerCartManager";

export const metadata = {
  title: "My Shopping Cart | Customer Dashboard",
  description: "Review selected PCB products, update quantities, and proceed to factory fulfillment.",
};

export default function CartDashboardPage() {
  return <CustomerCartManager />;
}
