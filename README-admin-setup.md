# Admin Account Setup

Per PRD Section 6.9, there is no in-app admin invite flow in MVP 1 — this is
intentional, since only the founder holds admin access at launch. The
`is_admin` flag is set manually, once, via a one-line SQL update run in the
**Supabase dashboard SQL editor**, so the action is deliberate and auditable
rather than an undocumented manual step.

## Prerequisites

The target user must already have a row in `public.users` — i.e. they must
have signed in at least once (Google or email/password), so the Next.js API
has run the first-sign-in sync (`POST /api/auth/sync-user`, see
`lib/supabase/admin.ts`'s `syncUserRecord`) and created their `users` row.

## The exact command (PRD Section 6.9)

```sql
UPDATE users SET is_admin = true WHERE email = 'founder@indianhomes.nl';
```

Replace `founder@indianhomes.nl` with the real founder/admin account's email
address. Run this in **Supabase Dashboard → SQL Editor** against the
production project, after that account has signed in at least once.

## Revoking admin access

```sql
UPDATE users SET is_admin = false WHERE email = 'founder@indianhomes.nl';
```

## Why this is manual and not a button

A proper admin invite flow with audit logging (who granted admin, when) is
explicitly deferred to MVP 2 (PRD Section 6.9) — building it now would be
unused complexity for a single-founder MVP 1 launch.

## Verifying it actually works

This exact mechanism (schema column + SQL command + the `requireAdmin()`
authorization check reading it) is covered by automated tests:

- `lib/__tests__/auth/admin-sql.test.ts` runs the literal SQL above against
  a real local Postgres instance (the same migrations from Phase 1) and
  confirms `is_admin` flips from `false` to `true` and back.
- `lib/__tests__/auth/server.test.ts` covers `requireAdmin()` accepting an
  `is_admin = true` user and rejecting everyone else.

No live Supabase/Firebase project exists yet in this environment (see
`docs/CLOUD_SETUP.md`), so the command above has not been run against a real
production database with a real signed-in founder account — that step is
still pending cloud provisioning.
