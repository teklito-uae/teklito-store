'use client';

import React from 'react';
import Link from 'next/link';
import {
    Camera,
    Gamepad2,
    Ticket,
    Headphones,
    Monitor,
    Printer,
    Watch,
    Speaker,
    Tablet,
    Smartphone,
    LayoutGrid
} from 'lucide-react';
import { Category } from '@/lib/types';

const iconMap: Record<string, any> = {
    Camera,
    Gamepad2,
    Ticket,
    Headphones,
    Monitor,
    Printer,
    Watch,
    Speaker,
    Tablet,
    Smartphone,
    LayoutGrid
};

interface CategoryBarProps {
    categories?: Category[];
}

export default function CategoryBar({ categories = [] }: CategoryBarProps) {
    // Add "Top Offers" manually if it's not in DB, or assume it's a featured filter
    const displayCategories = [
        { name: 'Top Offers', slug: 'featured', icon: 'Ticket', href: '/products?filter=featured' },
        ...categories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon || 'Smartphone',
            href: `/category/${cat.slug}`
        }))
    ];

    return (
        <div className="w-full bg-white border-b border-zinc-100 overflow-x-auto scrollbar-hide">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-start lg:justify-center gap-8 py-4 min-w-max">
                    {displayCategories.map((category) => {
                        const Icon = iconMap[category.icon] || Smartphone;
                        return (
                            <Link
                                key={category.slug}
                                href={category.href}
                                className="flex flex-col items-center gap-2 group min-w-[80px]"
                            >
                                <div className="p-2 transition-transform duration-300 group-hover:scale-110">
                                    <Icon className="h-6 w-6 text-zinc-800 group-hover:text-primary transition-colors" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-black transition-colors">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
