'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import {
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    Box,
    Monitor,
    LayoutGrid,
    Watch,
    Speaker,
    Zap,
    Cable,
    Camera,
    Wifi,
    HardDrive,
    Cpu,
    Briefcase,
    Code,
    Home
} from 'lucide-react';

const iconMap: Record<string, any> = {
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    Box,
    Monitor,
    Watch,
    Speaker,
    Zap,
    Cable,
    Camera,
    Wifi,
    HardDrive,
    Cpu,
    Briefcase,
    Code,
    Home
};

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface CategoryGridProps {
    categories?: Category[];
}

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
    const displayCategories = categories.slice(0, 20);
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    return (
        <section className="bg-white py-4 md:py-6 border-b border-zinc-100/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="h-4 w-1 md:h-5 bg-black rounded-full" />
                    <h2 className="text-[12px] md:text-[14px] font-black text-black uppercase tracking-[0.15em] font-poppins">Shop by Category</h2>
                </div>

                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                >
                    <CarouselContent className="-ml-4 pb-4">
                        {displayCategories.map((category) => {
                            const Icon = iconMap[category.icon || 'Smartphone'] || Smartphone;
                            const hasImage = category.image && category.image !== '';

                            return (
                                <CarouselItem key={category.id} className="pl-4 basis-1/5 md:basis-1/10 min-w-[85px] md:min-w-[110px]">
                                    <Link
                                        href={`/category/${category.slug}`}
                                        className="flex flex-col items-center gap-2 group w-full"
                                    >
                                        <div className={cn(
                                            "relative w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/5 overflow-hidden border",
                                            hasImage
                                                ? "bg-zinc-50 border-zinc-100/80"
                                                : "bg-[#c7f502] border-[#c7f502]"
                                        )}>
                                            {hasImage ? (
                                                <div className="relative w-full h-full p-2 md:p-3">
                                                    <Image
                                                        src={category.image!}
                                                        alt={category.name}
                                                        fill
                                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            ) : (
                                                <Icon strokeWidth={2} className="h-5 w-5 md:h-8 md:w-8 text-black transition-transform duration-500 group-hover:scale-110" />
                                            )}

                                            {/* Glass reflection effect */}
                                            <div className="hidden md:block absolute inset-x-0 top-0 h-1/2 bg-white/10 skew-y-[-20deg] translate-y-[-50%] pointer-events-none" />
                                        </div>
                                        <span className="text-[9px] md:text-[11px] font-black text-black text-center uppercase tracking-tight leading-tight font-poppins line-clamp-1 w-full px-1">
                                            {category.name}
                                        </span>
                                    </Link>
                                </CarouselItem>
                            );
                        })}

                        {/* "All" Button */}
                        <CarouselItem className="pl-4 basis-1/5 md:basis-1/10 min-w-[85px] md:min-w-[110px]">
                            <Link
                                href="/categories"
                                className="flex flex-col items-center gap-2 group w-full"
                            >
                                <div className="w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/20 overflow-hidden">
                                    <LayoutGrid strokeWidth={2} className="h-5 w-5 md:h-8 md:w-8 text-white" />
                                </div>
                                <span className="text-[9px] md:text-[11px] font-black text-black text-center uppercase tracking-tight leading-tight font-poppins px-1">
                                    All
                                </span>
                            </Link>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
