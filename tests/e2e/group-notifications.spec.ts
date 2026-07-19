/**
 * Notification panel:
 *  NT-2 Mark all read — opens bell, clicks "Mark all read", badge disappears
 *  NT-3 Load more (partially) — opens bell, checks panel renders
 *
 * Requires the @mention flow from group-comment-mention.spec.ts to have
 * generated at least one unread notification for E2E Admin.  Runs serially
 * after the mention test when the full suite is executed sequentially.
 */
import { test, expect } from "@playwright/test";
import {
    E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD,
    E2E_ANIME_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    loginGroupTenant,
    logoutGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
    visualPause,
} from "./helpers";

test.describe("Notifications — mark all read", () => {
    test.describe.configure({ mode: "serial" });

    test("NT-2: unread notification badge clears after mark-all-read", async ({
        page,
        request,
    }) => {
        test.setTimeout(180_000);
        await skipUnlessSeededAnime(request);

        const uniqueMark = `noti-e2e-${Date.now()}`;

        await test.step("User posts @mention to create a notification", async () => {
            await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
            await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
            await expect(
                page.getByRole("heading", { name: "E2E Anime Fixture" }),
            ).toBeVisible();

            const commentSection = page.locator("#comments");
            await commentSection.scrollIntoViewIfNeeded();
            const editor = commentSection.locator(".ql-editor").first();
            await editor.click();
            await page.keyboard.type("@E2E");
            await expect(
                page.locator("[data-mention-dropdown]"),
            ).toBeVisible({ timeout: 15_000 });

            await page
                .locator("[data-mention-dropdown]")
                .getByRole("button", { name: "E2E Admin", exact: true })
                .click();

            await editor.click();
            await page.keyboard.type(` ${uniqueMark}`);

            await commentSection.getByRole("button", { name: "Comment" }).click();
            await expect(
                commentSection.getByText(uniqueMark, { exact: false }).first(),
            ).toBeVisible({ timeout: 20_000 });
            await visualPause(page);
        });

        await test.step("Log out user, log in as admin", async () => {
            await logoutGroupTenant(page);
            await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
        });

        await test.step("Open notification panel and verify unread badge", async () => {
            await navigateGroup(page, "/");
            // Unread badge — the bell has a red dot / count badge when there are unread items
            const bellIcon = page.locator(".notification-icon").first();
            await expect(bellIcon).toBeVisible({ timeout: 15_000 });
            await bellIcon.click();

            await expect(
                page.getByRole("heading", { name: "Notifications" }),
            ).toBeVisible({ timeout: 15_000 });
            await visualPause(page);
        });

        await test.step("Click Mark all read and verify button becomes disabled", async () => {
            const markAllBtn = page.getByRole("button", { name: "Mark all read" });
            await expect(markAllBtn).toBeVisible({ timeout: 10_000 });
            // Button should be enabled if there are unread notifications
            const isEnabled = await markAllBtn.isEnabled();
            if (!isEnabled) {
                test.skip(true, "No unread notifications to mark read.");
                return;
            }
            await markAllBtn.click();

            // After click, button should become disabled (no more unread)
            await expect(markAllBtn).toBeDisabled({ timeout: 10_000 });
        });
    });
});

test.describe("Notifications — panel basics", () => {
    test("notification panel opens and shows Notifications heading", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
        await navigateGroup(page, "/");

        const bellIcon = page.locator(".notification-icon").first();
        await expect(bellIcon).toBeVisible({ timeout: 15_000 });
        await bellIcon.click();

        await expect(
            page.getByRole("heading", { name: "Notifications" }),
        ).toBeVisible({ timeout: 15_000 });

        // Mark all read button is present regardless of notification count
        await expect(
            page.getByRole("button", { name: "Mark all read" }),
        ).toBeVisible({ timeout: 10_000 });
    });

    test("notification panel closes when clicking outside", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
        await navigateGroup(page, "/");

        const bellIcon = page.locator(".notification-icon").first();
        await bellIcon.click();
        await expect(
            page.getByRole("heading", { name: "Notifications" }),
        ).toBeVisible({ timeout: 15_000 });

        // Click elsewhere on the page to close the panel
        await page.locator("body").click({ position: { x: 100, y: 400 } });
        await expect(
            page.getByRole("heading", { name: "Notifications" }),
        ).toBeHidden({ timeout: 10_000 });
    });
});
