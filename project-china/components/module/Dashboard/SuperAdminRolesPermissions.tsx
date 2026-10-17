"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, Plus, RefreshCcw, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { RbacService } from "@/services/rbac.service";

type RoleRecord = {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  permissions?: string[];
};

type PermissionRecord = {
  id?: string;
  name?: string;
  slug?: string;
  module?: string;
  action?: string;
};

const initialRole = {
  name: "",
  slug: "",
  description: "",
  permissions: "",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function SuperAdminRolesPermissions() {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [form, setForm] = useState(initialRole);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return roles;

    return roles.filter((role) => JSON.stringify(role).toLowerCase().includes(query));
  }, [roles, search]);

  const loadRbac = async () => {
    setLoading(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        RbacService.getRoles(),
        RbacService.getPermissions(),
      ]);
      setRoles(Array.isArray(rolesResponse) ? (rolesResponse as RoleRecord[]) : []);
      setPermissions(Array.isArray(permissionsResponse) ? (permissionsResponse as PermissionRecord[]) : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "RBAC data load failed.");
      setRoles([]);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialRbac() {
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          RbacService.getRoles(),
          RbacService.getPermissions(),
        ]);

        if (active) {
          setRoles(Array.isArray(rolesResponse) ? (rolesResponse as RoleRecord[]) : []);
          setPermissions(Array.isArray(permissionsResponse) ? (permissionsResponse as PermissionRecord[]) : []);
        }
      } catch (error) {
        if (active) {
          toast.error(error instanceof Error ? error.message : "RBAC data load failed.");
          setRoles([]);
          setPermissions([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialRbac();

    return () => {
      active = false;
    };
  }, []);

  const updateForm = (key: keyof typeof initialRole, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !current.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const createRole = async () => {
    const permissionList = form.permissions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (form.name.trim().length < 2) {
      toast.error("Role name must be at least 2 characters.");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Role slug is required.");
      return;
    }

    setActionId("create");
    try {
      await RbacService.createRole({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        permissions: permissionList,
      });
      toast.success("Role created successfully.");
      setForm(initialRole);
      await loadRbac();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Role create failed.");
    } finally {
      setActionId(null);
    }
  };

  const deleteRole = async (roleId: string) => {
    setActionId(roleId);
    try {
      await RbacService.deleteRole(roleId);
      toast.success("Role deleted successfully.");
      await loadRbac();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Role delete failed.");
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
            <h1 className="text-3xl font-black text-foreground">Roles & Permissions</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage RBAC roles and permission sets directly from backend permission APIs.
            </p>
          </div>
          <Button onClick={loadRbac} disabled={loading} variant="outline" className="rounded-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{roles.length}</CardTitle>
            <CardDescription>Total roles from backend</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{permissions.length}</CardTitle>
            <CardDescription>Total permissions from backend</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{roles.filter((role) => role.isActive !== false).length}</CardTitle>
            <CardDescription>Active roles</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Create Role
            </CardTitle>
            <CardDescription>Use comma-separated permission slugs from your backend seed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="space-y-2">
              <Label>Role Name</Label>
              <Input value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Inventory Manager" />
            </label>
            <label className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} placeholder="inventory-manager" />
            </label>
            <label className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Can manage stock and inventory reports." />
            </label>
            <label className="space-y-2">
              <Label>Permissions</Label>
              <Textarea value={form.permissions} onChange={(event) => updateForm("permissions", event.target.value)} placeholder="products:read, products:update" />
            </label>
            <Button onClick={createRole} disabled={actionId === "create"} className="w-full rounded-full">
              {actionId === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Role
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Records</CardTitle>
            <CardDescription>Live role records from backend.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles..." className="mb-4 max-w-sm" />
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-sm font-bold text-muted-foreground">Loading RBAC data...</TableCell>
                    </TableRow>
                  ) : filteredRoles.length ? (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-bold">{role.name || "Role"}</TableCell>
                        <TableCell>{role.slug || "N/A"}</TableCell>
                        <TableCell>{role.permissions?.length || 0}</TableCell>
                        <TableCell>{role.isActive === false ? "Inactive" : "Active"}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive" disabled={actionId === role.id} onClick={() => deleteRole(role.id)}>
                            {actionId === role.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                        No role records returned by backend.
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
