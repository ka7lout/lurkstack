# Acceptance Matrix

## Purpose

This document converts the MarkTrack assignment into explicit, testable acceptance criteria.

An AI agent must not infer success from appearance or from a successful build alone.

A requirement is considered implemented only when its expected behavior can be demonstrated or tested.

Source of truth:

- `docs/MARKTRACK_ASSIGNMENT.md`
- `docs/PROJECT_CONTRACT.md`

---

# Status Vocabulary

Use only these factual statuses:

- NOT TESTED
- PASS
- FAIL
- BLOCKED

Do not use subjective ratings or scores.

---

# AUTHENTICATION

## AUTH-01 — Signup

### Requirement
A new user can create an account using an email address and password.

### Given
No account exists for the email.

### When
The user submits valid signup information.

### Then
- The account is created.
- The user is handled according to the authentication flow.
- The password is never stored as plaintext.
- The user receives a usable authenticated/session state if supported by the selected auth flow.

### Negative tests
- Missing email
- Invalid email
- Missing password
- Invalid/too-weak password according to the implemented policy
- Duplicate email

### Test level
End-to-end + server/database verification.

---

## AUTH-02 — Login

### Requirement
An existing user can log in with email and password.

### Given
A valid seeded or registered account exists.

### When
Correct credentials are submitted.

### Then
The user becomes authenticated and can access the feed.

### Negative tests
- Wrong password
- Unknown email
- Empty fields

### Test level
End-to-end.

---

## AUTH-03 — Logout

### Requirement
An authenticated user can log out.

### When
The user selects logout.

### Then
- The session becomes unauthenticated.
- Protected content/mutations are no longer available.
- The UI returns to an appropriate unauthenticated state.

### Test level
End-to-end.

---

## AUTH-04 — Session Persistence

### Requirement
The authenticated session behaves consistently across normal page refreshes.

### When
An authenticated user refreshes the application.

### Then
The user remains authenticated according to the selected persistent-session design.

### Test level
End-to-end.

---

# FEED

## FEED-01 — Shared Feed

### Requirement
Authenticated users see one shared feed.

### Given
User A creates a post.

### When
User B logs in.

### Then
User B can see User A's post in the shared feed.

### Test level
End-to-end.

---

## FEED-02 — Feed Is Populated

### Requirement
The initial seeded feed is not empty.

### Expected
The reviewer sees multiple posts immediately after opening the feed.

### Failure condition
An empty feed after seeding is an automatic failure.

### Test level
Production smoke test + database verification.

---

# POSTS

## POST-01 — Create

### Requirement
An authenticated user can create a text-only post.

### When
Valid post content is submitted.

### Then
- The post is persisted.
- It appears in the shared feed.
- The post has a valid author and timestamp.

### Negative tests
- Empty post
- Whitespace-only post
- Excessive length according to the documented limit

### Test level
End-to-end + database verification.

---

## POST-02 — Edit Own Post

### Requirement
An authenticated user can edit a post they created.

### When
The user submits valid new content.

### Then
The post content changes and persists after refresh.

### Test level
End-to-end.

---

## POST-03 — Edit Another User's Post

### Requirement
An authenticated user can edit a post created by another authenticated user.

### Given
- User A owns Post X.
- User B is authenticated.

### When
User B edits Post X.

### Then
The operation succeeds.

### Critical rule
Owner-only authorization MUST NOT block this action.

### Critical test
This test must remain in the automated test suite.

### Test level
End-to-end + server authorization test.

---

## POST-04 — Delete Own Post

### Requirement
An authenticated user can delete a post they created.

### When
The user confirms deletion.

### Then
The post is removed from the feed and database.

### Test level
End-to-end.

---

## POST-05 — Delete Another User's Post

### Requirement
An authenticated user can delete a post created by another authenticated user.

### Given
- User A owns Post X.
- User B is authenticated.

### When
User B deletes Post X.

### Then
The operation succeeds.
The post is removed from the feed and database.

### Critical rule
Owner-only authorization MUST NOT block this action.

### Critical test
This test must remain in the automated test suite.

### Test level
End-to-end + server authorization test.

---

## POST-06 — Text Only

### Requirement
Posts are text-only.

### Expected
No image or file upload functionality is required by the application.

### Failure condition
Required assignment scope is expanded into file/image upload without explicit reason.

### Test level
Manual/source inspection.

---

# COMMENTS

## COMMENT-01 — Add Comment

### Requirement
An authenticated user can comment on any post.

### Given
A post exists.

### When
An authenticated user submits valid comment text.

### Then
The comment is persisted and displayed.

### Test level
End-to-end.

---

## COMMENT-02 — Empty Comment Rejection

### Requirement
Empty comments are rejected.

### Negative tests
- Empty string
- Whitespace-only comment

### Test level
End-to-end + server validation.

---

## COMMENT-03 — Comment Error Recovery

### Requirement
If comment submission fails, the user receives clear feedback and can recover/retry.

### Expected
- No false success state
- Input is preserved when practical
- Retry is possible when appropriate

### Test level
Manual network/error test.

---

# LIKES / REACTIONS

## LIKE-01 — Like

### Requirement
An authenticated user can react to a post.

### Expected
The visible like count/state updates correctly and the server persists the reaction.

### Test level
End-to-end.

---

## LIKE-02 — Duplicate Like Prevention

### Requirement
A user must not create multiple like rows for the same post.

### Expected
The database enforces uniqueness for:

```text
(userId, postId)
```

### Test level
Database + concurrency/repeated-click test where practical.

---

## LIKE-03 — Like Failure Rollback

### Requirement
If an optimistic like mutation fails, the UI does not permanently show an unconfirmed like.

### Expected
- Optimistic state appears immediately if implemented.
- Failed mutation rolls back.
- User receives a clear error/recovery state.

### Test level
Manual network/server failure test.

---

# PROFILES

## PROFILE-01 — User Profile

### Requirement
Each user has a profile page.

### Expected
Profile displays:
- user identity
- posts written by that user

### Test level
End-to-end.

---

## PROFILE-02 — Profile With No Posts

### Requirement
A valid user with no authored posts has a deliberate empty state.

### Test level
Manual.

---

## PROFILE-03 — Profile Not Found

### Requirement
An unknown user/profile is handled gracefully.

### Expected
A dedicated not-found state, not a raw framework error.

### Test level
End-to-end/manual.

---

# SEEDED DATA

## SEED-01 — Multiple Users

### Requirement
The application starts with several distinct users.

### Target
6 or more fictional users.

### Test level
Database verification.

---

## SEED-02 — Dozens of Posts

### Requirement
The application starts with dozens of posts.

### Target
36 or more posts.

### Test level
Database verification + production smoke test.

---

## SEED-03 — Existing Comments

### Requirement
The application starts with existing comments.

### Target
20 or more comments.

### Test level
Database verification + visual inspection.

---

## SEED-04 — Existing Reactions

### Requirement
The application starts with existing reactions.

### Target
40 or more likes.

### Test level
Database verification + visual inspection.

---

## SEED-05 — Reproducible Seed

### Requirement
Seed data can be recreated through a documented command.

### Expected
The repository provides a deterministic or reproducible seed workflow.

### Example
```bash
npm run db:seed
```

### Test level
Command execution.

---

# UI / DESIGN

## UI-01 — Professional Appearance

### Requirement
The application is designed and professional-looking.

### Expected
- coherent visual system
- consistent typography
- consistent spacing
- clear hierarchy
- polished controls
- good readability

### Failure examples
- raw browser defaults
- visibly unfinished sections
- inconsistent component styles

### Test level
Manual review.

---

## UI-02 — Responsive Layout

### Requirement
The application works on desktop and mobile sizes.

### Test
Check:
- desktop
- tablet
- narrow mobile viewport

### Expected
No horizontal overflow or unusable controls.

### Test level
Manual + browser resize.

---

## UI-03 — Loading States

### Requirement
Important data and mutations have intentional loading states.

### Required examples
- feed loading
- profile loading
- comment loading
- post submission
- post edit
- post delete
- login submission
- signup submission
- like mutation

### Preferred behavior
Use skeletons for content loading when appropriate.

### Test level
Network throttling/manual.

---

## UI-04 — Error States

### Requirement
Errors are presented intentionally and understandably.

### Required examples
- feed error
- profile error
- login error
- signup error
- post mutation failure
- comment failure
- like failure
- generic unexpected error

### Test level
Manual failure injection / source inspection.

---

## UI-05 — Empty States

### Requirement
Empty content states are intentional.

### Required examples
- no comments
- profile with no posts
- other genuinely empty states in the implemented scope

### Test level
Manual.

---

## UI-06 — Not Found

### Requirement
Unknown routes/resources have a professional not-found experience.

### Test level
End-to-end/manual.

---

## UI-07 — Destructive Confirmation

### Requirement
Deleting a post requires an intentional confirmation interaction.

### Expected
- clear destructive action
- cancel option
- loading state while deleting
- success/failure feedback

### Test level
End-to-end/manual.

---

# NETWORK / FAILURE RESILIENCE

## NET-01 — Offline

### Scenario
Browser network is disconnected.

### Expected
- application does not falsely report successful mutations
- useful offline/recovery messaging is shown where relevant
- already-loaded content remains usable where practical

### Test level
DevTools offline mode.

---

## NET-02 — Slow Network

### Scenario
Network is throttled substantially.

### Expected
- skeleton loading appears
- UI remains responsive
- pending mutations are visibly pending
- repeated submission is prevented

### Test level
DevTools network throttling.

---

## NET-03 — Failed Request

### Scenario
A request fails.

### Expected
- user sees a clear error
- no false success
- retry/recovery path when appropriate

### Test level
DevTools/request failure/manual.

---

## NET-04 — Mutation Failure After Optimistic UI

### Scenario
An optimistic action is displayed, then the server rejects the mutation.

### Expected
- UI rolls back to the confirmed server state
- user receives understandable feedback

### Test level
Manual failure injection.

---

## NET-05 — Reconnection

### Scenario
Network is disconnected and then restored.

### Expected
The interface communicates recovery appropriately and does not remain indefinitely in a stale error/loading state.

### Test level
DevTools offline/online toggle.

---

# SECURITY / SERVER BEHAVIOR

## SEC-01 — Server-Side Current User

### Requirement
The server determines the current authenticated user from the authenticated session.

### Failure condition
Mutation identity is trusted solely from a browser-provided user ID.

### Test level
Source review + malicious request testing.

---

## SEC-02 — No Plaintext Passwords

### Requirement
Passwords are not stored in plaintext.

### Test level
Database/source inspection.

---

## SEC-03 — Unauthenticated Mutation Protection

### Requirement
Unauthenticated requests cannot perform:
- create post
- edit post
- delete post
- create comment
- create/remove like as an authenticated action

### Test level
End-to-end/direct request testing.

---

## SEC-04 — Required Cross-User Mutation Access

### Requirement
Authentication is required, but post ownership is NOT required for edit/delete.

### Expected
Authenticated User B can edit/delete User A's post.

### This is intentionally different from normal social-media authorization.

### Test level
End-to-end + server implementation inspection.

---

## SEC-05 — No Secrets in Repository

### Requirement
No production secrets or private credentials are committed.

### Check
- `.env`
- API keys
- database credentials
- auth secrets

### Test level
Repository/source inspection.

---

# DATABASE

## DB-01 — PostgreSQL Persistence

### Requirement
Required application data persists in PostgreSQL.

### Test level
Database verification.

---

## DB-02 — Foreign Keys

### Requirement
Application relationships are enforced through appropriate foreign keys.

### Test level
Schema inspection.

---

## DB-03 — Like Uniqueness

### Requirement
A duplicate `(userId, postId)` like cannot exist.

### Test level
Schema + database test.

---

## DB-04 — Useful Indexing

### Requirement
Frequently queried relationships have appropriate indexes.

### Expected likely indexes
- post author
- post creation time
- comment post
- comment author
- like post
- unique like pair

### Test level
Schema review.

---

# NEXT.JS / ENGINEERING QUALITY

## ENG-01 — Type Safety

### Requirement
TypeScript strict checking passes.

### Test
Production typecheck.

---

## ENG-02 — Lint

### Requirement
Linting passes without blocking errors.

### Test
Lint command.

---

## ENG-03 — Production Build

### Requirement
The application builds successfully for production.

### Test
Production build command.

---

## ENG-04 — Component Boundaries

### Requirement
UI and database responsibilities are separated.

### Failure examples
- database logic inside visual components
- huge monolithic page component
- duplicated backend logic

### Test level
Source review.

---

## ENG-05 — Error Propagation

### Requirement
Expected failures are handled intentionally.

### Failure examples
- empty catch blocks
- ignored rejected promises
- silently swallowed database failures

### Test level
Source review + runtime tests.

---

# DEPLOYMENT

## DEPLOY-01 — Public URL

### Requirement
The reviewer can access the application through a public URL.

### Failure
localhost or private-only URL.

### Test level
Production smoke test.

---

## DEPLOY-02 — Deployment Remains Functional

### Requirement
The public application remains usable when reviewed later.

### Test
Revisit the public URL after a period of inactivity.

### Test level
Production smoke test.

---

## DEPLOY-03 — Free-Tier Constraint

### Requirement
The required application can be deployed within the specified free-tier constraints.

### Expected target
- Netlify Free
- Neon Free

### Test level
Deployment configuration review.

---

## DEPLOY-04 — Demo Accounts

### Requirement
At least two seeded accounts have working credentials.

### Test
Log into the production deployment using both accounts.

### Test level
Production end-to-end.

---

# GITHUB / DELIVERY

## DELIVER-01 — GitHub Repository

### Requirement
A GitHub repository containing the application source is available to the reviewer.

### Test level
Repository inspection.

---

## DELIVER-02 — README

### Requirement
The repository has useful setup and usage instructions.

### At minimum
- overview
- stack
- setup
- environment variables
- database setup
- seed
- tests
- demo credentials
- deployment

### Test level
Repository inspection.

---

## DELIVER-03 — Reported Development Time

### Requirement
The submission reports approximately how long the implementation took.

### Test level
Submission review.

---

# FINAL SUBMISSION GATE

A submission is considered factually ready only when all critical requirements below are verified:

- AUTH-01
- AUTH-02
- AUTH-03
- FEED-01
- FEED-02
- POST-01
- POST-02
- POST-03
- POST-04
- POST-05
- COMMENT-01
- LIKE-01
- LIKE-02
- PROFILE-01
- SEED-01
- SEED-02
- SEED-03
- SEED-04
- UI-01
- UI-02
- SEC-01
- SEC-02
- SEC-03
- SEC-04
- DEPLOY-01
- DEPLOY-02
- DEPLOY-04
- DELIVER-01
- DELIVER-02

The most critical unusual behavior is:

```text
Authenticated User B
        ↓
edit User A's post
        ↓
PASS
```

and:

```text
Authenticated User B
        ↓
delete User A's post
        ↓
PASS
```

Any failure in either flow blocks submission.

---

# Suggested Test Matrix

| ID | Area | Critical | Automated | Manual |
|---|---|---:|---:|---:|
| AUTH-01 | Signup | Yes | Yes | Optional |
| AUTH-02 | Login | Yes | Yes | Optional |
| AUTH-03 | Logout | Yes | Yes | Optional |
| AUTH-04 | Session | No | Yes | Yes |
| FEED-01 | Shared feed | Yes | Yes | Yes |
| FEED-02 | Seeded feed | Yes | Yes | Yes |
| POST-01 | Create | Yes | Yes | Yes |
| POST-02 | Edit own | Yes | Yes | Yes |
| POST-03 | Edit other | **Yes** | **Yes** | **Yes** |
| POST-04 | Delete own | Yes | Yes | Yes |
| POST-05 | Delete other | **Yes** | **Yes** | **Yes** |
| COMMENT-01 | Comment | Yes | Yes | Yes |
| LIKE-01 | Like | Yes | Yes | Yes |
| LIKE-02 | Duplicate prevention | Yes | Yes | Optional |
| PROFILE-01 | Profile | Yes | Yes | Yes |
| UI-03 | Loading | No | Partial | Yes |
| UI-04 | Errors | No | Partial | Yes |
| NET-01 | Offline | No | No | Yes |
| NET-02 | Slow network | No | No | Yes |
| NET-04 | Optimistic rollback | No | Partial | Yes |
| SEC-01 | Server identity | Yes | Partial | Yes |
| SEC-04 | Cross-user permissions | **Yes** | **Yes** | **Yes** |
| DEPLOY-01 | Public URL | Yes | Yes | Yes |
| DEPLOY-04 | Demo accounts | Yes | Yes | Yes |

---

# Agent Instruction

When working from this document:

1. Do not remove or weaken a requirement because it is unusual.
2. Do not mark a requirement PASS without evidence.
3. Do not substitute visual similarity for functional verification.
4. Do not substitute a successful build for behavioral tests.
5. Do not hide failures.
6. Do not add subjective scores.
7. Preserve the cross-user edit/delete tests permanently.

The acceptance matrix is a verification layer, not an implementation preference.
