import { test, expect, Page } from "@playwright/test";
import { uniqueUser, signup, logout, createPost, postMenu } from "./helpers";

function cardFor(page: Page, text: string) {
  return page.locator("article").filter({ hasText: text }).first();
}

test("create post appears in the feed and persists after refresh", async ({ page }) => {
  const user = uniqueUser("creator");
  await signup(page, user);
  const content = `My first post ${Date.now()}`;
  await createPost(page, content);
  await page.reload();
  await expect(cardFor(page, content)).toBeVisible();
});

test("edit own post", async ({ page }) => {
  const user = uniqueUser("editor");
  await signup(page, user);
  const content = `Editable ${Date.now()}`;
  await createPost(page, content);
  const card = cardFor(page, content);
  await postMenu(card).click();
  await page.getByRole("menuitem", { name: "Edit" }).click();
  const updated = `${content} edited`;
  await page.getByLabel("Post text").fill(updated);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(cardFor(page, updated)).toBeVisible();
  // Persistence: a fresh page load still shows the edit.
  const fresh = await page.context().newPage();
  await fresh.goto("/");
  await expect(cardFor(fresh, updated)).toBeVisible();
  await fresh.close();
});

test("delete own post", async ({ page }) => {
  const user = uniqueUser("deleter");
  await signup(page, user);
  const content = `Deletable ${Date.now()}`;
  await createPost(page, content);
  const card = cardFor(page, content);
  await postMenu(card).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Delete post" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText(content)).toHaveCount(0);
  const fresh = await page.context().newPage();
  await fresh.goto("/");
  await expect(fresh.getByText(content)).toHaveCount(0);
  await fresh.close();
});

// CRITICAL: cross-user edit — must never be blocked by ownership.
test("any authenticated user can edit another user's post", async ({ page }) => {
  const userA = uniqueUser("Aedit");
  await signup(page, userA);
  const content = `A owns this ${Date.now()}`;
  await createPost(page, content);
  await logout(page);

  const userB = uniqueUser("Bedit");
  await signup(page, userB);
  const card = cardFor(page, content);
  await expect(card).toBeVisible();
  await postMenu(card).click();
  await page.getByRole("menuitem", { name: "Edit" }).click();
  const updated = `Edited by B ${Date.now()}`;
  await page.getByLabel("Post text").fill(updated);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(cardFor(page, updated)).toBeVisible();
  const fresh = await page.context().newPage();
  await fresh.goto("/");
  await expect(cardFor(fresh, updated)).toBeVisible();
  await fresh.close();
});

// CRITICAL: cross-user delete — must never be blocked by ownership.
test("any authenticated user can delete another user's post", async ({ page }) => {
  const userA = uniqueUser("Adel");
  await signup(page, userA);
  const content = `A will lose this ${Date.now()}`;
  await createPost(page, content);
  await logout(page);

  const userB = uniqueUser("Bdel");
  await signup(page, userB);
  const card = cardFor(page, content);
  await expect(card).toBeVisible();
  await postMenu(card).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Delete post" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText(content)).toHaveCount(0);
  const fresh = await page.context().newPage();
  await fresh.goto("/");
  await expect(fresh.getByText(content)).toHaveCount(0);
  await fresh.close();
});
