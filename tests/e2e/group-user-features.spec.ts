import { test, expect } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    E2E_MANGA_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    gotoSaveList,
    groupPath,
    loginGroupTenant,
    logoutGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
    skipUnlessSeededManga,
} from "./helpers";

test.describe("Group user features", () => {
    test("guest sees login and register entry points", async ({ page }) => {
        await navigateGroup(page, "/");
        await expect(
            page.getByRole("link", { name: "Sign In" }).first(),
        ).toBeVisible();
        await expect(
            page.getByRole("link", { name: "Sign Up" }).first(),
        ).toBeVisible();
    });

    test("register page loads and links to login", async ({ page }) => {
        await navigateGroup(page, "/register");
        await expect(
            page.getByRole("heading", { name: "Konnichiwa!" }),
        ).toBeVisible();
        await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
        await page.getByRole("link", { name: "Login" }).click();
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    });

    test("guest can create an account and land on group home", async ({
        page,
    }) => {
        const email = `e2e-register-${Date.now()}@example.test`;
        await navigateGroup(page, "/register");
        await page.locator("#name").fill("E2E Register User");
        await page.locator("#email").fill(email);
        await page.locator("#password").fill("password");
        await page.getByRole("button", { name: "Register" }).click();
        await page.waitForURL(
            (u) => !u.pathname.replace(/\/$/, "").endsWith("/register"),
            { timeout: 25_000, waitUntil: "domcontentloaded" },
        );
        await expect(page).toHaveURL(new RegExp(`${groupPath("/")}$`));
        await expect(page.locator(".profile-container")).toBeVisible({
            timeout: 15_000,
        });
    });

    test("newsletter subscribe accepts a new email", async ({ page }) => {
        await navigateGroup(page, "/");
        const email = `e2e-sub-${Date.now()}@example.test`;
        await page
            .getByPlaceholder("Enter your email address")
            .scrollIntoViewIfNeeded();
        await page.getByPlaceholder("Enter your email address").fill(email);
        await page.getByRole("button", { name: /Subscribe Now/i }).click();
        await expect(
            page.locator(".Toastify__toast-body").getByText(/Thanks For Subscribe/i),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("newsletter duplicate email shows already subscribed warning", async ({
        page,
    }) => {
        await navigateGroup(page, "/");
        const email = `e2e-sub-dup-${Date.now()}@example.test`;
        const field = page.getByPlaceholder("Enter your email address");
        await field.scrollIntoViewIfNeeded();
        await field.fill(email);
        await page.getByRole("button", { name: /Subscribe Now/i }).click();
        await expect(
            page.locator(".Toastify__toast-body").getByText(/Thanks For Subscribe/i),
        ).toBeVisible({ timeout: 15_000 });

        await field.fill(email);
        await page.getByRole("button", { name: /Subscribe Now/i }).click();
        await expect(
            page.locator(".Toastify__toast-body").getByText(/already subscribed/i),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("navbar search shows E2E anime fixture", async ({ page, request }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, "/");
        const searchWait = page.waitForResponse(
            (r) =>
                r.request().method() === "GET" &&
                r.url().includes("/search") &&
                r.ok(),
        );
        await page.locator("#search").first().fill("E2E Anime");
        await searchWait;
        await expect(
            page
                .locator('a[href*="/animes/"]')
                .filter({ hasText: "E2E Anime Fixture" })
                .first(),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("animes page search filters to seeded fixture", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, "/animes");
        await page
            .getByPlaceholder("Search Anime & Manga...")
            .fill("E2E Anime Fixture");
        await expect(
            page.getByText("E2E Anime Fixture", { exact: true }).first(),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("authenticated user can open SaveList", async ({ page }) => {
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await gotoSaveList(page);
        await expect(page.getByRole("heading", { name: "My Lists" })).toBeVisible();
    });

    test("authenticated user can like and save anime from detail", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
        await expect(
            page.getByRole("heading", { name: "E2E Anime Fixture" }),
        ).toBeVisible();

        const animeActions = page
            .locator("div.flex.flex-wrap.gap-4")
            .filter({
                has: page.getByRole("button", {
                    name: /Add to Watchlist|Saved/,
                }),
            });
        const animeLike = animeActions.getByRole("button", {
            name: "Like",
            exact: true,
        });
        if (await animeLike.isVisible()) {
            await animeLike.click();
        }
        await expect(
            animeActions.getByRole("button", { name: "Liked" }),
        ).toBeVisible({ timeout: 25_000 });

        const watchBtn = page
            .getByRole("button", { name: /Add to Watchlist|Saved/ })
            .first();
        const label = await watchBtn.textContent();
        if (label?.includes("Add to Watchlist")) {
            await watchBtn.click();
            await expect(
                page.getByRole("button", { name: "Saved" }).first(),
            ).toBeVisible({ timeout: 15_000 });
        } else {
            await expect(
                page.getByRole("button", { name: "Saved" }).first(),
            ).toBeVisible();
        }

        await gotoSaveList(page);
        await expect(
            page.getByRole("heading", { name: "E2E Anime Fixture" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("authenticated user can like and save manga from detail", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);
        await expect(
            page.getByRole("heading", { name: "E2E Manga Fixture" }),
        ).toBeVisible();

        const mangaActions = page
            .locator("div.flex.flex-wrap.items-center.gap-4.my-8")
            .filter({
                has: page.getByRole("button", {
                    name: /Add to Collection|Saved/,
                }),
            });
        const mangaLike = mangaActions.getByRole("button", {
            name: "Like",
            exact: true,
        });
        if (await mangaLike.isVisible()) {
            await mangaLike.click();
        }
        await expect(
            mangaActions.getByRole("button", { name: "Liked" }),
        ).toBeVisible({ timeout: 25_000 });

        const collBtn = page
            .getByRole("button", { name: /Add to Collection|Saved/ })
            .first();
        const collLabel = await collBtn.textContent();
        if (collLabel?.includes("Add to Collection")) {
            await collBtn.click();
            await expect(
                page.getByRole("button", { name: "Saved" }).first(),
            ).toBeVisible({ timeout: 15_000 });
        } else {
            await expect(
                page.getByRole("button", { name: "Saved" }).first(),
            ).toBeVisible();
        }

        await gotoSaveList(page);
        await expect(
            page.getByRole("heading", { name: "E2E Manga Fixture" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("authenticated user can log out", async ({ page }) => {
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await logoutGroupTenant(page);
    });
});
