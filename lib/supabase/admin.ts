import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/**
 * Server-side only — uses the service role key, which bypasses RLS
 * entirely. Never import this module from client-side code.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
      { auth: { persistSession: false } }
    );
  }
  return client;
}

export interface SyncUserInput {
  id: string;
  email: string;
  name: string;
}

/**
 * "On first sign-in, the Next.js API creates a record in the Supabase
 * users table using the Firebase UID as the primary key" (PRD §7.2b).
 * Uses ignoreDuplicates so a returning user's existing row (and any
 * later profile edits) is never clobbered by a stale name from the
 * sign-in token on subsequent logins.
 */
export async function syncUserRecord(input: SyncUserInput): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("users")
    .upsert(
      { id: input.id, email: input.email, name: input.name },
      { onConflict: "id", ignoreDuplicates: true }
    );

  if (error) {
    throw new Error(`Failed to sync user record: ${error.message}`);
  }
}

/** Backs requireAdmin() — PRD §7.2c: "users.is_admin = true". */
export async function isUserAdmin(uid: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from("users")
    .select("is_admin")
    .eq("id", uid)
    .single();

  if (error || !data) return false;
  return data.is_admin === true;
}
