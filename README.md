# LurkStack

A real, deployable, multi-user text-only social feed — built for the MarkTrack
Agentic Engineer Intern assessment.

Guests can read everything. Any signed-in user can post, comment, react, and
edit or delete **any** post, regardless of who wrote it. That last rule is
deliberate and unusual; it is implemented exactly as specified, with no
ownership check anywhere in the codebase.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4, shadcn/ui-style primitives (Radix), Lucide |
| Auth | Better Auth 1.7 (email + password, Drizzle adapter) |
| Database | PostgreSQL (Neon) via Drizzle ORM + `pg` |
| Tests | Playwright (21 end-to-end tests) |
| Deploy | Netlify |

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run db:migrate             # create the schema
npm run db:seed                # 8 users, 40 posts, 39 comments, 140 likes
npm run dev                    # http://localhost:3000
```

### Environment variables

Every value lives in `.env.local` (gitignored). `.env.example` ships with empty
placeholders only — no real secret is ever committed.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL / Neon connection string |
| `BETTER_AUTH_SECRET` | yes | Session signing secret |
| `BETTER_AUTH_URL` | yes | Public base URL the auth handler trusts |
| `NEXT_PUBLIC_APP_URL` | yes | Public base URL for the browser auth client |
| `TELEGRAM_BOT_TOKEN` | no | Alert delivery; app works without it |
| `TELEGRAM_CHAT_ID` | no | Alert destination |
| `PUTER_AUTH_TOKEN` | no | Optional AI summary of an incident |
| `CRON_SECRET` | no | Bearer token for `/api/cron/health` |
| `AUTH_RATE_LIMIT_WINDOW` | no | Credential throttle window, seconds (default `300`) |
| `AUTH_RATE_LIMIT_MAX` | no | Credential throttle attempts (default `60`) |

Monitoring is additive. With no Telegram or Puter configuration the app behaves
identically — alerts are simply not sent.

---

## Seeded reviewer accounts

Created by `npm run db:seed`, password `Password123!` for both:

| Name | Email |
| --- | --- |
| Aisha Rahman | `aisha@lurkstack.dev` |
| Yusuf Khan | `yusuf@lurkstack.dev` |

These are documented **here and in the seed output only**. The public login page
is a plain login form and never displays demo credentials, development hints, or
a "demo accounts" block. (`tests/auth.spec.ts` asserts this.)

Six further seeded users, 40 posts, 39 comments and 140 likes make the feed look
like something people actually use.

---

## Permission model

Two rules, both enforced **server-side** from the Better Auth session. The
client is never trusted for identity.

**1. Any authenticated user can mutate any post.**

`editPost` and `deletePost` in `lib/actions/posts.ts` resolve the current user,
verify a session exists, and then act. There is no `authorId === user.id`
comparison anywhere in the repository — by design. The Edit and Delete menu
items are likewise never hidden based on ownership.

**2. Guests can read, never write.**

`/`, `/u/[id]`, posts, comments and counts are all publicly readable. Every
mutation returns `UNAUTHENTICATED` for a guest and is recorded as a **blocked
authorization event**. In the UI, a guest action opens an authentication gate
dialog that links to `/login` and `/signup` with a `next` parameter, rather than
failing silently.

---

## Routes

| Route | Access | Notes |
| --- | --- | --- |
| `/` | public | Server-rendered feed, newest first |
| `/u/[id]` | public | Public profile + that user's posts |
| `/login` | public | Email + password |
| `/signup` | public | Name, email, password |
| `/api/auth/[...all]` | public | Better Auth handler |
| `/api/health` | public | Machine-readable health, no secrets |
| `/api/cron/health` | `CRON_SECRET` | Scheduled health probe |

---

## State coverage

The UI is honest about the network, not optimistic to a fault:

- **Loading** — skeletons for the feed and comment threads.
- **Empty** — distinct empty states for the feed, a profile, and comments.
- **Error** — feed, comments and mutations have separate error surfaces with retry.
- **Offline / reconnecting / restored** — a connection strip driven by real
  `online`/`offline` events plus request outcome.
- **Slow requests** — a delayed-flag hint appears after 2.2s so a slow write
  never looks like a hang.
- **Optimistic + rollback** — likes and comments apply immediately and roll back
  with an explanatory toast if the server rejects them.
- **Partial failure** — a comment thread failing does not take the feed down.
- **Session unreadable** — if the session read itself fails, the header says so
  instead of silently rendering the guest view.

---

## Observability

`lib/monitor/` records structured audit events to the `audit_event` table:

signup · login success/failure · logout · create/edit/delete post · comment ·
like/unlike · **blocked unauthenticated mutations** · auth/session anomalies ·
unexpected server errors · database errors.

Design rules, all of which are load-bearing:

- **Deterministic facts.** `lib/monitor/rules.ts` assigns severity from the event
  itself. AI never decides what happened; it may only summarise.
- **Cross-user edit/delete is `allowed`, never a violation.** Guest mutation is
  `blocked` and *is* a genuine authorization event.
- **Deduplication.** Identical fingerprints inside a 5-minute window collapse into
  one row with a `repeatCount`; alerts render it as `Repeated events: N`.
- **Redaction.** Telegram messages carry an action, a result, a severity, an
  actor display name and a summary. They never carry passwords, auth tokens, API
  keys, the bot token, the Puter token, IP addresses, raw request bodies, or
  private auth data.
- **Non-blocking.** Callers use `void record(...)`. Every send is wrapped and
  failure-isolated; the request path never awaits Telegram or Puter.
- **Correlation IDs.** Each event carries a `requestId`.

`/api/health` returns real checks (database round-trip, required config) with
`503` when unhealthy. `/api/cron/health` is a lightweight scheduled path guarded
by `CRON_SECRET`.

---

## Tests

```bash
npx playwright test      # 21 tests, ~1.2 min
```

Covers signup, login, logout, session persistence, guest feed, guest auth gate,
guest server-side rejection, create/edit/delete post, **cross-user edit**,
**cross-user delete**, comments, likes, duplicate-like prevention, profiles,
not-found, seeded data, and `/api/health`.

The two cross-user tests are permanent: they are the clearest expression of the
specification, and deleting them would hide a regression.

`npm run typecheck`, `npx next lint` and `npx next build` are all clean.

### A note on rate limiting

Better Auth's limiter is enabled and real. It was tuned after a genuine bug:
the default global limit throttled `/get-session` as well as the credential
endpoints, so a signed-in user who made enough page loads began silently seeing
the guest UI. Credential endpoints keep a tight per-IP throttle; read-only
session checks get a much higher ceiling.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Playwright |
| `npm run db:generate` | Generate a Drizzle migration |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Reset and seed realistic data |

---

## Deploying to Netlify

1. Push this repository to GitHub.
2. Create a Netlify site from the repo (the Next.js runtime is detected).
3. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and
   `NEXT_PUBLIC_APP_URL` (`BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must be the
   deployed HTTPS origin).
4. Optionally set the Telegram, Puter and `CRON_SECRET` variables.
5. Run `npm run db:migrate && npm run db:seed` against the deployed database.
6. Verify: guest feed loads, both seeded accounts sign in, cross-user edit and
   delete succeed, `/api/health` returns `{"status":"ok"}`.

---

## Scope

Intentionally **not** built: messaging, follows, notifications, admin, payments,
file or image uploads, AI chat, and unrelated settings. Posts are text-only.
