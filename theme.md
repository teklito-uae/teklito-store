# Teklito Store — Design System & Theme Reference

> **Status:** Active  
> **Stack:** React + Vite + Shadcn UI + Tailwind CSS v4  
> **Purpose:** Single source of truth for all visual styles. All migrations and new components MUST reference this document.

---

## 1. Brand Identity

| Token | Value |
|---|---|
| Brand Name | **TEKLITO** |
| Brand Voice | Premium Tech Retail · UAE-focused · Bold · Clean |
| Default Mode | **Light** (Dark mode fully supported) |
| Currency | AED (UAE Dirham) |

---

## 2. Color System

All colors are defined as HSL CSS custom properties and consumed via Tailwind v4's `@theme` block.

### 2.1 Semantic Tokens (Light Mode `:root`)

| Token | HSL | Hex Approx | Usage |
|---|---|---|---|
| `--background` | `0 0% 100%` | `#FFFFFF` | Page background |
| `--foreground` | `0 0% 0%` | `#000000` | Body text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `0 0% 0%` | `#000000` | Card text |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Dropdowns, popovers |
| `--popover-foreground` | `0 0% 0%` | `#000000` | Popover text |
| `--primary` | `73 100% 51%` | `#C7F502` | **Lime Green** — CTAs, accents, highlights |
| `--primary-foreground` | `0 0% 0%` | `#000000` | Text on primary (black on lime) |
| `--secondary` | `0 0% 96%` | `#F5F5F5` | Secondary surfaces |
| `--secondary-foreground` | `0 0% 0%` | `#000000` | Secondary text |
| `--muted` | `0 0% 96%` | `#F5F5F5` | Muted backgrounds |
| `--muted-foreground` | `0 0% 40%` | `#666666` | Placeholder, label text |
| `--accent` | `73 100% 51%` | `#C7F502` | Same as primary (hover accents) |
| `--accent-foreground` | `0 0% 0%` | `#000000` | Text on accent |
| `--destructive` | `0 84% 60%` | `#F05252` | Error states, delete actions |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Text on destructive |
| `--border` | `0 0% 90%` | `#E5E5E5` | Borders, dividers |
| `--input` | `0 0% 90%` | `#E5E5E5` | Input borders |
| `--ring` | `73 100% 51%` | `#C7F502` | Focus rings |
| `--radius` | `0.75rem` | `12px` | Base border radius |

### 2.2 Semantic Tokens (Dark Mode `.dark`)

| Token | HSL | Hex Approx | Usage |
|---|---|---|---|
| `--background` | `0 0% 0%` | `#000000` | Pure black page background |
| `--foreground` | `0 0% 100%` | `#FFFFFF` | White body text |
| `--card` | `0 0% 7%` | `#111111` | Dark card surfaces |
| `--card-foreground` | `0 0% 100%` | `#FFFFFF` | Card text |
| `--popover` | `0 0% 7%` | `#111111` | Dark popovers |
| `--popover-foreground` | `0 0% 100%` | `#FFFFFF` | Popover text |
| `--primary` | `73 100% 51%` | `#C7F502` | Lime Green — unchanged |
| `--primary-foreground` | `0 0% 0%` | `#000000` | Black on lime |
| `--secondary` | `0 0% 10%` | `#1A1A1A` | Dark secondary surfaces |
| `--secondary-foreground` | `0 0% 100%` | `#FFFFFF` | White text |
| `--muted` | `0 0% 10%` | `#1A1A1A` | Dark muted surfaces |
| `--muted-foreground` | `0 0% 60%` | `#999999` | Light gray text |
| `--accent` | `73 100% 51%` | `#C7F502` | Lime Green accent |
| `--accent-foreground` | `0 0% 0%` | `#000000` | Black on accent |
| `--destructive` | `0 84% 60%` | `#F05252` | Errors |
| `--border` | `0 0% 15%` | `#262626` | Dark borders |
| `--input` | `0 0% 15%` | `#262626` | Dark input |
| `--ring` | `73 100% 51%` | `#C7F502` | Lime focus ring |

### 2.3 Brand Primary Color

Lime Green: hsl(73, 100%, 51%) | Hex: #C7F502 | RGB: rgb(199, 245, 2)

> **Rule:** Never use the raw hex in component code. Always use `var(--primary)` or Tailwind's `bg-primary`, `text-primary`, `border-primary`.

### 2.4 Chart Colors

| Token | Light | Dark | Note |
|---|---|---|---|
| `--chart-1` | `73 100% 51%` | `73 100% 51%` | Lime Green |
| `--chart-2` | `0 0% 0%` | `0 0% 100%` | Black / White |
| `--chart-3` | `0 0% 60%` | `0 0% 60%` | Gray |
| `--chart-4` | `73 100% 51%` | `73 100% 51%` | Lime Green |
| `--chart-5` | `0 0% 30%` | `0 0% 40%` | Dark Gray / Medium Gray |

---

## 3. Typography

### 3.1 Font Family

| Role | Font Stack |
|---|---|
| **Primary (sans)** | `'Poppins', system-ui, -apple-system, sans-serif` |
| **Mono** | `'Geist Mono', monospace` (dev/code only) |

> **Rule:** Poppins is the brand font. Load from Google Fonts in `index.html`.

Google Fonts URL: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap`

### 3.2 Type Scale

#### Desktop (>= 769px)

| Token | CSS Var | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | `--fs-h1` | `4rem` / 64px | 700 Bold | 1.1 | -0.02em |
| H2 | `--fs-h2` | `2.5rem` / 40px | 700 Bold | 1.2 | -0.01em |
| H3 | `--fs-h3` | `1.75rem` / 28px | 600 Semibold | 1.3 | — |
| H4 | `--fs-h4` | `1.125rem` / 18px | 600 Semibold | 1.4 | — |
| H5 | `--fs-h5` | `1rem` / 16px | 600 Semibold | 1.4 | — |
| Body | `--fs-body` | `1rem` / 16px | 400 Regular | 1.6 | — |
| Small | `--fs-small` | `0.8125rem` / 13px | 400 | — | — |
| Badge | `--fs-badge` | `0.625rem` / 10px | 700 Bold | — | 0.3em |

#### Mobile (<= 768px)

| Token | CSS Var | Size |
|---|---|---|
| H1 | `--fs-h1` | `2rem` / 32px |
| H2 | `--fs-h2` | `1.5rem` / 24px |
| H3 | `--fs-h3` | `1.25rem` / 20px |
| H4 | `--fs-h4` | `1rem` / 16px |
| H5 | `--fs-h5` | `0.875rem` / 14px |
| Body | `--fs-body` | `0.875rem` / 14px |
| Small | `--fs-small` | `0.75rem` / 12px |

### 3.3 Font Weights

| Token | Value | Usage |
|---|---|---|
| `--fw-light` | 300 | Supporting text, captions |
| `--fw-regular` | 400 | Body copy |
| `--fw-medium` | 500 | UI labels, navigation |
| `--fw-semibold` | 600 | Section headings, subheadings |
| `--fw-bold` | 700 | H1, H2, CTAs, badges |

### 3.4 Typography Patterns

```
Page headline:  text-3xl md:text-4xl font-black uppercase tracking-tight
Section badge:  text-[10px] font-black uppercase tracking-[0.3em]
Nav links:      text-[12px] font-bold tracking-wider uppercase
Card title:     text-[11px] font-bold uppercase tracking-tight
Price:          text-2xl font-black tracking-tighter
Label:          text-[10px] font-black uppercase tracking-widest
```

---

## 4. Spacing and Layout

### 4.1 Container

Max-width: 1440px | Padding: 1rem (px-4) | Centered: mx-auto

### 4.2 Section Padding

| Context | Classes | Values |
|---|---|---|
| Standard section | `py-12 md:py-16` | 48px / 64px |
| Hero sections | `py-16 md:py-24` | 64px / 96px |
| Compact sections | `py-8 md:py-12` | 32px / 48px |

### 4.3 Border Radius Scale

| Token | Value |
|---|---|
| `--radius-sm` | 8px |
| `--radius-md` | 10px |
| `--radius-lg` | 12px (base) |
| `--radius-xl` | 16px |
| `--radius-2xl` | 20px |
| `--radius-3xl` | 24px |
| `--radius-4xl` | 28px |

Component-specific radii:
- Feature cards: `rounded-[2rem]` (32px)
- Auth card: `rounded-[2.5rem]` (40px)
- Inputs (checkout): `rounded-[5px]` (sharp)
- Auth inputs/buttons: `rounded-2xl` (16px)

---

## 5. Shadow and Glow System

### 5.1 Box Shadows

| Class | Usage |
|---|---|
| `shadow-2xl shadow-zinc-200/50` | Card (login, product) |
| `shadow-xl shadow-black/5` | Hover state on feature cards |
| `shadow-lg shadow-black/10` | Submit buttons |
| `shadow-2xl shadow-primary/40` | Processing overlay icon |

### 5.2 Glow Effects

```
Light mode:
--glow-primary:        0 0 20px rgba(199, 245, 2, 0.4)
--glow-primary-strong: 0 0 35px rgba(199, 245, 2, 0.6)

Dark mode:
--glow-primary:        0 0 25px rgba(199, 245, 2, 0.3)
--glow-primary-strong: 0 0 45px rgba(199, 245, 2, 0.5)
```

Utility classes: `.glow-primary`, `.glow-primary-strong`

---

## 6. Animation and Motion

### 6.1 Scroll Behavior

`html { scroll-behavior: smooth; }`

### 6.2 Header Scroll Transition

- **Default:** `bg-white border-zinc-100`
- **Scrolled:** `bg-black/95 backdrop-blur-md border-zinc-900`
- **Transition:** `duration-300`

### 6.3 Framer Motion Patterns

- Processing pulse: `scale: [1, 1.05, 1]`, duration 1.5s, infinite
- Loading: `scale + opacity` wave, duration 2s, infinite, easeInOut
- Progress bar: `x: -100% -> 100%`, duration 1.2s, infinite, easeInOut
- Page entry: `animate-in fade-in slide-in-from-right-4 duration-300`

### 6.4 Hover Micro-interactions

- Icon scale: `group-hover:scale-110 transition-transform duration-500`
- Card elevation: `hover:shadow-xl transition-all duration-300`
- Nav underline: `scale-x-0 -> group-hover:scale-x-100 transition-transform origin-left`

---

## 7. Background Patterns

### 7.1 Cyber Grid

```css
.bg-cyber-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
}
```

### 7.2 Section Alternation Pattern

- White: `bg-white`
- Off-white: `bg-zinc-50/50` or `bg-[#FAFAFA]`
- Dark: `bg-black` (hero overlays, processing screen)

---

## 8. Component Conventions

### 8.1 Shadcn UI Config (React + Vite)

- Style: `default`
- RSC: `false` (React SPA, not Next.js)
- Base color: `zinc`
- CSS Variables: `true`
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`

### 8.2 Shadcn Components Used

| Component | Notes |
|---|---|
| `Button` | Primary: bg-black, Outline: border-zinc-100 |
| `Input` | h-12 or h-14, rounded-[5px] or rounded-2xl |
| `Label` | 10px font-black uppercase tracking-widest |
| `Card`, `CardContent` | border-zinc-100, custom radius |
| `RadioGroup` | Payment method selection |
| `Badge` | Lime green + black text |
| `Dialog` / `Command` | Search palette (cmdk) |
| `Slider` | Price filter |
| `Sonner` | Toast notifications |

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 768px | Reduced type, mobile nav |
| Tablet | 768px – 1024px | `md:` prefix |
| Desktop | >= 1024px | `lg:` prefix, sticky header, desktop nav |
| Wide | >= 1280px | `xl:` prefix, max container |

---

## 10. Currency and Locale

| Setting | Value |
|---|---|
| Currency | AED (UAE Dirham) |
| Format | `AED {amount.toFixed(2)}` |
| Free Shipping Threshold | AED 200 |
| Standard Shipping Fee | AED 20 |
| Target Market | UAE |
