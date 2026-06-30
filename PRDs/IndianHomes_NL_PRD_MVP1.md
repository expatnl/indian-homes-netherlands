# indianhomes.nl — Product Requirements Document
## MVP 1: Housing for Indians in the Netherlands

---

| Field | Detail |
|---|---|
| **Version** | 1.7.1 — Development Approved |
| **Status** | ✅ Approved — Cleared for Development |
| **Domain** | indianhomes.nl |
| **Date** | June 2026 |
| **Author** | Vijay / CodeWithVijay |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Netherlands Housing Market Analysis](#2-netherlands-housing-market-analysis)
3. [The Indian Community in the Netherlands](#3-the-indian-community-in-the-netherlands)
4. [Product Vision and Goals](#4-product-vision-and-goals)
5. [Target Users and Personas](#5-target-users-and-personas)
6. [MVP 1 Feature Specification](#6-mvp-1-feature-specification)
7. [Recommended Technical Architecture](#7-recommended-technical-architecture)
8. [Pages and URL Structure](#8-pages-and-url-structure)
9. [Design System](#9-design-system)
10. [Legal and Compliance](#10-legal-and-compliance)
11. [Success Metrics](#11-success-metrics)
12. [Product Roadmap](#12-product-roadmap)
13. [Development Checklist](#13-development-checklist)
14. [Monetisation Strategy](#14-monetisation-strategy)

---

## 1. Executive Summary

IndianHomes.nl is a community-first real estate listing platform built exclusively for the Indian diaspora in the Netherlands. It addresses a critical gap: a trusted, culturally familiar space where Indians can list and find homes to rent or buy, without the friction, discrimination, and cultural mismatch they routinely encounter on mainstream Dutch platforms like Funda, Pararius, or Kamernet.

The Netherlands is experiencing its worst housing crisis in decades — a shortage of over 410,000 homes as of early 2026. Indians are the second-largest Indian diaspora community in Europe and one of the fastest-growing expat groups in the Netherlands. Yet they face documented discrimination, language barriers, scam risk, and extreme competition when searching for housing. IndianHomes.nl solves this with an English-first, trust-first listing platform tailored entirely to their needs — with Dutch city and province names supported throughout for local accuracy, and full Hindi/Tamil language toggle planned for v2.

A significant and underserved segment within this community is room rentals. Indian students (10,000+ studying in the Netherlands), newly arrived professionals, and single migrants overwhelmingly start with a single room in a shared home. The platform must serve this segment explicitly — with room-specific listing fields, household compatibility preferences, and tenant suitability filters — alongside full apartments and homes for sale.

> **MVP 1 Mission:** Launch a production-ready web app that allows Indian property owners and landlords to post listings for rent or sale — including single rooms in shared homes — and allows Indian home seekers to search, filter, and contact owners directly. The platform must work end-to-end with no gaps in any user journey.

---

## 2. Netherlands Housing Market Analysis

### 2.1 The Housing Crisis at a Glance

The Netherlands is experiencing a structural housing shortage that has worsened year on year. As of early 2026, the deficit stands at approximately 410,000 homes — 4.8% of the total national housing stock. The government's own target is to bring this below 2%, which would require building roughly 226,000 additional homes beyond current pipeline projections. That gap will not close for years.

New housing completions in 2025 reached only 69,200 units against an annual government target of 100,000. Permitting activity also declined 8.4% in 2025 compared to 2024. Combined with nitrogen regulations, grid congestion, and municipal planning cycles averaging 8–12 years, structural supply recovery is not expected until the late 2020s at the earliest.

| Indicator | Figure | Note |
|---|---|---|
| Housing shortage (2026) | ~410,000 homes | 4.8% of housing stock |
| Annual completions (2025) | 69,200 homes | vs. 100,000 government target |
| Social housing wait time | Average 7 years | Higher in Amsterdam, Utrecht |
| Average rent increase (2024) | +5.4% YoY | Largest increase since 1993 |
| Non-regulated rent rise (2025) | +7.7% | Supply down 22% YoY |
| Amsterdam avg. rent (80m²) | €2,300–2,500/month | As of Q1 2026 |
| Applicants per listing | 100–450 | Up from 50–100 in 2022 |
| Net rental homes lost (2025) | −38,000 | 65,000 sold, 27,000 purchased |

### 2.2 The Rental Market Structural Shift

The July 2024 Affordable Rent Act (Wet Betaalbare Huur) introduced rent caps for mid-market housing, triggering a mass exit of private landlords. In 2025, investors sold over 65,000 rental homes while acquiring just 27,000 — a net loss of 38,000 rental units from the market in a single year. Permanent tenancy contracts are now the legal default, making landlords far more selective about tenants.

This has created an extremely competitive market where applicants with foreign names, non-Dutch income histories, and no local network face extreme disadvantage. Indians are documented as one of the communities most affected by both housing scarcity and outright landlord discrimination.

### 2.3 The Room Rental Market

Single room rentals in shared homes form a critical and highly competitive sub-market, particularly in university cities. Key dynamics:

- Rooms in Amsterdam, Delft, Eindhoven, Utrecht, and Groningen are among the most contested listings on any platform
- Indian students arriving at TU Delft, TU Eindhoven, Utrecht University, and University of Groningen frequently struggle to secure accommodation before term begins
- Research by RTL Nieuws found that 1 in 3 people under 35 encountered unfair or fraudulent practices while searching for housing — students and recent arrivals are most vulnerable
- Landlords renting rooms in their own home have legitimate household compatibility preferences (smoking, pets, couples, working hours) that mainstream platforms handle poorly
- A dedicated room rental section for the Indian community — where Indian families renting spare rooms can find trusted Indian tenants — addresses a real, unmet need on both sides

### 2.4 The Buying Market

House prices rose 8.77% in 2024 and continued at a solid pace into 2025. The average home purchase price for internationals was approximately €591,000 in H1 2025, slightly above the Dutch national average of €575,000. The number of internationals buying homes doubled from 0.8% to 1.8% of total transactions between 2020 and 2024, as the rental market became too competitive to navigate.

---

## 3. The Indian Community in the Netherlands

### 3.1 Community Size and Profile

The Netherlands hosts approximately 240,000 people of Indian origin — the second-largest Indian diaspora in Europe after the United Kingdom. This breaks down into two distinct groups:

- **Indo-Surinamese (Hindustani):** ~200,000 people, deeply integrated into Dutch society over multiple generations, primarily concentrated in The Hague and Rotterdam.
- **Recent Indian migrants:** ~89,000+ individuals born in India or with Indian-born parents as of January 2024, a number that has more than tripled since 2014 (when it stood at 27,000).

Indians are primarily concentrated in the Randstad (Amsterdam, The Hague, Rotterdam, Utrecht), with notable clusters in Amstelveen (68 per 1,000 residents), Eindhoven (35 per 1,000), Almere, and Uithoorn.

| Metric | Data |
|---|---|
| Total Indian diaspora | ~240,000 people |
| Recent India-born migrants | ~89,000 (Jan 2024) |
| Population growth (2014–2024) | 3× increase: 27,000 → 89,000 |
| Net migration in 2024 | +4,000 (9,000 arrivals, 5,400 departures) |
| Retention rate (2019 cohort) | 56% still in NL after 4 years |
| Primary cities | Amsterdam, The Hague, Eindhoven, Amstelveen, Rotterdam |
| Dominant employment sector | IT, knowledge workers (ASML, Philips, Booking.com) |
| Indian students in NL | ~10,000 pursuing advanced degrees |
| Top universities | TU Delft, TU Eindhoven, Utrecht, Groningen, Twente |

### 3.2 Why Indians Need This Platform

Indians face a disproportionately difficult housing journey in the Netherlands for several compounding reasons:

**Documented discrimination.** Research confirms that landlords in the Netherlands regularly reject applicants with foreign-sounding names. Multiple studies cite non-Western immigrants as facing the highest barriers in the private rental sector.

**Language barriers.** Most mainstream Dutch platforms (Funda, Pararius, Kamernet) operate primarily in Dutch. New Indian migrants often arrive with limited or zero Dutch proficiency.

**No local network.** Over 40% of Indians who migrate for work lack the local social connections that Dutch people rely on for informal housing leads. Room rentals in particular are often filled through word of mouth.

**Income verification complexity.** Indians on 30% ruling arrangements, inter-company transfers, or recently arrived on a new employment contract often face rejection due to non-standard income structures, even when financially strong.

**Fraud risk.** Research by RTL Nieuws found that 1 in 3 people under 35 encountered unfair or fraudulent practices while searching for housing. Indians unfamiliar with the Dutch system are particularly vulnerable to fake listings and illegal prepayment demands.

**Cultural fit.** Indian landlords renting rooms in their own home actively prefer Indian tenants due to shared expectations around diet (vegetarian households), noise, guests, and property care. There is no platform where this cultural matching can happen transparently and legally.

**Student-specific barriers.** Indian students at Dutch universities face the additional challenge of needing accommodation before arrival, with no ability to view properties in person and no Dutch rental history to show landlords.

> **The Core Opportunity:** There is no dedicated platform where Indian landlords and sellers in the Netherlands — including those renting single rooms in their homes — can find trusted Indian tenants and buyers. This community-to-community match dramatically improves trust, reduces friction, and addresses discrimination by creating a parallel, culturally aligned marketplace.

---

## 4. Product Vision and Goals

### 4.1 Vision Statement

> *IndianHomes.nl is the home of Indians in the Netherlands. A trusted, community-built real estate platform where every listing comes with cultural understanding, and every search leads to a home — whether that is a room, a flat, or a house to call your own.*

### 4.2 MVP 1 Goals

- Launch a fully functional, production-ready listing platform accessible at indianhomes.nl
- Enable Indian property owners to post listings for rental or sale — including single rooms in shared homes — with photos, location, price, and full property details
- Enable Indian home seekers to search, filter, and view listings with direct contact options
- Support all major listing types: rooms, studios, apartments, houses, and commercial spaces
- Support tenant suitability preferences (students, professionals, couples, pets, smoking) on room and shared-property listings
- Deliver a mobile-first responsive experience that works seamlessly on all devices
- Establish a scalable foundation for future versions with payments, chat, AI matching, and verification

### 4.3 What MVP 1 Is NOT

The following are explicitly deferred to later versions:

- In-app messaging or chat system (v2)
- Payment processing or commission model (v2)
- Identity or document verification (v2)
- Agent or broker accounts (v2)
- AI-powered matching or recommendations (v3)
- Mortgage calculator or affordability tools (v3)
- Community forums or social features (v3)
- Native mobile apps (v3)
- Hindi / Tamil language toggle on listing content (v2)

---

## 5. Target Users and Personas

### Persona 1 — The Indian Landlord / Seller

| Attribute | Detail |
|---|---|
| Who they are | Indian professional or long-term resident who owns a property in the Netherlands and wants to rent it out (whole or a room) or sell it |
| Primary goal | Find a trustworthy Indian tenant or buyer quickly, without paying agents 1–2 months' rent in commission |
| Pain points | Mainstream platforms attract too many unsuitable applicants; no culturally aligned way to signal preferences; frustrated with low-quality leads |
| Room rental specific | May rent a spare room in their own home; wants to specify household preferences (vegetarian household, no smoking, professional tenants) |
| Tech comfort | Medium to high |
| Languages | English, Hindi, or regional Indian language |

### Persona 2 — The New Indian Expat

| Attribute | Detail |
|---|---|
| Who they are | IT professional or knowledge worker who has recently arrived in NL or is relocating within 1–3 months, often moving with family |
| Primary goal | Find a reasonably priced home near their workplace before or shortly after arriving |
| Pain points | Cannot view apartments before arriving; rejected due to name or income type; no local network; vulnerable to scams |
| Tech comfort | High; heavy smartphone user, familiar with MagicBricks or NoBroker |
| Languages | English primarily |

### Persona 3 — The Indian Student

| Attribute | Detail |
|---|---|
| Who they are | Indian student at TU Delft, TU Eindhoven, Utrecht, Groningen, or Twente needing accommodation within a student budget |
| Primary goal | Find a room or studio, ideally with an Indian landlord or Indian flatmates, without discrimination |
| Pain points | 1 in 3 international students cannot find housing; high scam risk; no Dutch rental history; cannot view rooms before arriving |
| Key need | Room listings with an explicit student-friendly flag and Indian landlord contact they can trust. Note: this persona's interest in finding Indian flatmates is served in MVP 1 only via room *listings* with suitability tags — dedicated roommate *matching* is an MVP 3 feature (Section 12), not part of MVP 1 scope |
| Tech comfort | Very high |
| Languages | English |

### Persona 4 — The Established Indian Home Seeker

| Attribute | Detail |
|---|---|
| Who they are | Indian who has been in the Netherlands for 3–7 years and is now looking to upgrade housing or transition from renting to buying |
| Primary goal | Find a home to purchase from an Indian seller, or a larger rental with an Indian landlord |
| Pain points | Funda is competitive; mortgage process unfamiliar; estate agents charge high fees; no trusted community resource |
| Tech comfort | High |
| Languages | English, possibly Dutch |

### Persona 5 — The Indian Family Renting a Spare Room

| Attribute | Detail |
|---|---|
| Who they are | Established Indian family with a spare room in their home who wants to rent it to a fellow Indian on a live-in basis |
| Primary goal | Find a compatible Indian tenant — ideally vegetarian, professional, non-smoking — who respects the household |
| Pain points | No platform lets them specify household compatibility preferences in a culturally appropriate way; mainstream platforms attract unsuitable applicants |
| Key need | Full room listing form with household description, existing occupant profile, and tenant preference fields |
| Tech comfort | Medium |
| Languages | English, Hindi, regional language |

---

## 6. MVP 1 Feature Specification

### 6.1 Core User Journeys

There are two primary journeys in MVP 1. Both must work end-to-end with no friction or dead ends.

**Journey 1 — List a Property**

1. User arrives at indianhomes.nl and sees a clear call-to-action to post a property
2. User signs in with Google or email/password via Firebase Auth (account required to post — no guest posting in MVP 1; this keeps listing ownership clean and prevents spam)
3. User selects listing category: Whole Property or Single Room
4. User fills out the appropriate structured listing form via a multi-step wizard (Section 9.8), with progress saved automatically at each step
5. User uploads photos (minimum 1, up to 15)
6. User submits and receives a confirmation email with a link to manage or edit the listing
7. Listing appears on the platform within seconds (auto-approved in MVP 1; manual moderation in v2)

**Journey 2 — Find a Property**

1. User lands on indianhomes.nl and sees a prominent search interface on the homepage
2. User selects Rent or Buy, property type (including Room), location, and price range
3. User views a list or grid of matching listings with photo, title, price, location, and type
4. User applies additional filters (suitable for, pets, smoking, etc.)
5. User clicks a listing and views the full detail page with all photos and contact information
6. User contacts the owner via phone, WhatsApp deep link, or email displayed on the listing

---

### 6.2 Listing Categories

MVP 1 distinguishes between two top-level listing categories. Each has a tailored form.

| Category | Description | Key Difference |
|---|---|---|
| **Whole Property** | Full apartment, house, studio, or commercial space for rent or sale | Standard real estate fields; no household compatibility section |
| **Single Room** | One room in a shared house or the owner's home | Includes shared facilities, existing household description, and tenant suitability preferences |

---

### 6.3 Listing Form — Whole Property

All required fields are validated client-side and server-side.

#### Core Details

| Field | Type / Options | Validation |
|---|---|---|
| Listing type | Rent or Sale | Required, radio |
| Property type | Apartment, House, Studio, Commercial | Required, dropdown |
| Title | Free text, max 100 characters | Required |
| Description | Free text, max 2,000 characters | Required |
| Price | EUR amount | Required, numeric, `inputmode="numeric"` for correct mobile keyboard |
| Price period | Per month (rent) / Total price (sale) | Auto-derived from listing type |
| Available from | Date picker | Required, native `<input type="date">` (Section 9.8) |
| Deposit required | EUR amount or "None" | Optional, `inputmode="numeric"` |

#### Location

| Field | Type / Options | Validation |
|---|---|---|
| City | Dropdown populated from `cities` table — featured cities first, then all others alphabetically | Required |
| Province | Auto-filled from city | Required |
| Neighbourhood / Area | Free text | Optional |
| Street address | Free text | Optional (city always shown publicly) |

#### Property Details

| Field | Type / Options | Validation |
|---|---|---|
| Size (m²) | Numeric | Required, `inputmode="numeric"` |
| Bedrooms | 0 (studio) to 10+ | Required |
| Bathrooms | Numeric | Required, `inputmode="numeric"` |
| Furnishing | Unfurnished / Semi-furnished / Fully furnished | Required |
| Energy label | A+++ to G, or Unknown | Optional |
| Amenities | Multi-select: Parking, Garden, Balcony, Lift, Storage, Dishwasher, Washing machine | Optional |
| Pets allowed | Yes / No / Negotiable | Optional |
| Smoking | Allowed / Not allowed / Outside only | Optional |

#### Owner / Contact

| Field | Type / Options | Validation |
|---|---|---|
| Contact name | Full name | Required |
| Contact phone | International format with WhatsApp flag | Required, `type="tel"` for correct mobile keyboard |
| Contact email | Email address | Required |
| Show email publicly | Toggle (default: on) | Required |
| Languages spoken | Multi-select: English, Hindi, Tamil, Telugu, Kannada, Marathi, Punjabi, Bengali, Malayalam, Other | Optional |
| Community preference | UI labels: "Open to all" / "Indian community preferred" — stored as `community_preference` ENUM: `open` / `indian_preferred` (must match Section 7.3 schema exactly) | Optional, advisory only |

#### Photos

| Field | Type / Options | Validation |
|---|---|---|
| Photos | Upload 1–15 images (JPG/PNG/WebP, max 5MB each before processing) | Required (minimum 1) |
| Photo alt text | Auto-generated as "[Title] — photo [n]" — not manually entered in MVP 1 | Auto |

---

### 6.4 Listing Form — Single Room

Single Room listings include all the fields from the Whole Property form above, with the following changes and additions.

#### Changed Fields

| Field | Change |
|---|---|
| Property type | Fixed as "Room in shared house" — no dropdown needed |
| Listing type | Fixed as "Rent" — rooms are not sold |
| Price period | Always "Per month" |
| Bedrooms | Removed — replaced by "Room size (m²)" |
| Bathrooms | Replaced by "Bathroom: Private / Shared" |

#### Additional Room-Specific Fields

**Shared Facilities**

| Field | Type / Options | Validation |
|---|---|---|
| Room size (m²) | Numeric | Required |
| Bathroom | Private / Shared with other tenants / Shared with owner | Required |
| Kitchen | Shared with other tenants / Shared with owner / Private kitchenette | Required |
| Living room access | Yes, shared / No | Required |
| Separate entrance | Yes / No | Optional |
| Internet included | Yes / No | Optional |
| Bills included | All bills / Some bills / Bills not included | Required |

**Existing Household**

| Field | Type / Options | Validation |
|---|---|---|
| Who currently lives there | Owner lives here / Other tenants only / Will be empty | Required |
| Current occupants | Free text: e.g., "Indian family of 3, vegetarian household" | Optional |
| Total occupants after new tenant | Numeric | Required |
| Household language | Multi-select (same as languages spoken) | Optional |
| Household type | Family / Young professionals / Mixed flatmates / Student house | Optional |

**Tenant Suitability Preferences**

These fields allow the lister to express household compatibility preferences. They are advisory, non-binding, and subject to Dutch anti-discrimination law. (See Section 10 for legal guidance.)

| Field | Type / Options | Validation |
|---|---|---|
| Suitable for | Multi-select: Students, Working professionals, Couples, Single occupancy only, Families | Optional |
| Gender preference | No preference / Male only / Female only | Optional — displayed with legal disclaimer |
| Pets | Allowed / Not allowed / Cats only / Small dogs only | Optional |
| Smoking | Allowed / Not allowed / Outside only | Optional |
| Dietary preference of household | No restriction / Vegetarian household / Vegan household | Optional, informational only |
| Guests policy | Occasional guests welcome / No overnight guests / Flexible | Optional |
| Minimum stay | 1 month / 3 months / 6 months / 12 months | Optional |
| Maximum stay | No maximum / 6 months / 12 months / Other | Optional |

> **Platform note on gender preference:** A "Male only" or "Female only" preference is only shown for Room in shared house listings where the owner also lives in the property. For all other listing types this field is hidden. A legal disclaimer is displayed inline: *"Under Dutch law (AWGB), gender preferences are only permitted in limited household circumstances. By selecting this option you confirm the owner lives at this address. All applicants must be evaluated fairly."*

---

### 6.5 Search and Filter System

Search is one of the most critical functions of the platform. A seeker who cannot quickly find the right listing leaves and does not come back. The search implementation follows a deliberate two-phase strategy that keeps MVP 1 at zero infrastructure cost while providing a clear, low-friction upgrade path as the listing base grows.

#### Search Architecture — Two-Phase Strategy

**Phase 1: MVP 1 — PostgreSQL Full-Text Search (Free)**

In MVP 1, search is powered entirely by PostgreSQL running inside Supabase — the same database already in the stack. A `tsvector` index is built on the `title`, `description`, `city`, and `neighbourhood` columns. All filter queries (listing type, property type, price range, bedrooms, furnishing, available date, room-specific filters) are handled as structured SQL `WHERE` clauses, which PostgreSQL handles fast and reliably for a listing base under ~1,000 properties.

What PostgreSQL full-text search does well at this scale:
- Structured filter queries: instant, reliable, no extra service needed
- Keyword search on title and description: good enough for exact and near-exact matches
- Sort by newest, price ascending, price descending: trivial
- Zero additional cost — included in the Supabase free tier

What it does not do well (acceptable trade-offs for MVP 1):
- No typo tolerance — "Amstlveen" will not match "Amstelveen"
- No instant as-you-type results — search fires on form submit, not keystroke
- No faceted counts — the UI cannot show "Apartments (34) | Houses (12)" without a second query
- Weaker relevance ranking — no learning from what users actually click

> **Decision:** These limitations are acceptable in MVP 1 when the listing base is small and the community is new. A seeker choosing from 50–200 listings in a dropdown-driven interface does not need sub-50ms instant search. The priority is shipping a working product at zero cost.

**Phase 2: MVP 2 — Self-Hosted Typesense (~€4/month)**

Once the listing base reaches ~300+ active listings, search quality becomes a meaningful differentiator. At that point, Typesense is introduced as a dedicated search layer alongside PostgreSQL (which remains the source of truth).

Typesense is open source, ships as a single binary or Docker container, and runs comfortably on a Hetzner CX21 VPS at ~€4/month. There are no per-record or per-search charges. The same open-source engine powers Typesense Cloud, so the behaviour is identical — without the $7–22/month managed hosting cost.

What Typesense adds in MVP 2:
- **Typo tolerance:** "Amstlveen", "apartement", "Eindhovn" all resolve correctly
- **Instant as-you-type results:** results update in under 50ms on every keystroke
- **Faceted filter counts:** show how many listings exist per filter value simultaneously, without extra queries — e.g. "Apartments (34) | Houses (12) | Studios (8)"
- **Native geo-search:** "listings within 10km of Eindhoven city centre" as a first-class query
- **Relevance ranking:** listings that match more filters rank higher; recently updated listings get a recency boost
- **No record or search volume limits:** pay only for the VPS RAM/CPU, regardless of how many listings or searches

**Sync architecture (MVP 2):**

```
Supabase PostgreSQL  →  source of truth (all writes go here first)
        ↓
Next.js API route   →  on every listing create / update / delete,
                        mirror the change to Typesense index
        ↓
Typesense (Hetzner) →  search index (read-only from the frontend)
        ↓
Next.js frontend    →  queries Typesense directly for search results
```

If Typesense ever goes down, data is safe in PostgreSQL and the index can be fully rebuilt from the database in minutes with a single script.

**Cost comparison:**

| Option | Monthly Cost | Typo Tolerance | Instant Search | Faceted Counts | Geo-Search |
|---|---|---|---|---|---|
| PostgreSQL `tsvector` (MVP 1) | €0 | No | No | No | Basic |
| Self-hosted Typesense on Hetzner (MVP 2) | ~€4 | Yes | Yes | Yes | Yes |
| Typesense Cloud (smallest node) | ~$7–22 | Yes | Yes | Yes | Yes |
| Meilisearch Cloud Build plan | $30 | Yes | Yes | Yes | Yes |
| Algolia | Free → expensive fast | Yes | Yes | Yes | Yes |

**Migration trigger:** Begin the Typesense migration when active listings consistently exceed 300, or when seeker feedback explicitly identifies search quality as a pain point — whichever comes first.

#### Filter Specification

Filters are the primary way seekers narrow listings. They must be responsive and update results on form submit in MVP 1. In MVP 2 they update on every filter change (Typesense instant mode).

#### Global Filters (all listing types)

| Filter | Options | UX Note |
|---|---|---|
| Mode | Rent or Buy | Prominent tab or toggle at top |
| Property type | Room, Studio, Apartment, House, Commercial | Checkbox group; "Room" is its own type |
| Location | City dropdown (MVP 1) / free-text with fuzzy match (MVP 2 with Typesense) | Dropdown in MVP 1; typo-tolerant free text in MVP 2 |
| Price range | Min and Max in EUR | Step: €50 for rent, €5,000 for buy |
| Bedrooms | Any, Studio/Room, 1, 2, 3, 4, 5+ | Dropdown |
| Size (m²) | Min and Max | Numeric input |
| Furnishing | Any, Unfurnished, Semi, Fully furnished | Dropdown |
| Available from | On or before date | Date picker |
| Sort order | Newest first / Price: low to high / Price: high to low | Dropdown |

#### Room-Specific Filters (shown when "Room" is selected)

| Filter | Options | UX Note |
|---|---|---|
| Suitable for | Students / Working professionals / Couples / Families | Multi-select checkboxes |
| Pets allowed | Yes / No | Toggle |
| Smoking allowed | Yes / No | Toggle |
| Bills included | Yes / No | Toggle |
| Owner lives there | Yes / No | Toggle — helps seekers understand the living situation |
| Gender preference | No preference / Male / Female | Dropdown — shown with legal note |

#### Language and Community Filter (all listing types)

| Filter | Options | UX Note |
|---|---|---|
| Owner speaks | Multi-select: English, Hindi, Tamil, Telugu, etc. | Useful for new arrivals |

---

### 6.6 Listing Detail Page

The listing detail page must contain everything a prospective tenant or buyer needs to make first contact. No information is hidden behind a login wall in MVP 1.

**All listings:**
- Full photo gallery with thumbnail strip and full-screen / swipe view
- Property title, type badge (Room / Apartment / House / Studio), listing mode badge (Rent / Sale)
- Price prominently displayed with period (per month or total)
- Key stats row: size in m², bedrooms or room size, bathrooms, furnishing status
- Full description text
- Amenities tags (parking, garden, balcony, pets, smoking, etc.)
- Energy label if provided
- Location map (Google Maps Embed or OpenStreetMap — city-level if street not disclosed)
- Owner contact section: name, phone number, WhatsApp deep link, email (if public)
- Languages spoken by owner
- Community preference indicator
- Date posted and listing reference ID
- Share buttons: WhatsApp share, copy link

**Room listings additionally show:**
- Shared facilities summary: bathroom, kitchen, living room, entrance
- Existing household description
- Tenant suitability preferences (with legal disclaimer inline)
- Bills included indicator
- Minimum / maximum stay
- Who currently lives there

---

### 6.7 Homepage

The homepage is the front door and must immediately communicate the platform's purpose, build trust, and drive action.

- Hero section with headline, subheadline, and a prominent search bar with Rent / Buy / Room tabs — hero imagery follows the duotone-treated Dutch housing photography direction specified in Section 9.1, with headline copy that makes the Indian-community positioning explicit in text (e.g. "Find Your Home in the Netherlands — Built for the Indian Community")
- Featured listing types quick-links: Find a Room, Find an Apartment, Find a House, List Your Property
- Recent listings grid: 6–8 most recently posted properties
- City quick-links: Amsterdam, The Hague, Rotterdam, Eindhoven, Utrecht, Amstelveen, Delft, Groningen — each with a small skyline silhouette icon (Section 9.5) for instant visual recognition
- How it works: 3-step explainer for listers and 3-step explainer for seekers
- Trust indicators: total listings count, cities covered, community size
- Call-to-action banner: "Post Your Property for Free — Room or Full Home"
- Footer: About, Contact, Terms, Privacy Policy, Sitemap

---

### 6.8 User Accounts

- **Sign in with Google** via Firebase Auth — primary path, one tap, no password required
- Register with email and password via Firebase Auth — fallback for users who prefer it
- Login and logout
- My Listings dashboard: view, edit, mark as let/sold, delete own listings
- Password reset via email — sent from Firebase, branded as `noreply@indianhomes.nl` at no extra cost
- Account deletion removes all listings and personal data
- No platform-side notification when a seeker contacts via WhatsApp or phone (contact goes directly between parties) — a "listing views this week" digest email is deferred to MVP 2

---

### 6.9 Admin Panel

A basic admin panel is required from day one.

- View all listings with status: active, expired, flagged, rejected
- Approve, reject, or delete listings
- View user accounts and contact details
- Flag and remove listings reported by users
- Mark listings as expired or fraudulent
- Basic analytics: total listings, active listings by type, listings by city, new listings per day

**Admin role assignment (MVP 1):**

There is no in-app admin invite flow in MVP 1 — this is intentional, as only the founder will hold admin access at launch. The `is_admin` flag is set manually via a one-line SQL update in the Supabase dashboard SQL editor:

```sql
UPDATE users SET is_admin = true WHERE email = 'founder@indianhomes.nl';
```

This is documented here explicitly so it is a deliberate, auditable action rather than an undocumented manual step. If a second admin or moderator is added in MVP 2, a proper admin invite flow with audit logging (who granted admin, when) should be built at that point — not before, since it would be unused complexity in MVP 1.

---

### 6.10 Listing Expiry and Renewal

Listings expire automatically 90 days after posting. The following behaviour is required:

**Expiry warnings:**
- 7 days before expiry: email sent to owner — "Your listing expires in 7 days. Click here to renew."
- 1 day before expiry: final reminder email sent

**On expiry:**
- Listing `status` changes from `active` to `expired` (automated via a daily cron job or Supabase pg_cron)
- Listing is removed from all search results and the public listing index
- Listing detail page shows a "This listing has expired" message rather than a 404 — the page remains accessible via direct link for 30 days after expiry, then permanently removed
- Owner sees the expired listing in their My Listings dashboard with a "Renew" button

**Renewal:**
- Owner clicks Renew — listing status resets to `active`, `expires_at` is set to 90 days from renewal date, `updated_at` is refreshed
- Renewal is free and unlimited in MVP 1
- Renewed listing is treated as updated (not re-posted) — it does not jump to the top of "newest first" sort

**Cron job spec:**
- Run daily at 02:00 UTC
- Query: `UPDATE listings SET status = 'expired' WHERE expires_at < NOW() AND status = 'active'`
- After update: fetch all newly expired listings and send expiry notification emails via Resend

---

### 6.11 Phone Number Handling and WhatsApp Link Generation

The WhatsApp contact button is the single most important conversion action on the platform. Phone numbers must be stored and rendered correctly.

**Input validation on listing form:**
- Accept formats: `06XXXXXXXX` (Dutch mobile), `+31 6 XXXXXXXX`, `+91 XXXXXXXXXX` (Indian), and any international `+XX` format
- Strip all spaces, dashes, and brackets on save
- Store in E.164 format: `+316XXXXXXXX`, `+91XXXXXXXXXX`, etc.
- If user enters `06XXXXXXXX` (Dutch shorthand), auto-convert to `+316XXXXXXXX` on save
- Reject numbers shorter than 7 digits or longer than 15 digits
- Show inline validation error if format is unrecognisable

**WhatsApp deep link generation:**
- Format: `https://wa.me/[E164_number_without_plus]`
- Example: `+31612345678` → `https://wa.me/31612345678`
- Pre-fill message (optional): `https://wa.me/31612345678?text=Hi%2C+I+saw+your+listing+on+IndianHomes.nl`
- The pre-filled message saves the seeker time and signals to the lister where the contact came from

**Display on listing detail page:**
- Show formatted number for human readability: `+31 6 12 34 56 78`
- Primary button: "WhatsApp" (opens wa.me link)
- Secondary: "Call" (opens `tel:` link for mobile users)
- Email shown as plain text or mailto link if `show_email` is true

---

### 6.12 Listing Status State Machine

| Status | Meaning | Who can trigger | Visible to seekers |
|---|---|---|---|
| `active` | Live and searchable | Auto on post; owner via Renew | Yes — full listing |
| `let_sold` | Owner marked as let or sold | Owner only | No — removed from search; detail page shows "No longer available" banner |
| `expired` | 90 days elapsed | Automatic (cron) | No — removed from search; detail page shows "This listing has expired" for 30 days |
| `rejected` | Admin removed for policy violation | Admin only | No — 404 on detail page; owner notified by email with reason |

**Transition rules:**
- `active` → `let_sold`: owner action from My Listings dashboard
- `active` → `expired`: automatic cron only
- `active` → `rejected`: admin only
- `let_sold` → `active`: owner can reactivate within the original 90-day window; if window has passed, reactivating creates a new 90-day expiry
- `expired` → `active`: owner clicks Renew; new 90-day window starts
- `rejected` → any: only admin can reinstate; owner must contact support

**Email notifications triggered by status changes:**
- `active` → `let_sold`: confirmation email to owner ("Your listing has been marked as let/sold")
- `active` → `expired`: expiry notification email (see Section 6.10)
- `active` → `rejected`: rejection email to owner with reason and appeal instructions

---

### 6.13 Photo Upload and Management

**Upload constraints:**
- Minimum 1 photo, maximum 15 photos per listing
- Accepted formats: JPG, PNG, WebP
- Maximum file size per photo: 5MB before processing
- Minimum dimensions: 400×300px (reject smaller images with inline error)

**Server-side processing on upload (via Next.js API route):**
1. Receive uploaded file
2. Resize to maximum 1600px on the longest edge (maintain aspect ratio) — use `sharp` library
3. Convert to WebP format at 85% quality
4. Generate a 400×300px thumbnail (WebP) for listing cards
5. Store both versions in Supabase Storage: `listings/{listing_id}/full/{filename}.webp` and `listings/{listing_id}/thumb/{filename}.webp`
6. Save public URLs to `listing_photos` table
7. Return CDN URLs to frontend

**Photo management on listing form (new listing):**
- Drag-and-drop upload zone with file picker fallback
- Thumbnail preview grid after upload
- Reorder by drag-and-drop (updates `sort_order`)
- Click to set as primary photo (star icon on hover)
- Click × to remove a photo
- Upload progress indicator per file

**Photo management on edit listing:**
- Existing photos shown in current order with same drag/reorder/delete controls
- New photos can be added (up to the 15-photo limit)
- Deleting a photo removes it from Supabase Storage and the `listing_photos` table immediately
- If the primary photo is deleted, the next photo in sort_order automatically becomes primary
- Changes to photo order and primary photo are saved independently of the main listing form (auto-save on change, no separate submit needed)

---

## 7. Recommended Technical Architecture

### 7.1 Guiding Principles

- **Simple over clever:** use well-supported, community-proven technologies maintainable by a solo or small team
- **Fast shipping:** choose a stack that enables rapid iteration without excessive boilerplate
- **SEO-first:** listings must be indexable by Google from day one — server-side rendering is mandatory
- **Mobile-first:** the majority of Indian expat users will access via smartphone
- **Scalable foundation:** the architecture must support v2 features (payments, chat, verification) without a full rewrite

### 7.2 Recommended Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) with TypeScript |
| Styling | Tailwind CSS with custom colour tokens |
| Backend / API | Next.js API Routes (or separate Fastify API if needed) |
| Database | PostgreSQL via Supabase (hosted, EU region, free tier) |
| File storage | Supabase Storage or Cloudflare R2 for property images |
| Authentication | Firebase Auth (Google Sign-In + email/password) |
| Map integration | Google Maps Embed API or Leaflet.js + OpenStreetMap |
| Transactional email | Resend.com |
| Hosting | Vercel (Next.js native, global edge CDN, free tier for MVP) |
| Domain | indianhomes.nl (already purchased) |
| Search (MVP 1) | PostgreSQL full-text search with `tsvector` — free, already in Supabase |
| Search (MVP 2) | Self-hosted Typesense on Hetzner VPS (~€4/month) — typo tolerance, faceted counts, geo-search, instant results |
| Analytics | Plausible Analytics (privacy-friendly, GDPR compliant) |
| Error monitoring | Sentry (free tier) |

### 7.2a Rate Limiting and Spam Prevention

The platform must be protected against spam listings and abuse from day one.

**Listing submission limits (enforced server-side):**
- Maximum 5 active listings per user account at any one time in MVP 1
- Maximum 3 new listings posted per user per 24-hour period
- If limit is exceeded, return a clear error: "You have reached the maximum number of active listings. Please mark existing listings as let/sold before posting new ones."

**Bot and spam protection:**
- Integrate [hCaptcha](https://www.hcaptcha.com/) (free tier, GDPR-compliant, privacy-friendly alternative to reCAPTCHA) on the listing submission form
- hCaptcha challenge appears only on form submit, not on page load — minimal friction for genuine users
- hCaptcha token verified server-side on the API route before the listing is saved

**Duplicate detection:**
- On listing submit, check for existing `active` listings from the same user with the same `city` + `price` + `property_type` posted within the last 7 days
- If a probable duplicate is found, show a warning: "You may have already posted a similar listing. Are you sure you want to post again?" with Confirm / Cancel options
- Do not hard-block — warn and let the user decide

**Image abuse:**
- Reject uploads where the file has a valid image extension but is not a valid image (check magic bytes server-side)
- Maximum upload rate: 15 photos per listing submission, no bulk API access without auth

### 7.2b Authentication Architecture — Firebase + Supabase

Firebase Auth handles all authentication. Supabase handles the database and file storage. They run as independent services and are connected via JWT verification in the Next.js API layer.

**Authentication flow:**

1. User signs in via Firebase Auth (Google one-tap or email/password)
2. Firebase returns a signed JWT (ID token) to the frontend
3. The frontend sends the JWT as a `Bearer` token on every API request
4. Next.js API routes verify the JWT using the **Firebase Admin SDK** server-side
5. On verified identity, the API reads and writes to Supabase PostgreSQL as normal

**Why not use Supabase Auth?**

| Reason | Detail |
|---|---|
| Custom domain email cost | Supabase charges $10/month extra for custom domain auth emails (e.g. `noreply@indianhomes.nl`). Firebase does this for free. |
| Google Sign-In simplicity | Firebase Auth has first-class Google Sign-In with zero configuration. It is a Google product — the integration is seamless. |
| Free tier generosity | Firebase Auth free tier supports unlimited users with no per-user cost. |
| Independent scaling | Auth and DB scale independently. Firebase handles auth spikes; Supabase handles data. |

**Firebase Auth configuration (Firebase Console):**

- Enable **Google** provider (primary)
- Enable **Email/Password** provider (fallback)
- Set custom sender name: `IndianHomes.nl`
- Set custom sender address: `noreply@indianhomes.nl` (via Firebase's free SMTP customisation)
- Set email templates for: verification, password reset, email change

**Supabase RLS with Firebase JWT:**

Supabase Row Level Security can be configured to accept Firebase JWTs by setting the JWT secret in Supabase to match the Firebase project's public key. This allows RLS policies to use `auth.uid()` directly from the Firebase token, keeping data access rules enforced at the database level.

**Users table sync:**

On first sign-in, the Next.js API creates a record in the Supabase `users` table using the Firebase UID as the primary key, capturing the user's name, email, and photo URL from the Google profile.

```
users.id = Firebase UID (string, not UUID)
```

### 7.2c Authorization Model

Authentication (Section 7.2b) proves *who* a user is. Authorization governs *what* they are allowed to do, and must be enforced independently on every API route — never inferred from the frontend UI alone, since UI restrictions can always be bypassed by calling the API directly.

**The rule for every protected API route:**

| Action | Required check |
|---|---|
| Create a listing | User must be authenticated (any valid Firebase JWT) |
| Edit a listing | User must be authenticated **AND** `listings.user_id` must equal the authenticated user's UID |
| Delete a listing | Same as edit — ownership check is mandatory, not optional |
| Mark listing as let/sold | Same as edit |
| View `/account/my-listings` | User must be authenticated; query is automatically scoped to `WHERE user_id = [authenticated UID]` |
| Access any `/admin` route or API | User must be authenticated **AND** `users.is_admin = true` |
| Report a listing | No authentication required (reporting must remain low-friction) |
| View a listing detail page | No authentication required (public) |

**Implementation requirement:** Every API route handler that mutates data must independently re-fetch the resource and verify ownership server-side, even if the frontend only shows the edit button to the listing's owner. This prevents the IDOR (Insecure Direct Object Reference) vulnerability class, where a malicious user changes a listing ID in an API request to act on a listing they do not own.

**Supabase RLS as a second enforcement layer:** In addition to ownership checks in the Next.js API layer, Row Level Security policies on the `listings` table should independently enforce `user_id = auth.uid()` for UPDATE and DELETE operations. This gives defense in depth — even if an API route has a bug, the database itself refuses the unauthorized write.

### 7.2d Input Sanitization

All user-generated free-text fields (`title`, `description`, `existing_occupants_description`, `contact_name`, report `details`) are rendered back to other users' browsers and must be treated as untrusted input.

- **XSS protection:** React/Next.js escapes all text content by default when rendered via standard JSX (`{variable}`). `dangerouslySetInnerHTML` must never be used to render any user-submitted field. This is a hard rule, not a suggestion.
- **Server-side validation:** All text fields are validated server-side for length limits (per the field specs in Section 6.3/6.4) regardless of client-side validation, since client-side checks can be bypassed by calling the API directly.
- **No HTML or Markdown rendering:** Listing descriptions are plain text only in MVP 1. No rich text formatting is parsed or rendered, which eliminates an entire class of injection risk. Rich text formatting (if ever wanted) is a explicit MVP 3+ decision, not a default.

### 7.2e CORS and API Exposure Boundary

- Next.js API routes (`/api/*`) are intended to be called only from the indianhomes.nl frontend itself. No public third-party API access is offered in MVP 1.
- Default Next.js same-origin behavior is sufficient; no additional CORS configuration is required unless a mobile app (MVP 3+) needs direct API access, at which point explicit CORS rules scoped to known origins must be added.
- **Typesense API key scoping (MVP 2):** When the frontend queries Typesense directly per the sync architecture in Section 6.5, it must use a scoped, read-only "search-only" API key generated via Typesense's key-scoping feature — never the admin API key, which has write and delete access to the entire index. The admin key is used only server-side, in the Next.js API route that syncs writes from Supabase to Typesense.

### 7.2f Session and Token Refresh Behavior

Firebase ID tokens expire after 1 hour by default. The Firebase client SDK handles silent, automatic token refresh in the background — this requires no custom implementation, but must be confirmed as the intended behavior: users remain signed in indefinitely (until they explicitly log out or clear browser data), and are never unexpectedly logged out mid-session due to token expiry. The frontend should always use the Firebase SDK's `onIdTokenChanged` listener (not a one-time token fetch) to ensure API requests always carry a valid, current token.

### 7.3 Database Schema

#### `users`

| Column | Type / Notes |
|---|---|
| id | Text (Firebase UID), primary key |
| email | Unique, required |
| name | Text, required |
| phone | Text, optional |
| created_at | Timestamp |
| is_admin | Boolean, default false |

#### `listings`

| Column | Type / Notes |
|---|---|
| id | UUID, primary key |
| short_id | Text (first 6 chars of UUID) — used in SEO-friendly URL |
| slug | Text — generated from title + city on save, e.g. `2-bed-apartment-amsterdam` |
| user_id | FK → users |
| listing_category | ENUM: whole_property, room |
| listing_type | ENUM: rent, sale |
| property_type | ENUM: apartment, house, studio, room, commercial |
| title | Text, max 100 chars |
| description | Text, max 2,000 chars |
| price | Integer (EUR cents) |
| city | Text |
| province | Text |
| neighbourhood | Text, optional |
| street_address | Text, optional |
| lat / lng | Decimal, optional |
| size_sqm | Integer |
| bedrooms | Integer, nullable (null for rooms) |
| bathrooms | Integer |
| room_size_sqm | Integer, nullable (rooms only) |
| bathroom_type | ENUM: private, shared_tenants, shared_owner — nullable |
| kitchen_type | ENUM: shared_tenants, shared_owner, private — nullable |
| living_room_access | Boolean, nullable |
| separate_entrance | Boolean, nullable |
| internet_included | Boolean, nullable |
| bills_included | ENUM: all, some, none — nullable |
| furnishing | ENUM: unfurnished, semi, fully |
| available_from | Date |
| deposit | Integer, optional |
| energy_label | Text, optional |
| amenities | JSONB array |
| pets_allowed | ENUM: yes, no, cats_only, small_dogs, negotiable |
| smoking | ENUM: allowed, not_allowed, outside_only |
| household_type | ENUM: family, professionals, mixed, students — nullable |
| owner_lives_here | Boolean, nullable |
| existing_occupants_description | Text, nullable |
| total_occupants_after | Integer, nullable |
| household_languages | JSONB array, nullable |
| suitable_for | JSONB array (students, professionals, couples, families, single_only) |
| gender_preference | ENUM: no_preference, male_only, female_only — nullable |
| dietary_preference | ENUM: no_restriction, vegetarian, vegan — nullable |
| guests_policy | ENUM: welcome, no_overnight, flexible — nullable |
| min_stay_months | Integer, nullable |
| max_stay_months | Integer, nullable |
| languages_spoken | JSONB array |
| community_preference | ENUM: `open`, `indian_preferred` — UI labels "Open to all" / "Indian community preferred" respectively (Section 6.3) |
| contact_name | Text |
| contact_phone | Text |
| contact_email | Text |
| show_email | Boolean |
| status | ENUM: active, let_sold, expired, rejected |
| created_at | Timestamp |
| updated_at | Timestamp — auto-updated via PostgreSQL trigger `set_updated_at` on every row change |
| expires_at | Timestamp (90 days from created_at) |

#### `listing_photos`

| Column | Type / Notes |
|---|---|
| id | UUID, primary key |
| listing_id | FK → listings, `ON DELETE CASCADE` |
| storage_path | Text (path in Supabase Storage / R2) |
| url | Text (public CDN URL) |
| thumb_url | Text (thumbnail CDN URL — 400×300px WebP) |
| sort_order | Integer |
| is_primary | Boolean |
| created_at | Timestamp |

> **Storage cleanup requirement:** `ON DELETE CASCADE` removes the database row automatically when a listing is deleted, but it does **not** delete the actual file from Supabase Storage — database rows and storage objects are independent. The listing deletion API route must explicitly call the Supabase Storage delete API for every associated photo (both `full` and `thumb` versions) **before** or **immediately after** deleting the database rows, to prevent orphaned files accumulating storage cost indefinitely. This must be implemented as part of the delete-listing flow, not assumed to happen automatically.

#### `listing_reports`

| Column | Type / Notes |
|---|---|
| id | UUID, primary key |
| listing_id | FK → listings, `ON DELETE SET NULL`, nullable — preserved for audit trail even if listing is deleted |
| listing_snapshot | Text, optional — title/city captured at report time, so the report remains meaningful if the listing is later deleted |
| reporter_email | Text (not required to be logged in to report) |
| reason | ENUM: fraud, scam, discrimination, incorrect_info, duplicate, other |
| details | Text, optional free text, max 500 chars |
| status | ENUM: pending, reviewed, actioned, dismissed |
| admin_notes | Text, optional |
| created_at | Timestamp |
| reviewed_at | Timestamp, nullable |

#### `cities`

| Column | Type / Notes |
|---|---|
| id | Integer, primary key |
| name | Text — English name (e.g. "Amsterdam") |
| name_nl | Text — Dutch name (e.g. "Amsterdam") |
| province | Text (e.g. "Noord-Holland") |
| is_featured | Boolean — true for the ~20 cities most relevant to the Indian community |
| sort_order | Integer — featured cities appear first in dropdowns |

### 7.4 Infrastructure Cost at Launch

| Service | Plan | Cost |
|---|---|---|
| Vercel | Hobby | Free |
| Supabase | Free tier (500MB DB, 1GB storage, 50k MAU) | Free |
| Firebase Auth | Spark (free) — unlimited users, Google Sign-In, custom email domain | Free |
| Resend | Free tier (3,000 emails/month) | Free |
| Google Maps Embed | Free | Free |
| Plausible Analytics | Hobby (or Umami self-hosted) | Free / ~€9/month |
| **Total** | | **€0–9/month at launch** |

Natural upgrade path when traffic grows: Vercel Pro (€20/month) + Supabase Pro (€25/month). Firebase Auth remains on the free Spark plan indefinitely.

**MVP 2 search upgrade:** Add a Hetzner CX21 VPS at ~€4/month running self-hosted Typesense. Total infrastructure cost becomes ~€4–13/month.

### 7.5 Concurrency Capacity — Reality Check

A common question when evaluating any web app is "how many concurrent users can this actually handle?" This section gives honest, specific numbers for the stack as specced, so capacity is understood before launch rather than discovered during a traffic spike.

**Concurrent users vs. total users:** Concurrency means people hitting the platform at the same literal moment — it is a much smaller number than monthly active users, since real visits are spread across the day rather than arriving all at once.

| Layer | Comfortable concurrent capacity | Notes |
|---|---|---|
| Vercel (Next.js, Hobby/Pro) | 1,000+ concurrent | Serverless edge functions auto-scale; never the bottleneck for this platform |
| Supabase Free tier (no pooling) | ~50–80 concurrent | Free tier caps direct Postgres connections around 60 — this is the real ceiling at launch |
| Supabase Free/Pro tier (PgBouncer pooling enabled) | ~200–300 concurrent | Built-in connection pooler, free on all tiers — a configuration toggle, not new infrastructure |
| Firebase Auth | Thousands+ | Not a bottleneck at any realistic scale for this platform |
| Self-hosted Typesense (MVP 2) | Thousands+ | A single Hetzner VPS handles this comfortably |

**The practical takeaway:**

- With Supabase **Pro tier (€25/month) and connection pooling enabled**, the platform comfortably supports **200–300 concurrent users** without any code changes.
- This roughly translates to **several thousand active users per hour** and **tens of thousands of monthly active users** under normal browsing patterns (not everyone arriving in the same second).
- For a geographically focused community platform — Indians in the Netherlands — this ceiling is very likely far beyond what the platform will see even at strong success. It would take a genuinely significant press moment or viral spike to threaten it, at which point it is a Supabase compute add-on upgrade, not an architecture rework.

> **Action item:** Enable PgBouncer connection pooling in Supabase connection settings from day one, regardless of current traffic. It is free on all tiers and there is no downside to having it on early — it simply removes a ceiling before it is ever tested.

---

### 7.6 Reliability, Operations, and Data Lifecycle

This section addresses what happens when things go wrong, how schema and code changes are safely shipped, and how data is retained — the operational concerns that sit alongside the feature spec but are equally required for a production-ready launch.

#### 7.6.1 Backup and Disaster Recovery

- **Database backups:** Supabase Pro tier includes automatic daily backups with 7-day point-in-time recovery. This must be confirmed as enabled in the Supabase project settings before launch — it is not automatic on the Free tier.
- **Restore procedure:** Before launch, perform one test restore from a backup to a separate Supabase project to confirm the process works and is understood. An untested backup is not a real backup.
- **Storage backup:** Supabase Storage (photos) is not covered by database point-in-time recovery. If photo loss is a concern at scale, periodic export to a secondary location (e.g. a scheduled sync to Cloudflare R2) should be evaluated in MVP 2 — acceptable to defer for MVP 1 given low data volume.

#### 7.6.2 Partial Failure Handling in Listing Creation

The listing creation flow has three steps: save listing record → upload photos → send confirmation email. Each step can fail independently, and the system must behave predictably when one does.

| Failure point | Required behavior |
|---|---|
| Listing record fails to save | Show form error, no partial data persisted, user can resubmit |
| Listing saves, but one or more photo uploads fail | Listing is still created with whichever photos succeeded (minimum 1 required before allowing final submit); user sees a clear warning ("3 of 5 photos uploaded — you can add the rest from your listing dashboard") rather than a silent failure |
| Listing and photos save, but confirmation email fails | Listing remains live regardless — email failure must never block or roll back a successful listing creation; the email is retried once automatically (via Resend's built-in retry) and the failure is logged to Sentry for visibility, but is not user-blocking |

**Principle:** A failure in a non-critical step (email) must never undo a successful critical step (listing creation). Photo upload failures must degrade gracefully, not silently lose user data.

#### 7.6.3 Idempotency on Listing Submission

To prevent duplicate listings from double-clicks or slow network retries:

- **Client-side:** Submit button is disabled immediately on click, re-enabled only on error response
- **Server-side:** The listing creation API route accepts an idempotency key (a UUID generated client-side once per form session) — if a request with the same key is received twice, the second request returns the already-created listing rather than creating a duplicate

#### 7.6.4 Monitoring and Alerting

Beyond Sentry's application error capture, the following must be in place before launch:

- **Uptime monitoring:** A free external uptime monitor (e.g. UptimeRobot or Better Uptime free tier) pinging indianhomes.nl every 5 minutes, with email/SMS alert to the founder on downtime — this catches outages even when no application error is thrown
- **Cron job failure alerting:** The daily listing-expiry cron job (Section 6.10) must log its execution result; if it fails to run or throws an error, this should trigger a Sentry alert, not fail silently — a silently broken expiry job means listings never expire and stale data accumulates unnoticed
- **Resource threshold alerts:** Supabase dashboard alerts (built-in, free) should be enabled for database storage approaching capacity and connection pool exhaustion, so capacity issues are caught before they cause outages

#### 7.6.5 Staging and Preview Environment Workflow

- Every code change is pushed to a feature branch and opened as a pull request on GitHub
- Vercel automatically builds a **preview deployment** for every branch/PR — this is free and automatic with the Vercel + GitHub integration, requiring no extra setup
- Changes are verified on the preview URL before merging to `main`, which triggers the production deployment
- For database schema changes specifically, a separate Supabase **staging project** (free tier) mirroring production schema should be used to test migrations before applying them to production — this is especially important once real user data exists, since a bad migration on production is much harder to recover from than on a disposable staging database

#### 7.6.6 Database Migration Strategy

Schema changes must never be made by hand-editing tables directly in the Supabase dashboard once the platform is live with real data — this is untracked, unrecoverable, and impossible to replicate across staging and production.

- Use a migration tool with version-controlled migration files: **Supabase CLI migrations** (`supabase migration new`) is the natural choice since the stack already uses Supabase, and keeps migrations in the same Git repository as the application code
- Every schema change ships as a numbered migration file, committed to Git, and applied via `supabase db push`
- This gives a complete, auditable history of every schema change and allows staging and production to be kept in sync reliably

#### 7.6.7 API Contract Stability

Next.js API routes under `/api/*` should be treated as an internal but stable contract that the frontend depends on. This is not urgent for MVP 1 (no external consumers exist yet), but is worth establishing as a practice early: avoid silently changing the shape of API responses (renaming or removing fields) without updating all frontend call sites in the same change. This becomes critical once a native mobile app is built (MVP 3 roadmap item), since a mobile app cannot be redeployed as instantly as a web frontend when an API contract breaks.

#### 7.6.8 Data Retention Policy

| Data | Retention behavior |
|---|---|
| User account, on deletion | Hard-deleted immediately, along with all owned listings and their photos (per GDPR right to erasure) |
| Listing, on owner deletion | Hard-deleted immediately, including all associated `listing_photos` rows and Storage files (see Section 7.3 storage cleanup requirement) |
| Listing, on expiry | Soft state only (`status = 'expired'`) — not deleted; detail page remains accessible for 30 days, then the listing record is hard-deleted by a separate monthly cleanup job |
| `listing_reports` | Retained even if the reported listing is later deleted — the report row's `listing_id` foreign key is set to `NULL` on listing deletion (not cascade-deleted) so the report remains in the admin audit trail with a note that the original listing no longer exists |
| Accidental account deletion | No grace period in MVP 1 — deletion is immediate and irreversible, consistent with strict GDPR compliance. The account deletion confirmation dialog must clearly state this is permanent and cannot be undone, with the user required to type "DELETE" or similar to confirm, reducing the risk of accidental clicks |

---

## 8. Pages and URL Structure

| Route | Purpose |
|---|---|
| `/` | Homepage — hero search, recent listings, city quick-links |
| `/listings` | Search results — all listing types with full filter panel |
| `/listings/rooms` | Filtered view: rooms only, with room-specific filters prominent |
| `/listings/[slug]-[short-id]` | Individual listing detail page — e.g. `/listings/2-bed-apartment-amsterdam-a1b2c3` (slug generated from title + city; short-id is first 6 chars of UUID) |
| `/listings/new` | Post a new listing — step 1: choose Whole Property or Room |
| `/listings/new/property` | Whole property listing form |
| `/listings/new/room` | Room listing form |
| `/listings/[id]/edit` | Edit an existing listing (auth required) |
| `/account/register` | New user registration |
| `/account/login` | Login page |
| `/account/forgot-password` | Password reset request |
| `/account/my-listings` | Dashboard: manage own listings (auth required) |
| `/admin` | Admin panel (admin role required) |
| `/about` | About IndianHomes.nl |
| `/contact` | Contact form or email |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy (GDPR compliant) |
| `/listing-guidelines` | Listing guidelines — what is allowed, AWGB rules, fraud prevention tips |
| `/sitemap.xml` | Auto-generated XML sitemap for SEO |

---

## 9. Design System

### 9.1 Brand Identity — What "Indian Community + Dutch Real Estate" Actually Means Visually

The platform's visual identity must make one thing unmistakably clear within seconds of landing on the page: **this is real estate in the Netherlands, built for the Indian community.** This is not a stylistic fusion or a blended aesthetic — it is two distinct, recognizable signals working together: the product content is genuinely Dutch (real Dutch housing, real Dutch cities), and the brand wrapper around that content is unmistakably warm and Indian.

**The guiding principle:** Dutch design discipline carries the interface (grids, restraint, clarity, minimal ornamentation — the actual Dutch graphic design tradition of precision and unfussiness). Indian warmth comes through color, photography choices, and copy — not through literal cultural motifs layered onto every element, which risks reading as costume rather than brand. One small, tasteful textile-pattern accent is used as a signature detail, kept deliberately restrained.

**Concrete execution:**

| Element | Dutch signal | Indian signal | How they combine |
|---|---|---|---|
| Hero imagery | Real Dutch housing stock — canal houses, gabled rooflines, characteristic NL brick architecture, actual platform listing photos | Warm saffron-tinted duotone or gradient overlay treatment | A real, recognizable Dutch housing photo treated with a warm color grade — not a generic stock photo, not a literal Indian motif overlaid on a house |
| Iconography | Minimal, geometric, line-based icons (Dutch design tradition: precise, grid-based, unornamented — Lucide or Phosphor icon sets fit this) | Icon accent color in saffron/marigold, never default grey/blue | Icons stay functionally Dutch-minimal in form; color makes them feel warm rather than corporate |
| Typography | Clean, restrained sans-serif with generous whitespace (Dutch typographic tradition favors clarity over decoration) | — (Devanagari/Indic script support is an accessibility requirement — see Section 9.6 — not a branding device) | Inter retained as primary typeface; spacing and hierarchy follow Dutch restraint, not maximalism |
| City/location visuals | Recognizable city skyline silhouettes used in city quick-links — e.g. Amsterdam canal houses, Utrecht's Dom Tower, Rotterdam's modern skyline | — | A small skyline silhouette next to a city name makes the "Dutch real estate" signal instant and requires no caption |
| Accent pattern | — | A restrained geometric border pattern inspired by Indian textile/block-print geometry — used only as a thin accent: e.g. a 3–4px top border on cards, or a subtle footer background texture | Never used as a dominant pattern or background fill — this keeps it reading as an intentional brand signature, not decoration |
| Hero headline | — | — | Copy carries equal weight to imagery: e.g. "Find Your Home in the Netherlands — Built for the Indian Community." This makes the positioning unambiguous in text alone, which matters for slow connections (images load last) and for screen readers |

> **Design direction note for whoever builds this:** When in doubt, default to Dutch restraint in layout and structure, and Indian warmth in color and tone. Avoid combining literal motifs from both cultures into single elements (e.g. an icon that is "half rangoli half Delft tile") — this consistently reads as confused rather than intentional. The product (Dutch housing listings) is inherently Dutch in content; the brand wrapper signals Indian community.

### 9.2 Colour Palette

| Token | Hex | Usage | Contrast note |
|---|---|---|---|
| Primary Orange (Saffron) | `#E85D04` | Main CTAs, headers, badges, accents | Passes WCAG AA for large text (18px+/bold) on white; **does not** pass for small body text on white — use Dark Navy for small text, reserve saffron for large/bold elements and backgrounds with white text |
| Deep Green | `#006B35` | Trust indicators, success states, availability badges | Passes WCAG AA for normal text on white |
| Dark Navy | `#1A1A2E` | Body text, headings | Passes WCAG AAA on white and Light Grey backgrounds |
| Mid Grey | `#555555` | Secondary text, descriptions | Passes WCAG AA on white |
| Light Grey | `#F5F5F5` | Page background, card backgrounds | Background only, not used for text |
| Orange Light | `#FFF3ED` | Callout boxes, highlighted sections | Background only — text within must use Dark Navy, never Saffron |
| White | `#FFFFFF` | Cards, modals, form backgrounds | — |
| Error Red | `#C0392B` | Validation errors, flagged content | Passes WCAG AA on white |
| WhatsApp Green | `#25D366` | WhatsApp CTA button only — matches WhatsApp's own brand color for instant recognition | Used with white text/icon only |
| Textile Accent | `#D4A574` (warm terracotta/marigold) | Subtle geometric border accent only (Section 9.1) — never used for text or large fills | Decorative use only, not a functional color |

### 9.3 Typography

| Element | Specification |
|---|---|
| Primary font | Inter (Google Fonts) |
| Heading weight | 700 (Bold) |
| Body weight | 400 (Regular) and 500 (Medium) |
| Base size | 16px (1rem) |
| H1 | 2.5rem / 40px |
| H2 | 2rem / 32px |
| H3 | 1.5rem / 24px |
| Small / Caption | 0.875rem / 14px |
| Fallback stack | `Inter, "Noto Sans", -apple-system, system-ui, sans-serif` — `Noto Sans` (Google Fonts, free) provides Devanagari, Tamil, Telugu, Kannada, and Bengali script coverage as a safety net, ensuring any future or incidental rendering of native-script text (e.g. a user typing a Hindi word into a free-text field) does not fall back to an inconsistent system font |

### 9.4 Responsive Breakpoints

All components and layouts are built against these four breakpoints. Mobile-first means base styles target the smallest breakpoint, with progressive enhancement upward.

| Breakpoint | Width | Primary target |
|---|---|---|
| `sm` | 375px+ | Small mobile phones |
| `md` | 768px+ | Tablets, large phones in landscape |
| `lg` | 1024px+ | Small laptops, tablets in landscape |
| `xl` | 1440px+ | Desktop and large laptop screens |

### 9.5 Key Component Patterns

**Listing Card**
Horizontal card on mobile, vertical grid card on desktop. Primary photo occupies 40% width on mobile. Key stats (size/beds/baths or size/room-type) shown as icon + number row using the Lucide/Phosphor icon set in Dark Navy, with the count in Saffron. A "ROOM" badge in amber differentiates room listings from full properties at a glance. A 3px Textile Accent top border on hover signals interactivity while reinforcing brand identity subtly.

**Price Badge**
Saffron background, white text, positioned top-right on the listing card.

**Type Badge**
"RENT" in deep green, "SALE" in dark navy, "ROOM" in amber.

**Suitability Tags**
Small pills on room listing cards and detail pages, using line icons (not emoji — emoji render inconsistently across operating systems and undercut the professional trust positioning): a graduation-cap icon for Students OK, a briefcase icon for Professionals, a paw icon for Pets OK, a no-smoking icon for No Smoking, a leaf icon for Vegetarian Household — all icons in Saffron, label text in Dark Navy. These give seekers instant context without opening the listing.

**WhatsApp CTA**
WhatsApp Green (`#25D366`) button with phone icon as the primary contact action on listing detail pages. This is the single most important conversion action and intentionally uses WhatsApp's own brand color, since instant recognizability matters more than strict palette consistency here.

**Photo Gallery**
CSS grid thumbnail strip below main image. Full-screen swipe on mobile (touch gestures). Arrow navigation on desktop.

**City Quick-Link Card**
Small skyline silhouette icon (e.g. Dom Tower for Utrecht, canal-house row for Amsterdam) above the city name, rendered as a simple line illustration in Dark Navy. This is the single highest-leverage spot for instantly signaling "Dutch real estate platform" without any text.

### 9.6 Accessibility Standard

The platform targets **WCAG 2.1 Level AA** compliance as a baseline requirement, which is also good practice for any public-facing Netherlands website.

- All text/background color combinations must meet the contrast ratios noted in Section 9.2
- All interactive elements (buttons, links, form fields) must have a visible focus state — a 2px Saffron outline on `:focus-visible`, distinct from hover state
- All form fields must have associated `<label>` elements, not placeholder-only labeling
- All images require alt text (already specified in Section 6.13)
- Full keyboard navigation must be possible for every user journey — posting a listing, searching, and contacting an owner must all be completable without a mouse
- Touch targets on mobile must be a minimum of 44×44px (Apple HIG / WCAG 2.5.5 standard)

### 9.7 Empty, Loading, and Error States

**Search results empty state:** When a filter combination returns zero listings, show a friendly message ("No listings match your filters yet — try widening your search") with one-click options to remove the most restrictive filter, plus a prompt to post a listing if none exist for that area yet.

**Day-one / pre-launch empty state:** Before the platform has 6–8 recent listings to fill the homepage grid, the homepage must gracefully show fewer listings (not broken layout) with a prominent "Be among the first to list your property" call to action filling the remaining grid space.

**New user dashboard empty state:** A brand-new "My Listings" dashboard (zero listings posted) shows a friendly illustration and a clear "Post Your First Listing" call to action — not a blank table.

**Loading states:** Listing cards and search results use skeleton screens (grey placeholder shapes matching the final layout) rather than spinners, to reduce perceived load time on photo-heavy pages. Photos lazy-load with a low-quality blurred placeholder (LQIP) that sharpens once the full image loads.

**Dark mode and reduced motion:** Explicitly out of scope for MVP 1. This is a deliberate deferral, not an oversight — revisit in MVP 2 based on user feedback.

### 9.8 Listing Form UX Strategy

The Single Room listing form spans roughly 35+ fields across eight logical groups (core details, location, property details, shared facilities, household, suitability, contact, photos). A single long-scroll form at this length risks tanking the 70% form-completion target set in Section 11. The form must therefore use a **multi-step wizard pattern**, not a single continuous scroll:

- **Step 1 — Basics:** Listing category, type, title, description, price, availability
- **Step 2 — Location:** City, neighbourhood, address
- **Step 3 — Property Details:** Size, rooms, furnishing, amenities (Whole Property) or shared facilities + household (Single Room)
- **Step 4 — Suitability** (Single Room only): Tenant preferences
- **Step 5 — Contact:** Name, phone, email, languages
- **Step 6 — Photos:** Upload and arrange

**Required UX elements:**
- Persistent progress indicator showing current step (e.g. "Step 3 of 6")
- Back/Next navigation, with all entered data preserved when moving between steps
- Auto-save to local browser storage (not the database) after each step, so a user who accidentally closes the tab does not lose their progress — recovered automatically if they return within 24 hours
- Mobile-optimized inputs: `inputmode="numeric"` for price, size, bedrooms, and deposit fields; `type="tel"` for phone number — ensuring the correct keyboard appears automatically on mobile devices
- Native date picker (`<input type="date">`) for available-from date, not a custom calendar widget, for better mobile usability

### 9.9 Navigation Structure

**Desktop header:** Logo (left) — primary nav links (Find a Room, Find a Property, Buy) — search icon — "Post a Listing" button (Saffron, always visible) — account menu (right, shows avatar after sign-in or "Sign In" before).

**Mobile header:** Logo (left) — hamburger menu icon (right) opening a full-screen overlay nav. "Post a Listing" remains visible as a persistent floating action button (Saffron, bottom-right) on scroll, since this is the platform's primary conversion action and should never require opening the menu to access.

**Footer:** Four-column layout on desktop (About / For Listers / For Seekers / Legal), collapsing to an accordion on mobile. Includes the brand mark, social links (if any), and the trust indicators (listing count, cities covered) repeated for users who scroll to the bottom without converting above the fold.

### 9.10 Tone of Voice and Microcopy Principles

All copy — button labels, error messages, confirmations, empty states — should read as warm, direct, and community-minded, never corporate or bureaucratic. This matches the "trust-first, community-built" positioning in the Vision Statement (Section 4.1).

| Situation | Tone direction | Example |
|---|---|---|
| Error messages | Specific and helpful, never blaming | "That doesn't look like a valid Dutch or Indian phone number — try the format +31 6 12345678" rather than "Invalid input" |
| Confirmations | Warm, human | "Your listing is live! We'll let you know if anyone's interested." rather than "Submission successful." |
| Empty states | Encouraging, action-oriented | "No listings here yet — be the first to post in Eindhoven" rather than "No results found." |
| Destructive actions | Clear about consequences, not alarmist | "Deleting this listing is permanent and can't be undone" rather than warning-icon-heavy language |
| Legal/compliance copy (AWGB disclaimer etc.) | Plain language, never legalistic jargon beyond what's necessary | Already specified verbatim in Section 6.4 — this is the reference standard for how compliance copy should read elsewhere |

---

## 10. Legal and Compliance

### 10.1 GDPR Requirements

Operating indianhomes.nl from the Netherlands means full GDPR compliance is legally mandatory before launch.

- **Privacy Policy:** Plain-language policy explaining what data is collected, why, retention period, and users' rights (access, rectification, erasure, portability)
- **Terms of Service:** Rules of the platform, prohibited content, liability disclaimers, listing guidelines
- **Cookie Consent Banner:** On first visit, users must consent to non-essential cookies (analytics). Strictly necessary cookies (session) do not require consent
- **Data Minimisation:** Collect only what is needed to operate the platform. Do not collect nationality, religion, or ethnic background as structured data fields
- **Right to Erasure:** Users can delete their account and all listings from the My Listings dashboard
- **Secure Storage:** All personal data stored in Supabase (EU Frankfurt region), encrypted at rest. Passwords are managed entirely by Firebase Auth — no passwords are stored in the application database
- **Email unsubscribe:** All transactional emails include an unsubscribe link

### 10.2 Fair Housing and Anti-Discrimination

Dutch law prohibits discrimination in housing based on nationality, religion, race, sex, and marital status (Algemene wet gelijke behandeling — AWGB). IndianHomes.nl must navigate this carefully.

**What is permitted:**
- The platform being community-focused on Indians is legal — it is a marketing and community positioning choice, not a legal exclusion of other nationalities
- "Indian community preferred" as an advisory, non-binding preference on listings is permitted because it does not constitute a hard exclusion
- Household compatibility preferences for rooms where the owner lives (smoking, pets, guests policy, dietary) are permitted as they relate to lifestyle, not protected characteristics
- "Suitable for: Students / Professionals / Couples / Families" is permitted — these are not protected characteristics under AWGB

**What requires a legal disclaimer:**
- Gender preference (Male only / Female only) on room listings — only shown when "Owner lives here" is selected, accompanied by an inline disclaimer confirming the owner's presence and the applicant's right to fair consideration

**Platform-level safeguards to include:**
- Listing submission guidelines page that explicitly states listings must comply with Dutch anti-discrimination law
- Report a Listing button on every listing detail page
- Admin ability to remove any listing that constitutes unlawful discrimination within 24 hours of a valid report
- Terms of Service clause that violations of AWGB result in immediate listing removal and account suspension

> **Legal note:** IndianHomes.nl does not facilitate illegal discrimination. The platform is open to all users in the Netherlands. Community focus is a marketing positioning. All tenant suitability preference fields are advisory only and non-binding on any landlord or tenant.

### 10.3 Content Moderation

In MVP 1, listings are auto-approved but subject to post-publication admin review. A "Report this listing" button on every detail page allows users to flag suspected fraud, scams, illegal content, or discrimination. The admin panel must allow removal within 24 hours of a valid report.

---

## 11. Success Metrics

### 11.1 Launch Targets — First 90 Days

| Metric | Target |
|---|---|
| Active listings | 50+ at any one time within 60 days of launch |
| Total listings posted | 100+ by end of month 3 |
| Room listings | At least 30% of total listings are room listings |
| Cities covered | At least 5 major Dutch cities |
| Unique visitors | 500+ per month by month 3 |
| Listing detail views | 1,000+ per month by month 3 |
| Listing-to-contact rate | At least 15% of detail page views result in a WhatsApp/phone/email click |
| Listing form completion rate | Above 70% of users who start a form complete it |
| Zero critical bugs | No user journeys broken in any major browser or device |

### 11.2 Technical Performance Requirements

| Requirement | Target |
|---|---|
| Page load time (LCP) | Under 2.5 seconds on mobile (3G connection) |
| Core Web Vitals | Green (pass) on Google PageSpeed Insights |
| Search response time | Under 500ms for filter queries |
| Image loading | Lazy-loaded, WebP format, responsive srcset |
| Uptime | 99.5% or higher |
| SSL | HTTPS enforced on all routes |
| Mobile compatibility | Fully usable on iOS Safari and Android Chrome |

---

## 12. Product Roadmap

### MVP 1 — Now (Weeks 1–8)

- Core listing platform: post, search, filter, view, contact
- Room listings with full household and tenant suitability fields
- User accounts: Firebase Auth with Google Sign-In (primary) and email/password (fallback)
- Admin panel: moderation and analytics
- SEO: meta tags, sitemap.xml, Schema.org RealEstateListing structured data
- GDPR compliance: Privacy Policy, Terms, Cookie banner
- Production deployment on Vercel at indianhomes.nl

### MVP 2 — Next (Months 3–6)

- In-app messaging: direct chat between listing owner and seeker
- WhatsApp notification to owner when someone messages them
- Saved searches and favourites
- Verified listings badge: manual or document-based verification
- Agent / broker accounts with multiple listing management
- Featured listings: optional paid boost (only after monetisation threshold is reached — see Section 14)
- Hindi and Tamil language toggle on listing descriptions
- Real-time instant search: migrate from PostgreSQL full-text to self-hosted Typesense on Hetzner (~€4/month) — adds typo tolerance, faceted counts, geo-search, and as-you-type results (see Section 6.5)

### MVP 3 — Future (Month 7+)

- AI matching: suggest listings based on seeker profile and behaviour
- Roommate matching: Indians looking for Indian flatmates, not just rooms
- Mortgage calculator: estimate affordability under Dutch mortgage rules
- Community forum: housing Q&A for Indians in the Netherlands
- Ratings and reviews: tenants review landlords; landlords review tenants
- Native mobile apps: React Native iOS and Android
- Partnership integrations: Indian mortgage brokers, relocation services, moving companies
- Revenue model activation: evaluate options per Section 14 based on community size and feedback

---

## 13. Development Checklist

### Pre-Launch Checklist

**Project Setup**
- [ ] Next.js 14 project scaffolded with TypeScript and Tailwind CSS
- [ ] Supabase project created in EU (Frankfurt) region
- [ ] Firebase project created with Google and Email/Password providers enabled
- [ ] `.env.local` created with all required variables (see below); `.env.local` added to `.gitignore`
- [ ] All environment variables added to Vercel project settings for production
- [ ] Supabase CLI installed and `supabase init` run — all schema changes from this point ship as version-controlled migration files (Section 7.6.6), never hand-edited in the dashboard
- [ ] Separate Supabase staging project created, mirroring production schema, for testing migrations before they reach production (Section 7.6.5)
- [ ] GitHub repository connected to Vercel — preview deployments confirmed working on a test pull request

**Required environment variables:**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin SDK project ID (server-side only) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin SDK client email (server-side only) |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin SDK private key (server-side only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only — never expose to client) |
| `RESEND_API_KEY` | Resend transactional email API key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps Embed API key (restrict to indianhomes.nl domain) |
| `HCAPTCHA_SECRET_KEY` | hCaptcha secret key for server-side verification |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | hCaptcha site key for frontend widget |
| `SENTRY_DSN` | Sentry error monitoring DSN |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics domain (`indianhomes.nl`) |

**Database**
- [ ] All tables created per schema in Section 7.3 (`users`, `listings`, `listing_photos`, `listing_reports`, `cities`)
- [ ] Row Level Security (RLS) policies enabled and tested on all tables
- [ ] Indexes created on `city`, `listing_type`, `property_type`, `status`, `created_at`, `expires_at`, `slug`
- [ ] Full-text search index (`tsvector`) on `title`, `description`, `city`, `neighbourhood`
- [ ] `set_updated_at` PostgreSQL trigger created and applied to `listings` table
- [ ] `cities` table seeded with all Dutch municipalities; `is_featured = true` set for top 20 Indian-community cities
- [ ] PgBouncer connection pooling enabled in Supabase connection settings (free, raises concurrent connection ceiling from ~60 to ~200–300 — see Section 7.5)
- [ ] Structured filter queries tested for all filter combinations (listing type, property type, price, bedrooms, furnishing, available date, room filters)
- [ ] Search fires on form submit (not real-time in MVP 1 — that comes with Typesense in MVP 2)
- [ ] Daily cron job configured (Supabase pg_cron or Vercel Cron) to run at **02:00 UTC** (per Section 6.10) to expire listings and send expiry warning emails
- [ ] Cron job execution logged; failure triggers a Sentry alert rather than failing silently (Section 7.6.4)
- [ ] Monthly cleanup job configured to hard-delete listings that have been `expired` for 30+ days
- [ ] `listing_photos.listing_id` FK set to `ON DELETE CASCADE`; `listing_reports.listing_id` FK set to `ON DELETE SET NULL` (Section 7.6.8)
- [ ] Supabase automatic daily backups confirmed enabled (Pro tier); one test restore performed to a separate project before launch (Section 7.6.1)
- [ ] Supabase dashboard resource alerts enabled for storage and connection pool thresholds (Section 7.6.4)

**Authentication (Firebase)**
- [ ] Firebase project created and configured (Google + Email/Password providers enabled)
- [ ] Firebase Admin SDK installed in Next.js (`firebase-admin`)
- [ ] Firebase client SDK installed (`firebase`)
- [ ] Google Sign-In working end-to-end (frontend → Firebase → JWT → API verification)
- [ ] Email/password registration and login working
- [ ] Password reset email working, branded as `noreply@indianhomes.nl`
- [ ] Firebase JWT verified server-side on all protected API routes
- [ ] On first sign-in, user record created in Supabase `users` table with Firebase UID
- [ ] Auth middleware protecting `/account/my-listings`, `/listings/new`, `/listings/[id]/edit`, `/admin`
- [ ] Login page shows "Continue with Google" as the primary button, email/password as secondary
- [ ] Sign-in state persisted correctly across page refreshes
- [ ] Firebase client SDK's `onIdTokenChanged` listener used (not one-time token fetch) so API requests always carry a valid, auto-refreshed token (Section 7.2f)
- [ ] `is_admin` flag set manually via Supabase SQL editor for the founder's account before first admin panel use (Section 6.9)

**Authorization and Security**
- [ ] Every listing edit/delete/mark-let-sold API route independently verifies `listings.user_id` matches the authenticated user's UID — never trust the frontend's hidden edit button alone (Section 7.2c)
- [ ] Every `/admin` API route independently verifies `users.is_admin = true` server-side
- [ ] Supabase RLS policies on `listings` enforce `user_id = auth.uid()` for UPDATE and DELETE as a second, independent enforcement layer (Section 7.2c)
- [ ] `dangerouslySetInnerHTML` confirmed not used anywhere user-generated text is rendered (Section 7.2d)
- [ ] All free-text fields validated server-side for length limits, regardless of client-side validation
- [ ] Listing descriptions render as plain text only — no HTML/Markdown parsing in MVP 1
- [ ] Idempotency key implemented on listing creation: client generates a UUID per form session; server rejects/dedupes duplicate submissions with the same key (Section 7.6.3)
- [ ] Submit button disabled immediately on click, re-enabled only on error response (prevents double-submit)
- [ ] Typesense search-only scoped API key used on frontend in MVP 2 — admin key used only server-side (Section 7.2e)

**Listing — Whole Property**
- [ ] Multi-step wizard implemented (Section 9.8) — not a single long-scroll form: Basics → Location → Property Details → Contact → Photos
- [ ] Progress indicator showing current step (e.g. "Step 3 of 5")
- [ ] Back/Next navigation preserves all entered data across steps
- [ ] Auto-save to browser local storage after each step; recovered automatically if user returns within 24 hours
- [ ] All form fields implemented with correct input types, including `inputmode`/`type` attributes for mobile keyboards (Section 9.8)
- [ ] Client-side validation on all required fields
- [ ] Server-side validation on API route
- [ ] hCaptcha integrated on listing form — token verified server-side before save
- [ ] Rate limit enforced: max 5 active listings per user; max 3 posts per 24 hours
- [ ] Duplicate detection check runs on submit — warning shown if probable duplicate found
- [ ] Phone number stored in E.164 format; Dutch `06XXXXXXXX` auto-converted to `+316XXXXXXXX`
- [ ] Photo upload: files processed server-side with `sharp` (resize, WebP conversion, thumbnail generation)
- [ ] Photos stored in Supabase Storage at `listings/{listing_id}/full/` and `listings/{listing_id}/thumb/`
- [ ] Slug and short_id generated and saved on listing creation
- [ ] `updated_at` trigger fires correctly on every listing edit
- [ ] Primary photo selection working; deleting primary auto-promotes next photo
- [ ] Listing saved to database on submit
- [ ] Confirmation email sent via Resend — email failure does not roll back or block the listing creation (Section 7.6.2)
- [ ] Partial photo upload failure handled gracefully — listing created with successfully uploaded photos, user shown a clear warning with the ability to add remaining photos later (Section 7.6.2)

**Listing — Single Room**
- [ ] Multi-step wizard includes the additional Suitability step (6 steps total vs. 5 for Whole Property — Section 9.8)
- [ ] All room-specific fields implemented (shared facilities, household, suitability)
- [ ] Gender preference field only shown when "Owner lives here" is selected
- [ ] Legal disclaimer displayed inline on gender preference field
- [ ] Suitability preference pills shown on listing card and detail page

**Search and Filter (MVP 1 — PostgreSQL)**
- [ ] Rent / Buy / Room mode switching working
- [ ] All global filters working and returning correct results
- [ ] Room-specific filters shown and hidden correctly based on property type selection
- [ ] Sort order working (newest, price low-high, price high-low)
- [ ] Pagination: "Load more" button on mobile (appends next 20 results); numbered pagination on desktop — 20 results per page
- [ ] Empty state shown when no results match
- [ ] City dropdown populated from distinct cities in the database (not a hardcoded list)
- [ ] Search result count displayed ("X listings found")
- [ ] Active filters shown as removable chips/tags above results so seeker always knows what filters are applied

**Listing Detail Page**
- [ ] Full photo gallery with thumbnail strip
- [ ] Full-screen image view on mobile
- [ ] All property details displayed correctly
- [ ] Room-specific fields displayed correctly for room listings
- [ ] Suitability tags shown with legal disclaimer
- [ ] WhatsApp deep link correctly constructed from E.164 phone number (`https://wa.me/[number]?text=...`)
- [ ] "Call" button renders as `tel:` link (opens dialler on mobile)
- [ ] Google Maps embed showing correct location (city-level if no street address)
- [ ] Share button (copy link) working
- [ ] Report this listing button visible, functional, and saves to `listing_reports` table
- [ ] Expired listing detail page shows "This listing has expired" — not a 404
- [ ] Let/sold listing detail page shows "No longer available" banner
- [ ] Rejected listing detail page returns 404
- [ ] WhatsApp button click tracked as custom event in Plausible (`Contact: WhatsApp`)
- [ ] Phone reveal click tracked as custom event in Plausible (`Contact: Phone`)
- [ ] Email reveal click tracked as custom event in Plausible (`Contact: Email`)**

**My Listings Dashboard**
- [ ] View own listings with status (active, let_sold, expired, rejected clearly labelled)
- [ ] Edit listing working — all fields including photos (reorder, delete, add, set primary)
- [ ] Mark as let / sold working — triggers status email to owner
- [ ] Reactivate listing working — for let_sold and expired listings
- [ ] Delete listing working — confirmation requires typing "DELETE" to confirm (Section 7.6.8); API route explicitly deletes all associated Storage files (full + thumb) before/alongside deleting database rows (Section 7.3 storage cleanup requirement)
- [ ] Expired listing shows Renew button — renewing resets expires_at to 90 days from now
- [ ] Rejected listing shows reason and contact support link

**Admin Panel**
- [ ] All listings visible with status
- [ ] Approve / reject / delete actions working
- [ ] Flagged listings surfaced prominently
- [ ] Basic analytics displayed (total, by type, by city)

**Design System**
- [ ] Color palette implemented as design tokens (CSS variables or Tailwind config) matching Section 9.2 exactly, including WhatsApp Green and Textile Accent
- [ ] Color contrast verified for all text/background pairs against WCAG AA (Section 9.6) — particularly Saffron-on-white only used for large/bold text, never small body text
- [ ] Icon set selected (Lucide or Phosphor) and integrated, replacing all emoji used as functional UI elements (Section 9.5)
- [ ] City skyline silhouette icons created or sourced for all featured cities (Amsterdam, Utrecht, Rotterdam, etc.)
- [ ] Hero imagery sourced/treated with duotone saffron overlay per Section 9.1 direction
- [ ] Textile Accent border pattern implemented as a restrained, single accent detail (e.g. card top border) — confirmed not overused across the interface
- [ ] Font fallback stack includes Noto Sans for Indic script coverage (Section 9.3)
- [ ] Responsive breakpoints (375/768/1024/1440px) confirmed as the shared reference across all components (Section 9.4)
- [ ] Focus-visible states implemented on all interactive elements (2px Saffron outline, Section 9.6)
- [ ] Skeleton loading states implemented for listing cards and search results (Section 9.7)
- [ ] Empty states designed and implemented: zero search results, day-one homepage, new user dashboard (Section 9.7)
- [ ] Touch targets confirmed at minimum 44×44px on all mobile interactive elements

**Homepage**
- [ ] Hero search bar with Rent / Buy / Room tabs
- [ ] Hero headline explicitly states the Indian-community positioning in text (Section 9.1)
- [ ] Recent listings grid showing 6–8 listings, with graceful day-one empty/partial state (Section 9.7)
- [ ] City quick-links working and filtering correctly, each with skyline silhouette icon
- [ ] How it works section
- [ ] Trust indicators (listing count, city count)

**SEO**
- [ ] Unique `<title>` and `<meta description>` on every page
- [ ] Schema.org `RealEstateListing` structured data on all listing detail pages
- [ ] `sitemap.xml` auto-generated including all active listing URLs using slug-based paths
- [ ] Canonical URL set on each listing detail page to prevent duplicate content
- [ ] `robots.txt` configured correctly
- [ ] Open Graph tags for social sharing on listing detail pages

**GDPR and Legal**
- [ ] Privacy Policy page published
- [ ] Terms of Service page published (includes listing guidelines and AWGB notice)
- [ ] Cookie consent banner implemented on first visit
- [ ] Analytics only fires after consent is given
- [ ] User account deletion removes all associated data and listings

**Email**
- [ ] Listing confirmation email sent to owner on posting
- [ ] Email verification sent for email/password signups (handled by Firebase — verify template is branded)
- [ ] Password reset email working
- [ ] All emails include unsubscribe option

**Error Pages**
- [ ] Custom 404 page — branded, with search bar and link to homepage
- [ ] Custom 500 error page — branded, with contact link
- [ ] Expired listing detail page — "This listing has expired" with link to search similar listings
- [ ] Rejected listing detail page — returns 404 (no information about why)
- [ ] Let/sold listing detail page — "No longer available" with link to search similar listings

**Monitoring and Operations**
- [ ] External uptime monitor configured (UptimeRobot or Better Uptime free tier) pinging indianhomes.nl every 5 minutes, with email/SMS alert on downtime (Section 7.6.4)

**Performance and QA**
- [ ] Core Web Vitals green on Google Lighthouse (mobile)
- [ ] All images lazy-loaded and served in WebP format (thumbnails on listing cards, full images on detail page)
- [ ] Image alt text set on all listing photos — auto-generated as `[title] — photo [n]` if not manually provided
- [ ] Search queries respond in under 500ms
- [ ] All user journeys tested end-to-end with no dead ends
- [ ] Tested on iPhone Safari, Android Chrome, desktop Chrome, Firefox, Edge
- [ ] SSL enforced; HTTP redirects to HTTPS
- [ ] Domain `indianhomes.nl` pointing to Vercel production deployment
- [ ] Error monitoring (Sentry) active and capturing unhandled errors
- [ ] Analytics (Plausible) active with custom events: `Contact: WhatsApp`, `Contact: Phone`, `Contact: Email`, `Listing: Posted`, `Listing: Renewed`
- [ ] `robots.txt` disallows `/admin` and `/account`

---

## 14. Monetisation Strategy

### 14.1 MVP 1 and MVP 2 — Completely Free for Everyone

**Both listers and seekers pay nothing.** This is a deliberate strategic decision. The platform will not charge any user — for posting, searching, contacting, or any other action — until a healthy, active listing base and engaged community are established.

**Why this is the right call:**

- **Marketplace cold-start problem.** Listers will not pay to post if there are no seekers. Seekers will not pay to search if there are no listings. Free on both sides removes all friction during the critical growth phase.
- **Trust building.** The Indian community in the Netherlands is tight-knit. Word of mouth is the primary growth channel. Every smooth, free experience generates referrals. Every paywall kills them.
- **Competition is free.** WhatsApp groups, Facebook groups, and Kamernet are all free. IndianHomes.nl must be unambiguously better and free before asking anyone to pay.
- **Data before dollars.** Listing base, search behaviour, and contact patterns collected during the free phase will directly inform which monetisation features are worth building.

### 14.2 Monetisation Readiness Threshold

Monetisation will only be considered once **all three** of the following conditions are met:

| Condition | Target |
|---|---|
| Active listings | 300+ live listings at any one time |
| Monthly unique visitors | 2,000+ per month consistently |
| Community validation | Qualitative feedback confirms the platform is a trusted go-to resource |

These thresholds should be reviewed at the end of MVP 2 (Month 6). If not met, the free period extends.

### 14.3 Future Monetisation Options (Post-Threshold, MVP 3+)

These are options to evaluate once the community is established. Nothing here is committed or scheduled.

| Option | Description | Who pays | Notes |
|---|---|---|---|
| Featured Listings | Optional paid boost to appear at top of search for 30 days | Lister (optional) | Free listings always remain available — never mandatory |
| Agent Subscriptions | Verified agent badge, unlimited listings, profile page | Agent / broker | Only relevant once agent use is validated |
| Relocation Partner Referrals | Referral fees from Indian-friendly relocation companies, mortgage brokers, moving services | Platform earns from partners, not users | Zero cost to listers or seekers |
| Community Sponsorships | Indian banks (ICICI UK, HDFC), insurance providers, telecom brands targeting NRI communities | Sponsors pay, users see relevant content | Must not compromise trust or clutter UX |
| Premium Seeker Alerts | Instant WhatsApp or email alert when a matching listing is posted | Seeker (optional) | Only if free alerts prove insufficient and demand exists |
| Roommate Matching | Premium service connecting Indians looking for Indian flatmates | Seeker (optional) | MVP 3+ only |

> **Principle:** Any future monetisation must be optional and additive. The free tier must always remain fully functional. No listing will ever be hidden behind a paywall, and no seeker will ever be blocked from viewing contact details without paying.

---

*IndianHomes.nl PRD v1.7.1 — Development Approved — June 2026 — Confidential*
