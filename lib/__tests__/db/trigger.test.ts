// @vitest-environment node
import { describe, it, expect, afterAll } from "vitest";
import { getTestPool } from "../../db/test-harness/pool";
import { withTestTransaction, actAs } from "../../db/test-harness/role";
import { insertRow } from "../../db/test-harness/sql";
import { validUserRow, validListingRow } from "../../db/test-harness/fixtures";

const pool = getTestPool();

afterAll(async () => {
  await pool.end();
});

describe("set_updated_at trigger", () => {
  it("updates updated_at on a row UPDATE", async () => {
    const client = await pool.connect();
    try {
      // Deliberately two separate transactions, each committed, rather than
      // withTestTransaction: Postgres's now() returns the current
      // transaction's start time, not wall-clock time, so insert and update
      // must be in different transactions for their now() values to differ
      // (a single-transaction version of this test would compare a
      // timestamp to itself and always "pass" for the wrong reason).
      await client.query("begin");
      await actAs(client, "service_role");
      const user = validUserRow();
      await insertRow(client, "public.users", user);
      const listing = await insertRow(
        client,
        "public.listings",
        validListingRow(user.id as string)
      );
      const listingId = listing.rows[0].id as string;
      const originalUpdatedAt = listing.rows[0].updated_at as string;
      await client.query("commit");

      try {
        await client.query("begin");
        await actAs(client, "service_role");
        const updated = await client.query(
          "update public.listings set price = price + 1 where id = $1 returning updated_at",
          [listingId]
        );

        expect(new Date(updated.rows[0].updated_at).getTime()).toBeGreaterThan(
          new Date(originalUpdatedAt).getTime()
        );
      } finally {
        // Clean up the data committed above instead of relying on rollback.
        await client.query("delete from public.listings where id = $1", [listingId]);
        await client.query("delete from public.users where id = $1", [user.id]);
        await client.query("commit");
      }
    } finally {
      client.release();
    }
  });

  it("does not fire on INSERT (updated_at starts equal to its default, not retroactively touched)", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow();
        await insertRow(c, "public.users", user);
        const listing = await insertRow(
          c,
          "public.listings",
          validListingRow(user.id as string)
        );
        expect(listing.rows[0].updated_at).toBeTruthy();
        expect(listing.rows[0].updated_at).toEqual(listing.rows[0].created_at);
      });
    } finally {
      client.release();
    }
  });
});
