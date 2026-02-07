'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { getCartItemCount } from '@/lib/store/cart';
import { getWishlistCount } from '@/lib/store/wishlist';
import MobileSearchOverlay from './MobileSearchOverlay';
import CategorySidebar from '@/components/home/CategorySidebar';

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlistCount());

        const handleCartUpdate = () => setCartCount(getCartItemCount());
        const handleWishlistUpdate = () => setWishlistCount(getWishlistCount());

        window.addEventListener('cart-updated', handleCartUpdate);
        window.addEventListener('wishlist-updated', handleWishlistUpdate);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('wishlist-updated', handleWishlistUpdate);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="w-full bg-white text-black border-b border-zinc-100 lg:sticky lg:top-0 z-50">
            {/* Top Bar - Desktop Only */}
            <div className="hidden lg:block bg-zinc-50 border-b border-zinc-100">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                        <p className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Free shipping on orders over $100
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/track-order" className="hover:text-black">Track Order</Link>
                            <Link href="/help" className="hover:text-black">Help Center</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Mobile "All Categories" */}
                    <div className="flex items-center gap-1 lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-800"
                            onClick={() => setIsCategoryOpen(true)}
                        >
                            <LayoutGrid className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="flex items-center group relative lg:mr-auto pl-2 md:pl-0">
                        <Image
                            src="/images/teklito-logo.webp"
                            alt="TEKLITO Logo"
                            width={110}
                            height={36}
                            className="h-8 md:h-9 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 mx-8">
                        {[
                            { label: 'Home', href: '/' },
                            { label: 'Products', href: '/products' },
                            { label: 'Cases', href: '/category/phone-cases' },
                            { label: 'Watches', href: '/category/watches' },
                            { label: 'Mobiles', href: '/category/mobiles' },
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors relative group"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 lg:gap-2">
                        {/* Mobile Search Trigger (Right Side) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-zinc-800"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Desktop Search */}
                        <div className="hidden md:block relative mr-2">
                            <form onSubmit={handleSearch} className="flex">
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="h-10 w-48 lg:w-64 bg-zinc-50 border-zinc-100 text-[12px] rounded-xl pl-4 pr-10 focus-visible:ring-primary/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button size="icon" variant="ghost" className="absolute right-0 h-10 w-10 text-zinc-400">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Wishlist */}
                        <Button variant="ghost" size="icon" className="hidden lg:flex relative text-zinc-800 h-10 w-10" asChild>
                            <Link href="/wishlist">
                                <Heart className="h-5 w-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4">
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[8px] items-center justify-center text-black font-black">
                                            {wishlistCount}
                                        </span>
                                    </span>
                                )}
                            </Link>
                        </Button>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" className="hidden lg:flex relative text-zinc-800 h-10 w-10" asChild>
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4">
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[8px] items-center justify-center text-black font-black">
                                            {cartCount}
                                        </span>
                                    </span>
                                )}
                            </Link>
                        </Button>

                        <Button variant="ghost" size="icon" className="hidden lg:flex h-10 w-10 p-0 overflow-hidden rounded-full border border-zinc-100 hover:border-black transition-all" asChild>
                            <Link href="/profile">
                                <Image
                                    src="/images/user-avatar/1.svg"
                                    alt="User Avatar"
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <MobileSearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            <CategorySidebar
                isOpen={isCategoryOpen}
                onClose={() => setIsCategoryOpen(false)}
            />
        </header>
    );
}
