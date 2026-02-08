import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, CreditCard, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function Footer() {
    return (
        <footer className="bg-black text-white mt-auto font-poppins">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6 md:space-y-8">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/images/teklito-logo.webp"
                                alt="TEKLITO Logo"
                                width={130}
                                height={44}
                                className="h-8 md:h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                            Step into the future of mobile fashion. Premium phone cases, smartwatches, and tech essentials designed for the modern lifestyle.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, href: "https://facebook.com" },
                                { Icon: Twitter, href: "https://twitter.com" },
                                { Icon: Instagram, href: "https://instagram.com" },
                                { Icon: Youtube, href: "https://youtube.com" },
                            ].map(({ Icon, href }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - Mobile Accordion, Desktop List */}
                    <div className="md:hidden">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="quick-links" className="border-b-zinc-800">
                                <AccordionTrigger className="text-base font-bold uppercase tracking-widest text-white hover:no-underline">
                                    Quick Links
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-3 pt-2">
                                        {[
                                            { label: 'All Products', href: '/products' },
                                            { label: 'Phone Cases', href: '/category/phone-cases' },
                                            { label: 'Watches', href: '/category/watches' },
                                            { label: 'Mobiles', href: '/category/mobiles' },
                                            { label: 'Special Offers', href: '/products?filter=featured' },
                                        ].map((link) => (
                                            <li key={link.label}>
                                                <Link href={link.href} className="text-sm text-zinc-400 hover:text-primary transition-colors flex items-center gap-2">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="support" className="border-b-zinc-800">
                                <AccordionTrigger className="text-base font-bold uppercase tracking-widest text-white hover:no-underline">
                                    Support
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-3 pt-2">
                                        {[
                                            { label: 'Track Order', href: '/track-order' },
                                            { label: 'Shipping Info', href: '/shipping' },
                                            { label: 'Returns', href: '/returns' },
                                            { label: 'FAQ', href: '/faq' },
                                            { label: 'Contact Us', href: '/contact' },
                                        ].map((link) => (
                                            <li key={link.label}>
                                                <Link href={link.href} className="text-sm text-zinc-400 hover:text-primary transition-colors flex items-center gap-2">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Quick Links - Desktop */}
                    <div className="hidden md:block">
                        <h3 className="font-bold text-base uppercase tracking-widest mb-6 text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'All Products', href: '/products' },
                                { label: 'Phone Cases', href: '/category/phone-cases' },
                                { label: 'Watches', href: '/category/watches' },
                                { label: 'Mobiles', href: '/category/mobiles' },
                                { label: 'Special Offers', href: '/products?filter=featured' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-zinc-400 hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Support - Desktop */}
                    <div className="hidden md:block">
                        <h3 className="font-bold text-base uppercase tracking-widest mb-6 text-white">Support</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Track Order', href: '/track-order' },
                                { label: 'Shipping Info', href: '/shipping' },
                                { label: 'Returns', href: '/returns' },
                                { label: 'FAQ', href: '/faq' },
                                { label: 'Contact Us', href: '/contact' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-zinc-400 hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-base uppercase tracking-widest mb-6 text-white">Stay Updated</h3>
                        <p className="text-sm text-zinc-400 mb-6 font-medium">
                            Join our community for exclusive drops and tech insights.
                        </p>
                        <form className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-primary h-12 rounded-sm"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-sm bg-white text-black hover:bg-primary font-bold uppercase tracking-widest text-[10px] transition-all duration-300">
                                Subscribe Now
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black text-zinc-500 border-t border-zinc-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
                            <span>© 2024 TEKLITO.</span>
                            <div className="flex gap-4">
                                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                            </div>
                        </div>

                        {/* Payment Icons */}
                        <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                            <CreditCard className="h-6 w-6" />
                            <Wallet className="h-6 w-6" />
                            {/* Simple SVG visuals for payment methods if needed, or stick to generic icons for now as per capabilities. 
                               Using CreditCard and Wallet as generic representations + text if needed. 
                               Replaced specific brand SVGs with generic icons for now to ensure no broken images. */}
                            <span className="text-xs font-bold border border-zinc-700 rounded px-1 py-0.5">VISA</span>
                            <span className="text-xs font-bold border border-zinc-700 rounded px-1 py-0.5">MC</span>
                            <span className="text-xs font-bold border border-zinc-700 rounded px-1 py-0.5">AMEX</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
