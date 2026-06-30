import { randomUUID } from "node:crypto";

/** Valid `users` row covering every NOT NULL column (PRD §7.3). */
export function validUserRow(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const id = `firebase-uid-${randomUUID()}`;
  return {
    id,
    email: `${id}@example.com`,
    name: "Test User",
    ...overrides,
  };
}

/** Valid `cities` row covering every NOT NULL column (PRD §7.3). */
export function validCityRow(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const uniq = randomUUID().slice(0, 8);
  return {
    name: `Test City ${uniq}`,
    name_nl: `Test City ${uniq}`,
    province: "Noord-Holland",
    ...overrides,
  };
}

/** Valid `listings` row covering every NOT NULL column (PRD §7.3). */
export function validListingRow(
  userId: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  const uniq = randomUUID().slice(0, 8);
  return {
    short_id: uniq.slice(0, 6),
    slug: `test-listing-${uniq}`,
    user_id: userId,
    listing_category: "whole_property",
    listing_type: "rent",
    property_type: "apartment",
    title: `Test Listing ${uniq}`,
    description: "A perfectly nice test listing.",
    price: 150000,
    city: "Amsterdam",
    province: "Noord-Holland",
    size_sqm: 60,
    furnishing: "unfurnished",
    available_from: "2026-08-01",
    contact_name: "Test Contact",
    contact_phone: "+31612345678",
    contact_email: "contact@example.com",
    ...overrides,
  };
}

/** Valid `listing_photos` row covering every NOT NULL column (PRD §7.3). */
export function validListingPhotoRow(
  listingId: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  const uniq = randomUUID().slice(0, 8);
  return {
    listing_id: listingId,
    storage_path: `listings/${listingId}/full/${uniq}.webp`,
    url: `https://cdn.example.com/listings/${listingId}/full/${uniq}.webp`,
    thumb_url: `https://cdn.example.com/listings/${listingId}/thumb/${uniq}.webp`,
    ...overrides,
  };
}

/** Valid `listing_reports` row covering every NOT NULL column (PRD §7.3). */
export function validListingReportRow(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    reporter_email: `reporter-${randomUUID().slice(0, 8)}@example.com`,
    reason: "fraud",
    ...overrides,
  };
}
