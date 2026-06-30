import { describe, it, expect, beforeEach } from "vitest";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  hasAnalyticsConsent,
} from "@/lib/consent";

describe("consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no consent decision has been made", () => {
    expect(getAnalyticsConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("persists a granted consent decision", () => {
    setAnalyticsConsent("granted");
    expect(getAnalyticsConsent()).toBe("granted");
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("persists a denied consent decision", () => {
    setAnalyticsConsent("denied");
    expect(getAnalyticsConsent()).toBe("denied");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("ignores a corrupted/unexpected stored value", () => {
    window.localStorage.setItem("ih_cookie_consent", "not-a-real-value");
    expect(getAnalyticsConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });
});
