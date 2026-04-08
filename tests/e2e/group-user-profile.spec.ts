import { test, expect } from "@playwright/test";
import {
    E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD,
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    inertiaAuthUserId,
    loginGroupTenant,
    logoutGroupTenant,
    navigateGroup,
} from "./helpers";

test.describe("Group user profile", () => {
    test("authenticated user can open profile and see account info", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, "/user/profile");
        await expect(
            page.getByRole("heading", { name: "E2E User", exact: true }),
        ).toBeVisible();
        await expect(page.getByText("Join Date", { exact: true }).first()).toBeVisible();
        await expect(
            page.locator('form input:not([readonly]):not([type="file"])').first(),
        ).toHaveValue(E2E_USER_EMAIL);
        await expect(
            page.getByRole("button", { name: "Update" }),
        ).toBeVisible();
    });

    test("authenticated user can submit profile form and see success toast", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, "/user/profile");

        await page.getByRole("button", { name: "Update" }).click();
        await expect(page.locator(".Toastify__toast-body")).toContainText(
            /Update profile successful/i,
            { timeout: 15_000 },
        );
    });

    test("member can open another group member public profile (read-only)", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
        await navigateGroup(page, "/user/profile");
        const adminId = await inertiaAuthUserId(page);
        await logoutGroupTenant(page);

        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);
        await navigateGroup(page, `/user/profile/${adminId}`);
        await expect(
            page.getByRole("heading", { name: "E2E Admin", exact: true }),
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Update" }),
        ).not.toBeVisible();
    });
});
