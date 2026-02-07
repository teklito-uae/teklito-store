'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/data/products';
import { cn } from '@/lib/utils';

export default function DealsCarousel() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const deals = getFeaturedProducts(5);

    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="h-full w-full bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary fill-primary" />
                    <span className="text-white font-black text-xs uppercase tracking-widest">Deals of the Day</span>
                </div>
                <div className="flex gap-1">
                    {deals.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300",
                                current === i ? "w-4 bg-primary" : "w-1 bg-zinc-700"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div className="flex-1 relative">
                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    className="h-full w-full"
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                >
                    <CarouselContent className="h-full">
                        {deals.map((product) => (
                            <CarouselItem key={product.id} className="h-full">
                                <Link href={`/products/${product.slug}`} className="block h-full p-6 group">
                                    <div className="flex flex-col h-full gap-4">
                                        <div className="relative aspect-square w-full max-w-[120px] mx-auto overflow-hidden rounded-xl bg-zinc-50">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center text-center">
                                            <h3 className="text-sm font-bold text-black line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-lg font-black text-black">
                                                    AED {product.price.toFixed(0)}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-zinc-400 line-through">
                                                        AED {product.originalPrice.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-3">
                                                <div className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full inline-block uppercase tracking-wider">
                                                    Save {product.discount}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <Link
                href="/products?filter=featured"
                className="bg-zinc-50 border-t border-zinc-100 py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black hover:bg-zinc-100 transition-all text-center flex items-center justify-center gap-2 group"
            >
                View All Deals
                <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
