import { create } from 'zustand';
import { clearClientAuthCookies, setClientAuthCookies } from '@/lib/auth-routes';
import { getApiBaseUrl } from '@/lib/api-config';

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
    setClientAuthCookies(user.role);
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: async () => {
    clearClientAuthCookies();
    const API_BASE_URL = getApiBaseUrl();
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  checkAuth: async () => {
    const API_BASE_URL = getApiBaseUrl();
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
          clearClientAuthCookies();
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
          }).catch(() => null);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        const retryResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        const retryPayload = await retryResponse.json();

        if (!retryResponse.ok || !retryPayload.success) {
          clearClientAuthCookies();
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
          }).catch(() => null);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        setClientAuthCookies(retryPayload.data?.role);
        set({ user: retryPayload.data, isAuthenticated: true, isLoading: false });
        return;
      }

      setClientAuthCookies(payload.data?.role);
      set({ user: payload.data, isAuthenticated: true, isLoading: false });
    } catch {
      clearClientAuthCookies();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
