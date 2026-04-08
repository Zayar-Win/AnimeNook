import { expect, test } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    loginGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
} from "./helpers";

test.describe("Group comment reply", () => {
    test("user can reply to their own top-level comment", async ({
        page,
        request,
    }) => {
        test.setTimeout(60_000);
        await skipUnlessSeededAnime(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);

        const commentSection = page.locator("#comments");
        await commentSection.scrollIntoViewIfNeeded();

        const parentBody = `e2e-reply-parent-${Date.now()}`;
        const replyBody = `e2e-reply-child-${Date.now()}`;

        await commentSection.locator(".ql-editor").first().click();
        await page.keyboard.type(parentBody);
        await commentSection.getByRole("button", { name: "Comment" }).click();
        await expect(
            commentSection.getByText(parentBody, { exact: false }).first(),
        ).toBeVisible({ timeout: 20_000 });

        const parentBlock = commentSection
            .locator("[class*='group/comment']")
            .filter({ hasText: parentBody })
            .first();

        await parentBlock.getByRole("button", { name: "Reply" }).first().click();
        await parentBlock.locator(".ql-editor").last().click();
        await page.keyboard.type(replyBody);
        await parentBlock.getByRole("button", { name: "Reply" }).last().click();

        await expect(
            commentSection.getByText(replyBody, { exact: false }).first(),
        ).toBeVisible({ timeout: 20_000 });
    });
});
