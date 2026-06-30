-- Row Level Security per PRD Section 7.2c (Authorization Model) and the
-- Phase 1 task list. Beyond the literal task list, two additions were
-- necessary for the PRD's own features to function and are called out here:
--   1. listings: an extra "owner can select own listings (any status)"
--      policy, required for the My Listings dashboard (Section 6.8/7.2c)
--      to show non-active (expired/let_sold/rejected) listings to their
--      owner — the task's "public SELECT for status='active'" alone would
--      hide a user's own non-active listings from themselves.
--   2. listings: admin SELECT/UPDATE/DELETE policies, required for the
--      Admin Panel (Section 6.9: "Approve, reject, or delete listings").
-- Everything else matches the task list literally.

alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.listing_reports enable row level security;
alter table public.cities enable row level security;

-- users: own row only; admins can read all
create policy "users_select_own" on public.users
  for select
  using (id = public.requesting_user_id());

create policy "users_select_admin" on public.users
  for select
  using (public.is_admin_user());

create policy "users_update_own" on public.users
  for update
  using (id = public.requesting_user_id())
  with check (id = public.requesting_user_id());

-- Defensive: lets the Next.js API create the first-sign-in user row using
-- the caller's own Firebase-derived identity rather than only via the
-- service-role key (Section 7.2b "Users table sync").
create policy "users_insert_own" on public.users
  for insert
  with check (id = public.requesting_user_id());

-- listings
create policy "listings_select_active_public" on public.listings
  for select
  using (status = 'active');

create policy "listings_select_own" on public.listings
  for select
  using (user_id = public.requesting_user_id());

create policy "listings_select_admin" on public.listings
  for select
  using (public.is_admin_user());

create policy "listings_insert_own" on public.listings
  for insert
  with check (user_id = public.requesting_user_id());

create policy "listings_update_own" on public.listings
  for update
  using (user_id = public.requesting_user_id())
  with check (user_id = public.requesting_user_id());

create policy "listings_update_admin" on public.listings
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "listings_delete_own" on public.listings
  for delete
  using (user_id = public.requesting_user_id());

create policy "listings_delete_admin" on public.listings
  for delete
  using (public.is_admin_user());

-- listing_photos: public SELECT; writes restricted to the owning listing's user_id
create policy "listing_photos_select_public" on public.listing_photos
  for select
  using (true);

create policy "listing_photos_insert_owner" on public.listing_photos
  for insert
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = public.requesting_user_id()
    )
  );

create policy "listing_photos_update_owner" on public.listing_photos
  for update
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = public.requesting_user_id()
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = public.requesting_user_id()
    )
  );

create policy "listing_photos_delete_owner" on public.listing_photos
  for delete
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.user_id = public.requesting_user_id()
    )
  );

-- listing_reports: anyone can insert (Section 7.2c: "no authentication
-- required"); only admins can read or update. No delete policy — reports
-- must be retained even after the reported listing is gone (Section 7.6.8).
create policy "listing_reports_insert_public" on public.listing_reports
  for insert
  with check (true);

create policy "listing_reports_select_admin" on public.listing_reports
  for select
  using (public.is_admin_user());

create policy "listing_reports_update_admin" on public.listing_reports
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- cities: public read-only; no insert/update/delete policy for any
-- non-bypassing role, so writes only happen via migrations / service role.
create policy "cities_select_public" on public.cities
  for select
  using (true);
