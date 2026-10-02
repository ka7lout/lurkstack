# AGENTS.md

## Mission

This repository is the MarkTrack Agentic Engineer Intern assessment.

The product is a small, polished, text-only social feed.

The goal is:
- functional
- reliable
- visually coherent
- testable
- publicly deployable
- carefully verified

## Source of Truth

Read these before making meaningful changes:

1. `docs/MARKTRACK_ASSIGNMENT.md`
2. `docs/PROJECT_CONTRACT.md`
3. `docs/ACCEPTANCE_MATRIX.md`
4. `docs/DESIGN_SPEC.md`

Priority:

```text
Original assignment
>
Project contract
>
Acceptance tests
>
Design specification
>
Agent preference
```

## Critical Permission Rule

Any authenticated user can edit any post.

Any authenticated user can delete any post.

Never replace this with owner-only permissions.

These flows must be covered by automated tests.

## Guest Rule

Unauthenticated visitors may read the feed and public profiles.

Guests may not mutate data.

Protected actions should use a polished authentication gate.

## Required Stack

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

Do not add another primary UI framework.

## Product Scope

Required:
- signup
- login
- logout
- guest read-only feed
- shared text-only feed
- create post
- edit any post
- delete any post
- comments
- likes
- public profiles
- seeded users/posts/comments/likes
- responsive professional UI
- loading/error/empty/network states

Do not add:
- messaging
- follows
- notifications
- payments
- image/file uploads
- admin dashboard
- AI chatbot
- complex search
- unrelated settings
- unnecessary social features

## Engineering Rules

- Read contracts before coding.
- Never invent requirements.
- Never hide a defect by deleting/weaking tests.
- Never claim a check passed without running it.
- Never store plaintext passwords.
- Never commit secrets.
- Never commit `.env`.
- Validate mutations server-side.
- Resolve authenticated identity server-side.
- Keep UI and database responsibilities separate.
- Prefer simple, maintainable architecture.
- Avoid unnecessary dependencies.
- Avoid giant components.
- Avoid turning the whole app into client components without reason.

## Reviewer's Unusual Test

The reviewer may:
- use DevTools
- throttle the network
- disconnect/reconnect
- refresh during loading
- rapidly click
- inspect console errors
- test multiple accounts

Design and implementation must handle these conditions honestly.

## Git Hygiene

Do not commit:
- `.env`
- secrets
- node_modules
- build artifacts
- temporary generated files

## Agent Completion Rule

Before reporting completion:
- typecheck
- lint
- test
- production build

For deployment work:
- also verify the public URL
- verify seeded data
- verify two demo accounts
- verify cross-user edit/delete
