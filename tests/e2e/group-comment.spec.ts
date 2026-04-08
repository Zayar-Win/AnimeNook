import { test, expect } from "@playwright/test";
import {
    E2E_USER_EMAIL,
    E2E_USER_PASSWORD,
    groupPath,
    loginGroupTenant,
    navigateGroup,
} from "./helpers";

test.describe("Anime comments", () => {
    test("authenticated user can post a top-level comment", async ({
        page,
    }) => {
        await loginGroupTenant(page, E2E_USER_EMAIL, E2E_USER_PASSWORD);

        await navigateGroup(page, "/animes");
        await page.locator(`a[href*="/animes/"]`).first().click();
        await expect(page).toHaveURL(/\/animes\/.+/);

        const commentSection = page.locator("#comments");
        await commentSection.scrollIntoViewIfNeeded();
        const editor = commentSection.locator(".ql-editor").first();
        await editor.click();
        const body = `E2E comment ${Date.now()}`;
        await page.keyboard.type(body);
        await commentSection
            .getByRole("button", { name: "Comment" })
            .click();

        await expect(page.getByText(body, { exact: false })).toBeVisible({
            timeout: 15_000,
        });
    });
});
