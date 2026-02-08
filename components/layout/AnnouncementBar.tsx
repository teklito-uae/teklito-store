'use client';

import Link from 'next/link';
import { Category } from '@/lib/types';
import Marquee from 'react-fast-marquee';

interface AnnouncementBarProps {
    categories: Category[];
}

export default function AnnouncementBar({ categories }: AnnouncementBarProps) {
    return (
        <div className="bg-black text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest py-2 overflow-hidden border-b border-zinc-900">
            <Marquee gradient={false} speed={40} className="py-1">
                <span className="mx-8">⚡ #1 Gadget Store in UAE</span>
                {categories.map((cat) => (
                    <span key={cat.id} className="mx-8 text-white/80">
                        {cat.name}
                    </span>
                ))}
                <span className="mx-8">⚡ Free Shipping on Orders Over $100</span>
                <span className="mx-8 text-white/80">Premium Tech Accessories</span>
            </Marquee>
        </div>
    );
}
