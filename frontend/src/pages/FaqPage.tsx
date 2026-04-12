const faqs = [
  { q: 'How long does delivery take?', a: 'Standard delivery within UAE takes 2-4 business days. Express delivery is available in Dubai and Abu Dhabi within 24 hours.' },
  { q: 'Do you ship outside UAE?', a: 'Currently we ship within the UAE only. International shipping is coming soon.' },
  { q: 'Are all products authentic?', a: 'Yes, 100%. We source directly from authorized distributors and manufacturers. Every product includes an authenticity guarantee.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day return policy from the date of delivery. Products must be in original packaging with all accessories.' },
  { q: 'How do I track my order?', a: 'Use the Track Order page with your order number. You will also receive SMS/email updates at every stage.' },
  { q: 'What payment methods do you accept?', a: 'We currently accept Cash on Delivery (COD). Card and online payment options are coming soon.' },
  { q: 'Is my personal data safe?', a: 'We take privacy seriously. Your data is encrypted and never shared with third parties. Read our Privacy Policy for details.' },
];

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-16 relative overflow-hidden">
        <div className="bg-cyber-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Help Center</p>
          <h1 className="text-4xl font-black uppercase tracking-tight">FAQ</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-zinc-100 rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-zinc-50 transition-colors gap-4">
                <p className="font-black text-black text-sm md:text-base">{faq.q}</p>
                <ChevronDown className={cn('h-5 w-5 text-zinc-400 shrink-0 transition-transform duration-200', open === i && 'rotate-180')} />
              </button>
              {open === i && (
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
