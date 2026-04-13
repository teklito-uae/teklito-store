<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Default User ──────────────────────────────────────────────
        \App\Models\User::create([
            'name' => 'Teklito UAE',
            'email' => 'teklitouae@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'avatar' => 'teklito123',
        ]);

        // ── Categories ────────────────────────────────────────────────
        $categories = [
            ['name' => 'Smartphones',       'slug' => 'smartphones',      'icon' => 'Smartphone',    'image' => '/images/categories/smartphones.webp',  'description' => 'Latest iPhones, Samsung, and more'],
            ['name' => 'Laptops',           'slug' => 'laptops',          'icon' => 'Laptop',        'image' => '/images/categories/laptops.webp',       'description' => 'MacBooks, Windows & Gaming Laptops'],
            ['name' => 'Audio',             'slug' => 'audio',            'icon' => 'Headphones',    'image' => '/images/categories/audio.webp',         'description' => 'Headphones, Earbuds & Speakers'],
            ['name' => 'Tablets',           'slug' => 'tablets',          'icon' => 'Tablet',        'image' => '/images/categories/tablets.webp',       'description' => 'iPads and Android Tablets'],
            ['name' => 'Smartwatches',      'slug' => 'smartwatches',     'icon' => 'Watch',         'image' => '/images/categories/smartwatches.webp',  'description' => 'Apple Watch, Samsung Galaxy Watch'],
            ['name' => 'Gaming',            'slug' => 'gaming',           'icon' => 'Gamepad2',      'image' => '/images/categories/gaming.webp',        'description' => 'Controllers, Keyboards & Gaming Gear'],
            ['name' => 'Cameras',           'slug' => 'cameras',          'icon' => 'Camera',        'image' => '/images/categories/cameras.webp',       'description' => 'DSLRs, Mirrorless & Action Cameras'],
            ['name' => 'Accessories',       'slug' => 'accessories',      'icon' => 'Cable',         'image' => '/images/categories/accessories.webp',   'description' => 'Cables, Chargers & Cases'],
            ['name' => 'Smart Home',        'slug' => 'smart-home',       'icon' => 'Home',          'image' => '/images/categories/smart-home.webp',    'description' => 'Smart Speakers, Plugs & Automation'],
            ['name' => 'Monitors',          'slug' => 'monitors',         'icon' => 'Monitor',       'image' => '/images/categories/monitors.webp',      'description' => '4K, Gaming & UltraWide Monitors'],
            ['name' => 'Power & Charging',  'slug' => 'power-charging',   'icon' => 'Zap',           'image' => '/images/categories/power.webp',         'description' => 'Power Banks, Fast Chargers & Hubs'],
            ['name' => 'Networking',        'slug' => 'networking',       'icon' => 'Wifi',          'image' => '/images/categories/networking.webp',    'description' => 'Routers, Switches & Network Gear'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // ── Products ──────────────────────────────────────────────────
        $products = [
            [
                'name'          => 'Pitaka iPhone 15 Pro Max Case',
                'slug'          => Str::slug('Pitaka iPhone 15 Pro Max Case'),
                'description'   => 'Aramid Fiber ultra-slim case for iPhone 15 Pro Max.',
                'price'         => 249.00,
                'original_price'=> 299.00,
                'discount'      => 16,
                'images'        => ['/images/promotions/pitak-1.webp', '/images/promotions/pitak.jpg'],
                'category'      => 'Accessories',
                'category_slug' => 'accessories',
                'rating'        => 4.9,
                'review_count'  => 56,
                'stock'         => 30,
            ],
            [
                'name'          => 'Apple iPhone 15 Pro Max',
                'slug'          => Str::slug('iPhone 15 Pro Max'),
                'description'   => 'Titanium design. A17 Pro chip. 48MP Main camera with 5× optical zoom.',
                'price'         => 5099.00,
                'original_price'=> 5499.00,
                'discount'      => 7,
                'images'        => ['/images/products/61Gm0JZAWRL._AC_.jpg'],
                'category'      => 'Smartphones',
                'category_slug' => 'smartphones',
                'rating'        => 4.9,
                'review_count'  => 312,
                'stock'         => 50,
            ],
            [
                'name'          => 'Samsung Galaxy S24 Ultra',
                'slug'          => Str::slug('Samsung Galaxy S24 Ultra'),
                'description'   => 'Galaxy AI is here. 200MP camera. Built-in S Pen. Titanium frame.',
                'price'         => 5099.00,
                'original_price'=> 5499.00,
                'discount'      => 7,
                'images'        => ['/images/products/61uBhYoMG0L._AC_.jpg'],
                'category'      => 'Smartphones',
                'category_slug' => 'smartphones',
                'rating'        => 4.8,
                'review_count'  => 142,
                'stock'         => 40,
            ],
            [
                'name'          => 'MacBook Air M2',
                'slug'          => Str::slug('MacBook Air M2'),
                'description'   => 'Impossibly thin. Incredibly capable. M2 chip.',
                'price'         => 5299.00,
                'images'        => ['/images/products/619-eeJxbaL._AC_SL1420_.jpg'],
                'category'      => 'Laptops',
                'category_slug' => 'laptops',
                'rating'        => 4.8,
                'review_count'  => 215,
                'stock'         => 45,
            ],
            [
                'name'          => 'Sony WH-1000XM5',
                'slug'          => Str::slug('Sony WH-1000XM5'),
                'description'   => 'Industry-leading noise cancelling headphones with 30-hr battery.',
                'price'         => 1499.00,
                'original_price'=> 1699.00,
                'discount'      => 12,
                'images'        => ['/images/products/51dIsvbWOaL._AC_.jpg'],
                'category'      => 'Audio',
                'category_slug' => 'audio',
                'rating'        => 4.8,
                'review_count'  => 423,
                'stock'         => 60,
            ],
            [
                'name'          => 'Anker 65W USB-C Charger',
                'slug'          => Str::slug('Anker 65W USB-C Charger'),
                'description'   => 'Ultra-compact 65W fast charger. Charges MacBook, iPad and iPhone simultaneously.',
                'price'         => 149.00,
                'original_price'=> 199.00,
                'discount'      => 25,
                'images'        => ['/images/products/61usNWss9YL._AC_.jpg'],
                'category'      => 'Power & Charging',
                'category_slug' => 'power-charging',
                'rating'        => 4.6,
                'review_count'  => 385,
                'stock'         => 200,
            ],
            [
                'name'          => 'Apple AirPods Pro (2nd Gen)',
                'slug'          => Str::slug('AirPods Pro 2nd Gen'),
                'description'   => 'Active Noise Cancellation. Adaptive Audio. MagSafe charging.',
                'price'         => 899.00,
                'original_price'=> 949.00,
                'discount'      => 5,
                'images'        => ['/images/promotions/detail_web_awu_lockfit_011.webp'],
                'category'      => 'Audio',
                'category_slug' => 'audio',
                'rating'        => 4.7,
                'review_count'  => 512,
                'stock'         => 100,
            ],
            [
                'name'          => 'Spigen LockFit Apple Watch Band',
                'slug'          => Str::slug('Spigen LockFit Apple Watch'),
                'description'   => 'Rugged armor band for Apple Watch.',
                'price'         => 129.00,
                'images'        => ['/images/promotions/detail_web_awu_lockfit_02.webp', '/images/promotions/detail_web_awu_lockfit_03.webp', '/images/promotions/detail_web_awu_lockfit_04.webp'],
                'category'      => 'Accessories',
                'category_slug' => 'accessories',
                'rating'        => 4.5,
                'review_count'  => 176,
                'stock'         => 30,
            ],
            [
                'name'          => 'Apple Watch Series 9',
                'slug'          => Str::slug('Apple Watch Series 9'),
                'description'   => 'Smarter. Brighter. More capable than ever.',
                'price'         => 1799.00,
                'original_price'=> 1999.00,
                'discount'      => 10,
                'images'        => ['/images/promotions/detail_web_awu_lockfit_07.webp'],
                'category'      => 'Smartwatches',
                'category_slug' => 'smartwatches',
                'rating'        => 4.7,
                'review_count'  => 231,
                'stock'         => 55,
            ]
        ];

        foreach ($products as $prod) {
            $product = Product::create($prod);

            if ($prod['name'] === 'iPhone 15 Pro Max') {
                $colorVariant = $product->variants()->create(['type' => 'color', 'name' => 'Color']);
                $colorVariant->options()->createMany([
                    ['value' => 'natural-titanium', 'label' => 'Natural Titanium', 'in_stock' => true],
                    ['value' => 'black-titanium',   'label' => 'Black Titanium',   'in_stock' => true],
                    ['value' => 'white-titanium',   'label' => 'White Titanium',   'in_stock' => true],
                    ['value' => 'blue-titanium',    'label' => 'Blue Titanium',    'in_stock' => false],
                ]);
                $storageVariant = $product->variants()->create(['type' => 'storage', 'name' => 'Storage']);
                $storageVariant->options()->createMany([
                    ['value' => '256gb', 'label' => '256 GB', 'price_modifier' => 0,    'in_stock' => true],
                    ['value' => '512gb', 'label' => '512 GB', 'price_modifier' => 500,  'in_stock' => true],
                    ['value' => '1tb',   'label' => '1 TB',   'price_modifier' => 1000, 'in_stock' => true],
                ]);
            }

            if ($prod['name'] === 'Samsung Galaxy S24 Ultra') {
                $colorVariant = $product->variants()->create(['type' => 'color', 'name' => 'Color']);
                $colorVariant->options()->createMany([
                    ['value' => 'titanium-black',  'label' => 'Titanium Black',  'in_stock' => true],
                    ['value' => 'titanium-gray',   'label' => 'Titanium Gray',   'in_stock' => true],
                    ['value' => 'titanium-violet', 'label' => 'Titanium Violet', 'in_stock' => false],
                ]);
                $storageVariant = $product->variants()->create(['type' => 'storage', 'name' => 'Storage']);
                $storageVariant->options()->createMany([
                    ['value' => '256gb', 'label' => '256 GB', 'price_modifier' => 0,   'in_stock' => true],
                    ['value' => '512gb', 'label' => '512 GB', 'price_modifier' => 400, 'in_stock' => true],
                ]);
            }

            if ($prod['name'] === 'MacBook Pro M3 Max') {
                $storageVariant = $product->variants()->create(['type' => 'storage', 'name' => 'Storage']);
                $storageVariant->options()->createMany([
                    ['value' => '512gb', 'label' => '512 GB SSD', 'price_modifier' => 0,    'in_stock' => true],
                    ['value' => '1tb',   'label' => '1 TB SSD',   'price_modifier' => 800,  'in_stock' => true],
                    ['value' => '2tb',   'label' => '2 TB SSD',   'price_modifier' => 1600, 'in_stock' => true],
                ]);
            }
        }
    }
}
