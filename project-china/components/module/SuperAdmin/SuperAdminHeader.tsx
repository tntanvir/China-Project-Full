"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/themes/darkandlight";
import { Button } from "@/components/ui/button";
import { Plus, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SuperAdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="h-4 w-[1px] bg-border mx-2 hidden md:block" />
        <div className="hidden md:flex items-center text-sm font-semibold text-muted-foreground">
          Super Admin Workspace
        </div>
      </div>

      <div className="flex-1 flex justify-center max-w-md ml-auto md:ml-4">
        <div className="relative w-full hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search across the platform (Press Ctrl+K)"
            className="w-full bg-muted/50 border-none pl-9 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Plus className="h-4 w-4" />
              <span>Quick Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Create New</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Add Admin</DropdownMenuItem>
            <DropdownMenuItem>Add Product</DropdownMenuItem>
            <DropdownMenuItem>Create Coupon</DropdownMenuItem>
            <DropdownMenuItem>Send Notification</DropdownMenuItem>
            <DropdownMenuItem>Add Blog Post</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>System Backup</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background"></span>
        </Button>

        <ModeToggle />
      </div>
    </header>
  );
}

