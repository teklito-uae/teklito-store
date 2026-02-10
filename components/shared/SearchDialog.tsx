'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { DialogTitle } from '@/components/ui/dialog';
import { Category, Product } from '@/lib/types';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchProducts } from '@/lib/actions/products';
import ProductImage from '@/components/product/ProductImage';
import { getImageUrl } from '@/lib/utils/image';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
}

export default function SearchDialog({ open, onOpenChange, categories }: SearchDialogProps) {
    const router = useRouter();
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Debounced search
    React.useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await searchProducts(query);
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectCategory = (slug: string) => {
        router.push(`/category/${slug}`);
        onOpenChange(false);
    };

    const handleSelectProduct = (slug: string) => {
        router.push(`/products/${slug}`);
        onOpenChange(false);
    };

    const handleSearchSubmit = (search: string) => {
        const finalQuery = search || query;
        if (!finalQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
        onOpenChange(false);
    };

    // Reset state on close
    React.useEffect(() => {
        if (!open) {
            setQuery('');
            setResults([]);
        }
    }, [open]);

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            shouldFilter={false}
        >
            <div className="flex flex-col h-full md:h-auto bg-white overflow-hidden border-none shadow-none text-black">
                <DialogTitle className="sr-only">Search Products</DialogTitle>

                {/* Custom Input Header */}
                <div className="flex items-center p-3 md:p-6 border-b border-zinc-100 bg-white sticky top-0 z-20 gap-2">
                    <div className="relative flex-1 group">
                        <Search className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                            loading ? "text-primary" : "text-zinc-400 group-focus-within:text-black"
                        )} />
                        <CommandPrimitive.Input
                            placeholder="Type to search..."
                            className="w-full h-11 md:h-14 bg-zinc-50 rounded-xl md:rounded-2xl text-sm md:text-lg text-black font-bold placeholder:text-zinc-400 border-none focus:ring-2 focus:ring-primary/20 pl-11 md:pl-12 pr-11 md:pr-12 transition-all outline-none"
                            value={query}
                            onValueChange={setQuery}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit(query);
                                }
                            }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {loading && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
                            {query && !loading && (
                                <button onClick={() => setQuery('')} className="p-1 hover:bg-zinc-200 rounded-full transition-colors">
                                    <X className="h-4 w-4 text-zinc-400" />
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black transition-all shrink-0"
                    >
                        <X className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                </div>

                <CommandList className="flex-1 max-h-[55vh] md:max-h-[480px] p-2 md:p-4 font-poppins scrollbar-hide overflow-y-auto bg-white">
                    {query.length > 0 && results.length === 0 && !loading && (
                        <CommandEmpty className="py-10 md:py-16 text-center">
                            <div className="flex flex-col items-center gap-3 px-4">
                                <Search className="h-10 w-10 md:h-12 md:w-12 text-zinc-100" />
                                <div className="space-y-1">
                                    <p className="font-bold text-black text-sm md:text-base">No results for "{query}"</p>
                                    <p className="text-[10px] md:text-xs text-zinc-500 font-medium">Try different keywords or browse categories</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 h-8 rounded-full px-5 border-zinc-200 text-[9px] font-bold uppercase tracking-widest"
                                    onClick={() => setQuery('')}
                                >
                                    Reset
                                </Button>
                            </div>
                        </CommandEmpty>
                    )}

                    {/* Autocomplete Results */}
                    {results.length > 0 && (
                        <CommandGroup
                            heading={
                                <span className="flex items-center justify-between text-zinc-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] pb-2 px-2">
                                    Results
                                    <span className="text-primary">{results.length} Found</span>
                                </span>
                            }
                        >
                            <div className="grid grid-cols-1 gap-1 md:gap-2">
                                {results.map((product) => (
                                    <CommandItem
                                        key={product.id}
                                        value={product.id}
                                        onSelect={() => handleSelectProduct(product.slug)}
                                        onClick={() => handleSelectProduct(product.slug)}
                                        className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg md:rounded-2xl bg-zinc-50/30 hover:bg-zinc-100 transition-all cursor-pointer group border border-transparent hover:border-zinc-200 !opacity-100 !pointer-events-auto"
                                    >
                                        <div className="flex items-center gap-3 md:gap-4 w-full">
                                            <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-md md:rounded-xl bg-white border border-zinc-100 p-1 overflow-hidden shrink-0">
                                                <ProductImage
                                                    src={getImageUrl(product.images)}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                                                    fill
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-black text-xs md:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                    {product.name}
                                                </h4>
                                                <p className="text-[9px] md:text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                                                    {product.category}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0 pr-1 md:pr-2">
                                                <p className="font-black text-black text-xs md:text-sm tracking-tight">${product.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}

                                <button
                                    onClick={() => handleSearchSubmit(query)}
                                    className="w-full mt-2 py-3.5 md:py-5 rounded-xl md:rounded-3xl bg-black text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center justify-center gap-2 md:gap-3 hover:bg-primary hover:text-black transition-all"
                                >
                                    Full results for "{query}"
                                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                                </button>
                            </div>
                        </CommandGroup>
                    )}

                    {/* Default Categories view when no search */}
                    {query.length === 0 && (
                        <div className="space-y-5 md:space-y-8 py-2">
                            <CommandGroup
                                heading={<span className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] pb-2 px-2">Popular</span>}
                            >
                                <div className="flex flex-wrap gap-1.5 px-2">
                                    {['iPhone', 'MacBook', 'S24', 'Tesla'].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setQuery(item)}
                                            className="px-3 md:px-5 py-1.5 md:py-2.5 rounded-full bg-zinc-50 text-zinc-600 text-[10px] md:text-[11px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all border border-zinc-100"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </CommandGroup>

                            <CommandGroup
                                heading={<span className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] pb-2 px-2">Browse</span>}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2 pb-4">
                                    {categories.slice(0, 8).map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleSelectCategory(category.slug)}
                                            className="flex flex-col items-center justify-center py-3 md:py-5 px-2 rounded-xl md:rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:border-primary/50 hover:bg-white transition-all group"
                                        >
                                            <span className="text-[9px] md:text-[11px] font-black text-black uppercase tracking-widest group-hover:text-primary transition-colors text-center">
                                                {category.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </CommandGroup>
                        </div>
                    )}
                </CommandList>
            </div>
        </CommandDialog>
    );
}
