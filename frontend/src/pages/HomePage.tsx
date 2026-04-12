import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCarousel from '@/components/product/ProductCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Headset, Lock, Star, ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useMemo, useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

// ── Hero slides data ───────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    badge: 'New Arrivals',
    title: 'Premium Tech,',
    highlight: "UAE's Best",
    desc: 'Authentic gadgets from top global brands. Fast delivery across UAE.',
    cta: 'Shop Now',
    ctaLink: '/products',
    secondary: 'New Arrivals',
    secondaryLink: '/products?sort=newest',
    bg: 'from-black to-zinc-900',
    accent: 'rgba(199,245,2,0.08)',
    accentPos: 'at_80%_20%',
  },
  {
    id: 2,
    badge: 'Featured Deal',
    title: 'Latest',
    highlight: 'Smartphones',
    desc: 'iPhone 15 Pro, Galaxy S24 Ultra & more. Up to 15% off this week.',
    cta: 'Shop Phones',
    ctaLink: '/category/smartphones',
    secondary: 'View All',
    secondaryLink: '/products',
    bg: 'from-blue-950 to-black',
    accent: 'rgba(59,130,246,0.1)',
    accentPos: 'at_20%_80%',
  },
  {
    id: 3,
    badge: 'Top Pick',
    title: 'Elite',
    highlight: 'Laptops',
    desc: 'MacBook Pro M3, MacBook Air M2 & more. Best prices in UAE.',
    cta: 'Shop Laptops',
    ctaLink: '/category/laptops',
    secondary: 'New Arrivals',
    secondaryLink: '/products?sort=newest',
    bg: 'from-violet-950 to-black',
    accent: 'rgba(139,92,246,0.1)',
    accentPos: 'at_80%_80%',
  },
  {
    id: 4,
    badge: 'Best Value',
    title: 'Premium',
    highlight: 'Audio',
    desc: 'Sony WH-1000XM5, AirPods Pro & more. Hear the difference.',
    cta: 'Shop Audio',
    ctaLink: '/category/audio',
    secondary: 'View Deals',
    secondaryLink: '/products?filter=featured',
    bg: 'from-rose-950 to-black',
    accent: 'rgba(244,63,94,0.1)',
    accentPos: 'at_20%_20%',
  },
];

const features = [
  { title: 'Free Shipping', desc: 'On all orders over AED 200', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { title: 'Authenticity', desc: '100% Genuine Products', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { title: '24/7 Support', desc: 'Expert tech assistance', icon: Headset, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
  { title: 'Secure Payment', desc: 'Encrypted transactions', icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
];

const brands = ['Apple', 'Samsung', 'Sony', 'JBL', 'Bose', 'Logitech', 'Anker', 'DJI'];

const testimonials = [
  { name: 'Ahmad K.', rating: 5, text: 'Fastest delivery in UAE! Got my iPhone the same day I ordered.', avatar: 'A' },
  { name: 'Sara M.', rating: 5, text: 'Authentic products and great customer support. Highly recommend!', avatar: 'S' },
  { name: 'Ravi P.', rating: 5, text: 'Best prices for genuine Apple accessories. My go-to tech store!', avatar: 'R' },
];

// ── Hero Carousel ──────────────────────────────────────────────
function HeroCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Overflow visible so peeking works on web */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {heroSlides.map((slide, idx) => {
            const product = products[idx] ?? products[0];
            return (
              <div
                key={slide.id}
                /* Mobile: full-width card with horizontal padding for peek effect */
                /* Desktop: not full-width — each card takes fixed chunk */
                className="flex-none w-full px-3 md:px-4"
              >
                <div
                  className={cn(
                    'relative overflow-hidden rounded-3xl bg-gradient-to-br text-white',
                    'min-h-[200px] md:min-h-[340px]',
                    slide.bg
                  )}
                >
                  {/* Subtle radial glow */}
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      background: `radial-gradient(ellipse 70% 70% ${slide.accentPos.replace(/_/g, ' ')}, ${slide.accent} 0%, transparent 70%)`,
                    }}
                  />
                  {/* Cyber grid */}
                  <div className="bg-cyber-grid absolute inset-0 opacity-10" />

                  <div className="relative z-10 flex items-center h-full">
                    {/* Left content */}
                    <div className="flex-1 p-6 md:p-10 lg:p-14">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 rounded-full px-3 py-1 mb-4 md:mb-5">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                          {slide.badge}
                        </span>
                      </div>

                      <h2 className="font-black text-white leading-none mb-1 text-2xl md:text-4xl lg:text-5xl">
                        {slide.title}
                      </h2>
                      <h2 className="font-black text-primary leading-none mb-3 md:mb-5 text-2xl md:text-4xl lg:text-5xl">
                        {slide.highlight}
                      </h2>

                      <p className="text-zinc-400 text-xs md:text-sm font-medium mb-5 md:mb-8 max-w-sm leading-relaxed hidden md:block">
                        {slide.desc}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={slide.ctaLink}
                          className="inline-flex items-center gap-2 h-9 md:h-12 px-5 md:px-7 bg-primary text-black text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all glow-primary"
                        >
                          {slide.cta} <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </Link>
                        <Link
                          to={slide.secondaryLink}
                          className="hidden md:inline-flex items-center gap-2 h-12 px-7 border border-zinc-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:border-primary hover:text-primary transition-all"
                        >
                          {slide.secondary}
                        </Link>
                      </div>
                    </div>

                    {/* Right — product image (hidden on small mobile) */}
                    {product && (
                      <div className="hidden sm:flex w-36 md:w-56 lg:w-72 h-full items-center justify-center p-4 md:p-8 shrink-0">
                        <img
                          src={product.images?.[0] ?? 'https://placehold.co/300x300/111/333?text=Tech'}
                          alt={product.name}
                          className="w-full h-32 md:h-48 lg:h-60 object-contain drop-shadow-2xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav arrows — desktop only */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 items-center justify-center hover:bg-black/70 transition-all"
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 items-center justify-center hover:bg-black/70 transition-all"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === selectedIndex
                ? 'w-6 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-zinc-300 hover:bg-zinc-400'
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function HomePage() {
  const { data: allProducts = [], isLoading: productsLoading } = useProducts({ limit: 60 });
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const featured    = useMemo(() => allProducts.filter((p: Product) => (p.discount ?? 0) > 0).slice(0, 15), [allProducts]);
  const newArrivals = useMemo(() => [...allProducts].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 15), [allProducts]);
  const bestSellers = useMemo(() => [...allProducts].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)).slice(0, 15), [allProducts]);
  const smartphones = useMemo(() => allProducts.filter((p: Product) => p.categorySlug === 'smartphones').slice(0, 15), [allProducts]);
  const laptops     = useMemo(() => allProducts.filter((p: Product) => p.categorySlug === 'laptops').slice(0, 15), [allProducts]);

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* ── Desktop container wrapper — mobile is passthrough ── */}
      <div className="md:container md:mx-auto">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-4 pb-2">
        {/* Mobile: carousel only | Desktop: 60/40 split */}
        <div className="md:flex md:gap-3 md:px-4">

          {/* Left 60% — Carousel */}
          <div className="md:w-[60%] shrink-0">
            {productsLoading ? (
              <div className="mx-3 md:mx-0 rounded-3xl bg-zinc-200 animate-pulse min-h-[200px] md:min-h-[360px]" />
            ) : (
              <HeroCarousel products={allProducts} />
            )}
          </div>

          {/* Right 40% — 4 promo mini-cards (desktop only) */}
          <div className="hidden md:grid grid-cols-2 gap-3 md:w-[40%]">

            {/* Card 1 — New Arrivals */}
            <Link to="/products?sort=newest"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 flex flex-col justify-between min-h-[170px] group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="absolute inset-0 bg-cyber-grid opacity-10" />
              <div className="relative">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-200">Just In</span>
                <h3 className="text-sm font-black text-white leading-tight mt-1">New Arrivals</h3>
              </div>
              <div className="relative flex items-end justify-between">
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-wider group-hover:text-white transition-colors">Shop now →</span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-200" />
                </div>
              </div>
            </Link>

            {/* Card 2 — Best Sellers */}
            <Link to="/products?sort=popular"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 flex flex-col justify-between min-h-[170px] group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-100">Top Picks</span>
                <h3 className="text-sm font-black text-white leading-tight mt-1">Best Sellers</h3>
              </div>
              <div className="relative flex items-end justify-between">
                <span className="text-[10px] font-black text-amber-100 uppercase tracking-wider group-hover:text-white transition-colors">Shop now →</span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-100" />
                </div>
              </div>
            </Link>

            {/* Card 3 — Free Shipping */}
            <Link to="/products"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 flex flex-col justify-between min-h-[170px] group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-100">Offer</span>
                <h3 className="text-sm font-black text-white leading-tight mt-1">Free Shipping on AED 200+</h3>
              </div>
              <div className="relative flex items-end justify-between">
                <span className="text-[10px] font-black text-emerald-100 uppercase tracking-wider group-hover:text-white transition-colors">Learn more →</span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-emerald-100" />
                </div>
              </div>
            </Link>

            {/* Card 4 — Flash Deals */}
            <Link to="/products?filter=featured"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 to-pink-700 p-4 flex flex-col justify-between min-h-[170px] group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-rose-100">Limited Time</span>
                <h3 className="text-sm font-black text-white leading-tight mt-1">Featured Deals</h3>
              </div>
              <div className="relative flex items-end justify-between">
                <span className="text-[10px] font-black text-rose-100 uppercase tracking-wider group-hover:text-white transition-colors">Grab now →</span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-rose-100" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>


      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="bg-white mx-3 md:mx-4 rounded-2xl mt-2 mb-2 shadow-sm">
        {categoriesLoading
          ? <div className="p-4"><LoadingSkeleton variant="category" count={8} /></div>
          : <CategoryGrid categories={categories} />
        }
      </section>

      {/* ── BRAND STRIP ─────────────────────────────────────────── */}
      <div className="bg-white mx-3 md:mx-4 rounded-2xl my-2 shadow-sm overflow-hidden relative py-4">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-20 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-20 z-10 bg-gradient-to-l from-white to-transparent" />
        <p className="text-center text-[8px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-3">
          Top Brands
        </p>
        <div className="flex animate-marquee items-center whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="shrink-0 flex items-center">
              <div className="flex items-center gap-1.5 px-4 py-1.5 mx-1 rounded-full border border-zinc-100 bg-zinc-50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default group">
                <span className="w-1 h-1 rounded-full bg-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-700 transition-colors select-none">
                  {brand}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED DEALS ──────────────────────────────────────── */}
      <section className="bg-white mx-3 md:mx-4 rounded-2xl my-2 shadow-sm py-6 px-4">
        {productsLoading
          ? <LoadingSkeleton variant="product-grid" count={4} />
          : <ProductCarousel title="🔥 Featured Deals" products={featured.length > 0 ? featured : bestSellers} viewAllLink="/products?filter=featured" />
        }
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────────────────── */}
      <section className="bg-white mx-3 md:mx-4 rounded-2xl my-2 shadow-sm py-6 px-4">
        <ProductCarousel title="New Arrivals" products={newArrivals} viewAllLink="/products?sort=newest" />
      </section>

      {/* ── PROMO BANNERS ───────────────────────────────────────── */}
      <section className="mx-3 md:mx-4 my-2">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          <Link
            to="/category/smartphones"
            className="relative overflow-hidden rounded-2xl bg-black p-5 md:p-8 group min-h-[130px] md:min-h-[200px] flex flex-col justify-end border border-zinc-900 hover:border-primary/40 transition-all duration-300"
          >
            <div className="bg-cyber-grid absolute inset-0 opacity-15" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(199,245,2,0.08),_transparent_70%)]" />
            <div className="relative">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">New</p>
              <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-tight mb-2">Smartphones</h3>
              <span className="inline-flex items-center gap-1 text-[8px] md:text-[10px] font-black uppercase text-zinc-400 group-hover:text-primary transition-colors">
                Shop <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </Link>

          <Link
            to="/category/laptops"
            className="relative overflow-hidden rounded-2xl bg-zinc-900 p-5 md:p-8 group min-h-[130px] md:min-h-[200px] flex flex-col justify-end border border-zinc-800 hover:border-primary/40 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(199,245,2,0.06),_transparent_60%)]" />
            <div className="relative">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Elite</p>
              <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-tight mb-2">Laptops</h3>
              <span className="inline-flex items-center gap-1 text-[8px] md:text-[10px] font-black uppercase text-zinc-400 group-hover:text-primary transition-colors">
                Shop <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── SMARTPHONES ─────────────────────────────────────────── */}
      {smartphones.length > 0 && (
        <section className="bg-white mx-3 md:mx-4 rounded-2xl my-2 shadow-sm py-6 px-4">
          <ProductCarousel title="Latest Smartphones" products={smartphones} viewAllLink="/category/smartphones" />
        </section>
      )}

      {/* ── BEST SELLERS ────────────────────────────────────────── */}
      <section className="bg-white mx-3 md:mx-4 rounded-2xl my-2 shadow-sm py-6 px-4">
        <ProductCarousel title="Best Sellers" products={bestSellers} viewAllLink="/products?sort=popular" />
      </section>

      {/* ── LAPTOPS ─────────────────────────────────────────────── */}
      {laptops.length > 0 && (
        <section className="bg-white mx-3 md:mx-4 rounded-2xl my-2 shadow-sm py-6 px-4">
          <ProductCarousel title="Top Laptops" products={laptops} viewAllLink="/category/laptops" />
        </section>
      )}

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="mx-3 md:mx-4 my-2 rounded-2xl overflow-hidden bg-black text-white py-12 px-4 md:py-16">
        <div className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Reviews</p>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white">
            Loved by UAE Customers
          </h2>
          <div className="h-0.5 w-10 bg-primary mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
              <div className="flex mb-3">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black font-black text-xs">{t.avatar}</div>
                <p className="font-black text-white text-sm">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ───────────────────────────────────────── */}
      <section className="bg-white mx-3 md:mx-4 rounded-2xl my-2 shadow-sm py-10 px-4 md:py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Why Teklito</p>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-black mb-3">
            UAE Standard for <span className="text-primary italic">Premium Tech</span>
          </h2>
          <div className="h-0.5 w-14 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className={cn('bg-white rounded-2xl p-5 md:p-7 border hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group', feature.border)}>
                <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500', feature.bg)}>
                  <Icon className={cn('h-5 w-5', feature.color)} strokeWidth={2} />
                </div>
                <h3 className="text-xs font-black text-black uppercase tracking-tight mb-1">{feature.title}</h3>
                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

        {/* Bottom spacing for mobile nav */}
        <div className="h-4" />

      </div>{/* end desktop container */}
    </div>
  );
}
