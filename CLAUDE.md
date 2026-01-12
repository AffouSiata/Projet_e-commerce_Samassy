# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a French e-commerce website for selling software licenses and keys (Windows, Office, Antivirus, VPN, etc.). It is a Next.js 15 application with App Router that connects to a backend API for product data, cart management, and order processing.

## Working Directory

**IMPORTANT**: All development commands must be run from the `frontend/` directory. The project root contains only documentation - all source code is in `frontend/`.

```bash
cd frontend
```

## Commands

Run these commands from the `frontend/` directory:

```bash
# Development server (runs on port 3000 by default)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.0.3 with App Router
- **Styling**: Tailwind CSS 3.4 with custom brand colors
- **Icons**: lucide-react
- **Language**: TypeScript with strict mode
- **HTTP Client**: axios for API calls
- **State Management**: React Context API + localStorage

### API Integration

The application connects to a backend API at `https://licences-api.onrender.com/api`:

- **Authentication**: JWT-based with access/refresh tokens stored in localStorage
- **Session Management**: Cookies with `withCredentials: true` for cart persistence
- **API Client**: Configured in `lib/api.ts` with automatic token refresh on 401 errors
- **Type Definitions**: All API types defined in `types/api.ts` matching backend schema

Available API modules (imported from `@/lib/api`):
- `authApi` - login, register, getMe, refresh, logout
- `categoriesApi` - getAll, getById, getBySlug, create, update, toggle, delete, restore
- `productsApi` - getAll, getById, getBySlug, create, update, toggle, delete, restore
- `cartApi` - get, addItem, updateItem, removeItem, clear
- `ordersApi` - create, getAll, getById, getByOrderNumber, updateStatus, cancel
- `healthApi` - check

### Project Structure
```
frontend/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout with CartProvider
│   ├── page.tsx          # Homepage
│   ├── globals.css       # Global styles + Tailwind
│   ├── a-propos/         # About page
│   ├── contact/          # Contact page
│   ├── faq/              # FAQ page
│   ├── connexion/        # Login page
│   ├── inscription/      # Registration page
│   ├── mot-de-passe-oublie/ # Password reset
│   ├── categorie/[slug]/ # Dynamic category pages
│   ├── produit/[id]/     # Product detail page
│   ├── boutique/         # Product listing with filters
│   ├── panier/           # Shopping cart page
│   ├── commande/         # Checkout form + confirmation
│   ├── compte/           # Account dashboard + subpages
│   ├── cgv/              # Terms and conditions
│   ├── mentions-legales/ # Legal notices
│   └── confidentialite/  # Privacy policy
├── components/           # Reusable React components
│   ├── Header.tsx        # TopBar + main header + nav bar
│   ├── Hero.tsx          # HeroSlider component
│   ├── Categories.tsx    # Product category grid
│   ├── FeaturedProducts.tsx
│   ├── BestSellers.tsx   # Horizontal scrolling carousel
│   ├── Advantages.tsx    # Why choose us section
│   ├── Testimonials.tsx  # Customer reviews carousel
│   ├── CartModal.tsx     # Slide-out cart panel
│   ├── ProtectedRoute.tsx # Auth guard wrapper component
│   └── Footer.tsx
├── context/
│   └── CartContext.tsx   # Cart state management with API integration
├── lib/
│   └── api.ts            # Axios client + API modules
├── types/
│   └── api.ts            # TypeScript types for API entities
└── public/
    ├── logo.jpeg         # Brand logo
    └── products/         # Product images (jpg, webp, png)
```

### Brand Colors (defined in tailwind.config.ts)
- `brand-red`: #E63946 - Primary accent, discounts, CTAs
- `brand-blue`: #1D70B8 - Primary brand color, navigation
- `brand-blue-light`: #3B9DE8 - Gradients, hover states

### Component Patterns
- All interactive components use `'use client'` directive (Client Components for hooks/events)
- Server Components by default (pages without `'use client'`)
- Components use lucide-react icons with consistent sizing (typically 20-22px)
- Consistent styling: rounded corners (2xl/3xl), gradient backgrounds, shadow-premium classes
- Responsive grid patterns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Hover animations: `transition-all duration-300`, `hover:scale-105`
- Gradient buttons: `bg-gradient-to-r from-[#1D70B8] to-[#1558A0]`
- Next.js Image component used for optimized images with absolute paths from `/public`

### Custom CSS Classes (defined in globals.css)
- `shadow-premium`: Subtle card shadow `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08)`
- `shadow-premium-lg`: Larger shadow for elevated elements
- `animate-fadeInUp`: Entry animation for sections
- `animate-slideDown`: Header sticky animation on scroll

### Path Aliases & TypeScript
- `@/*` maps to the frontend root (e.g., `@/components/Header`, `@/lib/api`, `@/types/api`)
- TypeScript strict mode is enabled
- Next.js 15 uses TypeScript for config files (next.config.ts, tailwind.config.ts)

### State Management

**Cart Context** (`context/CartContext.tsx`):
- Manages cart state via backend API calls
- Automatically syncs with API on mount and after every operation
- Provides: `items`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `totalItems`, `totalPrice`, `loading`, `error`, `refreshCart`
- Access via `useCart()` hook (must be used within `CartProvider`)
- Cart items include: `{ id, productId, name, price, originalPrice, image, quantity, product }`

**Authentication**:
- Tokens stored in localStorage (`accessToken`, `refreshToken`)
- Automatic token refresh on 401 errors via axios interceptor
- Helper functions: `getAccessToken()`, `setAccessToken()`, `getRefreshToken()`, `setRefreshToken()`, `clearTokens()`

### Data Flow
1. Pages/components fetch data from API using functions from `@/lib/api`
2. Cart operations go through CartContext which calls `cartApi`
3. All API calls include JWT token automatically via axios interceptor
4. Session cookies are sent with `withCredentials: true` for cart persistence
5. TypeScript types from `@/types/api` ensure type safety across the app

### Language
All UI text is in French. The site targets French-speaking users. Prices are displayed in CFA francs (XOF). API requests include `x-lang: fr` header.

### Data Layer Services

**Product & Category Services** (`lib/productService.ts`):
- Wrapper around API calls with built-in caching and transformation
- `productService.getProducts()`, `getProductById()`, `getProductBySlug()`
- `categoryService.getCategories()`, `getCategoryById()`, `getCategoryBySlug()`
- Automatically transforms API data to display-friendly format via `transforms.ts`

**Caching** (`lib/cache.ts`):
- In-memory cache with TTL (Time To Live)
- Products cached for 10-30 minutes, categories for 5 minutes
- Automatic cleanup every 10 minutes
- Use `cache.get()`, `cache.set()`, `cache.delete()`, `cache.clear()`

**Data Transformations** (`lib/transforms.ts`):
- Converts API types to display-friendly `DisplayProduct` and `DisplayCategory` interfaces
- Maps `comparePrice` to `originalPrice` for discount calculations
- Provides utility functions: `calculateDiscount()`, `formatPrice()` (outputs in CFA)
- Display interfaces add frontend-only fields like `rating` and `reviews` (defaulted to 0)

### Key Implementation Patterns

**Fetching Data in Pages**:
```typescript
// Prefer productService over direct API calls for caching benefits
import { productService } from '@/lib/productService';

// In Server Component
const { data: products } = await productService.getProducts({ featured: true });
```

**Working with Cart**:
```typescript
// In Client Component
'use client';
import { useCart } from '@/context/CartContext';

const { items, addToCart, totalPrice, loading } = useCart();
await addToCart(productId, quantity);
```

**Protected Routes**:
```typescript
// Wrap page content with ProtectedRoute for auth-required pages
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      {/* Page content */}
    </ProtectedRoute>
  );
}
```

### Image Handling
- Product images stored in `/public/products/`
- Use Next.js Image component with absolute paths: `<Image src="/products/image.jpg" />`
- Logo at `/public/logo.jpeg`
- Supported formats: jpg, webp, png

### Additional Resources
- **API Documentation**: See `API_DOCUMENTATION copy.md` in the project root for complete backend API reference
- **Backend API Base URL**: `https://licences-api.onrender.com/api`
- **Swagger UI**: `https://licences-api.onrender.com/api/docs`
