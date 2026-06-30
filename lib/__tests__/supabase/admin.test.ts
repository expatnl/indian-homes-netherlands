import { describe, it, expect, vi, beforeEach } from "vitest";

const upsertMock = vi.fn();
const singleMock = vi.fn();
const eqMock = vi.fn(() => ({ single: singleMock }));
const selectMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn(() => ({ upsert: upsertMock, select: selectMock }));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ from: fromMock })),
}));

const { syncUserRecord, isUserAdmin } = await import("@/lib/supabase/admin");

describe("syncUserRecord", () => {
  beforeEach(() => {
    upsertMock.mockReset();
    fromMock.mockClear();
  });

  it("upserts with ignoreDuplicates so an existing row is never overwritten on a later login", async () => {
    upsertMock.mockResolvedValueOnce({ error: null });
    await syncUserRecord({ id: "uid-1", email: "a@example.com", name: "A" });
    expect(fromMock).toHaveBeenCalledWith("users");
    expect(upsertMock).toHaveBeenCalledWith(
      { id: "uid-1", email: "a@example.com", name: "A" },
      { onConflict: "id", ignoreDuplicates: true }
    );
  });

  it("throws when the upsert fails", async () => {
    upsertMock.mockResolvedValueOnce({ error: { message: "boom" } });
    await expect(
      syncUserRecord({ id: "uid-1", email: "a@example.com", name: "A" })
    ).rejects.toThrow(/boom/);
  });
});

describe("isUserAdmin", () => {
  beforeEach(() => {
    singleMock.mockReset();
  });

  it("returns true when is_admin is true", async () => {
    singleMock.mockResolvedValueOnce({ data: { is_admin: true }, error: null });
    await expect(isUserAdmin("uid-1")).resolves.toBe(true);
  });

  it("returns false when is_admin is false", async () => {
    singleMock.mockResolvedValueOnce({ data: { is_admin: false }, error: null });
    await expect(isUserAdmin("uid-1")).resolves.toBe(false);
  });

  it("returns false when the user does not exist", async () => {
    singleMock.mockResolvedValueOnce({ data: null, error: { message: "no rows" } });
    await expect(isUserAdmin("missing-uid")).resolves.toBe(false);
  });
});
