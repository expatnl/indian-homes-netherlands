// @vitest-environment node
import { describe, it, expect, afterAll } from "vitest";
import type { PoolClient } from "pg";
import { getTestPool } from "../../db/test-harness/pool";
import { withTestTransaction, actAs } from "../../db/test-harness/role";
import { insertRow } from "../../db/test-harness/sql";
import { validUserRow, validListingRow, validListingPhotoRow } from "../../db/test-harness/fixtures";

const pool = getTestPool();

afterAll(async () => {
  await pool.end();
});

async function seedTwoUsersAndListing(
  client: PoolClient,
  ownerOverrides: Record<string, unknown> = {},
  listingOverrides: Record<string, unknown> = {}
) {
  await actAs(client, "service_role");
  const owner = validUserRow(ownerOverrides);
  const stranger = validUserRow();
  await insertRow(client, "public.users", owner);
  await insertRow(client, "public.users", stranger);
  const listing = await insertRow(
    client,
    "public.listings",
    validListingRow(owner.id as string, listingOverrides)
  );
  return { owner, stranger, listingId: listing.rows[0].id as string };
}

describe("listings RLS", () => {
  it("anon can select active listings", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { listingId } = await seedTwoUsersAndListing(c, {}, { status: "active" });

        await actAs(c, "anon");
        const result = await c.query("select id from public.listings where id = $1", [listingId]);
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("anon cannot select a non-active listing belonging to someone else", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { listingId } = await seedTwoUsersAndListing(c, {}, { status: "rejected" });

        await actAs(c, "anon");
        const result = await c.query("select id from public.listings where id = $1", [listingId]);
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("owner can select their own listing regardless of status", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { owner, listingId } = await seedTwoUsersAndListing(c, {}, { status: "expired" });

        await actAs(c, "authenticated", { sub: owner.id });
        const result = await c.query("select id from public.listings where id = $1", [listingId]);
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("a different authenticated user cannot select someone else's non-active listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { stranger, listingId } = await seedTwoUsersAndListing(c, {}, { status: "let_sold" });

        await actAs(c, "authenticated", { sub: stranger.id });
        const result = await c.query("select id from public.listings where id = $1", [listingId]);
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("authenticated user can insert a listing with their own user_id", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow();
        await insertRow(c, "public.users", user);

        await actAs(c, "authenticated", { sub: user.id });
        const row = validListingRow(user.id as string);
        const result = await insertRow(c, "public.listings", row);
        expect(result.rows[0].user_id).toBe(user.id);
      });
    } finally {
      client.release();
    }
  });

  it("authenticated user cannot insert a listing with someone else's user_id", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { owner, stranger } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: stranger.id });
        const row = validListingRow(owner.id as string);
        await expect(insertRow(c, "public.listings", row)).rejects.toThrow(/row-level security/i);
      });
    } finally {
      client.release();
    }
  });

  it("owner can update their own listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { owner, listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: owner.id });
        const result = await c.query(
          "update public.listings set price = 999999 where id = $1",
          [listingId]
        );
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("a non-owning authenticated user cannot update someone else's listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { stranger, listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: stranger.id });
        const result = await c.query(
          "update public.listings set price = 999999 where id = $1",
          [listingId]
        );
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("anon cannot update any listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "anon");
        const result = await c.query(
          "update public.listings set price = 999999 where id = $1",
          [listingId]
        );
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("owner can delete their own listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { owner, listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: owner.id });
        const result = await c.query("delete from public.listings where id = $1", [listingId]);
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("a non-owning authenticated user cannot delete someone else's listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { stranger, listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: stranger.id });
        const result = await c.query("delete from public.listings where id = $1", [listingId]);
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("an admin can select, update, and delete a listing they do not own", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const admin = validUserRow({ is_admin: true });
        await insertRow(c, "public.users", admin);
        const { listingId } = await seedTwoUsersAndListing(c, {}, { status: "rejected" });

        await actAs(c, "authenticated", { sub: admin.id });

        const selected = await c.query("select id from public.listings where id = $1", [listingId]);
        expect(selected.rowCount).toBe(1);

        const updated = await c.query(
          "update public.listings set status = 'active' where id = $1",
          [listingId]
        );
        expect(updated.rowCount).toBe(1);

        const deleted = await c.query("delete from public.listings where id = $1", [listingId]);
        expect(deleted.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("a non-admin authenticated user cannot update a listing they do not own, even by guessing the id", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const nonAdmin = validUserRow({ is_admin: false });
        await insertRow(c, "public.users", nonAdmin);
        const { listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: nonAdmin.id });
        const result = await c.query(
          "update public.listings set status = 'rejected' where id = $1",
          [listingId]
        );
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });
});

describe("listing_photos RLS", () => {
  it("anon can select listing photos", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { listingId } = await seedTwoUsersAndListing(c);
        await actAs(c, "service_role");
        const photo = await insertRow(c, "public.listing_photos", validListingPhotoRow(listingId));

        await actAs(c, "anon");
        const result = await c.query("select id from public.listing_photos where id = $1", [
          photo.rows[0].id,
        ]);
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("the owner of the parent listing can insert a photo", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { owner, listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: owner.id });
        const result = await insertRow(c, "public.listing_photos", validListingPhotoRow(listingId));
        expect(result.rows[0].listing_id).toBe(listingId);
      });
    } finally {
      client.release();
    }
  });

  it("a non-owner cannot insert a photo on someone else's listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { stranger, listingId } = await seedTwoUsersAndListing(c);

        await actAs(c, "authenticated", { sub: stranger.id });
        await expect(
          insertRow(c, "public.listing_photos", validListingPhotoRow(listingId))
        ).rejects.toThrow(/row-level security/i);
      });
    } finally {
      client.release();
    }
  });

  it("a non-owner cannot delete a photo on someone else's listing", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        const { stranger, listingId } = await seedTwoUsersAndListing(c);
        await actAs(c, "service_role");
        const photo = await insertRow(c, "public.listing_photos", validListingPhotoRow(listingId));

        await actAs(c, "authenticated", { sub: stranger.id });
        const result = await c.query("delete from public.listing_photos where id = $1", [
          photo.rows[0].id,
        ]);
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });
});

describe("listing_reports RLS", () => {
  it("anon can insert a report with no authentication", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "anon");
        // No RETURNING here deliberately: Postgres checks RETURNING rows
        // against the table's SELECT policy too, and reports are
        // admin-only-readable (Section 7.2c) — even the reporter who just
        // inserted a row can't read it back. rowCount confirms the insert
        // itself succeeded; existence is verified below via service_role.
        const result = await c.query(
          "insert into public.listing_reports (reporter_email, reason) values ($1, 'fraud')",
          ["reporter@example.com"]
        );
        expect(result.rowCount).toBe(1);

        await actAs(c, "service_role");
        const verify = await c.query(
          "select id from public.listing_reports where reporter_email = $1",
          ["reporter@example.com"]
        );
        expect(verify.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("anon cannot select reports", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "anon");
        await c.query(
          "insert into public.listing_reports (reporter_email, reason) values ($1, 'fraud')",
          ["reporter@example.com"]
        );
        const result = await c.query("select id from public.listing_reports");
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("a non-admin authenticated user cannot select reports", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow({ is_admin: false });
        await insertRow(c, "public.users", user);
        await c.query(
          "insert into public.listing_reports (reporter_email, reason) values ($1, 'fraud')",
          ["reporter@example.com"]
        );

        await actAs(c, "authenticated", { sub: user.id });
        const result = await c.query("select id from public.listing_reports");
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("an admin can select reports", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const admin = validUserRow({ is_admin: true });
        await insertRow(c, "public.users", admin);
        await c.query(
          "insert into public.listing_reports (reporter_email, reason) values ($1, 'fraud')",
          ["reporter@example.com"]
        );

        await actAs(c, "authenticated", { sub: admin.id });
        const result = await c.query("select id from public.listing_reports");
        expect(result.rowCount).toBeGreaterThan(0);
      });
    } finally {
      client.release();
    }
  });
});

describe("users RLS", () => {
  it("a user can select their own row", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow();
        await insertRow(c, "public.users", user);

        await actAs(c, "authenticated", { sub: user.id });
        const result = await c.query("select id from public.users where id = $1", [user.id]);
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("a user cannot select another user's row", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const userA = validUserRow();
        const userB = validUserRow();
        await insertRow(c, "public.users", userA);
        await insertRow(c, "public.users", userB);

        await actAs(c, "authenticated", { sub: userA.id });
        const result = await c.query("select id from public.users where id = $1", [userB.id]);
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("an admin can select any user's row", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const admin = validUserRow({ is_admin: true });
        const other = validUserRow();
        await insertRow(c, "public.users", admin);
        await insertRow(c, "public.users", other);

        await actAs(c, "authenticated", { sub: admin.id });
        const result = await c.query("select id from public.users where id = $1", [other.id]);
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("a user can update their own row", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow();
        await insertRow(c, "public.users", user);

        await actAs(c, "authenticated", { sub: user.id });
        const result = await c.query("update public.users set name = 'Updated Name' where id = $1", [
          user.id,
        ]);
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("a user cannot update another user's row", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const userA = validUserRow();
        const userB = validUserRow();
        await insertRow(c, "public.users", userA);
        await insertRow(c, "public.users", userB);

        await actAs(c, "authenticated", { sub: userA.id });
        const result = await c.query("update public.users set name = 'Hacked' where id = $1", [
          userB.id,
        ]);
        expect(result.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });
});

describe("cities RLS", () => {
  it("anon can select cities", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "anon");
        const result = await c.query("select id from public.cities limit 1");
        expect(result.rowCount).toBe(1);
      });
    } finally {
      client.release();
    }
  });

  it("an authenticated user cannot insert a city (no write policy granted)", async () => {
    const client = await pool.connect();
    try {
      await withTestTransaction(client, async (c) => {
        await actAs(c, "service_role");
        const user = validUserRow();
        await insertRow(c, "public.users", user);

        await actAs(c, "authenticated", { sub: user.id });
        await expect(
          c.query(
            "insert into public.cities (name, name_nl, province) values ('Nowhere', 'Nowhere', 'Nowhere')"
          )
        ).rejects.toThrow(/row-level security/i);
      });
    } finally {
      client.release();
    }
  });
});
