"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/account/my-listings");
    } catch {
      setError("Could not sign in with Google. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      router.push("/account/my-listings");
    } catch {
      setError("That email and password combination doesn't match our records.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-2xl font-bold">Sign in</h1>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="mt-6 w-full rounded border px-4 py-2"
      >
        Continue with Google
      </button>

      <div className="my-6 text-center text-sm text-[#555555]">or</div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded border px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-[#C0392B]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-[#E85D04] px-4 py-2 text-white"
        >
          Sign in
        </button>
      </form>

      <p className="mt-4 text-sm">
        <Link href="/account/forgot-password">Forgot your password?</Link>
      </p>
    </main>
  );
}
