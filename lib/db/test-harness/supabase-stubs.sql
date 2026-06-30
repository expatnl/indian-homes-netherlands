-- Local-test-only stubs that mimic the parts of a real Supabase project our
-- migrations assume already exist (anon/authenticated/service_role roles,
-- the auth schema, auth.jwt(), and default grants for the public schema).
-- This file is NOT a migration and must never be applied to a real Supabase
-- project — those primitives are already provided by the Supabase platform
-- itself; recreating them there would error or fight the platform's own
-- setup. It exists only so supabase/migrations/*.sql can run, unmodified,
-- against a bare local Postgres instance for testing.

do $$ begin
  if not exists (select from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
end $$;

do $$ begin
  if not exists (select from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
end $$;

do $$ begin
  if not exists (select from pg_roles where rolname = 'service_role') then
    create role service_role nologin noinherit bypassrls;
  end if;
end $$;

grant anon to current_user;
grant authenticated to current_user;
grant service_role to current_user;

create schema if not exists auth;

-- Real Supabase populates this from the verified JWT (Firebase, via
-- third-party auth per Section 7.2b, or Supabase Auth itself) on every
-- PostgREST request. Tests simulate that by setting the
-- "request.jwt.claims" session variable before running a query as
-- anon/authenticated (see lib/db/test-harness/withRole.ts).
create or replace function auth.jwt() returns jsonb
language sql
stable
as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb;
$$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
