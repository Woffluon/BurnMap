"use client";

import type { FeatureCollection, Point } from "geojson";
import type { CircleLayerSpecification, SymbolLayerSpecification } from "mapbox-gl";
import { useEffect, useMemo, useRef } from "react";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { UiTheme } from "@/lib/i18n/types";
import { mapboxStyleForTheme } from "@/lib/map/styles";
import type { WildfirePointProperties } from "@/lib/nasa/eonet/events-to-geojson";

function clusterLayersForTheme(theme: UiTheme): {
  clusterLayer: Omit<CircleLayerSpecification, "source">;
  clusterCountLayer: Omit<SymbolLayerSpecification, "source">;
  unclusteredLayer: Omit<CircleLayerSpecification, "source">;
} {
  const countColor = theme === "light" ? "#1c1917" : "#fafafa";
  return {
    clusterLayer: {
      id: "burnmap-clusters",
      type: "circle",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "rgba(234, 88, 12, 0.55)",
        "circle-stroke-width": 2,
        "circle-stroke-color": "rgba(251, 146, 60, 0.9)",
        "circle-radius": ["step", ["get", "point_count"], 18, 10, 22, 50, 28],
      },
    },
    clusterCountLayer: {
      id: "burnmap-cluster-count",
      type: "symbol",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-size": 12,
      },
      paint: {
        "text-color": countColor,
      },
    },
    unclusteredLayer: {
      id: "burnmap-unclustered",
      type: "circle",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "rgba(249, 115, 22, 0.85)",
        "circle-radius": 7,
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "#ffedd5",
      },
    },
  };
}

export type FlyToPayload = { lng: number; lat: number; nonce: number };

export type WildfireMapMapboxProps = {
  mapboxAccessToken: string;
  geojson: FeatureCollection<Point, WildfirePointProperties>;
  bounds: [[number, number], [number, number]] | null;
  uiTheme: UiTheme;
  flyTo: FlyToPayload | null;
  dictionary: Pick<
    Dictionary,
    "mapAria" | "mapTokenMissingTitle" | "mapTokenMissingBody" | "mapSwitchToFree"
  >;
  onSwitchToFree?: () => void;
  surfaceClassName: string;
  placeholderClassName: string;
};

/**
 * Mapbox GL implementation: clustered GeoJSON, theme-aware styles, optional fly-to animation.
 */
export function WildfireMapMapbox({
  mapboxAccessToken,
  geojson,
  bounds,
  uiTheme,
  flyTo,
  dictionary,
  onSwitchToFree,
  surfaceClassName,
  placeholderClassName,
}: WildfireMapMapboxProps) {
  const mapRef = useRef<MapRef>(null);
  const mapStyle = useMemo(() => mapboxStyleForTheme(uiTheme), [uiTheme]);
  const layers = useMemo(() => clusterLayersForTheme(uiTheme), [uiTheme]);

  const initialViewState =
    bounds !== null
      ? {
          bounds,
          fitBoundsOptions: { padding: 56, maxZoom: 10, minZoom: 1.5 },
        }
      : {
          longitude: 0,
          latitude: 20,
          zoom: 1.35,
        };

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: 9,
      duration: 1400,
      essential: true,
    });
  }, [flyTo]);

  if (!mapboxAccessToken.trim()) {
    return (
      <div
        className={placeholderClassName}
        role="note"
        aria-label={dictionary.mapTokenMissingTitle}
      >
        <p className="text-sm font-medium">{dictionary.mapTokenMissingTitle}</p>
        <p className="max-w-sm text-xs leading-relaxed opacity-80">{dictionary.mapTokenMissingBody}</p>
        {onSwitchToFree ? (
          <button
            type="button"
            onClick={onSwitchToFree}
            className="mt-3 rounded-md border border-orange-500/50 bg-orange-500/15 px-3 py-2 text-xs font-medium text-orange-200 transition hover:bg-orange-500/25"
          >
            {dictionary.mapSwitchToFree}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={surfaceClassName}
      role="application"
      aria-label={dictionary.mapAria}
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxAccessToken}
        mapStyle={mapStyle}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        reuseMaps
        attributionControl
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Source
          id="burnmap-wildfires"
          type="geojson"
          data={geojson}
          cluster
          clusterMaxZoom={14}
          clusterRadius={56}
        >
          <Layer {...layers.clusterLayer} />
          <Layer {...layers.clusterCountLayer} />
          <Layer {...layers.unclusteredLayer} />
        </Source>
      </Map>
    </div>
  );
}
