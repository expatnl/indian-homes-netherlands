-- Firebase JWT helpers per PRD Section 7.2b ("Supabase RLS with Firebase
-- JWT" — RLS policies should use the authenticated identity from the
-- Firebase token).
--
-- We deliberately do NOT use Supabase's built-in auth.uid(), because that
-- function casts the JWT "sub" claim to uuid. Firebase UIDs are arbitrary
-- ~28-character strings, not valid UUIDs, and users.id / listings.user_id
-- are typed `text` for exactly this reason (Section 7.2b: "users.id =
-- Firebase UID (string, not UUID)"). Calling auth.uid() against a Firebase
-- JWT would throw a cast error on every request. requesting_user_id() reads
-- the same "sub" claim but keeps it as text, matching our schema.
--
-- This assumes Firebase is configured as a Supabase third-party auth
-- provider (see supabase/config.toml [auth.third_party.firebase]) so that
-- auth.jwt() is populated from a verified Firebase ID token.
create or replace function public.requesting_user_id()
returns text
language sql
stable
as $$
  select nullif((auth.jwt() ->> 'sub'), '')::text;
$$;

-- Used by RLS policies that need to grant admin-only access (Section 7.2c:
-- "Access any /admin route or API: users.is_admin = true"). security definer
-- is required so this can read users.is_admin even though the users table's
-- own RLS policies would otherwise restrict the caller to their own row.
create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = public.requesting_user_id() and is_admin = true
  );
$$;
