'use client';

import * as React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { ChevronRight, Smartphone, Watch, Laptop, Tablet, Headphones, Speaker, LayoutGrid, Globe, Camera, Zap, Activity, Shield, Navigation } from 'lucide-react';
import { Category } from '@/lib/types';

const iconMap: Record<string, any> = {
    Smartphone,
    Watch,
    Laptop,
    Tablet,
    Headphones,
    Speaker,
    LayoutGrid,
    Globe,
    Camera,
    Zap,
    Activity,
    Shield,
    Navigation
};

interface CategorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export default function CategorySidebar({ isOpen, onClose, categories }: CategorySidebarProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col bg-white">
                <SheetHeader className="p-6 border-b border-zinc-100">
                    <SheetTitle className="text-xl font-bold text-left">All Categories</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-2">
                    {categories.map((category) => {
                        const Icon = iconMap[category.icon || 'LayoutGrid'] || LayoutGrid;
                        return (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                onClick={onClose}
                                className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Icon className="h-5 w-5 text-zinc-600 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-800">{category.name}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                            </Link>
                        );
                    })}
                </div>

                <div className="p-6 bg-zinc-50 border-t border-zinc-100 italic">
                    <p className="text-[10px] text-zinc-400 font-medium">Explore premium tech accessories curated for you.</p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
