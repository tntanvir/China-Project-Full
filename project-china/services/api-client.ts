const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
  stats?: {
    totalCount?: number;
    inquiriesCount?: number;
    totalVolume?: number;
    pending?: number;
    production?: number;
    completed?: number;
    totalCustomers?: number;
    activeCustomers?: number;
    verifiedCustomers?: number;
    totalOrders?: number;
    [key: string]: any;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  meta?: PaginationMeta;
  data: T;
};

export async function apiRequest<T>(path: string, init?: RequestInit, isRetry = false): Promise<T> {
  const isFormData = init?.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...init?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (response.status === 401 && !isRetry && !path.startsWith("/auth/")) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshRes.ok) {
        return await apiRequest<T>(path, init, true);
      }
    } catch {
      // Refresh failed, continue to standard error handling
    }
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "API request failed");
  }

  return payload.data;
}

export async function apiRequestWithMeta<T>(
  path: string,
  init?: RequestInit,
  isRetry = false
): Promise<{ data: T; meta?: PaginationMeta }> {
  const isFormData = init?.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...init?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (response.status === 401 && !isRetry && !path.startsWith("/auth/")) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshRes.ok) {
        return await apiRequestWithMeta<T>(path, init, true);
      }
    } catch {
      // Refresh failed, continue to standard error handling
    }
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "API request failed");
  }

  return {
    data: payload.data,
    meta: payload.meta,
  };
}

