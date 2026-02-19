'use client';

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';
import { ChevronRight, Smartphone, Apple, PlusSquare, Cpu, Globe, Camera, Zap, Watch, Circle, Navigation, Activity, Shield, Moon, Monitor, HardDrive, Tablet, Layers, Dribbble, Laptop } from 'lucide-react';
import { Product, Category } from '@/lib/types';

const iconMap = {
    Apple, Smartphone, Search: Globe, PlusSquare, Cpu, Globe, Camera, Zap, Watch, Circle, Navigation, Activity, Shield, Moon, Monitor, HardDrive, Tablet, Layers, Dribbble, Laptop
};

interface CategoryArchiveProps {
    category: Category;
    products: Product[];
    metadata: {
        subcategories: { name: string; slug: string }[];
        brands: { name: string; slug: string; icon?: string }[];
    };
}

export default function CategoryArchive({ category, products, metadata }: CategoryArchiveProps) {
    const [selectedSub, setSelectedSub] = useState<string | null>(null);

    const filteredProducts = useMemo(() => {
        if (!selectedSub) return products;
        return products.filter(p =>
            p.tags?.some(t => t.toLowerCase() === selectedSub.toLowerCase()) ||
            p.name.toLowerCase().includes(selectedSub.toLowerCase())
        );
    }, [products, selectedSub]);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Minimal Navigation */}
            <div className="border-b border-zinc-100 bg-zinc-50/30">
                <div className="container mx-auto px-4 py-6">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/products" className="hover:text-black transition-colors">Products</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-black font-black">{category.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8 space-y-12">
                {/* 1. Subcategory Chips Carousel */}
                {metadata.subcategories.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-1 bg-primary rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Explore Segments</span>
                        </div>
                        <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide">
                            <button
                                onClick={() => setSelectedSub(null)}
                                className={`flex-none px-6 py-3 rounded-[5px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedSub === null
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-zinc-500 border-zinc-100 hover:border-black'
                                    }`}
                            >
                                All Products
                            </button>
                            {metadata.subcategories.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSub(sub.name)}
                                    className={`flex-none px-8 py-3 rounded-[5px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedSub === sub.name
                                        ? 'bg-primary text-black border-primary'
                                        : 'bg-white text-black border-zinc-100 hover:border-black'
                                        }`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Enhanced Brands Carousel */}
                {metadata.brands.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-1 bg-zinc-200 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Official Partners</span>
                        </div>
                        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                            {metadata.brands.map((brand, idx) => {
                                const Icon = brand.icon ? (iconMap as any)[brand.icon] : Smartphone;
                                return (
                                    <div
                                        key={idx}
                                        className="flex-none w-28 h-28 bg-zinc-50 border border-zinc-100 rounded-[5px] flex flex-col items-center justify-center gap-3 group hover:border-black hover:bg-white transition-all cursor-pointer"
                                    >
                                        <div className="p-3 bg-white rounded-[5px] group-hover:bg-primary transition-colors">
                                            <Icon className="h-6 w-6 text-black" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-400 group-hover:text-black transition-colors">
                                            {brand.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. Products Grid */}
                <div className="space-y-6 pt-4 border-t border-zinc-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-1 bg-black rounded-full" />
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-black">
                                {selectedSub || 'Full Registry'}
                            </h2>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            {filteredProducts.length} Units Available
                        </span>
                    </div>

                    <ProductGrid
                        products={filteredProducts}
                        emptyMessage={`No products found in ${selectedSub || category.name}. Check back soon for new arrivals.`}
                    />
                </div>
            </div>
        </div>
    );
}
