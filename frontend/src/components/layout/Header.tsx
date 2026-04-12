import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import CategorySidebar from '@/components/home/CategorySidebar';
import SearchDialog from '@/components/shared/SearchDialog';
import UserDropdown from '@/components/layout/UserDropdown';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const mainCategories = categories.slice(0, 5);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const headerBg = isScrolled ? 'bg-black/95 backdrop-blur-md border-zinc-900' : 'bg-white border-zinc-100';
  const iconColor = isScrolled ? 'text-primary' : 'text-zinc-800';
  const inputBg = isScrolled ? 'bg-zinc-900 border-primary/30 text-white placeholder:text-zinc-500' : 'bg-zinc-50 border-zinc-100 text-black';
  const logoBrightness = isScrolled ? 'brightness-0 invert' : '';

  return (
    <>
      <header className={cn('w-full transition-all duration-300 lg:sticky lg:top-0 z-50 border-b', headerBg)}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile: category grid icon */}
            <div className="flex items-center gap-1 lg:hidden">
              <Button variant="ghost" size="icon" className={cn(iconColor)} onClick={() => setIsCategoryOpen(true)}>
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center group relative lg:mr-auto pl-2 md:pl-0">
              <img
                src="/images/teklito-logo.webp"
                alt="TEKLITO Logo"
                width={110}
                height={36}
                className={cn('h-8 md:h-9 w-auto object-contain transition-all duration-300', logoBrightness)}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 mx-8 uppercase">
              {[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }].map(({ label, to }) => (
                <Link key={to} to={to} className={cn('px-4 py-2 text-[12px] font-bold tracking-wider transition-colors relative group', isScrolled ? 'text-zinc-300 hover:text-primary' : 'text-zinc-500 hover:text-black')}>
                  {label}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
              {mainCategories.map((cat) => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className={cn('px-4 py-2 text-[12px] font-bold tracking-wider transition-colors relative group', isScrolled ? 'text-zinc-300 hover:text-primary' : 'text-zinc-500 hover:text-black')}>
                  {cat.name}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Mobile search icon */}
              <Button variant="ghost" size="icon" className={cn('lg:hidden', iconColor)} onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>

              {/* Desktop search bar */}
              <div className="hidden md:block relative mr-2">
                <Button
                  variant="ghost"
                  className={cn('w-64 justify-start text-left font-normal h-10 px-4 rounded-[5px] border transition-all hover:bg-transparent', inputBg)}
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className={cn('mr-2 h-4 w-4', isScrolled ? 'text-primary' : 'text-zinc-400')} />
                  <span className={isScrolled ? 'text-zinc-400' : 'text-zinc-500'}>Search products...</span>
                </Button>
              </div>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className={cn('hidden lg:flex relative h-10 w-10 hover:bg-transparent', iconColor)} asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[8px] items-center justify-center text-black font-black">{wishlistCount}</span>
                    </span>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className={cn('hidden lg:flex relative h-10 w-10 hover:bg-transparent', iconColor)} asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[8px] items-center justify-center text-black font-black">{cartCount}</span>
                    </span>
                  )}
                </Link>
              </Button>

              {/* User */}
              <div className={cn('flex items-center', isScrolled ? 'text-primary' : '')}>
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>

        <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} categories={categories} />
        <CategorySidebar isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} categories={categories} />
      </header>
    </>
  );
}
