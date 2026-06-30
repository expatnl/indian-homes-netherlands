-- Indexes per PRD Section 13 Database checklist:
-- "Indexes created on city, listing_type, property_type, status, created_at, expires_at, slug"
create index idx_listings_city on public.listings (city);
create index idx_listings_listing_type on public.listings (listing_type);
create index idx_listings_property_type on public.listings (property_type);
create index idx_listings_status on public.listings (status);
create index idx_listings_created_at on public.listings (created_at);
create index idx_listings_expires_at on public.listings (expires_at);
create index idx_listings_slug on public.listings (slug);
