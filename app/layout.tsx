import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import CategoryBar from '@/components/layout/CategoryBar';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Toaster } from '@/components/ui/sonner';

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
        <div className="flex flex-col min-h-screen relative z-10">
          <Header />
          <div className="hidden lg:block sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-zinc-100 shadow-sm">
            <CategoryBar />
          </div>
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
