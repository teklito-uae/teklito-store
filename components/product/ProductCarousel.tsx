'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/lib/types';

interface ProductCarouselProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
}

export default function ProductCarousel({
    title,
    products,
    viewAllLink = '/products',
}: ProductCarouselProps) {
    // Limit to 15 products
    const displayProducts = products.slice(0, 15);

    return (
        <div className="space-y-4">
            {/* Noon-style Header */}
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg md:text-2xl font-bold text-zinc-900 tracking-tight">
                    {title}
                </h2>
                <Link
                    href={viewAllLink}
                    className="flex items-center gap-1 group text-blue-600 hover:text-blue-700"
                >
                    <span className="text-xs md:text-sm font-bold">View All</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Carousel */}
            <div className="relative">
                <Carousel
                    opts={{
                        align: 'start',
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3 pb-4">
                        {displayProducts.map((product) => (
                            <CarouselItem
                                key={product.id}
                                className="pl-3 basis-[45%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                            >
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Arrows - Only visible on desktop hover */}
                    <CarouselPrevious className="hidden xl:flex -left-6 bg-white/90 shadow-md border-zinc-100 hover:bg-zinc-50" />
                    <CarouselNext className="hidden xl:flex -right-6 bg-white/90 shadow-md border-zinc-100 hover:bg-zinc-50" />
                </Carousel>
            </div>
        </div>
    );
}
