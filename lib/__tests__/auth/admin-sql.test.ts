// @vitest-environment node
//
// Validates the literal SQL command documented in README-admin-setup.md
// (PRD Section 6.9) against a real Postgres instance running the actual
// Phase 1 migrations — not a mock — so the admin-setup procedure is proven
// to work against our real schema even though no live Supabase project
// exists yet to run it against directly.
import { describe, it, expect, afterAll } from "vitest";
import { getTestPool } from "../../db/test-harness/pool";
import { withTestTransaction, actAs } from "../../db/test-harness/role";
import { insertRow } from "../../db/test-harness/sql";
import { validUserRow } from "../../db/test-harness/fixtures";

const pool = getTestPool();

afterAll(async () => {
  await pool.end();
});

describe("admin account setup SQL (PRD Section 6.9)", () => {
  it("UPDATE users SET is_admin = true WHERE email = ... grants admin", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow();
        await insertRow(c, "public.users", user);

        const before = await c.query("select is_admin from public.users where id = $1", [user.id]);
        expect(before.rows[0].is_admin).toBe(false);

        // The exact command from README-admin-setup.md / PRD §6.9, just
        // parameterized instead of a literal email.
        await c.query("UPDATE users SET is_admin = true WHERE email = $1", [user.email]);

        const after = await c.query("select is_admin from public.users where id = $1", [user.id]);
        expect(after.rows[0].is_admin).toBe(true);
      });
    } finally {
      client.release();
    }
  });

  it("the revocation command (UPDATE ... SET is_admin = false) correctly revokes admin", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow({ is_admin: true });
        await insertRow(c, "public.users", user);

        await c.query("UPDATE users SET is_admin = false WHERE email = $1", [user.email]);

        const after = await c.query("select is_admin from public.users where id = $1", [user.id]);
        expect(after.rows[0].is_admin).toBe(false);
      });
    } finally {
      client.release();
    }
  });

  it("does not affect other users' admin status", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const target = validUserRow();
        const other = validUserRow();
        await insertRow(c, "public.users", target);
        await insertRow(c, "public.users", other);

        await c.query("UPDATE users SET is_admin = true WHERE email = $1", [target.email]);

        const otherRow = await c.query("select is_admin from public.users where id = $1", [other.id]);
        expect(otherRow.rows[0].is_admin).toBe(false);
      });
    } finally {
      client.release();
    }
  });
});
