'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannerProps {
    title: string;
    subtitle: string;
    cta: string;
    link: string;
    bgClass: string;
    image?: string;
    className?: string;
}

function PromoCard({ title, subtitle, cta, link, bgClass, image, className }: BannerProps) {
    return (
        <Link
            href={link}
            className={cn(
                "relative overflow-hidden rounded-[2rem] group flex flex-col justify-end p-8 md:p-12 min-h-[300px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
                bgClass,
                className
            )}
        >
            <div className="relative z-10 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{subtitle}</span>
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                    {title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest group-hover:gap-4 transition-all">
                    <span>{cta}</span>
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>

            {image && (
                <div className="absolute inset-x-0 inset-y-0 z-0">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </Link>
    );
}

export default function PromoBanners() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PromoCard
                title="Galaxy S24 Ultra"
                subtitle="The AI King"
                cta="Shop Now"
                link="/products/samsung-galaxy-s24-ultra"
                bgClass="bg-gradient-to-br from-zinc-900 to-zinc-800"
                className="lg:col-span-2"
            />
            <PromoCard
                title="Apple Watch"
                subtitle="Elite Series"
                cta="View Collection"
                link="/category/watches"
                bgClass="bg-gradient-to-br from-primary to-lime-600"
            />
            <PromoCard
                title="Premium Cases"
                subtitle="Protection Protocol"
                cta="Browse Gear"
                link="/category/phone-cases"
                bgClass="bg-gradient-to-br from-pink-500 to-rose-600"
            />
            <PromoCard
                title="New Arrivals"
                subtitle="Latest Tech"
                cta="Explore All"
                link="/products"
                bgClass="bg-gradient-to-br from-blue-600 to-cyan-500"
                className="lg:col-span-2"
            />
        </div>
    );
}
