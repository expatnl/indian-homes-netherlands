-- listings table per PRD Section 7.3, with enum value sets exactly as specified
-- in Sections 6.3, 6.4, and 7.3.
--
-- Nullability note: PRD Section 7.3 only annotates a subset of columns as
-- "nullable" or "optional" (e.g. bedrooms is explicitly "nullable (null for
-- rooms)"). Because a single `listings` row serves both listing_category
-- values (whole_property and room), and Section 6.4 shows several fields are
-- whole-property-only or room-only (e.g. bathrooms is replaced entirely by
-- bathroom_type for rooms; total_occupants_after only exists for rooms),
-- every field that does not apply uniformly to both categories is made
-- NOT NULL only where the PRD's field tables (6.3/6.4) mark it "Required"
-- for the category it belongs to, and nullable otherwise. Required-ness that
-- depends on listing_category (e.g. "Required" within the Single Room form
-- only) is enforced at the application/API layer, not as a blanket NOT NULL
-- constraint, since the same column is unused for the other category.

create type public.listing_category_enum as enum ('whole_property', 'room');
create type public.listing_type_enum as enum ('rent', 'sale');
create type public.property_type_enum as enum ('apartment', 'house', 'studio', 'room', 'commercial');
create type public.bathroom_type_enum as enum ('private', 'shared_tenants', 'shared_owner');
create type public.kitchen_type_enum as enum ('shared_tenants', 'shared_owner', 'private');
create type public.bills_included_enum as enum ('all', 'some', 'none');
create type public.furnishing_enum as enum ('unfurnished', 'semi', 'fully');
create type public.pets_allowed_enum as enum ('yes', 'no', 'cats_only', 'small_dogs', 'negotiable');
create type public.smoking_enum as enum ('allowed', 'not_allowed', 'outside_only');
create type public.household_type_enum as enum ('family', 'professionals', 'mixed', 'students');
create type public.gender_preference_enum as enum ('no_preference', 'male_only', 'female_only');
create type public.dietary_preference_enum as enum ('no_restriction', 'vegetarian', 'vegan');
create type public.guests_policy_enum as enum ('welcome', 'no_overnight', 'flexible');
create type public.community_preference_enum as enum ('open', 'indian_preferred');
create type public.listing_status_enum as enum ('active', 'let_sold', 'expired', 'rejected');

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  short_id text not null,
  slug text not null,
  user_id text not null references public.users(id),
  listing_category public.listing_category_enum not null,
  listing_type public.listing_type_enum not null,
  property_type public.property_type_enum not null,
  title text not null check (char_length(title) <= 100),
  description text not null check (char_length(description) <= 2000),
  price integer not null,
  city text not null,
  province text not null,
  neighbourhood text,
  street_address text,
  lat numeric,
  lng numeric,
  size_sqm integer not null,
  -- nullable: null for room listings (Section 7.3)
  bedrooms integer,
  -- nullable: Single Room form replaces this with bathroom_type (Section 6.4)
  bathrooms integer,
  -- room-only fields below are nullable; required-for-rooms is enforced in the API layer
  room_size_sqm integer,
  bathroom_type public.bathroom_type_enum,
  kitchen_type public.kitchen_type_enum,
  living_room_access boolean,
  separate_entrance boolean,
  internet_included boolean,
  bills_included public.bills_included_enum,
  furnishing public.furnishing_enum not null,
  available_from date not null,
  deposit integer,
  energy_label text,
  amenities jsonb not null default '[]'::jsonb,
  pets_allowed public.pets_allowed_enum,
  smoking public.smoking_enum,
  household_type public.household_type_enum,
  owner_lives_here boolean,
  existing_occupants_description text,
  total_occupants_after integer,
  household_languages jsonb default '[]'::jsonb,
  suitable_for jsonb default '[]'::jsonb,
  gender_preference public.gender_preference_enum,
  dietary_preference public.dietary_preference_enum,
  guests_policy public.guests_policy_enum,
  min_stay_months integer,
  max_stay_months integer,
  languages_spoken jsonb default '[]'::jsonb,
  community_preference public.community_preference_enum,
  contact_name text not null,
  contact_phone text not null,
  contact_email text not null,
  show_email boolean not null default true,
  status public.listing_status_enum not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);
