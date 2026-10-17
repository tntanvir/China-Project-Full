import { cache } from "react";

import { apiRequest } from "./api-client";
import type { User } from "@/store/authStore";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
  address?: string;
};

type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

type UpdateProfileInput = {
  name?: string;
  companyName?: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
};

type LoginResponse = {
  needPasswordChange: boolean;
  user: User;
};

export const AuthService = {
  register: async (payload: RegisterInput) => apiRequest<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }),

  login: async (payload: LoginInput): Promise<User> => {
    const result = await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return result.user;
  },

  logout: async () =>
    apiRequest<null>("/auth/logout", {
      method: "POST",
    }),

  refreshToken: async () =>
    apiRequest<User>("/auth/refresh-token", {
      method: "POST",
    }),

  verifyOtp: async (payload: { email: string; otp: string }) =>
    apiRequest<null>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resendOtp: async (email: string) =>
    apiRequest<null>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  changePassword: async (payload: ChangePasswordInput) =>
    apiRequest<null>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateProfile: async (payload: UpdateProfileInput) =>
    apiRequest<User>("/auth/update-profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  forgotPassword: async (email: string) =>
    apiRequest<null>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: async (payload: { resetToken: string; newPassword: string }) =>
    apiRequest<null>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getSession: cache(async () => apiRequest<User | null>("/auth/me")),
};
