import { test, expect } from "@playwright/test";
import {
    E2E_ADMIN_EMAIL,
    E2E_ADMIN_PASSWORD,
    groupPath,
    loginGroupTenant,
    navigateGroup,
} from "./helpers";

test.describe("Group admin", () => {
    test("admin can open group dashboard", async ({ page }) => {
        await loginGroupTenant(page, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD);
        await expect(page).toHaveURL(new RegExp(`${groupPath("/")}$`));

        await navigateGroup(page, "/admin/dashboard");
        await expect(page).toHaveURL(/\/admin\/dashboard/);
    });
});
