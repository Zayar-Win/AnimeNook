# E2E test matrix (group tenant & platform)

Reference for product behavior and Playwright coverage. Paths use the group prefix from `E2E_GROUP` (default `delta`), e.g. `/delta/login`.

## Legend

| Status   | Meaning                                              |
| -------- | ---------------------------------------------------- |
| Covered  | Automated in `tests/e2e/*.spec.ts`                     |
| Partial  | Some scenarios covered; see notes                    |
| Planned  | Not automated yet — prerequisites or product gap     |

---

## 1. Guest gates (anime detail → auth)

**Intent:** Logged-out users should be sent to **group login** when an action requires an account (if that is the chosen product behavior).

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| GG-1    | Guest opens anime detail, clicks **Add to Watchlist**                    | Navigates to `/{group}/login` | Covered | `group-guest-gates.spec.ts` |
| GG-2    | Guest opens anime detail, clicks **Like**                                | Redirect to login (route is `auth`-middleware) | See spec | Inertia may surface login redirect |
| GG-3    | Guest focuses comment flow / submit                                      | Comment create routes are `auth` — UI should gate or redirect | Partial | Confirm `CommentForm` / submit path |
| GG-4    | Guest opens **SaveList** directly                                        | Redirect to `/{group}/login` | Covered | `group-savelist.spec.ts` |

---

## 2. Notifications (beyond @mention)

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| NT-1    | User A comment; User B **replies** to A                                    | A receives **reply** notification (`comment_reply` / `notification_type`) | Planned | Needs two seeded users + bell + notification row |
| NT-2    | **Mark all read** in bell dropdown                                       | Unread cleared; badge hidden | Covered | `group-notifications.spec.ts` |
| NT-2b   | Notification panel opens and closes                                     | Bell opens panel; click outside closes it | Covered | `group-notifications.spec.ts` |
| NT-3    | **Load more** (infinite scroll) when more than first page                  | Next page appends; no duplicate rows | Partial | Navbar observer + `NotificationController@index` paginate |
| NT-4    | @mention path (admin opens thread)                                       | Lands on `#comments` with mention text | Covered | `group-comment-mention.spec.ts` |

---

## 3. Save list

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| SL-1    | **History** tab                                                          | URL contains `tab=history`; empty state or list | Covered | `group-savelist.spec.ts` |
| SL-2    | **Favourite** (default collection) shows saved anime/manga               | Fixture titles visible | Covered | Same file |
| SL-3    | Switching **Favourite vs other collections** (when multiple exist)        | List filters by collection | Planned | Requires user with 2+ collections in seed data |

---

## 4. Anime detail UX

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| AD-1    | **Season switcher** with multi-season fixture                            | Open “Select Season”, choose another season, episode list updates | Planned | `E2ESeeder` currently creates one season per anime |
| AD-2    | Open anime URL with **`#comments`** — scroll to comments without bell | Comments section in view | Planned | `VideoDetail` scrolls via `?scrollTo=` query param, not hash (`getQueryParams.jsx`); align product or test `?scrollTo=comments` if `id="comments"` exists |

---

## 5. Register validation (mirror server)

Server rules: `RegisterRequest` — `email` unique, `password` required `min:6` `max:30`.

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| RV-1    | Duplicate **email** (already registered)                                  | Validation error on email | Covered | `group-register-validation.spec.ts` |
| RV-2    | **Password** too short (e.g. 5 chars)                                   | Validation error on password | Covered | Same |
| RV-3    | Invalid email format                                                    | Error | Covered | Same |

---

## 6. Newsletter

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| NL-1    | New email subscribe                                                        | Success toast / session | Covered | `group-user-features.spec.ts` |
| NL-2    | **Already subscribed** (same email twice)                                | Warning toast “You already subscribed” | Covered | `SubscriberController@store` + `useToast` |

---

## 7. Mobile / drawer (critical path)

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| MB-1    | Narrow viewport, open **hamburger**                                     | Drawer opens | Covered | `group-mobile-drawer.spec.ts` |
| MB-2    | From drawer: **Home** or **Anime list**                                  | Navigates under group | Covered | Same |
| MB-3    | From drawer: **Sign In**                                                 | Opens group login | Covered | Same |
| MB-4    | Mobile search overlay (optional)                                      | If traffic-critical, extend | Planned | Navbar mobile search |

---

## 8. Platform (Breeze) — main domain

Separate from `/{group}/...` tenant routes. Use base URL without group prefix.

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| PF-1    | `GET /login`                                                             | 200, app shell | Covered | `platform-user-pages.spec.ts` |
| PF-2    | `GET /register`                                                         | 200, app shell | Covered | Same |
| PF-3    | `GET /profile` as guest                                                  | Redirect to login (or verification) | Covered | Same |
| PF-4    | Full login + profile edit flow                                          | Optional suite | Planned | Needs main-domain user credentials |

---

---

## 9. Auth flows

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| AF-1    | Forgot password page loads                                               | Email input + "Send reset link" button visible | Covered | `group-user-auth-flows.spec.ts` |
| AF-2    | Submit forgot-password with unknown email                                | Generic success (no info leak) | Covered | Same |
| AF-3    | Login page has link to forgot-password                                   | Navigates to `/{group}/forgot-password` | Covered | Same |

---

## 10. Manga chapter reader

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| CR-1    | Authenticated user navigates from manga detail to chapter reader         | URL matches `/mangas/.+/chapters/\d+` | Covered | `group-user-auth-flows.spec.ts` |
| CR-2    | Chapter reader shows chapter content / selector                          | `#reader-chapter-select` or prev/next links visible | Covered | Same |
| CR-3    | Guest reads manga chapter                                                | Either redirected to login (require_login setting) or reader loads | Covered | Same |

---

## 11. Group admin CRUD actions

| ID      | Scenario                                                                 | Expected | Status  | Notes |
| ------- | ------------------------------------------------------------------------ | -------- | ------- | ----- |
| GA-1    | Create tag via form → success toast + appears in list                    | Tag visible in index; "tag created" toast | Covered | `group-admin-actions.spec.ts` |
| GA-2    | Duplicate tag name shows validation error                                | "has already been taken" | Covered | Same |
| GA-3    | Tag search updates URL query param                                       | `?search=` in URL | Covered | Same |
| GA-4    | Delete tag → confirm modal → success toast                               | Tag removed from list; "tag deleted" toast | Covered | Same |
| GA-5    | Edit tag → save → success toast                                          | Updated name visible; "tag update" toast | Covered | Same |
| GA-6    | Admin deletes comment from comments panel                                | "deleted" toast | Covered | Same |
| GA-7    | Settings form submit → success toast                                     | "setting updated" toast | Covered | Same |
| GA-8    | require_login_for_manga checkbox is toggleable                           | Checkbox state changes | Covered | Same |
| GA-9    | Adsense dashboard loads                                                  | "Google AdSense Dashboard" heading | Covered | Same |
| GA-10   | Admin user management search                                             | Filters list to E2E User | Covered | Same |

---

## Running tests

```bash
# 1. Seed E2E users and fixtures (required before running tests)
php artisan db:seed --class=E2ESeeder

# 2. Run all E2E tests
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8000 PLAYWRIGHT_SLOW_MO=0 npm run test:e2e

# 3. Run a single spec file
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8000 PLAYWRIGHT_SLOW_MO=0 npm run test:e2e -- tests/e2e/group-admin-actions.spec.ts
```

Use `E2E_GROUP_*`, `E2E_USER_EMAIL`, etc. as documented in `tests/e2e/helpers.ts` and `playwright.config.ts`.
