import { expect, test } from "@playwright/test";
import {
    E2E_ANIME_SLUG,
    E2E_MANGA_SLUG,
    navigateGroup,
    skipUnlessSeededAnime,
    skipUnlessSeededManga,
} from "./helpers";

test.describe("Group watch/read links", () => {
    test("anime detail exposes primary episode external link", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededAnime(request);
        await navigateGroup(page, `/animes/${E2E_ANIME_SLUG}`);
        const watch = page.locator(
            `a[href*="youtu.be"], a[href*="youtube.com"]`,
        ).first();
        await expect(watch).toBeVisible();
        await expect(watch).toHaveAttribute("href", /youtu\.be|youtube\.com/);
    });

    test("manga detail exposes Start Reading external link", async ({
        page,
        request,
    }) => {
        await skipUnlessSeededManga(request);
        await navigateGroup(page, `/mangas/${E2E_MANGA_SLUG}`);
        const read = page.getByRole("link", { name: "Start Reading" });
        await expect(read).toBeVisible();
        await expect(read).toHaveAttribute("href", /example\.com/);
    });
});
