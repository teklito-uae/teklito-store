<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

class SitemapController extends Controller
{
    /**
     * Validate the SITEMAP_KEY and trigger sitemap regeneration.
     *
     * Route: GET /api/generate-sitemap/{key}
     */
    public function generate(string $key): JsonResponse
    {
        // Clear config cache first so any .env changes are always reflected immediately.
        // This is safe on an admin-only endpoint and fixes stale-cache issues on Hostinger.
        try {
            Artisan::call('config:clear');
        } catch (\Throwable $e) {
            // Non-fatal — continue even if cache clear fails
        }

        // Now read fresh from .env (cache is gone)
        $validKey = config('app.sitemap_key')
            ?: env('SITEMAP_KEY')
            ?: ($_ENV['SITEMAP_KEY'] ?? getenv('SITEMAP_KEY') ?: null);

        // Missing key in .env — refuse all requests until configured
        if (! $validKey) {
            return response()->json([
                'success' => false,
                'error'   => 'SITEMAP_KEY is not configured on this server.',
            ], 500);
        }

        // Constant-time comparison prevents timing-based brute-force attacks
        if (! hash_equals((string) $validKey, (string) $key)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            Artisan::call('sitemap');
            $output = trim(Artisan::output());

            return response()->json([
                'success'    => true,
                'message'    => 'Sitemap generated successfully.',
                'output'     => $output,
                'updated_at' => now()->toIso8601String(),
                'url'        => rtrim(config('app.url'), '/') . '/sitemap.xml',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
