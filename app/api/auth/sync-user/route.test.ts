import { describe, it, expect, vi, beforeEach } from "vitest";

const requireAuthMock = vi.fn();
const syncUserRecordMock = vi.fn();

vi.mock("@/lib/auth/server", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth/server")>("@/lib/auth/server");
  return {
    ...actual,
    requireAuth: (...args: unknown[]) => requireAuthMock(...args),
  };
});

vi.mock("@/lib/supabase/admin", () => ({
  syncUserRecord: (...args: unknown[]) => syncUserRecordMock(...args),
}));

const { POST } = await import("./route");
const { AuthError } = await import("@/lib/auth/server");

function makeRequest(body: unknown): Request {
  return new Request("https://example.com/api/auth/sync-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/sync-user", () => {
  beforeEach(() => {
    requireAuthMock.mockReset();
    syncUserRecordMock.mockReset();
  });

  it("creates a users row with correct fields for a Google sign-in (name from token)", async () => {
    requireAuthMock.mockResolvedValueOnce({
      uid: "google-uid-1",
      email: "googleuser@example.com",
      name: "Google Display Name",
    });
    syncUserRecordMock.mockResolvedValueOnce(undefined);

    const response = await POST(makeRequest({}));

    expect(syncUserRecordMock).toHaveBeenCalledWith({
      id: "google-uid-1",
      email: "googleuser@example.com",
      name: "Google Display Name",
    });
    expect(response.status).toBe(200);
  });

  it("creates a users row with correct fields for an email/password sign-up (name from body)", async () => {
    requireAuthMock.mockResolvedValueOnce({
      uid: "email-uid-1",
      email: "emailuser@example.com",
    });
    syncUserRecordMock.mockResolvedValueOnce(undefined);

    const response = await POST(makeRequest({ name: "Email Signup User" }));

    expect(syncUserRecordMock).toHaveBeenCalledWith({
      id: "email-uid-1",
      email: "emailuser@example.com",
      name: "Email Signup User",
    });
    expect(response.status).toBe(200);
  });

  it("trims and length-caps the name server-side regardless of client input", async () => {
    requireAuthMock.mockResolvedValueOnce({ uid: "uid-1", email: "user@example.com" });
    syncUserRecordMock.mockResolvedValueOnce(undefined);

    const overlong = "  " + "a".repeat(500) + "  ";
    await POST(makeRequest({ name: overlong }));

    const calledWith = syncUserRecordMock.mock.calls[0][0];
    expect(calledWith.name.length).toBeLessThanOrEqual(200);
    expect(calledWith.name.startsWith(" ")).toBe(false);
  });

  it("rejects when the token has no email claim", async () => {
    requireAuthMock.mockResolvedValueOnce({ uid: "uid-1" });
    const response = await POST(makeRequest({ name: "No Email" }));
    expect(response.status).toBe(400);
    expect(syncUserRecordMock).not.toHaveBeenCalled();
  });

  it("rejects when no name is available from token or body", async () => {
    requireAuthMock.mockResolvedValueOnce({ uid: "uid-1", email: "user@example.com" });
    const response = await POST(makeRequest({}));
    expect(response.status).toBe(400);
    expect(syncUserRecordMock).not.toHaveBeenCalled();
  });

  it("propagates the AuthError status when requireAuth rejects (e.g. missing/expired token)", async () => {
    requireAuthMock.mockRejectedValueOnce(new AuthError(401, "Invalid or expired token"));
    const response = await POST(makeRequest({ name: "X" }));
    expect(response.status).toBe(401);
  });
});
