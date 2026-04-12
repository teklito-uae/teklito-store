import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { useCategories } from '@/hooks/useCategories';
import { Toaster } from '@/components/ui/sonner';

export default function ShopLayout() {
  const { data: categories = [] } = useCategories();

  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <AnnouncementBar />
      <Header categories={categories} />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <Toaster richColors position="top-right" />
    </div>
  );
}
