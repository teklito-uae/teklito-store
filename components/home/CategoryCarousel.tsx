'use client';

import Link from 'next/link';
import { Smartphone, Watch, Tag, Headset, Laptop, Gamepad2, Camera, Globe, Search, Monitor, HardDrive, Tablet, Cpu, Zap, Activity, Shield, Navigation } from 'lucide-react';
import { Category } from '@/lib/types';

const iconMap = {
    Mobiles: Smartphone,
    Watches: Watch,
    Audio: Headset,
    Electronics: Laptop,
    Gaming: Gamepad2,
    Cameras: Camera,
    Default: Globe
};

interface CategoryCarouselProps {
    categories: Category[];
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
    // Add "Top Offers" as a static item
    const displayItems = [
        { name: 'TOP OFFERS', slug: 'products?filter=featured', icon: Tag },
        ...categories.map(cat => ({
            name: cat.name,
            slug: `category/${cat.slug}`,
            icon: (iconMap as any)[cat.name] || (iconMap as any)[cat.icon as string] || iconMap.Default
        }))
    ];

    return (
        <div className="w-full bg-white border-b border-zinc-100 overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 px-4 md:px-8">
                {displayItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.slug.startsWith('/') ? item.slug : `/${item.slug}`}
                            className="flex flex-col items-center justify-center min-w-[90px] md:min-w-[120px] gap-3 group"
                        >
                            <div className="h-12 w-12 flex items-center justify-center rounded-sm bg-white transition-all group-active:scale-95">
                                <Icon strokeWidth={1.5} className="h-7 w-7 text-zinc-800" />
                            </div>
                            <span className="text-[10px] md:text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-center">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Scroll Indicator Row (Optional Visual) */}
            <div className="flex justify-center pb-2">
                <div className="h-1 w-12 bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-zinc-400 rounded-full" />
                </div>
            </div>
        </div>
    );
}
