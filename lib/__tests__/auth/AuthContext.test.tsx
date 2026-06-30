import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

const onIdTokenChangedMock = vi.fn();
const signInWithPopupMock = vi.fn();
const createUserWithEmailAndPasswordMock = vi.fn();
const signInWithEmailAndPasswordMock = vi.fn();
const signOutMock = vi.fn();
const sendPasswordResetEmailMock = vi.fn();
const updateProfileMock = vi.fn();

vi.mock("firebase/auth", () => ({
  onIdTokenChanged: (...args: unknown[]) => onIdTokenChangedMock(...args),
  signInWithPopup: (...args: unknown[]) => signInWithPopupMock(...args),
  GoogleAuthProvider: vi.fn(),
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    createUserWithEmailAndPasswordMock(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => signInWithEmailAndPasswordMock(...args),
  signOut: (...args: unknown[]) => signOutMock(...args),
  sendPasswordResetEmail: (...args: unknown[]) => sendPasswordResetEmailMock(...args),
  updateProfile: (...args: unknown[]) => updateProfileMock(...args),
}));

const getFirebaseAuthMock = vi.fn(() => ({ fakeAuth: true }));
vi.mock("@/lib/firebase/client", () => ({
  getFirebaseAuth: () => getFirebaseAuthMock(),
}));

const { AuthProvider, useAuth } = await import("@/lib/auth/AuthContext");

type FakeUser = { uid: string; displayName?: string; getIdToken: () => Promise<string> };

describe("AuthProvider / useAuth", () => {
  let capturedCallback: ((user: FakeUser | null) => void | Promise<void>) | null = null;
  let unsubscribeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    capturedCallback = null;
    unsubscribeMock = vi.fn();
    onIdTokenChangedMock.mockReset();
    onIdTokenChangedMock.mockImplementation((_auth: unknown, callback: typeof capturedCallback) => {
      capturedCallback = callback;
      return unsubscribeMock;
    });
    signInWithPopupMock.mockReset();
    createUserWithEmailAndPasswordMock.mockReset();
    signInWithEmailAndPasswordMock.mockReset();
    signOutMock.mockReset();
    sendPasswordResetEmailMock.mockReset();
    updateProfileMock.mockReset();
    getFirebaseAuthMock.mockReset();
    getFirebaseAuthMock.mockImplementation(() => ({ fakeAuth: true }));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("registers an onIdTokenChanged listener on mount", () => {
    renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(onIdTokenChangedMock).toHaveBeenCalledTimes(1);
  });

  it("updates the stored token when onIdTokenChanged fires with a user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    const fakeUser: FakeUser = { uid: "user-1", getIdToken: vi.fn().mockResolvedValue("fresh-token") };

    await act(async () => {
      await capturedCallback?.(fakeUser);
    });

    await waitFor(() => expect(result.current.idToken).toBe("fresh-token"));
    expect(result.current.user).toBe(fakeUser);
    expect(result.current.loading).toBe(false);
  });

  it("falls back to loading=false immediately if Firebase initialization throws synchronously", async () => {
    // Regression test: found via manual browser verification with no
    // Firebase project configured — getFirebaseAuth() throws synchronously
    // (auth/invalid-api-key) *before* onIdTokenChanged or the timeout
    // fallback below are ever registered, so without this try/catch a
    // protected route's RequireAuth would never see loading become false
    // and would hang on a blank page forever instead of redirecting.
    getFirebaseAuthMock.mockImplementation(() => {
      throw new Error("Firebase: Error (auth/invalid-api-key).");
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.idToken).toBeNull();
    expect(onIdTokenChangedMock).not.toHaveBeenCalled();
  });

  it("falls back to loading=false if onIdTokenChanged never calls back at all", async () => {
    // Regression test: discovered via manual browser verification that with
    // no callback ever firing (e.g. Firebase unreachable/misconfigured),
    // loading stayed true forever and RequireAuth never redirected,
    // leaving protected routes stuck on a blank page indefinitely.
    onIdTokenChangedMock.mockImplementation(() => unsubscribeMock); // never invokes the callback
    vi.useFakeTimers();
    try {
      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
      expect(result.current.loading).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(8000);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.user).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("clears user and token when onIdTokenChanged fires with null", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    const fakeUser: FakeUser = { uid: "user-1", getIdToken: vi.fn().mockResolvedValue("fresh-token") };

    await act(async () => {
      await capturedCallback?.(fakeUser);
    });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    await act(async () => {
      await capturedCallback?.(null);
    });

    await waitFor(() => expect(result.current.user).toBeNull());
    expect(result.current.idToken).toBeNull();
  });

  it("unsubscribes the listener on unmount", () => {
    const { unmount } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    unmount();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("signInWithGoogle syncs the user to the backend with the Google display name", async () => {
    const fakeUser: FakeUser = {
      uid: "g-1",
      displayName: "Google User",
      getIdToken: vi.fn().mockResolvedValue("g-token"),
    };
    signInWithPopupMock.mockResolvedValueOnce({ user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(signInWithPopupMock).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/sync-user",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer g-token" }),
        body: JSON.stringify({ name: "Google User" }),
      })
    );
  });

  it("signUpWithEmail creates the user row with correct fields via the backend sync", async () => {
    const fakeUser: FakeUser = { uid: "e-1", getIdToken: vi.fn().mockResolvedValue("e-token") };
    createUserWithEmailAndPasswordMock.mockResolvedValueOnce({ user: fakeUser });
    updateProfileMock.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await act(async () => {
      await result.current.signUpWithEmail("new@example.com", "Sup3rSecret!", "New User");
    });

    expect(createUserWithEmailAndPasswordMock).toHaveBeenCalledWith(
      expect.anything(),
      "new@example.com",
      "Sup3rSecret!"
    );
    expect(updateProfileMock).toHaveBeenCalledWith(fakeUser, { displayName: "New User" });
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/sync-user",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer e-token" }),
        body: JSON.stringify({ name: "New User" }),
      })
    );
  });

  it("signInWithEmail succeeds with valid credentials", async () => {
    signInWithEmailAndPasswordMock.mockResolvedValueOnce({ user: { uid: "e-1" } });
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signInWithEmail("user@example.com", "correct-password");
    });

    expect(signInWithEmailAndPasswordMock).toHaveBeenCalledWith(
      expect.anything(),
      "user@example.com",
      "correct-password"
    );
  });

  it("signInWithEmail fails with a clear error on invalid credentials", async () => {
    signInWithEmailAndPasswordMock.mockRejectedValueOnce(
      Object.assign(new Error("Firebase: Error (auth/invalid-credential)."), {
        code: "auth/invalid-credential",
      })
    );
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await expect(
      result.current.signInWithEmail("user@example.com", "wrong-password")
    ).rejects.toMatchObject({ code: "auth/invalid-credential" });
  });

  it("signOutUser calls Firebase signOut", async () => {
    signOutMock.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signOutUser();
    });

    expect(signOutMock).toHaveBeenCalled();
  });

  it("logout correctly clears the session once onIdTokenChanged reflects it", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    const fakeUser: FakeUser = { uid: "user-1", getIdToken: vi.fn().mockResolvedValue("fresh-token") };

    await act(async () => {
      await capturedCallback?.(fakeUser);
    });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    signOutMock.mockImplementationOnce(async () => {
      await capturedCallback?.(null);
    });
    await act(async () => {
      await result.current.signOutUser();
    });

    await waitFor(() => expect(result.current.user).toBeNull());
    expect(result.current.idToken).toBeNull();
  });

  it("resetPassword calls Firebase sendPasswordResetEmail with the given email", async () => {
    sendPasswordResetEmailMock.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.resetPassword("forgot@example.com");
    });

    expect(sendPasswordResetEmailMock).toHaveBeenCalledWith(expect.anything(), "forgot@example.com");
  });
});
