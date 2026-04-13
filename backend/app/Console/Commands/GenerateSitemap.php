<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature   = 'sitemap';
    protected $description = 'Generate the public/sitemap.xml for teklito.store';

    public function handle(): int
    {
        $base    = rtrim(config('app.url'), '/');
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

        // ── Products (chunked, skip empty slugs) ──────────────────────
        $count = 0;
        Product::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->select(['slug', 'updated_at'])
            ->chunk(500, function ($products) use ($sitemap, $base, &$count) {
                foreach ($products as $product) {
                    $sitemap->add(
                        Url::create("{$base}/product/{$product->slug}")
                           ->setPriority(0.8)
                           ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                           ->setLastModificationDate($product->updated_at ?? Carbon::now())
                    );
                    $count++;
                }
            });

        $this->info("Added {$count} product URLs.");

        // ── Categories (chunked, skip empty slugs) ────────────────────
        $catCount = 0;
        Category::whereNotNull('slug')
            ->where('slug', '!=', '')
            ->select(['slug', 'updated_at'])
            ->chunk(500, function ($categories) use ($sitemap, $base, &$catCount) {
                foreach ($categories as $category) {
                    $sitemap->add(
                        Url::create("{$base}/category/{$category->slug}")
                           ->setPriority(0.6)
                           ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                           ->setLastModificationDate($category->updated_at ?? Carbon::now())
                    );
                    $catCount++;
                }
            });

        $this->info("Added {$catCount} category URLs.");

        // ── Write file ────────────────────────────────────────────────
        $outputPath = public_path('sitemap.xml');
        $sitemap->writeToFile($outputPath);

        $this->info("✅ Sitemap written to {$outputPath}");
        $this->info("   Total URLs: " . (3 + $count + $catCount) . " (2 static + {$count} products + {$catCount} categories)");

        return self::SUCCESS;
    }
}
