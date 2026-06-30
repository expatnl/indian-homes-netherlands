-- set_updated_at trigger per PRD Section 7.3:
-- "updated_at — auto-updated via PostgreSQL trigger set_updated_at on every row change"
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();
