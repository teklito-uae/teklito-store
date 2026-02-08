'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Category } from '@/lib/types';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// We need to override the CommandDialog default content to customize position
// Importing CommandDialog primitives manually might be better or just styling override.
// Shadcn CommandDialog wraps content.

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
}

export default function SearchDialog({ open, onOpenChange, categories }: SearchDialogProps) {
    const router = useRouter();

    const handleSelectCategory = (slug: string) => {
        router.push(`/category/${slug}`);
        onOpenChange(false);
    };

    const handleSearch = (search: string) => {
        if (!search) return;
        router.push(`/search?q=${encodeURIComponent(search)}`);
        onOpenChange(false);
    };

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            shouldFilter={false}
        // Add custom classes to DialogContent via accessible props if CommandDialog exposure allows, 
        // but typical Shadcn CommandDialog doesn't expose className for DialogContent directly easily without modifying the component.
        // However, we can use the primitives if we want full control.
        >
            <div className="flex flex-col h-full md:h-auto bg-zinc-900">
                <DialogTitle className="sr-only">Search</DialogTitle>

                {/* Custom Input Header */}
                <div className="flex items-center p-4 border-b border-zinc-800">
                    <CommandInput
                        placeholder="Search products..."
                        className="flex-1 h-12 bg-transparent text-lg text-white font-bold placeholder:text-zinc-600 border-none focus:ring-0 px-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e.currentTarget.value);
                            }
                        }}
                    />
                    <button onClick={() => onOpenChange(false)} className="md:hidden p-2 text-zinc-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <CommandList className="flex-1 p-4 font-poppins">
                    <CommandEmpty className="py-6 text-center text-zinc-500 text-sm">No results found.</CommandEmpty>

                    <CommandGroup heading="Trending Now" className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-4">
                        <div className="space-y-1 mt-2">
                            {['iPhone 16 Pro Max', 'Gaming Mechanical Keyboard', 'Ultra-wide Monitor', 'Wireless Earbuds'].map((item) => (
                                <CommandItem
                                    key={item}
                                    onSelect={() => handleSearch(item)}
                                    className="flex items-center gap-2 text-zinc-300 hover:text-white cursor-pointer py-2 rounded-lg"
                                >
                                    <Search className="h-3 w-3 text-primary/50" />
                                    <span>{item}</span>
                                </CommandItem>
                            ))}
                        </div>
                    </CommandGroup>

                    <CommandGroup heading="Browse Categories" className="text-zinc-500 font-bold uppercase tracking-wider text-xs">
                        <div className="flex flex-wrap gap-2 mt-3">
                            {categories.slice(0, 15).map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleSelectCategory(category.slug)}
                                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-[11px] font-bold uppercase tracking-wider hover:bg-primary hover:text-black transition-all"
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </CommandGroup>
                </CommandList>
            </div>
        </CommandDialog>
    );
}
