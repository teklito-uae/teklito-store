<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    protected $signature   = 'sitemap';
    protected $description = 'Generate the public/sitemap.xml for teklito.store';

    public function handle(): int
    {
        $base = rtrim(config('app.url'), '/');
        $now  = Carbon::now()->toAtomString();

        // Collect all URL entries
        $urls = [];

        // ── Static pages ──────────────────────────────────────────────
        $urls[] = $this->entry("{$base}/",        1.0, 'daily',   $now);
        $urls[] = $this->entry("{$base}/about",   0.5, 'monthly', $now);
        $urls[] = $this->entry("{$base}/contact", 0.5, 'monthly', $now);

        // ── Products (chunked, skip empty slugs) ──────────────────────
        $productCount = 0;
        Product::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->select(['slug', 'updated_at'])
            ->chunk(500, function ($products) use ($base, &$urls, &$productCount) {
                foreach ($products as $product) {
                    $lastmod = $product->updated_at
                        ? Carbon::parse($product->updated_at)->toAtomString()
                        : Carbon::now()->toAtomString();
                    $urls[] = $this->entry("{$base}/product/{$product->slug}", 0.8, 'weekly', $lastmod);
                    $productCount++;
                }
            });

        $this->info("Added {$productCount} product URLs.");

        // ── Categories (chunked, skip empty slugs) ────────────────────
        $catCount = 0;
        Category::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->select(['slug', 'updated_at'])
            ->chunk(500, function ($categories) use ($base, &$urls, &$catCount) {
                foreach ($categories as $category) {
                    $lastmod = $category->updated_at
                        ? Carbon::parse($category->updated_at)->toAtomString()
                        : Carbon::now()->toAtomString();
                    $urls[] = $this->entry("{$base}/category/{$category->slug}", 0.6, 'weekly', $lastmod);
                    $catCount++;
                }
            });

        $this->info("Added {$catCount} category URLs.");

        // ── Build XML manually (no view system dependency) ────────────
        $xml  = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;
        foreach ($urls as $url) {
            $xml .= $url;
        }
        $xml .= '</urlset>' . PHP_EOL;

        // ── Write to public/sitemap.xml ───────────────────────────────
        $outputPath = public_path('sitemap.xml');
        file_put_contents($outputPath, $xml);

        $total = count($urls);
        $this->info("✅ Sitemap written to {$outputPath}");
        $this->info("   Total URLs: {$total} (3 static + {$productCount} products + {$catCount} categories)");

        return self::SUCCESS;
    }

    /**
     * Build a single <url> XML block.
     */
    private function entry(string $loc, float $priority, string $changefreq, string $lastmod): string
    {
        return "  <url>\n"
            . "    <loc>" . htmlspecialchars($loc, ENT_XML1 | ENT_COMPAT, 'UTF-8') . "</loc>\n"
            . "    <lastmod>{$lastmod}</lastmod>\n"
            . "    <changefreq>{$changefreq}</changefreq>\n"
            . "    <priority>{$priority}</priority>\n"
            . "  </url>\n";
    }
}
