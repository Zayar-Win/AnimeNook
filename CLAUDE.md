# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend dev server
npm run start

# Build frontend assets
npm run build

# Run all PHP tests
php artisan test
# or
./vendor/bin/pest

# Run a single test file or by name
php artisan test --filter TestName
php artisan test tests/Feature/Domain/MangaChapterReaderTest.php

# Run E2E tests
npm run test:e2e
npm run test:e2e:ui           # with Playwright UI
npm run test:e2e:1            # single worker (more stable)

# PHP code style
./vendor/bin/pint

# Database
php artisan migrate
php artisan db:seed
php artisan db:seed --class=E2ESeeder   # seeds data for E2E tests

# Queue worker (needed for ZIP import processing)
php artisan queue:work
```

## Architecture

**Stack**: Laravel 10 · PHP 8.1+ · React 18 + Inertia.js · Tailwind CSS · Vite · Pest (PHP tests) · Playwright (E2E)

**Storage**: DigitalOcean Spaces (S3-compatible) via `league/flysystem-aws-s3-v3`. The `Uploader` helper wraps all file operations and intentionally skips deletion for files that don't belong to the current environment (protects prod assets in dev).

### Multi-tenant Group System

The core concept is the **Group** — each group is an independent manga/anime community with its own subdomain, users, content, and settings.

- **Production**: subdomain routing — `{group}.app-domain.com`
- **Development**: path-prefix routing — `/{group_subdomain}/...`

`GroupMiddleware` resolves the `Group` model from the route and calls `URL::defaults(['group' => $subdomain])` so named routes auto-include the group param.

### Three-tier permission model

| Role | Access |
|------|--------|
| Platform admin | `/admin/...` routes (manages groups, users, blogs) |
| Group admin | `/{group}/admin/...` routes (manages manga, anime, comments, settings within their group) |
| User | Public group pages (read, comment, rate, save) |

`AdminMiddleware` checks `user->role->name === 'admin'`. `SubscriptionMiddleware` gates group admin routes behind the group's `expire_date`.

### Route files

- `routes/web.php` — all web routes; production/dev branching for subdomain vs. path-prefix
- `routes/auth.php` — standard Breeze auth routes
- `routes/api.php` — API routes (Sanctum)
- `routes/groupAdmin.php`, `routes/groupPublic.php`, `routes/superAdmin.php` — supplemental route groups

### Polymorphic content model

Most domain associations use Laravel morphs:

- `Chapter` → morphs to `Manga` or `Anime` (`chapterable`)
- `Comment`, `Rating`, `Likeable`, `View`, `Season`, `CollectionItems` — all polymorphic
- `Tag` ↔ content via `Taggable` pivot (`morphToMany`)
- `Manga` uses `spatie/laravel-sluggable` for URL slugs

### Manga chapter image pipeline

Two separate upload paths both land in the same queue-based processing:

1. **Individual images / PDF**: `GroupAdminChunkUploadController` handles chunked uploads in two modes:
   - FilePond (tus-style): `POST /admin/uploads` → `HEAD/PATCH /admin/uploads/{id}` → `DELETE /admin/uploads`
   - Axios-friendly: `/admin/uploads/init` → `/admin/uploads/{id}/chunk` → `/admin/uploads/{id}/finish`
   
   Assembled files are stored as `UploadSession` records (status: `uploading` → `complete`).

2. **ZIP bulk import**: ZIP file is uploaded via the chunk pipeline, then `GroupAdminChapterZipController` creates a `ChapterZipImport` record and dispatches `ProcessChapterZipJob`. The job calls `ChapterZipProcessingService::importChapterImagesFromZip()`, which:
   - Iterates ZIP entries by central-directory index order (not filename sorting)
   - Validates entry names against path traversal attacks
   - Skips `__MACOSX/` and `.DS_Store` entries
   - Compresses extracted images via `ImageCompressionService`
   - Creates `ChapterImage` records in a single DB transaction
   - Deletes the ZIP from storage after success or failure

`ImageCompressionService` uses Intervention Image with the GD driver to resize images down to `max_width × max_height` (default 2000×2000) and encode at configurable JPEG/WebP quality.

### Frontend

React pages live under `resources/js/Pages/`. Key layout distinction:

- `AdminLayout` — platform-level admin (groups, users, blogs)
- `GroupAdminLayout` — group-level admin panel
- `UserLayout` / `GroupAuthLayout` — public-facing group pages

`resources/js/utils/chunkUpload.js` is the axios-friendly chunked upload client used by the manga chapter form.

### Key config

| Config key | Env var | Default |
|-----------|---------|---------|
| `chapter_zip.max_upload_bytes` | `CHAPTER_ZIP_MAX_UPLOAD_BYTES` | 200 MB |
| `chapter_zip.max_extracted_files` | `CHAPTER_ZIP_MAX_EXTRACTED_FILES` | 500 |
| `image-compression.enabled` | `IMAGE_COMPRESSION_ENABLED` | `true` |
| `image-compression.max_width/height` | `IMAGE_COMPRESSION_MAX_WIDTH/HEIGHT` | 2000 |
| `image-compression.jpeg_quality` | `IMAGE_COMPRESSION_JPEG_QUALITY` | 75 |

### Testing conventions

- PHP tests use Pest with `RefreshDatabase` and an in-memory SQLite DB
- `tests/Pest.php` seeds roles via `TestBootstrap::seedRoles()` before each Feature test
- `createGroupWithUser(roleName)` helper creates a group + user for a given role
- E2E tests use `E2ESeeder` to populate the database; helpers live in `tests/e2e/helpers.ts`
- The `manga.guest.access` middleware (`EnsureMangaGuestAccess`) redirects unauthenticated users to register when the group's `require_login_for_manga` setting is enabled
