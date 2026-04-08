import { expect, test } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    E2E_MANGA_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    loginGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
    skipUnlessSeededManga,
} from "./helpers";

test.describe("Group ratings", () => {
    test("authenticated user can rate seeded anime from detail", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
        await expect(
            page.getByRole("heading", { name: "E2E Anime Fixture" }),
        ).toBeVisible();

        await page.locator(".react-stars").first().locator("> span").nth(4).click();
        await expect(page.locator(".Toastify__toast-body")).toContainText(
            /rating/i,
            { timeout: 15_000 },
        );
    });

    test("authenticated user can rate seeded manga from detail", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);
        await expect(
            page.getByRole("heading", { name: "E2E Manga Fixture" }),
        ).toBeVisible();

        await page.locator(".react-stars").first().locator("> span").nth(4).click();
        await expect(page.locator(".Toastify__toast-body")).toContainText(
            /rating/i,
            { timeout: 15_000 },
        );
    });
});
