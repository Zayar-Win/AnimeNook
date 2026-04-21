import { expect, test } from "@playwright/test";
import { navigateGroup } from "./helpers";

test.describe("Group /animes (manga list) filters and deep links", () => {
    test("sort menu updates URL query params", async ({ page }) => {
        await navigateGroup(page, "/animes");
        await expect(
            page.getByPlaceholder("Search manga..."),
        ).toBeVisible();

        const sortTrigger = page.locator("div.sort").first();
        await sortTrigger.hover();
        await expect(page.locator("ul.sort-options")).toBeVisible({
            timeout: 5_000,
        });
        await page
            .locator("ul.sort-options")
            .getByText("Most viewed", { exact: true })
            .evaluate((el) => (el as HTMLElement).click());
        await expect(page).toHaveURL(/sort=popularity/, { timeout: 15_000 });
    });

    test("status menu updates URL when statuses are available", async ({
        page,
    }) => {
        await navigateGroup(page, "/animes");
        const statusTrigger = page.locator("div.status-filter").first();
        if ((await statusTrigger.count()) === 0) {
            test.skip();
        }
        await statusTrigger.hover();
        await expect(page.locator("ul.status-filter-options")).toBeVisible({
            timeout: 5_000,
        });
        const ongoing = page
            .locator("ul.status-filter-options")
            .getByText("Ongoing", { exact: true });
        if ((await ongoing.count()) === 0) {
            test.skip();
        }
        await ongoing.evaluate((el) => (el as HTMLElement).click());
        await expect(page).toHaveURL(/status=ongoing/, { timeout: 15_000 });
    });

    test("footer-style deep link loads browse page with sort param", async ({
        page,
    }) => {
        await navigateGroup(page, "/animes?sort=popularity");
        await expect(page).toHaveURL(/sort=popularity/);
        await expect(
            page.getByPlaceholder("Search manga..."),
        ).toBeVisible();
    });

    test("guest can open manga list from absolute path", async ({ page }) => {
        await navigateGroup(page, "/animes");
        await expect(
            page.getByPlaceholder("Search manga..."),
        ).toBeVisible();
    });
});
