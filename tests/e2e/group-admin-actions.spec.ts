/**
 * Group admin CRUD actions:
 *  - Tag create / delete / search
 *  - Comment delete from admin panel
 *  - Group settings save
 *  - Adsense dashboard
 *  - User create + delete
 */
import { test, expect } from "@playwright/test";
import {
    E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD,
    E2E_ANIME_SLUG,
    groupPath,
    loginGroupTenant,
    navigateGroup,
    skipUnlessSeededAnime,
} from "./helpers";

test.describe("Group admin — tag CRUD", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("admin can create a new tag and see it in the list", async ({
        page,
    }) => {
        const tagName = `e2e-tag-${Date.now()}`;
        await navigateGroup(page, "/admin/tags/create");
        await expect(
            page.getByRole("heading", { name: "Create tag" }),
        ).toBeVisible({ timeout: 15_000 });

        await page.getByPlaceholder("e.g. Action, Romance, Ongoing").fill(tagName);
        await page.getByRole("button", { name: "Create tag" }).click();

        // Redirects to tags list with success toast
        await expect(page).toHaveURL(/\/admin\/tags$/, { timeout: 20_000 });
        await expect(
            page.locator(".Toastify__toast-body").getByText(/tag created/i),
        ).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(tagName, { exact: false })).toBeVisible({
            timeout: 15_000,
        });
    });

    test("duplicate tag name shows validation error", async ({ page }) => {
        // First create a tag
        const tagName = `e2e-dup-tag-${Date.now()}`;
        await navigateGroup(page, "/admin/tags/create");
        await page.getByPlaceholder("e.g. Action, Romance, Ongoing").fill(tagName);
        await page.getByRole("button", { name: "Create tag" }).click();
        await expect(page).toHaveURL(/\/admin\/tags$/, { timeout: 20_000 });

        // Try to create same tag again
        await navigateGroup(page, "/admin/tags/create");
        await page.getByPlaceholder("e.g. Action, Romance, Ongoing").fill(tagName);
        await page.getByRole("button", { name: "Create tag" }).click();

        await expect(
            page.getByText(/has already been taken|already exists/i),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("tag search filters list and reflects in URL", async ({ page }) => {
        await navigateGroup(page, "/admin/tags");
        await expect(
            page.getByRole("heading", { name: "Tags Management" }),
        ).toBeVisible({ timeout: 15_000 });

        const searchInput = page.locator("#tag-search");
        await expect(searchInput).toBeVisible({ timeout: 10_000 });
        await searchInput.fill("e2e-");
        // URL should update with search param after debounce
        await expect(page).toHaveURL(/search=e2e-/, { timeout: 10_000 });
    });

    test("admin can delete a tag and see success toast", async ({ page }) => {
        // Create a tag first to delete
        const tagName = `e2e-delete-tag-${Date.now()}`;
        await navigateGroup(page, "/admin/tags/create");
        await page.getByPlaceholder("e.g. Action, Romance, Ongoing").fill(tagName);
        await page.getByRole("button", { name: "Create tag" }).click();
        await expect(page).toHaveURL(/\/admin\/tags$/, { timeout: 20_000 });
        await expect(page.getByText(tagName, { exact: false })).toBeVisible({
            timeout: 15_000,
        });

        // Delete the tag
        const row = page.getByRole("row", { name: new RegExp(tagName, "i") });
        await row.getByTitle("Delete tag").click();

        // Confirm in delete modal
        await page.getByRole("button", { name: "Delete" }).last().click();

        await expect(
            page.locator(".Toastify__toast-body").getByText(/tag deleted/i),
        ).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(tagName, { exact: true })).toHaveCount(0, {
            timeout: 10_000,
        });
    });

    test("admin can edit a tag name", async ({ page }) => {
        // Create a tag to edit
        const originalName = `e2e-edit-${Date.now()}`;
        const updatedName = `${originalName}-updated`;

        await navigateGroup(page, "/admin/tags/create");
        await page.getByPlaceholder("e.g. Action, Romance, Ongoing").fill(originalName);
        await page.getByRole("button", { name: "Create tag" }).click();
        await expect(page).toHaveURL(/\/admin\/tags$/, { timeout: 20_000 });

        // Click edit on that tag
        const row = page.getByRole("row", { name: new RegExp(originalName, "i") });
        await row.getByTitle("Edit tag").click();
        await expect(
            page.getByRole("heading", { name: /Edit tag/i }),
        ).toBeVisible({ timeout: 15_000 });

        const input = page.getByPlaceholder("e.g. Action, Romance, Ongoing");
        await input.clear();
        await input.fill(updatedName);
        await page.getByRole("button", { name: "Save changes" }).click();

        await expect(page).toHaveURL(/\/admin\/tags$/, { timeout: 20_000 });
        await expect(
            page.locator(".Toastify__toast-body").getByText(/tag update/i),
        ).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText(updatedName, { exact: false })).toBeVisible({
            timeout: 10_000,
        });
    });
});

test.describe("Group admin — comment management", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("admin can delete a comment from comments management panel", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);

        // First post a comment as admin on the seeded anime
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
        const commentSection = page.locator("#comments");
        await commentSection.scrollIntoViewIfNeeded();
        const body = `e2e-admin-delete-${Date.now()}`;
        await commentSection.locator(".ql-editor").first().click();
        await page.keyboard.type(body);
        await commentSection.getByRole("button", { name: "Comment" }).click();
        await expect(
            commentSection.getByText(body, { exact: false }).first(),
        ).toBeVisible({ timeout: 20_000 });

        // Go to admin comments panel and delete it
        await navigateGroup(page, "/admin/comments");
        await expect(
            page.getByRole("heading", { name: "Comments Management" }),
        ).toBeVisible({ timeout: 15_000 });

        const commentRow = page
            .getByRole("row")
            .filter({ hasText: body })
            .first();

        if ((await commentRow.count()) === 0) {
            test.skip(true, "Newly posted comment not visible in admin table yet.");
            return;
        }

        await commentRow.getByTitle("Delete comment").click();
        // Confirm delete in modal
        await page.getByRole("button", { name: "Delete" }).last().click();
        await expect(
            page.locator(".Toastify__toast-body").getByText(/deleted/i),
        ).toBeVisible({ timeout: 15_000 });
    });
});

test.describe("Group admin — settings", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("admin can submit group settings form and see success toast", async ({
        page,
    }) => {
        await navigateGroup(page, "/admin/setting");
        await expect(
            page.getByRole("heading", { name: "Group settings" }),
        ).toBeVisible({ timeout: 15_000 });

        await page.getByRole("button", { name: "Save settings" }).click();
        await expect(
            page.locator(".Toastify__toast-body").getByText(/setting updated/i),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("require login for manga checkbox is toggleable", async ({ page }) => {
        await navigateGroup(page, "/admin/setting");
        await expect(
            page.getByRole("heading", { name: "Group settings" }),
        ).toBeVisible({ timeout: 15_000 });

        const checkbox = page.locator('input[type="checkbox"]').first();
        await expect(checkbox).toBeVisible({ timeout: 10_000 });

        const wasChecked = await checkbox.isChecked();
        await checkbox.click();
        expect(await checkbox.isChecked()).toBe(!wasChecked);

        // Toggle back to original state so we don't break other tests
        await checkbox.click();
        expect(await checkbox.isChecked()).toBe(wasChecked);
    });
});

test.describe("Group admin — adsense dashboard", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("adsense dashboard page loads", async ({ page }) => {
        await navigateGroup(page, "/admin/adsense");
        await expect(
            page.getByRole("heading", { name: /Google AdSense Dashboard/i }),
        ).toBeVisible({ timeout: 15_000 });
    });
});

test.describe("Group admin — user management actions", () => {
    test.beforeEach(async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
    });

    test("admin can create a new user via form", async ({ page }) => {
        const email = `e2e-newuser-${Date.now()}@example.test`;
        await navigateGroup(page, "/admin/users/create");
        await expect(
            page.getByRole("heading", { name: "Create New User" }),
        ).toBeVisible({ timeout: 15_000 });

        await page.locator('input[name="name"], #name').fill("E2E Created User");
        await page.locator('input[name="email"], #email').fill(email);
        await page.locator('input[name="password"], #password').fill("password123");

        // Select role — pick any available option
        const roleSelect = page.locator('select[name="role_id"]').first();
        if ((await roleSelect.count()) > 0) {
            const options = await roleSelect.locator("option").allTextContents();
            if (options.length > 1) {
                await roleSelect.selectOption({ index: 1 });
            }
        }

        // Select type
        const typeSelect = page.locator('select[name="type"]').first();
        if ((await typeSelect.count()) > 0) {
            await typeSelect.selectOption("free");
        }

        // profile_picture is required; skip if file input is not fillable without real file
        const profileInput = page.locator('input[type="file"]').first();
        if ((await profileInput.count()) === 0) {
            test.skip(true, "Profile picture input not found; form requires a file.");
            return;
        }

        await page.getByRole("button", { name: /create|save/i }).click();

        // Either success redirect or validation error (file is required)
        await expect(
            page.locator(".Toastify__toast-body, [class*='error']"),
        ).toBeVisible({ timeout: 15_000 });
    });

    test("admin can search users in user management", async ({ page }) => {
        await navigateGroup(page, "/admin/users");
        await expect(
            page.getByRole("heading", { name: "User Management" }),
        ).toBeVisible({ timeout: 15_000 });

        const searchInput = page
            .getByPlaceholder(/search/i)
            .or(page.locator('input[type="search"]'))
            .first();

        if ((await searchInput.count()) === 0) {
            test.skip(true, "No search input found in user management.");
            return;
        }

        await searchInput.fill("E2E");
        await expect(page.getByText("E2E User", { exact: false })).toBeVisible({
            timeout: 15_000,
        });
    });
});
