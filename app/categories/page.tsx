'use client';

import { categories } from '@/lib/data/categories';
import { categoryMetadata } from '@/lib/data/category-metadata';
import CategoryDiscoveryGrid from '@/components/category/CategoryDiscoveryGrid';
import BrandsDiscoveryGrid from '@/components/category/BrandsDiscoveryGrid';
import HeroCarousel from '@/components/home/HeroCarousel';
import Link from 'next/link';

export default function CategoriesDiscoveryPage() {
    // Top brands for the discovery page
    const featuredBrands = [
        { name: 'Apple', icon: 'Apple' },
        { name: 'Samsung', icon: 'Smartphone' },
        { name: 'Sony', icon: 'Search' },
        { name: 'Dell', icon: 'Monitor' },
        { name: 'Asus', icon: 'Cpu' },
        { name: 'HP', icon: 'HardDrive' },
        { name: 'Google', icon: 'Globe' },
        { name: 'Huawei', icon: 'Shield' },
        { name: 'OnePlus', icon: 'PlusSquare' },
        { name: 'Xiaomi', icon: 'Zap' },
        { name: 'Lenovo', icon: 'Tablet' },
        { name: 'MSI', icon: 'Dribbble' },
    ];

    // Aggregate all subcategories for the chip cloud
    const allSubcategories = Object.values(categoryMetadata).flatMap(meta => meta.subcategories);
    // Shuffle or select top ones? Let's take the first 15 for now to avoid overcrowding
    const displaySubcategories = allSubcategories.slice(0, 20);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Top Carousel - Hidden on Mobile */}
            <div className="hidden md:block pt-4">
                <div className="container mx-auto px-4">
                    <HeroCarousel />
                </div>
            </div>

            <div className="container mx-auto px-4 space-y-12 md:space-y-16 mt-8">
                {/* Categories Discovery Grid */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Shop by Category</span>
                    </div>
                    <CategoryDiscoveryGrid categories={categories} />

                    {/* Subcategories Chip Cloud */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {displaySubcategories.map((sub, idx) => (
                            <Link
                                key={idx}
                                href={`/search?q=${sub.slug}`} // Or specific subcat route if available
                                className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 hover:border-zinc-200 hover:text-black transition-all"
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Brands Discovery Section */}
                <div className="space-y-6">
                    {/* ... (Brands content) */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-1 bg-black rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Featured Brands</span>
                        </div>
                        <Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                            View All
                        </Link>
                    </div>
                    <BrandsDiscoveryGrid brands={featuredBrands} />
                </div>
            </div>
        </div>
    );
}
