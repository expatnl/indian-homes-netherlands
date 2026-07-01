# Cloud Account Setup — IndianHomes.nl

This walks through the remaining Phase 0/1 Definition of Done items that need
your accounts and browser logins (PRD §13, §7.6.5, §7.6.6, §7.2b):

- [ ] Supabase project (production + staging) created in EU region
- [ ] Supabase CLI migrations folder initialized
- [ ] Firebase project created with Google + Email/Password providers enabled
- [ ] Vercel connected to GitHub with working preview deployments
- [ ] Sentry capturing errors from local and preview environments
- [ ] Firebase JWT accepted by Supabase RLS (Phase 1 — needs both Supabase
      and Firebase to exist first; see §4d)
- [ ] Real Google/email sign-in creates a correctly populated `users` row
      (Phase 2 — needs §4d done first; see §4e)

Everything local (Next.js, Vitest, Playwright, folder structure,
`.env.local.example`, the local `supabase/migrations` folder) is already done
— see the repo as it stands. This guide only covers the parts that need an
account login.

Do these roughly in order: GitHub → Vercel → Supabase → Firebase → Sentry →
Plausible. Each section tells you exactly which `.env.local` variable(s) it
produces, matching `.env.local.example`.

---

## 0. Prerequisites

- A GitHub account
- Node.js + npm already installed (confirmed working in this repo)
- `npx` available (used to run CLIs without a global install)

Copy the example env file once, then fill in values as you go through this
guide:

```bash
cp .env.local.example .env.local
```

`.env.local` is git-ignored — never commit it.

---

## 1. GitHub repository

1. Create a new **empty** repository on GitHub (no README/license — this repo
   already has files): https://github.com/new
2. Push the local repo that's already initialized:

   ```bash
   git add -A
   git commit -m "Initial Phase 1 scaffolding"
   git remote add origin https://github.com/<your-username>/indianhomes-nl.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Vercel (connect GitHub, confirm preview deployments)

1. Go to https://vercel.com/new and sign in with GitHub.
2. Import the `indianhomes-nl` repository you just pushed.
3. Framework preset should auto-detect **Next.js** — leave build command as
   `next build` (default).
4. Don't add environment variables yet — add them after Supabase/Firebase/
   Sentry steps below (Section 7), then redeploy.
5. Click **Deploy**. This creates the production deployment on `main`.

**Confirm preview deployments work (PRD §7.6.5):**

```bash
git checkout -b test/preview-deploy
echo "<!-- test -->" >> README.md
git commit -am "test: confirm Vercel preview deployment"
git push -u origin test/preview-deploy
```

Open a PR on GitHub from `test/preview-deploy` into `main`. Vercel's GitHub
bot will comment on the PR with a preview URL within ~1-2 minutes. Open it
and confirm the homepage loads. Then close/merge the PR as you prefer and
delete the branch.

---

## 3. Supabase — production project (EU/Frankfurt)

1. Go to https://supabase.com/dashboard and sign in/sign up.
2. **New project** → choose your organization →
   - Name: `indianhomes-nl-production`
   - Database password: generate and save it somewhere safe (a password
     manager, not this repo)
   - **Region: `EU (Frankfurt)`** — required per PRD §7.6 (GDPR / data
     residency)
   - Plan: Free tier is fine to start
3. Wait for provisioning (~2 minutes).
4. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-side only —
     never expose this to the client or commit it)

### 3a. Supabase staging project (PRD §7.6.5)

Repeat step 2-4 with a second project named `indianhomes-nl-staging`, same
EU/Frankfurt region, mirroring production schema. Keep its keys separate —
you'll use them for a `.env.staging.local` or in Vercel's "Preview"
environment variables later, not in production `.env.local`.

### 3b. Link the local Supabase CLI migrations folder

The `supabase/migrations` folder already exists locally
(`supabase/migrations/.gitkeep`). Link it to your new production project so
`supabase db push` targets the right place:

```bash
npx supabase login
npx supabase link --project-ref <production-project-ref>
```

The project ref is the string in your Supabase project URL:
`https://<project-ref>.supabase.co`.

From this point on, every schema change must be a migration file, never a
hand-edit in the dashboard SQL editor (PRD §7.6.6):

```bash
npx supabase migration new <description_of_change>
# edit the generated SQL file in supabase/migrations/
npx supabase db push
```

### 3c. Enable connection pooling (PRD §7.5)

In **Project Settings → Database → Connection pooling**, confirm PgBouncer
pooling is enabled (it's on by default on all tiers). No action usually
needed — just verify the toggle is on.

---

## 4. Firebase (Google + Email/Password auth)

1. Go to https://console.firebase.google.com and sign in.
2. **Add project** → name it `indianhomes-nl` → disable Google Analytics for
   this project (not needed; Plausible is the analytics tool per PRD §7.2) →
   Create.
3. In the project, click the **Web** icon (`</>`) to register a web app,
   name it `indianhomes-nl-web`. Firebase shows a config snippet — copy these
   into `.env.local`:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4a. Enable auth providers

In **Build → Authentication → Sign-in method**:
- Enable **Google** — set a support email when prompted.
- Enable **Email/Password**.

### 4b. Custom sender (PRD §7.2b)

In **Authentication → Templates**, set the sender name to `IndianHomes.nl`
and the reply-to/sender address to `noreply@indianhomes.nl` (requires domain
verification under Authentication → Settings → Authorized domains /
custom SMTP if you want the branded "from" address — otherwise Firebase's
default sender works for now and this can be revisited before launch).

### 4c. Firebase Admin SDK credentials (server-side)

In **Project Settings → Service accounts**, click **Generate new private
key**. This downloads a JSON file. From it, copy into `.env.local`:
- `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
- `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
- `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` (keep the `\n` characters
  literally as they appear in the JSON — wrap the value in quotes)

**Delete the downloaded JSON file once you've copied the values** — don't
leave it sitting in the repo folder, even untracked.

### 4d. Enable Firebase as a Supabase third-party auth provider + verify RLS accepts the Firebase JWT (PRD §7.2b, Phase 1 DoD)

Needs both the Supabase project (§3) and Firebase project (§4) to already
exist. Phase 1's migrations (`supabase/migrations/20260630120900_create_auth_helper_functions.sql`)
already define `public.requesting_user_id()`, which reads the verified JWT's
`sub` claim as text — this step is what makes Supabase actually verify a
Firebase-issued JWT in the first place, so that function has something real
to read.

1. **Configure on the hosted project** (this is separate from the
   `supabase/config.toml` entry, which only affects `supabase start` for
   local dev): in the Supabase Dashboard, go to **Authentication → Sign In /
   Providers → Third Party Auth**, add a **Firebase** integration, and enter
   your Firebase **Project ID** (the same value as `FIREBASE_ADMIN_PROJECT_ID`).
2. **For local dev**, set `FIREBASE_ADMIN_PROJECT_ID` in your shell
   environment and flip `enabled = true` under `[auth.third_party.firebase]`
   in `supabase/config.toml`.
3. **Get a real Firebase ID token for a test user**, without needing any
   app sign-in UI yet (that's a later phase). Create a test user under
   **Firebase Console → Authentication → Users → Add user** (email +
   password), then exchange it for an ID token via Firebase's REST API:

   ```bash
   curl "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=<NEXT_PUBLIC_FIREBASE_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"<the password you set>","returnSecureToken":true}'
   ```

   Copy the `idToken` field from the response and the `localId` field (this
   is the Firebase UID — the value `requesting_user_id()` will return).
4. **Seed a matching `users` row** via the Supabase SQL editor (this bypasses
   RLS since the SQL editor runs as a superuser):

   ```sql
   insert into public.users (id, email, name)
   values ('<localId from step 3>', 'test@example.com', 'Test User');
   ```
5. **Call Supabase's REST API directly with the Firebase ID token** to
   confirm RLS recognizes it:

   ```bash
   curl "https://<project-ref>.supabase.co/rest/v1/users?select=*" \
     -H "apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>" \
     -H "Authorization: Bearer <idToken from step 3>"
   ```

   Expected result: exactly the one row you seeded in step 4, and **only**
   that row — confirming `requesting_user_id()` correctly extracted the
   Firebase UID from the JWT and the `users_select_own` RLS policy matched
   it. If you get an empty array, RLS is rejecting the JWT (check the
   third-party integration's Project ID matches exactly); if you get a
   42501/JWT error, the token wasn't accepted as valid at all.
6. Clean up the test user/row afterwards if you don't want test data lingering.

### 4e. End-to-end: real sign-in creates a `users` row (PRD §7.2b, Phase 2 DoD)

Needs §4d done first (Supabase must already accept Firebase JWTs, or the
`sync-user` API call below will fail at `requireAuth()`). This is the one
verification that genuinely needs the app's own UI, not just curl — Phase 2
built the register/login pages and the `/api/auth/sync-user` route
(`app/api/auth/sync-user/route.ts`) but could only unit-test them with
mocked Firebase/Supabase clients, since no real project existed yet.

1. Fill in `.env.local` with every value collected in §3 and §4 above
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, all six `NEXT_PUBLIC_FIREBASE_*` vars, all
   three `FIREBASE_ADMIN_*` vars).
2. `npm run dev`, open http://localhost:3000/account/register.
3. **Google Sign-In path:** click "Continue with Google", complete the
   Google popup with a real Google account. You should land on
   `/account/my-listings` showing "Signed in as &lt;your email&gt;".
4. In **Supabase Dashboard → Table Editor → users**, confirm a new row
   exists with:
   - `id` = the Firebase UID (28-char string, not a UUID — confirms
     `users.id` is correctly typed `text` per §7.2b, not the default
     Supabase Auth `uuid`)
   - `email` = your real Google account email
   - `name` = your Google display name
   - `is_admin` = `false`
5. Sign out (button on the My Listings shell), then repeat via the
   **email/password path**: register a second test account with name/email/
   password on the same page. Confirm a second `users` row appears with the
   name you typed (not a Google profile name, since there isn't one for
   this path) and the email you registered with.
6. **Forgot password:** from `/account/login`, click "Forgot your
   password?", submit the email/password test account's address. Confirm
   the reset email arrives (check the sender name/address matches what was
   configured in §4b) and that clicking it lets you set a new password.
7. **Logout:** click "Sign out" on My Listings, confirm you're returned to
   `/account/login` and that revisiting `/account/my-listings` redirects
   you back to login (per `components/RequireAuth.tsx`) rather than showing
   stale content.
8. **Admin SQL, against a real account:** run the command from
   `README-admin-setup.md` against one of the two accounts you just
   created, then sign in as that account again and confirm `/admin` access
   would now be granted (full admin panel UI is a later phase — at this
   point you're just confirming the `is_admin` flag round-trips correctly
   for a real account, which `lib/__tests__/auth/admin-sql.test.ts` already
   proved against the schema in isolation).

If any step fails, check the browser console first — `AuthProvider`
(`lib/auth/AuthContext.tsx`) resolves to signed-out within ~8 seconds (or
immediately, if Firebase fails to initialize) rather than hanging, so a
stuck-loading page most likely means a `sync-user` call is failing; check
the Network tab for its response body.

---

## 5. Sentry

1. Go to https://sentry.io and sign in/sign up.
2. **Create project** → platform: **Next.js** → name it `indianhomes-nl`.
3. Sentry shows a DSN (`https://...@...ingest.sentry.io/...`). Copy it into
   `.env.local` as `SENTRY_DSN`.
4. (Optional, for source map uploads in CI) Note your **Org slug** and
   **Project slug** — `next.config.mjs` already reads `SENTRY_ORG` /
   `SENTRY_PROJECT` env vars if you want to set those too, though they're
   not in the PRD's required variable list and aren't needed for basic error
   capture.

### Verify Sentry captures errors locally

```bash
npm run dev
```

In another terminal:

```bash
curl http://localhost:3000/api/sentry-test-error
```

This hits the deliberate-throw route already in the repo
(`app/api/sentry-test-error/route.ts`). Within ~30 seconds it should appear
as a new issue in the Sentry dashboard for the `indianhomes-nl` project.

### Verify Sentry captures errors on a Vercel preview

1. Add `SENTRY_DSN` to Vercel: **Project Settings → Environment Variables**
   → add for all environments (Production, Preview, Development) → redeploy
   (or push a new commit to trigger one).
2. Open any active preview URL and visit `/api/sentry-test-error` on it.
3. Confirm a second issue appears in Sentry, tagged with the preview
   environment.

---

## 6. Plausible

1. Go to https://plausible.io and sign in/sign up.
2. **Add a website** → domain: `indianhomes.nl`.
3. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in `.env.local.example` is already set to
   `indianhomes.nl` — no env change needed once the site is registered.
4. The script is already wired up behind a consent stub
   (`components/PlausibleScript.tsx`, `lib/consent.ts`). To verify it loads:

   ```js
   // in the browser console, on http://localhost:3000
   localStorage.setItem("ih_cookie_consent", "granted");
   location.reload();
   ```

   Then check the Network tab for a request to
   `https://plausible.io/js/script.js` and confirm Plausible's **Visitors**
   dashboard shows realtime traffic for `indianhomes.nl`.

   The full cookie-consent banner UI (replacing this localStorage stub) is
   built in Phase 9 per the PRD — this only proves the script-loading
   mechanism works.

---

## 7. Add all env vars to Vercel

Once you have real values for everything above, go to **Vercel → Project
Settings → Environment Variables** and add every variable from
`.env.local.example`, for **Production**, **Preview**, and **Development**
environments. For Supabase specifically, use the **production** project's
keys for the Production environment and the **staging** project's keys for
Preview/Development, per PRD §7.6.5.

Redeploy after adding variables so they take effect.

---

## 8. Final verification checklist

Run through this once everything above is done:

- [ ] `git push` succeeds, PR triggers a Vercel preview URL that loads the homepage
- [x] `npx supabase link` succeeds against the production project; `supabase/migrations` is the source of schema truth going forward — confirmed: all 11 migrations pushed, all 5 tables (`users`, `listings`, `listing_photos`, `listing_reports`, `cities`) visible in Table Editor
- [x] Schema matches Phase 1 exactly on the real database — confirmed via Supabase Dashboard: 20 RLS policies across the 5 tables (4 users / 8 listings / 4 listing_photos / 3 listing_reports / 1 cities, matching `supabase/migrations/20260630121000_enable_rls_policies.sql` exactly), `set_updated_at` trigger present on `listings` (`BEFORE UPDATE`, `ROW`), and `cities` seeded
- [ ] Separate Supabase staging project exists, same schema (empty for now)
- [ ] Firebase Console shows Google + Email/Password both enabled under Sign-in method
- [x] Firebase third-party auth integration added in Supabase Dashboard; the REST API test in §4d returns exactly the seeded test row — confirmed: Supabase correctly verified the Firebase JWT, `requesting_user_id()` extracted the Firebase UID, and `users_select_own` RLS policy returned exactly one row with correct email/name/is_admin=false
- [ ] Real Google sign-in via `/account/register` creates a `users` row with the Firebase UID, correct email/name, `is_admin = false` (§4e)
- [ ] Real email/password sign-up creates a second `users` row with the typed name, not a Google profile name (§4e)
- [ ] Password reset email arrives and successfully resets the password (§4e)
- [ ] Logout returns to `/account/login`; revisiting `/account/my-listings` afterward redirects back to login rather than showing stale content (§4e)
- [ ] Admin SQL from `README-admin-setup.md` correctly flips `is_admin` for a real signed-in account (§4e)
- [ ] Sentry dashboard shows one issue from `localhost:3000/api/sentry-test-error`
- [ ] Sentry dashboard shows a second issue from the same route hit on a Vercel preview URL
- [ ] Plausible dashboard shows realtime traffic after granting consent locally
