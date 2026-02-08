'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSecondaryCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
    );

    const items = [
        {
            id: 1,
            title: 'Pitaka Tech',
            subtitle: 'Elite Protection',
            link: '/products?q=pitaka',
            image: '/images/promotions/pitak.jpg',
            textColor: 'text-white',
        },
        {
            id: 2,
            title: 'Aramid Touch',
            subtitle: 'Premium Feeling',
            link: '/products?q=cases',
            image: '/images/promotions/pitak-1.webp',
            textColor: 'text-white',
        }
    ];

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
                <CarouselContent className="h-full ml-0">
                    {items.map((item) => (
                        <CarouselItem key={item.id} className="pl-0 h-full">
                            <Link href={item.link} className="block h-full group">
                                <div className={`relative h-full w-full rounded-[2rem] overflow-hidden bg-zinc-900 flex flex-col justify-between p-8 transition-transform duration-500 group-hover:scale-[0.98]`}>
                                    {/* Image Background */}
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    <div className="z-10 relative">
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${item.textColor} opacity-60 mb-2`}>{item.subtitle}</p>
                                        <h3 className={`text-2xl font-black uppercase tracking-tight leading-none ${item.textColor}`}>{item.title}</h3>
                                    </div>

                                    <div className="z-10 relative mt-auto flex justify-end">
                                        <div className={`h-10 w-10 rounded-full border-2 border-primary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors duration-300`}>
                                            <span className="sr-only">Go</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
