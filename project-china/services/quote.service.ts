import { apiRequest } from "./api-client";

export type QuoteInput = {
  name: string;
  width: number;
  height: number;
  quantity: number;
  layerCount: number;
  materialType: string;
  boardThickness: number;
  copperWeight: number;
  surfaceFinish: string;
  solderMaskColor: string;
  silkscreenColor: string;
};

export const QuoteService = {
  createQuote: (payload: QuoteInput) =>
    apiRequest("/quotes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyQuotes: () => apiRequest("/quotes/my"),

  getAllQuotes: () => apiRequest("/quotes"),

  getQuoteById: (quoteId: string) => apiRequest(`/quotes/${quoteId}`),

  convertToOrder: (quoteId: string, payload: { shippingAddress: string; billingAddress?: string }) =>
    apiRequest(`/quotes/${quoteId}/convert-to-order`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
