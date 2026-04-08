import { test, expect } from "@playwright/test";
import { groupPath, navigateGroup } from "./helpers";

test.describe("Group site navigation", () => {
    test("home, anime list, anime detail, manga detail", async ({ page }) => {
        await navigateGroup(page, "/");
        await expect(page).toHaveURL(new RegExp(`${groupPath("/")}$`));

        await navigateGroup(page, "/animes");
        await expect(page).toHaveURL(/\/animes$/);

        const animeLink = page.locator(`a[href*="/animes/"]`).first();
        await expect(animeLink).toBeVisible();
        await animeLink.click();
        await expect(page).toHaveURL(/\/animes\/.+/);

        await navigateGroup(page, "/");
        const mangaLink = page.locator(`a[href*="/mangas/"]`).first();
        await expect(mangaLink).toBeVisible();
        await mangaLink.click();
        await expect(page).toHaveURL(/\/mangas\/.+/);
    });
});
