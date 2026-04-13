import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ShopLayout from '@/layouts/ShopLayout';
import { useAuthStore } from '@/lib/store/auth';
import { type ReactNode } from 'react';

// Lazy page imports for code splitting
import { lazy, Suspense, useEffect } from 'react';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const ReturnsPage = lazy(() => import('@/pages/ReturnsPage'));
const ShippingPage = lazy(() => import('@/pages/ShippingPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PageSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingSkeleton variant="full-page" />}>
      {children}
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<ShopLayout />}>
          <Route path="/" index element={<PageSuspense><HomePage /></PageSuspense>} />
          <Route path="/products" element={<PageSuspense><ProductsPage /></PageSuspense>} />
          <Route path="/products/:slug" element={<PageSuspense><ProductDetailPage /></PageSuspense>} />
          <Route path="/category/:slug" element={<PageSuspense><CategoryPage /></PageSuspense>} />
          <Route path="/cart" element={<PageSuspense><CartPage /></PageSuspense>} />
          <Route path="/checkout" element={<PageSuspense><CheckoutPage /></PageSuspense>} />
          <Route path="/login" element={<PageSuspense><LoginPage /></PageSuspense>} />
          <Route path="/register" element={<PageSuspense><RegisterPage /></PageSuspense>} />
          <Route path="/orders" element={<PageSuspense><ProtectedRoute><OrdersPage /></ProtectedRoute></PageSuspense>} />
          <Route path="/track" element={<PageSuspense><TrackOrderPage /></PageSuspense>} />
          <Route path="/wishlist" element={<PageSuspense><WishlistPage /></PageSuspense>} />
          <Route path="/search" element={<PageSuspense><SearchPage /></PageSuspense>} />
          <Route path="/profile" element={<PageSuspense><ProtectedRoute><ProfilePage /></ProtectedRoute></PageSuspense>} />
          <Route path="/faq" element={<PageSuspense><FaqPage /></PageSuspense>} />
          <Route path="/contact" element={<PageSuspense><ContactPage /></PageSuspense>} />
          <Route path="/privacy" element={<PageSuspense><PrivacyPage /></PageSuspense>} />
          <Route path="/returns" element={<PageSuspense><ReturnsPage /></PageSuspense>} />
          <Route path="/shipping" element={<PageSuspense><ShippingPage /></PageSuspense>} />
          <Route path="/terms" element={<PageSuspense><TermsPage /></PageSuspense>} />
          <Route path="*" element={<PageSuspense><NotFoundPage /></PageSuspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
