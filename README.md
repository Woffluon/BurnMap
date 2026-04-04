<div align="center">

# 🔥 Burnmap

**Enterprise-Grade Real-Time Global Wildfire Monitoring**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-Schema_Validation-3068b7?style=flat-square)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-FCC72C?style=flat-square&logo=vitest)](https://vitest.dev/)

Burnmap is a high-performance, production-ready web application built to visualize active wildfires globally using real-time data from the NASA EONET (Earth Observatory Natural Event Tracker) API. Developed with stringent Next.js App Router patterns, strictly-typed TypeScript, and modern React 19 server/client composition.

</div>

---

## 🏗 Architecture & Engineering Principles

This project adheres to top-tier frontend architecture principles, balancing maximum server performance with dynamic client interactivity.

- **React Server Components (RSC) First:** Core data fetching (NASA API), geographic data transformation (GeoJSON), and i18n dictionaries are entirely computed on the server. Zero unnecessary JavaScript is sent to the client.
- **Client-Side Optimization & Lazy Loading:** Map engines (`mapbox-gl` and `maplibre-gl`/OpenFreeMap) are strictly heavy dependencies. They are dynamically imported with `next/dynamic` and code-split so the user's browser only downloads the specific mapping engine currently active.
- **Strictly Typed API Contracts:** NASA API responses are parsed and validated strictly at the network boundary using **Zod**. Network or schema validation failures gracefully cascade to resilient error boundaries and safe fallbacks without breaking the UI.
- **Agnostic Map Engine Abstraction:** Implements a dual-map engine architecture supporting commercial **Mapbox** and community-maintained **OpenFreeMap** (MapLibre), easily toggled via abstract map provider wrappers.
- **Isomorphic i18n:** Clean localization architecture supporting both English and Turkish, utilizing dictionaries completely injected from the RSC layer—meaning translations have a zero-byte overhead on the main client bundle.

## ✨ Core Features

- 🌍 **NASA EONET Integration:** Live geospatial fetching using standard `fetch` with App Router caching semantics (`revalidate`).
- 🗺️ **Dual Rendering Geovisualization:** Switch on the fly between Mapbox and OpenFreeMap. Incorporates Fly-To interactions from a fully responsive sidebar list.
- 🌓 **Persistent End-User Preferences:** Dark/Light themes, Map Providers, and Modals persist cleanly utilizing a custom local storage hook model. 
- ♿ **Strict Accessibility (a11y):** ARIA tags, polite live regions for map load states, keyboard-navigable incident lists, and strict semantic HTML wrapping.
- ⚡ **Tailwind v4 Styling:** Modern, highly scalable utility-class styling focusing on fluid layouts without layout shifts during dynamic loading phases (`<Suspense>` fallback skeletons).

## 🗂️ Project Structure

An elite engineering structure designed for scalability and clear separation of concerns:

```plaintext
src/
├── app/               # Next.js 15+ App Router entrypoints (RSC heavily utilized)
│   ├── page.tsx       # Streaming data ingestion & SSR rendering
│   ├── layout.tsx     # Root layout & global CSS wrappers
│   ├── loading.tsx    # Suspense fallback strategies for layout shift prevention
│   └── error.tsx      # Graceful Next.js error boundaries
├── components/        # Isolated, composable UI pieces
│   ├── map/           # Code-split dynamic map components (Mapbox / Libre engines)
│   └── ...            # Shell, i18n switcher, and modal elements
├── lib/               # Pure business logic and domain entities
│   ├── i18n/          # Zero-byte runtime translation dictionaries
│   ├── map/           # Core map utilities
│   └── nasa/          # API abstraction layer
│       └── eonet/     # Strictly-typed data access objects and Zod schemas
└── env.ts             # T3 Env style rigorous environment variable validation
```

## 🛠️ Local Development & Setup

### Prerequisites

Ensure you have **Node.js (>=20)** and a package manager (npm, yarn, pnpm, bun) installed.

### 1. Installation

Clone the repository and install all dependencies:

```bash
git clone <repository-url>
cd burnmap
npm install
```

### 2. Environment Variables

We enforce environment variable safety at build and runtime. Copy the template to `.env.local`:

```bash
cp .env.example .env.local
```

Populate `.env.local` to fit your setup:
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` (optional): Required to enable the premium Mapbox layer. If omitted, the engine safely degrades solely to OpenFreeMap.

### 3. Running the Server

Start the Next.js development server with hot-module replacement (HMR):

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## 🧪 Testing Strategy

To ensure zero regressions across map logic and schema hydration, the project incorporates **Vitest** for uncompromised unit testing. Tests validate boundary outputs of the pure functions and API adapters.

```bash
# Execute test suite
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🛡️ Best Practices Utilized

- **No `any` usage:** Fully strict TypeScript configurations.
- **Data Encapsulation:** Fetch logic is decoupled from UI presentation (e.g., `fetchEonetEvents` acts as a pure, testable API service layer).
- **Graceful Degradation:** If NASA servers are slow or unreachable, static fallbacks and error handling ensure that rendering continues smoothly.
- **Bundle Diet:** Unused components are systematically eliminated via precise `import` paths and dynamic module loading.

## 📄 License

This project is open-source and licensed under the **MIT License**.
