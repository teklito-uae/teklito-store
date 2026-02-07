'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    Box,
    Monitor,
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

interface CategoryDiscoveryGridProps {
    categories: Category[];
}

export default function CategoryDiscoveryGrid({ categories }: CategoryDiscoveryGridProps) {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-8">
            {categories.map((cat) => {
                const Icon = iconMap[cat.icon || 'Smartphone'] || Smartphone;
                const hasImage = cat.image && cat.image !== '';

                return (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex flex-col items-center gap-3 group"
                    >
                        <div className={cn(
                            "relative aspect-square w-full rounded-[2rem] border overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/5",
                            hasImage
                                ? "bg-zinc-50 border-zinc-100/80 group-hover:border-primary"
                                : "bg-[#c7f502] border-[#c7f502]"
                        )}>
                            {hasImage ? (
                                <div className="relative w-full h-full p-4">
                                    <Image
                                        src={cat.image!}
                                        alt={cat.name}
                                        fill
                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ) : (
                                <Icon strokeWidth={2} className="h-8 w-8 text-black transition-transform duration-500 group-hover:scale-110" />
                            )}

                            {/* Subtle Glow Effect on Hover */}
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                        </div>
                        <span className="text-[10px] md:text-sm font-black text-black uppercase italic tracking-tighter text-center group-hover:text-primary transition-colors font-poppins">
                            {cat.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
