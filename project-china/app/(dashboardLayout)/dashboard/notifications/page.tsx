import NotificationsManager from "@/components/module/Dashboard/NotificationsManager";

export const metadata = {
  title: "Notifications Hub | JLC PCB",
  description: "View real-time alerts for quotes, orders, CAM reviews, and support updates.",
};

export default function NotificationsDashboardPage() {
  return <NotificationsManager />;
}
