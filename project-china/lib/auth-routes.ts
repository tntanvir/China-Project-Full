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

export function getRoleDashboardPath(role?: string | null) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "SUPER_ADMIN") return "/super-admin";
  if (normalizedRole === "ADMIN") return "/admin";

  return "/dashboard";
}
