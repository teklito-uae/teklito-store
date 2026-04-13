import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { useSearchStore } from '@/lib/store/search';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Search', to: '/search', icon: Search },
  { label: 'Cart', to: '/cart', icon: ShoppingCart, badge: true, badgeType: 'cart' as const },
  { label: 'Wishlist', to: '/wishlist', icon: Heart, badge: true, badgeType: 'wishlist' as const },
  { label: 'Account', to: '/profile', icon: User },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const openSearch = useSearchStore((s) => s.openSearch);

  const getBadge = (badgeType?: 'cart' | 'wishlist') => {
    if (badgeType === 'cart') return cartCount;
    if (badgeType === 'wishlist') return wishlistCount;
    return 0;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ label, to, icon: Icon, badge, badgeType }) => {
          const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
          const count = badge ? getBadge(badgeType) : 0;

          return (
            <Link
              key={to}
              to={to}
              onClick={(e) => {
                if (label === 'Search') {
                  e.preventDefault();
                  openSearch();
                }
              }}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative',
                isActive ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5', isActive && 'text-primary')} strokeWidth={isActive ? 2.5 : 2} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[8px] font-black text-black flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>
              <span className={cn('text-[9px] font-bold uppercase tracking-wider', isActive ? 'text-black' : 'text-zinc-400')}>
                {label}
              </span>
              {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
