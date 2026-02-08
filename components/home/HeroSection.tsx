import * as React from 'react';
import HeroCarousel from './HeroCarousel';
import HeroSecondaryCarousel from './HeroSecondaryCarousel';

export default function HeroSection() {
    return (
        <section className="w-full pt-4 lg:pt-6 pb-2 lg:pb-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:h-[450px]">
                    {/* Main Promo Carousel (75% width on desktop) */}
                    <div className="lg:col-span-3 h-[250px] lg:h-full overflow-hidden rounded-[2rem]">
                        <HeroCarousel />
                    </div>

                    {/* Secondary Content Slider (25% width on desktop) - Hidden on mobile */}
                    <div className="hidden lg:block h-full w-full overflow-hidden rounded-[2rem]">
                        <HeroSecondaryCarousel />
                    </div>
                </div>
            </div>
        </section>
    );
}
