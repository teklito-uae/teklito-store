'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/product/ProductGrid';
import { searchProducts } from '@/lib/data/products';
import { Product } from '@/lib/types';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Product[]>([]);

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery);
        }
    }, [initialQuery]);

    const performSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            const searchResults = searchProducts(searchQuery);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Search Products</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="relative max-w-2xl">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for products..."
                        className="pl-10 pr-24 h-12 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2">
                        Search
                    </Button>
                </div>
            </form>

            {/* Results */}
            {initialQuery && (
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        {results.length} {results.length === 1 ? 'result' : 'results'} for "{initialQuery}"
                    </p>
                </div>
            )}

            <ProductGrid
                products={results}
                emptyMessage={initialQuery ? `No products found for "${initialQuery}"` : 'Enter a search query to find products'}
            />
        </div>
    );
}
