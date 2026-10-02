import { test, expect, Page } from "@playwright/test";
import { uniqueUser, signup, createPost, commentsToggle, commentSubmit } from "./helpers";

function cardFor(page: Page, text: string) {
  return page.locator("article").filter({ hasText: text }).first();
}

test("like toggles, persists, and prevents duplicates", async ({ page }) => {
  const user = uniqueUser("liker");
  await signup(page, user);
  const content = `Like me ${Date.now()}`;
  await createPost(page, content);
  const card = cardFor(page, content);
  const likeBtn = card.getByRole("button", { name: /Like this post/ });

  await likeBtn.click();
  // The press lands optimistically; wait for the server to confirm the write
  // before asking a different page to read it back.
  await expect(likeBtn).toHaveAttribute("aria-pressed", "true");
  await expect(likeBtn).not.toHaveAttribute("aria-busy", "true");
  await expect(likeBtn).toContainText("1");

  // Persisted as exactly one like (unique(userId,postId) prevents duplicates).
  const f1 = await page.context().newPage();
  await f1.goto("/");
  const persisted = cardFor(f1, content).getByRole("button", { name: /Like this post/ });
  await expect(persisted).toHaveAttribute("aria-pressed", "true");
  await expect(persisted).toContainText("1");
  await f1.close();

  // Toggle off.
  await likeBtn.click();
  await expect(likeBtn).toHaveAttribute("aria-pressed", "false");
  await expect(likeBtn).not.toHaveAttribute("aria-busy", "true");
  await expect(likeBtn).toContainText("0");
});

test("comment on a post and reject empty comment", async ({ page }) => {
  const user = uniqueUser("commenter");
  await signup(page, user);
  const content = `Comment target ${Date.now()}`;
  await createPost(page, content);
  const card = cardFor(page, content);

  // Open the comment section.
  await commentsToggle(card).click();

  const commentBox = card.getByLabel("Write a comment");
  await expect(commentBox).toBeVisible();
  // Empty comment: the submit button stays disabled.
  await expect(commentSubmit(card)).toBeDisabled();

  const commentText = `Nice one ${Date.now()}`;
  await commentBox.fill(commentText);
  await commentSubmit(card).click();
  // Scope to the comment list: the composer also holds this text until it clears.
  await expect(card.locator("li").filter({ hasText: commentText })).toBeVisible();
  await expect(card.getByLabel("Write a comment")).toHaveValue("");

  // Persistence.
  const fresh = await page.context().newPage();
  await fresh.goto("/");
  const freshCard = cardFor(fresh, content);
  await commentsToggle(freshCard).click();
  await expect(freshCard.locator("li").filter({ hasText: commentText })).toBeVisible();
  await fresh.close();
});
