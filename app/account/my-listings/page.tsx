"use client";

import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";

function MyListingsContent() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOutUser();
    router.push("/account/login");
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <button type="button" onClick={handleSignOut} className="rounded border px-4 py-2">
          Sign out
        </button>
      </div>
      <p className="mt-2 text-[#555555]">Signed in as {user?.email}</p>

      {/* Full dashboard (view/edit/let-sold/delete) ships in Phase 5 — this
          is the auth-gated shell only, per this phase's scope. */}
      <div className="mt-8 rounded border border-dashed p-8 text-center text-[#555555]">
        You haven&apos;t posted any listings yet.
      </div>
    </main>
  );
}

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <MyListingsContent />
    </RequireAuth>
  );
}
