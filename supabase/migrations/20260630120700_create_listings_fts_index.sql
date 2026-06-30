-- Full-text search per PRD Section 6.5 (Phase 1: PostgreSQL tsvector) and the
-- Section 13 checklist item "Full-text search index (tsvector) on title,
-- description, city, neighbourhood". Section 7.3's column list does not show
-- a search_vector column, but a tsvector index cannot exist without a
-- tsvector expression to index — implemented here as a generated stored
-- column (auto-maintained, no extra trigger needed) rather than a bare
-- functional index, for query simplicity and index reuse.
alter table public.listings
  add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(city, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(neighbourhood, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored;

create index idx_listings_search_vector on public.listings using gin (search_vector);
