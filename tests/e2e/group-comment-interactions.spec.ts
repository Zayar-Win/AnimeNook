import { expect, test } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    loginGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
} from "./helpers";

test.describe("Group comment thread interactions", () => {
    test("user can post, like, edit, and delete on anime comments", async ({
        page,
        request,
    }) => {
        test.setTimeout(90_000);
        await skipUnlessSeededAnime(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);

        const commentSection = page.locator("#comments");
        await commentSection.scrollIntoViewIfNeeded();

        const parentBody = `e2e-thread-${Date.now()}`;
        const editedBody = `${parentBody} edited`;

        await test.step("post top-level comment", async () => {
            await commentSection.locator(".ql-editor").first().click();
            await page.keyboard.type(parentBody);
            await commentSection.getByRole("button", { name: "Comment" }).click();
            await expect(
                commentSection.getByText(parentBody, { exact: false }).first(),
            ).toBeVisible({ timeout: 20_000 });
        });

        const parentBlock = commentSection
            .locator("[class*='group/comment']")
            .filter({ hasText: parentBody })
            .first();

        await test.step("like comment", async () => {
            await parentBlock.getByRole("button", { name: /^Like$|^\d+$/ }).click();
        });

        await test.step("edit comment", async () => {
            await parentBlock.getByRole("button", { name: "Edit" }).click();
            await parentBlock.locator(".ql-editor").first().click();
            await page.keyboard.press("Control+a");
            await page.keyboard.type(editedBody);
            await parentBlock.getByRole("button", { name: "Update" }).click();
            await expect(
                commentSection.getByText(editedBody, { exact: false }).first(),
            ).toBeVisible({ timeout: 20_000 });
        });

        await test.step("delete comment", async () => {
            const block = commentSection
                .locator("[class*='group/comment']")
                .filter({ hasText: editedBody })
                .first();
            await block.getByRole("button", { name: "Delete" }).first().click();
            await expect(
                page.getByRole("heading", { name: "Delete Comment" }),
            ).toBeVisible();
            await page
                .locator(".fixed")
                .filter({ hasText: "Delete Comment" })
                .getByRole("button", { name: "Delete" })
                .click();
            await expect(
                commentSection.getByText(editedBody, { exact: false }),
            ).toHaveCount(0, { timeout: 15_000 });
        });
    });
});
