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

export function calculateHeroQuotePrice(
  params: {
    serviceId?: string;
    length: number;
    width: number;
    unit: "mm" | "inch";
    layers: number;
    qty: number;
    thickness?: number;
    surfaceFinish: string;
  },
  config: QuotePricingConfig
): number {
  const lMm = params.unit === "inch" ? params.length * 25.4 : params.length;
  const wMm = params.unit === "inch" ? params.width * 25.4 : params.width;
  const areaDm2 = (Math.max(lMm, 1) * Math.max(wMm, 1)) / 10000;
  const layers = Math.max(params.layers || 2, 1);
  const qty = Math.max(params.qty || 5, 1);

  if (params.serviceId === "smt-stencil") {
    const areaAddon = Math.max(0, areaDm2 - 1.0) * 3.0;
    const qtyAddon = Math.max(0, qty - 1) * 2.5;
    return Number((config.smdStencilPrice + areaAddon + qtyAddon).toFixed(2));
  }

  let pcbTotal: number;
  const finishKey = params.surfaceFinish as keyof QuotePricingConfig["finishFees"];
  const finishFee = config.finishFees[finishKey] ?? 0;

  if (
    config.promoEnabled &&
    params.serviceId !== "pcb-assembly" &&
    params.serviceId !== "flex-pcb" &&
    layers <= 2 &&
    areaDm2 <= config.promoMaxAreaDm2 &&
    qty <= config.promoMaxQty &&
    params.surfaceFinish === "HASL"
  ) {
    pcbTotal = config.promoPrice;
  } else {
    let base =
      layers === 1
        ? config.layerPrices.layer1
        : layers === 2
          ? config.layerPrices.layer2
          : layers <= 4
            ? config.layerPrices.layer4
            : layers <= 6
              ? config.layerPrices.layer6
              : config.layerPrices.layer8Plus;

    base += finishFee;
    const areaFactor = Math.max(0, areaDm2 - 1.0) * (layers * config.scaling.areaRatePerDm2PerLayer);
    const qtyFactor = Math.max(0, qty - 5) * (config.scaling.qtyBaseUnitFee + layers * config.scaling.qtyPerLayerFee);
    const thicknessAddon = (params.thickness ?? 1.6) > 1.6 ? config.scaling.thicknessOver16Fee : 0;
    pcbTotal = Math.max(config.minOrderPrice, base + areaFactor + qtyFactor + thicknessAddon);
  }

  if (params.serviceId === "pcb-assembly") {
    pcbTotal += config.pcbAssemblyBaseFee;
  } else if (params.serviceId === "flex-pcb") {
    pcbTotal += config.rigidFlexBaseFee;
  }

  return Number((pcbTotal + config.scaling.engineeringFee + config.scaling.eTestFee).toFixed(2));
}

export function calculateFullQuotePricing(
  params: {
    boardAreaCm2: number;
    effectiveQty: number;
    numLayers: number;
    material: string;
    surfaceFinish: string;
    castellatedHoles: string;
    edgePlating: string;
    impedanceControl: string;
    thickness?: number;
    shippingFee: number;
    carrier: string;
  },
  config: QuotePricingConfig
) {
  const { numLayers, effectiveQty, boardAreaCm2 } = params;
  const areaDm2 = boardAreaCm2 / 100;

  const finishFee =
    params.surfaceFinish === "ENIG"
      ? config.finishFees.ENIG
      : params.surfaceFinish === "Hard Gold"
        ? config.finishFees["Hard Gold"]
        : params.surfaceFinish === "Immersion Silver"
          ? config.finishFees["Immersion Silver"]
          : params.surfaceFinish === "HASL-LEAD"
            ? config.finishFees["HASL-LEAD"]
            : config.finishFees.HASL;

  const materialFee =
    params.material === "Aluminum"
      ? config.materialFees.Aluminum
      : params.material === "Rogers"
        ? config.materialFees.Rogers
        : params.material === "HDI"
          ? config.materialFees.HDI
          : config.materialFees.FR4;

  const isPromoEligible =
    config.promoEnabled &&
    numLayers <= 2 &&
    areaDm2 <= config.promoMaxAreaDm2 &&
    effectiveQty <= config.promoMaxQty &&
    finishFee === 0 &&
    materialFee === 0 &&
    params.castellatedHoles !== "Yes" &&
    params.edgePlating !== "Yes" &&
    params.impedanceControl !== "Yes";

  let pcbFabrication: number;

  if (isPromoEligible) {
    pcbFabrication = config.promoPrice;
  } else {
    const base =
      numLayers === 1
        ? config.layerPrices.layer1
        : numLayers === 2
          ? config.layerPrices.layer2
          : numLayers <= 4
            ? config.layerPrices.layer4
            : numLayers <= 6
              ? config.layerPrices.layer6
              : numLayers <= 8
                ? config.layerPrices.layer8Plus
                : config.layerPrices.layer10Plus;

    const areaFactor = Math.max(0, areaDm2 - 1.0) * (numLayers * config.scaling.areaRatePerDm2PerLayer);
    const qtyFactor = Math.max(0, effectiveQty - 5) * (config.scaling.qtyBaseUnitFee + numLayers * config.scaling.qtyPerLayerFee);

    pcbFabrication = base + areaFactor + qtyFactor + finishFee + materialFee;

    if ((params.thickness ?? 1.6) > 1.6) pcbFabrication += config.scaling.thicknessOver16Fee;
    if (params.castellatedHoles === "Yes") pcbFabrication += config.scaling.castellatedHolesFee;
    if (params.edgePlating === "Yes") pcbFabrication += config.scaling.edgePlatingFee;
    if (params.impedanceControl === "Yes") pcbFabrication += config.scaling.impedanceControlFee;

    pcbFabrication = Math.max(config.minOrderPrice, pcbFabrication);
  }

  const finalFab = Number(pcbFabrication.toFixed(2));
  const engineeringFee = Number(config.scaling.engineeringFee.toFixed(2));
  const eTestFee = Number(config.scaling.eTestFee.toFixed(2));
  const total = Number((finalFab + engineeringFee + eTestFee + params.shippingFee).toFixed(2));

  return {
    pcbFabrication: finalFab,
    engineeringFee,
    eTestFee,
    shippingFee: params.shippingFee,
    carrier: params.carrier,
    total,
    weightKg: Number((0.08 * (effectiveQty / 5) * (numLayers / 2) * (boardAreaCm2 / 100)).toFixed(2)),
  };
}
