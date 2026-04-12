import { Link } from 'react-router-dom';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Smartphone, Laptop, Headphones, Tablet, Watch, Gamepad2,
  Camera, Cable, Home, Monitor, Zap, Wifi,
  Package, ShoppingBag, Shirt, Music, Tv,
  Speaker, MousePointer, Keyboard, HardDrive,
  type LucideIcon,
} from 'lucide-react';

// ── Icon registry ─────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone, Laptop, Headphones, Tablet, Watch, Gamepad2,
  Camera, Cable, Home, Monitor, Zap, Wifi,
  Package, ShoppingBag, Shirt, Music, Tv,
  Speaker, MousePointer, Keyboard, HardDrive,
};

// ── Accent colour per icon ─────────────────────────────────────
const ICON_COLORS: Record<string, { bg: string; icon: string }> = {
  Smartphone:  { bg: 'bg-blue-50',    icon: 'text-blue-500' },
  Laptop:      { bg: 'bg-violet-50',  icon: 'text-violet-500' },
  Headphones:  { bg: 'bg-rose-50',    icon: 'text-rose-500' },
  Tablet:      { bg: 'bg-sky-50',     icon: 'text-sky-500' },
  Watch:       { bg: 'bg-amber-50',   icon: 'text-amber-500' },
  Gamepad2:    { bg: 'bg-green-50',   icon: 'text-green-500' },
  Camera:      { bg: 'bg-orange-50',  icon: 'text-orange-500' },
  Cable:       { bg: 'bg-zinc-100',   icon: 'text-zinc-500' },
  Home:        { bg: 'bg-teal-50',    icon: 'text-teal-500' },
  Monitor:     { bg: 'bg-indigo-50',  icon: 'text-indigo-500' },
  Zap:         { bg: 'bg-yellow-50',  icon: 'text-yellow-500' },
  Wifi:        { bg: 'bg-cyan-50',    icon: 'text-cyan-500' },
};
const DEFAULT_COLOR = { bg: 'bg-zinc-100', icon: 'text-zinc-400' };

interface CategoryGridProps {
  categories: Category[];
}

function CategoryItem({ cat }: { cat: Category }) {
  const Icon = cat.icon ? ICON_MAP[cat.icon] : null;
  const c = (cat.icon && ICON_COLORS[cat.icon]) ? ICON_COLORS[cat.icon] : DEFAULT_COLOR;

  return (
    <Link
      to={`/category/${cat.slug}`}
      className="flex flex-col items-center gap-2 group"
    >
      {/* Icon box — matches reference square style */}
      <div
        className={cn(
          'w-full aspect-square rounded-2xl flex items-center justify-center',
          'transition-all duration-200',
          c.bg,
          'group-hover:scale-95 group-hover:shadow-md group-hover:shadow-black/5',
          'border border-transparent group-hover:border-primary/20'
        )}
      >
        {Icon ? (
          <Icon
            className={cn('h-6 w-6 md:h-7 md:w-7 transition-transform duration-200', c.icon)}
            strokeWidth={1.75}
          />
        ) : (
          <span className={cn('text-xl font-black', c.icon)}>{cat.name[0]}</span>
        )}
      </div>

      {/* Name */}
      <span className="text-[10px] md:text-[11px] font-bold text-zinc-600 group-hover:text-black transition-colors text-center leading-tight line-clamp-2 w-full">
        {cat.name}
      </span>
    </Link>
  );
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const topLevel = categories.filter((c) => !c.parentId);
  
  if (topLevel.length === 0) return null;

  // On desktop, we want 10 items + 1 "All" button
  const desktopItems = topLevel.slice(0, 10);
  // On mobile we want the first 8 to make 2 rows of 4
  const mobileItems = topLevel.slice(0, 8);

  return (
    <div className="p-4 md:p-6">
      
      {/* ── Mobile View: 4x2 Grid ── */}
      <div className="grid grid-cols-4 gap-3 md:hidden">
        {mobileItems.map((cat) => (
          <CategoryItem key={cat.id} cat={cat} />
        ))}
      </div>

      {/* ── Desktop View: Single Row of 10 + "View All" ── */}
      <div className="hidden md:flex items-start justify-between gap-2 overflow-x-auto scrollbar-hide pb-2">
        {desktopItems.map((cat) => (
          <div key={cat.id} className="w-[84px] flex-shrink-0">
            <CategoryItem cat={cat} />
          </div>
        ))}
        
        {/* "All Categories" Button */}
        <div className="w-[84px] flex-shrink-0">
          <Link
            to="/categories"
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={cn(
                'w-full aspect-square rounded-2xl flex items-center justify-center',
                'transition-all duration-200',
                'bg-zinc-50 border border-zinc-100',
                'group-hover:scale-95 group-hover:shadow-md group-hover:shadow-black/5',
                'group-hover:border-primary/30 group-hover:bg-primary/5'
              )}
            >
              <div className="grid grid-cols-2 gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors delay-75" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors delay-150" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-zinc-600 group-hover:text-black transition-colors text-center leading-tight w-full">
              View All
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
}
