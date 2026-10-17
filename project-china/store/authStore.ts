import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  role: string;
  profilePhoto?: string;
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  checkAuth: async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        }).catch(() => null);

        if (!refreshResponse?.ok) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        const retryPayload = await retryResponse.json();

        if (!retryResponse.ok || !retryPayload.success) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ user: retryPayload.data, isAuthenticated: true, isLoading: false });
        return;
      }

      set({ user: payload.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
