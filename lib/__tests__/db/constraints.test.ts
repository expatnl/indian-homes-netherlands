// @vitest-environment node
import { describe, it, expect, afterAll } from "vitest";
import type { PoolClient } from "pg";
import { getTestPool } from "../../db/test-harness/pool";
import { withTestTransaction, actAs } from "../../db/test-harness/role";
import {
  insertRow,
  NOT_NULL_VIOLATION,
  INVALID_TEXT_REPRESENTATION,
} from "../../db/test-harness/sql";
import {
  validUserRow,
  validCityRow,
  validListingRow,
  validListingPhotoRow,
  validListingReportRow,
} from "../../db/test-harness/fixtures";

const pool = getTestPool();

async function run<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await withTestTransaction(client, async (c) => {
      // Constraint/enum tests target table structure, not RLS — run as
      // service_role (bypasses RLS) so they don't also have to satisfy
      // ownership policies.
      await actAs(c, "service_role");
      return fn(c);
    });
  } finally {
    client.release();
  }
}

afterAll(async () => {
  await pool.end();
});

describe("users table constraints", () => {
  it("accepts a valid row", async () => {
    await run(async (client) => {
      const row = validUserRow();
      const result = await insertRow(client, "public.users", row);
      expect(result.rows[0].id).toBe(row.id);
      expect(result.rows[0].is_admin).toBe(false);
    });
  });

  it.each(["id", "email", "name"])("rejects a missing required field: %s", async (field) => {
    await run(async (client) => {
      const row = validUserRow();
      delete row[field];
      await expect(insertRow(client, "public.users", row)).rejects.toMatchObject({
        code: NOT_NULL_VIOLATION,
      });
    });
  });
});

describe("cities table constraints", () => {
  it("accepts a valid row", async () => {
    await run(async (client) => {
      const row = validCityRow();
      const result = await insertRow(client, "public.cities", row);
      expect(result.rows[0].name).toBe(row.name);
      expect(result.rows[0].is_featured).toBe(false);
    });
  });

  it.each(["name", "name_nl", "province"])("rejects a missing required field: %s", async (field) => {
    await run(async (client) => {
      const row = validCityRow();
      delete row[field];
      await expect(insertRow(client, "public.cities", row)).rejects.toMatchObject({
        code: NOT_NULL_VIOLATION,
      });
    });
  });
});

describe("listings table constraints", () => {
  async function seedUser(client: PoolClient): Promise<string> {
    const user = validUserRow();
    await insertRow(client, "public.users", user);
    return user.id as string;
  }

  it("accepts a valid row and applies defaults", async () => {
    await run(async (client) => {
      const userId = await seedUser(client);
      const row = validListingRow(userId);
      const result = await insertRow(client, "public.listings", row);
      expect(result.rows[0].user_id).toBe(userId);
      expect(result.rows[0].status).toBe("active");
      expect(result.rows[0].show_email).toBe(true);
      expect(result.rows[0].amenities).toEqual([]);
      expect(result.rows[0].id).toBeTruthy();
    });
  });

  const requiredFields = [
    "short_id",
    "slug",
    "user_id",
    "listing_category",
    "listing_type",
    "property_type",
    "title",
    "description",
    "price",
    "city",
    "province",
    "size_sqm",
    "furnishing",
    "available_from",
    "contact_name",
    "contact_phone",
    "contact_email",
  ];

  it.each(requiredFields)("rejects a missing required field: %s", async (field) => {
    await run(async (client) => {
      const userId = await seedUser(client);
      const row = validListingRow(userId);
      delete row[field];
      await expect(insertRow(client, "public.listings", row)).rejects.toMatchObject({
        code: NOT_NULL_VIOLATION,
      });
    });
  });

  const enumFields = [
    "listing_category",
    "listing_type",
    "property_type",
    "bathroom_type",
    "kitchen_type",
    "bills_included",
    "furnishing",
    "pets_allowed",
    "smoking",
    "household_type",
    "gender_preference",
    "dietary_preference",
    "guests_policy",
    "community_preference",
    "status",
  ];

  it.each(enumFields)("rejects an invalid enum value for %s", async (field) => {
    await run(async (client) => {
      const userId = await seedUser(client);
      const row = validListingRow(userId, { [field]: "not_a_real_value" });
      await expect(insertRow(client, "public.listings", row)).rejects.toMatchObject({
        code: INVALID_TEXT_REPRESENTATION,
      });
    });
  });

  it("rejects a title longer than 100 characters", async () => {
    await run(async (client) => {
      const userId = await seedUser(client);
      const row = validListingRow(userId, { title: "a".repeat(101) });
      await expect(insertRow(client, "public.listings", row)).rejects.toThrow();
    });
  });

  it("rejects a description longer than 2000 characters", async () => {
    await run(async (client) => {
      const userId = await seedUser(client);
      const row = validListingRow(userId, { description: "a".repeat(2001) });
      await expect(insertRow(client, "public.listings", row)).rejects.toThrow();
    });
  });

  it("rejects a listing referencing a non-existent user_id", async () => {
    await run(async (client) => {
      const row = validListingRow("no-such-user-id");
      await expect(insertRow(client, "public.listings", row)).rejects.toThrow();
    });
  });
});

describe("listing_photos table constraints", () => {
  async function seedListing(client: PoolClient): Promise<string> {
    const user = validUserRow();
    await insertRow(client, "public.users", user);
    const listing = await insertRow(
      client,
      "public.listings",
      validListingRow(user.id as string)
    );
    return listing.rows[0].id as string;
  }

  it("accepts a valid row", async () => {
    await run(async (client) => {
      const listingId = await seedListing(client);
      const row = validListingPhotoRow(listingId);
      const result = await insertRow(client, "public.listing_photos", row);
      expect(result.rows[0].listing_id).toBe(listingId);
      expect(result.rows[0].is_primary).toBe(false);
      expect(result.rows[0].sort_order).toBe(0);
    });
  });

  it.each(["listing_id", "storage_path", "url", "thumb_url"])(
    "rejects a missing required field: %s",
    async (field) => {
      await run(async (client) => {
        const listingId = await seedListing(client);
        const row = validListingPhotoRow(listingId);
        delete row[field];
        await expect(insertRow(client, "public.listing_photos", row)).rejects.toMatchObject({
          code: NOT_NULL_VIOLATION,
        });
      });
    }
  );
});

describe("listing_reports table constraints", () => {
  it("accepts a valid row and applies defaults", async () => {
    await run(async (client) => {
      const row = validListingReportRow();
      const result = await insertRow(client, "public.listing_reports", row);
      expect(result.rows[0].reporter_email).toBe(row.reporter_email);
      expect(result.rows[0].status).toBe("pending");
      expect(result.rows[0].listing_id).toBeNull();
    });
  });

  it.each(["reporter_email", "reason"])("rejects a missing required field: %s", async (field) => {
    await run(async (client) => {
      const row = validListingReportRow();
      delete row[field];
      await expect(insertRow(client, "public.listing_reports", row)).rejects.toMatchObject({
        code: NOT_NULL_VIOLATION,
      });
    });
  });

  it.each(["reason", "status"])("rejects an invalid enum value for %s", async (field) => {
    await run(async (client) => {
      const row = validListingReportRow({ [field]: "not_a_real_value" });
      await expect(insertRow(client, "public.listing_reports", row)).rejects.toMatchObject({
        code: INVALID_TEXT_REPRESENTATION,
      });
    });
  });

  it("rejects details longer than 500 characters", async () => {
    await run(async (client) => {
      const row = validListingReportRow({ details: "a".repeat(501) });
      await expect(insertRow(client, "public.listing_reports", row)).rejects.toThrow();
    });
  });
});
