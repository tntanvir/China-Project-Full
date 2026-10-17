"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ClipboardList, Database, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SuperAdminService, type AuditLog, type MonitoringStatus, type SecurityCenter } from "@/services/super-admin.service";

type PageType = "monitoring" | "security" | "audit";

function stringify(value: unknown) {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function SuperAdminLiveDataPage({ type }: { type: PageType }) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const meta = {
    monitoring: {
      title: "System Monitoring",
      description: "API, database, application health, and backend model counts.",
      icon: Database,
    },
    security: {
      title: "Security Center",
      description: "Blocked users, recent logins, suspicious events, and security activity.",
      icon: AlertTriangle,
    },
    audit: {
      title: "Audit Logs",
      description: "Recent backend activity logs with user, action, details, and timestamp.",
      icon: ClipboardList,
    },
  }[type];

  const loadData = async () => {
    setLoading(true);
    try {
      if (type === "monitoring") setData(await SuperAdminService.getMonitoring());
      if (type === "security") setData(await SuperAdminService.getSecurityCenter());
      if (type === "audit") setData(await SuperAdminService.getAuditLogs());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Super Admin data load failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        let result: unknown = null;
        if (type === "monitoring") result = await SuperAdminService.getMonitoring();
        if (type === "security") result = await SuperAdminService.getSecurityCenter();
        if (type === "audit") result = await SuperAdminService.getAuditLogs();
        if (active) setData(result);
      } catch (error) {
        if (active) {
          toast.error(error instanceof Error ? error.message : "Super Admin data load failed.");
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [type]);

  const rows = useMemo(() => {
    if (type === "audit") return Array.isArray(data) ? (data as AuditLog[]) : [];
    if (type === "security") return ((data as SecurityCenter | null)?.events || []) as AuditLog[];
    return [];
  }, [data, type]);

  const Icon = meta.icon;
  const monitoring = data as MonitoringStatus | null;
  const security = data as SecurityCenter | null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-foreground">{meta.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{meta.description}</p>
          </div>
          <Button onClick={loadData} disabled={loading} variant="outline" className="rounded-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </section>

      {type === "monitoring" ? (
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "API", value: monitoring?.api?.status || "UNKNOWN", detail: monitoring?.api?.checkedAt || "N/A" },
            { label: "Database", value: monitoring?.database?.status || "UNKNOWN", detail: stringify(monitoring?.database?.models || {}) },
            { label: "Application", value: monitoring?.application?.status || "UNKNOWN", detail: monitoring?.application?.environment || "N/A" },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />{item.label}</CardTitle>
                <CardDescription>{item.value}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="break-all rounded-lg bg-muted p-3 font-mono text-xs text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      {type === "security" ? (
        <section className="grid gap-4 md:grid-cols-4">
          {Object.entries(security?.summary || {}).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{value}</CardTitle>
                <CardDescription>{key.replace(/([A-Z])/g, " $1")}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      ) : null}

      {type === "audit" || type === "security" ? (
        <Card>
          <CardHeader>
            <CardTitle>{type === "audit" ? "Activity Logs" : "Security Events"}</CardTitle>
            <CardDescription>Live backend records only.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm font-bold text-muted-foreground">Loading records...</TableCell></TableRow>
                  ) : rows.length ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.user?.email || row.userId || "System"}</TableCell>
                        <TableCell className="font-bold">{row.action}</TableCell>
                        <TableCell className="max-w-[320px] truncate font-mono text-xs">{stringify(row.details)}</TableCell>
                        <TableCell>{row.ipAddress || "N/A"}</TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">No records returned by backend.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
