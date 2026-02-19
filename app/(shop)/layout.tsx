import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { getCategories } from '@/lib/actions/categories';

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const categories = await getCategories();

    return (
        <div className="flex flex-col min-h-screen relative z-10">
            <AnnouncementBar categories={categories} />
            <Header categories={categories} />
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
            <MobileNav />
        </div>
    );
}
