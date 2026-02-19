'use client';

import { useState, useEffect, useRef } from 'react';
import ProductImage from './ProductImage';
import Link from 'next/link';
import {
    Heart,
    Star,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Truck,
    RotateCcw,
    Minus,
    Plus,
    Share2,
    Info,
    ShoppingCart
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
import { addToCart, updateQuantity, getCart } from '@/lib/store/cart';
import { toggleWishlist, isInWishlist } from '@/lib/store/wishlist';
import { toast } from 'sonner';
import { Product } from '@/lib/types';
import { getImageUrl, getAllImages } from '@/lib/utils/image';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
    const [mainImage, setMainImage] = useState(getImageUrl(product.images, 0));
    const [inWishlist, setInWishlist] = useState(false);
    const [isNameExpanded, setIsNameExpanded] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [cartItem, setCartItem] = useState<{ quantity: number } | null>(null);
    const [showStickyAdd, setShowStickyAdd] = useState(false);

    const mainActionRef = useRef<HTMLDivElement>(null);

    // Sync with cart state
    useEffect(() => {
        const checkCart = () => {
            const cart = getCart();
            const item = cart.items.find(i => i.productId === product.id);
            setCartItem(item ? { quantity: item.quantity } : null);
        };

        checkCart();
        window.addEventListener('cart-updated', checkCart);
        return () => window.removeEventListener('cart-updated', checkCart);
    }, [product.id]);

    useEffect(() => {
        setInWishlist(isInWishlist(product.id));
        setMainImage(getImageUrl(product.images, 0));

        // Initialize variants
        const initialVariants: Record<string, string> = {};
        product.variants?.forEach(v => {
            if (v.options.length > 0) {
                initialVariants[v.type] = v.options[0].value;
            }
        });
        setSelectedVariants(initialVariants);
    }, [product]);

    // Intersection Observer for Sticky Button
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If main action is NOT in view, show sticky
                setShowStickyAdd(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (mainActionRef.current) {
            observer.observe(mainActionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleAddToCart = () => {
        addToCart(product.id, 1, selectedVariants);
        toast.success('Added to cart!', {
            description: `${product.name} added to your bag.`,
        });
    };

    const handleUpdateQuantity = (newQty: number) => {
        updateQuantity(product.id, newQty, selectedVariants);
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

    const formatPrice = (price: number) => {
        return `AED ${price.toFixed(2)}`;
    };

    return (
        <div className="bg-[#FAFAFA] min-h-screen font-poppins pb-20 overflow-x-hidden">
            {/* Breadcrumbs - REMOVED PRODUCT NAME */}
            <div className="container mx-auto px-4 py-6">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/products" className="hover:text-primary transition-colors">Store</Link>
                </nav>
            </div>

            <main className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

                    {/* COLUMN 1: Image Gallery (32%) - MINIMALIST */}
                    <div className="w-full lg:w-[32%] space-y-6">
                        <div className="relative aspect-square overflow-hidden bg-white rounded-[5px] border border-zinc-100 p-4">
                            <ProductImage
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-500"
                                priority
                            />
                            <button
                                onClick={handleToggleWishlist}
                                className="absolute top-4 right-4 p-2.5 bg-zinc-50/80 backdrop-blur-md rounded-[5px] border border-zinc-100 hover:bg-white transition-all shadow-sm"
                            >
                                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
                            </button>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {getAllImages(product.images).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-16 h-16 shrink-0 rounded-[5px] overflow-hidden border transition-all ${mainImage === img ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-400'
                                        } p-1.5`}
                                >
                                    <ProductImage src={img} alt={`${product.name} ${idx}`} fill className="object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* COLUMN 2: Product Info (46%) */}
                    <div className="w-full lg:w-[46%] space-y-8 lg:pt-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge className="bg-zinc-900 text-white border-none font-black uppercase tracking-widest text-[8px] px-3 py-1.5 rounded-[5px]">
                                    {product.category}
                                </Badge>
                                {product.inStock ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black uppercase tracking-widest text-[8px] px-3 py-1.5 rounded-[5px]">
                                        In Stock
                                    </Badge>
                                ) : (
                                    <Badge className="bg-red-50 text-red-600 border-none font-black uppercase tracking-widest text-[8px] px-3 py-1.5 rounded-[5px]">
                                        Out of Stock
                                    </Badge>
                                )}
                            </div>

                            <div className="relative group">
                                <h1 className={`text-lg md:text-xl font-semibold uppercase tracking-tight leading-tight text-zinc-900 transition-all ${!isNameExpanded && "line-clamp-2"
                                    }`}>
                                    {product.name}
                                </h1>
                                {product.name.length > 60 && (
                                    <button
                                        onClick={() => setIsNameExpanded(!isNameExpanded)}
                                        className="inline-flex items-center mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                                    >
                                        {isNameExpanded ? (
                                            <>Show Less <ChevronUp className="ml-1 h-3 w-3" /></>
                                        ) : (
                                            <>Show More <ChevronDown className="ml-1 h-3 w-3" /></>
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <div className="flex items-center opacity-30">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-200'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-zinc-400">({product.reviewCount || 0} Customer Reviews)</span>
                            </div>

                            <div className="flex items-baseline gap-4 pt-2">
                                <span className="text-4xl font-black tracking-tighter text-zinc-900">
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-zinc-300 line-through font-bold">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <Separator className="bg-zinc-100" />

                        {/* Variants */}
                        <div className="space-y-8">
                            {product.variants?.map((variant) => (
                                <div key={variant.type} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">{variant.name}</h3>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{selectedVariants[variant.type]}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {variant.options.map((option) => {
                                            const isItemSelected = selectedVariants[variant.type] === option.value;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.type]: option.value }))}
                                                    className={`px-6 py-3 rounded-[5px] border-2 text-[10px] font-black uppercase tracking-widest transition-all ${isItemSelected
                                                        ? "border-black bg-black text-white"
                                                        : "border-zinc-100 bg-white text-zinc-400 hover:border-zinc-200"
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Overview / Internal Links */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-[5px] border border-zinc-100 shrink-0">
                                <div className="h-10 w-10 flex items-center justify-center bg-zinc-50 rounded-[5px]">
                                    <Truck className="h-5 w-5 text-zinc-900" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase">Standard Shipping</p>
                                    <p className="text-[10px] text-zinc-400 font-bold">2-3 Business Days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-[5px] border border-zinc-100 shrink-0">
                                <div className="h-10 w-10 flex items-center justify-center bg-zinc-50 rounded-[5px]">
                                    <RotateCcw className="h-5 w-5 text-zinc-900" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase">14-Day Returns</p>
                                    <p className="text-[10px] text-zinc-400 font-bold">Easy & Fast</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 3: Sidebar Action (22%) - MINIMALIST */}
                    <div className="w-full lg:w-[22%]">
                        <div className="lg:sticky lg:top-32 space-y-8">
                            <div className="space-y-8">
                                {/* Related Tags - THIN STROKED GRAY LAYOUT */}
                                <div className="border border-zinc-200 rounded-[5px] p-6 bg-white/50">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 ml-1">Related Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags?.slice(0, 5).map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-zinc-50/50 text-[9px] font-bold text-zinc-600 rounded-[5px] border border-zinc-100 uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Seller Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 ml-1">Sold By</h3>
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-[5px] border border-zinc-100 hover:border-zinc-200 transition-colors">
                                        <div className="h-12 w-12 bg-zinc-900 text-white rounded-[5px] flex items-center justify-center font-black text-lg">T</div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight">Teklito</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-[10px] font-black text-zinc-900">4.8</span>
                                                <span className="text-[10px] font-bold text-zinc-400">Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Action Button - 5PX RADIUS */}
                                <div className="pt-2" ref={mainActionRef}>
                                    {cartItem ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between h-16 bg-white rounded-[5px] border border-zinc-100 px-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                                                    className="h-12 w-12 flex items-center justify-center bg-zinc-50 rounded-[5px] border border-zinc-100 hover:bg-zinc-100 transition-all text-zinc-900"
                                                >
                                                    <Minus className="h-5 w-5" />
                                                </button>
                                                <span className="text-lg font-black">{cartItem.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                                                    className="h-12 w-12 flex items-center justify-center bg-zinc-50 rounded-[5px] border border-zinc-100 hover:bg-zinc-100 transition-all text-zinc-900"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <Button className="w-full h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 font-black uppercase tracking-widest text-[10px] rounded-[5px] cursor-default active:scale-100">
                                                Item In Your Bag
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                            className="w-full h-16 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] rounded-[5px] transition-all active:scale-95 group"
                                        >
                                            Add to Cart
                                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                                <Share2 className="h-3 w-3" /> Share Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION - REFINED STYLING */}
                <div className="mt-28 md:mt-36">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-transparent border-b border-zinc-100 w-full justify-start rounded-none h-auto p-0 gap-4 flex-nowrap overflow-x-auto scrollbar-hide">
                            <TabsTrigger
                                value="overview"
                                className="px-8 py-3 bg-transparent border-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-white data-[state=active]:text-black text-xs md:text-sm font-black uppercase tracking-[0.15em] text-zinc-400 rounded-[5px] transition-all whitespace-nowrap"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="description"
                                className="px-8 py-3 bg-transparent border-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-white data-[state=active]:text-black text-xs md:text-sm font-black uppercase tracking-[0.15em] text-zinc-400 rounded-[5px] transition-all whitespace-nowrap"
                            >
                                Detailed Specifications
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="pt-12">
                            <div className="max-w-4xl space-y-8">
                                <div className="p-8 bg-white border border-zinc-100 rounded-[5px]">
                                    <p className="text-black font-medium leading-loose text-[13px] md:text-sm font-poppins">
                                        {product.description?.replace(/<[^>]*>?/gm, '').split('.')[0]}. Experience a new era of technology with our curated product selection.
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4 p-8 bg-white border border-zinc-100 rounded-[5px]">
                                        <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            <Info className="h-4 w-4" /> Material & Quality
                                        </h4>
                                        <p className="text-[11px] text-zinc-600 font-bold uppercase leading-relaxed tracking-wider">
                                            Premium build quality using eco-friendly materials designed for long-lasting durability and performance.
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-8 bg-white border border-zinc-100 rounded-[5px]">
                                        <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" /> Official Warranty
                                        </h4>
                                        <p className="text-[11px] text-zinc-600 font-bold uppercase leading-relaxed tracking-wider">
                                            All Teklito products come with an official 1-year manufacturer warranty covering technical defects.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="description" className="pt-12">
                            <div
                                className="prose prose-zinc prose-sm max-w-none border border-zinc-100 p-8 rounded-[5px] bg-white text-black font-poppins text-[13px] md:text-sm"
                            >
                                <div
                                    className="[&_*]:!text-black [&_*]:!font-poppins [&_*]:!text-[13px] md:[&_*]:!text-sm [&_h1]:!text-lg [&_h2]:!text-md [&_h3]:!text-base [&_h4]:!text-sm [&_h1,h2,h3,h4]:!font-black [&_h1,h2,h3,h4]:!uppercase [&_p]:!leading-loose"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 md:mt-48 pb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                                    You Might<br /><span className="text-zinc-300">Also Like</span>
                                </h2>
                                <div className="h-1.5 w-20 bg-black" />
                            </div>
                            <Link
                                href="/products"
                                className="text-[10px] font-black uppercase tracking-widest hover:underline"
                            >
                                Shop All Products →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* STICKY BOTTOM ACTION FOR MOBILE */}
            <div className={cn(
                "lg:hidden fixed bottom-[65px] left-0 right-0 z-[45] bg-white/80 backdrop-blur-md border-t border-zinc-100 p-4 transition-all duration-300 transform",
                showStickyAdd ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            )}>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-zinc-400 truncate">{product.name}</p>
                        <p className="text-sm font-black">{formatPrice(product.price)}</p>
                    </div>
                    {cartItem ? (
                        <div className="flex items-center bg-zinc-900 text-white rounded-[5px] px-2 h-12">
                            <button onClick={() => handleUpdateQuantity(cartItem.quantity - 1)} className="p-2"><Minus className="h-4 w-4" /></button>
                            <span className="w-8 text-center font-black">{cartItem.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(cartItem.quantity + 1)} className="p-2"><Plus className="h-4 w-4" /></button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] rounded-[5px] h-12 px-6"
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
