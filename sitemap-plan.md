# 🗺️ Sitemap System — Implementation Plan
> Domain: https://teklito.store  
> Package: `spatie/laravel-sitemap`  
> Created: April 2026

---

## 📋 Overview

A fully automated, on-demand sitemap system that:
1. Builds `sitemap.xml` via an Artisan command (triggered manually or via a secure HTTP endpoint)
2. Outputs the file directly to `public/sitemap.xml` so it's served statically by the web server
3. Never generates the sitemap on every request — always serves the pre-built static file
4. Supports secure remote regeneration via a key-protected API route

---

## 🗂️ Files to Create / Modify

```
backend/
├── app/
│   └── Console/
│       └── Commands/
│           └── GenerateSitemap.php          ← NEW: Artisan command
│   └── Http/
│       └── Controllers/
│           └── SitemapController.php        ← NEW: Secure trigger controller
├── routes/
│   └── api.php                              ← MODIFY: Add secure generation route
├── .env                                     ← MODIFY: Add SITEMAP_KEY
└── public/
    └── sitemap.xml                          ← OUTPUT: Generated file (git-ignored)
```

---

## 📦 Step 1 — Install the Package

```bash
cd backend
composer require spatie/laravel-sitemap
```

> **Note:** No config publishing required unless customizing defaults. The package works out of the box with Laravel 11.

---

## ⚙️ Step 2 — Create the Artisan Command

**File:** `app/Console/Commands/GenerateSitemap.php`  
**Command:** `php artisan sitemap`

### Command Logic

```php
<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use Carbon\Carbon;

class GenerateSitemap extends Command
{
    protected $signature   = 'sitemap';
    protected $description = 'Generate the public sitemap.xml for teklito.store';

    public function handle(): int
    {
        $base    = rtrim(config('app.url'), '/'); // e.g. https://teklito.store
        $sitemap = Sitemap::create();

        // ── Static pages ──────────────────────────────────────────────
        $sitemap->add(
            Url::create("{$base}/")
               ->setPriority(1.0)
               ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
               ->setLastModificationDate(Carbon::now())
        );

        foreach (['/about', '/contact'] as $path) {
            $sitemap->add(
                Url::create("{$base}{$path}")
                   ->setPriority(0.5)
                   ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                   ->setLastModificationDate(Carbon::now())
            );
        }

        // ── Products (chunked) ────────────────────────────────────────
        Product::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->whereNull('deleted_at')   // safe even without SoftDeletes trait
            ->select(['slug', 'updated_at'])
            ->chunk(500, function ($products) use ($sitemap, $base) {
                foreach ($products as $product) {
                    $sitemap->add(
                        Url::create("{$base}/product/{$product->slug}")
                           ->setPriority(0.8)
                           ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                           ->setLastModificationDate($product->updated_at)
                    );
                }
            });

        // ── Categories (chunked) ──────────────────────────────────────
        Category::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->whereNull('deleted_at')
            ->select(['slug', 'updated_at'])
            ->chunk(500, function ($categories) use ($sitemap, $base) {
                foreach ($categories as $category) {
                    $sitemap->add(
                        Url::create("{$base}/category/{$category->slug}")
                           ->setPriority(0.6)
                           ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                           ->setLastModificationDate($category->updated_at)
                    );
                }
            });

        // ── Write to public/sitemap.xml ───────────────────────────────
        $outputPath = public_path('sitemap.xml');
        $sitemap->writeToFile($outputPath);

        $this->info("Sitemap written to {$outputPath}");
        return self::SUCCESS;
    }
}
```

### Key Design Decisions
| Decision | Reasoning |
|---|---|
| `chunk(500)` | Prevents memory exhaustion on large product catalogs |
| `whereNull('deleted_at')` | Works whether or not `SoftDeletes` is enabled |
| `whereNotNull('slug')` + `where('slug', '!=', '')` | Skips any records with missing slugs |
| `select(['slug', 'updated_at'])` | Only fetches the two needed columns, much lighter query |
| `writeToFile(public_path('sitemap.xml'))` | Outputs directly to `public/` for zero-overhead static serving |
| `config('app.url')` | Reads `APP_URL` from `.env` — no hardcoded domain |

---

## 🔒 Step 3 — Create the Secure Controller

**File:** `app/Http/Controllers/SitemapController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SitemapController extends Controller
{
    public function generate(Request $request, string $key): \Illuminate\Http\JsonResponse
    {
        $validKey = config('app.sitemap_key');

        // Validate the key — constant-time comparison to prevent timing attacks
        if (! $validKey || ! hash_equals($validKey, $key)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            Artisan::call('sitemap');
            $output = Artisan::output();

            return response()->json([
                'success'    => true,
                'message'    => 'Sitemap generated successfully.',
                'output'     => trim($output),
                'updated_at' => now()->toIso8601String(),
                'url'        => config('app.url') . '/sitemap.xml',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
```

---

## 🛣️ Step 4 — Register the Route

**File:** `routes/api.php`  
Add the following route **outside** any auth middleware group:

```php
use App\Http\Controllers\SitemapController;

// Sitemap generation — secured by SITEMAP_KEY env variable
Route::get('/generate-sitemap/{key}', [SitemapController::class, 'generate']);
```

**Usage:**
```
GET https://teklito.store/api/generate-sitemap/YOUR_SECRET_KEY
```

**Response (success):**
```json
{
  "success": true,
  "message": "Sitemap generated successfully.",
  "output": "Sitemap written to /path/to/public/sitemap.xml",
  "updated_at": "2026-04-13T06:30:00+00:00",
  "url": "https://teklito.store/sitemap.xml"
}
```

**Response (wrong key):**
```json
{
  "error": "Unauthorized"
}
```

---

## 🔑 Step 5 — Environment Variables

Add to `backend/.env` and `backend/.env.production`:

```env
# Sitemap secure key — use a strong random string (min 32 chars)
SITEMAP_KEY=teklito_CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_2026
```

And expose it via `config/app.php` (add inside the return array):

```php
'sitemap_key' => env('SITEMAP_KEY'),
```

> **Generate a strong key:** `openssl rand -base64 32` or `php artisan key:generate --show`

---

## 🏗️ Step 6 — .gitignore the Output File

The generated `sitemap.xml` should not be committed to git since it is built on-demand:

**File:** `backend/public/.gitignore` (create if not exists)
```
sitemap.xml
```

Or add to root `.gitignore`:
```
backend/public/sitemap.xml
```

---

## 🚀 Step 7 — Deployment Workflow

After deploying, regenerate the sitemap by hitting the endpoint once:

```bash
curl https://teklito.store/api/generate-sitemap/YOUR_SECRET_KEY
```

Or add this to the GitHub Actions deployment workflow as a post-deploy step:

```yaml
- name: Generate Sitemap
  run: |
    curl -f "https://teklito.store/api/generate-sitemap/${{ secrets.SITEMAP_KEY }}" \
      || echo "Sitemap generation failed (non-blocking)"
```

This means **every production deployment automatically regenerates the sitemap** with the latest products and categories.

---

## 📖 Sitemap Output Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Static Homepage -->
  <url>
    <loc>https://teklito.store/</loc>
    <lastmod>2026-04-13</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>https://teklito.store/about</loc>
    <lastmod>2026-04-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://teklito.store/contact</loc>
    <lastmod>2026-04-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Product -->
  <url>
    <loc>https://teklito.store/product/samsung-galaxy-s24-ultra</loc>
    <lastmod>2026-04-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Category -->
  <url>
    <loc>https://teklito.store/category/smartphones</loc>
    <lastmod>2026-04-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>
```

---

## ✅ Implementation Checklist

### Backend
- [ ] `composer require spatie/laravel-sitemap`
- [ ] Create `app/Console/Commands/GenerateSitemap.php`
- [ ] Create `app/Http/Controllers/SitemapController.php`
- [ ] Register route in `routes/api.php`
- [ ] Add `SITEMAP_KEY` to `.env` and `.env.production`
- [ ] Add `sitemap_key` to `config/app.php`
- [ ] Add `backend/public/sitemap.xml` to `.gitignore`

### Deployment
- [ ] Push to `teklito_dev` branch → triggers GitHub Actions deployment
- [ ] After deploy: hit `GET /api/generate-sitemap/{key}` to generate initial sitemap
- [ ] Optionally: add sitemap regeneration step to GitHub Actions post-deploy

### SEO Verification
- [ ] Visit `https://teklito.store/sitemap.xml` — verify it loads
- [ ] Submit sitemap URL to **Google Search Console**: Site Settings → Sitemaps → Add `https://teklito.store/sitemap.xml`
- [ ] Verify via `robots.txt` that the sitemap is referenced:
  ```
  Sitemap: https://teklito.store/sitemap.xml
  ```

---

## 🔐 Security Notes

| Concern | Mitigation |
|---|---|
| Key brute-force | `hash_equals()` prevents timing attacks; use a 32+ char random key |
| SSRF / command injection | Only calling a single Artisan command — no user input goes into the command |
| Key exposure in logs | The key is part of the URL path; ensure production access logs are restricted |
| Denial-of-service | The command is fast (chunked DB reads, no external HTTP calls); acceptable risk |

> **Optional hardening:** Add a simple rate-limiter middleware (`throttle:5,1`) to the sitemap route to limit to 5 calls/minute.

---

## 🗓️ Models Reference

Since `Product` and `Category` do **not** currently use `SoftDeletes` trait, the `whereNull('deleted_at')` guard is a no-op (records won't have `deleted_at` column). If soft-deletes are added later, the sitemap command will automatically respect them.

**Current model capabilities:**
| Model | Has `slug`? | Has `updated_at`? | Has `SoftDeletes`? |
|---|---|---|---|
| `Product` | ✅ Yes | ✅ Yes (timestamps) | ❌ No |
| `Category` | ✅ Yes | ✅ Yes (timestamps) | ❌ No |

> If `SoftDeletes` is added in the future, replace `whereNull('deleted_at')` with the Eloquent scope `withoutTrashed()`.

---

> **Deploy order:** This is a pure backend change with no frontend dependencies. It can be developed and deployed independently in a single PR.
