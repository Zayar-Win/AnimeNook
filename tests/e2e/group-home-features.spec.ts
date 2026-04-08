import { expect, test } from "@playwright/test";
import { navigateGroup, skipUnlessSeededAnime } from "./helpers";

test.describe("Group home", () => {
    test("home shows key sections and seeded trending anime when present", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, "/");
        await expect(page.getByText("Trending Now")).toBeVisible({
            timeout: 15_000,
        });
        await expect(page.getByText("Popular Series").first()).toBeVisible();
        await expect(page.getByText("Popular Manga").first()).toBeVisible();
        await expect(
            page.getByText("E2E Anime Fixture", { exact: true }).first(),
        ).toBeVisible({ timeout: 15_000 });
    });
});
