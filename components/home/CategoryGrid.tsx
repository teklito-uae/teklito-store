'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data/categories';
import CategorySidebar from './CategorySidebar';
import {
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    Box,
    Monitor,
    LayoutGrid,
    Watch
} from 'lucide-react';

const iconMap: Record<string, any> = {
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    Box,
    Monitor,
    Watch
};

export default function CategoryGrid() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Get the first 7 categories for the grid + More button makes it 8 (2 rows of 4)
    const topCategories = categories.slice(0, 7);

    return (
        <section className="bg-white py-6 md:py-10 border-b border-zinc-100/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-5 w-1 bg-black rounded-full" />
                    <h2 className="text-[14px] font-black text-black uppercase tracking-[0.15em] font-poppins">Shop by Category</h2>
                </div>

                <div className="grid grid-cols-4 gap-y-8 gap-x-3 sm:gap-x-6">
                    {topCategories.map((category) => {
                        const Icon = iconMap[category.icon || 'Smartphone'] || Smartphone;
                        const hasImage = category.image && category.image !== '';

                        return (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="flex flex-col items-center gap-3 group"
                            >
                                <div className={cn(
                                    "relative w-full aspect-square rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/5 overflow-hidden border",
                                    hasImage
                                        ? "bg-zinc-50 border-zinc-100/80"
                                        : "bg-[#c7f502] border-[#c7f502]"
                                )}>
                                    {hasImage ? (
                                        <div className="relative w-full h-full p-4">
                                            <Image
                                                src={category.image!}
                                                alt={category.name}
                                                fill
                                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <Icon strokeWidth={2} className="h-8 w-8 text-black transition-transform duration-500 group-hover:scale-110" />
                                    )}

                                    {/* Glass reflection effect */}
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 skew-y-[-20deg] translate-y-[-50%] pointer-events-none" />
                                </div>
                                <span className="text-[10px] md:text-[11px] font-black text-black text-center uppercase tracking-tight leading-none px-0.5 group-hover:text-primary transition-colors font-poppins italic">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* "More" Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex flex-col items-center gap-3 group"
                    >
                        <div className="w-full aspect-square rounded-[2rem] bg-zinc-900 flex items-center justify-center transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/20 overflow-hidden">
                            <LayoutGrid strokeWidth={2} className="h-8 w-8 text-primary" />
                        </div>
                        <span className="text-[10px] md:text-[11px] font-black text-black text-center uppercase tracking-tight leading-none font-poppins italic">
                            All Categories
                        </span>
                    </button>
                </div>
            </div>

            <CategorySidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
        </section>
    );
}
