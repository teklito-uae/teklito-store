'use client';

import * as React from 'react';
import { Search, X, ArrowUpLeft, Heart, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { searchProducts } from '@/lib/data/products';
import Link from 'next/link';
import { getWishlistCount } from '@/lib/store/wishlist';

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
    const [query, setQuery] = React.useState('');
    const [suggestions, setSuggestions] = React.useState<Product[]>([]);
    const [wishlistCount, setWishlistCount] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setWishlistCount(getWishlistCount());
        } else {
            setQuery('');
            setSuggestions([]);
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (query.trim()) {
            const results = searchProducts(query);
            setSuggestions(results.slice(0, 8));
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 z-[100] bg-white flex flex-col"
                >
                    {/* Search Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-zinc-400">
                            <ChevronRight className="h-6 w-6 rotate-180" />
                        </Button>

                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Search on Teklito..."
                                className="h-11 w-full bg-zinc-50 border-zinc-100 rounded-xl pl-4 pr-10 text-base md:text-sm font-medium focus-visible:ring-primary/20"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        </form>

                        <button onClick={onClose} className="text-sm font-semibold text-zinc-500 px-1">
                            Cancel
                        </button>

                        <Link href="/wishlist" onClick={onClose} className="relative p-2">
                            <Heart className="h-5 w-5 text-zinc-800" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Suggestions Area */}
                    <div className="flex-1 overflow-y-auto bg-white pt-2">
                        {suggestions.length > 0 ? (
                            <div className="divide-y divide-zinc-50">
                                {suggestions.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-[15px] font-medium text-zinc-800 group-hover:text-primary transition-colors">
                                                {product.name.toLowerCase()}
                                            </span>
                                        </div>
                                        <ArrowUpLeft className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 rotate-45" />
                                    </Link>
                                ))}
                                <button
                                    onClick={handleSearch}
                                    className="w-full text-left p-4 text-sm font-bold text-zinc-400 uppercase tracking-widest hover:text-black"
                                >
                                    See all results for "{query}"
                                </button>
                            </div>
                        ) : query.trim() ? (
                            <div className="p-8 text-center">
                                <p className="text-zinc-400 text-sm">No suggestions for "{query}"</p>
                            </div>
                        ) : (
                            <div className="px-6 py-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Popular Searches</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['iPhone 15', 'Samsung S24', 'Apple Watch', 'Clear Case', 'Screen Protector'].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setQuery(term)}
                                            className="px-4 py-2 bg-zinc-50 rounded-full text-xs font-semibold text-zinc-600 border border-zinc-100 hover:border-primary transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
