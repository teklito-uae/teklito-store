'use client';

import * as React from 'react';
import HeroCarousel from './HeroCarousel';
import DealsCarousel from './DealsCarousel';

export default function HeroSection() {
    return (
        <section className="w-full pt-4 pb-8 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-6 flex flex-col gap-4">
                    {/* Main Hero Slider */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <HeroCarousel />
                    </div>

                    {/* Deals Carousel - Desktop Only */}
                    <div className="hidden lg:block lg:col-span-4 xl:col-span-3 h-full">
                        <DealsCarousel />
                    </div>
                </div>
            </div>
        </section>
    );
}
