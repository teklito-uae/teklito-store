'use client';

import { useState, useMemo } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
    SlidersHorizontal,
    X,
    Search,
    ChevronRight,
    Star
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Product, Category } from '@/lib/types';

interface ProductArchiveProps {
    initialProducts: Product[];
    categories: Category[];
}

export default function ProductArchive({ initialProducts, categories }: ProductArchiveProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [minRating, setMinRating] = useState(0);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || product.categorySlug === selectedCategory;
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
            const matchesRating = (product.rating || 0) >= minRating;
            return matchesSearch && matchesCategory && matchesPrice && matchesRating;
        });
    }, [searchQuery, selectedCategory, priceRange, minRating, initialProducts]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setPriceRange([0, 5000]);
        setMinRating(0);
    };

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Search */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Search</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 bg-zinc-50 border-none rounded-[5px]"
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Categories</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-[5px] transition-all ${!selectedCategory
                            ? 'bg-primary text-black font-bold'
                            : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                            }`}
                    >
                        <span>All Categories</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-[5px] transition-all ${selectedCategory === cat.slug
                                ? 'bg-primary text-black font-bold'
                                : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                                }`}
                        >
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Price Range</h3>
                    <span className="text-xs font-bold text-primary bg-black px-2 py-1 rounded-[5px]">AED {priceRange[0]} - {priceRange[1]}</span>
                </div>
                <Slider
                    defaultValue={[0, 5000]}
                    max={5000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                />
            </div>

            {/* Rating */}
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Min Rating</h3>
                <div className="flex bg-white p-1 rounded-[5px] border border-zinc-100">
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setMinRating(rating)}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-[5px] transition-all ${minRating === rating
                                ? 'bg-black text-primary'
                                : 'bg-transparent text-zinc-400 hover:text-black'
                                }`}
                        >
                            <span className="text-xs font-black mb-0.5">{rating === 0 ? 'All' : rating}</span>
                            {rating > 0 && (
                                <Star className={`h-2.5 w-2.5 ${minRating === rating ? 'fill-primary' : 'fill-zinc-200'}`} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {(searchQuery || selectedCategory || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 5000) && (
                <Button
                    variant="ghost"
                    onClick={resetFilters}
                    className="w-full text-zinc-400 hover:text-red-500 gap-2 h-11"
                >
                    <X className="h-4 w-4" />
                    Reset All Filters
                </Button>
            )}
        </div>
    );

    return (
        <div className="bg-zinc-50/30 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-72 shrink-0 sticky top-32 h-fit bg-white p-8 rounded-[5px] border border-zinc-100/50">
                        <FilterContent />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">

                            {/* Mobile Filters Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden h-12 rounded-[5px] border-zinc-200 px-6 gap-2">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-full sm:w-[400px] bg-white p-0 flex flex-col">
                                    <SheetHeader className="p-8 border-b border-zinc-100 flex-row items-center justify-between space-y-0">
                                        <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter">Filter Catalogue</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto p-8">
                                        <FilterContent />
                                    </div>
                                    <div className="p-8 border-t border-zinc-100">
                                        <Button
                                            className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest rounded-[5px]"
                                            onClick={() => document.querySelector<HTMLButtonElement>('[data-slot="sheet-close"]')?.click()}
                                        >
                                            Show {filteredProducts.length} Results
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid products={filteredProducts} />
                    </div>
                </div>
            </div>
        </div>
    );
}
