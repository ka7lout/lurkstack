# Project Contract

## Purpose

This repository implements the MarkTrack Agentic Engineer Intern assessment.

The application is a small, professional, text-only social feed.

This document is a hard engineering contract for every AI agent and human contributor working on the project.

The original assignment is stored in:

`docs/MARKTRACK_ASSIGNMENT.md`

The original assignment remains the authoritative source for what MarkTrack explicitly asked for.

This contract adds implementation constraints and testable interpretations. It must not contradict the original assignment.

---

# 1. Non-Negotiable Product Requirements

## Authentication

The application must support:

- Email/password signup
- Email/password login
- Logout
- Persistent authenticated sessions
- Server-side identification of the authenticated user

Passwords must never be stored in plaintext.

Unauthenticated users must not be able to perform authenticated mutations.

---

## Shared Feed

There is one shared feed.

Posts are text-only.

Required:

- Create post
- Read posts
- Edit post
- Delete post

No image uploads.

No file uploads.

No video uploads.

---

## CRITICAL POST PERMISSION RULE

This is the most important unusual requirement in the assignment.

### Any authenticated user may edit any post.

### Any authenticated user may delete any post.

Example:

```text
User A creates Post X.

User B logs in.

User B edits Post X.

SUCCESS is required.
```

And:

```text
User A creates Post X.

User B logs in.

User B deletes Post X.

SUCCESS is required.
```

Do NOT implement owner-only post permissions.

Do NOT use:

```ts
if (post.authorId !== currentUser.id) {
  reject();
}
```

for edit/delete operations.

Do NOT hide edit/delete actions in the UI because the current user is not the author.

This behavior is intentionally unusual and must not be "normalized" to normal social-media permissions.

---

# 2. Comments

Authenticated users must be able to comment on any post.

Comments must be persisted.

Empty comments must be rejected.

The interface must correctly handle:

- submitting
- success
- validation failure
- server failure
- retry/recovery
- long comments
- many comments

---

# 3. Reactions

A simple like system is sufficient.

Authenticated users must be able to react to posts.

Recommended behavior:

- one like per user per post
- clicking again toggles the user's like state

The database must prevent duplicate likes.

Required database constraint:

```text
unique(userId, postId)
```

The UI may use optimistic updates, but it must roll back if the server rejects the operation.

---

# 4. Profiles

Every user must have a profile page.

The profile must show:

- user identity
- posts written by that user

The profile must gracefully handle:

- loading
- user exists
- user has no posts
- user not found
- server failure

---

# 5. Seed Data

The application must be seeded before review.

Target minimum:

- 6 fictional users
- 36 fictional posts
- 20 comments
- 40 likes

The exact counts may be higher.

The feed must never be empty after seeding.

Use realistic fictional names and realistic text.

Do not use private real-person data.

Do not use lorem ipsum.

At least two seeded accounts must have working credentials for reviewer testing.

Create a reproducible seed command.

Recommended:

```bash
npm run db:seed
```

---

# 6. Required UI Quality

The application must look like a real small product, not an unstyled template.

Visual priorities:

1. Readability
2. Consistency
3. Strong hierarchy
4. Good spacing
5. Responsive behavior
6. Clear interaction states
7. Professional typography
8. Accessible controls

The design must remain restrained.

Avoid:

- excessive gradients
- neon visuals
- heavy glassmorphism
- 3D effects
- animated backgrounds
- giant decorative hero sections
- unnecessary visual effects
- excessive motion

The assignment says "Nothing fancy."

Interpret this as:

```text
polished engineering > decorative complexity
```

---

# 7. UI Component System

Use:

- shadcn/ui
- Tailwind CSS
- Lucide icons

Do not introduce another primary UI library unless a documented technical requirement makes it necessary.

Do not mix several unrelated component systems.

Prefer consistency over novelty.

---

# 8. Required UI States

Every important page/component must account for:

- default
- hover
- focus
- active
- disabled
- loading
- success
- error
- empty
- mobile

Required dedicated experiences include:

## Page states

- Loading
- Not Found
- General Error

## Data loading

- Feed skeleton
- Profile skeleton
- Comment skeleton
- Post/list skeletons where appropriate

Skeletons should preserve the approximate final layout to reduce layout shift.

## Mutation states

- Creating post
- Editing post
- Deleting post
- Submitting comment
- Liking/unliking
- Login submission
- Signup submission

## Recovery states

- Retry
- Reconnect
- Session expired
- Failed mutation
- Failed data request

---

# 9. Network Failure Rules

The application must be designed to remain understandable under:

- slow network
- high latency
- offline mode
- request failure
- timeout
- temporary server failure
- database failure
- reconnect

Already-loaded content should remain usable where practical.

Never show a success state if the server rejected the operation.

Never lose user-entered content unnecessarily after a recoverable failure.

Do not submit the same mutation repeatedly because the user clicked rapidly.

---

# 10. Validation Rules

Validation must happen on the server for all mutations.

Client-side validation may improve UX, but it is not sufficient by itself.

At minimum validate:

## Signup

- valid email format
- required fields
- acceptable password
- duplicate email

## Login

- required fields
- invalid credentials

## Post

- non-empty content
- reasonable maximum content length

## Comment

- non-empty content
- reasonable maximum content length

Do not trust identifiers or permissions supplied only by the browser.

---

# 11. Authentication Security

The current authenticated user must be resolved server-side.

Never determine the authenticated identity solely from:

```text
userId
```

sent by the client.

Never store plaintext passwords.

Never commit:

- database credentials
- API keys
- session secrets
- `.env` files containing secrets

Do not expose server-only environment variables to the browser.

---

# 12. Database Rules

Use:

- PostgreSQL
- Neon
- Drizzle ORM

Core application entities:

```text
User
Post
Comment
PostLike
```

Expected relationships:

```text
Post.authorId -> User.id
Comment.postId -> Post.id
Comment.authorId -> User.id
PostLike.postId -> Post.id
PostLike.userId -> User.id
```

Use:

- foreign keys
- unique constraints
- useful indexes
- timestamps

Do not create a second competing user system beside the authentication system.

---

# 13. Next.js Rules

Use:

- Next.js App Router
- TypeScript strict mode

Prefer:

- Server Components for server-rendered data
- Client Components only where interactivity requires them
- Server Actions / Server Functions where appropriate
- Route Handlers where appropriate

Do not convert the entire application to:

```text
"use client"
```

without a technical reason.

Do not introduce unnecessary client-side fetching.

Avoid caching strategies that make recently created posts, comments, or likes appear stale.

---

# 14. Frontend/Backend Separation

UI components should not contain database logic.

Data access should be separated from visual components.

Keep types and data contracts explicit.

The backend agent must integrate the existing frontend rather than redesigning it without reason.

The frontend agent must not invent backend behavior.

---

# 15. Testing Contract

Tests are part of the implementation.

They must not be removed to hide defects.

At minimum, acceptance coverage must prove:

## AUTH

- Signup works
- Login works
- Logout works
- Invalid credentials fail correctly

## POSTS

- Create post works
- Edit own post works
- Edit another user's post works
- Delete own post works
- Delete another user's post works

## COMMENTS

- Comment creation works
- Empty comment is rejected

## LIKES

- Like works
- Duplicate likes cannot exist
- Toggle behavior works if implemented

## PROFILES

- Profile loads
- Profile shows the user's posts
- Unknown profile is handled

## SEED

- Feed is populated
- Multiple users exist
- Existing comments exist
- Existing likes exist

The cross-user edit/delete tests are mandatory and must remain permanently.

---

# 16. Scope Control

The required application is intentionally small.

Do not add these unless the assignment is already fully complete and there is a compelling reason:

- Messaging
- Follows
- Notifications
- Payments
- Image uploads
- File uploads
- Admin dashboard
- AI chatbot
- Complex social graph
- Complex permission system
- Unrelated settings

Do not sacrifice required functionality for optional features.

---

# 17. Dependency Rules

Before adding a package:

1. Check whether the existing stack already solves the problem.
2. Prefer established, focused packages.
3. Avoid large dependencies for tiny tasks.
4. Do not add another UI framework.

Every dependency should have a concrete reason.

---

# 18. Agent Rules

Every AI agent must:

1. Read this file before editing code.
2. Read the original assignment.
3. Read the relevant design/architecture contracts.
4. Preserve all non-negotiable requirements.
5. Verify changes with tests/checks.
6. Report actual results rather than assumptions.

Agents must not:

- invent requirements
- silently change requirements
- remove tests because they fail
- normalize unusual permissions
- add unrelated scope
- claim work is complete without verification

---

# 19. File Ownership

Unless the active task explicitly changes this:

## Design agent may primarily modify

```text
docs/DESIGN_SPEC.md
```

## Frontend agent may primarily modify

```text
app/
components/
styles/
public/
```

and frontend-related configuration when necessary.

## Backend agent may primarily modify

```text
lib/
db/
server-side code
auth configuration
database configuration
tests/
```

## Release agent may modify

```text
deployment configuration
README.md
docs/
```

All agents must avoid unnecessary changes outside their responsibility.

---

# 20. Git Rules

Do not commit:

- `.env`
- secrets
- credentials not intentionally created for demo use
- temporary files
- build artifacts
- node_modules

Keep commits understandable.

Do not rewrite unrelated code during a focused task.

---

# 21. Reviewer Experience

Assume the reviewer may:

- open the public URL days later
- refresh repeatedly
- use DevTools
- throttle the network
- disconnect the network
- reconnect
- resize the browser
- use mobile dimensions
- rapidly click buttons
- submit invalid data
- inspect the console
- test two different accounts

The application should remain coherent and honest about its state.

---

# 22. Definition of Done

The application is not complete merely because the code compiles.

It is complete when:

- all required flows work
- the database persists real data
- seed data exists
- two demo accounts work
- cross-user edit works
- cross-user delete works
- tests pass
- production build passes
- public deployment works
- no secrets are exposed
- responsive UI works
- loading/error/empty states exist
- README explains the project
- GitHub repository is clean

---

# 23. Final Principle

The agents are free to choose implementation details inside the contract.

They are NOT free to change the contract.

When uncertain:

```text
Original assignment
        >
Project contract
        >
Acceptance tests
        >
Agent preference
```

The correct implementation is the one that satisfies the documented requirements and the executable tests, even when a requirement is unusual.
