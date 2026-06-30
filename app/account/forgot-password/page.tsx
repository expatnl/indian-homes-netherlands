"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError("Could not send the reset email. Please check the address and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-sm p-8">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-4 text-[#555555]">
          If an account exists for {email}, a password reset link is on its way.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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

        {error && <p className="text-sm text-[#C0392B]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-[#E85D04] px-4 py-2 text-white"
        >
          Send reset link
        </button>
      </form>
    </main>
  );
}
