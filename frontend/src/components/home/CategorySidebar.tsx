import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import AppImage from '@/components/shared/AppImage';

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export default function CategorySidebar({ isOpen, onClose, categories }: CategorySidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        'fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <h2 className="text-sm font-black uppercase tracking-widest text-black">Categories</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-1">
          <Link
            to="/products"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 transition-colors group"
          >
            <span className="text-xs font-black uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">
              All Products
            </span>
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 transition-colors group"
            >
              {cat.image && (
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                  <AppImage src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-700 group-hover:text-black transition-colors truncate">
                  {cat.name}
                </p>
                {cat.productCount > 0 && (
                  <p className="text-[10px] text-zinc-400 font-medium">{cat.productCount} products</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-100">
          <Link
            to="/products"
            onClick={onClose}
            className="block w-full py-3 text-center bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-black transition-all"
          >
            View All Products
          </Link>
        </div>
      </div>
    </>
  );
}
