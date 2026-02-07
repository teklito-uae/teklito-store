'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const popularSearches = [
    'iPhone 16 Pro Max', 'Samsung Galaxy S24 Ultra', 'Google Pixel 9 Pro', 'MacBook Air M3',
    'Apple Watch Series 10', 'Sony PS5 Slim', 'Bose QuietComfort Ultra', 'Dell XPS 15',
    'HP Spectre x360', 'Lenovo Yoga 9i', 'Asus ROG Zephyrus', 'Xiaomi 14 Ultra',
    'OnePlus 12', 'Samsung Tab S10', 'iPad Pro M4', 'AirPods Pro 2',
    'Nintendo Switch OLED', 'DJI Mavic 3', 'GoPro Hero 13', 'Insta360 X4',
    'Marshall Emberton II', 'JBL Flip 6', 'Logitech MX Master 3S', 'Razer DeathAdder V3',
    'Fitbit Charge 6', 'Garmin Fenix 8', 'Huawei Watch GT 5', 'Amazfit T-Rex 3'
];

const seoSections = [
    {
        title: "Shop the best tech at Teklito UAE",
        content: "Discover the ultimate tech destination in the UAE. From high-performance smartphones to elite wearable technology, Teklito brings you a curated selection of premium gear. We make shopping online easier with exclusive deals and mobile phone offers tailored for Dubai, Abu Dhabi, and beyond. Explore our range of budget smartphones, high-end laptops, and essential accessories at the best prices in the UAE."
    },
    {
        title: "Get the latest mobile phones in Dubai & Abu Dhabi",
        content: "Stay ahead of the curve with the newest mobile releases in the UAE. Whether you are in the heart of Dubai or the capital Abu Dhabi, our new arrivals feature the latest Android and iOS devices. Shop the Samsung Galaxy S24 range, iPhone 16 series, and Google Pixel 9 with fast delivery across all emirates. Our collection includes diverse colors, storage options, and local warranties for the best user experience."
    },
    {
        title: "Affordable smartphone shopping in Sharjah & Ajman",
        content: "Looking for value without compromise? Teklito offers a wide range of smartphones at competitive prices in Sharjah and Ajman. We bring you the latest models from top brands like Xiaomi, Oppo, and OnePlus. Supplement your device with our extensive library of mobile accessories, power banks, and portable speakers. Use our price filters to find the perfect match for your budget in the UAE market."
    },
    {
        title: "Tech brands for every budget in Ras Al Khaimah & Fujairah",
        content: "We cater to tech enthusiasts across Ras Al Khaimah and Fujairah with brands that fit every lifestyle. From Apple fans to Android loyalists, our range includes everything from entry-level devices to pro-grade workstations. Shop top-tier laptops from Dell, HP, and ASUS, or upgrade your home office with our desktop solutions. Experience the convenience of online shopping with multiple payment plans and local support."
    }
];

export default function SEOFooter() {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <section className="bg-white py-12 border-t border-zinc-100">
            <div className="container mx-auto px-4">
                {/* SEO Text Content */}
                <div className="space-y-8 mb-12">
                    {seoSections.map((section, index) => (
                        <div key={index} className="space-y-3">
                            <h3 className="text-sm font-black uppercase tracking-widest text-black font-poppins">
                                {section.title}
                            </h3>
                            <p className="text-[12px] md:text-[13px] leading-relaxed text-zinc-500 font-medium font-poppins">
                                {section.content}
                            </p>
                            <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                                Read More
                            </button>
                        </div>
                    ))}
                </div>

                {/* Popular Searches */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-1 bg-black rounded-full" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-black font-poppins">
                            Popular Searches
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {popularSearches.slice(0, isExpanded ? popularSearches.length : 15).map((search, idx) => (
                            <Link
                                key={idx}
                                href={`/search?q=${encodeURIComponent(search)}`}
                                className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-[11px] font-bold text-zinc-600 hover:border-primary hover:bg-zinc-100 transition-all duration-300"
                            >
                                {search}
                            </Link>
                        ))}
                    </div>

                    {!isExpanded && popularSearches.length > 15 && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1 hover:gap-2 transition-all mt-4"
                        >
                            View More
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
