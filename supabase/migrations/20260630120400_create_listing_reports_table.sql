-- listing_reports table per PRD Section 7.3.
-- listing_id is nullable with ON DELETE SET NULL so the report survives as an
-- audit trail even after the reported listing is hard-deleted (Section 7.6.8).
create type public.listing_report_reason_enum as enum ('fraud', 'scam', 'discrimination', 'incorrect_info', 'duplicate', 'other');
create type public.listing_report_status_enum as enum ('pending', 'reviewed', 'actioned', 'dismissed');

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  listing_snapshot text,
  reporter_email text not null,
  reason public.listing_report_reason_enum not null,
  details text check (char_length(details) <= 500),
  status public.listing_report_status_enum not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
