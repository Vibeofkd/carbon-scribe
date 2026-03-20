import type { AuthSlice } from "./auth.types";

export const selectUser = (s: AuthSlice) => s.user;
export const selectToken = (s: AuthSlice) => s.token;
export const selectRefreshToken = (s: AuthSlice) => s.refreshToken;
export const selectIsAuthenticated = (s: AuthSlice) => s.isAuthenticated;
export const selectAuthError = (s: AuthSlice) => s.authError;
export const selectIsHydrated = (s: AuthSlice) => s.isHydrated;
export const selectTokenType = (s: AuthSlice) => s.tokenType;
export const selectTokenExpiresIn = (s: AuthSlice) => s.expiresIn;

export const selectUserName = (s: AuthSlice) => s.user?.full_name ?? "";
export const selectUserRole = (s: AuthSlice) => s.user?.role ?? "farmer";
