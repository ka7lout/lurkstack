import { Page, Locator, expect } from "@playwright/test";

export function uniqueUser(prefix = "user") {
  const n = Date.now() + Math.floor(Math.random() * 1000);
  return {
    name: `Test ${prefix} ${n}`,
    email: `${prefix}.${n}@example.com`,
    password: "Password123!",
  };
}

/** The signed-in composer textarea. */
export function composer(page: Page): Locator {
  return page.locator("#post-composer");
}

/** The action menu on a post card (never ownership-gated). */
export function postMenu(card: Locator): Locator {
  return card.getByRole("button", { name: /^Actions for the post by/ });
}

/**
 * The comment section toggle. Its accessible name carries the count and flips
 * between "Comment" / "Comments" / "Hide", so match all three — otherwise the
 * locator goes stale the moment it is clicked.
 */
export function commentsToggle(card: Locator): Locator {
  return card.getByRole("button", { name: /(\d+\s+)?(Comment|Comments|Hide)$/ });
}

/** The submit button inside an expanded comment composer. */
export function commentSubmit(card: Locator): Locator {
  return card.getByRole("button", { name: "Comment", exact: true });
}

export async function signup(page: Page, user: { name: string; email: string; password: string }) {
  await page.goto("/signup");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByLabel("Confirm password").fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/", { timeout: 20000 });
  await expect(composer(page)).toBeVisible();
}

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/", { timeout: 20000 });
  await expect(composer(page)).toBeVisible();
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: /^Account menu for/ }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page.getByRole("link", { name: "Create account" }).first()).toBeVisible();
}

export async function createPost(page: Page, content: string) {
  await composer(page).fill(content);
  await page
    .locator("form[aria-label='Write a post']")
    .getByRole("button", { name: "Post", exact: true })
    .click();
  await expect(page.locator("article").filter({ hasText: content }).first()).toBeVisible();
}
