import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/shared/ScrollToTop';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'TEKLITO - Premium Phone Cases, Watches & Mobiles',
  description: 'Shop the latest phone cases, smartwatches, and mobile devices. Premium quality at unbeatable prices with fast shipping.',
  keywords: ['phone cases', 'watches', 'smartwatches', 'mobiles', 'smartphones', 'accessories'],
  authors: [{ name: 'TEKLITO' }],
  openGraph: {
    title: 'TEKLITO - Premium Phone Cases, Watches & Mobiles',
    description: 'Shop the latest phone cases, smartwatches, and mobile devices.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-white text-black relative font-sans`}>
        <ScrollToTop />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
