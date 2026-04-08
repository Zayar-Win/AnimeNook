import { expect, test } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    groupPath,
    navigateGroup,
    skipUnlessSeededAnime,
} from "./helpers";

/**
 * Guest must be sent to group login for actions that require auth (watchlist, etc.).
 */
test.describe("Group guest gates", () => {
    test("guest on anime detail: Add to Watchlist navigates to group login", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
        await expect(
            page.getByRole("heading", { name: "E2E Anime Fixture" }),
        ).toBeVisible({ timeout: 15_000 });

        await page
            .getByRole("button", { name: /Add to Watchlist/i })
            .first()
            .click();
        await expect(page).toHaveURL(new RegExp(`${groupPath("/login")}$`), {
            timeout: 15_000,
        });
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    });
});
