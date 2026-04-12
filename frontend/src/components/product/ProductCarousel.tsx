import { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export default function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: 'start', dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">{title}</h2>
          <div className="h-0.5 w-10 bg-primary mt-1.5 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="hidden md:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors ml-2"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[200px] md:w-[240px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View All */}
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="md:hidden flex items-center justify-center gap-2 mt-5 py-3 rounded-xl border border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-black hover:text-black transition-all"
        >
          View All {title} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
