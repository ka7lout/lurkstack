import { test, expect } from "@playwright/test";
import { uniqueUser, signup, createPost } from "./helpers";

test("profile shows the user's authored posts", async ({ page }) => {
  const user = uniqueUser("profile");
  await signup(page, user);
  const content = `Profile post ${Date.now()}`;
  await createPost(page, content);

  await page.getByRole("button", { name: /^Account menu for/ }).click();
  await page.getByRole("menuitem", { name: "View profile" }).click();

  await page.waitForURL("**/u/**");
  await expect(page.locator("#profile-name")).toHaveText(user.name);
  await expect(page.getByText(content)).toBeVisible();
});

test("unknown profile returns a not-found page", async ({ page }) => {
  await page.goto("/u/does-not-exist");
  await expect(page.getByRole("heading", { name: /Nothing filed/ })).toBeVisible();
});

test("health endpoint reports ok", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe("ok");
  expect(body.checks.database).toBe("ok");
});

test("feed is seeded with content", async ({ page }) => {
  await page.goto("/");
  const count = await page.locator("article").count();
  expect(count).toBeGreaterThanOrEqual(10);
});
