import { defineConfig, devices } from "@playwright/test";

/**
 * Set PLAYWRIGHT_BASE_URL to match `php artisan serve` (default http://127.0.0.1:8000).
 * Run the Vite dev server or `npm run build` so Inertia assets load.
 *
 * Seed e2e users and delta-scoped fixtures: `php artisan db:seed --class=E2ESeeder`
 * (after migrations and Role/Group seeders). Search / anime / manga detail tests skip when
 * those fixtures are missing (HTTP check). Uses workers=2 to reduce login-route contention.
 *
 * Slow motion (all e2e tests): set `PLAYWRIGHT_SLOW_MO` to milliseconds between actions, e.g.
 *   PLAYWRIGHT_SLOW_MO=400 npm run test:e2e
 *   PLAYWRIGHT_SLOW_MO=400 npm run test:e2e:ui
 * Omit or use 0 for full speed (default).
 */
export default defineConfig({
    testDir: "./tests/e2e",
    /** Default 30s is tight with `slowMo` and Inertia detail pages (login + navigate + UI). */
    timeout: 60_000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 2,
    reporter: process.env.CI ? "github" : "html",
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:8000",
        /** Align with `timeout`; default 30s can fail slow Inertia navigations before the test budget. */
        navigationTimeout: 60_000,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        launchOptions: {
            slowMo: Number(process.env.PLAYWRIGHT_SLOW_MO ?? 400),
        },
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
