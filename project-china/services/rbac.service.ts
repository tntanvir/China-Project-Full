import { apiRequest } from "./api-client";

export const RbacService = {
  getPermissions: () => apiRequest("/rbac/permissions"),

  getRoles: () => apiRequest("/rbac/roles"),

  createRole: (payload: { name: string; slug: string; description?: string; permissions: string[] }) =>
    apiRequest("/rbac/roles", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateRole: (id: string, payload: { name?: string; description?: string; permissions?: string[]; isActive?: boolean }) =>
    apiRequest(`/rbac/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteRole: (id: string) =>
    apiRequest(`/rbac/roles/${id}`, {
      method: "DELETE",
    }),

  getAdmins: () => apiRequest("/rbac/admins"),

  createAdmin: (payload: { name: string; email: string; password: string; phone?: string; permissions?: string[] }) =>
    apiRequest("/rbac/admins", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  suspendAdmin: (userId: string) =>
    apiRequest(`/rbac/admins/${userId}/suspend`, {
      method: "PATCH",
    }),

  activateAdmin: (userId: string) =>
    apiRequest(`/rbac/admins/${userId}/activate`, {
      method: "PATCH",
    }),

  assignRole: (payload: { userId: string; roleId: string }) =>
    apiRequest("/rbac/assign-role", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
