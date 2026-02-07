'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    image?: string;
    bgGradient: string;
    textColor: string;
}

const heroSlides: HeroSlide[] = [
    {
        id: 1,
        title: 'Shop & Win 1 Million',
        subtitle: 'NOON MILLIONAIRE',
        description: '02 FEB - 22 FEB • Use code: DREAMDUBAI',
        ctaText: 'Use code: DREAMDUBAI',
        ctaLink: '/products',
        image: '/images/slider-1.avif',
        bgGradient: 'from-[#ff8c7a] via-[#f04593] to-[#e91e63]',
        textColor: 'text-white',
    },
    {
        id: 2,
        title: 'Premium Phone Cases',
        subtitle: 'PROTECTION PROTOCOL',
        description: 'Military grade protection for your elite devices.',
        ctaText: 'Explore Gear',
        ctaLink: '/category/phone-cases',
        bgGradient: 'from-[#fee500] via-[#c7f502] to-[#a8cf00]',
        textColor: 'text-black',
    },
    {
        id: 3,
        title: 'Elite Smart Watches',
        subtitle: 'LIFESTYLE SYNC',
        description: 'Track your bio-metrics with precision engineering.',
        ctaText: 'Sync Now',
        ctaLink: '/category/watches',
        bgGradient: 'from-zinc-900 via-zinc-800 to-black',
        textColor: 'text-white',
    },
];

export default function HeroCarousel() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="w-full h-full overflow-hidden">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{
                    align: 'start',
                    loop: true,
                }}
            >
                <CarouselContent className="h-full">
                    {heroSlides.map((slide) => (
                        <CarouselItem key={slide.id} className="h-full">
                            <div className={cn(
                                "relative overflow-hidden rounded-[2rem] min-h-[220px] md:min-h-[380px] h-full flex items-center bg-gradient-to-r shadow-sm",
                                slide.bgGradient
                            )}>
                                {/* Image Layer */}
                                {slide.image && (
                                    <div className="absolute inset-x-0 inset-y-0 z-0">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-cover opacity-90 md:opacity-100"
                                            priority
                                        />
                                    </div>
                                )}

                                {/* Glossy Overlay for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                                <div className="px-6 md:px-12 relative z-10 py-6">
                                    <div className="max-w-md space-y-3">
                                        {/* Subtitle / Badge */}
                                        <div className={cn(
                                            "inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase mb-1",
                                            slide.textColor === 'text-white' ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-black/10 text-black'
                                        )}>
                                            {slide.subtitle}
                                        </div>

                                        {/* Main Title */}
                                        <h2 className={cn(
                                            "text-h2 font-bold uppercase tracking-tight leading-tight italic",
                                            slide.textColor
                                        )}>
                                            {slide.title}
                                        </h2>

                                        {/* Description */}
                                        <p className={cn(
                                            "text-[10px] md:text-sm font-bold uppercase tracking-tight opacity-90",
                                            slide.textColor
                                        )}>
                                            {slide.description}
                                        </p>

                                        {/* CTA Button */}
                                        <div className="pt-2">
                                            <Button
                                                asChild
                                                className={cn(
                                                    "h-8 md:h-12 px-6 md:px-8 rounded-full font-black text-[9px] md:text-xs tracking-widest uppercase transition-transform active:scale-95 shadow-lg",
                                                    slide.textColor === 'text-white'
                                                        ? 'bg-white text-black hover:bg-zinc-100 shadow-white/10'
                                                        : 'bg-black text-white hover:bg-zinc-900 shadow-black/10'
                                                )}
                                            >
                                                <Link href={slide.ctaLink} className="flex items-center gap-2">
                                                    <span>{slide.ctaText}</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Dot Indicators - Compact Position */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            "h-1 rounded-full transition-all duration-500",
                            current === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
