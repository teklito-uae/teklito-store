import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Truck, ShieldCheck, Clock, Zap, Phone } from 'lucide-react';

const messages = [
  { icon: Truck,       text: 'Free shipping on orders over', highlight: 'AED 200', link: '/products' },
  { icon: ShieldCheck, text: '100% Authentic products —', highlight: 'UAE Authorized Dealer', link: '/products' },
  { icon: Clock,       text: 'Same-day dispatch before 2PM ·', highlight: 'Order Now', link: '/products' },
  { icon: Zap,         text: 'New arrivals every week ·', highlight: 'See What\'s New', link: '/products?sort=newest' },
  { icon: Phone,       text: '24/7 customer support ·', highlight: 'Contact Us', link: '/contact' },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const msg = messages[current];
  const Icon = msg.icon;

  return (
    <div className="bg-black text-white py-2 px-4 text-center overflow-hidden">
      <div
        className="container mx-auto flex items-center justify-center gap-2 transition-opacity duration-300"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <Icon className="h-3 w-3 text-primary shrink-0" />
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em]">
          {msg.text}{' '}
          <Link to={msg.link} className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
            {msg.highlight}
          </Link>
        </p>
      </div>
    </div>
  );
}
