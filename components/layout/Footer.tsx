import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
    return (
        <footer className="bg-black text-white mt-auto">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/images/teklito-logo.webp"
                                alt="TEKLITO Logo"
                                width={130}
                                height={44}
                                className="h-10 w-auto object-contain brightness-0 invert"
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
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-black hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(199,245,2,0.2)]"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-base uppercase tracking-widest mb-6 text-primary">Quick Links</h3>
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

                    {/* Customer Support */}
                    <div>
                        <h3 className="font-bold text-base uppercase tracking-widest mb-6 text-primary">Support</h3>
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
                        <h3 className="font-bold text-base uppercase tracking-widest mb-6 text-primary">Stay Updated</h3>
                        <p className="text-sm text-zinc-400 mb-6 font-medium">
                            Join our community for exclusive drops and tech insights.
                        </p>
                        <form className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-12 bg-zinc-900/80 border-primary/20 text-white placeholder:text-zinc-600 focus-visible:ring-primary h-12 rounded-none"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-none bg-primary hover:bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 shadow-[0_0_20px_rgba(199,245,2,0.2)]">
                                Subscribe Now
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Black with Zinc Text */}
            <div className="bg-black text-zinc-500 border-t border-zinc-900 font-poppins">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>© 2024 TEKLITO.</span>
                            <span className="hidden md:inline text-zinc-800">|</span>
                            <span>Crafted for the future.</span>
                        </div>
                        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Link href="/privacy" className="hover:text-white transition-colors duration-300 underline-offset-4">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors duration-300 underline-offset-4">
                                Terms
                            </Link>
                            <Link href="/cookies" className="hover:text-white transition-colors duration-300 underline-offset-4">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
