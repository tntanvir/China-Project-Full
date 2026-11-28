export const QUOTE_PRICING_SETTING_KEY = "quote_calculator_pricing";

export interface QuotePricingConfig {
  promoEnabled: boolean;
  promoPrice: number;
  promoMaxQty: number;
  promoMaxAreaDm2: number;
  minOrderPrice: number;
  pcbAssemblyBaseFee: number;
  rigidFlexBaseFee: number;
  smdStencilPrice: number;
  pcbAssemblyTag: string;
  rigidFlexTag: string;
  buildTimeLabel: string;
  dfmCheckLabel: string;
  layerPrices: {
    layer1: number;
    layer2: number;
    layer4: number;
    layer6: number;
    layer8Plus: number;
    layer10Plus: number;
  };
  finishFees: {
    HASL: number;
    ENIG: number;
    "HASL-LEAD": number;
    "Hard Gold": number;
    "Immersion Silver": number;
  };
  materialFees: {
    FR4: number;
    Aluminum: number;
    Rogers: number;
    HDI: number;
  };
  scaling: {
    areaRatePerDm2PerLayer: number;
    qtyBaseUnitFee: number;
    qtyPerLayerFee: number;
    thicknessOver16Fee: number;
    castellatedHolesFee: number;
    edgePlatingFee: number;
    impedanceControlFee: number;
    engineeringFee: number;
    eTestFee: number;
  };
}

export const DEFAULT_QUOTE_PRICING_CONFIG: QuotePricingConfig = {
  promoEnabled: true,
  promoPrice: 5.0,
  promoMaxQty: 10,
  promoMaxAreaDm2: 1.05,
  minOrderPrice: 5.0,
  pcbAssemblyBaseFee: 35.0,
  rigidFlexBaseFee: 45.0,
  smdStencilPrice: 8.0,
  pcbAssemblyTag: "Turnkey SMT",
  rigidFlexTag: "Polyimide",
  buildTimeLabel: "24-48 Hours",
  dfmCheckLabel: "Free CAM Check",
  layerPrices: {
    layer1: 5.0,
    layer2: 8.0,
    layer4: 28.0,
    layer6: 58.0,
    layer8Plus: 98.0,
    layer10Plus: 220.0,
  },
  finishFees: {
    HASL: 0.0,
    ENIG: 12.0,
    "HASL-LEAD": 0.0,
    "Hard Gold": 35.0,
    "Immersion Silver": 25.0,
  },
  materialFees: {
    FR4: 0.0,
    Aluminum: 12.0,
    Rogers: 85.0,
    HDI: 45.0,
  },
  scaling: {
    areaRatePerDm2PerLayer: 3.5,
    qtyBaseUnitFee: 0.65,
    qtyPerLayerFee: 0.25,
    thicknessOver16Fee: 8.0,
    castellatedHolesFee: 15.0,
    edgePlatingFee: 16.0,
    impedanceControlFee: 10.0,
    engineeringFee: 0.0,
    eTestFee: 0.0,
  },
};

const toNonNegativeNumber = (value: unknown, fallback: number): number => {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? Number(num.toFixed(4)) : fallback;
};

const toCleanText = (value: unknown, fallback: string): string => {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
};

export function mergePricingConfig(raw?: unknown): QuotePricingConfig {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>;
  const lp = (src.layerPrices && typeof src.layerPrices === "object" ? src.layerPrices : {}) as Record<string, any>;
  const ff = (src.finishFees && typeof src.finishFees === "object" ? src.finishFees : {}) as Record<string, any>;
  const mf = (src.materialFees && typeof src.materialFees === "object" ? src.materialFees : {}) as Record<string, any>;
  const sc = (src.scaling && typeof src.scaling === "object" ? src.scaling : {}) as Record<string, any>;

  const d = DEFAULT_QUOTE_PRICING_CONFIG;

  return {
    promoEnabled: typeof src.promoEnabled === "boolean" ? src.promoEnabled : d.promoEnabled,
    promoPrice: toNonNegativeNumber(src.promoPrice, d.promoPrice),
    promoMaxQty: toNonNegativeNumber(src.promoMaxQty, d.promoMaxQty),
    promoMaxAreaDm2: toNonNegativeNumber(src.promoMaxAreaDm2, d.promoMaxAreaDm2),
    minOrderPrice: toNonNegativeNumber(src.minOrderPrice, d.minOrderPrice),
    pcbAssemblyBaseFee: toNonNegativeNumber(src.pcbAssemblyBaseFee, d.pcbAssemblyBaseFee),
    rigidFlexBaseFee: toNonNegativeNumber(src.rigidFlexBaseFee, d.rigidFlexBaseFee),
    smdStencilPrice: toNonNegativeNumber(src.smdStencilPrice, d.smdStencilPrice),
    pcbAssemblyTag: toCleanText(src.pcbAssemblyTag, d.pcbAssemblyTag),
    rigidFlexTag: toCleanText(src.rigidFlexTag, d.rigidFlexTag),
    buildTimeLabel: toCleanText(src.buildTimeLabel, d.buildTimeLabel),
    dfmCheckLabel: toCleanText(src.dfmCheckLabel, d.dfmCheckLabel),
    layerPrices: {
      layer1: toNonNegativeNumber(lp.layer1, d.layerPrices.layer1),
      layer2: toNonNegativeNumber(lp.layer2, d.layerPrices.layer2),
      layer4: toNonNegativeNumber(lp.layer4, d.layerPrices.layer4),
      layer6: toNonNegativeNumber(lp.layer6, d.layerPrices.layer6),
      layer8Plus: toNonNegativeNumber(lp.layer8Plus, d.layerPrices.layer8Plus),
      layer10Plus: toNonNegativeNumber(lp.layer10Plus, d.layerPrices.layer10Plus),
    },
    finishFees: {
      HASL: toNonNegativeNumber(ff.HASL, d.finishFees.HASL),
      ENIG: toNonNegativeNumber(ff.ENIG, d.finishFees.ENIG),
      "HASL-LEAD": toNonNegativeNumber(ff["HASL-LEAD"], d.finishFees["HASL-LEAD"]),
      "Hard Gold": toNonNegativeNumber(ff["Hard Gold"], d.finishFees["Hard Gold"]),
      "Immersion Silver": toNonNegativeNumber(ff["Immersion Silver"], d.finishFees["Immersion Silver"]),
    },
    materialFees: {
      FR4: toNonNegativeNumber(mf.FR4, d.materialFees.FR4),
      Aluminum: toNonNegativeNumber(mf.Aluminum, d.materialFees.Aluminum),
      Rogers: toNonNegativeNumber(mf.Rogers, d.materialFees.Rogers),
      HDI: toNonNegativeNumber(mf.HDI, d.materialFees.HDI),
    },
    scaling: {
      areaRatePerDm2PerLayer: toNonNegativeNumber(sc.areaRatePerDm2PerLayer, d.scaling.areaRatePerDm2PerLayer),
      qtyBaseUnitFee: toNonNegativeNumber(sc.qtyBaseUnitFee, d.scaling.qtyBaseUnitFee),
      qtyPerLayerFee: toNonNegativeNumber(sc.qtyPerLayerFee, d.scaling.qtyPerLayerFee),
      thicknessOver16Fee: toNonNegativeNumber(sc.thicknessOver16Fee, d.scaling.thicknessOver16Fee),
      castellatedHolesFee: toNonNegativeNumber(sc.castellatedHolesFee, d.scaling.castellatedHolesFee),
      edgePlatingFee: toNonNegativeNumber(sc.edgePlatingFee, d.scaling.edgePlatingFee),
      impedanceControlFee: toNonNegativeNumber(sc.impedanceControlFee, d.scaling.impedanceControlFee),
      engineeringFee: toNonNegativeNumber(sc.engineeringFee, d.scaling.engineeringFee),
      eTestFee: toNonNegativeNumber(sc.eTestFee, d.scaling.eTestFee),
    },
  };
}
