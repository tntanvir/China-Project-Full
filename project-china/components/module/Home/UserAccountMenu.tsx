"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ClipboardList,
  CircleHelp,
  Heart,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  UserCog,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldCheck } from "lucide-react";
import { useAuthStore, type User } from "@/store/authStore";
import { normalizeRole, getRoleDashboardPath } from "@/lib/auth-routes";

function getMenuItemsForUser(user: User) {
  const role = normalizeRole(user.role);

  if (role === "SUPER_ADMIN") {
    return [
      { label: "Super Admin Console", href: "/super-admin", icon: ShieldCheck },
      { label: "Admin Operations", href: "/admin", icon: LayoutDashboard },
      { label: "Customer View", href: "/dashboard", icon: ClipboardList },
      { label: "Profile", href: "/dashboard/profile", icon: UserRound },
      { label: "Change Password", href: "/dashboard/change-password", icon: KeyRound },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ];
  }

  if (role === "ADMIN") {
    return [
      { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Customer View", href: "/dashboard", icon: ClipboardList },
      { label: "Profile", href: "/admin/profile", icon: UserRound },
      { label: "Change Password", href: "/admin/change-password", icon: KeyRound },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ];
  }

  return [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ClipboardList },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
    { label: "Address Book", href: "/dashboard/address-book", icon: MapPin },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Change Password", href: "/dashboard/change-password", icon: KeyRound },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { label: "Help & Support", href: "/dashboard/support", icon: CircleHelp },
  ];
}

function getInitials(user: User) {
  const source = user.name || user.email || "User";
  const words = source.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0]?.slice(0, 2).toUpperCase() || "U";
  }

  return `${words[0]?.[0] || ""}${words[1]?.[0] || ""}`.toUpperCase();
}

export default function UserAccountMenu({ user }: { user: User }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 rounded-full px-2 pr-3"
          aria-label="Open user account menu"
        >
          <Avatar className="size-8 ring-2 ring-primary/15">
            <AvatarImage src={user.profilePhoto || undefined} alt={user.name || user.email} />
            <AvatarFallback className="bg-primary/10 text-xs font-black text-primary">
              {user.profilePhoto ? <UserCog className="h-4 w-4" /> : getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate text-sm font-bold text-foreground lg:block">
            {user.name || "Account"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-80 rounded-2xl border-border/80 bg-card/95 p-2 shadow-premium backdrop-blur-2xl"
      >
        <DropdownMenuLabel className="p-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-12 ring-2 ring-primary/15">
              <AvatarImage src={user.profilePhoto || undefined} alt={user.name || user.email} />
              <AvatarFallback className="bg-primary/10 text-sm font-black text-primary">
                {user.profilePhoto ? <UserCog className="h-5 w-5" /> : getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-foreground">{user.name || "PCB Customer"}</p>
              <p className="truncate text-xs font-medium text-muted-foreground">{user.email}</p>
              <p className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                {user.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {getMenuItemsForUser(user).map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="cursor-pointer rounded-xl p-0 focus:bg-transparent"
            >
              <Link
                href={item.href}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
