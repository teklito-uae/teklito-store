# 🚀 Teklito UI Enhancement Plan
> Created: April 2026 | Scope: Frontend Web & Mobile View
> Based on live browser audit of `localhost:5173` across desktop (~1280px) and mobile (~390px) viewports.

---

## 🎯 Design Philosophy Reminder

> **High-density, premium tech aesthetic.** Every element should feel like it was designed for a flagship hardware product launch. No generic spacing, no placeholder content, no unnecessary white space.

---

## 📋 Phase 1 — Critical Data & Content Fixes (Do First)

These are broken or missing data issues that damage credibility, regardless of how good the design is.

### 1.1 Product Name in Order Items (TrackOrderPage)
- **Issue:** `product_name` field stores "Product" literal string — actual name is not being saved during checkout.
- **Fix:** In `CheckoutPage.tsx` → `itemsForApi` mapping, `product.name` is passed correctly, but the backend `ApiController.php` line `'product_name' => $productData['name'] ?? 'Product'` sometimes falls to the fallback.
- **Root Cause:** The camelCase transformer converts `productName` back to camelCase, but the API receives `name` not `productName` from the nested product object.
- **Action:** Ensure the item data shape sent to the API always has a reliable `name` field and update the backend to log what it receives.

### 1.2 Shipping Address & Payment Method Field Naming
- **Issue:** `payment_method` on `order` object is NOT being camelCased by the transformer, causing the payment method pill to always show "Online Payment" even for COD orders.
- **Fix:** Verify that `order.paymentMethod` (camelCase) is used instead of `order.payment_method` in `TrackOrderPage.tsx`.

---

## 📋 Phase 2 — Layout & Structure Overhaul

### 2.1 ProductsPage — Add Sidebar Filter

**Current State:** Only sort pills, no category/price filtering. Dead-end UX for users browsing.

**Enhancement Plan:**
- Add a **left sidebar** on desktop (lg+) with:
  - Category filter checkboxes (from API `/categories`)
  - Price range slider (`AED 0 — AED 10,000`)
  - In Stock toggle
  - Rating filter (stars)
- On mobile: collapse sidebar into a bottom drawer triggered by a **"Filters"** floating action button
- Add active filter chips at the top of the grid showing applied filters with an `x` to remove them
- Show `X results` count dynamically as filters change

**Component:** Refactor `ProductsPage.tsx` from 60 lines into a proper layout with `<ProductFilterSidebar />` + `<ProductGrid />` components.

---

### 2.2 HomePage — Section Header Scaling

**Current State:** Section headers like "EXPLORE ALL PRODUCTS" use very large uppercase text on mobile, consuming excess vertical space before any content.

**Enhancement Plan:**
- Reduce hero section h1 font-size on mobile
- Add a horizontal **scroll-snap category pill row** just below the hero (like Apple Store category pills) for quick filtering
- The "Latest Tech Insights" blog section should be compressed on mobile
- Add a "Recently Viewed" section that appears after the user browses at least 3 products

---

### 2.3 CartPage — Mobile UX Refinement

**Current State:** Order summary is buried below all cart items on mobile, requiring heavy scrolling to find the Checkout button.

**Enhancement Plan:**
- **Sticky bottom CTA on mobile:** Show a sticky bar with `AED XXXX.XX | Checkout →` always visible
- Move trust badges to a compact horizontal row ABOVE the checkout button
- Add **quantity stepper redesign** matching the ProductDetailPage style (dark bg, primary color icons)
- Add a **"Save for Later"** button on each item that moves it to the wishlist

---

### 2.4 ProductDetailPage — "You May Also Like" Section

**Current State:** Related products use `lg:grid-cols-6` making cards very small on desktop. Layout feels crowded.

**Enhancement Plan:**
- Change to a **horizontal scroll carousel** on both mobile and desktop
  - `overflow-x-auto`, `scroll-snap-type: x mandatory`
  - Show 2 cards on mobile, 3.5 on tablet, 5 on desktop (partial visible = more swipeable)
- Add left/right scroll chevron buttons on desktop
- "You May Also Like" → "From the Same Category" for more specificity

---

### 2.5 Header — Desktop Mega Menu

**Current State:** Desktop nav shows category names as flat links. No preview, no subcategory hints.

**Enhancement Plan:**
- On hover of category links, show a **Mega Menu dropdown** with:
  - Category icon and description
  - 4–6 top products in that category with thumbnail + price
  - "View All →" link
- Animate with `opacity + translateY` transition
- Build as a `<MegaMenu />` component

---

## 📋 Phase 3 — Visual & Aesthetic Polish

### 3.1 Category Cards — HomePage Upgrade

**Current State:** Colored backgrounds with emoji icons. Functional but not premium enough.

**Enhancement Plan:**
- Replace emoji icons with **Lucide icons** appropriate for each category:
  - Smartphones → `Smartphone` | Laptops → `Laptop` | Audio → `Headphones`
  - Cameras → `Camera` | Gaming → `Gamepad2` | Wearables → `Watch`
- Add a subtle faded product image as card background on hover
- On hover: gradient overlay slides up with "View XX Products →" text
- Consider **asymmetric bento grid** (1 wide + 2 narrow) on desktop

---

### 3.2 ProductCard — Premium Micro-interactions

**Current State:** Basic hover scale + border color change. Add-to-cart button only appears on hover.

**Enhancement Plan:**
- Subtle **glow on hover** using `box-shadow` with primary color
- Wishlist heart button always visible (top-right) with fill animation on click
- **Stock status pill** directly on card thumbnail overlay
- **"X people bought this today"** social proof on high-rating products
- Image scale on hover via `group-hover:scale-105` on the `<img>` element (card itself stays static)

---

### 3.3 CheckoutPage — Trust & Conversion Uplift

**Current State:** Functional but dry. No visual urgency or trust signals.

**Enhancement Plan:**
- Add a **progress stepper** at the top: `Shipping → Payment → Review → Confirm`
- Make the COD card visually dominant with a "Most Popular in UAE" badge
- Add "🔒 Secure checkout · 256-bit SSL" badge near the submit button
- **Order summary thumbnail strip** in the sidebar (product images visible)
- "Estimated delivery: 1-3 business days in UAE" beneath the submit button

---

### 3.4 TrackOrderPage — Timeline Upgrade

**Current State:** Horizontal progress bar with 4 steps. Static and hard to read on mobile.

**Enhancement Plan:**
- On mobile: replace horizontal progress bar with a **vertical timeline**
  - Each step: icon + label + timestamp + estimated note
  - Pulsing animation on current step
- Add **"Copy Order Number"** button (clipboard icon) next to the order number
- Add **WhatsApp support CTA** button: `"Chat Support on WhatsApp →"` with green background

---

### 3.5 MobileNav — Bottom Tab Bar Enhancement

**Current State:** Good implementation. Needs polish.

**Enhancement Plan:**
- Add **active state indicator** (small dot/underline above active icon)
- Auto-hide on scroll down, reveal on scroll up (like Instagram native app)
- Add **wishlist count badge** to the Wishlist tab icon
- Scale-pulse micro-animation on tab tap

---

### 3.6 SearchDialog — Results Enhancement

**Current State:** Results may not show images or prices prominently.

**Enhancement Plan:**
- Show product thumbnail images in results
- Group results by category with a label divider
- Add **keyboard navigation** (↑↓ arrows, Enter to navigate)
- Show recent searches when input is empty
- "No results" empty state with suggested popular products

---

## 📋 Phase 4 — New Pages & Features

### 4.1 Comparison Page (`/compare`)
- Compare up to 3 products side-by-side in a table layout
- Add a "Compare" toggle checkbox to `ProductCard`
- Sticky comparison bar at bottom when products are selected

### 4.2 Enhanced Profile/Dashboard (`/profile`)
- **Order history timeline** (compact version of TrackOrderPage)
- **Recently viewed products** section
- **Saved addresses** management UI
- Stats row: Total Orders | Total Spent | Wishlist Items

### 4.3 404 NotFoundPage — Upgrade
- Animated glitch effect on "404" text
- Popular categories shown below
- Search input directly on the 404 page

---

## 📋 Phase 5 — Performance & Accessibility

### 5.1 Image Loading
- `loading="lazy"` on all below-fold images
- `blur-up` placeholder technique for product images
- WebP sources with `<picture>` fallback for hero images

### 5.2 Skeleton Screens
- Loading skeletons for TrackOrderPage during fetch
- Ensure `ProductCard` skeletons match actual card dimensions exactly

### 5.3 Touch Targets
- All interactive elements: minimum `44x44px` tap target on mobile
- Verify mobile nav tab areas meet this threshold

---

## 🗺️ Implementation Priority Matrix

| Enhancement | Impact | Effort | Priority |
|---|---|---|---|
| Fix product name saved as "Product" in orders | 🔥 Critical | Low | P0 |
| Fix `paymentMethod` camelCase in TrackOrderPage | 🔥 Critical | Low | P0 |
| CartPage sticky mobile CTA | 🔴 High | Low | P1 |
| ProductsPage sidebar filters | 🔴 High | High | P1 |
| Related products carousel on ProductDetailPage | 🟠 Medium | Medium | P1 |
| Category card icon upgrade | 🟠 Medium | Medium | P2 |
| TrackOrderPage vertical timeline (mobile) | 🟠 Medium | Medium | P2 |
| ProductCard always-visible wishlist + stock pill | 🟡 Medium | Low | P2 |
| Checkout trust elements + stepper | 🟡 Medium | Low | P2 |
| Header Mega Menu | 🟡 Medium | High | P3 |
| SearchDialog enrichment | 🟡 Medium | Medium | P3 |
| Comparison page | 🟢 Nice | High | P4 |
| Profile dashboard upgrade | 🟢 Nice | High | P4 |
| 404 page upgrade | 🟢 Nice | Low | P4 |

---

## 🎨 Design Tokens Reminder

```css
--primary: oklch(85% 0.25 130);   /* Lime/Neon accent */
--font-sans: 'Inter', 'Outfit', system-ui;
--radius-card: 2rem;              /* rounded-[2rem] */
--radius-btn: 0.75rem;            /* rounded-xl */
--shadow-premium: 0 20px 60px -10px rgb(0 0 0 / 0.3);
```

**Typography scale:**
- Labels: `text-[9px] lg:text-[10px] uppercase tracking-widest font-black`
- Body: `text-sm font-medium text-zinc-600`
- Headings: `text-2xl lg:text-3xl font-black uppercase tracking-tight`
- Hero: `text-4xl md:text-5xl font-black uppercase tracking-tight`

---

> **Next Step:** Start implementation with P0 fixes, then tackle P1 items. Each phase should be committed separately to `teklito_dev` to trigger incremental production deployments.
