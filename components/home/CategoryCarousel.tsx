'use client';

import Link from 'next/link';
import { Smartphone, Watch, Tag, Headset, Laptop, Gamepad2, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryItems = [
    { name: 'MOBILES', slug: 'mobiles', icon: Smartphone },
    { name: 'WATCHES', slug: 'watches', icon: Watch },
    { name: 'TOP OFFERS', slug: 'products?filter=featured', icon: Tag },
    { name: 'AIRPODS', slug: 'category/audio', icon: Headset },
    { name: 'ELECTRONICS', slug: 'category/electronics', icon: Laptop },
    { name: 'VIDEO GAMES', slug: 'category/gaming', icon: Gamepad2 },
    { name: 'CAMERA', slug: 'category/cameras', icon: Camera },
];

export default function CategoryCarousel() {
    return (
        <div className="w-full bg-white border-b border-zinc-100 overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 px-4 md:px-8">
                {categoryItems.map((item) => {
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
