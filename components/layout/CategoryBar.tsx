'use client';

import React from 'react';
import Link from 'next/link';
import {
    Camera,
    Gamepad2,
    Ticket,
    Headphones,
    Monitor,
    Printer,
    Watch,
    Speaker,
    Tablet,
    Smartphone
} from 'lucide-react';

const categories = [
    { name: 'Camera', icon: Camera, href: '/category/cameras' },
    { name: 'Video Games', icon: Gamepad2, href: '/category/video-games' },
    { name: 'Top Offers', icon: Ticket, href: '/products?filter=featured' },
    { name: 'Airpods', icon: Headphones, href: '/category/audio' },
    { name: 'Computers', icon: Monitor, href: '/category/computers' },
    { name: 'Printer & Ink', icon: Printer, href: '/category/accessories' },
    { name: 'Smartwatches', icon: Watch, href: '/category/watches' },
    { name: 'Speaker', icon: Speaker, href: '/category/audio' },
    { name: 'Tablets', icon: Tablet, href: '/category/tablets' },
    { name: 'Phones', icon: Smartphone, href: '/category/mobiles' },
];

import NextLink from 'next/link';

export default function CategoryBar() {
    return (
        <div className="w-full bg-white border-b border-zinc-100 overflow-x-auto scrollbar-hide">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-start lg:justify-center gap-8 py-4 min-w-max">
                    {categories.map((category) => (
                        <NextLink
                            key={category.name}
                            href={category.href}
                            className="flex flex-col items-center gap-2 group min-w-[80px]"
                        >
                            <div className="p-2 transition-transform duration-300 group-hover:scale-110">
                                <category.icon className="h-6 w-6 text-zinc-800 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-black transition-colors">
                                {category.name}
                            </span>
                        </NextLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
