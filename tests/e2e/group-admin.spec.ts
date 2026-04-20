import { test, expect } from "@playwright/test";
import {
    E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD,
    E2E_ANIME_SLUG,
    E2E_MANGA_SLUG,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    groupPath,
    loginGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
    skipUnlessSeededManga,
} from "./helpers";

test.describe("Group admin access control", () => {
    test("non-admin is redirected away from admin dashboard", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, "/admin/dashboard");
        await expect(page).toHaveURL(new RegExp(`${groupPath("/")}$`), {
            timeout: 20_000,
        });
    });
});

test.describe("Group admin — list and settings pages", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("dashboard loads", async ({ page }) => {
        await navigateGroup(page, "/admin/dashboard");
        await expect(page).toHaveURL(/\/admin\/dashboard/);
        await expect(page.getByText("Dashboard").first()).toBeVisible({
            timeout: 15_000,
        });
    });

    test("users index loads", async ({ page }) => {
        await navigateGroup(page, "/admin/users");
        await expect(page.getByRole("heading", { name: "User Management" })).toBeVisible({
            timeout: 15_000,
        });
    });

    test("subscribers index loads", async ({ page }) => {
        await navigateGroup(page, "/admin/subscribers");
        await expect(
            page.getByRole("heading", { name: "Subscribers Management" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("animes index loads", async ({ page }) => {
        await navigateGroup(page, "/admin/animes");
        await expect(
            page.getByRole("heading", { name: "Anime Management" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("mangas index loads", async ({ page }) => {
        await navigateGroup(page, "/admin/mangas");
        await expect(
            page.getByRole("heading", { name: "Manga Management" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("comments index loads", async ({ page }) => {
        await navigateGroup(page, "/admin/comments");
        await expect(
            page.getByRole("heading", { name: "Comments Management" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("tags index loads", async ({ page }) => {
        await navigateGroup(page, "/admin/tags");
        await expect(
            page.getByRole("heading", { name: "Tags Management" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("group settings loads", async ({ page }) => {
        await navigateGroup(page, "/admin/setting");
        await expect(
            page.getByRole("heading", { name: "Group settings" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("banners management loads", async ({ page }) => {
        await navigateGroup(page, "/admin/banners");
        await expect(
            page.getByRole("heading", { name: "Banners Management" }),
        ).toBeVisible({ timeout: 15_000 });
    });
});

test.describe("Group admin — create forms (GET)", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("create anime form loads", async ({ page }) => {
        await navigateGroup(page, "/admin/animes/create");
        await expect(
            page.getByRole("heading", { name: "Create New Anime" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("create manga form loads", async ({ page }) => {
        await navigateGroup(page, "/admin/mangas/create");
        await expect(
            page.getByRole("heading", { name: "Create New Manga" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("create user form loads", async ({ page }) => {
        await navigateGroup(page, "/admin/users/create");
        await expect(
            page.getByRole("heading", { name: "Create New User" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("create tag form loads", async ({ page }) => {
        await navigateGroup(page, "/admin/tags/create");
        await expect(
            page.getByRole("heading", { name: "Create New Tag" }),
        ).toBeVisible({ timeout: 15_000 });
    });
});

test.describe("Group admin — edit flows (seeded fixtures)", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("edit seeded anime, seasons tab, open create season", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, "/admin/animes");
        const row = page.getByRole("row", { name: /E2E Anime Fixture/i });
        await expect(row.first()).toBeVisible({ timeout: 15_000 });
        await row.first().getByTitle("Edit Anime").click();
        await expect(
            page.getByRole("heading", { name: "Edit Anime" }),
        ).toBeVisible({ timeout: 15_000 });

        await page.getByRole("button", { name: "Seasons" }).click();
        await page.getByRole("link", { name: "Create Season" }).click();
        await expect(page).toHaveURL(
            new RegExp(`/admin/animes/${E2E_ANIME_SLUG}/seasons/create`),
        );
        await expect(
            page.getByRole("heading", { name: "Create Season" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("edit seeded anime, episodes tab, new episode and edit episode", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, "/admin/animes");
        const row = page.getByRole("row", { name: /E2E Anime Fixture/i });
        await expect(row.first()).toBeVisible({ timeout: 15_000 });
        await row.first().getByTitle("Edit Anime").click();
        await expect(
            page.getByRole("heading", { name: "Edit Anime" }),
        ).toBeVisible({ timeout: 15_000 });
        const animeEditUrl = page.url();

        await page.getByRole("button", { name: "Episodes" }).click();
        await page.getByRole("link", { name: "Create Episode" }).click();
        await expect(
            page.getByRole("heading", { name: "New Episode" }),
        ).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText("E2E Anime Fixture").first()).toBeVisible();

        await page.goto(animeEditUrl, { waitUntil: "domcontentloaded" });
        await page.getByRole("button", { name: "Episodes" }).click();
        await page.getByTitle("Edit Episode").first().click();
        await expect(
            page.getByRole("heading", { name: "Edit Episode" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("edit seeded manga, chapters tab, new chapter and edit chapter", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await navigateGroup(page, "/admin/mangas");
        const row = page.getByRole("row", { name: /E2E Manga Fixture/i });
        await expect(row.first()).toBeVisible({ timeout: 15_000 });
        await row.first().getByTitle("Edit Manga").click();
        await expect(
            page.getByRole("heading", { name: "Edit Manga" }),
        ).toBeVisible({ timeout: 15_000 });

        const mangaEditUrl = page.url();

        await page.getByRole("button", { name: "Chapters" }).click();
        await page.getByRole("link", { name: "Create Chapter" }).click();
        await expect(
            page.getByRole("heading", { name: "New Chapter" }),
        ).toBeVisible({ timeout: 15_000 });

        await page.goto(mangaEditUrl, { waitUntil: "domcontentloaded" });
        await page.getByRole("button", { name: "Chapters" }).click();
        await page.getByTitle("Edit Chapter").first().click();
        await expect(
            page.getByRole("heading", { name: "Edit Chapter" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("edit seeded manga, seasons tab, open create season", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await navigateGroup(page, "/admin/mangas");
        const row = page.getByRole("row", { name: /E2E Manga Fixture/i });
        await row.first().getByTitle("Edit Manga").click();
        await page.getByRole("button", { name: "Seasons" }).click();
        await page.getByRole("link", { name: "Create Season" }).click();
        await expect(page).toHaveURL(
            new RegExp(`/admin/mangas/${E2E_MANGA_SLUG}/seasons/create`),
        );
        await expect(
            page.getByRole("heading", { name: "Create Season" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("admin can open user edit form from users table", async ({
        page,
    }) => {
        await navigateGroup(page, "/admin/users");
        const edit = page.getByRole("link", { name: "Edit User" }).first();
        await expect(edit).toBeVisible({ timeout: 15_000 });
        await edit.click();
        await expect(
            page.getByRole("heading", { name: "Edit User" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("admin can open subscriber edit form from subscribers table", async ({
        page,
    }) => {
        await navigateGroup(page, "/admin/subscribers");
        const edit = page
            .getByRole("link", { name: "Edit Subscriber" })
            .first();
    await expect(edit).toBeVisible({ timeout: 15_000 });
        await edit.click();
        await expect(
            page.getByRole("heading", { name: "Subscriber Edit Form" }),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("edit first tag when tags exist", async ({ page }) => {
        await navigateGroup(page, "/admin/tags");
        const edit = page.getByTitle("Edit Tag").first();
        const count = await edit.count();
        test.skip(count === 0, "No tags in database; run full seed or create a tag.");
        await edit.click();
        await expect(page.getByRole("heading", { name: /Edit Tag/ })).toBeVisible({
            timeout: 15_000,
        });
    });
});
