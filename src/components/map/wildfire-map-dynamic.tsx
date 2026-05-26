"use client";

import dynamic from "next/dynamic";
import type { FeatureCollection, Point } from "geojson";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { MapProviderChoice, UiTheme } from "@/lib/i18n/types";
import type { FireDetectionPointProperties } from "@/lib/nasa/firms/detections-to-geojson";

import type { FlyToPayload } from "./wildfire-map-mapbox";

function MapLoadingFallback({ label }: { label: string }) {
  return (
    <div
      className="flex h-[var(--burnmap-map-height)] min-h-[280px] w-full items-center justify-center rounded-xl border border-zinc-400/25 bg-zinc-500/10 dark:border-zinc-700 dark:bg-zinc-900/40"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div className="h-10 w-10 animate-pulse rounded-full bg-orange-500/20" aria-hidden />
    </div>
  );
}

const WildfireMapMapbox = dynamic(
  () => import("./wildfire-map-mapbox").then((m) => m.WildfireMapMapbox),
  {
    ssr: false,
    loading: () => <MapLoadingFallback label="Loading map" />,
  },
);

const WildfireMapLibre = dynamic(
  () => import("./wildfire-map-libre").then((m) => m.WildfireMapLibre),
  {
    ssr: false,
    loading: () => <MapLoadingFallback label="Loading map" />,
  },
);

export type WildfireMapDynamicProps = {
  provider: MapProviderChoice;
  mapboxAccessToken: string;
  geojson: FeatureCollection<Point, FireDetectionPointProperties>;
  bounds: [[number, number], [number, number]] | null;
  uiTheme: UiTheme;
  flyTo: FlyToPayload | null;
  dictionary: Dictionary;
  onSwitchToFree?: () => void;
  mapSurfaceClassName: string;
  placeholderClassName: string;
};

/**
 * Code-splits Mapbox vs MapLibre so only the active engine loads.
 */
export function WildfireMapDynamic({
  provider,
  mapboxAccessToken,
  geojson,
  bounds,
  uiTheme,
  flyTo,
  dictionary,
  onSwitchToFree,
  mapSurfaceClassName,
  placeholderClassName,
}: WildfireMapDynamicProps) {
  if (provider === "mapbox") {
    return (
      <WildfireMapMapbox
        mapboxAccessToken={mapboxAccessToken}
        geojson={geojson}
        bounds={bounds}
        uiTheme={uiTheme}
        flyTo={flyTo}
        dictionary={dictionary}
        onSwitchToFree={onSwitchToFree}
        surfaceClassName={mapSurfaceClassName}
        placeholderClassName={placeholderClassName}
      />
    );
  }

  return (
    <WildfireMapLibre
      geojson={geojson}
      bounds={bounds}
      uiTheme={uiTheme}
      flyTo={flyTo}
      dictionary={dictionary}
      surfaceClassName={mapSurfaceClassName}
    />
  );
}
