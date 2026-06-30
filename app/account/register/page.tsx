"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function RegisterPage() {
  const { signInWithGoogle, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
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
      setError("Could not sign up with Google. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signUpWithEmail(email, password, name);
      router.push("/account/my-listings");
    } catch {
      setError("That doesn't look right — check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-2xl font-bold">Create your account</h1>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="mt-6 w-full rounded border px-4 py-2"
      >
        Continue with Google
      </button>

      <div className="my-6 text-center text-sm text-[#555555]">or</div>

      <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded border px-3 py-2"
          />
        </label>
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
            minLength={8}
            className="rounded border px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-[#C0392B]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-[#E85D04] px-4 py-2 text-white"
        >
          Create account
        </button>
      </form>
    </main>
  );
}
