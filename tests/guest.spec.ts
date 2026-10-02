import { test, expect } from "@playwright/test";
import { composer, postMenu, commentsToggle } from "./helpers";

test("guest can read the populated feed", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "The feed" })).toBeVisible();
  await expect(page.locator("article").first()).toBeVisible();
});

test("guest sees a sign-in prompt instead of a composer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Create an account or sign in to post to the feed.")).toBeVisible();
  await expect(composer(page)).toHaveCount(0);
});

test("guest clicking like opens the authentication gate", async ({ page }) => {
  await page.goto("/");
  await page.locator("article").first().getByRole("button", { name: /Like this post/ }).click();
  const dialog = page.getByRole("dialog", { name: "Sign in to continue" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Sign in" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Create account" })).toBeVisible();
});

test("guest clicking a post action opens the authentication gate", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("article").first();
  await postMenu(card).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  await expect(page.getByRole("dialog", { name: "Sign in to continue" })).toBeVisible();
});

test("guest reads a public profile but cannot comment", async ({ page }) => {
  await page.goto("/");
  await page.locator("article").first().getByRole("link", { name: /^@/ }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const card = page.locator("article").first();
  await commentsToggle(card).click();
  await expect(card.getByRole("button", { name: "Sign in to add a comment" })).toBeVisible();
});
