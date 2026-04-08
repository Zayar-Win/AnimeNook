import { expect, test } from "@playwright/test";
import { navigateGroup } from "./helpers";

test.describe("Group /animes filters and deep links", () => {
    test("sort and filter menus update URL query params", async ({ page }) => {
        await navigateGroup(page, "/animes");
        await expect(
            page.getByPlaceholder("Search Anime & Manga..."),
        ).toBeVisible();

        // `.sort:hover` shows the list, but the menu sits below the header with a gap;
        // moving the real pointer from "Sort By" to an item leaves `.sort` and closes the menu.
        // Hover to open, then programmatic click on the option (no mouse path through the gap).
        const sortTrigger = page.locator("div.sort").first();
        await sortTrigger.hover();
        await expect(page.locator("ul.sort-options")).toBeVisible({ timeout: 5_000 });
        await page
            .locator("ul.sort-options")
            .getByText("Popularity", { exact: true })
            .evaluate((el) => (el as HTMLElement).click());
        await expect(page).toHaveURL(/sort=popularity/, { timeout: 15_000 });

        const filterTrigger = page.locator("div.filter").first();
        await filterTrigger.hover();
        await expect(page.locator("ul.filter-options")).toBeVisible({ timeout: 5_000 });
        await page
            .locator("ul.filter-options")
            .getByText("Mangas Only", { exact: true })
            .evaluate((el) => (el as HTMLElement).click());
        await expect(page).toHaveURL(/filter=mangas/, { timeout: 15_000 });
    });

    test("footer-style deep link loads browse page with sort param", async ({
        page,
    }) => {
        await navigateGroup(page, "/animes?sort=popularity");
        await expect(page).toHaveURL(/sort=popularity/);
        await expect(
            page.getByPlaceholder("Search Anime & Manga..."),
        ).toBeVisible();
    });

    test("guest can open animes index from absolute path", async ({ page }) => {
        await navigateGroup(page, "/animes");
        await expect(
            page.getByPlaceholder("Search Anime & Manga..."),
        ).toBeVisible();
    });
});
