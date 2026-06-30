"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Client-side route gate (PRD §7.2c / §13: "Auth middleware protecting
 * /account/my-listings..."). Firebase Auth state lives in the client SDK
 * (per §7.2f's onIdTokenChanged-based design), so gating happens here
 * rather than in Next.js middleware, which would need a separate
 * server-side session cookie mechanism not specified by the PRD.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
}
