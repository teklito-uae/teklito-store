'use client';

import { useState, useEffect } from 'react';
import ProductImage from './ProductImage';
import Link from 'next/link';
import {
    Heart,
    ShoppingCart,
    Star,
    ChevronRight,
    ShieldCheck,
    Truck,
    RotateCcw,
    Minus,
    Plus,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ProductCard from '@/components/product/ProductCard';
import { addToCart } from '@/lib/store/cart';
import { toggleWishlist, isInWishlist } from '@/lib/store/wishlist';
import { toast } from 'sonner';
import { Product } from '@/lib/types';
import { getImageUrl, getAllImages } from '@/lib/utils/image';

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
    const [mainImage, setMainImage] = useState(getImageUrl(product.images, 0));
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [inWishlist, setInWishlist] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setInWishlist(isInWishlist(product.id));

        // Initialize variants
        const initialVariants: Record<string, string> = {};
        product.variants?.forEach(v => {
            if (v.options.length > 0) {
                initialVariants[v.type] = v.options[0].value;
            }
        });
        setSelectedVariants(initialVariants);

        // Scroll listener for sticky CTA
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [product]);

    const handleAddToCart = () => {
        addToCart(product.id, quantity);
        toast.success('Added to cart!', {
            description: `${product.name} added to your bag.`,
        });
    };

    const handleToggleWishlist = () => {
        const added = toggleWishlist(product.id);
        setInWishlist(added);
        if (added) {
            toast.success('Added to wishlist!');
        } else {
            toast.info('Removed from wishlist');
        }
    };

    return (
        <div className="bg-white min-h-screen pb-24 lg:pb-0">
            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Desktop Breadcrumbs */}
                <nav className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-12">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-zinc-900">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 relative">
                    {/* LEFT COLUMN: Image Gallery */}
                    <div className="w-full lg:w-[60%] flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
                        {/* Thumbnails Grid (Left Side on Desktop) */}
                        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 lg:h-[600px] scrollbar-hide shrink-0">
                            {getAllImages(product.images).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-20 h-20 lg:w-24 lg:h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${mainImage === img
                                        ? 'border-black'
                                        : 'border-transparent hover:border-zinc-200 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <ProductImage src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="relative flex-1 aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] flex items-center justify-center p-4 lg:p-8">
                            <ProductImage
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-contain transition-transform duration-700 hover:scale-105"
                                priority
                            />
                            {product.discount && (
                                <div className="absolute top-4 left-4 lg:top-8 lg:left-8 bg-black text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest z-10">
                                    -{product.discount}% OFF
                                </div>
                            )}
                            <button
                                onClick={handleToggleWishlist}
                                className="absolute top-4 right-4 lg:top-8 lg:right-8 p-3 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-all z-10"
                            >
                                <Heart className={`h-6 w-6 transition-colors ${inWishlist ? 'fill-black text-black' : 'text-zinc-400 hover:text-black'}`} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Info */}
                    <div className="w-full lg:w-[40%] flex flex-col gap-10">
                        <div className="lg:sticky lg:top-32 space-y-10">
                            {/* Product Title & Rating (Desktop) */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-none font-black uppercase tracking-widest text-[9px] px-3 py-1 rounded-full">
                                        {product.category}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? 'fill-black text-black' : 'fill-zinc-200 text-zinc-200'}`} />
                                        ))}
                                        <span className="text-[10px] font-black text-zinc-400 ml-2 uppercase tracking-widest">{product.reviewCount || 0} Reviews</span>
                                    </div>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase leading-tight text-zinc-900">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <span className="text-3xl font-bold tracking-tight text-zinc-900">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-red-500 uppercase tracking-widest">Sale</span>
                                            <span className="text-lg text-zinc-300 line-through font-bold">${product.originalPrice.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator className="bg-zinc-100" />

                            {/* Variants & Interaction */}
                            <div className="space-y-10">
                                {product.variants?.map((variant) => (
                                    <div key={variant.type} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{variant.name}</h3>
                                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">{selectedVariants[variant.type]}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {variant.options.map((option) => {
                                                const isColor = variant.type === 'color';
                                                const isSelected = selectedVariants[variant.type] === option.value;

                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.type]: option.value }))}
                                                        disabled={!option.inStock}
                                                        className={`relative transition-all duration-300 ${isColor
                                                            ? `h-10 w-10 rounded-full border-2 ${isSelected ? 'border-primary p-0.5' : 'border-transparent hover:border-zinc-200'} `
                                                            : `px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest ${isSelected
                                                                ? 'border-primary bg-primary text-black shadow-[0_10px_20px_rgba(199,245,2,0.2)]'
                                                                : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'
                                                            }`
                                                            } group disabled:opacity-30 disabled:cursor-not-allowed`}
                                                    >
                                                        {isColor ? (
                                                            <div
                                                                className="w-full h-full rounded-full border border-black/5"
                                                                style={{ backgroundColor: option.value }}
                                                            >
                                                                {isSelected && <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />}
                                                            </div>
                                                        ) : (
                                                            option.label
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center h-14 bg-zinc-50 rounded-xl border border-zinc-100 px-2">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-zinc-600"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(q => q + 1)}
                                                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-zinc-600"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                            className="h-14 flex-1 bg-black hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-black/10 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </Button>
                                    </div>
                                </div>
                            </div>


                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 hover:bg-primary transition-colors cursor-default">
                                        <Truck className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 cursor-default">
                                        <ShieldCheck className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 cursor-default">
                                        <RotateCcw className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-40">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-zinc-100 pb-12">
                            <div className="space-y-4">
                                <h2 className="text-h2 font-bold uppercase tracking-tight leading-tight">
                                    More to <span className="text-primary italic">Explore</span>
                                </h2>
                                <p className="text-zinc-400 text-sm uppercase tracking-widest font-bold">Recommended based on your style</p>
                            </div>
                            <Link
                                href="/products"
                                className="h-14 px-10 flex items-center justify-center rounded-2xl border-2 border-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
                            >
                                View Everything
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 xl:gap-12">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* STICKY BOTTOM BAR (Desktop & Mobile) */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-zinc-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isScrolled ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">

                    {/* Product Info (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                            <ProductImage src={mainImage} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold text-zinc-900 line-clamp-1">{product.name}</h3>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                {Object.values(selectedVariants).filter(Boolean).join(' / ')}
                            </span>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center gap-4 flex-1 md:flex-none justify-between md:justify-end">
                        <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest md:hidden">Total</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg md:text-xl font-black text-zinc-900">${(product.price * quantity).toFixed(2)}</span>
                                {product.originalPrice && (
                                    <span className="text-xs text-zinc-400 line-through decoration-zinc-300 hidden md:inline-block">
                                        ${(product.originalPrice * quantity).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Quantity (Hidden on tiny screens) */}
                            <div className="hidden sm:flex items-center h-10 bg-zinc-50 rounded-lg border border-zinc-200/50 px-1">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-8 w-8 flex items-center justify-center hover:bg-white rounded transition-colors" disabled={quantity <= 1}>
                                    <Minus className="h-3 w-3 text-zinc-600" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-white rounded transition-colors">
                                    <Plus className="h-3 w-3 text-zinc-600" />
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
