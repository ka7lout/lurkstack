# CLAUDE.md

## Project

MarkTrack Agentic Engineer Intern Assessment.

Use Claude Code for implementation, as explicitly required by the assessment.

## Required Reading Order

Before coding:

1. `AGENTS.md`
2. `docs/MARKTRACK_ASSIGNMENT.md`
3. `docs/PROJECT_CONTRACT.md`
4. `docs/ACCEPTANCE_MATRIX.md`
5. `docs/DESIGN_SPEC.md`
6. existing `README.md`
7. relevant source code

Do not skip repository inspection.

## Hard Rules

### Cross-user post permissions

Authenticated users can edit ANY post.

Authenticated users can delete ANY post.

This is intentionally unusual.

Never implement:

```ts
if (post.authorId !== currentUser.id) {
  throw new Error(...)
}
```

for post edit/delete.

Never hide Edit/Delete in the authenticated UI based on ownership.

### Guest mode

Unauthenticated visitors can read:
- feed
- posts
- public profiles
- counts

Guests cannot mutate.

Protected actions should open the authentication gate rather than silently failing.

### Do not expose demo credentials in the Login UI

Seeded reviewer credentials may exist in:
- README
- submission email
- database seed documentation

They must not be displayed as a visible "Demo accounts" block on the public login page.

## Stack

Use:

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Lucide
- Better Auth
- Drizzle ORM
- PostgreSQL / Neon
- Playwright
- Netlify

Do not add a second primary UI framework.

## Existing Frontend

Assume another AI agent already produced the initial frontend.

Do not blindly rebuild it.

Inspect it first.

Preserve the approved visual direction from `docs/DESIGN_SPEC.md`.

Improve existing code where necessary.

## Backend

Implement real:
- authentication
- sessions
- database persistence
- posts
- comments
- likes
- profiles

Use server-side validation.

Never trust browser-supplied identity.

## Tests

At minimum test:
- signup
- login
- logout
- guest feed
- guest auth gate
- create post
- edit own post
- edit another user's post
- delete own post
- delete another user's post
- comment
- like
- duplicate like prevention
- profile
- seeded data

Do not delete failing tests to obtain a green run.

## Scope

Do not add:
- messaging
- follows
- notifications
- admin
- payments
- image/file uploads
- AI chatbot
- unrelated settings
- complex social features

## Quality

Do not:
- swallow errors
- commit secrets
- add unnecessary dependencies
- leave required flows mocked after backend integration
- claim success without verification

Prefer:
- small components
- clear boundaries
- server-side data access
- stable types
- explicit error handling
- fresh mutation results

## Final Verification

Before final completion run:
- typecheck
- lint
- automated tests
- production build

For deployment:
- verify public URL
- verify production database
- verify two seeded accounts
- verify guest mode
- verify cross-user edit
- verify cross-user delete
- verify no secrets in repository

Report factual results only.
