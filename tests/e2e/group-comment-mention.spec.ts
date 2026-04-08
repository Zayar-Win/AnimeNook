/**
 * @mention → database notification → admin opens bell → navigates to anime #comments.
 *
 * Optional extra pauses: `E2E_STEP_PAUSE=600` (see `visualPause()` in helpers).
 * Global slowMo for all e2e tests: set `PLAYWRIGHT_SLOW_MO` in env (see playwright.config.ts).
 */
import { test, expect } from "@playwright/test";
import {
    E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD,
    E2E_ANIME_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    groupPath,
    loginGroupTenant,
    logoutGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
    visualPause,
} from "./helpers";

test.describe("Comment @mention notification", () => {
    test.describe.configure({ mode: "serial" });

    test("mentioned user sees notification and can open the comment thread", async ({
        page,
        request,
    }) => {
        test.setTimeout(180_000);
        await skipUnlessSeededAnime(request);

        const uniqueMark = `mention-e2e-${Date.now()}`;

        await test.step("Log in as regular user", async () => {
            await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
            await visualPause(page);
        });

        await test.step("Open seeded anime detail", async () => {
            await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
            await expect(
                page.getByRole("heading", { name: "E2E Anime Fixture" }),
            ).toBeVisible();
            await visualPause(page);
        });

        await test.step("Write a comment that @mentions E2E Admin", async () => {
            const commentSection = page.locator("#comments");
            await commentSection.scrollIntoViewIfNeeded();
            await visualPause(page);

            const editor = commentSection.locator(".ql-editor").first();
            await editor.click();
            await page.keyboard.type("@E2E");
            await expect(
                page.locator("[data-mention-dropdown]"),
            ).toBeVisible({ timeout: 15_000 });
            await visualPause(page);

            await page
                .locator("[data-mention-dropdown]")
                .getByRole("button", { name: "E2E Admin", exact: true })
                .click();
            await expect(
                commentSection
                    .getByRole("button")
                    .filter({ hasText: "@E2E Admin" }),
            ).toBeVisible();
            await visualPause(page);

            await editor.click();
            await page.keyboard.type(` ${uniqueMark}`);
            await visualPause(page);

            await commentSection
                .getByRole("button", { name: "Comment" })
                .click();
            await expect(
                commentSection.getByText(uniqueMark, { exact: false }).first(),
            ).toBeVisible({ timeout: 20_000 });
            await visualPause(page);
        });

        await test.step("Log out (user)", async () => {
            await logoutGroupTenant(page);
            await visualPause(page);
        });

        await test.step("Log in as E2E Admin", async () => {
            await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
            await visualPause(page);
        });

        await test.step("Open notifications and click mention", async () => {
            await page.locator(".notification-icon").click();
            await expect(
                page.getByRole("heading", { name: "Notifications" }),
            ).toBeVisible();
            await visualPause(page);

            const mentionRow = page
                .getByRole("button")
                .filter({ hasText: /mentioned you/i })
                .filter({ hasText: uniqueMark });
            await expect(mentionRow.first()).toBeVisible({ timeout: 25_000 });
            await visualPause(page);

            await mentionRow.first().click();
            await expect(page).toHaveURL(/\/animes\/.+#comments/, {
                timeout: 30_000,
            });
            await visualPause(page);
        });

        await test.step("Land on anime page with comments and the mention text", async () => {
            await expect(page).toHaveURL(/\/animes\/.+#comments/);
            // Scope to #comments: notification subtitles also contain the same snippet.
            await expect(
                page
                    .locator("#comments")
                    .getByText(uniqueMark, { exact: false })
                    .first(),
            ).toBeVisible({ timeout: 15_000 });
        });
    });
});
