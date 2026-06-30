import { describe, it, expect, vi, beforeEach } from "vitest";

const verifyIdToken = vi.fn();
const isUserAdminMock = vi.fn();

vi.mock("@/lib/firebase/admin", () => ({
  getAdminAuth: () => ({ verifyIdToken }),
}));

vi.mock("@/lib/supabase/admin", () => ({
  isUserAdmin: (uid: string) => isUserAdminMock(uid),
}));

const { requireAuth, requireOwnership, requireAdmin, AuthError } = await import("@/lib/auth/server");

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request("https://example.com/api/test", { headers });
}

describe("requireAuth", () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
  });

  it("rejects a request with no token", async () => {
    await expect(requireAuth(makeRequest())).rejects.toMatchObject({ status: 401 });
  });

  it("rejects a malformed Authorization header", async () => {
    await expect(
      requireAuth(makeRequest({ Authorization: "NotBearer abc" }))
    ).rejects.toMatchObject({ status: 401 });
    expect(verifyIdToken).not.toHaveBeenCalled();
  });

  it("rejects an expired token", async () => {
    verifyIdToken.mockRejectedValueOnce(
      Object.assign(new Error("Firebase ID token has expired"), {
        code: "auth/id-token-expired",
      })
    );
    await expect(
      requireAuth(makeRequest({ Authorization: "Bearer expired-token" }))
    ).rejects.toMatchObject({ status: 401 });
  });

  it("rejects a malformed token", async () => {
    verifyIdToken.mockRejectedValueOnce(
      Object.assign(new Error("Decoding Firebase ID token failed"), {
        code: "auth/argument-error",
      })
    );
    await expect(
      requireAuth(makeRequest({ Authorization: "Bearer not-a-real-jwt" }))
    ).rejects.toMatchObject({ status: 401 });
  });

  it("accepts a request with a valid token", async () => {
    verifyIdToken.mockResolvedValueOnce({
      uid: "user-123",
      email: "user@example.com",
      name: "Test User",
    });
    const result = await requireAuth(makeRequest({ Authorization: "Bearer valid-token" }));
    expect(result).toEqual({
      uid: "user-123",
      email: "user@example.com",
      name: "Test User",
      picture: undefined,
    });
  });
});

describe("requireOwnership", () => {
  it("rejects when resourceUserId does not equal authenticatedUserId", () => {
    let caught: unknown;
    try {
      requireOwnership("owner-a", "owner-b");
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(AuthError);
    expect((caught as InstanceType<typeof AuthError>).status).toBe(403);
  });

  it("accepts when they match", () => {
    expect(() => requireOwnership("owner-a", "owner-a")).not.toThrow();
  });
});

describe("requireAdmin", () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
    isUserAdminMock.mockReset();
  });

  it("rejects an unauthenticated request before checking admin status", async () => {
    await expect(requireAdmin(makeRequest())).rejects.toMatchObject({ status: 401 });
    expect(isUserAdminMock).not.toHaveBeenCalled();
  });

  it("rejects a non-admin authenticated user", async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: "user-123", email: "user@example.com" });
    isUserAdminMock.mockResolvedValueOnce(false);
    await expect(
      requireAdmin(makeRequest({ Authorization: "Bearer valid-token" }))
    ).rejects.toMatchObject({ status: 403 });
  });

  it("accepts an is_admin = true user", async () => {
    verifyIdToken.mockResolvedValueOnce({ uid: "admin-1", email: "admin@example.com" });
    isUserAdminMock.mockResolvedValueOnce(true);
    const result = await requireAdmin(makeRequest({ Authorization: "Bearer valid-token" }));
    expect(result.uid).toBe("admin-1");
  });
});
