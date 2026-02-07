'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Heart,
    ShoppingCart,
    Star,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Truck,
    RotateCcw,
    Minus,
    Plus,
    Share2,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { products, getProductBySlug } from '@/lib/data/products';
import ProductCard from '@/components/product/ProductCard';
import { addToCart } from '@/lib/store/cart';
import { toggleWishlist, isInWishlist } from '@/lib/store/wishlist';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const product = getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const [mainImage, setMainImage] = useState(product.images[0]);
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

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

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
                    <div className="w-full lg:w-[60%] space-y-8">
                        {/* Main Image with Zoom Effect */}
                        <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square max-h-[600px] rounded-[2.5rem] overflow-hidden bg-zinc-50 border border-zinc-100 group">
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-contain p-8 md:p-12 transition-all duration-700 group-hover:scale-105"
                                priority
                            />
                            {product.discount && (
                                <div className="absolute top-8 left-8 bg-primary text-black text-[10px] font-black px-5 py-2.5 rounded-full shadow-[0_5px_15px_rgba(199,245,2,0.3)] uppercase tracking-widest">
                                    -{product.discount}% OFF
                                </div>
                            )}
                            <button
                                onClick={handleToggleWishlist}
                                className="absolute top-8 right-8 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:scale-110 transition-all active:scale-95 group/heart"
                            >
                                <Heart className={`h-6 w-6 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-zinc-400 group-hover/heart:text-red-400'}`} />
                            </button>
                        </div>

                        {/* Thumbnails Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative aspect-square rounded-3xl overflow-hidden border-2 transition-all duration-300 ${mainImage === img
                                        ? 'border-primary shadow-[0_10px_20px_rgba(199,245,2,0.2)] scale-95'
                                        : 'border-transparent opacity-50 hover:opacity-100 hover:scale-[1.02]'
                                        }`}
                                >
                                    <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Mobile Details (Below gallery on small screens) */}
                        <div className="lg:hidden space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-primary hover:bg-primary text-black font-black uppercase tracking-widest text-[9px] px-3 py-1 rounded-full">
                                    {product.category}
                                </Badge>
                                <h1 className="text-4xl font-black tracking-tighter uppercase leading-[0.9]">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-black tracking-tighter">${product.price.toFixed(2)}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-zinc-300 line-through font-bold">${product.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Info */}
                    <div className="w-full lg:w-[40%] flex flex-col gap-10">
                        <div className="lg:sticky lg:top-32 space-y-10">
                            {/* Product Title & Rating (Desktop) */}
                            <div className="hidden lg:block space-y-6">
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full">
                                        {product.category}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'fill-zinc-100 text-zinc-100'}`} />
                                        ))}
                                        <span className="text-[10px] font-black text-zinc-400 ml-2 uppercase tracking-widest">{product.reviewCount} Reviews</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase leading-tight text-black">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-6">
                                    <span className="text-3xl md:text-4xl font-bold tracking-tight text-black">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-primary uppercase tracking-widest">Sale</span>
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
                                        <div className="flex items-center h-16 bg-zinc-50 rounded-2xl border border-zinc-100 px-2">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="h-12 w-12 flex items-center justify-center rounded-xl hover:bg-white transition-colors"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(q => q + 1)}
                                                className="h-12 w-12 flex items-center justify-center rounded-xl hover:bg-white transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                            className="h-16 flex-1 bg-primary hover:bg-black text-black hover:text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-primary/20 transition-all transform active:scale-95 group"
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-3 transition-transform group-hover:rotate-12" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Tabs / Accordions */}
                            <Accordion type="single" collapsible className="w-full border-t border-zinc-100">
                                <AccordionItem value="details" className="border-b border-zinc-100">
                                    <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors py-6">
                                        Product Details
                                    </AccordionTrigger>
                                    <AccordionContent className="text-zinc-500 leading-relaxed text-sm pb-6">
                                        {product.description}
                                        <ul className="mt-4 space-y-2">
                                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary" /> Premium Build Quality</li>
                                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary" /> Ergonomic Modern Design</li>
                                            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary" /> 1-Year Limited Warranty</li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="shipping" className="border-b border-zinc-100">
                                    <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors py-6">
                                        Shipping & Returns
                                    </AccordionTrigger>
                                    <AccordionContent className="text-zinc-500 text-sm pb-6">
                                        <p>Free standard shipping on all orders over $150. Delivery typically takes 3-5 business days.</p>
                                        <p className="mt-2">30-day no-questions-asked return policy. Product must be in original packaging.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="reviews" className="border-b border-zinc-100">
                                    <AccordionTrigger className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors py-6">
                                        Customer Reviews
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-primary text-primary" />)}
                                                </div>
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verified Buyer</span>
                                            </div>
                                            <p className="text-sm italic text-zinc-600">"Absolutely love the design. The quality is even better than expected!"</p>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">- Alex R.</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-primary transition-colors">
                                        <Truck className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                        <ShieldCheck className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
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

            {/* MOBILE STICKY CTA */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-100 p-4 transition-transform duration-500 ${isScrolled ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total</p>
                        <p className="text-lg font-black">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        className="h-14 flex-[2] bg-primary hover:bg-black text-black hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg"
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}

