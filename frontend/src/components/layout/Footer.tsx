import { Link } from 'react-router-dom';
import { Send, AtSign, Play, Globe, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'All Products', to: '/products' },
    { label: 'New Arrivals', to: '/products?sort=newest' },
    { label: 'Best Sellers', to: '/products?sort=popular' },
    { label: 'Featured Deals', to: '/products?filter=featured' },
  ],
  support: [
    { label: 'Track Order', to: '/track-order' },
    { label: 'Returns & Refunds', to: '/returns' },
    { label: 'Shipping Policy', to: '/shipping' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
};

const socials = [
  { icon: AtSign, href: '#', label: 'Instagram' },
  { icon: Send, href: '#', label: 'Twitter' },
  { icon: Play, href: '#', label: 'YouTube' },
  { icon: Globe, href: '#', label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-zinc-900">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/">
              <img src="/images/teklito-logo.webp" alt="TEKLITO" className="h-8 w-auto mb-5 brightness-0 invert" />
            </Link>
            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-6">
              Premium tech accessories and gadgets for the modern lifestyle. Authentic products, fast delivery across UAE.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="h-9 w-9 rounded-xl bg-zinc-900 flex items-center justify-center hover:bg-primary transition-all group">
                  <Icon className="h-4 w-4 text-zinc-400 group-hover:text-black transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-5">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-5">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-xs text-zinc-400 font-medium leading-relaxed">Dubai, United Arab Emirates</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+971500000000" className="text-xs text-zinc-400 font-medium hover:text-white transition-colors">+971 50 000 0000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:support@teklito.com" className="text-xs text-zinc-400 font-medium hover:text-white transition-colors">support@teklito.com</a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Legal</p>
              <div className="flex gap-4">
                {footerLinks.legal.map(({ label, to }) => (
                  <Link key={to} to={to} className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors font-medium">{label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} Teklito. All rights reserved.
          </p>
          <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">UAE 🇦🇪</p>
        </div>
      </div>
    </footer>
  );
}
