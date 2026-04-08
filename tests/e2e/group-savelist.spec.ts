import { expect, test, type Page } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    E2E_MANGA_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    gotoSaveList,
    groupPath,
    loginGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
    skipUnlessSeededManga,
} from "./helpers";

async function ensureAnimeUnsavedFromDetail(page: Page) {
    await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
    const watchBtn = page
        .getByRole("button", { name: /Add to Watchlist|Saved/ })
        .first();
    const label = await watchBtn.textContent();
    if (label?.includes("Saved")) {
        await watchBtn.click();
        await expect(
            page.getByRole("button", { name: "Add to Watchlist" }).first(),
        ).toBeVisible({ timeout: 15_000 });
    }
}

test.describe("Group savelist", () => {
    test("guest visiting savelist is redirected to login", async ({ page }) => {
        await navigateGroup(page, "/savelist");
        await expect(page).toHaveURL(new RegExp(`${groupPath("/login")}$`));
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    });

    test.describe("authenticated savelist", () => {
        test.describe.configure({ mode: "serial" });

        test("anime: save from detail, appears under Favourite, remove from list", async ({
            page,
            request,
        }) => {
            await skipUnlessSeededAnime(request);
            await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);

            await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
            const watchBtn = page
                .getByRole("button", { name: /Add to Watchlist|Saved/ })
                .first();
            const watchLabel = await watchBtn.textContent();
            if (watchLabel?.includes("Add to Watchlist")) {
                await watchBtn.click();
                await expect(
                    page.getByRole("button", { name: "Saved" }).first(),
                ).toBeVisible({ timeout: 15_000 });
            }

            await gotoSaveList(page);
            await expect(page.getByRole("heading", { name: "My Lists" })).toBeVisible();
            await expect(page.getByRole("link", { name: "Favourite" })).toBeVisible();
            await expect(
                page.getByRole("heading", { name: "E2E Anime Fixture" }),
            ).toBeVisible({ timeout: 15_000 });

            const animeCard = page.locator("div.group.relative.cursor-pointer").filter({
                has: page.getByRole("heading", { name: "E2E Anime Fixture" }),
            });
            await animeCard.hover();
            await animeCard.locator(".absolute.top-2.right-2").click();

            await expect(
                page.getByRole("heading", { name: "E2E Anime Fixture" }),
            ).toBeHidden({ timeout: 15_000 });
        });

        test("manga: save from detail, appears under Favourite, remove from list", async ({
            page,
            request,
        }) => {
            await skipUnlessSeededManga(request);
            await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);

            await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);
            const collBtn = page
                .getByRole("button", { name: /Add to Collection|Saved/ })
                .first();
            const collLabel = await collBtn.textContent();
            if (collLabel?.includes("Add to Collection")) {
                await collBtn.click();
                await expect(
                    page.getByRole("button", { name: "Saved" }).first(),
                ).toBeVisible({ timeout: 15_000 });
            }

            await gotoSaveList(page);
            await expect(page.getByRole("heading", { name: "My Lists" })).toBeVisible();
            await expect(
                page.getByRole("heading", { name: "E2E Manga Fixture" }),
            ).toBeVisible({ timeout: 15_000 });

            const mangaCard = page.locator("div.group.relative.cursor-pointer").filter({
                has: page.getByRole("heading", { name: "E2E Manga Fixture" }),
            });
            await mangaCard.hover();
            await mangaCard.locator(".absolute.top-2.right-2").click();

            await expect(
                page.getByRole("heading", { name: "E2E Manga Fixture" }),
            ).toBeHidden({ timeout: 15_000 });
        });

        test("can open History tab on savelist", async ({ page }) => {
            await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
            await gotoSaveList(page);
            await page.getByRole("link", { name: "History" }).click();
            await expect(page).toHaveURL(/tab=history/);
            await expect(page.getByText("No Items Saved")).toBeVisible({
                timeout: 15_000,
            });
        });

        test("can unsave anime from detail page", async ({ page, request }) => {
            await skipUnlessSeededAnime(request);
            await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);

            await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
            const toggle = page
                .getByRole("button", { name: /Add to Watchlist|Saved/ })
                .first();
            if ((await toggle.textContent())?.includes("Add to Watchlist")) {
                await toggle.click();
                await expect(
                    page.getByRole("button", { name: "Saved" }).first(),
                ).toBeVisible({ timeout: 15_000 });
            }
            await page.getByRole("button", { name: "Saved" }).first().click();
            await expect(
                page.getByRole("button", { name: "Add to Watchlist" }).first(),
            ).toBeVisible({ timeout: 15_000 });
        });

        test("can save anime from home card bookmark", async ({
            page,
            request,
        }) => {
            await skipUnlessSeededAnime(request);
            await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
            await ensureAnimeUnsavedFromDetail(page);

            await navigateGroup(page, "/");
            const rising = page
                .locator("div")
                .filter({ hasText: "Rising Star" })
                .filter({ hasText: "E2E Anime Fixture" });
            const popularCard = page
                .locator("#popular-series")
                .locator(`a[href*="/animes/${E2E_ANIME_SLUG}"]`)
                .first();

            if ((await rising.count()) > 0) {
                await rising
                    .getByRole("button", { name: /Watchlist|Saved/ })
                    .first()
                    .click();
            } else if ((await popularCard.count()) > 0) {
                await popularCard.locator("button").first().click();
            } else {
                test.skip(
                    true,
                    "E2E anime not on home (trending/popular); seed or adjust fixtures.",
                );
            }

            await expect(page.locator(".Toastify__toast-body")).toContainText(
                /saved item|favourite/i,
                { timeout: 15_000 },
            );
        });
    });
});
