-- cities table per PRD Section 7.3.
create table public.cities (
  id integer generated always as identity primary key,
  name text not null,
  name_nl text not null,
  province text not null,
  is_featured boolean not null default false,
  sort_order integer not null default 0
);
