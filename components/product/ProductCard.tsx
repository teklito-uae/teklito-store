'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/store/cart';
import { toggleWishlist, isInWishlist } from '@/lib/store/wishlist';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [inWishlist, setInWishlist] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setInWishlist(isInWishlist(product.id));

        const handleWishlistUpdate = () => {
            setInWishlist(isInWishlist(product.id));
        };

        window.addEventListener('wishlist-updated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    }, [product.id]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(product.id, 1);
        toast.success('Added to cart!', {
            description: `${product.name} has been added to your cart.`,
        });
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        const added = toggleWishlist(product.id);
        if (added) {
            toast.success('Added to wishlist!');
        } else {
            toast.info('Removed from wishlist');
        }
    };

    // Calculate discount percentage if not provided
    const displayDiscount = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null);

    return (
        <Card className="group overflow-hidden bg-white border border-zinc-100 shadow-none hover:shadow-md transition-all duration-300 rounded-[1.25rem] flex flex-col h-full relative">
            <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden p-2">
                    {/* Best Seller / Badge Area */}
                    <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                        {product.rating >= 4.7 && (
                            <div className="bg-[#005a5a] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                                Best Seller
                            </div>
                        )}
                        {product.inStock && product.stock < 10 && (
                            <div className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                                Only {product.stock} Left
                            </div>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        className="absolute top-3 right-3 z-30 p-1.5 transition-colors"
                        onClick={handleToggleWishlist}
                    >
                        <Heart className={cn("h-5 w-5 transition-all", inWishlist ? 'fill-zinc-800 text-zinc-800' : 'text-zinc-300 hover:text-zinc-500')} strokeWidth={1.5} />
                    </button>

                    {/* Product Image */}
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <Image
                            src={product.images[currentImageIndex] || '/images/placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 768px) 50vw, 20vw"
                        />
                    </div>

                    {/* Pagination Dots (Simplified) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                        {product.images.slice(0, 5).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1 rounded-full transition-all",
                                    currentImageIndex === i ? "w-2 bg-zinc-800" : "w-1 bg-zinc-200"
                                )}
                            />
                        ))}
                    </div>

                    {/* Add Button Overlay */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-3 right-3 z-30 h-8 w-8 bg-white border border-zinc-100 shadow-sm rounded-lg flex items-center justify-center text-zinc-800 hover:bg-zinc-50 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                {/* Info Section */}
                <CardContent className="p-3 pt-0 flex flex-col flex-1 gap-1.5">
                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-zinc-800 line-clamp-2 leading-tight min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    {/* Rating Pill */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5 bg-zinc-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-600 border border-zinc-100">
                            <Star className="h-3 w-3 fill-green-500 text-green-500" />
                            {product.rating}
                            <span className="text-zinc-300 font-normal ml-0.5">({product.reviewCount || 0})</span>
                        </div>
                    </div>

                    {/* Price & Discount */}
                    <div className="mt-auto space-y-0.5">
                        <div className="flex items-baseline gap-1.5 leading-none">
                            <span className="text-[10px] font-bold text-black">AED</span>
                            <span className="text-lg font-black text-black">
                                {product.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                            </span>
                            {product.originalPrice && (
                                <span className="text-[10px] text-zinc-400 line-through">
                                    {product.originalPrice.toFixed(0)}
                                </span>
                            )}
                            {displayDiscount && (
                                <span className="text-[10px] font-bold text-green-600">
                                    {displayDiscount}% OFF
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Trust Labels / Badges at bottom */}
                    <div className="flex flex-col gap-1 mt-1">
                        {/* Attributes/Specs short text */}
                        <p className="text-[10px] text-zinc-400 font-medium">
                            {product.categorySlug === 'phone-cases' ? 'Premium Grade' :
                                product.categorySlug === 'watches' ? 'Original Protocol' : 'Verified Device'}
                        </p>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
