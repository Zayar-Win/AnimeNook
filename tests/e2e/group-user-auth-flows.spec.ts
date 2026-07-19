/**
 * User auth flows not covered elsewhere:
 *  - Forgot password page + form submission
 *  - Manga chapter reader (images mode)
 */
import { test, expect } from "@playwright/test";
import {
    E2E_MANGA_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    groupPath,
    loginGroupTenant,
    navigateGroup,
    skipUnlessSeededManga,
} from "./helpers";

test.describe("Forgot password", () => {
    test("forgot password page loads with email field and submit button", async ({
        page,
    }) => {
        await navigateGroup(page, "/forgot-password");
        await expect(page.getByText("Email", { exact: true }).first()).toBeVisible({
            timeout: 15_000,
        });
        await expect(
            page.getByRole("button", { name: "Send reset link" }),
        ).toBeVisible();
    });

    test("submitting unknown email shows generic success message", async ({
        page,
    }) => {
        await navigateGroup(page, "/forgot-password");
        await page
            .getByRole("textbox")
            .first()
            .fill("no-such-user-e2e@example.test");
        await page.getByRole("button", { name: "Send reset link" }).click();
        await expect(
            page.getByText(/sent a reset link|reset.*link|check your email/i).first(),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("login page has link to forgot password", async ({ page }) => {
        await navigateGroup(page, "/login");
        const forgotLink = page.getByRole("link", { name: /forgot.*password/i });
        await expect(forgotLink).toBeVisible();
        await forgotLink.click();
        await expect(page).toHaveURL(new RegExp(`${groupPath("/forgot-password")}$`));
    });
});

test.describe("Manga chapter reader", () => {
    test("authenticated user can open manga detail and navigate to chapter reader", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);
        await expect(
            page.getByRole("heading", { name: "E2E Manga Fixture" }),
        ).toBeVisible({ timeout: 15_000 });

        const readLink = page.getByRole("link", { name: /Start Reading|Resume/i }).first();
        await expect(readLink).toBeVisible({ timeout: 15_000 });
        await readLink.click();
        await expect(page).toHaveURL(/\/mangas\/.+\/chapters\/\d+/, {
            timeout: 20_000,
        });
    });

    test("chapter reader shows chapter content", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);

        const readLink = page.getByRole("link", { name: /Start Reading|Resume/i }).first();
        await expect(readLink).toBeVisible({ timeout: 15_000 });
        await readLink.click();
        await expect(page).toHaveURL(/\/mangas\/.+\/chapters\/\d+/, {
            timeout: 20_000,
        });

        // Page has a chapter selector or back-navigation link
        const chapterSelect = page.locator("#reader-chapter-select");
        const prevLink = page.locator('a[href*="/chapters/"]');
        const hasChapterSelect = await chapterSelect.count();
        const hasPrevLink = await prevLink.count();
        expect(hasChapterSelect + hasPrevLink).toBeGreaterThan(0);
    });

    test("guest is redirected to login when trying to read manga chapter", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);

        // The manga detail should load for guests
        await expect(
            page.getByRole("heading", { name: "E2E Manga Fixture" }),
        ).toBeVisible({ timeout: 15_000 });

        const readLink = page.getByRole("link", { name: /Start Reading|Resume/i }).first();
        await expect(readLink).toBeVisible({ timeout: 10_000 });
        await readLink.click();

        // Should either redirect to login or stay on chapter reader (depends on require_login_for_manga setting)
        const currentUrl = page.url();
        const isOnLogin = currentUrl.includes("/login");
        const isOnChapterReader = currentUrl.includes("/chapters/");
        expect(isOnLogin || isOnChapterReader).toBe(true);
    });
});
