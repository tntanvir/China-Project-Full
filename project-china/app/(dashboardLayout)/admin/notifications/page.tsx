import NotificationsManager from "@/components/module/Dashboard/NotificationsManager";

export const metadata = {
  title: "Admin Notifications Center | JLC PCB",
  description: "Monitor customer quotes, support tickets, orders, and system activities in real time.",
};

export default function AdminNotificationsPage() {
  return <NotificationsManager />;
}
