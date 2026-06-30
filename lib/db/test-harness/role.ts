import type { PoolClient } from "pg";

export type TestRole = "anon" | "authenticated" | "service_role";

/**
 * Wraps fn in BEGIN/ROLLBACK so every test starts from a clean database
 * regardless of what it inserts, while still allowing multiple actAs()
 * impersonations within the same transaction (needed so a fixture inserted
 * as one user is visible when a later step in the same test impersonates a
 * different user).
 */
export async function withTestTransaction<T>(
  client: PoolClient,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  await client.query("begin");
  try {
    return await fn(client);
  } finally {
    await client.query("rollback");
  }
}

/**
 * Mimics PostgREST's per-request behavior: switches the effective Postgres
 * role and sets the "request.jwt.claims" GUC that auth.jwt() (and therefore
 * public.requesting_user_id()) reads from. Must be called inside an open
 * transaction (see withTestTransaction) since it uses SET LOCAL.
 */
export async function actAs(
  client: PoolClient,
  role: TestRole,
  jwtClaims?: Record<string, unknown>
): Promise<void> {
  await client.query(`set local role ${role}`);
  await client.query("select set_config('request.jwt.claims', $1, true)", [
    jwtClaims ? JSON.stringify(jwtClaims) : "",
  ]);
}
