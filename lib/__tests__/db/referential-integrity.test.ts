// @vitest-environment node
import { describe, it, expect, afterAll } from "vitest";
import { getTestPool } from "../../db/test-harness/pool";
import { withTestTransaction, actAs } from "../../db/test-harness/role";
import { insertRow } from "../../db/test-harness/sql";
import {
  validUserRow,
  validListingRow,
  validListingPhotoRow,
  validListingReportRow,
} from "../../db/test-harness/fixtures";

const pool = getTestPool();

afterAll(async () => {
  await pool.end();
});

describe("referential integrity", () => {
  it("ON DELETE CASCADE: deleting a listing removes its listing_photos rows", async () => {
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
        const listingId = listing.rows[0].id as string;
        const photo = await insertRow(c, "public.listing_photos", validListingPhotoRow(listingId));
        const photoId = photo.rows[0].id as string;

        await c.query("delete from public.listings where id = $1", [listingId]);

        const remaining = await c.query(
          "select id from public.listing_photos where id = $1",
          [photoId]
        );
        expect(remaining.rowCount).toBe(0);
      });
    } finally {
      client.release();
    }
  });

  it("ON DELETE SET NULL: deleting a listing nullifies listing_reports.listing_id but keeps the report row", async () => {
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
        const listingId = listing.rows[0].id as string;
        const report = await insertRow(
          c,
          "public.listing_reports",
          validListingReportRow({ listing_id: listingId })
        );
        const reportId = report.rows[0].id as string;

        await c.query("delete from public.listings where id = $1", [listingId]);

        const result = await c.query(
          "select id, listing_id from public.listing_reports where id = $1",
          [reportId]
        );
        expect(result.rowCount).toBe(1);
        expect(result.rows[0].listing_id).toBeNull();
      });
    } finally {
      client.release();
    }
  });
});
