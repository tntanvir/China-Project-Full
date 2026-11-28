"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Loader2, RotateCcw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculateHeroQuotePrice,
  DEFAULT_QUOTE_PRICING_CONFIG,
  type QuotePricingConfig,
} from "@/lib/quote-pricing";
import { PricingService } from "@/services/pricing.service";

function NumberField({
  label,
  value,
  step = "0.5",
  suffix = "USD",
  onChange,
}: {
  label: string;
  value: number;
  step?: string;
  suffix?: string;
  onChange: (val: number) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <div className="relative flex items-center">
        <Input
          type="number"
          min="0"
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="h-10 pr-14 font-mono text-sm font-bold"
        />
        <span className="pointer-events-none absolute right-3 text-[10px] font-bold uppercase text-slate-400">
          {suffix}
        </span>
      </div>
    </label>
  );
}

export default function AdminPricingPage() {
  const [config, setConfig] = useState<QuotePricingConfig>(DEFAULT_QUOTE_PRICING_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Live preview simulator state
  const [simService, setSimService] = useState<"pcb-proto" | "pcb-assembly" | "flex-pcb" | "smt-stencil">("pcb-proto");
  const [simLayers, setSimLayers] = useState(2);
  const [simQty, setSimQty] = useState(5);
  const [simLength, setSimLength] = useState(100);
  const [simWidth, setSimWidth] = useState(100);
  const [simFinish, setSimFinish] = useState("HASL");

  useEffect(() => {
    let active = true;
    PricingService.getAdminPricingConfig()
      .then((data) => {
        if (active) setConfig(data);
      })
      .catch(() => {
        toast.error("Failed to load saved pricing rules; showing defaults.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const simulatedPrice = useMemo(
    () =>
      calculateHeroQuotePrice(
        {
          serviceId: simService,
          length: simLength,
          width: simWidth,
          unit: "mm",
          layers: simLayers,
          qty: simQty,
          thickness: 1.6,
          surfaceFinish: simFinish,
        },
        config
      ),
    [config, simService, simLength, simWidth, simLayers, simQty, simFinish]
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await PricingService.updateAdminPricingConfig(config);
      setConfig(updated);
      toast.success("Calculator pricing updated! Changes are live on the homepage & quote configurator.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save pricing configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_QUOTE_PRICING_CONFIG);
    toast.info("Loaded default pricing values. Click Save Changes to apply.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <Calculator className="size-3.5" />
            <span>Dynamic Quote Pricing Engine</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Calculator & Service Pricing Control
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Control all prices displayed in the homepage Instant Quote Calculator and full `/pcb-quote` configurator.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button type="button" variant="outline" onClick={handleReset} disabled={loading || saving} className="gap-1.5 text-xs font-bold">
            <RotateCcw className="size-3.5" />
            Reset Defaults
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Save Pricing"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-12 text-center text-xs text-slate-500">
          Loading pricing configuration...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Left 8 Cols: Pricing Controls */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Prototype Promo & Service Base Prices */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">Service Base Prices & Prototype Promo</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Controls top service tabs (`From $5.00`, `From $8.00`) and base rates.</p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={config.promoEnabled}
                    onChange={(e) => setConfig({ ...config, promoEnabled: e.target.checked })}
                    className="size-4 accent-emerald-600 rounded"
                  />
                  <span>Enable Prototype Promo</span>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <NumberField
                  label="Standard PCB Promo"
                  value={config.promoPrice}
                  onChange={(v) => setConfig({ ...config, promoPrice: v })}
                />
                <NumberField
                  label="Promo Max Qty"
                  step="1"
                  suffix="PCS"
                  value={config.promoMaxQty}
                  onChange={(v) => setConfig({ ...config, promoMaxQty: v })}
                />
                <NumberField
                  label="Promo Max Area"
                  step="0.05"
                  suffix="dm²"
                  value={config.promoMaxAreaDm2}
                  onChange={(v) => setConfig({ ...config, promoMaxAreaDm2: v })}
                />
                <NumberField
                  label="Min Order Price"
                  value={config.minOrderPrice}
                  onChange={(v) => setConfig({ ...config, minOrderPrice: v })}
                />
                <NumberField
                  label="SMD Stencil Base"
                  value={config.smdStencilPrice}
                  onChange={(v) => setConfig({ ...config, smdStencilPrice: v })}
                />
                <NumberField
                  label="SMT Assembly Add-on"
                  value={config.pcbAssemblyBaseFee}
                  onChange={(v) => setConfig({ ...config, pcbAssemblyBaseFee: v })}
                />
                <NumberField
                  label="Rigid-Flex Add-on"
                  value={config.rigidFlexBaseFee}
                  onChange={(v) => setConfig({ ...config, rigidFlexBaseFee: v })}
                />
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Build Time Label
                  </span>
                  <Input
                    value={config.buildTimeLabel}
                    onChange={(e) => setConfig({ ...config, buildTimeLabel: e.target.value })}
                    className="h-10 text-xs font-bold"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    SMT Tab Badge
                  </span>
                  <Input
                    value={config.pcbAssemblyTag}
                    onChange={(e) => setConfig({ ...config, pcbAssemblyTag: e.target.value })}
                    className="h-9 text-xs font-bold"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Rigid-Flex Tab Badge
                  </span>
                  <Input
                    value={config.rigidFlexTag}
                    onChange={(e) => setConfig({ ...config, rigidFlexTag: e.target.value })}
                    className="h-9 text-xs font-bold"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    DFM Label
                  </span>
                  <Input
                    value={config.dfmCheckLabel}
                    onChange={(e) => setConfig({ ...config, dfmCheckLabel: e.target.value })}
                    className="h-9 text-xs font-bold"
                  />
                </label>
              </div>
            </section>

            {/* 2. Layer Base Prices */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Layer Base Prices (Non-Promo / Custom Specs)
              </h2>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <NumberField label="1 Layer" value={config.layerPrices.layer1} onChange={(v) => setConfig({ ...config, layerPrices: { ...config.layerPrices, layer1: v } })} />
                <NumberField label="2 Layers" value={config.layerPrices.layer2} onChange={(v) => setConfig({ ...config, layerPrices: { ...config.layerPrices, layer2: v } })} />
                <NumberField label="4 Layers" value={config.layerPrices.layer4} onChange={(v) => setConfig({ ...config, layerPrices: { ...config.layerPrices, layer4: v } })} />
                <NumberField label="6 Layers" value={config.layerPrices.layer6} onChange={(v) => setConfig({ ...config, layerPrices: { ...config.layerPrices, layer6: v } })} />
                <NumberField label="8+ Layers" value={config.layerPrices.layer8Plus} onChange={(v) => setConfig({ ...config, layerPrices: { ...config.layerPrices, layer8Plus: v } })} />
                <NumberField label="10+ Layers" value={config.layerPrices.layer10Plus} onChange={(v) => setConfig({ ...config, layerPrices: { ...config.layerPrices, layer10Plus: v } })} />
              </div>
            </section>

            {/* 3. Surface Finish Add-ons */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Surface Finish Surcharges
              </h2>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <NumberField label="HASL (Lead-Free)" value={config.finishFees.HASL} onChange={(v) => setConfig({ ...config, finishFees: { ...config.finishFees, HASL: v } })} />
                <NumberField label="ENIG (Gold)" value={config.finishFees.ENIG} onChange={(v) => setConfig({ ...config, finishFees: { ...config.finishFees, ENIG: v } })} />
                <NumberField label="HASL w/ Lead" value={config.finishFees["HASL-LEAD"]} onChange={(v) => setConfig({ ...config, finishFees: { ...config.finishFees, "HASL-LEAD": v } })} />
                <NumberField label="Imm. Silver" value={config.finishFees["Immersion Silver"]} onChange={(v) => setConfig({ ...config, finishFees: { ...config.finishFees, "Immersion Silver": v } })} />
                <NumberField label="Hard Gold" value={config.finishFees["Hard Gold"]} onChange={(v) => setConfig({ ...config, finishFees: { ...config.finishFees, "Hard Gold": v } })} />
              </div>
            </section>

            {/* 4. Material, Scaling & Special Options */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 space-y-4">
              <h2 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Area, Quantity, Material & Extra Fees
              </h2>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <NumberField label="Area Rate / dm² / L" value={config.scaling.areaRatePerDm2PerLayer} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, areaRatePerDm2PerLayer: v } })} />
                <NumberField label="Qty Base Unit Fee" step="0.05" value={config.scaling.qtyBaseUnitFee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, qtyBaseUnitFee: v } })} />
                <NumberField label="Qty Layer Factor" step="0.05" value={config.scaling.qtyPerLayerFee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, qtyPerLayerFee: v } })} />
                <NumberField label="Thickness >1.6mm" value={config.scaling.thicknessOver16Fee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, thicknessOver16Fee: v } })} />
                <NumberField label="Aluminum Material" value={config.materialFees.Aluminum} onChange={(v) => setConfig({ ...config, materialFees: { ...config.materialFees, Aluminum: v } })} />
                <NumberField label="Rogers Material" value={config.materialFees.Rogers} onChange={(v) => setConfig({ ...config, materialFees: { ...config.materialFees, Rogers: v } })} />
                <NumberField label="HDI Material" value={config.materialFees.HDI} onChange={(v) => setConfig({ ...config, materialFees: { ...config.materialFees, HDI: v } })} />
                <NumberField label="Impedance Control" value={config.scaling.impedanceControlFee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, impedanceControlFee: v } })} />
                <NumberField label="Castellated Holes" value={config.scaling.castellatedHolesFee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, castellatedHolesFee: v } })} />
                <NumberField label="Edge Plating" value={config.scaling.edgePlatingFee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, edgePlatingFee: v } })} />
                <NumberField label="Engineering Fee" value={config.scaling.engineeringFee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, engineeringFee: v } })} />
                <NumberField label="E-Test Fee" value={config.scaling.eTestFee} onChange={(v) => setConfig({ ...config, scaling: { ...config.scaling, eTestFee: v } })} />
              </div>
            </section>
          </div>

          {/* Right 4 Cols: Live Calculator Preview */}
          <aside className="lg:col-span-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-[#0b1220] p-6 space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Live Calculator Preview</h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <span className="font-bold text-slate-600 dark:text-slate-400">Service Type</span>
                <select
                  value={simService}
                  onChange={(e) => setSimService(e.target.value as typeof simService)}
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 font-semibold"
                >
                  <option value="pcb-proto">Standard PCB (From ${config.promoPrice.toFixed(2)})</option>
                  <option value="pcb-assembly">PCB Assembly ({config.pcbAssemblyTag})</option>
                  <option value="flex-pcb">Rigid-Flex ({config.rigidFlexTag})</option>
                  <option value="smt-stencil">SMD Stencil (From ${config.smdStencilPrice.toFixed(2)})</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block space-y-1">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Length (mm)</span>
                  <Input type="number" value={simLength} onChange={(e) => setSimLength(Number(e.target.value) || 100)} className="h-9 font-mono text-xs font-bold" />
                </label>
                <label className="block space-y-1">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Width (mm)</span>
                  <Input type="number" value={simWidth} onChange={(e) => setSimWidth(Number(e.target.value) || 100)} className="h-9 font-mono text-xs font-bold" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block space-y-1">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Layers</span>
                  <select
                    value={simLayers}
                    onChange={(e) => setSimLayers(Number(e.target.value))}
                    className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 font-semibold"
                  >
                    <option value={1}>1 Layer</option>
                    <option value={2}>2 Layers</option>
                    <option value={4}>4 Layers</option>
                    <option value={6}>6 Layers</option>
                    <option value={8}>8+ Layers</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Quantity</span>
                  <Input type="number" value={simQty} onChange={(e) => setSimQty(Number(e.target.value) || 5)} className="h-9 font-mono text-xs font-bold" />
                </label>
              </div>

              <label className="block space-y-1">
                <span className="font-bold text-slate-600 dark:text-slate-400">Surface Finish</span>
                <select
                  value={simFinish}
                  onChange={(e) => setSimFinish(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 font-semibold"
                >
                  <option value="HASL">HASL (Lead-Free)</option>
                  <option value="ENIG">ENIG (Immersion Gold)</option>
                  <option value="HASL-LEAD">HASL with Lead</option>
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Estimated Customer Quote</div>
              <div className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                ${simulatedPrice.toFixed(2)}
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {simQty} pcs • {simLayers}L • {config.buildTimeLabel} • {config.dfmCheckLabel}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
