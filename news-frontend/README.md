# Products Frontend (Next.js)

## Overview

This is the **Next.js frontend** for the Product Scraper project. It displays the scraped products with a clean, user-friendly UI, utilizing both **Server-Side Rendering (SSR)** and **Client-Side Rendering (CSR)** to balance SEO, performance, and real-time updates.

---

## Features

- **Server-Side Rendering (SSR)** for fast initial load and SEO.
- **Client-Side Rendering (CSR)** with **React Query** for live updates.
- Product grid and pagination.
- Product slider (carousel) showcasing product images.
- Polling every 30 seconds to keep product list fresh.
- Modular, reusable React components.

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/amr33mohamd/products-frontend.git
cd products-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Set the backend API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Running The Project

```bash
npm run dev
```

Visit:

```
http://localhost:3000/products
```

---

## Project Structure

```
/components
  └── Products
      ├── ProductCard.tsx
      ├── ProductGrid.tsx
      ├── ProductPagination.tsx
      ├── ProductSlider.tsx
      └── ProductsClient.tsx
/hooks
  └── useProductsClient.ts
  └── useProducts.ts
/types
  └── product.ts
/pages
  └── /products/page.tsx
```

---

## How It Works

### **Server-Side Rendering (SSR):**
- `ProductsPage` uses `getServerSideProps` (or server component with `async` data fetching) to load the first page of products.
- Ensures content is available immediately on first load.
- SEO benefits.

### **Client-Side Rendering (CSR):**
- `ProductsClient` uses **React Query** to manage client state.
- Polling interval of **30 seconds** keeps the product list updated in real time.
- Improves user experience without reloading the page.

### **Hydration:**
- Server-fetched data is passed as `initialData` to React Query to avoid double-fetching.

---

## Why Use Both SSR & CSR?

| Reason                                | Benefit                                       |
|--------------------------------------|-----------------------------------------------|
| **SSR for first load & SEO**          | Fast page load + crawlable content            |
| **CSR for real-time updates**         | No need to refresh page, improves UX          |
| **Hydration with initial data**       | Data fetched on server passed to client       |
| **Efficient combination**             | Balance of performance, SEO, and interactivity|

---

## Technologies Used

- **Next.js 13+**
- **React Query (TanStack)**
- **Tailwind CSS**
- **Keen Slider** (Product slider)

---

## Customization

- To change API URL → `.env.local` → `NEXT_PUBLIC_API_URL`.
- To adjust refresh interval → edit `refetchInterval` in `useProductsClient`.
- Easy to add filtering, sorting, or other UI improvements.

---

## Contributing

Feel free to contribute! Fork, improve & open a PR.

---

## License

MIT

