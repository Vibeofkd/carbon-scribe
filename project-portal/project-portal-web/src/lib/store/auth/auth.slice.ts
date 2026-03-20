import type { StateCreator } from "zustand";
import type { StoreState } from "../store";
import type { RegisterPayload, AuthSlice } from "./auth.types";
import { getProfileApi, loginApi, logoutApi, refreshApi, registerApi } from "@/lib/api/auth.api";
import { setAuthToken, setOnUnauthorized } from "@/lib/api/axios";

export const createAuthSlice: StateCreator<
  StoreState,
  [],
  [],
  AuthSlice
> = (set, get) => {
  const clearAuthState = () => {
    setAuthToken(null);
    set({
      token: null,
      refreshToken: null,
      expiresIn: null,
      tokenType: "Bearer",
      user: null,
      isAuthenticated: false,
      authError: null,
      authLoading: {
        login: false,
        register: false,
        refresh: false,
        profile: false,
        logout: false,
      },
    });
  };

  setOnUnauthorized(() => {
    clearAuthState();
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.replace(`/login?next=${encodeURIComponent(path)}`);
      }
    }
  });

  return {
    user: null,
    token: null,
    refreshToken: null,
    expiresIn: null,
    tokenType: "Bearer",
    isAuthenticated: false,

    isHydrated: false,
    authLoading: {
      login: false,
      register: false,
      refresh: false,
      profile: false,
      logout: false,
    },
    authError: null,

    setHydrated: (v) => set({ isHydrated: v }),

    clearError: () => set({ authError: null }),

    login: async (email, password) => {
      set((s) => ({
        authLoading: { ...s.authLoading, login: true },
        authError: null,
      }));
      try {
        const { access_token, refresh_token, expires_in, token_type, user } =
          await loginApi({ email, password });

        setAuthToken(access_token);

        set({
          token: access_token,
          refreshToken: refresh_token,
          expiresIn: expires_in,
          tokenType: token_type ?? "Bearer",
          user,
          isHydrated: true,
          isAuthenticated: true,
          authLoading: { ...get().authLoading, login: false },
        });
      } catch (e: any) {
        const msg = e?.response?.data?.error || e?.message || "Login failed";
        set((s) => ({
          authLoading: { ...s.authLoading, login: false },
          authError: msg,
        }));
        throw e;
      }
    },

    register: async (data: RegisterPayload) => {
      set((s) => ({
        authLoading: { ...s.authLoading, register: true },
        authError: null,
      }));
      try {
        const res = await registerApi(data);
        set((s) => ({ authLoading: { ...s.authLoading, register: false } }));
        return res;
      } catch (e: any) {
        const msg =
          e?.response?.data?.error || e?.message || "Registration failed";
        set((s) => ({
          authLoading: { ...s.authLoading, register: false },
          authError: msg,
        }));
        throw e;
      }
    },

    logout: async () => {
      set((s) => ({ authLoading: { ...s.authLoading, logout: true } }));
      try {
        if (get().token) {
          await logoutApi();
        }
      } catch {
        // Intentionally ignore logout API errors and clear local session.
      } finally {
        clearAuthState();
      }
    },

    refreshSession: async () => {
      const refreshToken = get().refreshToken;
      if (!refreshToken) {
        clearAuthState();
        return;
      }

      set((s) => ({ authLoading: { ...s.authLoading, refresh: true } }));
      try {
        const refreshed = await refreshApi(refreshToken);
        setAuthToken(refreshed.access_token);

        set((s) => ({
          token: refreshed.access_token,
          refreshToken: refreshed.refresh_token ?? s.refreshToken,
          expiresIn: refreshed.expires_in,
          tokenType: refreshed.token_type ?? s.tokenType,
          isHydrated: true,
          isAuthenticated: true,
          authLoading: { ...s.authLoading, refresh: false },
        }));

        await get().fetchProfile();
      } catch {
        clearAuthState();
      }
    },

    fetchProfile: async () => {
      const token = get().token;
      if (!token) {
        clearAuthState();
        return;
      }

      set((s) => ({ authLoading: { ...s.authLoading, profile: true } }));
      try {
        setAuthToken(token);
        const user = await getProfileApi();
        set((s) => ({
          user,
          isHydrated: true,
          isAuthenticated: true,
          authLoading: { ...s.authLoading, profile: false },
        }));
      } catch (e: any) {
        const msg = e?.response?.data?.error || e?.message || "Failed to load profile";
        set((s) => ({
          authLoading: { ...s.authLoading, profile: false },
          authError: msg,
        }));
        throw e;
      }
    },
  };
};
