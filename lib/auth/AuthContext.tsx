"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onIdTokenChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function syncUserToBackend(idToken: string, name?: string): Promise<void> {
  await fetch("/api/auth/sync-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ name }),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const auth = getFirebaseAuth();
      // PRD §7.2f: onIdTokenChanged (not a one-time getIdToken() call) so
      // the stored token always reflects the SDK's silent background
      // refresh — users are never logged out mid-session just because the
      // 1-hour ID token expired.
      unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        setIdToken(firebaseUser ? await firebaseUser.getIdToken() : null);
        setLoading(false);
      });

      // Defensive fallback: if Firebase Auth never calls back at all
      // (blocked request, network issue), don't leave protected routes
      // stuck showing nothing forever — treat it as signed-out once this
      // fires, same as an explicit null callback would.
      timeoutId = setTimeout(() => {
        setLoading((current) => (current ? false : current));
      }, 8000);
    } catch {
      // getFirebaseAuth()/getAuth() throws synchronously when Firebase is
      // unconfigured or misconfigured (e.g. auth/invalid-api-key) — found
      // via manual browser verification with no Firebase project set up.
      // That throw happens before onIdTokenChanged or the timeout above
      // ever get registered, so neither fallback would otherwise run.
      // Resolve to signed-out immediately rather than hanging forever.
      setUser(null);
      setIdToken(null);
      setLoading(false);
    }

    return () => {
      unsubscribe?.();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    await syncUserToBackend(token, result.user.displayName ?? undefined);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    const auth = getFirebaseAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const token = await result.user.getIdToken();
    await syncUserToBackend(token, name);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOutUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
