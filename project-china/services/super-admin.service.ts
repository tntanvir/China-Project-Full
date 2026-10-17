import { apiRequest } from "./api-client";

export type SystemSetting = {
  id: string;
  key: string;
  value: unknown;
  group: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  userId?: string;
  action: string;
  details?: unknown;
  ipAddress?: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
};

export type SecurityCenter = {
  summary: {
    blockedUsers: number;
    inactiveUsers: number;
    recentLogins: number;
    securityEvents: number;
  };
  recentLogins: unknown[];
  events: AuditLog[];
};

export type MonitoringStatus = {
  api: { status: string; checkedAt: string };
  database: { status: string; models: Record<string, number> };
  application: { status: string; environment: string };
};

export type SuperAdminOverview = {
  totals: {
    revenue: number;
    orders: number;
    products: number;
    customers: number;
    admins: number;
    pendingOrders: number;
    deliveredOrders: number;
    lowStockProducts: number;
    transactions: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  paymentMethods: Record<string, number>;
  orderStatus: Array<{ status: string; count: number }>;
  productStatus: Array<{ status: string; count: number }>;
  recentOrders: Array<{
    id: string;
    status: string;
    totalAmount: number;
    paymentStatus: string;
    createdAt: string;
    user?: { id: string; name?: string; email: string };
  }>;
  recentPayments: Array<{
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
    createdAt: string;
  }>;
};

export const SuperAdminService = {
  getOverview: () => apiRequest<SuperAdminOverview>("/super-admin/overview"),

  getSettings: (group?: string) =>
    apiRequest<SystemSetting[]>(`/super-admin/settings${group ? `?group=${encodeURIComponent(group)}` : ""}`),

  saveSetting: (payload: { key: string; value: unknown; group?: string }) =>
    apiRequest<SystemSetting>("/super-admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getAuditLogs: () => apiRequest<AuditLog[]>("/super-admin/audit-logs"),

  getSecurityCenter: () => apiRequest<SecurityCenter>("/super-admin/security"),

  getMonitoring: () => apiRequest<MonitoringStatus>("/super-admin/monitoring"),
};
