"use client";

import type { FeatureCollection, Point } from "geojson";
import type { CircleLayerSpecification, SymbolLayerSpecification } from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { UiTheme } from "@/lib/i18n/types";
import { openFreeMapStyleForTheme } from "@/lib/map/styles";
import type { WildfirePointProperties } from "@/lib/nasa/eonet/events-to-geojson";

import type { FlyToPayload } from "./wildfire-map-mapbox";

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

export type WildfireMapLibreProps = {
  geojson: FeatureCollection<Point, WildfirePointProperties>;
  bounds: [[number, number], [number, number]] | null;
  uiTheme: UiTheme;
  flyTo: FlyToPayload | null;
  dictionary: Pick<Dictionary, "mapAria">;
  surfaceClassName: string;
};

/**
 * MapLibre + OpenFreeMap: same clustering UX as Mapbox branch without an access token.
 */
export function WildfireMapLibre({
  geojson,
  bounds,
  uiTheme,
  flyTo,
  dictionary,
  surfaceClassName,
}: WildfireMapLibreProps) {
  const mapRef = useRef<MapRef>(null);
  const mapStyle = useMemo(() => openFreeMapStyleForTheme(uiTheme), [uiTheme]);
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

  return (
    <div className={surfaceClassName} role="application" aria-label={dictionary.mapAria}>
      <Map
        ref={mapRef}
        mapStyle={mapStyle}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        reuseMaps
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
