import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

export const E2E_GROUP =
    process.env.E2E_GROUP_SUBDOMAIN?.replace(/^\//, "") ?? "delta";

export const E2E_USER_EMAIL =
    process.env.E2E_USER_EMAIL ?? "e2e-user@example.test";

export const E2E_USER_PASSWORD =
    process.env.E2E_USER_PASSWORD ?? "password";

export const E2E_ADMIN_EMAIL =
    process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@example.test";

export const E2E_ADMIN_PASSWORD =
    process.env.E2E_ADMIN_PASSWORD ?? "password";

/** Slugs for content created by `E2ESeeder` (from `name` via Spatie sluggable). */
export const E2E_ANIME_SLUG =
    process.env.E2E_ANIME_SLUG ?? "e2e-anime-fixture";
export const E2E_MANGA_SLUG =
    process.env.E2E_MANGA_SLUG ?? "e2e-manga-fixture";

/** Group login; waits until the URL is no longer the login page. */
export async function loginGroupTenant(
    page: Page,
    email: string,
    password: string,
): Promise<void> {
    await page.goto(groupPath("/login"), {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
    });
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL(
        (u) => {
            const path = new URL(u).pathname.replace(/\/$/, "");
            return !path.endsWith("/login");
        },
        { timeout: 25_000, waitUntil: "domcontentloaded" },
    );
}

const groupNavigationWait = {
    waitUntil: "domcontentloaded" as const,
    timeout: 60_000,
};

/**
 * Navigate under the group tenant without waiting for full `load` (Inertia pages with
 * media or long-lived requests can hang Playwright’s default `goto`).
 */
export async function navigateGroup(page: Page, path: string): Promise<void> {
    await page.goto(groupPath(path), groupNavigationWait);
}

/** Open the group savelist (same navigation semantics as {@link navigateGroup}). */
export async function gotoSaveList(page: Page): Promise<void> {
    await navigateGroup(page, "/savelist");
}

/** Path under the group tenant, e.g. `groupPath("/animes")` → `/delta/animes` */
export function groupPath(path: string): string {
    if (path === "/" || path === "") {
        return `/${E2E_GROUP}`;
    }
    const p = path.startsWith("/") ? path : `/${path}`;
    return `/${E2E_GROUP}${p}`;
}

/**
 * Skip the current test when E2ESeeder content is missing (404 on fixture anime).
 * Playwright `request` uses `use.baseURL` from the project config.
 */
export async function skipUnlessSeededAnime(
    request: APIRequestContext,
): Promise<void> {
    const res = await request.get(groupPath(`/animes/${E2E_ANIME_SLUG}`));
    test.skip(
        !res.ok(),
        `E2E anime fixture missing (HTTP ${res.status()}). Run: php artisan db:seed --class=E2ESeeder`,
    );
}

export async function skipUnlessSeededManga(
    request: APIRequestContext,
): Promise<void> {
    const res = await request.get(groupPath(`/mangas/${E2E_MANGA_SLUG}`));
    test.skip(
        !res.ok(),
        `E2E manga fixture missing (HTTP ${res.status()}). Run: php artisan db:seed --class=E2ESeeder`,
    );
}

/** Open profile menu, confirm logout modal, wait until signed out. */
/**
 * Extra pause between major steps when demo-watching (ms). Works alongside global
 * `PLAYWRIGHT_SLOW_MO` from playwright.config.ts. Example:
 * `E2E_STEP_PAUSE=500 PLAYWRIGHT_SLOW_MO=400 npm run test:e2e:ui`
 */
export async function visualPause(page: Page): Promise<void> {
    const ms = Number(process.env.E2E_STEP_PAUSE ?? 0);
    if (ms > 0) {
        await page.waitForTimeout(ms);
    }
}

/** Current session user id from Inertia’s `#app` payload (after a full page load or visit). */
export async function inertiaAuthUserId(page: Page): Promise<number> {
    const raw = await page.locator("#app").getAttribute("data-page");
    if (!raw) {
        throw new Error("Missing Inertia #app data-page");
    }
    const data = JSON.parse(raw) as {
        props: { auth?: { user?: { id: number } } };
    };
    const id = data.props.auth?.user?.id;
    if (typeof id !== "number") {
        throw new Error("Not authenticated or missing user id in page props");
    }
    return id;
}

export async function logoutGroupTenant(page: Page): Promise<void> {
    await page.locator(".profile-container").click();
    await page.getByText("Logout", { exact: true }).first().click();
    await expect(
        page.getByText("Are you sure want to logout.", { exact: false }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(
        page.getByRole("link", { name: "Sign In" }).first(),
    ).toBeVisible({
        timeout: 20_000,
    });
}
