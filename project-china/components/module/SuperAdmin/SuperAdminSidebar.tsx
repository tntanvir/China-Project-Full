"use client";

import {
  LayoutDashboard,
  BarChart3,
  FileBarChart,
  Users,
  ShieldCheck,
  KeyRound,
  UserCheck,
  PackageSearch,
  Layers,
  ShoppingCart,
  Quote,
  FileCode2,
  TicketPercent,
  Banknote,
  CreditCard,
  Truck,
  Receipt,
  Headset,
  Bell,
  Newspaper,
  BookOpen,
  HelpCircle,
  Languages,
  CircleDollarSign,
  Globe,
  Percent,
  Activity,
  ShieldAlert,
  Server,
  Database,
  RefreshCw,
  Wifi,
  ListTree,
  HardDriveDownload,
  Settings,
  User,
  LogOut,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuthStore } from "@/store/authStore";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/super-admin", icon: LayoutDashboard },
      { title: "Analytics", url: "/super-admin/analytics", icon: BarChart3 },
      { title: "Reports", url: "/super-admin/reports", icon: FileBarChart },
    ],
  },
  {
    label: "User Management",
    items: [
      { title: "Admins", url: "/super-admin/admins", icon: Users },
      { title: "Customers", url: "/super-admin/customers", icon: UserCheck },
    ],
  },
  {
    label: "Product & Sales",
    items: [
      { title: "Products", url: "/super-admin/products", icon: PackageSearch },
      { title: "Categories", url: "/super-admin/categories", icon: Layers },
      { title: "Orders", url: "/super-admin/orders", icon: ShoppingCart },
      { title: "Coupons", url: "/super-admin/coupons", icon: TicketPercent },
      { title: "Pricing Rules", url: "/super-admin/pricing-rules", icon: Percent },
    ],
  },
  {
    label: "Finance & Shipping",
    items: [
      { title: "Payments", url: "/super-admin/payments", icon: Banknote },
      { title: "Gateways", url: "/super-admin/gateways", icon: CreditCard },
      { title: "Shipping", url: "/super-admin/shipping", icon: Truck },
      { title: "Tax Settings", url: "/super-admin/taxes", icon: Receipt },
    ],
  },
  {
    label: "Content & Support",
    items: [
      { title: "Support Tickets", url: "/super-admin/tickets", icon: Headset },
      { title: "Blogs", url: "/super-admin/blogs", icon: Newspaper },
      { title: "CMS Pages", url: "/super-admin/cms", icon: BookOpen },
      { title: "FAQ", url: "/super-admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Localization",
    items: [
      { title: "Languages", url: "/super-admin/languages", icon: Languages },
      { title: "Currencies", url: "/super-admin/currencies", icon: CircleDollarSign },
      { title: "Countries", url: "/super-admin/countries", icon: Globe },
    ],
  },
  {
    label: "System & Monitoring",
    items: [
      { title: "Activity Logs", url: "/super-admin/logs/activity", icon: Activity },
      { title: "Security Logs", url: "/super-admin/logs/security", icon: ShieldAlert },
      { title: "Server", url: "/super-admin/monitoring/server", icon: Server },
      { title: "Database", url: "/super-admin/monitoring/database", icon: Database },
      { title: "Redis", url: "/super-admin/monitoring/redis", icon: RefreshCw },
      { title: "WebSocket", url: "/super-admin/monitoring/websocket", icon: Wifi },
      { title: "Queue", url: "/super-admin/monitoring/queue", icon: ListTree },
      { title: "Backups", url: "/super-admin/backups", icon: HardDriveDownload },
      { title: "Settings", url: "/super-admin/settings", icon: Settings },
    ],
  },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <div className="flex items-center gap-2 px-2 overflow-hidden w-full">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
            WF
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm">Feitian Electronic</span>
            <span className="text-xs text-muted-foreground">Super Admin</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {menuGroups.map((group) => (
          <Collapsible key={group.label} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild className="group/label text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 hover:text-foreground transition-colors cursor-pointer">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  {group.label}
                  <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="hover:bg-primary/10 hover:text-primary transition-colors">
                            <Link href={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Notifications">
              <Link href="/super-admin/notifications">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
                <div className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full group-data-[collapsible=icon]:hidden">
                  3
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <Link href="/super-admin/profile">
                <User className="h-4 w-4" />
                <span className="truncate">{user?.email || "Profile"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
