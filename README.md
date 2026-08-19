# Skillpath — Archival Course Catalog Component

A responsive, Framer-compatible React + TypeScript course catalog component featuring an authentic library-catalog design system, independent resilient API endpoints, fault-tolerant state isolation, and custom Framer property controls.

## Tech Stack
* **Framework:** React 18 + TypeScript 5
* **Build System:** Vite 5
* **Styling:** Custom CSS with Design Tokens (`Skillpath.css`)
* **Framer Integration:** `framer-mock.ts` property controls

## Features
- **Library Catalog Design System**: Characterful typography (Fraunces serif display, Inter sans body, Space Mono utility), signature index card elements (rotated catalog number stamps, punch hole decoration, 1px integer borders), and paper color palette.
- **Resilient Multi-Endpoint Data Architecture**: Independent parallel fetching for course data and country location detection with separate `AbortController` cleanup and retry handlers.
- **Fallback Currency Handling**: Dynamic local currency formatting (`INR` / `USD`) with layout-stable `"Price unavailable"` placeholders and unsupported country code fallback.
- **Interactive Filtering & Sorting**: Live catalog search and price sorting options (Low to High / High to Low).
- **Responsive Layout**: Mobile-first 1-column layout with vertical header stacking, tablet 2-column, and desktop 3-column grid layout handling orphan cards cleanly.
- **Testing Harness (DEV mode)**: Development panel for overriding API states, course counts, country codes, accent colors, and refundable badges.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```
