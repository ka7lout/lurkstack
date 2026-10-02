import { test, expect } from "@playwright/test";
import { uniqueUser, signup, login, logout, composer } from "./helpers";

test("signup creates an account and authenticates", async ({ page }) => {
  const user = uniqueUser("signup");
  await signup(page, user);
  // The composer is only rendered for authenticated visitors.
  await expect(composer(page)).toBeVisible();
});

test("signup rejects mismatched passwords", async ({ page }) => {
  const user = uniqueUser("mismatch");
  await page.goto("/signup");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByLabel("Confirm password").fill("different123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Passwords don't match")).toBeVisible();
});

test("login and logout work; session persists on refresh", async ({ page }) => {
  const user = uniqueUser("session");
  await signup(page, user);
  await logout(page);
  await login(page, user.email, user.password);
  await page.reload();
  await expect(composer(page)).toBeVisible();
});

test("login rejects wrong credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Password", { exact: true }).fill("wrongpassword");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
});

test("the login page never displays demo credentials", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText(/demo account/i)).toHaveCount(0);
  await expect(page.getByText(/Password123!/)).toHaveCount(0);
});
