'use client';

import * as React from 'react';
import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ProductCard from '@/components/product/ProductCard';

interface HeroProductSliderProps {
    products: Product[];
}

export default function HeroProductSlider({ products }: HeroProductSliderProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    return (
        <div className="w-full h-full">
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{
                    align: 'start',
                    loop: true,
                }}
            >
                <CarouselContent className="h-full items-stretch ml-0">
                    {products.map((product) => (
                        <CarouselItem key={product.id} className="pl-0 h-full">
                            <div className="h-full p-1">
                                <ProductCard product={product} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
