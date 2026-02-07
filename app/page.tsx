import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCarousel from '@/components/product/ProductCarousel';
import PromoBanners from '@/components/home/PromoBanners';
import { getFeaturedProducts, getNewArrivals, getBestSellers, getProductsByCategory } from '@/lib/data/products';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Headset, Lock } from 'lucide-react';

import SEOFooter from '@/components/home/SEOFooter';

export default function HomePage() {
  const featured = getFeaturedProducts(15);
  const newArrivals = getNewArrivals(15);
  const bestSellers = getBestSellers(15);

  // Specific Category Products
  const mobiles = getProductsByCategory('mobiles').slice(0, 15);
  const watches = getProductsByCategory('watches').slice(0, 15);
  const cases = getProductsByCategory('phone-cases').slice(0, 15);

  return (
    <div className="min-h-screen">
      {/* Hero Section (Main Slider + Deals) */}
      <HeroSection />

      {/* Categories - Mobile Only */}
      <div className="lg:hidden">
        <CategoryGrid />
      </div>

      {/* Featured Deals */}
      <section className="bg-zinc-50/50 py-12 md:py-16 border-y border-zinc-100">
        <div className="container mx-auto px-4">
          <ProductCarousel
            title="Featured Deals"
            products={featured}
            viewAllLink="/products?filter=featured"
          />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <ProductCarousel
          title="New Arrivals"
          products={newArrivals}
          viewAllLink="/products?sort=newest"
        />
      </section>

      {/* Promo Banners Grid 1 */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <PromoBanners />
      </section>

      {/* Category: Mobiles */}
      <section className="bg-zinc-50/50 py-12 md:py-16 border-y border-zinc-100">
        <div className="container mx-auto px-4">
          <ProductCarousel
            title="Latest Mobiles"
            products={mobiles}
            viewAllLink="/category/mobiles"
          />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <ProductCarousel
          title="Best Sellers"
          products={bestSellers}
          viewAllLink="/products?sort=popular"
        />
      </section>

      {/* Promo Banners Grid 2 (Reusing or adding more) */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-zinc-900 overflow-hidden">
        <div className="opacity-80">
          <PromoBanners />
        </div>
      </section>

      {/* Category: Watches */}
      <section className="py-12 md:py-16 border-y border-zinc-100">
        <div className="container mx-auto px-4">
          <ProductCarousel
            title="Elite Watches"
            products={watches}
            viewAllLink="/category/watches"
          />
        </div>
      </section>

      {/* Category: Phone Cases */}
      <section className="bg-zinc-50/50 py-12 md:py-16 border-y border-zinc-100">
        <div className="container mx-auto px-4">
          <ProductCarousel
            title="Premium Phone Cases"
            products={cases}
            viewAllLink="/category/phone-cases"
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white border-t border-zinc-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50/50 skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black font-poppins mb-4">
              Why Choose <span className="text-primary italic">Teklito</span>
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-zinc-500 text-sm md:text-base font-medium font-poppins leading-relaxed">
              We define the standard for premium tech retail. Authentication, speed, and support—protocoled for your satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Free Shipping',
                desc: 'On all orders over $100',
                icon: Truck,
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                title: 'Authenticity',
                desc: '100% Genuine Products',
                icon: ShieldCheck,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
              },
              {
                title: '24/7 Support',
                desc: 'Expert tech assistance',
                icon: Headset,
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              },
              {
                title: 'Secure Payment',
                desc: 'Encrypted transactions',
                icon: Lock,
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-[2rem] p-8 border border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group">
                  <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-black text-black uppercase tracking-tight font-poppins mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wide font-poppins">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Footer Section */}
      <SEOFooter />
    </div>
  );
}
