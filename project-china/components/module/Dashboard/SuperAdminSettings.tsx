"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCcw, Save, Settings } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { SuperAdminService, type SystemSetting } from "@/services/super-admin.service";

const groups = ["GENERAL", "PAYMENT", "PRICING", "SEO", "SECURITY"];

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [group, setGroup] = useState("GENERAL");
  const [keyName, setKeyName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const filteredSettings = useMemo(
    () => settings.filter((setting) => setting.group === group),
    [group, settings],
  );

  const loadSettings = async () => {
    setLoading(true);
    try {
      setSettings(await SuperAdminService.getSettings());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Settings load failed.");
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialSettings() {
      try {
        const result = await SuperAdminService.getSettings();
        if (active) setSettings(result);
      } catch (error) {
        if (active) {
          toast.error(error instanceof Error ? error.message : "Settings load failed.");
          setSettings([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialSettings();

    return () => {
      active = false;
    };
  }, []);

  const saveSetting = async () => {
    if (!keyName.trim()) {
      toast.error("Setting key is required.");
      return;
    }

    setSaving(true);
    try {
      let parsedValue: unknown = value;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      await SuperAdminService.saveSetting({ key: keyName.trim(), value: parsedValue, group });
      toast.success("Setting saved successfully.");
      setKeyName("");
      setValue("");
      await loadSettings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Setting save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Settings className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-foreground">System Settings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage website, payment, pricing, SEO, and security settings from backend SystemSetting records.
            </p>
          </div>
          <Button onClick={loadSettings} disabled={loading} variant="outline" className="rounded-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create / Update Setting</CardTitle>
            <CardDescription>Value accepts plain text or JSON.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="space-y-2">
              <Label>Group</Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {groups.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-2">
              <Label>Key</Label>
              <Input value={keyName} onChange={(event) => setKeyName(event.target.value)} placeholder="website_name" />
            </label>
            <label className="space-y-2">
              <Label>Value</Label>
              <Textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder='Example: "FT PCB" or {"enabled":true}' rows={7} />
            </label>
            <Button onClick={saveSetting} disabled={saving} className="w-full rounded-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Setting
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{group} Settings</CardTitle>
            <CardDescription>Live records returned by backend.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={3} className="py-10 text-center text-sm font-bold text-muted-foreground">Loading settings...</TableCell></TableRow>
                  ) : filteredSettings.length ? (
                    filteredSettings.map((setting) => (
                      <TableRow key={setting.id}>
                        <TableCell className="font-bold">{setting.key}</TableCell>
                        <TableCell className="max-w-[420px] truncate font-mono text-xs">{JSON.stringify(setting.value)}</TableCell>
                        <TableCell>{new Date(setting.updatedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={3} className="py-12 text-center text-sm text-muted-foreground">No settings found in this group.</TableCell></TableRow>
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
