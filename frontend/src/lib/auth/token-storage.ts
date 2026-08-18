import type { TokenPair } from "@/types";

const ACCESS_TOKEN_KEY = "scam_detection_access_token";
const REFRESH_TOKEN_KEY = "scam_detection_refresh_token";

/**
 * Tokens are stored in localStorage for this single-page-app deployment.
 * This is a standard, documented tradeoff: it's simple and works without a
 * backend-for-frontend, but is readable by any script on the page (XSS
 * risk). A hardened production deployment would move refresh-token storage
 * to an httpOnly cookie set by a thin backend-for-frontend layer instead.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

const SESSION_FLAG_COOKIE = "has_session";

function setSessionFlagCookie(): void {
  if (!isBrowser()) return;
  // 7 days, matching the backend's REFRESH_TOKEN_EXPIRE_DAYS default.
  document.cookie = `${SESSION_FLAG_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearSessionFlagCookie(): void {
  if (!isBrowser()) return;
  document.cookie = `${SESSION_FLAG_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(pair: TokenPair): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, pair.access_token);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, pair.refresh_token);
  setSessionFlagCookie();
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearSessionFlagCookie();
}

export function hasSession(): boolean {
  return getAccessToken() !== null;
}
