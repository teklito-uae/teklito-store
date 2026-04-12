# Teklito Store — Migration Implementation Plan
## Current Stack → React + Vite (Shadcn UI) + Laravel REST API

> **Reference:** See `theme.md` for all design tokens, typography, and color rules.
> **Goal:** Full stack rewrite. Keep identical UI, theme, and UX. Frontend becomes a React SPA, backend becomes a standalone Laravel API with its own database.

---

## Architecture Overview

```
BEFORE                                    AFTER
────────────────────────────────────      ────────────────────────────────────────────
Next.js App Router (SSR/RSC)              React + Vite (SPA, client-only)
  Server Actions fetching WooCommerce →   Axios → Laravel REST API
  localStorage cart/wishlist              Zustand (persist) cart/wishlist
  next-themes dark mode                   Radix UI theme provider (custom)
  next/image                              <img> + custom AppImage component
  next/link                               React Router v6 <Link>
  useRouter (Next)                        useNavigate + useParams (React Router)
  'use client' / 'use server'             Removed — all components are client
  TypeScript                              TypeScript
```

---

## Phase 1 — Frontend Project Setup (Day 1)

### 1.1 Scaffold React + Vite App

```bash
npx create-vite@latest teklito-frontend -- --template react-ts
cd teklito-frontend
npm install
```

### 1.2 Install All Dependencies

```bash
# Routing & state
npm install react-router-dom zustand

# Data fetching
npm install axios @tanstack/react-query

# Shadcn UI prerequisites
npm install tailwindcss @tailwindcss/vite
npm install class-variance-authority clsx tailwind-merge

# UI & animation
npm install lucide-react
npm install framer-motion
npm install sonner
npm install cmdk
npm install embla-carousel-react embla-carousel-autoplay
npm install react-fast-marquee
npm install boring-avatars
npm install lottie-react

# Forms & validation
npm install react-hook-form @hookform/resolvers zod

# Radix UI (theme + primitives)
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-dialog
npm install @radix-ui/react-slider
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-label
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-tabs
npm install @radix-ui/react-separator
npm install @radix-ui/react-avatar
npm install @radix-ui/react-toast
npm install radix-ui
```

### 1.3 Initialize Shadcn UI

```bash
npx shadcn@latest init
```

Config:
```
Style:         Default
Base color:    Zinc
CSS variables: Yes
RSC:           No  (this is a Vite SPA, not Next.js)
```

### 1.4 Add Shadcn Components

```bash
npx shadcn@latest add button input label card badge dialog
npx shadcn@latest add radio-group slider command sheet
npx shadcn@latest add separator skeleton avatar dropdown-menu
npx shadcn@latest add tabs scroll-area sonner
```

### 1.5 Copy Design System CSS

- Copy all CSS tokens from `app/globals.css` (`:root`, `.dark`, `@theme inline`, media queries, utilities) into `src/index.css`
- Add Google Fonts Poppins to `index.html`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```
- Preserve all utility classes: `.scrollbar-hide`, `.bg-cyber-grid`, `.glow-primary`, `.glow-primary-strong`, `.border-text`

### 1.6 Theme Provider (Radix UI)

No `next-themes`. Build a lightweight theme provider using Radix UI and React context:

**File:** `src/providers/ThemeProvider.tsx`

```tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('teklito-theme') as Theme) ?? 'system'
  );

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem('teklito-theme', t);
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### 1.7 Path Aliases

```typescript
// vite.config.ts
import path from 'path';
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}

// tsconfig.json
"paths": { "@/*": ["./src/*"] }
```

### 1.8 React Router Setup

**File:** `src/router/index.tsx`

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopLayout from '@/layouts/ShopLayout';
// Import all page components...

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShopLayout />}>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/products"          element={<ProductsPage />} />
          <Route path="/products/:slug"    element={<ProductDetailPage />} />
          <Route path="/category/:slug"    element={<CategoryPage />} />
          <Route path="/cart"              element={<CartPage />} />
          <Route path="/checkout"          element={<CheckoutPage />} />
          <Route path="/login"             element={<LoginPage />} />
          <Route path="/register"          element={<RegisterPage />} />
          <Route path="/orders"            element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/track-order"       element={<TrackOrderPage />} />
          <Route path="/wishlist"          element={<WishlistPage />} />
          <Route path="/search"            element={<SearchPage />} />
          <Route path="/faq"               element={<FaqPage />} />
          <Route path="/contact"           element={<ContactPage />} />
          <Route path="/privacy"           element={<PrivacyPage />} />
          <Route path="/returns"           element={<ReturnsPage />} />
          <Route path="/shipping"          element={<ShippingPage />} />
          <Route path="/terms"             element={<TermsPage />} />
          <Route path="*"                  element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

**Routes table:**

| Path | Page | Auth |
|---|---|---|
| `/` | HomePage | — |
| `/products` | ProductsPage | — |
| `/products/:slug` | ProductDetailPage | — |
| `/category/:slug` | CategoryPage | — |
| `/cart` | CartPage | — |
| `/checkout` | CheckoutPage | — |
| `/login` | LoginPage | — |
| `/register` | RegisterPage | — |
| `/orders` | OrdersPage | ✅ Protected |
| `/track-order` | TrackOrderPage | — |
| `/wishlist` | WishlistPage | — |
| `/search` | SearchPage | — |
| `/faq` | FaqPage | — |
| `/contact` | ContactPage | — |
| `/privacy` | PrivacyPage | — |
| `/returns` | ReturnsPage | — |
| `/shipping` | ShippingPage | — |
| `/terms` | TermsPage | — |

---

## Phase 2 — Laravel Backend (Days 2–4)

> **Important:** Laravel is the **complete backend**. It owns its own database with Products, Categories, Orders, and Users tables. There is no WooCommerce dependency, no WooCommerce PHP package, and no WooCommerce API calls anywhere in the backend.

### 2.1 Laravel App Setup

```bash
composer create-project laravel/laravel teklito-api
cd teklito-api
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 2.2 Database Migrations

Run migrations for all core tables:

```bash
php artisan make:migration create_categories_table
php artisan make:migration create_products_table
php artisan make:migration create_product_images_table
php artisan make:migration create_product_variants_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan migrate
```

**Schema summary:**

| Table | Key Columns |
|---|---|
| `categories` | id, name, slug, image, description, product_count, parent_id |
| `products` | id, name, slug, description, price, original_price, discount, category_id, rating, review_count, in_stock, stock, created_at |
| `product_images` | id, product_id, url, sort_order |
| `product_variants` | id, product_id, type, name |
| `product_variant_options` | id, variant_id, value, label, in_stock, price_modifier |
| `orders` | id, order_number, user_id (nullable), status, payment_method, subtotal, shipping, total |
| `order_items` | id, order_id, product_id, product_name, quantity, price |
| `users` | id (Sanctum default), name, email, phone, password |

### 2.3 Eloquent Models

```bash
php artisan make:model Category
php artisan make:model Product
php artisan make:model Order
php artisan make:model OrderItem
```

- `Product` → `belongsTo(Category)`, `hasMany(ProductImage)`, `hasMany(ProductVariant)`
- `Category` → `hasMany(Product)`, `hasMany(Category, 'parent_id')` (subcategories)
- `Order` → `belongsTo(User)`, `hasMany(OrderItem)`
- `User` → `hasMany(Order)`, uses `HasApiTokens` (Sanctum)

### 2.4 Environment Variables

```dotenv
# teklito-api/.env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=teklito_db
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### 2.5 API Routes

**File:** `routes/api.php`

```php
// Public routes
Route::get('/products',              [ProductController::class, 'index']);
Route::get('/products/search',       [ProductController::class, 'search']);
Route::get('/products/{slug}',       [ProductController::class, 'show']);
Route::get('/categories',            [CategoryController::class, 'index']);
Route::get('/categories/{slug}',     [CategoryController::class, 'show']);
Route::post('/orders',               [OrderController::class, 'store']);
Route::get('/orders/{id}',           [OrderController::class, 'show']);

// Auth routes
Route::post('/auth/login',           [AuthController::class, 'login']);
Route::post('/auth/register',        [AuthController::class, 'register']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout',      [AuthController::class, 'logout']);
    Route::get('/auth/user',         [AuthController::class, 'user']);
    Route::get('/orders/my-orders',  [OrderController::class, 'myOrders']);
});
```

### 2.6 Controllers

```bash
php artisan make:controller Api/ProductController
php artisan make:controller Api/CategoryController
php artisan make:controller Api/OrderController
php artisan make:controller Api/AuthController
```

#### ProductController

| Method | Route | Logic |
|---|---|---|
| `index` | `GET /api/products` | Query products with filters (sort, category, page, limit) from DB |
| `show` | `GET /api/products/{slug}` | Find product by slug with images + variants eager loaded |
| `search` | `GET /api/products/search?q=` | `LIKE` search on name, description, tags |

**Supported query params:**
- `limit` (default: 20)
- `page` (default: 1)
- `sort`: `newest` | `popular` | `price_asc` | `price_desc`
- `category` (slug)
- `in_stock` (boolean)
- `min_price`, `max_price`

#### CategoryController

| Method | Route | Logic |
|---|---|---|
| `index` | `GET /api/categories` | All categories with product_count |
| `show` | `GET /api/categories/{slug}` | Single category with subcategories |

#### OrderController

| Method | Route | Logic |
|---|---|---|
| `store` | `POST /api/orders` | Create Order + OrderItems, generate order number |
| `show` | `GET /api/orders/{id}` | Fetch order with items |
| `myOrders` | `GET /api/orders/my-orders` | Orders belonging to auth user |

**Order creation request body (matches existing TypeScript `CreateOrderParams`):**
```json
{
  "shippingInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "zipCode": "string",
    "country": "UAE"
  },
  "paymentMethod": "cod",
  "items": [
    { "productId": "string", "quantity": 1, "selectedVariants": {} }
  ]
}
```

#### AuthController (Sanctum)

| Method | Route | Logic |
|---|---|---|
| `login` | `POST /api/auth/login` | Validate credentials, return Sanctum token |
| `register` | `POST /api/auth/register` | Create user, return Sanctum token |
| `logout` | `POST /api/auth/logout` | Revoke current token |
| `user` | `GET /api/auth/user` | Return authenticated user profile |

### 2.7 API Response Envelope (Trait)

**File:** `app/Traits/ApiResponse.php`

```php
<?php
namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success(mixed $data, int $status = 200, array $meta = []): JsonResponse
    {
        $response = ['success' => true, 'data' => $data];
        if (!empty($meta)) $response['meta'] = $meta;
        return response()->json($response, $status);
    }

    protected function error(string $message, int $status = 400): JsonResponse
    {
        return response()->json(['success' => false, 'error' => $message], $status);
    }
}
```

All controllers `use ApiResponse`.

### 2.8 JSON Response Shape

All `Product` responses must match the existing TypeScript `Product` type exactly:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Product Name",
    "slug": "product-name",
    "description": "HTML description",
    "price": 299.00,
    "originalPrice": 399.00,
    "discount": 25,
    "images": ["https://..."],
    "category": "Mobiles",
    "categorySlug": "mobiles",
    "rating": 4.5,
    "reviewCount": 128,
    "inStock": true,
    "stock": 15,
    "tags": ["samsung", "android"],
    "createdAt": "2026-01-01T00:00:00Z",
    "variants": [
      {
        "type": "storage",
        "name": "Storage",
        "options": [
          { "id": "128gb", "value": "128gb", "label": "128GB", "inStock": true, "priceModifier": 0 }
        ]
      }
    ]
  }
}
```

### 2.9 CORS Configuration

**File:** `config/cors.php`

```php
'allowed_origins'         => [env('FRONTEND_URL', 'http://localhost:5173')],
'allowed_methods'         => ['*'],
'allowed_headers'         => ['*'],
'exposed_headers'         => [],
'max_age'                 => 0,
'supports_credentials'    => true,
```

### 2.10 Force JSON Middleware

**File:** `app/Http/Middleware/ForceJsonResponse.php`

```php
public function handle($request, Closure $next)
{
    $request->headers->set('Accept', 'application/json');
    return $next($request);
}
```

Register in `bootstrap/app.php` for the `api` middleware group.

---

## Phase 3 — Frontend API Layer (Day 4)

### 3.1 Axios Instance

**File:** `src/lib/api.ts`

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Attach Bearer token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3.2 API Functions

**`src/lib/api/products.ts`**
```typescript
import { api } from '../api';
import type { Product } from '../types';

export const getProducts = (options?: GetProductsOptions) =>
  api.get<{ data: Product[] }>('/products', { params: options }).then(r => r.data.data);

export const getProductBySlug = (slug: string) =>
  api.get<{ data: Product }>(`/products/${slug}`).then(r => r.data.data);

export const searchProducts = (q: string) =>
  api.get<{ data: Product[] }>('/products/search', { params: { q } }).then(r => r.data.data);
```

**`src/lib/api/categories.ts`**
**`src/lib/api/orders.ts`**
**`src/lib/api/auth.ts`**

### 3.3 TanStack Query Hooks

```bash
npm install @tanstack/react-query
```

**`src/hooks/useProducts.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductBySlug, searchProducts } from '@/lib/api/products';

export const useProducts = (options?: GetProductsOptions) =>
  useQuery({ queryKey: ['products', options], queryFn: () => getProducts(options) });

export const useProductBySlug = (slug: string) =>
  useQuery({ queryKey: ['product', slug], queryFn: () => getProductBySlug(slug), enabled: !!slug });

export const useSearchProducts = (q: string) =>
  useQuery({ queryKey: ['search', q], queryFn: () => searchProducts(q), enabled: q.length >= 2 });
```

Similar hooks for: `useCategories`, `useCategoryBySlug`, `useOrders`, `useOrderById`.

### 3.4 Zustand Stores

**`src/lib/store/auth.ts`** — token + user, persisted to localStorage
**`src/lib/store/cart.ts`** — full cart logic (addToCart, removeFromCart, updateQuantity, clearCart), Zustand `persist` middleware
**`src/lib/store/wishlist.ts`** — productIds array, persisted

Cart rules preserved:
- Free shipping threshold: **AED 200**
- Standard shipping fee: **AED 20**
- Cart item key: `productId + JSON.stringify(selectedVariants)`

---

## Phase 4 — Component Migration (Days 5–8)

### 4.1 Migration Rules (Every Component)

1. Delete `'use client'` and `'use server'` directives — all components are just React components
2. Replace `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`
3. Replace `import Image from 'next/image'` → `import { AppImage } from '@/components/shared/AppImage'`
4. Replace `useRouter()` → `useNavigate()` + `useParams()` + `useSearchParams()` from `react-router-dom`
5. Replace `usePathname()` → `useLocation().pathname`
6. Remove all server action imports (`lib/actions/*`) — replace with TanStack Query hooks
7. Keep ALL Tailwind classes, color tokens, animations, and typography unchanged

### 4.2 Layout Components

| Component | Source File | Key Changes |
|---|---|---|
| `ShopLayout` | New | `<Outlet />` from RRD, fetches categories via `useCategories()` |
| `Header` | `components/layout/Header.tsx` | RRD Link, useNavigate, cart/wishlist from Zustand |
| `Footer` | `components/layout/Footer.tsx` | RRD Link only |
| `MobileNav` | `components/layout/MobileNav.tsx` | RRD Link, useLocation |
| `AnnouncementBar` | `components/layout/AnnouncementBar.tsx` | Minor cleanup |
| `CategoryBar` | `components/layout/CategoryBar.tsx` | Minor cleanup |
| `UserDropdown` | `components/layout/UserDropdown.tsx` | Auth from Zustand store |

### 4.3 Home Components

| Component | Key Changes |
|---|---|
| `HeroSection` | Internal state only, no data fetching |
| `HeroCarousel` | Embla carousel — no changes needed |
| `HeroSecondaryCarousel` | Minor cleanup |
| `CategoryGrid` | Props passed from `useCategories()` in HomePage |
| `CategoryCarousel` | Minor cleanup |
| `PromoBanners` | Static — no changes |
| `PitakaPromotion` | Static — no changes |
| `SEOFooter` | Static — no changes |

### 4.4 Product Components

| Component | Key Changes |
|---|---|
| `ProductCard` | RRD Link, AppImage |
| `ProductImage` | Replace with AppImage |
| `ProductCarousel` | Minor cleanup |
| `ProductGrid` | Minor cleanup |
| `ProductArchive` | `useProducts()` hook instead of server action |
| `ProductDetails` | `useProductBySlug()` hook, addToCart from Zustand |

### 4.5 Category Components

| Component | Key Changes |
|---|---|
| `CategoryArchive` | `useProducts()` + `useCategoryBySlug()` hooks, RRD useParams |
| `CategorySidebar` | RRD Link |

### 4.6 Shared Components

| Component | Key Changes |
|---|---|
| `SearchDialog` | `useSearchProducts()` hook via TanStack Query |
| Filters (`components/filters/`) | Wire to RRD `useSearchParams` |

### 4.7 Checkout Components

| Component | Key Changes |
|---|---|
| `OrderSuccess` | Minor — no RRD/server deps |
| `CheckoutPage` | Cart from Zustand, createOrder via Axios, `useNavigate` |

### 4.8 Custom AppImage Component

**File:** `src/components/shared/AppImage.tsx`

```tsx
import { cn } from '@/lib/utils';

interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
}

export function AppImage({ src, alt, fill, className, ...props }: AppImageProps) {
  const fallback = '/images/placeholder.webp';

  if (fill) {
    return (
      <img
        src={src || fallback}
        alt={alt}
        className={cn('absolute inset-0 w-full h-full object-cover', className)}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = fallback; }}
        {...props}
      />
    );
  }

  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => { e.currentTarget.src = fallback; }}
      {...props}
    />
  );
}
```

---

## Phase 5 — Pages Assembly (Days 8–9)

### App.tsx Entry

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/providers/ThemeProvider';
import AppRouter from '@/router';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } } // 5min cache
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRouter />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### Page Patterns

**HomePage.tsx**
```tsx
const { data: allProducts = [] } = useProducts({ limit: 50 });
const { data: categories = [] } = useCategories();
const featured    = allProducts.filter(p => (p.discount ?? 0) > 10).slice(0, 15);
const newArrivals = [...allProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15);
const bestSellers = [...allProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 15);
```

**ProductDetailPage.tsx**
```tsx
const { slug } = useParams<{ slug: string }>();
const { data: product, isLoading } = useProductBySlug(slug!);
const { addToCart } = useCartStore();
```

**CategoryPage.tsx**
```tsx
const { slug } = useParams<{ slug: string }>();
const [searchParams] = useSearchParams();
const sort = searchParams.get('sort') ?? 'newest';
const { data: products } = useProducts({ category: slug, sort });
const { data: category } = useCategoryBySlug(slug!);
```

**SearchPage.tsx**
```tsx
const [searchParams] = useSearchParams();
const q = searchParams.get('q') ?? '';
const { data: results = [], isLoading } = useSearchProducts(q);
```

**CartPage.tsx**
```tsx
const { items, removeFromCart, updateQuantity } = useCartStore();
// Hydrate with product data by fetching each product separately
```

**CheckoutPage.tsx** — Direct port: replace `createOrder` server action with `api.post('/orders', payload)`, replace `getCartItemsWithProducts` with Zustand store + product queries.

---

## Phase 6 — Deployment (Day 10)

### 6.1 Frontend Environment

**`.env.production`**
```
VITE_API_URL=https://api.teklito.com/api
```

### 6.2 Vite Build

```bash
npm run build   # Outputs to dist/
```

### 6.3 SPA Routing (Apache)

**`dist/.htaccess`**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [L]
```

### 6.4 Laravel Environment (Production)

```dotenv
APP_URL=https://api.teklito.com
FRONTEND_URL=https://teklito.com
SANCTUM_STATEFUL_DOMAINS=teklito.com
DB_CONNECTION=mysql
DB_DATABASE=teklito_db
```

### 6.5 Laravel Deployment

```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
```

---

## Final File Structure

```
teklito-frontend/
├── index.html                          ← Poppins font import here
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── public/images/
├── src/
│   ├── main.tsx
│   ├── App.tsx                         ← QueryClient + ThemeProvider + Router
│   ├── index.css                       ← Full design token system
│   ├── providers/
│   │   └── ThemeProvider.tsx           ← Radix-based custom theme toggle
│   ├── router/
│   │   └── index.tsx
│   ├── layouts/
│   │   └── ShopLayout.tsx              ← Outlet + Header/Footer/MobileNav
│   ├── pages/                          ← 18 page components
│   ├── components/
│   │   ├── ui/                         ← Shadcn components
│   │   ├── layout/                     ← Header, Footer, MobileNav, etc.
│   │   ├── home/                       ← Hero, CategoryGrid, Promos
│   │   ├── product/                    ← Card, Details, Archive, Carousel
│   │   ├── category/                   ← CategoryArchive
│   │   ├── cart/
│   │   ├── checkout/                   ← OrderSuccess
│   │   ├── filters/
│   │   └── shared/
│   │       └── AppImage.tsx            ← Replaces next/image everywhere
│   ├── lib/
│   │   ├── api.ts                      ← Axios instance + interceptors
│   │   ├── api/
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── orders.ts
│   │   │   └── auth.ts
│   │   ├── store/
│   │   │   ├── cart.ts                 ← Zustand + persist
│   │   │   ├── wishlist.ts             ← Zustand + persist
│   │   │   └── auth.ts                 ← Zustand + persist
│   │   ├── types/
│   │   │   └── index.ts                ← Identical to current types (no changes)
│   │   └── utils.ts
│   └── hooks/
│       ├── useProducts.ts
│       ├── useCategories.ts
│       ├── useOrders.ts
│       └── useAuth.ts

teklito-api/                            ← Standalone Laravel API
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── ProductController.php
│   │   ├── CategoryController.php
│   │   ├── OrderController.php
│   │   └── AuthController.php
│   ├── Models/
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── Order.php
│   │   └── OrderItem.php
│   ├── Traits/
│   │   └── ApiResponse.php
│   └── Http/Middleware/
│       └── ForceJsonResponse.php
├── database/migrations/
├── routes/
│   └── api.php
└── config/cors.php
```

---

## Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| DB seeding (initial product data) | High | Write seeders from existing WooCommerce export, or use DB import |
| Image hosting (product images) | Medium | Host on same server or CDN; use AppImage fallback |
| Cart hydration (product data per item) | Low | TanStack Query auto-deduplicates requests per product slug |
| Auth (Sanctum cookie vs token) | Medium | Use token-based (Bearer) for SPA cross-origin — simpler than cookies |
| SEO (SPA routing) | Medium | Add `react-helmet-async` for per-page `<title>` and meta tags |
| Order number conflicts | Low | Generate unique order numbers in Laravel (UUID or prefixed sequence) |

---

## Checklist

### Phase 1: Frontend Setup
- [ ] Scaffold Vite + React + TS
- [ ] Install all dependencies
- [ ] Shadcn init (RSC: No)
- [ ] Add all Shadcn components
- [ ] Copy CSS tokens to `src/index.css`
- [ ] Add Poppins font to `index.html`
- [ ] Build ThemeProvider (Radix UI)
- [ ] Configure path aliases
- [ ] Set up React Router with all 18 routes

### Phase 2: Laravel Backend
- [ ] Create Laravel project + Sanctum
- [ ] Write all migrations + run them
- [ ] Create Eloquent models with relationships
- [ ] ApiResponse trait
- [ ] ForceJsonResponse middleware
- [ ] ProductController (index, show, search)
- [ ] CategoryController (index, show)
- [ ] OrderController (store, show, myOrders)
- [ ] AuthController (login, register, logout, user)
- [ ] CORS configuration
- [ ] Test all endpoints (Postman / Insomnia)
- [ ] Seed initial data

### Phase 3: Frontend API Layer
- [ ] Axios instance with interceptors
- [ ] `src/lib/api/products.ts`
- [ ] `src/lib/api/categories.ts`
- [ ] `src/lib/api/orders.ts`
- [ ] `src/lib/api/auth.ts`
- [ ] TanStack Query setup in App.tsx
- [ ] `useProducts`, `useProductBySlug`, `useSearchProducts` hooks
- [ ] `useCategories`, `useCategoryBySlug` hooks
- [ ] `useOrders`, `useOrderById` hooks
- [ ] `useAuth` hook
- [ ] Zustand cart store (with persist)
- [ ] Zustand wishlist store (with persist)
- [ ] Zustand auth store (with persist)

### Phase 4: Component Migration
- [ ] AppImage component
- [ ] ShopLayout (Outlet + categories)
- [ ] Header, Footer, MobileNav
- [ ] AnnouncementBar, CategoryBar, UserDropdown
- [ ] HeroSection + HeroCarousel
- [ ] CategoryGrid + CategoryCarousel
- [ ] PromoBanners, PitakaPromotion, SEOFooter
- [ ] ProductCard, ProductImage → AppImage
- [ ] ProductCarousel, ProductGrid
- [ ] ProductArchive, ProductDetails
- [ ] CategoryArchive, CategorySidebar
- [ ] SearchDialog
- [ ] Filters components
- [ ] OrderSuccess

### Phase 5: Pages
- [ ] HomePage
- [ ] ProductDetailPage
- [ ] CategoryPage
- [ ] ProductsPage
- [ ] SearchPage
- [ ] CartPage
- [ ] CheckoutPage
- [ ] LoginPage
- [ ] RegisterPage
- [ ] OrdersPage (protected)
- [ ] TrackOrderPage
- [ ] WishlistPage
- [ ] All static pages (FAQ, Contact, Privacy, Returns, Shipping, Terms)
- [ ] NotFoundPage

### Phase 6: Deployment
- [ ] Production .env files
- [ ] `npm run build`
- [ ] SPA `.htaccess` for Apache
- [ ] Laravel production env + optimize
- [ ] CORS production domains set
- [ ] Full smoke test (all routes, cart flow, checkout, auth)
