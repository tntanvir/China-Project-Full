import CustomerQuotesManager from "@/components/module/Dashboard/CustomerQuotesManager";

export const metadata = {
  title: "My PCB Quotes & Calculations | Customer Dashboard",
  description: "Review saved PCB quotes, inspect board dimensions and layer stackups, and convert saved configurations into active orders.",
};

export default function QuotesDashboardPage() {
  return <CustomerQuotesManager />;
}
