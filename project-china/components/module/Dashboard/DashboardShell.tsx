"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Boxes,
  Building2,
  ClipboardList,
  CreditCard,
  Database,
  Headphones,
  Home,
  KeyRound,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  MessageCircle,
  PackageCheck,
  Percent,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  FileArchive,
  ShoppingCart,
  UploadCloud,
  AlertTriangle,
  BarChart3,
  Menu,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Cpu,
  Layers,
  ChevronDown,
} from "lucide-react";

import UserAccountMenu from "@/components/module/Home/UserAccountMenu";
import NotificationBell from "@/components/module/Dashboard/NotificationBell";
import { ModeToggle } from "@/components/themes/darkandlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { normalizeRole } from "@/lib/auth-routes";
import { useAuthStore } from "@/store/authStore";

const adminNavGroups = [
  {
    title: "Operations & Catalog",
    items: [
      { label: "Admin Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Orders Manager", href: "/admin/orders", icon: PackageCheck },
      { label: "Customer Accounts", href: "/admin/customers", icon: Users },
      { label: "Products Catalog", href: "/admin/products", icon: Boxes },
      { label: "Categories", href: "/admin/categories", icon: Layers3 },
      { label: "Brands", href: "/admin/brands", icon: Building2 },
      { label: "Inventory & Stock", href: "/admin/inventory", icon: Boxes },
    ],
  },
  {
    title: "Finance & Analytics",
    items: [
      { label: "Payments & Invoices", href: "/admin/payments", icon: CreditCard },
      { label: "Reports & Sales", href: "/admin/reports", icon: BarChart3 },
      { label: "Discounts & Coupons", href: "/admin/coupons", icon: Percent },
      { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Communication & Support",
    items: [
      { label: "Support Tickets", href: "/admin/support", icon: Headphones },
      { label: "Live Engineering Chat", href: "/admin/chat", icon: MessageCircle },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    title: "Admin Account",
    items: [
      { label: "My Profile", href: "/admin/profile", icon: UserRound },
      { label: "Security & Password", href: "/admin/change-password", icon: KeyRound },
    ],
  },
];

const superAdminNavGroups = [
  {
    title: "Command Center",
    items: [
      { label: "Platform Overview", href: "/super-admin", icon: ShieldCheck },
      { label: "Admin Management", href: "/super-admin/admin-management", icon: Users },
      { label: "Roles & RBAC", href: "/super-admin/roles-permissions", icon: LockKeyhole },
      { label: "Security Center", href: "/super-admin/security-center", icon: AlertTriangle },
    ],
  },
  {
    title: "Platform Controls",
    items: [
      { label: "Global Payments", href: "/super-admin/payments", icon: CreditCard },
      { label: "Business Analytics", href: "/super-admin/business-analytics", icon: BarChart3 },
      { label: "Audit Logs", href: "/super-admin/audit-logs", icon: ClipboardList },
      { label: "System Monitoring", href: "/super-admin/system-monitoring", icon: Database },
      { label: "Realtime Telemetry", href: "/super-admin/realtime", icon: Radio },
      { label: "System Settings", href: "/super-admin/settings", icon: Settings },
    ],
  },
];

const customerNavGroups = [
  {
    title: "Manufacturing Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "My PCB Orders", href: "/dashboard/orders", icon: PackageCheck },
      { label: "PCB Quotes", href: "/dashboard/quotes", icon: FileArchive },
      { label: "Gerber Files & DFM", href: "/dashboard/gerber", icon: UploadCloud },
      { label: "Payments & Invoices", href: "/dashboard/payments", icon: CreditCard },
      { label: "Shopping Cart", href: "/dashboard/cart", icon: ShoppingCart },
    ],
  },
  {
    title: "Engineering Support",
    items: [
      { label: "CAM Live Chat", href: "/dashboard/chat", icon: MessageCircle },
      { label: "Support Tickets", href: "/dashboard/support", icon: Headphones },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    title: "Account & Settings",
    items: [
      { label: "Shipping Address Book", href: "/dashboard/address-book", icon: Building2 },
      { label: "My Profile", href: "/dashboard/profile", icon: UserRound },
      { label: "Security & Password", href: "/dashboard/change-password", icon: KeyRound },
      { label: "Preferences", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const currentRole = normalizeRole(user?.role);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSuperAdmin = currentRole === "SUPER_ADMIN";
  const isAdmin = currentRole === "ADMIN";

  const requiredRole = pathname.startsWith("/super-admin")
    ? "SUPER_ADMIN"
    : pathname.startsWith("/admin")
      ? "ADMIN"
      : pathname.startsWith("/dashboard")
        ? "CUSTOMER"
        : null;

  const allowed =
    !requiredRole ||
    currentRole === requiredRole ||
    isSuperAdmin ||
    (isAdmin && requiredRole === "CUSTOMER");

  const navGroups = useMemo(() => {
    if (pathname.startsWith("/super-admin")) {
      return superAdminNavGroups;
    }
    if (pathname.startsWith("/admin")) {
      return adminNavGroups;
    }
    if (pathname.startsWith("/dashboard")) {
      return customerNavGroups;
    }
    if (currentRole === "SUPER_ADMIN") return superAdminNavGroups;
    if (currentRole === "ADMIN") return adminNavGroups;
    return customerNavGroups;
  }, [currentRole, pathname]);

  const isSuperAdminPath = pathname.startsWith("/super-admin");
  const isAdminPath = pathname.startsWith("/admin");

  const workspaceTitle = isSuperAdminPath
    ? "Super Admin Console"
    : isAdminPath
      ? "Operations Admin"
      : "Customer Portal";

  const workspaceBadge = isSuperAdminPath
    ? "Super Admin"
    : isAdminPath
      ? "Operations Admin"
      : "Customer";

  // Compute clean breadcrumbs
  const currentNavLabel = useMemo(() => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (pathname === item.href) return item.label;
      }
    }
    if (pathname.startsWith("/dashboard/orders/")) return "Order Details";
    if (pathname.startsWith("/admin/orders/")) return "Order Management";
    return workspaceTitle;
  }, [navGroups, pathname, workspaceTitle]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#070b14]">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-700 shadow-xl dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-300">
          <div className="size-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span>Loading secure enterprise workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-[#070b14]">
        <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-2xl dark:border-rose-900/40 dark:bg-[#0b1220]">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <LockKeyhole className="size-7" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">Access Restricted</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            This module requires <strong className="text-slate-900 dark:text-white">{requiredRole?.replace("_", " ")}</strong> privileges. You are currently authenticated as <strong className="text-slate-900 dark:text-white">{currentRole.replace("_", " ")}</strong>.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            {currentRole === "ADMIN" ? (
              <Button asChild className="rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500">
                <Link href="/admin">Go to Admin Portal</Link>
              </Button>
            ) : (
              <Button asChild className="rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500">
                <Link href="/dashboard">Go to Customer Workspace</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="rounded-xl text-xs font-bold">
              <Link href="/login">Switch Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand & Workspace Identity */}
      <div className="flex h-20 items-center justify-between border-b border-slate-200/80 px-5 dark:border-slate-800/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">FEITIAN</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">PCB</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Electronics Cloud</p>
          </div>
        </Link>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {workspaceBadge}
        </span>
      </div>


      {/* Navigation Groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-3.5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {group.title}
            </p>
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && item.href !== "/super-admin" && pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      active
                        ? "bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-black"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="size-3 text-white/80" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer Widget: Factory Status & Quick Actions */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070b14]/70">
        <div className="rounded-xl border border-emerald-200/80 bg-white p-3 shadow-2xs dark:border-emerald-500/20 dark:bg-[#0b1220]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              CAM DFM Engine
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">ONLINE</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            Direct Wuping high-speed production line active 24/7.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-[#060913] dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-[#070b14] lg:block">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 shadow-2xs backdrop-blur-md dark:border-slate-800 dark:bg-[#070b14]/85 transition-colors duration-200">
          <div className="flex min-h-[64px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            {/* Left: Mobile trigger & Breadcrumb */}
            <div className="flex items-center gap-3">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="size-9 rounded-xl border-slate-200 dark:border-slate-800 lg:hidden" aria-label="Open navigation menu">
                    <Menu className="size-4 text-slate-700 dark:text-slate-200" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[84vw] max-w-xs border-slate-200 bg-white p-0 text-slate-900 dark:border-slate-800 dark:bg-[#070b14] dark:text-white">
                  {sidebarContent}
                </SheetContent>
              </Sheet>

              {/* Breadcrumb Title */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
                <Link href="/" className="text-slate-400 hover:text-emerald-600 transition flex items-center gap-1">
                  <Home className="size-3.5" />
                  <span>Home</span>
                </Link>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-500 dark:text-slate-400">{workspaceTitle}</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-900 dark:text-white font-extrabold">{currentNavLabel}</span>
              </div>
            </div>

            {/* Middle: Quick Search */}
            <div className="relative hidden md:block max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-9 rounded-xl border-slate-200 bg-slate-50/90 pl-9 pr-8 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900/60 placeholder:text-slate-400 focus-visible:ring-emerald-500"
                placeholder="Search orders, Gerber files, invoices..."
              />
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                ⌘K
              </span>
            </div>

            {/* Right: Actions, Theme Mode, Notifications, User Menu */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Customer quick CTA: New PCB Quote */}
              {!isSuperAdminPath && !isAdminPath && (
                <Button asChild size="sm" className="hidden sm:inline-flex h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-500/15 cursor-pointer">
                  <Link href="/pcb-quote">
                    <Sparkles className="size-3.5" />
                    <span>New Quote</span>
                  </Link>
                </Button>
              )}

              {/* Mode Toggle (White / Dark / Auto) */}
              <ModeToggle />

              {/* Realtime Notifications Dropdown */}
              <NotificationBell />

              {/* User Account Menu */}
              {user ? <UserAccountMenu user={user} /> : null}
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic Page Body */}
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}


