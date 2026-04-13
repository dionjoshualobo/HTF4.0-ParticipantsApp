# HTF4.0 Participants App — Run Guide

This guide only covers how to run the app, set up DB/auth, switch between local and cloud Supabase, and test logins.

## 1) Prerequisites

- Node.js + npm
- Docker
- Supabase CLI

Install CLI:

```bash
npm i -g supabase
```

Install project deps:

```bash
npm install
```

---

## 2) Run with **local Supabase**

Start local Supabase:

```bash
npx supabase start
```

Use local env values in `.env.local`:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

> Keep `.env.local` for local usage. Vite will pick it automatically.

Apply DB SQL files to local Postgres:

```bash
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/schema.sql
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/rls_policies.sql
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f supabase/seed.sql
```

Run app:

```bash
npm run dev
```

---

## 3) Run with **cloud Supabase**

Create/choose your Supabase cloud project, then use cloud values:

```dotenv
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-cloud-anon-key>
```

You can put those in `.env` (or export at runtime).

Apply SQL in Supabase Dashboard → SQL Editor (in this order):

1. `supabase/schema.sql`
2. `supabase/rls_policies.sql`
3. `supabase/seed.sql`

Then run:

```bash
npm run dev
```

---

## 4) Switching local ↔ cloud

### Option A (recommended): use `.env.local` for local, `.env` for cloud

- Local testing: keep `.env.local` with `127.0.0.1` values.
- Cloud testing: temporarily rename/remove `.env.local` so `.env` cloud values are used.

### Option B: one-off run command

```bash
VITE_SUPABASE_URL="https://<project>.supabase.co" \
VITE_SUPABASE_ANON_KEY="<anon-key>" \
npm run dev
```

---

## 5) Test credentials (from `supabase/seed.sql`)

Team login format in this app:

- Team Code input (UI)
- Password input (UI)

Seeded accounts:

- Participant: team code `T02`, password `team02`
- Volunteer: team code `VOLUNTEER`, password `htfvolunteer`
- Admin: team code `ADMIN`, password `admin123`

Expected behavior:

- `VOLUNTEER` should route to `/volunteer`
- `ADMIN` should access `/admin`

---

## 6) Quick checks if login fails

Check local Supabase is running:

```bash
npx supabase status
```

Check auth token endpoint (local):

```bash
curl -sS -X POST "http://127.0.0.1:54321/auth/v1/token?grant_type=password" \
	-H "apikey: <your-local-publishable-key>" \
	-H "Content-Type: application/json" \
	-d '{"email":"volunteer@htf.local","password":"htfvolunteer"}'
```

---

## 7) Useful scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
