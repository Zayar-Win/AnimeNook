import { test, expect } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    E2E_MANGA_SLUG,
    groupPath,
    navigateGroup,
    skipUnlessSeededAnime,
    skipUnlessSeededManga,
} from "./helpers";

test.describe("Group site navigation", () => {
    test("home page loads at group root", async ({ page }) => {
        await navigateGroup(page, "/");
        await expect(page).toHaveURL(new RegExp(`${groupPath("/")}$`));
    });

    test("anime list page loads", async ({ page }) => {
        await navigateGroup(page, "/animes");
        await expect(page).toHaveURL(/\/animes$/);
    });

    test("seeded anime detail loads from direct URL", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
        await expect(page).toHaveURL(/\/animes\/.+/);
        await expect(
            page.getByRole("heading", { name: "E2E Anime Fixture" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("seeded manga detail loads from direct URL", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);
        await expect(page).toHaveURL(/\/mangas\/.+/);
        await expect(
            page.getByRole("heading", { name: "E2E Manga Fixture" }),
        ).toBeVisible({ timeout: 15_000 });
    });
});
