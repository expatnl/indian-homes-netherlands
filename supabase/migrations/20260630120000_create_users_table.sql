-- users table per PRD Section 7.3.
-- id is the Firebase UID (text), not a generated UUID — per Section 7.2b:
-- "users.id = Firebase UID (string, not UUID)". There is no DEFAULT on id;
-- the Next.js API supplies the Firebase UID on first sign-in.
create table public.users (
  id text primary key,
  email text not null unique,
  name text not null,
  phone text,
  created_at timestamptz not null default now(),
  is_admin boolean not null default false
);
