# MarkTrack Design Specification

## Visual Direction

**Aesthetic**: Professional, calm, text-forward. No decorative excess. Inspired by early Twitter/X's clarity, Bluesky's minimalism, and modern professional tools (Linear, Notion).

**Core Principles**:
- Clean typography hierarchy
- Strong information architecture
- Restrained color palette (one primary, limited accents)
- Subtle borders and shadows for depth without noise
- Disciplined spacing creates rhythm
- Clear interactive states (hover, focus, active, disabled, loading, error)
- Content density that reads well on desktop and mobile
- Motion only for state transitions and feedback

**NOT**:
- Gradients
- Neon or bright accents
- Glassmorphism
- Animated backgrounds
- 3D effects
- Giant hero sections
- Excessive decorative details

---

## Color Tokens

### Primary Palette
```css
--color-primary: #1f2937;        /* Dark charcoal, main text and UI */
--color-primary-light: #374151;  /* Slightly lighter primary */
--color-primary-lighter: #6b7280; /* Muted text, secondary actions */

--color-background: #ffffff;     /* Main background */
--color-surface: #f9fafb;        /* Elevated surfaces, cards, inputs */
--color-border: #e5e7eb;         /* Subtle borders */
--color-border-dark: #d1d5db;    /* Darker borders, focus states */

--color-text-primary: #1f2937;   /* Main text */
--color-text-secondary: #6b7280; /* Secondary text, timestamps */
--color-text-muted: #9ca3af;     /* Disabled, very secondary */

--color-accent: #0ea5e9;         /* Links, primary actions (sky blue) */
--color-accent-hover: #0284c7;   /* Darker sky blue on hover */
--color-accent-focus: #075985;   /* Even darker for focus */

--color-success: #10b981;        /* Success states, confirmations */
--color-success-light: #d1fae5;  /* Success background */

--color-error: #ef4444;          /* Errors, destructive actions */
--color-error-light: #fee2e2;    /* Error background */

--color-warning: #f59e0b;        /* Warnings */
--color-warning-light: #fef3c7;  /* Warning background */

--color-disabled: #d1d5db;       /* Disabled state */
--color-disabled-text: #9ca3af;  /* Disabled text */
```

### Semantic Tokens
- `--color-interactive`: `--color-accent` (buttons, links)
- `--color-destructive`: `--color-error` (delete, logout)
- `--color-feedback-success`: `--color-success`
- `--color-feedback-error`: `--color-error`
- `--color-focus-ring`: `--color-accent` with opacity 0.5

---

## Typography

### Font Families
- **Primary Sans**: "Inter", system fonts (fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
- **Monospace** (for usernames, codes if needed): "JetBrains Mono", "Fira Code", monospace

### Type Scale
```
Heading 1:  32px / 40px, weight 700, letter-spacing: -0.5px
Heading 2:  24px / 32px, weight 700, letter-spacing: -0.3px
Heading 3:  20px / 28px, weight 600, letter-spacing: -0.2px
Heading 4:  16px / 24px, weight 600, letter-spacing: 0px

Body:       14px / 22px, weight 400, letter-spacing: 0px
Body Bold:  14px / 22px, weight 600, letter-spacing: 0px
Body Small: 13px / 20px, weight 400, letter-spacing: 0px
Body Small Bold: 13px / 20px, weight 600, letter-spacing: 0px

Label:      12px / 16px, weight 600, letter-spacing: 0.5px, uppercase
Caption:    12px / 16px, weight 400, letter-spacing: 0px
```

### Line Height & Letter Spacing
- Headings: tighter line heights (1.2–1.25) for visual impact
- Body: relaxed (1.5–1.6) for readability
- All caps labels: +0.5px letter-spacing for clarity

---

## Spacing Scale

All spacing uses an 8px base unit:

```
0px    – 2px    (xs): tight kerning, gap between inline elements
4px          (sm): small gaps, internal component spacing
8px          (md): standard spacing, margins
12px         (lg): larger gaps, section spacing
16px         (xl): major section gaps
24px         (2xl): large section separators
32px         (3xl): page-level spacing
48px         (4xl): hero/major gaps
```

### Common Patterns
- **Component internal padding**: 12px–16px
- **Component gaps (flex/grid)**: 8px–12px
- **Page horizontal margins**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Card vertical padding**: 16px
- **Card horizontal padding**: 16px
- **Form field height**: 40px (touch-friendly)
- **Button height**: 40px
- **Post card spacing**: 16px padding, 12px gaps between elements

---

## Border Radius

```
--radius-sm: 4px     (subtle, form fields, small components)
--radius-md: 8px     (primary, buttons, cards, inputs)
--radius-lg: 12px    (larger cards, modals, dropdowns)
--radius-full: 9999px (pill buttons, avatars)
```

### Usage
- **Buttons**: 8px
- **Input fields**: 8px
- **Cards / Post cards**: 8px
- **Modals**: 12px
- **Avatars**: 50% (circular)
- **Pill badges**: 9999px

---

## Shadows

Keep shadows subtle; use only for elevation:

```
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)

--shadow-focus: 0 0 0 3px rgba(14, 165, 233, 0.1) /* Accent with opacity */
```

### Usage
- **Cards, surfaces**: `--shadow-sm` by default
- **Hovered cards**: `--shadow-md` (no scale, just shadow increase)
- **Dropdown menus**: `--shadow-md`
- **Modal backdrop**: rgba(0, 0, 0, 0.5)
- **Focus rings**: `--shadow-focus` (not outline)

---

## Layout Widths

### Breakpoints
```
Mobile:  320px–767px
Tablet:  768px–1023px
Desktop: 1024px+
```

### Container Widths
- **Mobile**: full width with 16px horizontal padding
- **Tablet**: 90% max-width, centered
- **Desktop**: 1200px max-width, centered
- **Feed content area**: 600px (optimized for reading)

### Navigation
- **Desktop header**: full-width, 56px height, 24px horizontal padding
- **Mobile header**: full-width, 56px height, 16px horizontal padding
- **Mobile bottom nav**: full-width, 56px height (if applicable)

---

## Layout Structure

### Desktop Layout
```
┌─────────────────────────────────────┐
│         Header / Navigation         │ (56px)
├─────────────────────────────────────┤
│                                     │
│  Sidebar (200px)  │  Feed (600px)   │  Right Rail (optional)
│                   │                 │
│                   │   - Post Composer
│                   │   - Post Cards
│                   │   - Load More / Pagination
│                   │                 │
└─────────────────────────────────────┘
```

### Tablet Layout
```
┌─────────────────────────────────────┐
│         Header / Navigation         │ (56px)
├─────────────────────────────────────┤
│                                     │
│     Sidebar (Collapsed)             │
│     + Feed Content (90% width, centered)
│                                     │
└─────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────────────────────┐
│    Header (56px, compact)           │
│    - Back / Menu                    │
│    - Title / Logo                   │
│    - User Menu                      │
├─────────────────────────────────────┤
│                                     │
│    Feed (full width, 16px padding)  │
│    - Post Composer (floating area)  │
│    - Post Cards                     │
│                                     │
├─────────────────────────────────────┤
│    Bottom Navigation (56px)         │
│    - Home / Feed                    │
│    - Profile                        │
│    - Menu / Settings                │
└─────────────────────────────────────┘
```

---

## Navigation

### Desktop Header
- **Left**: MarkTrack logo / branding (clickable to home)
- **Center**: Navigation tabs (Home, Explore, optional)
- **Right**: User menu (dropdown with Profile, Logout)
- **Height**: 56px
- **Background**: `--color-background` with `--shadow-sm` below
- **Sticky**: yes, stays at top during scroll

### Mobile Navigation
- **Top header**: Logo, hamburger/menu button, user avatar
- **Bottom nav**: Tab bar (Home, Profile, Menu)
- **Active indicator**: Underline or background highlight on active tab
- **Height**: 56px for header, 56px for bottom nav

### User Menu Dropdown
- **Trigger**: User avatar or name in header
- **Items**:
  - Profile (link)
  - Settings (if applicable)
  - Logout (button)
- **Position**: Right-aligned, below trigger
- **Behavior**: Click outside closes, ESC closes, trap focus inside

---

## Component: Login Page

### Layout
- Centered form, 400px max-width
- Light background with subtle card
- No hero image or decorative elements

### Form Fields
```
Email Input
- Placeholder: "you@example.com"
- Type: email
- Validation on blur or submit
- Error message below field

Password Input
- Placeholder: "••••••••"
- Type: password
- Validation on submit
- Error message below field
- "Forgot password?" link (design intent only; backend not required)
```

### States

#### Default
- Clean form, empty fields
- Submit button: enabled, text "Log In"
- "Don't have an account? Sign up" link below

#### Focused
- Field has focus ring (border-color: var(--color-accent), shadow: var(--shadow-focus))
- Text cursor visible

#### Invalid (Form-Level)
- Email field border: var(--color-error)
- Error message: "Invalid email address" (12px, var(--color-error))
- Password field border: var(--color-error)
- Error message: "Incorrect password" or "Email or password is incorrect"

#### Submitting
- Button text: "Logging in..."
- Button disabled (opacity 0.6, cursor not-allowed)
- Button shows loading spinner (if appropriate)
- Form inputs remain enabled (user can edit)

#### Server Error
- Red alert box above form
- Message: "Something went wrong. Please try again."
- Button remains clickable to retry

#### Success
- Brief success toast: "Logged in. Redirecting..."
- Page navigates to feed

### Component Anatomy
```html
<form>
  <h1>Log In</h1>
  
  {/* Error alert if present */}
  
  <div class="form-group">
    <label>Email</label>
    <input type="email" />
    {/* Error message if present */}
  </div>
  
  <div class="form-group">
    <label>Password</label>
    <input type="password" />
    {/* Error message if present */}
  </div>
  
  <button type="submit">Log In</button>
  <p>Don't have an account? <a href="/signup">Sign up</a></p>
</form>
```

---

## Component: Signup Page

### Layout
Same as login (centered form, 400px max-width)

### Form Fields
```
Name Input
- Placeholder: "Full Name"
- Validation: required, min 2 chars

Email Input
- Placeholder: "you@example.com"
- Validation: valid email, unique (server-side)

Password Input
- Placeholder: "••••••••"
- Validation: min 8 chars, complexity hints

Password Confirmation
- Placeholder: "••••••••"
- Validation: must match password field
```

### States

#### Default
- Empty form
- Submit button: "Create Account"
- "Already have an account? Log in" link

#### Focused
- Same focus ring as login

#### Validation Errors
```
Name field:
- Error: "Name must be at least 2 characters"

Email field:
- Error: "Invalid email address" OR "This email is already in use"

Password field:
- Hint below: "At least 8 characters"
- Error if too short: "Password must be at least 8 characters"

Confirm field:
- Error: "Passwords don't match"
```

#### Submitting
- Button: "Creating account..."
- Button disabled
- Show optional spinner

#### Success
- Toast: "Account created. Logging you in..."
- Navigate to feed

#### Server Error
- Alert: "Couldn't create account. Please try again."

---

## Component: Main Feed Page

### Layout
- Header + navigation (sticky)
- Post composer section (sticky or floating)
- Feed container with post cards
- Load more / infinite scroll at bottom
- Right sidebar optional (for design completeness, can be hidden on tablet/mobile)

### Post Composer

#### Default State
- Card-like container, minimal elevation
- Textarea with placeholder: "What's on your mind?"
- Small user avatar left of textarea
- Submit button (disabled until text entered)
- Character count: "{count}/280" right-aligned, subtle color

#### Focused
- Textarea border: var(--color-accent)
- Focus ring visible
- Submit button remains visible

#### Character Limit Approaching
- Character count color changes to var(--color-warning) when > 200 chars
- Character count color changes to var(--color-error) when >= 280 chars (at limit)

#### Text Entered
- Submit button: enabled, text "Post"
- Clear styling to make button obvious

#### Submitting
- Button text: "Posting..."
- Button disabled
- Show spinner in button
- Textarea remains editable (user can cancel and edit)
- Composer may show optimistic preview below

#### Success
- Post appears immediately in feed (if optimistic) or after response
- Textarea clears
- Toast: "Post created" (optional, subtle)
- Character count resets to 0

#### Failure
- Button remains enabled
- Toast or inline error: "Couldn't post. Try again."
- Textarea preserves draft text
- Retry button or auto-retry on resubmit

#### Empty State (No Posts)
- Composer still visible
- Below composer: "No posts yet. Be the first to share something."
- Large icon or illustration (optional)

### Post Card

#### Anatomy
```
┌─────────────────────────────────────┐
│ [Avatar] [Name] @handle [Timestamp] │
├─────────────────────────────────────┤
│                                     │
│  Post body text (wrapping)          │
│                                     │
├─────────────────────────────────────┤
│ [Like] {count}  [Comment] {count}   │
│ [More Menu]                         │
└─────────────────────────────────────┘
```

#### Header (Author Info)
- **Avatar**: 40px circle, image or initials
- **Name**: 14px, weight 600, var(--color-text-primary)
- **Handle**: 13px, weight 400, var(--color-text-secondary), prefixed with @
- **Timestamp**: 13px, weight 400, var(--color-text-muted), e.g., "2h ago"
- **More menu (three dots)**: Right-aligned, clickable, shows edit/delete on long press or click

#### Body
- **Text**: 14px, weight 400, var(--color-text-primary), line-height 1.6
- **Links**: var(--color-accent), underlined on hover
- **Wrapping**: No overflow, text breaks naturally
- **Max length**: Design for up to 280 chars (fits comfortably)

#### Actions Row
- **Like button**: Icon + count, "likes" label for accessibility
- **Comment button**: Icon + count, "comments" label
- **More menu**: Three dots, opens dropdown with Edit, Delete options
- **Spacing**: 12px gaps between actions

#### Default State
- Clean, readable layout
- Borders: 1px solid var(--color-border)
- Background: var(--color-background)
- Shadow: var(--shadow-sm)

#### Hover State
- Shadow increases to var(--shadow-md)
- Background: subtle lightening (var(--color-surface))
- Cursor: pointer

#### Focus State (Keyboard)
- Focus ring: 2px solid var(--color-accent) with shadow
- Tab-accessible buttons

#### Like Button States
```
Unliked:
- Icon: hollow heart
- Color: var(--color-text-secondary)
- Count: N
- Hover: darker, hint at interaction

Liked:
- Icon: filled heart
- Color: var(--color-error)
- Count: N+1
- Cursor: pointer to unlike

Pending (optimistic):
- Icon: filled heart (slightly lighter red)
- Opacity: 0.7
- Count: N+1 (optimistic)
- Button disabled

Failed (rollback):
- Icon: hollow heart
- Count: N (reverted)
- Toast: "Failed to like. Try again."
- Button re-enabled
```

#### More Menu (Dropdown)
- **Edit**: Opens edit dialog (only if user is author OR if rule allows all users to edit)
- **Delete**: Opens delete confirmation (only if user is author OR if rule allows all users to delete)
- **Copy Link**: Copy post URL to clipboard
- **Report**: Intent only (not required to implement)

#### Edit Post Dialog
- Modal overlay
- Textarea with post content pre-filled
- Character count
- Cancel and Save buttons
- States: default, submitting, success, error (same as composer)

#### Delete Confirmation
- Modal: "Delete this post?"
- Message: "This can't be undone."
- Buttons: Cancel (gray), Delete (red)
- Submitting state: button shows spinner, disabled
- Success: post removed from feed, toast "Post deleted"
- Failure: error toast, retry option

### Comment Section

#### Collapsed State
- "Show {count} comments" or "View comments" link
- Not visible by default (collapsed to save space)

#### Expanded State
- Comments list visible
- Comment composer at bottom
- Up to ~3 comments visible, then "Load more comments" link

#### Comment Card
- Similar layout to post but more compact
- Smaller avatar (32px)
- No edit/delete by default (can be added per assignment rules)
- Like/reply (if threaded; keep it simple per assignment)

#### Comment Composer
- Small textarea: "Add a comment..."
- Character limit: 280 chars
- Submit button: "Comment"
- States: same as post composer (submitting, success, error)

#### Empty Comment State
- "No comments yet. Start the conversation."

#### Comment Loading
- Skeleton loaders matching comment card height/structure
- ~3 skeleton rows shown during load

---

## Component: Profile Page

### Layout
- Header section: profile info, stats
- Tabs or sections: Posts, Activity (optional)
- Post list (user's posts only)

### Profile Header

#### User Info Section
- **Avatar**: 80px circle, image or initials
- **Name**: 24px, weight 700, var(--color-text-primary)
- **Handle**: 14px, weight 400, var(--color-text-secondary), @handle
- **Bio**: 14px, weight 400, var(--color-text-primary), optional

#### Stats
- **Posts**: "{count} posts"
- **Joined**: "Joined {month} {year}" or "Member since..."
- Spacing: 16px gap between stats

#### Actions
- **Follow** button (if applicable; design only, backend not required)
- **Message** button (design only)
- **Edit Profile** button (if viewing own profile)

#### States

**Loading Profile**:
- Skeleton: 80px circle avatar, 3 skeleton lines for name/bio, skeleton stats
- No interaction until loaded

**Profile Not Found**:
- Large message: "User not found"
- Subtext: "This profile doesn't exist or has been deleted"
- Button: "Back to Feed"

**Profile Loaded**:
- Full info displayed
- Posts section visible

### Posts Section

#### Default
- Grid or list of user's posts
- Each post card same as feed posts
- Filterable by date (optional design; not required for backend)

#### Empty
- "No posts yet"
- Subtext: "This user hasn't shared anything"

#### Loading
- 3–5 skeleton post cards
- Preserves layout (no shift)

---

## Page: Not Found (404)

### Layout
- Centered, simple design
- Large heading: "Page not found"
- Message: "The page you're looking for doesn't exist or has been deleted."
- Illustration: Optional, minimal (e.g., simple icon)
- Action buttons:
  - "Back to Feed" (primary)
  - "Go Home" (secondary)

### Styling
- Heading: 32px, weight 700
- Message: 16px, weight 400, var(--color-text-secondary)
- Buttons: Standard button styles

---

## Page: General Error

### Layout
- Similar to 404 but different message
- Large heading: "Something went wrong"
- Message: "We encountered an unexpected error. Please try again."
- Action buttons:
  - "Refresh Page" (primary, reloads window)
  - "Go Home" (secondary, navigates to feed)

### Styling
- Same as 404

---

## State: Offline

### Offline Banner
- Fixed at top or in-line alert
- Background: var(--color-warning-light)
- Border: 1px solid var(--color-warning)
- Icon: offline/cloud icon
- Message: "You're offline. Some features may not work."
- Text color: var(--color-text-primary)
- Height: 48px (compact)
- Z-index: above content but below modals

### Feed During Offline
- Previously loaded posts remain visible
- Composer disabled or shows message: "Offline. Posts can't be submitted."
- Like buttons show warning on attempt
- Load more button disabled or shows: "Can't load more while offline"

### Form Submissions While Offline
- Form shows error: "You're offline. Please check your connection."
- Button remains enabled for retry
- Don't submit until connection is restored

---

## State: Reconnecting

### Reconnecting Indicator
- Subtle banner or indicator (top-right corner?)
- Icon: animated connectivity icon
- Message: "Reconnecting..."
- Color: var(--color-text-muted)
- Subtle animation (fade/pulse, not too distracting)

### Behavior
- Appears after network timeout
- Auto-dismisses when connection restored
- No user action needed

---

## State: Connection Restored

### Feedback
- Toast notification: "Connection restored"
- Color: var(--color-success)
- Icon: checkmark
- Duration: 2–3 seconds
- Auto-dismiss

### Feed Behavior
- If data is stale, offer to "Refresh Feed" or auto-refresh silently
- New posts may appear automatically
- User's draft posts (if cached) can be retried

---

## Skeleton Loading States

### Post Card Skeleton
```
┌────────────────────────────────┐
│ ▯ ▯▯▯▯▯  ▯▯▯▯   ▯▯▯          │
│                                │
│ ▯▯▯▯▯▯▯▯ ▯▯▯▯▯▯▯▯ ▯▯▯▯      │
│ ▯▯▯▯▯▯▯▯▯▯▯▯ ▯▯▯▯▯▯         │
│                                │
│ ▯▯▯   ▯▯▯   ▯▯▯             │
└────────────────────────────────┘
```
- Avatar: 40px circle skeleton
- Name/handle/timestamp: 3 lines of skeleton bars
- Body: 2–3 lines of skeleton bars (variable width last line)
- Actions: 3 small skeleton bars at bottom
- Background: var(--color-surface)
- Animate: subtle opacity pulse (0.3s cycle, ease-in-out, 60% – 100% opacity)

### Profile Header Skeleton
- Avatar: 80px circle skeleton
- Name: 1 line of skeleton
- Bio: 2 lines of skeleton
- Stats: 3 lines of skeleton

### Comment Skeleton
- Avatar: 32px circle skeleton
- Comment text: 2 lines of skeleton
- Smaller version of post skeleton

### Avoid
- Animated sliding gradients (too distracting)
- Rapid pulsing (annoying)
- Use simple opacity fade only

---

## Form Validation States

### Email Field
- **Default**: placeholder "you@example.com", empty
- **Focused**: border-color var(--color-accent), focus ring visible
- **Invalid format**: border-color var(--color-error), message "Invalid email address" below field (12px, color: var(--color-error))
- **Unique violation** (signup): message "This email is already in use"
- **Success** (implicit, no visual change needed)

### Password Field
- **Default**: placeholder "••••••••", empty
- **Focused**: border-color var(--color-accent)
- **Too short**: message "Password must be at least 8 characters"
- **Weak**: hint "Use a mix of letters, numbers, and symbols" (optional design detail)
- **Match error** (confirm field): message "Passwords don't match"

### Post Composer
- **Empty**: button disabled, slightly grayed
- **Character limit reached**: count color var(--color-error), button disabled
- **Near limit** (>200 chars): count color var(--color-warning)
- **Valid**: button enabled, clearly interactive

### Inline Errors
- Red text below field, 12px, weight 400
- Icon: small warning/error icon before text
- Don't use color alone; include icon + text
- Clear on re-edit (don't persist after user changes field)

---

## Toast / Feedback Messages

### Success Toast
- Background: var(--color-success-light)
- Border: 1px solid var(--color-success)
- Text: var(--color-text-primary)
- Icon: checkmark
- Duration: 2–3 seconds, auto-dismiss
- Position: bottom-right or top-center (consistent)
- Examples:
  - "Post created"
  - "Comment posted"
  - "Post deleted"
  - "Changes saved"

### Error Toast
- Background: var(--color-error-light)
- Border: 1px solid var(--color-error)
- Text: var(--color-text-primary)
- Icon: error/alert icon
- Duration: 4–5 seconds, auto-dismiss or require dismiss
- Actionable: include "Retry" button for transient failures
- Examples:
  - "Couldn't post. Retry?"
  - "Failed to delete. Try again."
  - "Something went wrong."

### Informational Toast
- Background: var(--color-surface)
- Border: 1px solid var(--color-border)
- Text: var(--color-text-primary)
- Icon: info icon
- Duration: 3–4 seconds
- Examples:
  - "Connection restored"
  - "Reconnecting..."

### Positioning
- Mobile: 16px from bottom, full width minus padding
- Desktop: 16px from bottom-right corner, max-width 400px
- Stack multiple toasts vertically, newest at top
- Don't overlap modals or critical content

---

## Loading States: Page-Level

### Feed Loading (Initial)
- Header visible
- Post composer visible but disabled: "Loading feed..."
- 4–5 post skeleton cards below
- Smooth fade-in when content loads

### Profile Loading
- Header visible
- Profile skeleton card (avatar, name, bio, stats)
- 3–5 post skeleton cards below
- Fade-in on load

### Login/Signup Submitting
- Form visible
- Button shows loading state (text + spinner)
- Form inputs not interactive (pointer-events: none or disabled)
- Show spinner inside button

### Post Creation Submitting
- Composer shows loading state (button text: "Posting...")
- Optimistic UI: new post appears immediately (lighter opacity) in feed
- Actual API response either confirms (full opacity) or rolls back
- If rollback, show error toast with retry

---

## Mutation Loading States

### Like Mutation
- **Optimistic**: Icon fill changes immediately, count increments
- **Pending** (if slow): Icon slightly dimmed, opacity 0.7
- **Success**: Icon confirmed, count updated
- **Failure**: Icon reverts to previous state, count reverts, toast error

### Post Edit Submission
- Dialog button: "Saving..."
- Button disabled
- Textarea remains enabled for further edits
- On success: dialog closes, toast "Changes saved"
- On failure: error message in dialog, retry button

### Post Delete Submission
- Confirmation modal button: "Deleting..."
- Button disabled
- On success: modal closes, post removed from feed, toast "Post deleted"
- On failure: modal shows error, retry button

### Comment Submission
- Button: "Posting comment..."
- Button disabled
- Textarea remains enabled
- On success: comment appears, textarea clears, toast (optional)
- On failure: error message below textarea, retry button

---

## Empty States

### No Posts in Feed
- Visible after feed loads (not during skeleton loading)
- Centered message: "No posts yet"
- Subtext: "Be the first to share something."
- Icon: optional, simple (e.g., chat bubble outline)
- Composer still fully visible above
- Height: ~300px of visual space

### No Comments on Post
- Collapsed by default
- When expanded: "No comments yet. Start the conversation."
- Comment composer below message
- Icon: optional

### No Posts on User Profile
- Centered message: "No posts"
- Subtext: "This user hasn't shared anything"
- Icon: optional
- Button: "Back to Feed"

---

## Error States: Detailed Handling

### Feed Failed to Load
- Header visible
- Centered message: "Couldn't load feed"
- Subtext: "We had trouble fetching posts. Please try again."
- Button: "Retry" (refetches feed)
- If partial load (e.g., 5 of 20 posts loaded), show loaded posts + error section

### Post Failed to Create
- Composer clears error message after fix
- Toast: "Couldn't post. Retry?" with action button
- Textarea preserves draft
- Button re-enabled immediately

### Post Failed to Edit
- Modal shows error: "Couldn't save changes. Please try again."
- Textarea preserves edits
- Button: "Retry"

### Post Failed to Delete
- Modal shows error: "Couldn't delete post. Please try again."
- Button: "Retry"

### Comment Failed to Submit
- Error message below textarea: "Failed to post comment. Retry?"
- Textarea preserves text
- Retry button or resubmit via button

### Like Failed
- Optimistic UI reverts
- Icon returns to previous state
- Toast: "Couldn't like. Try again." with retry button

### Login Failed
- Email and password preserved
- Error message below password field: "Email or password is incorrect" or "Account not found"
- Button re-enabled
- User can retry

### Signup Failed
- Form fields preserved
- Error for specific field (e.g., "This email is already in use")
- General server error: "Couldn't create account. Please try again."
- Button re-enabled

### Session Expired
- User on any page, tries an action
- Modal: "Your session has expired. Please log in again."
- Button: "Log In" (navigates to login)
- Previously loaded content remains visible but no mutations allowed

### Unauthorized / Access Denied
- Modal: "You don't have permission to do that."
- Button: "OK" (dismisses modal, returns to previous page)

### Resource Not Found (Post, User)
- 404 page with message, recovery buttons
- If navigated directly: full 404 page
- If post was deleted while viewing: inline message, offer to refresh feed

---

## Partial Failure States

### Feed Loads, Comments Fail
- Post visible with comment count
- "Couldn't load comments" error message where comments would appear
- Retry button or expand to retry load

### Profile Loads, Posts Fail
- Profile header visible
- Error below: "Couldn't load posts. Retry?"
- Retry button

### Like Fails After Optimistic UI
- Like reverted to previous state (described above)
- No other content affected

---

## Slow Network / Timeout States

### Request Taking Long Time
- Button remains clickable
- Show subtle indicator: button text + "..." or spinner inside
- Don't freeze the UI
- Timeout after ~10–15 seconds → show error with retry

### Slow Feed Load
- Show skeleton loaders for 2–3 seconds minimum
- If still loading after 5 seconds, show "Still loading..." hint
- Progress indicator optional (not required)

### Slow Post Submission
- Button: "Posting..." with spinner
- Show elapsed time or estimated wait (optional, nice-to-have)
- User can leave page safely (mutation will complete in background)

---

## Accessibility

### Keyboard Navigation
- Tab order: logical, top-to-bottom, left-to-right
- Focus visible: 2px outline or shadow focus ring
- Buttons/links: 44px minimum hit area (mobile)
- Forms: label → input relationship clear
- Dialogs: focus trapped inside, ESC closes

### Focus Management
- After login: focus moved to feed
- After post creation: focus moved to new post or back to composer
- After modal open: focus moved inside modal
- After modal close: focus returns to trigger button

### ARIA Labels
- Buttons: aria-label="Like post" or visible text
- Icons: role="img" + aria-label or wrapped in labeled button
- Form fields: `<label for="email">Email</label>`
- Dialogs: aria-labelledby, aria-modal="true"
- Live regions: aria-live="polite" for toast messages, loading states
- Loading states: aria-busy="true" on container

### Semantic HTML
- `<button>` for buttons, not `<div>` or `<a>`
- `<a>` for navigation/links, not buttons
- `<form>` for forms, not divs
- `<label>` for form labels
- `<h1>`, `<h2>`, etc. for headings (proper hierarchy)
- `<nav>` for navigation regions
- `<main>` for main content
- `<article>` for post cards (optional but semantic)

### Color Contrast
- All text: at least 4.5:1 ratio (WCAG AA)
- UI components: 3:1 ratio for borders, icons
- Error messages: red + icon, not red alone
- Success messages: green + icon, not green alone

### Motion
- Respect prefers-reduced-motion: no animation if user has set it
- Critical feedback (toast, error) still visible even without motion
- Provide text-based status updates for loading states

### Form Validation
- Errors shown inline, not just in summary
- Clear, specific error messages (not codes)
- Hint text: optional, but helps with validation
- Required fields: marked with asterisk or label text
- Character count: announced dynamically if user relies on screen reader

### Announcements
- Toast messages: aria-live="polite", aria-atomic="true"
- Loading status: "Loading posts... 3 of 5" in aria-live region
- Post creation success: "Post created"
- Connection status: "Connection lost. Reconnecting..." in aria-live region

---

## Motion & Animation Rules

### Principles
- Motion only for state transitions and feedback
- Keep animations under 300ms for transitions
- Use ease-in-out timing
- Respect prefers-reduced-motion

### Specific Animations

**Button Hover** (optional):
- Background color transition: 150ms
- No scale or transform (avoid layout shift)

**Button Press**:
- Opacity or slight color change: 100ms
- Immediate feedback, no delay

**Like Animation**:
- Icon fill: 200ms ease-in
- Optional heart-beat pulse on like (if desired): 300ms scale(1 → 1.2 → 1)

**Modal Appear**:
- Fade-in backdrop: 150ms
- Scale content from 0.95 → 1.0: 200ms, ease-out
- Or simple fade-in: 200ms (choose one approach, be consistent)

**Toast Appear/Disappear**:
- Slide-in from right: 200ms ease-out
- Slide-out on dismiss: 150ms ease-in

**Skeleton Loading**:
- Opacity pulse: 60% → 100% → 60%, cycle every 1.5s, ease-in-out
- No animated gradient (too distracting)

**Post Edit Slide**:
- If edit dialog slides up: 250ms ease-out

### No Animation For
- Page transitions (too slow, feels sluggish)
- Scroll-triggered animations (unpredictable on mobile)
- Constant floating/spinning elements
- Auto-playing video backgrounds

---

## Responsive Rules

### Mobile (320px–767px)

**Layout**:
- Single-column feed, full width
- 16px horizontal padding
- No sidebars
- Bottom navigation for primary actions

**Components**:
- Post cards: full width minus padding
- Modals: full-width with top/bottom positioning (not centered)
- Composer: sticky at top with padding
- Header: 56px, compact layout

**Typography**:
- Maintain type scale but adjust for readability
- No horizontal scrolling
- Wrap all text naturally

**Buttons**:
- Minimum 44px height for touch
- Adequate spacing to prevent mis-taps
- No small icons without larger hit area

### Tablet (768px–1023px)

**Layout**:
- 2-column or centered single column
- 20–24px horizontal padding
- Sidebar optional, can collapse
- Top navigation primary

**Components**:
- Post cards: 90% width, centered, max 600px
- Composer: sticky at top
- Modals: centered, max-width 500px

**Typography**:
- Full type scale comfortable to read
- Moderate line lengths

### Desktop (1024px+)

**Layout**:
- Multi-column optional (sidebar + feed + right rail)
- Centered feed, max 600px width
- 32px horizontal padding
- Full top navigation

**Components**:
- Post cards: 600px max-width, centered
- Modals: centered, max-width 600px
- Hover states fully visible
- Right-click context menus visible

### Responsive Font Sizing
- Type scale remains constant across breakpoints
- Only adjust container widths, not typography
- Maintain 1.5–1.6 line height for body text

### Responsive Spacing
- Padding scales: 16px (mobile) → 24px (tablet) → 32px (desktop)
- Gaps between elements scale similarly
- Preserve visual hierarchy across all sizes

---

## Component State Matrix

### Button
| State | Background | Border | Text | Cursor | Icon | Notes |
|-------|-----------|--------|------|--------|------|-------|
| Default | var(--color-accent) | none | white | pointer | icon-color | Primary action |
| Hover | var(--color-accent-hover) | none | white | pointer | icon-color | Shadow increases |
| Focus | var(--color-accent) | none | white | pointer | icon-color | Focus ring visible |
| Active | var(--color-accent-focus) | none | white | pointer | icon-color | Pressed state |
| Disabled | var(--color-disabled) | none | var(--color-disabled-text) | not-allowed | lighter | Opacity 0.6 |
| Loading | var(--color-accent) | none | white | not-allowed | spinner | Button text hidden, spinner visible |

### Input Field (Text, Email, Password)
| State | Border | Background | Text | Placeholder | Focus Ring | Notes |
|-------|--------|-----------|------|-------------|-----------|-------|
| Default | var(--color-border) | white | primary | muted | none | Clean state |
| Hover | var(--color-border-dark) | white | primary | muted | none | Slight darkening |
| Focus | var(--color-accent) | white | primary | muted | visible | 3px shadow ring |
| Invalid | var(--color-error) | var(--color-error-light) | primary | muted | error-colored | Error icon/msg below |
| Disabled | var(--color-border) | var(--color-surface) | muted | muted | none | Opacity 0.5 |

### Post Card
| State | Shadow | Background | Hover Effect | Notes |
|-------|--------|-----------|--------------|-------|
| Default | var(--shadow-sm) | white | — | Clean reading |
| Hover | var(--shadow-md) | var(--color-surface) | — | Elevated, clickable hint |
| Focus (post link) | var(--shadow-focus) | white | — | Focus ring on card border |
| Loading | var(--shadow-sm) | skeleton gray | N/A | Skeleton animation |
| Error | var(--shadow-sm) | white | — | Error message overlaid |

### Like Button (Heart Icon)
| State | Icon | Color | Count | Cursor | Notes |
|-------|------|-------|-------|--------|-------|
| Unliked | hollow | secondary | N | pointer | Normal state |
| Liked | filled | error | N+1 | pointer | Red heart |
| Pending | filled (dim) | error (60% opacity) | N+1 (optimistic) | not-allowed | Optimistic state |
| Failed (rollback) | hollow | secondary | N | pointer | Reverted, toast error |
| Hover (unliked) | hollow → darker | darker-secondary | N | pointer | Hint interaction |

### Comment Composer
| State | Textarea Border | Button | Text Preserved | Notes |
|-------|-----------------|--------|----------------|-------|
| Empty | border-color | Disabled | — | No submission yet |
| Focused | var(--color-accent) | Disabled (if empty) | — | Ready for input |
| Text Entered | var(--color-accent) | Enabled | Yes | Ready to submit |
| Submitting | border-color | "Posting..." (disabled) | Yes | Show spinner |
| Success | border-color | reset to "Comment" | No (cleared) | Textarea clears |
| Error | var(--color-error) | "Comment" (enabled) | Yes | Error msg below |

### Post Composer
| State | Textarea Border | Char Count | Button | Notes |
|-------|-----------------|-----------|--------|-------|
| Empty | border-color | 0/280 | Disabled (grayed) | Placeholder visible |
| Focused | var(--color-accent) | 0/280 | Disabled (if empty) | Focus ring visible |
| Text Entered | var(--color-accent) | N/280 | Enabled | Ready to post |
| Approaching Limit | var(--color-accent) | N/280 (warning color, >200) | Enabled | Visual warning |
| At Limit | var(--color-error) | 280/280 (error color) | Disabled (error) | Cannot type more |
| Submitting | border-color | preserved | "Posting..." (disabled) | Show spinner |
| Success | border-color | 0/280 | reset "Post" | Textarea clears |
| Error | var(--color-error) | preserved | "Post" (enabled) | Error toast |

---

## Interaction Rules

### Preventing Duplicate Actions
- **Like**: Button disabled during pending state, no multiple rapid clicks
- **Post submit**: Button disabled during submission, prevent double-submit
- **Comment submit**: Button disabled during submission
- **Delete**: Confirmation modal prevents accidental delete, button disabled during deletion

### Optimistic UI
- **Like**: Instant heart fill + count increment, revert if fails
- **Post creation**: Optional optimistic post appearance (lighter) in feed
- **Others**: Avoid optimistic UI for complex operations (edit, delete)

### Form Submission
- Disabled submit button during submission to prevent double-submit
- Preserve form data on error (don't clear fields)
- Show specific error for each field if applicable
- Allow user to edit and retry

### Retry Mechanism
- Failed mutations show toast with "Retry?" button
- Click retry to resubmit same action
- Alternatively, resubmit via form/button

### Navigation
- Links use `<a>` tags with proper href
- Buttons trigger actions, don't navigate
- User menu dropdown closes on navigation
- Tab order follows visual order

---

## Design Token Map

### Color Tokens
- `--color-primary`: #1f2937 (main text, primary UI)
- `--color-accent`: #0ea5e9 (links, actions)
- `--color-error`: #ef4444 (errors, delete)
- `--color-success`: #10b981 (success, confirm)
- `--color-warning`: #f59e0b (warnings, limits)
- `--color-background`: #ffffff
- `--color-surface`: #f9fafb
- `--color-border`: #e5e7eb
- `--color-text-secondary`: #6b7280
- `--color-text-muted`: #9ca3af
- `--color-disabled`: #d1d5db`

### Spacing Tokens
- `--spacing-xs`: 2px
- `--spacing-sm`: 4px
- `--spacing-md`: 8px
- `--spacing-lg`: 12px
- `--spacing-xl`: 16px
- `--spacing-2xl`: 24px
- `--spacing-3xl`: 32px
- `--spacing-4xl`: 48px

### Typography Tokens
- `--font-family-primary`: Inter
- `--font-family-mono`: JetBrains Mono
- `--font-size-xs`: 12px
- `--font-size-sm`: 13px
- `--font-size-base`: 14px
- `--font-size-lg`: 16px
- `--font-size-xl`: 20px
- `--font-size-2xl`: 24px
- `--font-size-3xl`: 32px

### Radius Tokens
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-full`: 9999px

### Shadow Tokens
- `--shadow-sm`: 0 1px 2px rgba(0,0,0,0.05)
- `--shadow-md`: 0 4px 6px rgba(0,0,0,0.07)
- `--shadow-lg`: 0 10px 15px rgba(0,0,0,0.1)
- `--shadow-focus`: 0 0 0 3px rgba(14,165,233,0.1)

---

## Page/Component Map

### Pages
1. **Login** (`/login` or `/auth/login`)
2. **Signup** (`/signup` or `/auth/signup`)
3. **Feed** (`/` or `/home`)
4. **Profile** (`/profile/:username` or `/user/:id`)
5. **404 Not Found** (any invalid route)
6. **Error** (generic server error)

### Components
- Header/Navigation
- Post Composer
- Post Card
  - Author Info
  - Post Body
  - Actions (Like, Comment, More)
  - Edit Dialog
  - Delete Confirmation
- Comment Card
- Comment Composer
- Comment List
- Profile Header
- User Menu Dropdown
- Toast Messages
- Modals (Edit, Delete, Confirm)
- Empty States
- Error States
- Skeleton Loaders
- Offline Banner
- Reconnecting Indicator

---

## Implementation Notes for Coding Agent

### Tailwind CSS
- Use semantic class names: `text-primary`, `bg-surface`, `border-border`, etc.
- Define custom colors in `tailwind.config.js`:
  ```js
  colors: {
    primary: '#1f2937',
    accent: '#0ea5e9',
    // ... full palette
  }
  ```
- Use Tailwind utilities for spacing, sizing, shadows, etc.

### shadcn/ui Components
- Use provided components for consistency:
  - Button, Input, Form, Dialog, DropdownMenu, Toast, etc.
- Customize via Tailwind classes
- Don't override component styles with external CSS

### Lucide Icons
- Use for UI icons: Heart (like), MessageCircle (comment), MoreVertical (menu), etc.
- Consistent sizing: 20px or 24px for most icons
- Color: inherit from text color or explicit var(--color-accent)

### State Management
- Use React Context or state library (Redux, Zustand) for auth, user, posts
- Manage loading states per component (not global spinners everywhere)
- Cache fetched data to prevent flicker on navigation

### API Integration
- Mock API responses during design phase
- Design for realistic delays (200ms–2s)
- Handle all error cases described in spec

### Performance
- Lazy load images (avatar, if added later)
- Virtualize long lists of posts/comments (if needed)
- Skeleton loaders for perceived speed

### Accessibility
- Audit with axe DevTools
- Test keyboard navigation (Tab, Enter, ESC)
- Test with screen reader (VoiceOver, NVDA)

---

## Design Quality Checklist

Before handoff:

- [ ] All type scales consistent across pages
- [ ] All spacing uses 8px grid
- [ ] All borders/shadows use design tokens
- [ ] All interactive elements have hover, focus, active states
- [ ] All loading states use skeletons (no generic "Loading...")
- [ ] All error states are specific and actionable
- [ ] All forms show validation errors inline
- [ ] All toasts positioned consistently
- [ ] Mobile layout responsive, no horizontal scroll
- [ ] Keyboard navigation works end-to-end
- [ ] Focus ring visible on all interactive elements
- [ ] Color contrast meets WCAG AA
- [ ] No animations on prefers-reduced-motion
- [ ] All pages have a happy path and failure state
- [ ] Offline state handled gracefully
- [ ] Session expiration shows appropriate message
- [ ] No console errors
- [ ] Component library used consistently (shadcn/ui, Lucide)

---

## Content Examples

### Fictional Users (seeded data)
- Alex Chen (engineer, thoughtful posts)
- Maya Patel (designer, creative insights)
- Jordan Smith (founder, startup thoughts)
- Casey Taylor (writer, long-form posts)
- Riley Kim (researcher, technical deep-dives)

### Realistic Posts
- "Just launched our new feature after 3 months of work. Feels great to ship something real."
- "Hot take: the best design is one nobody notices. It just works."
- "Curious what everyone's using for state management these days? We've been debating Redux vs context."
- "Finished the course. Harder than expected but absolutely worth it."

### Comments
- "Congrats on the launch! How are you handling the database load?"
- "Love this approach. We tried something similar and it saved us weeks."
- "Agreed. User-centric design beats visual complexity every time."

---

## Final Notes

This specification is comprehensive enough for a coding agent to implement the entire frontend without inventing visual or UX decisions. Every component, state, and interaction is defined.

The design prioritizes professional quality, thoughtful edge-case handling, and accessibility. The result should feel like a real, polished product—not a template or experiment.

All unusual requirements from the assignment (e.g., any authenticated user can edit/delete any post) are reflected in the UI design without visual restrictions that would contradict these rules.
