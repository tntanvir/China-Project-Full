import { apiRequest } from "./api-client";
import {
  DEFAULT_QUOTE_PRICING_CONFIG,
  mergePricingConfig,
  type QuotePricingConfig,
} from "@/lib/quote-pricing";

export const PricingService = {
  getPublicPricingConfig: async (): Promise<QuotePricingConfig> => {
    try {
      const data = await apiRequest<QuotePricingConfig>("/quotes/pricing-config", {
        cache: "no-store",
      });
      return mergePricingConfig(data);
    } catch {
      return DEFAULT_QUOTE_PRICING_CONFIG;
    }
  },

  getAdminPricingConfig: async (): Promise<QuotePricingConfig> => {
    const data = await apiRequest<QuotePricingConfig>("/admin/pricing-config", {
      cache: "no-store",
    });
    return mergePricingConfig(data);
  },

  updateAdminPricingConfig: async (payload: QuotePricingConfig): Promise<QuotePricingConfig> => {
    const data = await apiRequest<QuotePricingConfig>("/admin/pricing-config", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mergePricingConfig(data);
  },
};
