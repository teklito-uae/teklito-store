import { Product } from '../types';

// TODO: Replace with API call to /api/products
// Expected endpoint: GET /api/products?category=phone-cases&sort=price-asc&page=1&limit=20
// Expected response: { products: Product[], total: number, page: number, totalPages: number }

// PRODUCT IMAGES LIST
const productImages = [
    '/images/products/51dIsvbWOaL._AC_.jpg',
    '/images/products/619-eeJxbaL._AC_SL1420_.jpg',
    '/images/products/61Gm0JZAWRL._AC_.jpg',
    '/images/products/61uBhYoMG0L._AC_.jpg',
    '/images/products/61usNWss9YL._AC_.jpg',
];

export const products: Product[] = [
    // PHONE CASES
    {
        id: 'pc-001',
        name: 'Premium Leather iPhone 15 Pro Case',
        slug: 'premium-leather-iphone-15-pro-case',
        description: 'Handcrafted genuine leather case with MagSafe compatibility. Slim profile with military-grade drop protection.',
        price: 49.99,
        originalPrice: 79.99,
        discount: 37,
        images: [productImages[0], productImages[1]],
        category: 'Phone Cases',
        categorySlug: 'phone-cases',
        rating: 4.8,
        reviewCount: 234,
        inStock: true,
        stock: 45,
        variants: [
            {
                type: 'model',
                name: 'Phone Model',
                options: [
                    { id: 'iphone-15-pro', value: 'iphone-15-pro', label: 'iPhone 15 Pro', inStock: true },
                    { id: 'iphone-15-pro-max', value: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max', inStock: true },
                    { id: 'iphone-14-pro', value: 'iphone-14-pro', label: 'iPhone 14 Pro', inStock: true },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'black', value: 'black', label: 'Black', inStock: true },
                    { id: 'brown', value: 'brown', label: 'Brown', inStock: true },
                    { id: 'navy', value: 'navy', label: 'Navy Blue', inStock: false },
                ],
            },
        ],
        tags: ['premium', 'leather', 'magsafe', 'iphone'],
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'pc-002',
        name: 'Clear Shockproof Samsung Galaxy S24 Case',
        slug: 'clear-shockproof-samsung-galaxy-s24-case',
        description: 'Crystal clear TPU case with reinforced corners. Shows off your phone design while providing excellent protection.',
        price: 24.99,
        images: [productImages[2]],
        category: 'Phone Cases',
        categorySlug: 'phone-cases',
        rating: 4.5,
        reviewCount: 189,
        inStock: true,
        stock: 78,
        variants: [
            {
                type: 'model',
                name: 'Phone Model',
                options: [
                    { id: 's24', value: 's24', label: 'Galaxy S24', inStock: true },
                    { id: 's24-plus', value: 's24-plus', label: 'Galaxy S24+', inStock: true },
                    { id: 's24-ultra', value: 's24-ultra', label: 'Galaxy S24 Ultra', inStock: true },
                ],
            },
        ],
        tags: ['clear', 'shockproof', 'samsung', 'tpu'],
        createdAt: '2024-01-20T10:00:00Z',
    },
    {
        id: 'pc-003',
        name: 'Rugged Armor Google Pixel 8 Pro Case',
        slug: 'rugged-armor-google-pixel-8-pro-case',
        description: 'Military-grade protection with carbon fiber texture. Raised bezels protect camera and screen.',
        price: 34.99,
        originalPrice: 44.99,
        discount: 22,
        images: [productImages[3]],
        category: 'Phone Cases',
        categorySlug: 'phone-cases',
        rating: 4.7,
        reviewCount: 156,
        inStock: true,
        stock: 32,
        variants: [
            {
                type: 'model',
                name: 'Phone Model',
                options: [
                    { id: 'pixel-8', value: 'pixel-8', label: 'Pixel 8', inStock: true },
                    { id: 'pixel-8-pro', value: 'pixel-8-pro', label: 'Pixel 8 Pro', inStock: true },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'black', value: 'black', label: 'Matte Black', inStock: true },
                    { id: 'blue', value: 'blue', label: 'Navy Blue', inStock: true },
                ],
            },
        ],
        tags: ['rugged', 'armor', 'pixel', 'military-grade'],
        createdAt: '2024-01-18T10:00:00Z',
    },
    {
        id: 'pc-004',
        name: 'Silicone Soft Touch iPhone 14 Case',
        slug: 'silicone-soft-touch-iphone-14-case',
        description: 'Premium liquid silicone with microfiber lining. Soft-touch finish that feels great in hand.',
        price: 29.99,
        images: [productImages[4]],
        category: 'Phone Cases',
        categorySlug: 'phone-cases',
        rating: 4.6,
        reviewCount: 312,
        inStock: true,
        stock: 95,
        variants: [
            {
                type: 'model',
                name: 'Phone Model',
                options: [
                    { id: 'iphone-14', value: 'iphone-14', label: 'iPhone 14', inStock: true },
                    { id: 'iphone-14-plus', value: 'iphone-14-plus', label: 'iPhone 14 Plus', inStock: true },
                    { id: 'iphone-14-pro', value: 'iphone-14-pro', label: 'iPhone 14 Pro', inStock: true },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'midnight', value: 'midnight', label: 'Midnight Black', inStock: true },
                    { id: 'yellow', value: 'yellow', label: 'Sunshine Yellow', inStock: true },
                    { id: 'white', value: 'white', label: 'Pure White', inStock: true },
                    { id: 'pink', value: 'pink', label: 'Blush Pink', inStock: false },
                ],
            },
        ],
        tags: ['silicone', 'soft-touch', 'iphone', 'premium'],
        createdAt: '2024-01-12T10:00:00Z',
    },
    {
        id: 'pc-005',
        name: 'Wallet Case with Card Holder - OnePlus 12',
        slug: 'wallet-case-card-holder-oneplus-12',
        description: 'Premium PU leather wallet case with 3 card slots and cash pocket. Magnetic closure and kickstand.',
        price: 39.99,
        images: [productImages[0]],
        category: 'Phone Cases',
        categorySlug: 'phone-cases',
        rating: 4.4,
        reviewCount: 98,
        inStock: true,
        stock: 28,
        variants: [
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'black', value: 'black', label: 'Classic Black', inStock: true },
                    { id: 'brown', value: 'brown', label: 'Vintage Brown', inStock: true },
                ],
            },
        ],
        tags: ['wallet', 'card-holder', 'oneplus', 'leather'],
        createdAt: '2024-01-25T10:00:00Z',
    },

    // WATCHES
    {
        id: 'w-001',
        name: 'Apple Watch Series 9 GPS 45mm',
        slug: 'apple-watch-series-9-gps-45mm',
        description: 'Advanced health and fitness tracking. Always-On Retina display. Carbon neutral. Water resistant 50m.',
        price: 429.99,
        originalPrice: 499.99,
        discount: 14,
        images: [productImages[1], productImages[2]],
        category: 'Watches',
        categorySlug: 'watches',
        rating: 4.9,
        reviewCount: 567,
        inStock: true,
        stock: 15,
        variants: [
            {
                type: 'size',
                name: 'Case Size',
                options: [
                    { id: '41mm', value: '41mm', label: '41mm', inStock: true, priceModifier: -30 },
                    { id: '45mm', value: '45mm', label: '45mm', inStock: true },
                ],
            },
            {
                type: 'color',
                name: 'Case Color',
                options: [
                    { id: 'midnight', value: 'midnight', label: 'Midnight Aluminum', inStock: true },
                    { id: 'starlight', value: 'starlight', label: 'Starlight Aluminum', inStock: true },
                    { id: 'silver', value: 'silver', label: 'Silver Aluminum', inStock: false },
                ],
            },
        ],
        tags: ['smartwatch', 'apple', 'fitness', 'health'],
        createdAt: '2024-01-10T10:00:00Z',
    },
    {
        id: 'w-002',
        name: 'Samsung Galaxy Watch 6 Classic 47mm',
        slug: 'samsung-galaxy-watch-6-classic-47mm',
        description: 'Premium smartwatch with rotating bezel. Advanced sleep tracking. 5ATM water resistance. Sapphire crystal display.',
        price: 399.99,
        images: [productImages[3]],
        category: 'Watches',
        categorySlug: 'watches',
        rating: 4.7,
        reviewCount: 423,
        inStock: true,
        stock: 22,
        variants: [
            {
                type: 'size',
                name: 'Case Size',
                options: [
                    { id: '43mm', value: '43mm', label: '43mm', inStock: true, priceModifier: -50 },
                    { id: '47mm', value: '47mm', label: '47mm', inStock: true },
                ],
            },
            {
                type: 'color',
                name: 'Case Color',
                options: [
                    { id: 'black', value: 'black', label: 'Black Stainless Steel', inStock: true },
                    { id: 'silver', value: 'silver', label: 'Silver Stainless Steel', inStock: true },
                ],
            },
        ],
        tags: ['smartwatch', 'samsung', 'classic', 'rotating-bezel'],
        createdAt: '2024-01-08T10:00:00Z',
    },
    {
        id: 'w-003',
        name: 'Garmin Fenix 7 Pro Solar',
        slug: 'garmin-fenix-7-pro-solar',
        description: 'Premium multisport GPS watch. Solar charging. Advanced training metrics. 22-day battery life.',
        price: 799.99,
        originalPrice: 899.99,
        discount: 11,
        images: [productImages[4]],
        category: 'Watches',
        categorySlug: 'watches',
        rating: 4.8,
        reviewCount: 289,
        inStock: true,
        stock: 8,
        variants: [
            {
                type: 'size',
                name: 'Case Size',
                options: [
                    { id: '42mm', value: '42mm', label: '42mm', inStock: true, priceModifier: -100 },
                    { id: '47mm', value: '47mm', label: '47mm', inStock: true },
                    { id: '51mm', value: '51mm', label: '51mm', inStock: true, priceModifier: 100 },
                ],
            },
        ],
        tags: ['smartwatch', 'garmin', 'solar', 'multisport', 'gps'],
        createdAt: '2024-01-05T10:00:00Z',
    },
    {
        id: 'w-004',
        name: 'Fitbit Sense 2 Health Smartwatch',
        slug: 'fitbit-sense-2-health-smartwatch',
        description: 'Advanced health and stress management. ECG app. Skin temperature sensor. 6+ days battery life.',
        price: 249.99,
        originalPrice: 299.99,
        discount: 17,
        images: [productImages[0]],
        category: 'Watches',
        categorySlug: 'watches',
        rating: 4.5,
        reviewCount: 512,
        inStock: true,
        stock: 34,
        variants: [
            {
                type: 'color',
                name: 'Case Color',
                options: [
                    { id: 'graphite', value: 'graphite', label: 'Graphite/Shadow Grey', inStock: true },
                    { id: 'gold', value: 'gold', label: 'Soft Gold/White', inStock: true },
                    { id: 'blue', value: 'blue', label: 'Blue Mist/Pale Blue', inStock: false },
                ],
            },
        ],
        tags: ['smartwatch', 'fitbit', 'health', 'stress-management'],
        createdAt: '2024-01-22T10:00:00Z',
    },
    {
        id: 'w-005',
        name: 'Fossil Gen 6 Hybrid Smartwatch',
        slug: 'fossil-gen-6-hybrid-smartwatch',
        description: 'Classic analog design meets smart features. E-ink display. 2-week battery life. Heart rate tracking.',
        price: 199.99,
        images: [productImages[1]],
        category: 'Watches',
        categorySlug: 'watches',
        rating: 4.3,
        reviewCount: 178,
        inStock: true,
        stock: 41,
        variants: [
            {
                type: 'color',
                name: 'Style',
                options: [
                    { id: 'black-leather', value: 'black-leather', label: 'Black Leather', inStock: true },
                    { id: 'brown-leather', value: 'brown-leather', label: 'Brown Leather', inStock: true },
                    { id: 'silver-mesh', value: 'silver-mesh', label: 'Silver Mesh', inStock: true },
                ],
            },
        ],
        tags: ['hybrid', 'fossil', 'analog', 'classic'],
        createdAt: '2024-01-28T10:00:00Z',
    },

    // MOBILES
    {
        id: 'm-001',
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'Titanium design. A17 Pro chip. ProMotion display with Always-On. Advanced camera system with 5x optical zoom.',
        price: 1199.99,
        originalPrice: 1299.99,
        discount: 8,
        images: [productImages[2], productImages[3]],
        category: 'Mobiles',
        categorySlug: 'mobiles',
        rating: 4.9,
        reviewCount: 1234,
        inStock: true,
        stock: 12,
        variants: [
            {
                type: 'storage',
                name: 'Storage',
                options: [
                    { id: '256gb', value: '256gb', label: '256GB', inStock: true },
                    { id: '512gb', value: '512gb', label: '512GB', inStock: true, priceModifier: 200 },
                    { id: '1tb', value: '1tb', label: '1TB', inStock: true, priceModifier: 400 },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'natural', value: 'natural', label: 'Natural Titanium', inStock: true },
                    { id: 'blue', value: 'blue', label: 'Blue Titanium', inStock: true },
                    { id: 'white', value: 'white', label: 'White Titanium', inStock: false },
                    { id: 'black', value: 'black', label: 'Black Titanium', inStock: true },
                ],
            },
        ],
        tags: ['iphone', 'flagship', 'titanium', 'pro'],
        createdAt: '2024-01-03T10:00:00Z',
    },
    {
        id: 'm-002',
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Built-in S Pen. 200MP camera. Snapdragon 8 Gen 3. 6.8" Dynamic AMOLED display. Galaxy AI features.',
        price: 1299.99,
        images: [productImages[4]],
        category: 'Mobiles',
        categorySlug: 'mobiles',
        rating: 4.8,
        reviewCount: 987,
        inStock: true,
        stock: 18,
        variants: [
            {
                type: 'storage',
                name: 'Storage',
                options: [
                    { id: '256gb', value: '256gb', label: '256GB', inStock: true },
                    { id: '512gb', value: '512gb', label: '512GB', inStock: true, priceModifier: 120 },
                    { id: '1tb', value: '1tb', label: '1TB', inStock: true, priceModifier: 240 },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'titanium-gray', value: 'titanium-gray', label: 'Titanium Gray', inStock: true },
                    { id: 'titanium-black', value: 'titanium-black', label: 'Titanium Black', inStock: true },
                    { id: 'titanium-violet', value: 'titanium-violet', label: 'Titanium Violet', inStock: true },
                ],
            },
        ],
        tags: ['samsung', 'flagship', 's-pen', 'ai'],
        createdAt: '2024-01-06T10:00:00Z',
    },
    {
        id: 'm-003',
        name: 'Google Pixel 8 Pro',
        slug: 'google-pixel-8-pro',
        description: 'Google Tensor G3. Best-in-class AI photography. 7 years of updates. 6.7" LTPO OLED display.',
        price: 999.99,
        originalPrice: 1099.99,
        discount: 9,
        images: [productImages[0]],
        category: 'Mobiles',
        categorySlug: 'mobiles',
        rating: 4.7,
        reviewCount: 756,
        inStock: true,
        stock: 24,
        variants: [
            {
                type: 'storage',
                name: 'Storage',
                options: [
                    { id: '128gb', value: '128gb', label: '128GB', inStock: true, priceModifier: -100 },
                    { id: '256gb', value: '256gb', label: '256GB', inStock: true },
                    { id: '512gb', value: '512gb', label: '512GB', inStock: true, priceModifier: 100 },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'obsidian', value: 'obsidian', label: 'Obsidian', inStock: true },
                    { id: 'porcelain', value: 'porcelain', label: 'Porcelain', inStock: true },
                    { id: 'bay', value: 'bay', label: 'Bay Blue', inStock: false },
                ],
            },
        ],
        tags: ['pixel', 'google', 'ai', 'camera'],
        createdAt: '2024-01-14T10:00:00Z',
    },
    {
        id: 'm-004',
        name: 'OnePlus 12',
        slug: 'oneplus-12',
        description: 'Snapdragon 8 Gen 3. 120Hz AMOLED display. 100W fast charging. Hasselblad camera system.',
        price: 799.99,
        images: [productImages[1]],
        category: 'Mobiles',
        categorySlug: 'mobiles',
        rating: 4.6,
        reviewCount: 445,
        inStock: true,
        stock: 31,
        variants: [
            {
                type: 'storage',
                name: 'Storage',
                options: [
                    { id: '256gb', value: '256gb', label: '256GB / 12GB RAM', inStock: true },
                    { id: '512gb', value: '512gb', label: '512GB / 16GB RAM', inStock: true, priceModifier: 100 },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'silky-black', value: 'silky-black', label: 'Silky Black', inStock: true },
                    { id: 'flowy-emerald', value: 'flowy-emerald', label: 'Flowy Emerald', inStock: true },
                ],
            },
        ],
        tags: ['oneplus', 'fast-charging', 'hasselblad', 'flagship'],
        createdAt: '2024-01-19T10:00:00Z',
    },
    {
        id: 'm-005',
        name: 'Xiaomi 14 Pro',
        slug: 'xiaomi-14-pro',
        description: 'Leica optics. Snapdragon 8 Gen 3. 120W HyperCharge. 6.73" AMOLED display with 120Hz.',
        price: 899.99,
        originalPrice: 999.99,
        discount: 10,
        images: [productImages[2]],
        category: 'Mobiles',
        categorySlug: 'mobiles',
        rating: 4.5,
        reviewCount: 334,
        inStock: true,
        stock: 19,
        variants: [
            {
                type: 'storage',
                name: 'Storage',
                options: [
                    { id: '256gb', value: '256gb', label: '256GB', inStock: true },
                    { id: '512gb', value: '512gb', label: '512GB', inStock: true, priceModifier: 100 },
                ],
            },
            {
                type: 'color',
                name: 'Color',
                options: [
                    { id: 'black', value: 'black', label: 'Titanium Black', inStock: true },
                    { id: 'white', value: 'white', label: 'Titanium White', inStock: true },
                ],
            },
        ],
        tags: ['xiaomi', 'leica', 'fast-charging', 'camera'],
        createdAt: '2024-01-27T10:00:00Z',
    },
];

// Helper functions
export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
    return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(limit: number = 8): Product[] {
    return products
        .filter((p) => p.discount && p.discount > 10)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

export function getNewArrivals(limit: number = 8): Product[] {
    return products
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}

export function getBestSellers(limit: number = 8): Product[] {
    return products
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return products.filter(
        (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
}
