'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromotionCardProps {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    link: string;
    image: string;
    className?: string;
    light?: boolean;
}

function PromotionCard({ title, subtitle, description, cta, link, image, className, light }: PromotionCardProps) {
    return (
        <Link
            href={link}
            className={cn(
                "relative overflow-hidden rounded-[2.5rem] group min-h-[400px] md:min-h-[500px] flex flex-col justify-end p-8 md:p-12 transition-all duration-700 hover:shadow-2xl",
                className
            )}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Overlay with subtle black-light tint */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 transition-opacity duration-700",
                    light ? "opacity-70 group-hover:opacity-60" : "opacity-90 group-hover:opacity-80"
                )} />
                {/* Subtle Glow/Refraction */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(199,245,2,0.1),transparent)] pointer-events-none" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-md">
                <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4",
                    light ? "bg-white/20 text-white backdrop-blur-md" : "bg-primary text-black"
                )}>
                    {subtitle}
                </span>

                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4">
                    {title}
                </h3>

                <p className="text-zinc-200 text-sm md:text-base font-medium mb-8 opacity-90 leading-relaxed line-clamp-2 md:line-clamp-none">
                    {description}
                </p>

                <div className="flex items-center gap-3 text-xs md:text-sm font-black text-white uppercase tracking-widest group-hover:gap-5 transition-all duration-500">
                    <span className="border-b-2 border-primary pb-1">{cta}</span>
                    <ArrowRight className="h-5 w-5 text-primary" />
                </div>
            </div>
        </Link>
    );
}

export default function PitakaPromotion() {
    return (
        <section className="container mx-auto px-4 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <PromotionCard
                    title="Aramid Fiber Mastery"
                    subtitle="PITAKA EXCLUSIVE"
                    description="The world's thinnest and lightest protective cases. Aerospace-grade material meets minimalist design."
                    cta="Explore Series"
                    link="/products?q=pitaka"
                    image="/images/promotions/pitak.jpg"
                    className="w-full"
                />
                <PromotionCard
                    title="Tactile Precision"
                    subtitle="PREMIUM TEXTURE"
                    description="Engineered for the ultimate grip and feel. Experience the intersection of technology and luxury."
                    cta="Find Your Style"
                    link="/products?q=cases"
                    image="/images/promotions/pitak-1.webp"
                    light
                    className="w-full"
                />
            </div>
        </section>
    );
}
