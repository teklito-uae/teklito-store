'use client';

import Link from 'next/link';
import { Home, LayoutGrid, Gift, User, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { getCartItemCount } from '@/lib/store/cart';
import { cn } from '@/lib/utils';

export default function MobileNav() {
    const pathname = usePathname();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setCartCount(getCartItemCount());

        const handleCartUpdate = () => setCartCount(getCartItemCount());
        window.addEventListener('cart-updated', handleCartUpdate);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
        };
    }, []);

    const navItems = [
        { href: '/', icon: Home, label: 'Home', color: 'text-blue-600' },
        { href: '/categories', icon: LayoutGrid, label: 'Categories', color: 'text-zinc-600' },
        { href: '/products?filter=offers', icon: Gift, label: 'Offers', color: 'text-orange-500' },
        { href: '/profile', icon: User, label: 'My Account', color: 'text-zinc-600' },
        { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount, color: 'text-zinc-600' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white">
            <div className="flex items-center justify-around h-[65px] pb-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative"
                        >
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-all duration-300",
                                        isActive ? "text-blue-600 fill-blue-50/50" : "text-zinc-400"
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {typeof item.badge === 'number' && (
                                    <Badge
                                        variant="default"
                                        className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center p-0.5 text-[9px] bg-[#D4FF00] text-black font-black border border-black/10 rounded-full shadow-sm"
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-bold tracking-tight transition-colors duration-300",
                                    isActive ? "text-blue-600" : "text-zinc-400"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
