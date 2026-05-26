# BurnMap

Dark, responsive active-fire monitoring console powered by NASA FIRMS.

BurnMap visualizes global NASA FIRMS `VIIRS_NOAA20_NRT` detections from the last 24 hours. The app keeps data fetching on the server, validates FIRMS CSV rows with Zod, converts detections to clustered GeoJSON, and renders the map with either Mapbox or OpenFreeMap/MapLibre.

## Stack

- Next.js App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- Zod
- Mapbox GL / MapLibre GL via `react-map-gl`
- Vitest
- pnpm

## Architecture

```plaintext
src/
├── app/                  # App Router entrypoints, layout, loading and error UI
├── components/           # Operator dashboard shell, controls, modal and map wrappers
│   └── map/              # Code-split Mapbox / MapLibre renderers
├── lib/
│   ├── i18n/             # English/Turkish dictionaries
│   ├── map/              # Basemap style helpers
│   └── nasa/
│       └── firms/        # FIRMS CSV fetch, schema, summary and GeoJSON logic
└── env.ts                # Environment validation
```

## NASA FIRMS

The default feed is:

```plaintext
https://firms.modaps.eosdis.nasa.gov/api/area/csv/[MAP_KEY]/VIIRS_NOAA20_NRT/world/1
```

`MAP_KEY` is required by NASA FIRMS and must stay server-side. The app reads it from `NASA_FIRMS_MAP_KEY`.

## Local Development

Prerequisites:

- Node.js 20+
- pnpm 10.33.0+
- NASA FIRMS MAP_KEY

Install dependencies:

```bash
pnpm install
```

Create local env:

```bash
cp .env.example .env.local
```

Set at least:

```bash
NASA_FIRMS_MAP_KEY=your_firms_map_key_here
```

Optional Mapbox support:

```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

Run dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:watch
```

## Notes

- If `NASA_FIRMS_MAP_KEY` is missing, the app still renders and shows a configuration warning.
- FIRMS global VIIRS queries can return tens of thousands of detections per day. The app uses uncached server fetches because the CSV can exceed Next.js data-cache limits; the map receives all points while the side queue displays the top 100 sorted by recency and FRP.
- OpenFreeMap is available without a key, but it is a third-party tile service with no uptime guarantee.
