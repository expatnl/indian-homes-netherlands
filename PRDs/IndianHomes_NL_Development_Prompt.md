# IndianHomes.nl — MVP 1 Development Prompt

**Source PRD:** IndianHomes.nl PRD v1.7.1 — Development Approved
**Purpose:** This is a self-contained, step-by-step build prompt. Copy each phase into Claude Code in order. Each phase has a Definition of Done with required automated test coverage. Do not proceed to the next phase until the current phase's Definition of Done is fully met and all tests pass.

---

## How to Use This Document

This document contains **12 sequential development phases**. Work through them in order — each phase builds on the database, auth, and code from the phases before it.

**For each phase:**
1. Copy the entire phase block (from `### PHASE START` to `### PHASE END`) into Claude Code as a single prompt
2. Let Claude Code complete the implementation
3. Claude Code must run the full test suite before declaring the phase complete
4. Check the phase's Definition of Done checklist — every item must be checked before moving to the next phase
5. If any test fails or any Definition of Done item is unmet, instruct Claude Code to fix it before proceeding — do not move to the next phase with known failures

**Global rule that applies to every phase below (include this context in your first message to Claude Code, or paste it once at the start of the session):**

> You are building IndianHomes.nl, a real estate listing platform for the Indian community in the Netherlands, exactly per the attached/referenced PRD (IndianHomes.nl PRD v1.7.1). Follow the PRD precisely — field names, ENUM values, route paths, and component behavior must match the PRD exactly, not an approximation of it. After completing each phase, run the full automated test suite and report pass/fail results before considering the phase done. Write unit tests for every use case as you build it, not afterward — test-as-you-go, not test-at-the-end. Do not skip the Definition of Done checklist at the end of each phase.

---

## MVP 1 — Master Definition of Done

This is the top-level acceptance criteria for the entire MVP 1 build. **MVP 1 is considered production-ready only when every item below is checked**, which happens automatically once Phases 1–12 are each individually completed with their own Definition of Done met.

- [ ] All 12 phases below completed with their individual Definition of Done met
- [ ] Full test suite passes with zero failing tests
- [ ] Test coverage report shows 85% or higher coverage on all business logic (API routes, form validation, listing state machine, authorization checks) — UI component snapshot coverage is secondary to logic coverage
- [ ] Every user journey in PRD Section 6.1 (List a Property, Find a Property) can be completed end-to-end with no dead ends, verified by E2E tests
- [ ] Every checklist item in PRD Section 13 (Development Checklist) is checked off
- [ ] Application deploys successfully to Vercel production with the indianhomes.nl domain
- [ ] No critical or high-severity issues remain in Sentry after a full manual smoke test pass

---

## Tech Stack Reference (do not deviate without explicit instruction)

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase (EU/Frankfurt region) |
| File storage | Supabase Storage |
| Authentication | Firebase Auth (Google Sign-In + email/password) |
| Search (MVP 1) | PostgreSQL full-text search (tsvector) |
| Email | Resend.com |
| Maps | Google Maps Embed API |
| Bot protection | hCaptcha |
| Error monitoring | Sentry |
| Analytics | Plausible |
| Hosting | Vercel |
| Testing — unit/integration | Vitest + React Testing Library |
| Testing — E2E | Playwright |
| Image processing | sharp |
| Icons | Lucide React |

---

## PHASE 0: Project Scaffolding, Testing Infrastructure, and Environment Setup

### PHASE START — Copy this block into Claude Code

```
Set up the foundational project scaffolding for IndianHomes.nl per PRD Section 7.2 (Tech Stack) and Section 13 (Project Setup checklist). This phase has no business logic — it is purely infrastructure and tooling, but it must be complete and correct before any feature work begins.

Tasks:
1. Scaffold a new Next.js 14 project using the App Router, with TypeScript and Tailwind CSS.
2. Install and configure Vitest with React Testing Library for unit and integration testing. Configure it to run against the TypeScript/React codebase with coverage reporting enabled (target 85% or higher on business logic).
3. Install and configure Playwright for end-to-end testing, configured to run against a local dev server.
4. Set up the project folder structure:
   - /app — Next.js App Router pages and layouts
   - /app/api — API routes
   - /components — shared React components
   - /lib — business logic, validation, utilities (this is where most unit-tested code lives)
   - /lib/__tests__ — unit tests co-located by feature
   - /e2e — Playwright end-to-end tests
   - /types — shared TypeScript types matching the PRD schema exactly
5. Create a .env.local.example file listing every required environment variable from PRD Section 13's environment variable table, with placeholder values and a one-line comment explaining each. Add .env.local to .gitignore.
6. Initialize a Supabase project (EU/Frankfurt region) and Supabase CLI migrations folder (supabase/migrations) per PRD Section 7.6.6 — schema changes must ship as version-controlled migration files from this point forward, never hand-edited in the dashboard.
7. Set up a separate Supabase staging project mirroring production, per PRD Section 7.6.5.
8. Initialize a Firebase project with Google and Email/Password auth providers enabled per PRD Section 7.2b.
9. Connect the GitHub repository to Vercel and confirm preview deployments work automatically on a test pull request, per PRD Section 7.6.5.
10. Install Sentry and confirm it captures a deliberately thrown test error in both local dev and a Vercel preview deployment.
11. Install Plausible analytics script (domain: indianhomes.nl), gated behind cookie consent (to be wired up fully in Phase 9 — for now just confirm the script loads correctly when consent is granted).
12. Write a single smoke test (Vitest) confirming the Next.js app builds and the homepage route returns a 200 status, and a single Playwright E2E test confirming the homepage loads in a real browser. These are intentionally trivial — they exist only to prove the testing infrastructure itself works before real logic is added.

Definition of Done for this phase:
- npm run test (Vitest) runs successfully with the one smoke test passing
- npm run test:e2e (Playwright) runs successfully with the one smoke test passing
- npm run build completes with zero errors
- Coverage reporting is configured and runs without error (coverage percentage is not meaningful yet at this phase — just confirm the tooling works)
- .env.local.example lists every variable from PRD Section 13's environment variable table
- A test PR triggers a working Vercel preview deployment URL
- Sentry receives a test error from both local and preview environments
- Report back: full list of installed dependencies, confirmation of each Definition of Done item, and the Vercel preview URL
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 1):**
- [ ] Next.js 14 + TypeScript + Tailwind project builds with zero errors
- [ ] Vitest configured and smoke test passes
- [ ] Playwright configured and smoke test passes
- [ ] Folder structure matches the spec above
- [ ] .env.local.example complete and matches PRD Section 13 exactly
- [ ] Supabase project (production + staging) created in EU region
- [ ] Supabase CLI migrations folder initialized
- [ ] Firebase project created with Google + Email/Password providers enabled
- [ ] Vercel connected to GitHub with working preview deployments
- [ ] Sentry capturing errors from local and preview environments

---

## PHASE 1: Database Schema and Migrations

### PHASE START — Copy this block into Claude Code

```
Implement the complete database schema for IndianHomes.nl per PRD Section 7.3 (Database Schema) and Section 7.6.6 (Migration Strategy). This is foundational — every later phase depends on this schema being exactly correct.

Tasks:
1. Create Supabase CLI migration files (numbered, version-controlled in supabase/migrations) for each of the following tables, with every column, type, and constraint exactly as specified in PRD Section 7.3:
   - users (id as Text/Firebase UID per Section 7.2b, email, name, phone, created_at, is_admin)
   - listings (all approximately 45 columns including listing_category, listing_type, property_type, slug, short_id, all whole-property fields, all room-specific fields per Section 6.4, all suitability fields, status, timestamps)
   - listing_photos (id, listing_id with ON DELETE CASCADE, storage_path, url, thumb_url, sort_order, is_primary, created_at)
   - listing_reports (id, listing_id with ON DELETE SET NULL and nullable, listing_snapshot, reporter_email, reason ENUM, details, status ENUM, admin_notes, created_at, reviewed_at)
   - cities (id, name, name_nl, province, is_featured, sort_order)
2. Create the set_updated_at PostgreSQL trigger function and apply it to the listings table per PRD Section 7.3, so updated_at is automatically refreshed on every row change.
3. Create indexes on listings: city, listing_type, property_type, status, created_at, expires_at, slug — per PRD Section 13's Database checklist.
4. Create a tsvector full-text search index on listings.title, listings.description, listings.city, listings.neighbourhood per PRD Section 6.5 Phase 1 spec.
5. Seed the cities table with all Dutch municipalities, with is_featured = true set specifically for: Amsterdam, The Hague, Rotterdam, Eindhoven, Utrecht, Amstelveen, Delft, Groningen (these are the cities explicitly named throughout the PRD), each with a name_nl value and correct province.
6. Implement Row Level Security (RLS) policies on every table:
   - listings: public SELECT for status='active'; INSERT/UPDATE/DELETE restricted to user_id = auth.uid() per PRD Section 7.2c
   - listing_photos: public SELECT; INSERT/UPDATE/DELETE restricted to the owning listing's user_id
   - listing_reports: public INSERT (reporting requires no auth per Section 7.2c); SELECT/UPDATE restricted to is_admin = true
   - users: users can SELECT/UPDATE their own row only; admins can SELECT all
   - cities: public SELECT, no public write access
7. Configure Supabase to accept Firebase JWTs for RLS per PRD Section 7.2b ("Supabase RLS with Firebase JWT").
8. Write unit tests (Vitest, using a test Supabase instance or mocked client) covering:
   - Every table can be inserted into with valid data matching the schema
   - Every NOT NULL / required constraint correctly rejects missing required fields
   - Every ENUM column rejects invalid values not in the defined set
   - ON DELETE CASCADE on listing_photos correctly removes photo rows when the parent listing is deleted
   - ON DELETE SET NULL on listing_reports correctly nullifies listing_id (not deletes the report) when the parent listing is deleted
   - The set_updated_at trigger correctly updates updated_at on a row UPDATE
   - RLS policies correctly block an unauthenticated or non-owning user from UPDATE/DELETE on a listing they don't own
   - RLS policies correctly allow the owning user to UPDATE/DELETE their own listing
   - Admin RLS policies correctly allow is_admin = true users to access restricted rows, and block non-admins

Definition of Done for this phase:
- All migration files run cleanly against a fresh Supabase database with zero errors, in order
- All 5 tables exist with every column matching PRD Section 7.3 exactly (cross-check column names, types, and ENUM values one by one against the PRD)
- cities table is seeded and queryable
- All RLS policies are active and tested
- Full test suite for this phase passes with 100% of constraint/RLS test cases passing
- Run the complete test suite from Phase 0 + Phase 1 together — confirm no regressions
- Report back: migration file list, test results, and a confirmation table cross-referencing every PRD Section 7.3 column against what was actually created
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 2):**
- [ ] All 5 tables created via versioned migrations, matching PRD Section 7.3 exactly
- [ ] set_updated_at trigger active on listings
- [ ] All required indexes created, including tsvector full-text index
- [ ] cities table seeded with correct is_featured cities
- [ ] RLS policies implemented and tested for all 5 tables
- [ ] Firebase JWT accepted by Supabase RLS
- [ ] All schema/constraint/RLS unit tests passing
- [ ] Full test suite (Phase 0 + 1) passes with no regressions

---

## PHASE 2: Authentication and Authorization

### PHASE START — Copy this block into Claude Code

```
Implement the full authentication and authorization layer per PRD Section 7.2b (Authentication Architecture), Section 7.2c (Authorization Model), Section 7.2f (Session/Token Refresh), and Section 6.8 (User Accounts).

Tasks:
1. Integrate the Firebase client SDK for Google Sign-In (primary) and email/password (fallback) sign-in/sign-up flows, per PRD Section 6.8.
2. Integrate the Firebase Admin SDK server-side for JWT verification on protected API routes.
3. Implement the full authentication flow exactly as described in PRD Section 7.2b: client signs in via Firebase, Firebase returns a JWT, frontend sends JWT as Bearer token on every API request, Next.js API routes verify the JWT server-side, API reads/writes to Supabase using the verified Firebase UID.
4. Use the Firebase client SDK's onIdTokenChanged listener (not a one-time token fetch) so API requests always carry a valid, auto-refreshed token per PRD Section 7.2f. Confirm users are never unexpectedly logged out due to token expiry.
5. On first sign-in, implement the users-table sync: create a record in the Supabase users table using the Firebase UID as the primary key, capturing name, email, and photo URL from the Google profile (or entered values for email/password signup), per PRD Section 7.2b.
6. Build the following pages/flows: register (Google + email/password), login, logout, forgot-password (Firebase-handled, branded sender per PRD Section 7.2b), and the My Listings dashboard route shell (full dashboard functionality comes in Phase 5 — for now just the auth-gated empty shell).
7. Implement the Authorization Model from PRD Section 7.2c as a reusable server-side helper function, used by every protected API route built in later phases:
   - requireAuth() — verifies JWT, throws/returns 401 if invalid
   - requireOwnership(resourceUserId, authenticatedUserId) — throws/returns 403 if the authenticated user does not own the resource being acted on (the IDOR protection)
   - requireAdmin() — verifies JWT AND users.is_admin = true, throws/returns 403 otherwise
8. Set is_admin = true manually via SQL for one test admin account per PRD Section 6.9, and document this exact SQL command in a README-admin-setup.md file for future reference.
9. Apply input sanitization rules per PRD Section 7.2d: confirm no use of dangerouslySetInnerHTML anywhere in the codebase (add an ESLint rule to enforce this going forward), and confirm all text fields will be validated server-side regardless of client-side checks (full field validation comes with the listing form in Phase 4 — for now, establish the pattern with the name/email fields on the registration form).

Write unit tests covering every use case:
- Successful Google Sign-In creates a users row with correct fields
- Successful email/password sign-up creates a users row with correct fields
- Login with valid credentials succeeds; login with invalid credentials fails with a clear error
- Logout correctly clears the session
- Password reset email flow triggers correctly (mock Firebase call, assert it was invoked with correct parameters)
- requireAuth() correctly rejects a request with no token, an expired token, and a malformed token
- requireAuth() correctly accepts a request with a valid token
- requireOwnership() correctly rejects when resourceUserId does not equal authenticatedUserId
- requireOwnership() correctly accepts when they match
- requireAdmin() correctly rejects a non-admin authenticated user
- requireAdmin() correctly accepts an is_admin = true user
- Token refresh via onIdTokenChanged is correctly wired (test that the listener is registered and updates the stored token on change)
- A protected route (use the My Listings dashboard shell) redirects an unauthenticated user to login
- A protected route allows an authenticated user through

Definition of Done for this phase:
- All authentication flows (Google, email/password, logout, password reset) work end-to-end manually
- requireAuth, requireOwnership, requireAdmin helpers exist, are used consistently, and are fully unit tested
- 100% of the unit tests listed above pass
- Run the full test suite (Phase 0 + 1 + 2) — confirm zero regressions
- Manually verify in the Supabase dashboard that a real Google sign-in creates a correctly populated users row
- Report back: test results, confirmation each use case above is covered, and the exact SQL used to set the test admin account
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 3):**
- [ ] Google Sign-In and email/password auth both work end-to-end
- [ ] JWT verification working server-side via Firebase Admin SDK
- [ ] Token auto-refresh confirmed via onIdTokenChanged
- [ ] users table sync on first sign-in works correctly
- [ ] requireAuth, requireOwnership, requireAdmin helpers implemented and used
- [ ] Test admin account created and documented
- [ ] All authentication/authorization unit tests passing
- [ ] Full test suite (Phase 0–2) passes with no regressions

---

## PHASE 3: Rate Limiting, Spam Prevention, and Phone/Slug Utilities

### PHASE START — Copy this block into Claude Code

```
Implement the shared utility logic that the listing creation flow (Phase 4) will depend on, per PRD Section 7.2a (Rate Limiting and Spam Prevention) and Section 6.11 (Phone Number Handling and WhatsApp Link Generation). Building these as standalone, fully-tested utility functions now means Phase 4 can consume them directly rather than building ad hoc logic inline.

Tasks:
1. Implement hCaptcha integration: a reusable client-side widget component, and a server-side verification function that validates the hCaptcha token against hCaptcha's API before allowing a listing submission, per PRD Section 7.2a.
2. Implement the listing submission rate limit logic: a server-side function checking (a) the authenticated user does not already have 5 or more listings with status = 'active', and (b) the user has not posted 3 or more listings in the trailing 24 hours, per PRD Section 7.2a. Return the exact error message specified in the PRD: "You have reached the maximum number of active listings. Please mark existing listings as let/sold before posting new ones."
3. Implement duplicate listing detection: a server-side function checking for an existing active listing from the same user with the same city, price, and property_type posted within the last 7 days, returning a warning (not a hard block) per PRD Section 7.2a.
4. Implement image upload validation: reject files where the extension is a valid image type but the file's magic bytes do not match (i.e., the file is not actually a valid image), per PRD Section 7.2a.
5. Implement the phone number utility per PRD Section 6.11:
   - A function that accepts Dutch (06XXXXXXXX, +31 6 XXXXXXXX), Indian (+91 XXXXXXXXXX), and general international formats, strips spaces/dashes/brackets, and normalizes to E.164 format (e.g., +316XXXXXXXX)
   - Reject numbers shorter than 7 digits or longer than 15 digits with a clear inline validation error
   - A function that generates the WhatsApp deep link from an E.164 number: https://wa.me/[number without leading plus], with an optional pre-filled message parameter exactly as specified: ?text=Hi%2C+I+saw+your+listing+on+IndianHomes.nl
   - A function that formats an E.164 number for human-readable display (e.g., +31 6 12 34 56 78)
6. Implement the slug generation utility per PRD Section 7.3/Section 8: given a listing title and city, generate a URL-safe slug (e.g., "2-bed-apartment-amsterdam"), and generate a short_id as the first 6 characters of the listing's UUID, for use in the /listings/[slug]-[short-id] URL pattern.

Write unit tests covering every use case:
- hCaptcha verification function correctly accepts a valid token (mocked) and rejects an invalid one
- Rate limit function correctly blocks at exactly 5 active listings, and allows at 4
- Rate limit function correctly blocks the 4th listing within 24 hours, and allows the 3rd
- Rate limit function correctly resets after the 24-hour window passes (test with mocked time)
- Duplicate detection correctly flags a probable duplicate (same city, price, type within 7 days) and correctly does NOT flag a different city, different price, or a listing older than 7 days
- Image validation correctly rejects a file with a .jpg extension but invalid magic bytes, and correctly accepts a genuinely valid JPEG/PNG/WebP
- Phone utility correctly converts 0612345678 to +31612345678
- Phone utility correctly normalizes +31 6 12345678 and Indian +91-style numbers to E.164
- Phone utility correctly rejects numbers under 7 digits and over 15 digits with the specified error
- WhatsApp link generator produces the exact correct URL format with and without the pre-filled message
- Phone display formatter produces correctly spaced human-readable output
- Slug generator produces a correct, URL-safe, lowercase, hyphenated slug from a sample title and city, correctly handling special characters, accented characters, and very long titles (truncation behavior)
- Short ID generator correctly extracts exactly 6 characters from a sample UUID

Definition of Done for this phase:
- Every utility function above exists, is exported from /lib, and is independently testable
- 100% of the unit tests listed above pass
- Run the full test suite (Phase 0–3) — confirm zero regressions
- Report back: full list of utility functions created with their file paths, and test results
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 4):**
- [ ] hCaptcha integration (client widget + server verification) implemented
- [ ] Rate limit logic (5 active max, 3 per 24h) implemented and tested
- [ ] Duplicate detection implemented as a warning (not hard block)
- [ ] Image magic-byte validation implemented
- [ ] Phone number normalization to E.164 implemented for Dutch, Indian, and international formats
- [ ] WhatsApp deep link generator implemented exactly per PRD spec
- [ ] Slug and short_id generators implemented
- [ ] All utility unit tests passing
- [ ] Full test suite (Phase 0–3) passes with no regressions

---

## PHASE 4: Listing Creation — Multi-Step Wizard (Whole Property + Single Room)

### PHASE START — Copy this block into Claude Code

```
Implement the full listing creation flow per PRD Section 6.2 (Listing Categories), Section 6.3 (Whole Property form), Section 6.4 (Single Room form), Section 6.13 (Photo Upload and Management), Section 9.8 (Listing Form UX Strategy — multi-step wizard), and Section 7.6.2/7.6.3 (partial failure handling and idempotency). This is the single most complex phase — take it carefully and field-by-field against the PRD.

Tasks:
1. Build the listing category selection screen (/listings/new): user chooses Whole Property or Single Room, routing to the appropriate wizard.
2. Build the Whole Property wizard (/listings/new/property) as a multi-step form per PRD Section 9.8's exact step breakdown:
   - Step 1 — Basics: listing type, property type, title, description, price, price period (auto-derived), available from, deposit
   - Step 2 — Location: city (from cities table, featured first), province (auto-filled), neighbourhood, street address
   - Step 3 — Property Details: size, bedrooms, bathrooms, furnishing, energy label, amenities, pets allowed, smoking
   - Step 4 — Contact: contact name, phone (using the Phase 3 phone utility), email, show email toggle, languages spoken, community preference
   - Step 5 — Photos: upload flow (see task 5 below)
   Every field, option set, and validation rule must match PRD Section 6.3 exactly — cross-check field by field.
3. Build the Single Room wizard (/listings/new/room) with the additional Suitability step per PRD Section 9.8 and all the changed/additional fields from PRD Section 6.4:
   - Changed fields: property type fixed as "Room in shared house", listing type fixed as "Rent", price period always "Per month", bedrooms replaced by room size, bathrooms replaced by bathroom type
   - Additional Shared Facilities fields: room size, bathroom type, kitchen type, living room access, separate entrance, internet included, bills included
   - Additional Existing Household fields: who currently lives there, current occupants description, total occupants after, household language, household type
   - Additional Tenant Suitability fields: suitable for, gender preference (with the exact legal disclaimer text from PRD Section 6.4 — only shown when "owner lives here" is true), pets, smoking, dietary preference, guests policy, minimum/maximum stay
   Cross-check every field against PRD Section 6.4 exactly, including the precise legal disclaimer wording for gender preference.
4. Implement the required wizard UX elements per PRD Section 9.8: persistent progress indicator ("Step X of Y"), Back/Next navigation preserving all entered data, auto-save to browser local storage after each step (recovered automatically if the user returns within 24 hours), and correct mobile input types (inputmode="numeric" for price/size/bedrooms/deposit, type="tel" for phone, native input type="date" for available-from) per PRD Section 9.8.
5. Implement the photo upload flow per PRD Section 6.13: drag-and-drop upload zone with file picker fallback, minimum 1 / maximum 15 photos, server-side processing via sharp (resize to 1600px max edge, convert to WebP at 85% quality, generate 400x300 thumbnail), storage at listings/{listing_id}/full/ and listings/{listing_id}/thumb/ in Supabase Storage, thumbnail preview grid with drag-to-reorder, primary photo selection, and per-file upload progress.
6. Wire in the Phase 3 utilities: hCaptcha verification on final submit, rate limit check before allowing submission, duplicate detection warning, phone number normalization, slug/short_id generation.
7. Implement the idempotency key pattern per PRD Section 7.6.3: client generates a UUID once per form session; server rejects/dedupes duplicate submissions carrying the same key. Disable the submit button immediately on click, re-enable only on error response.
8. Implement partial failure handling exactly per PRD Section 7.6.2: if the listing record saves but a photo upload fails, the listing is still created with whichever photos succeeded (minimum 1 required before final submit is even allowed) and the user sees a clear warning with the ability to add remaining photos later — this should never silently lose data. If the confirmation email fails to send, the listing creation must NOT be rolled back; the email failure is logged to Sentry but does not block the user.
9. Implement the confirmation email via Resend on successful listing creation, branded and including a link to manage/edit the listing.
10. Implement server-side validation for every single field independently of client-side validation, per the field specs in PRD Sections 6.3/6.4 (max lengths, required fields, ENUM value checks).

Write unit tests covering every use case:
- Whole Property form: every required field correctly blocks submission when empty; every optional field correctly allows submission when empty
- Whole Property form: every field with a constrained option set (dropdowns, ENUMs) rejects an out-of-set value server-side even if client-side validation is bypassed
- Title and description correctly enforce their max character limits (100 and 2,000) server-side
- Single Room form: all changed fields (property type fixed, listing type fixed, price period fixed) are correctly auto-set and not user-editable
- Single Room form: gender preference field is only rendered/accepted when "owner lives here" is true; submitting it when false is rejected or ignored server-side
- Single Room form: the legal disclaimer text matches the PRD's exact specified wording
- Wizard: data entered in Step 1 is still present when the user navigates to Step 3 and back to Step 1
- Wizard: auto-save to local storage correctly persists partial form data and is correctly recovered on a simulated page reload within the 24-hour window, and correctly NOT recovered after the window expires
- Photo upload: a valid JPEG/PNG/WebP under 5MB is accepted; an oversized file is rejected with a clear error; a file with valid extension but invalid magic bytes is rejected (using the Phase 3 utility)
- Photo upload: images are correctly resized, converted to WebP, and a thumbnail is generated (test the sharp processing pipeline with a sample image)
- Photo upload: reordering photos correctly updates sort_order; setting a new primary photo correctly updates is_primary and unsets the previous primary
- Minimum 1 photo is enforced — submission is blocked with zero photos
- Maximum 15 photos is enforced — the 16th photo upload is rejected
- Idempotency: submitting the same form twice with the same idempotency key creates only one listing record, not two
- Partial failure: a simulated photo upload failure (mock the storage call to throw) still results in a created listing record with the successfully uploaded photos and a warning state, not a failed/rolled-back listing
- Partial failure: a simulated email send failure (mock Resend to throw) does NOT prevent the listing from being created or returned as successful to the user
- Rate limit, duplicate detection, and hCaptcha checks (from Phase 3) are correctly invoked and enforced during the actual submission flow, not just as standalone units
- Slug and short_id are correctly generated and saved on listing creation, and the listing is retrievable at its generated /listings/[slug]-[short-id] URL
- An authenticated user can successfully create both a Whole Property and a Single Room listing end-to-end (integration test covering the full flow, not just isolated units)

Definition of Done for this phase:
- Both wizards (Whole Property, Single Room) are fully functional end-to-end, matching every field in PRD Sections 6.3 and 6.4 exactly
- Photo upload, processing, and storage pipeline works correctly per PRD Section 6.13
- Idempotency and partial-failure handling work exactly as specified in PRD Section 7.6.2/7.6.3
- 100% of the unit/integration tests listed above pass
- Manually create one Whole Property listing and one Single Room listing through the actual UI and confirm both appear correctly in the Supabase listings table with all fields populated correctly
- Run the full test suite (Phase 0–4) — confirm zero regressions
- Report back: test results, confirmation of field-by-field PRD compliance for both forms, and screenshots or a description of the manually created test listings
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 5):**
- [ ] Whole Property wizard fully matches PRD Section 6.3 field-by-field
- [ ] Single Room wizard fully matches PRD Section 6.4 field-by-field, including legal disclaimer wording
- [ ] Multi-step UX (progress indicator, back/next, auto-save, mobile input types) implemented per Section 9.8
- [ ] Photo upload, processing (sharp), and storage pipeline working per Section 6.13
- [ ] hCaptcha, rate limiting, duplicate detection, phone normalization all wired into the real submission flow
- [ ] Idempotency key pattern prevents duplicate submissions
- [ ] Partial failure handling works exactly per Section 7.6.2 (photos and email failures don't lose listing data)
- [ ] Confirmation email sends on successful creation
- [ ] All listing creation unit/integration tests passing
- [ ] Manually verified: one Whole Property and one Single Room listing created successfully end-to-end
- [ ] Full test suite (Phase 0–4) passes with no regressions

---

## PHASE 5: My Listings Dashboard, Status State Machine, and Listing Expiry/Renewal

### PHASE START — Copy this block into Claude Code

```
Implement the listing management dashboard and the full listing lifecycle per PRD Section 6.9 (Admin Panel — admin role assignment was done in Phase 2), the My Listings dashboard requirements from Section 6.8, Section 6.10 (Listing Expiry and Renewal), Section 6.12 (Listing Status State Machine), and Section 6.13's edit-mode photo management.

Tasks:
1. Build the /account/my-listings dashboard: list all listings owned by the authenticated user (enforced via the requireOwnership pattern from Phase 2), with status clearly labeled (active, let_sold, expired, rejected).
2. Implement the full status state machine exactly per PRD Section 6.12's transition rules table:
   - active to let_sold: owner-triggered, sends confirmation email
   - active to expired: automatic only (cron job, built in this phase)
   - active to rejected: admin-only (admin panel comes in Phase 6 — for now, implement the transition function and a way to trigger it for testing)
   - let_sold to active: owner can reactivate; if the original 90-day window has passed, reactivating starts a new 90-day window
   - expired to active: owner clicks Renew; resets expires_at to 90 days from renewal, refreshes updated_at, does NOT bump "newest first" sort position (per PRD Section 6.10's explicit rule that renewal is treated as an update, not a re-post)
   - rejected to any: only admin can reinstate (build the function; full admin UI in Phase 6)
3. Implement the listing expiry cron job per PRD Section 6.10 and Section 13's checklist: runs daily at 02:00 UTC via Supabase pg_cron or Vercel Cron, executing the update query to set status to expired for listings where expires_at is in the past and status is active, then sending expiry notification emails to affected owners.
4. Implement the 7-day and 1-day expiry warning emails per PRD Section 6.10, triggered by a separate scheduled check.
5. Implement the monthly cleanup job per PRD Section 7.6.8: hard-deletes listings that have been expired for 30+ days, including their associated photos in Storage (per the storage cleanup requirement in PRD Section 7.3 — explicitly delete Storage files, since ON DELETE CASCADE only removes the database row, not the actual file).
6. Implement the delete-listing flow per PRD Section 7.6.8: requires the user to type "DELETE" to confirm (since deletion is immediate and permanent), and the API route explicitly deletes all associated Storage files (both full and thumb versions) before or alongside deleting the database rows.
7. Implement edit-listing functionality (/listings/[id]/edit) covering all fields from both the Whole Property and Single Room forms, reusing the Phase 4 wizard components where possible, plus the edit-mode photo management from PRD Section 6.13: existing photos shown with reorder/delete controls, new photos addable up to the 15-photo limit, deleting the primary photo auto-promotes the next photo in sort_order, and photo changes auto-save independently of the main form submit.
8. Implement the email notifications triggered by status changes exactly as listed in PRD Section 6.12: let/sold confirmation, expiry notification, and rejection email with reason and appeal instructions.

Write unit tests covering every use case:
- Every valid state transition listed in PRD Section 6.12's table succeeds
- Every transition NOT listed in the table (e.g. expired directly to let_sold) is rejected
- Only the owning user can trigger active to let_sold and reactivation transitions; a non-owner request is rejected via requireOwnership
- Only an admin can trigger active to rejected and rejected to any; a non-admin request is rejected via requireAdmin
- The expiry cron logic correctly identifies listings where expires_at is before now and status is active, and correctly does NOT affect listings with a future expires_at or non-active status
- Renewal correctly resets expires_at to 90 days from the renewal timestamp
- Renewal correctly does NOT change the listing's position in "newest first" sort (test that created_at is unchanged, only updated_at and expires_at change)
- Reactivating a let_sold listing within the original 90-day window preserves the original expires_at; reactivating after the window has passed sets a new 90-day expires_at
- The monthly cleanup job correctly identifies and hard-deletes listings expired 30+ days, and correctly leaves listings expired fewer than 30 days untouched
- The monthly cleanup job correctly deletes associated Storage files, not just database rows (mock the Storage delete call and assert it was invoked for every photo)
- Delete listing requires the "DELETE" confirmation string; an incorrect confirmation string blocks deletion
- Delete listing correctly removes all Storage files (full + thumb) for every associated photo
- Each status-change email (let/sold, expiry, rejection) is correctly triggered with the right recipient and content on its corresponding transition
- Edit listing: a non-owner cannot edit another user's listing (authorization test)
- Edit listing: all fields can be successfully updated and persisted, for both Whole Property and Single Room listings
- Edit-mode photo management: deleting the primary photo correctly auto-promotes the next photo by sort_order
- Edit-mode photo management: adding photos beyond the 15-photo limit is rejected
- Dashboard correctly displays only the authenticated user's own listings, not other users' listings

Definition of Done for this phase:
- The full status state machine works exactly per PRD Section 6.12, with no invalid transitions possible
- Expiry cron, warning emails, and monthly cleanup job are implemented and correctly scheduled at 02:00 UTC
- Delete flow requires explicit "DELETE" confirmation and correctly cleans up Storage files
- Edit flow works for both listing types, including edit-mode photo management
- 100% of the unit tests listed above pass
- Manually test: create a listing, edit it, mark it as let/sold, reactivate it, and confirm each transition is reflected correctly in the dashboard and database
- Run the full test suite (Phase 0–5) — confirm zero regressions
- Report back: test results and confirmation of each state transition tested manually
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 6):**
- [ ] My Listings dashboard correctly scoped to the authenticated user only
- [ ] Full status state machine implemented exactly per Section 6.12, invalid transitions blocked
- [ ] Expiry cron job runs at 02:00 UTC and correctly expires listings
- [ ] 7-day and 1-day warning emails implemented
- [ ] Monthly cleanup job hard-deletes 30+ day expired listings including Storage files
- [ ] Delete flow requires "DELETE" confirmation and cleans up Storage
- [ ] Edit flow works for both listing types with full edit-mode photo management
- [ ] All status-change emails trigger correctly
- [ ] All state machine and dashboard unit tests passing
- [ ] Full test suite (Phase 0–5) passes with no regressions

---

## PHASE 6: Admin Panel

### PHASE START — Copy this block into Claude Code

```
Implement the admin panel per PRD Section 6.9 (Admin Panel) and the admin-related authorization rules established in Phase 2 (requireAdmin).

Tasks:
1. Build the /admin route, fully gated by requireAdmin — confirm a non-admin authenticated user is correctly blocked (403/redirect), and only is_admin = true users can access it.
2. Build the admin listings view: all listings with their status (active, expired, flagged, rejected), with filtering by status.
3. Implement admin actions: approve, reject (triggers the rejection email and rejected status from Phase 5), and delete any listing (with the same Storage cleanup requirement as the owner-delete flow from Phase 5).
4. Build the admin reported-listings view: surfaces all rows from listing_reports, including the listing_snapshot for reports where the original listing has since been deleted (per PRD Section 7.6.8's retention policy), with the ability to mark a report as reviewed/actioned/dismissed and add admin_notes.
5. Build basic analytics on the admin dashboard per PRD Section 6.9: total listings, active listings by type, listings by city, new listings per day — pulled from real query aggregates against the listings table, not hardcoded.
6. Build the user accounts view: list all users with their contact details, accessible to admins only.

Write unit tests covering every use case:
- A non-admin authenticated user is blocked from every /admin API route (403)
- An unauthenticated user is blocked from every /admin API route (401)
- An is_admin = true user can successfully access every admin view and action
- Admin reject action correctly transitions a listing to rejected status and triggers the rejection email (reusing Phase 5's transition logic)
- Admin delete action correctly removes the listing and its Storage files
- The reported-listings view correctly displays the listing_snapshot for a report whose original listing has been deleted, rather than erroring or showing a blank row
- Marking a report as reviewed/actioned/dismissed correctly updates its status and reviewed_at fields
- Analytics aggregates (total listings, by type, by city, new per day) return mathematically correct results against a known set of seeded test listings

Definition of Done for this phase:
- Admin panel fully gated by requireAdmin, verified for both unauthenticated and non-admin authenticated users
- All admin actions (approve, reject, delete, report management) work correctly and reuse the Phase 5 state machine logic rather than duplicating it
- Analytics are real, query-derived numbers, not placeholders
- 100% of the unit tests listed above pass
- Manually test: log in as the test admin account, reject a listing, confirm the rejection email and state change, review a report, and confirm analytics numbers match the actual seeded data
- Run the full test suite (Phase 0–6) — confirm zero regressions
- Report back: test results and a screenshot/description of the manual admin panel walkthrough
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 7):**
- [ ] /admin fully gated by requireAdmin, tested for both unauthenticated and non-admin cases
- [ ] Admin listing management (approve/reject/delete) works and reuses Phase 5 state machine logic
- [ ] Reported-listings view works, including the listing_snapshot fallback for deleted listings
- [ ] Analytics are real and query-derived
- [ ] All admin panel unit tests passing
- [ ] Full test suite (Phase 0–6) passes with no regressions

---

## PHASE 7: Search, Filters, and Listing Detail Page

### PHASE START — Copy this block into Claude Code

```
Implement the search/discovery experience and listing detail page per PRD Section 6.5 (Search and Filter System — Phase 1: PostgreSQL full-text search), Section 6.6 (Listing Detail Page), Section 6.11's WhatsApp/Call button rendering, and Section 9.7's empty/loading states.

Tasks:
1. Build the /listings search results page using the tsvector index from Phase 1 for keyword search, combined with structured SQL WHERE clauses for all filters per PRD Section 6.5's filter specification table: mode (Rent/Buy), property type (including Room as its own type), location, price range, bedrooms, size, furnishing, available date, sort order.
2. Build the room-specific filters (shown only when "Room" is selected) per PRD Section 6.5: suitable for, pets allowed, smoking allowed, bills included, owner lives there, gender preference — and the language filter (owner speaks).
3. Build the /listings/rooms filtered view per PRD Section 8's URL structure, with room-specific filters prominent.
4. Implement pagination per PRD Section 9.7/Section 13: "Load more" button pattern on mobile (appends next 20 results), numbered pagination on desktop, 20 results per page.
5. Implement the search result count display ("X listings found") and active filters shown as removable chips/tags above results, per PRD Section 13's checklist additions.
6. Build the listing detail page (/listings/[slug]-[short-id]) per PRD Section 6.6, with all fields for both listing categories: full photo gallery (thumbnail strip + full-screen swipe on mobile, arrow nav on desktop, per Section 9.5), property details, amenities, location map (Google Maps Embed, city-level if no street address), owner contact section, languages spoken, community preference indicator, date posted, listing reference ID, share buttons.
7. Implement the WhatsApp and Call buttons exactly per PRD Section 6.11: WhatsApp deep link using the Phase 3 utility with the pre-filled message, formatted phone number display, and a tel: link Call button.
8. Implement Room-specific detail page sections per PRD Section 6.6: shared facilities summary, existing household description, tenant suitability preferences (with the legal disclaimer inline, matching Phase 4's exact wording), bills included indicator, min/max stay, who currently lives there.
9. Implement the three status-dependent detail page states per PRD Section 6.12/Section 13's Error Pages checklist: expired listing shows "This listing has expired" (not 404) with a link to search similar listings; let/sold listing shows "No longer available" with a similar link; rejected listing returns a genuine 404.
10. Implement the "Report this listing" button and flow, writing to listing_reports per the Phase 1 schema (no auth required, per Section 7.2c).
11. Implement empty states per PRD Section 9.7: zero search results (with one-click filter-removal suggestions and a prompt to post if none exist in that area), and the day-one/pre-launch homepage state (graceful partial grid, not broken layout).
12. Implement skeleton loading states for listing cards and search results, with lazy-loaded images using a low-quality placeholder, per PRD Section 9.7.
13. Implement custom event tracking in Plausible per PRD Section 13's checklist: "Contact: WhatsApp", "Contact: Phone", "Contact: Email" fired on the respective button clicks.

Write unit tests covering every use case:
- Search correctly filters by every individual filter field in isolation (mode, property type, city, price range, bedrooms, size, furnishing, available date)
- Search correctly applies multiple filters simultaneously (combined WHERE clause correctness) — e.g. city plus price range plus bedrooms together return only listings matching all three
- Room-specific filters only appear/apply when property type equals Room, and have no effect when filtering Whole Property listings
- Sort order (newest, price low-high, price high-low) returns correctly ordered results
- Pagination returns the correct page of results and correct total count
- Keyword search via tsvector correctly matches listings containing the search term in title/description/city/neighbourhood
- Listing detail page correctly renders all Whole Property fields for a Whole Property listing, and all Room-specific fields (shared facilities, household, suitability with disclaimer) for a Room listing
- Listing detail page for an expired listing shows the correct message (not 404)
- Listing detail page for a let_sold listing shows the correct message (not 404)
- Listing detail page for a rejected listing returns a genuine 404
- WhatsApp button generates the correct deep link with pre-filled message (reusing and confirming integration with the Phase 3 utility)
- Call button renders a correct tel: link
- Report listing flow successfully creates a listing_reports row without requiring authentication
- Empty search results state renders the correct messaging and filter-removal suggestion
- Plausible custom events fire correctly on WhatsApp/Phone/Email contact button clicks (mock the Plausible call and assert invocation)

Definition of Done for this phase:
- Search and all filters (global + room-specific) work correctly individually and in combination
- Listing detail page correctly renders both listing categories with all PRD-specified fields
- All three status-dependent detail page states (expired, let/sold, rejected) render correctly
- WhatsApp/Call buttons and Report flow work correctly
- Empty and loading states implemented per Section 9.7
- Contact click tracking fires correctly
- 100% of the unit tests listed above pass
- Manually test: search with multiple combined filters, view a Whole Property and a Room listing detail page, click WhatsApp/Call, report a listing, and view an expired/let-sold/rejected listing's detail page
- Run the full test suite (Phase 0–7) — confirm zero regressions
- Report back: test results and confirmation of each manual test performed
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 8):**
- [ ] Search and all global + room-specific filters work individually and combined
- [ ] Pagination (mobile "Load more" / desktop numbered) implemented correctly
- [ ] Listing detail page renders all fields correctly for both listing categories
- [ ] All three status-dependent detail page states (expired/let-sold/rejected) implemented
- [ ] WhatsApp deep link, Call button, and Report flow work correctly
- [ ] Empty states and skeleton loading states implemented
- [ ] Plausible contact-click event tracking fires correctly
- [ ] All search/detail page unit tests passing
- [ ] Full test suite (Phase 0–7) passes with no regressions

---

## PHASE 8: Homepage, Navigation, and Design System Implementation

### PHASE START — Copy this block into Claude Code

```
Implement the homepage, global navigation, and the full design system per PRD Section 6.7 (Homepage), Section 9 (Design System — all subsections 9.1 through 9.10), and Section 8 (remaining static pages: /about, /contact, /terms, /privacy, /listing-guidelines).

Tasks:
1. Implement the design system foundation per PRD Section 9.2/9.3/9.4: color palette as design tokens (Tailwind config) exactly matching the hex values in Section 9.2 (including WhatsApp Green #25D366 and Textile Accent #D4A574), typography scale per Section 9.3 with the Inter plus Noto Sans fallback stack for Indic script coverage, and the four responsive breakpoints (375/768/1024/1440px) per Section 9.4 as the shared reference for every component built in this and prior phases.
2. Verify color contrast per Section 9.2's notes — specifically confirm Saffron is only used for large/bold text or as a background with white text, never as small body text color, per the WCAG AA constraint noted in the PRD.
3. Implement the icon system per PRD Section 9.5: integrate Lucide React (or Phosphor), and replace any emoji-based functional UI (e.g. suitability tags) with proper icon components in Saffron, as specified — graduation-cap for Students OK, briefcase for Professionals, paw for Pets OK, no-smoking icon, leaf for Vegetarian Household.
4. Source or create city skyline silhouette icons for the featured cities (Amsterdam, Utrecht, Rotterdam, etc.) per PRD Section 9.5/9.1, used in city quick-links.
5. Build the homepage (/) per PRD Section 6.7: hero section with headline/subheadline (explicitly stating the Indian-community positioning in text, per Section 9.1's example: "Find Your Home in the Netherlands — Built for the Indian Community"), Rent/Buy/Room search tabs, hero imagery treated with the duotone saffron overlay direction from Section 9.1, recent listings grid (6–8 listings with the graceful day-one partial-grid empty state from Section 9.7), city quick-links with skyline icons, "How it works" 3-step explainer for both listers and seekers, trust indicators (listing count, cities covered), and the "Post Your Property for Free" CTA banner.
6. Implement the Textile Accent border pattern per PRD Section 9.1/9.5 as a single restrained accent detail (e.g., a 3px top border on listing cards) — confirm it is not overused elsewhere in the interface.
7. Build global navigation per PRD Section 9.9: desktop header (logo, primary nav links, search icon, persistent "Post a Listing" button, account menu), mobile header (logo, hamburger menu opening a full-screen overlay, persistent floating "Post a Listing" action button on scroll), and the footer (four-column desktop layout collapsing to an accordion on mobile: About / For Listers / For Seekers / Legal, with trust indicators repeated).
8. Implement accessibility requirements per PRD Section 9.6: visible 2px Saffron focus-visible outline on all interactive elements, proper label elements on all form fields (not placeholder-only), full keyboard navigation across every user journey (test specifically: posting a listing, searching, and contacting an owner, all without a mouse), and 44x44px minimum touch targets on mobile.
9. Build the remaining static pages per PRD Section 8: /about, /contact, /terms, /privacy, /listing-guidelines (the latter explicitly covering what is allowed, the AWGB anti-discrimination rules from Section 10.2, and fraud prevention tips).
10. Implement microcopy per the tone-of-voice direction in PRD Section 9.10: review every error message, confirmation message, empty state message, and destructive-action confirmation built across all prior phases, and ensure each matches the warm, direct, community-minded tone with the specific examples given in Section 9.10's table (not generic/corporate phrasing).
11. Implement custom 404 and 500 error pages per PRD Section 13's Error Pages checklist: branded, with a search bar and homepage link (404), and a contact link (500).

Write unit tests covering every use case:
- Design tokens (colors, typography) are correctly applied and match the PRD hex values exactly (snapshot or computed-style test)
- Homepage renders correctly with a full set of 6–8 listings, and correctly renders the day-one partial-grid state when fewer than 6 listings exist (mock both scenarios)
- Hero headline text matches the Indian-community-positioning requirement (not generic real estate copy)
- City quick-links correctly filter search results when clicked, navigating to /listings with the correct city pre-filled
- Mobile navigation: hamburger menu opens and closes correctly; the floating "Post a Listing" button remains visible on scroll
- Desktop navigation: all primary nav links route correctly
- Keyboard navigation: the three flagged journeys (post a listing, search, contact an owner) are fully completable via keyboard only (Tab/Enter), verified with simulated keyboard-only interaction tests
- Focus-visible outline correctly appears on tab-focused interactive elements
- All form fields have associated label elements (not placeholder-only) — audit test across the listing wizard forms from Phase 4
- Touch target sizes meet the 44x44px minimum on mobile viewport renders
- Custom 404 page renders for an invalid route
- Custom 500 page renders for a simulated server error
- Static pages (/about, /contact, /terms, /privacy, /listing-guidelines) all render with non-empty, correct content

Definition of Done for this phase:
- Full design system implemented and matches PRD Section 9 exactly (palette, typography, breakpoints, icons, accent pattern)
- Homepage matches PRD Section 6.7 exactly, including the Indian-community positioning in hero copy
- Navigation (desktop + mobile) implemented per Section 9.9
- Accessibility requirements (focus states, labels, keyboard nav, touch targets) verified per Section 9.6
- All static pages built with real content
- Custom 404/500 pages implemented
- 100% of the unit tests listed above pass
- Manually test: complete the "post a listing" and "contact an owner" journeys using keyboard only, with no mouse
- Run the full test suite (Phase 0–8) — confirm zero regressions
- Report back: test results, confirmation of the keyboard-only manual test, and a screenshot of the homepage
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 9):**
- [ ] Design tokens (color, typography, breakpoints) implemented exactly per Section 9.2–9.4
- [ ] Icon system implemented, emoji replaced with proper icons per Section 9.5
- [ ] City skyline icons implemented for featured cities
- [ ] Homepage matches Section 6.7 exactly, including Indian-community hero positioning
- [ ] Textile Accent pattern implemented as a single restrained detail
- [ ] Navigation (desktop + mobile) implemented per Section 9.9
- [ ] Accessibility (focus states, labels, keyboard nav, touch targets) verified per Section 9.6
- [ ] All static pages built with real content
- [ ] Custom 404/500 pages implemented
- [ ] All design system and homepage unit tests passing
- [ ] Manual keyboard-only journey test passed
- [ ] Full test suite (Phase 0–8) passes with no regressions

---

## PHASE 9: GDPR, Legal Compliance, and SEO

### PHASE START — Copy this block into Claude Code

```
Implement GDPR compliance, legal/AWGB safeguards, and SEO requirements per PRD Section 10 (Legal and Compliance) and the SEO items in Section 13's checklist.

Tasks:
1. Implement the cookie consent banner per PRD Section 10.1: shown on first visit, blocking non-essential cookies (analytics) until explicit consent is given; strictly necessary session cookies do not require consent. Confirm Plausible analytics (wired in Phase 0) only fires after consent is granted, not before.
2. Implement full account deletion per PRD Section 10.1/7.6.8's Right to Erasure: hard-deletes the user account, all owned listings, and all associated photos in Storage, immediately and permanently, with the "type DELETE to confirm" pattern established in Phase 5 applied here too.
3. Finalize the Privacy Policy and Terms of Service pages (built as static pages in Phase 8) with complete, accurate content covering data collection, retention, GDPR rights, and platform rules.
4. Implement the AWGB anti-discrimination safeguards per PRD Section 10.2: confirm the /listing-guidelines page (built in Phase 8) explicitly states listings must comply with Dutch anti-discrimination law, confirm the gender-preference legal disclaimer (built in Phase 4) renders with the PRD's exact wording, and confirm the Terms of Service includes a clause that AWGB violations result in listing removal and account suspension.
5. Confirm the content moderation loop per PRD Section 10.3: the Report Listing flow (built in Phase 7) correctly feeds into the admin reported-listings view (built in Phase 6), with a clear path for an admin to remove a reported listing within the stated 24-hour response expectation.
6. Implement SEO requirements per PRD Section 13's SEO checklist: unique title and meta description on every page, Schema.org RealEstateListing structured data on every listing detail page, auto-generated sitemap.xml including all active listing URLs using the slug-based paths from Phase 4, canonical URL tags on listing detail pages to prevent duplicate content, correctly configured robots.txt (disallowing /admin and /account), and Open Graph tags for social sharing on listing detail pages.
7. Implement image alt text per PRD Section 9.7/6.13: auto-generated as "[title] — photo [n]" for every listing photo, confirmed present in the rendered HTML.

Write unit tests covering every use case:
- Cookie consent banner appears on first visit and does not reappear after consent is given (test with simulated repeat visits)
- Plausible analytics does NOT fire before consent is given, and DOES fire after consent is given (mock and assert call timing)
- Account deletion correctly removes the user, all their listings, and all associated Storage files (integration test using a seeded test user with listings and photos)
- Account deletion is blocked unless the "DELETE" confirmation string is correctly entered
- The gender-preference legal disclaimer text exactly matches the PRD's specified wording (string comparison test)
- /listing-guidelines page contains the required AWGB compliance language
- Schema.org RealEstateListing structured data is correctly generated and valid (test against the schema.org spec structure) for both listing categories
- sitemap.xml correctly includes all active listings using slug-based URLs, and correctly excludes expired/let-sold/rejected listings
- Canonical URL tags are present and correct on listing detail pages
- robots.txt correctly disallows /admin and /account
- Every listing photo renders with the correct auto-generated alt text format

Definition of Done for this phase:
- Cookie consent gates analytics correctly
- Account deletion is complete, irreversible, and correctly cleans up all data including Storage
- Legal pages and AWGB safeguards are complete and accurate
- SEO requirements (structured data, sitemap, canonical, robots.txt, OG tags, alt text) all implemented and verified
- 100% of the unit tests listed above pass
- Manually verify: view page source on a listing detail page and confirm Schema.org structured data is present and valid using Google's Rich Results Test tool (or equivalent), and confirm sitemap.xml is accessible and correctly populated
- Run the full test suite (Phase 0–9) — confirm zero regressions
- Report back: test results and confirmation of the manual SEO verification
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 10):**
- [ ] Cookie consent banner correctly gates analytics
- [ ] Account deletion is complete and correctly cleans up Storage
- [ ] Privacy Policy, Terms of Service, and /listing-guidelines complete and accurate
- [ ] AWGB legal disclaimer wording verified exact
- [ ] Schema.org structured data implemented and validated
- [ ] sitemap.xml, canonical URLs, robots.txt, OG tags all implemented
- [ ] Image alt text correctly generated for all photos
- [ ] All GDPR/legal/SEO unit tests passing
- [ ] Manual SEO verification (Rich Results Test, sitemap check) passed
- [ ] Full test suite (Phase 0–9) passes with no regressions

---

## PHASE 10: Reliability, Monitoring, and Operational Hardening

### PHASE START — Copy this block into Claude Code

```
Implement the operational reliability requirements per PRD Section 7.6 (Reliability, Operations, and Data Lifecycle) and Section 7.5 (Concurrency Capacity).

Tasks:
1. Confirm and document Supabase automatic daily backups are enabled (Pro tier) per PRD Section 7.6.1, and perform one test restore to the staging Supabase project, documenting the exact steps taken.
2. Enable PgBouncer connection pooling in Supabase per PRD Section 7.5, and document the before/after connection limit configuration.
3. Implement cron job execution logging and failure alerting per PRD Section 7.6.4: the expiry cron (Phase 5) and monthly cleanup job (Phase 5) must log their execution result; a failure must trigger a Sentry alert rather than failing silently.
4. Configure Supabase dashboard resource alerts for storage and connection pool thresholds per PRD Section 7.6.4.
5. Set up the external uptime monitor (UptimeRobot or Better Uptime free tier) per PRD Section 13's checklist, pinging indianhomes.nl every 5 minutes with email/SMS alert on downtime.
6. Review every API route built across Phases 2–9 and confirm the authorization model from Phase 2 (requireAuth, requireOwnership, requireAdmin) is consistently applied — this is a cross-cutting audit, not new functionality. Specifically re-verify no IDOR vulnerabilities exist: attempt (in a test) to edit/delete a listing using another user's listing ID while authenticated as a different user, and confirm it is rejected on every relevant route.
7. Confirm CORS/API exposure boundaries per PRD Section 7.2e: API routes are not callable from any origin other than indianhomes.nl.
8. Run a full input sanitization audit per PRD Section 7.2d: search the codebase for any use of dangerouslySetInnerHTML (should be zero, per the ESLint rule from Phase 2) and confirm every free-text field identified in the PRD (title, description, existing_occupants_description, contact_name, report details) is server-side validated for length limits.

Write unit tests / audit checks covering every use case:
- IDOR audit: for every mutating API route (edit listing, delete listing, mark let/sold, renew, admin actions), confirm a test attempting cross-user access is rejected with the correct error
- Cron failure simulation: mock the expiry cron to throw an error, and confirm a Sentry alert is correctly triggered
- Cron failure simulation: mock the monthly cleanup job to throw an error, and confirm a Sentry alert is correctly triggered
- CORS test: confirm an API request from a disallowed origin is rejected
- Sanitization audit: automated codebase search confirms zero instances of dangerouslySetInnerHTML
- Sanitization audit: every free-text field listed above has a server-side length-limit test (some of these may already exist from Phase 4 — confirm coverage rather than duplicate)

Definition of Done for this phase:
- Backups confirmed enabled; one test restore successfully performed and documented
- PgBouncer pooling confirmed enabled
- Cron failure alerting implemented and tested
- Resource threshold alerts configured
- External uptime monitoring configured and confirmed working (trigger a deliberate test alert)
- Full IDOR audit passed across every mutating route with zero vulnerabilities found
- CORS boundary confirmed
- Sanitization audit passed with zero dangerouslySetInnerHTML instances
- 100% of the audit tests listed above pass
- Run the full test suite (Phase 0–10) — confirm zero regressions
- Report back: full IDOR audit results route-by-route, backup restore documentation, and confirmation of uptime monitor test alert
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 11):**
- [ ] Backups confirmed enabled, test restore performed and documented
- [ ] PgBouncer connection pooling enabled
- [ ] Cron failure alerting implemented and tested for both jobs
- [ ] Resource threshold alerts configured
- [ ] External uptime monitor configured and test-triggered successfully
- [ ] Full IDOR audit passed across every mutating API route
- [ ] CORS boundary confirmed
- [ ] Zero dangerouslySetInnerHTML instances in the codebase
- [ ] All Phase 10 audit tests passing
- [ ] Full test suite (Phase 0–10) passes with no regressions

---

## PHASE 11: End-to-End Testing and Cross-Browser/Device Verification

### PHASE START — Copy this block into Claude Code

```
Implement comprehensive end-to-end test coverage for the two core user journeys per PRD Section 6.1, and perform full cross-browser/device verification per PRD Section 13's Performance and QA checklist. This phase does not add new features — it validates that everything built in Phases 1–10 works together correctly as complete, real user journeys.

Tasks:
1. Write a full Playwright E2E test for Journey 1 (List a Property) exactly per PRD Section 6.1's 7 steps: arrive at homepage, sign in (Google or email/password), select listing category, complete the multi-step wizard, upload photos, submit and receive confirmation, listing appears live within seconds. Run this for both Whole Property and Single Room categories.
2. Write a full Playwright E2E test for Journey 2 (Find a Property) exactly per PRD Section 6.1's 6 steps: land on homepage, select Rent/Buy/Room plus location plus price, view matching results, apply additional filters, click into a listing detail page, contact via WhatsApp/phone/email.
3. Write E2E tests for the secondary critical flows: edit a listing, mark a listing as let/sold and reactivate it, renew an expired listing (simulate expiry), delete a listing (with DELETE confirmation), report a listing, and the admin reject/approve flow.
4. Write E2E tests confirming the three status-dependent listing detail page states (expired, let/sold, rejected) render correctly when navigated to directly.
5. Run the full Playwright suite across the browser/device matrix specified in PRD Section 13: iPhone Safari, Android Chrome, desktop Chrome, Firefox, and Edge. Configure Playwright's built-in device emulation profiles for the mobile browsers.
6. Run Google Lighthouse (or the Playwright Lighthouse integration) against the homepage, search results page, and a listing detail page, confirming Core Web Vitals are green per PRD Section 11.2's performance targets (LCP under 2.5s on mobile/3G, search response under 500ms).
7. Verify SSL enforcement and HTTP-to-HTTPS redirect on the production Vercel deployment.
8. Run the complete unit + integration + E2E test suite together one final time, and generate a final coverage report.

Write/confirm test coverage:
- Both E2E journeys (List a Property — both categories, Find a Property) pass on every browser/device in the matrix
- All secondary flow E2E tests (edit, mark let/sold, reactivate, renew, delete, report, admin reject/approve) pass
- All three status-dependent page-state E2E tests pass
- Lighthouse scores meet the PRD Section 11.2 targets on all three tested page types
- Full coverage report shows 85% or higher coverage on business logic per the Master Definition of Done

Definition of Done for this phase:
- Both core user journeys pass as full E2E tests on all 5 browser/device targets
- All secondary flows pass as E2E tests
- All three status-dependent detail page states pass as E2E tests
- Core Web Vitals are green on homepage, search, and listing detail page
- SSL/HTTPS redirect confirmed on production
- Final test coverage report generated and meets the 85% or higher business logic target
- Report back: full E2E test results broken down by browser/device, Lighthouse scores for all three page types, and the final coverage report summary
```

### PHASE END

**Definition of Done checklist (verify before proceeding to Phase 12):**
- [ ] Journey 1 (List a Property) E2E test passes for both listing categories, on all 5 browser/device targets
- [ ] Journey 2 (Find a Property) E2E test passes on all 5 browser/device targets
- [ ] All secondary flow E2E tests pass (edit, let/sold, reactivate, renew, delete, report, admin actions)
- [ ] All three status-dependent detail page state E2E tests pass
- [ ] Lighthouse Core Web Vitals green on homepage, search, listing detail
- [ ] SSL/HTTPS redirect confirmed on production
- [ ] Final coverage report meets 85% or higher business logic target
- [ ] Full test suite (all phases) passes with zero failures

---

## PHASE 12: Production Deployment and Final Sign-Off

### PHASE START — Copy this block into Claude Code

```
Perform the final production deployment and complete sign-off per PRD Section 13's full checklist and the Master Definition of Done at the top of this document.

Tasks:
1. Walk through every single checklist item in PRD Section 13 (Development Checklist) one final time — Project Setup, Database, Authentication, Authorization and Security, Listing — Whole Property, Listing — Single Room, Search and Filter, My Listings Dashboard, Admin Panel, Design System, Homepage, SEO, GDPR and Legal, Email, Error Pages, Monitoring and Operations, Performance and QA — and confirm every single item is checked off. Report any item that is not yet complete.
2. Point the indianhomes.nl domain to the Vercel production deployment, per PRD Section 13.
3. Add all production environment variables to Vercel project settings, per the table established in Phase 0.
4. Perform one final full manual smoke test of both core user journeys directly on the live production domain (not localhost, not a preview URL).
5. Confirm Sentry is receiving production traffic with zero unresolved critical/high-severity issues after the smoke test.
6. Confirm Plausible is correctly tracking real production traffic and the custom contact-click events.
7. Run the complete automated test suite (unit, integration, E2E) one final time and confirm 100% pass rate with zero skipped or pending tests.
8. Cross-reference this final state against the Master Definition of Done at the top of this document and confirm every single item is met.

Definition of Done for this phase (this is also the Definition of Done for MVP 1 as a whole):
- Every item in PRD Section 13's Development Checklist is checked off — list any exceptions explicitly, there should be none
- indianhomes.nl resolves correctly to the production Vercel deployment with valid SSL
- Both core user journeys work correctly on the live production domain
- Zero unresolved critical/high-severity Sentry issues after the production smoke test
- Plausible tracking confirmed live and accurate
- 100% of the full automated test suite passes, zero skipped/pending tests
- Every item in the Master Definition of Done (top of this document) is confirmed met
- Report back: final checklist completion status, production smoke test results, final test suite pass rate, and explicit confirmation that MVP 1 per IndianHomes.nl PRD v1.7.1 is production-ready
```

### PHASE END

**Definition of Done checklist — this is the final MVP 1 sign-off:**
- [ ] Every item in PRD Section 13's Development Checklist confirmed complete
- [ ] indianhomes.nl live in production with valid SSL
- [ ] Both core user journeys verified working on live production domain
- [ ] Zero unresolved critical/high-severity Sentry issues
- [ ] Plausible tracking confirmed live and accurate
- [ ] 100% automated test suite pass rate, zero skipped/pending tests
- [ ] Every item in the Master Definition of Done (top of this document) confirmed met

---

## MVP 1 Complete

When Phase 12's Definition of Done is fully checked, **IndianHomes.nl MVP 1 per PRD v1.7.1 is production-ready.** The platform is live, every user journey works end-to-end, every feature matches the PRD specification exactly, and the codebase carries comprehensive automated test coverage validating every use case across all 12 phases.

---

*IndianHomes.nl — MVP 1 Development Prompt — v1.0 — Built against PRD v1.7.1 (Development Approved) — June 2026*
