"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCcw, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RbacService } from "@/services/rbac.service";

type AdminRecord = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  isActive?: boolean;
  lastLoginAt?: string;
};

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

export default function SuperAdminAdminManagement() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return admins;

    return admins.filter((admin) => JSON.stringify(admin).toLowerCase().includes(query));
  }, [admins, search]);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const result = await RbacService.getAdmins();
      setAdmins(Array.isArray(result) ? (result as AdminRecord[]) : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin list load failed.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialAdmins() {
      try {
        const result = await RbacService.getAdmins();
        if (active) setAdmins(Array.isArray(result) ? (result as AdminRecord[]) : []);
      } catch (error) {
        if (active) {
          toast.error(error instanceof Error ? error.message : "Admin list load failed.");
          setAdmins([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialAdmins();

    return () => {
      active = false;
    };
  }, []);

  const updateForm = (key: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const createAdmin = async () => {
    if (form.name.trim().length < 2) {
      toast.error("Admin name must be at least 2 characters.");
      return;
    }

    if (!form.email.includes("@")) {
      toast.error("Valid admin email is required.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setActionId("create");
    try {
      await RbacService.createAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });
      toast.success("Admin created successfully.");
      setForm(initialForm);
      await loadAdmins();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin create failed.");
    } finally {
      setActionId(null);
    }
  };

  const changeStatus = async (admin: AdminRecord, nextStatus: "activate" | "suspend") => {
    setActionId(admin.id);
    try {
      if (nextStatus === "activate") {
        await RbacService.activateAdmin(admin.id);
      } else {
        await RbacService.suspendAdmin(admin.id);
      }
      toast.success(`Admin ${nextStatus === "activate" ? "activated" : "suspended"} successfully.`);
      await loadAdmins();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin status update failed.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-foreground">Admin Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create admins, monitor admin accounts, and activate or suspend access using backend RBAC APIs.
            </p>
          </div>
          <Button onClick={loadAdmins} disabled={loading} variant="outline" className="rounded-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create Admin
            </CardTitle>
            <CardDescription>Only Super Admin can create operational admin accounts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Admin full name" />
            </label>
            <label className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(event) => updateForm("email", event.target.value)} type="email" placeholder="admin@company.com" />
            </label>
            <label className="space-y-2">
              <Label>Password</Label>
              <Input value={form.password} onChange={(event) => updateForm("password", event.target.value)} type="password" placeholder="Minimum 8 characters" />
            </label>
            <label className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} placeholder="+86..." />
            </label>
            <Button onClick={createAdmin} disabled={actionId === "create"} className="w-full rounded-full">
              {actionId === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Create Admin
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Accounts</CardTitle>
            <CardDescription>Live data from the RBAC admin listing API.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search admins..." className="mb-4 max-w-sm" />
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-sm font-bold text-muted-foreground">Loading admins...</TableCell>
                    </TableRow>
                  ) : filteredAdmins.length ? (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-bold">{admin.name || "Admin"}</TableCell>
                        <TableCell>{admin.email || "N/A"}</TableCell>
                        <TableCell>{admin.status || (admin.isActive === false ? "SUSPENDED" : "ACTIVE")}</TableCell>
                        <TableCell>{admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          {admin.isActive === false || admin.status === "SUSPENDED" ? (
                            <Button size="sm" variant="outline" disabled={actionId === admin.id} onClick={() => changeStatus(admin, "activate")}>Activate</Button>
                          ) : (
                            <Button size="sm" variant="destructive" disabled={actionId === admin.id} onClick={() => changeStatus(admin, "suspend")}>Suspend</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                        No admin records returned by backend.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
