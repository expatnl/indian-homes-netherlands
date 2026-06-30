const CONSENT_STORAGE_KEY = "ih_cookie_consent";

export type ConsentValue = "granted" | "denied";

/**
 * Stub consent store for Phase 1 scaffolding. The full cookie consent banner
 * (PRD Section 10.1) is built in Phase 9 — this only exists so analytics
 * scripts can be gated behind consent from day one rather than retrofitted.
 */
export function getAnalyticsConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setAnalyticsConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === "granted";
}
