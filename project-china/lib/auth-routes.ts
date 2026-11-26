export type AppRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export function normalizeRole(role?: string | null): AppRole {
  const normalized = String(role || "CUSTOMER")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  if (normalized === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (normalized === "ADMIN") return "ADMIN";

  return "CUSTOMER";
}

export function getRoleDashboardPath(role?: string | null): string {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "SUPER_ADMIN") return "/super-admin";
  if (normalizedRole === "ADMIN") return "/admin";

  return "/dashboard";
}

/**
 * Validates and safely resolves destination URL after login/registration.
 * Prevents open-redirect vulnerabilities and role mismatches.
 */
export function getSafeRedirectUrl(targetUrl?: string | null, role?: string | null): string {
  const fallback = getRoleDashboardPath(role);
  if (!targetUrl || typeof targetUrl !== "string") return fallback;

  const trimmed = targetUrl.trim();

  // Security check: Must start with a single slash (prevent //evil.com or /\evil.com)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Prevent redirect loop back to authentication pages
  if (
    trimmed.startsWith("/login") ||
    trimmed.startsWith("/register") ||
    trimmed.startsWith("/forgot-password") ||
    trimmed.startsWith("/reset-password")
  ) {
    return fallback;
  }

  const normalizedRole = normalizeRole(role);

  // Customers cannot be redirected to Admin/Super Admin sections
  if (normalizedRole === "CUSTOMER") {
    if (trimmed.startsWith("/admin") || trimmed.startsWith("/super-admin")) {
      return "/dashboard";
    }
  }

  // Operations Admins cannot be redirected to Super Admin sections
  if (normalizedRole === "ADMIN") {
    if (trimmed.startsWith("/super-admin")) {
      return "/admin";
    }
  }

  return trimmed;
}

/**
 * Synchronizes client-accessible session flag cookies so Next.js server middleware
 * can immediately determine authentication status without waiting for async client hydration.
 */
export function setClientAuthCookies(role?: string | null) {
  if (typeof document !== "undefined") {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    const normalizedRole = normalizeRole(role);
    document.cookie = `auth_session=1; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `user_role=${normalizedRole}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

export function clearClientAuthCookies() {
  if (typeof document !== "undefined") {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
}
