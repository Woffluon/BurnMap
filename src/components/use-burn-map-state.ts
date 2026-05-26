import { useCallback, useEffect, useState } from "react";

import {
  STORAGE_MAP_PROVIDER,
  STORAGE_OFM_DISCLAIMER_ACK,
  STORAGE_UI_THEME,
} from "@/lib/burnmap-storage";
import type { MapProviderChoice, UiTheme } from "@/lib/i18n/types";
import { detectionId } from "@/lib/nasa/firms/detections-to-geojson";
import type { FirmsDetection } from "@/lib/nasa/firms/schemas";
import type { FlyToPayload } from "@/components/map/wildfire-map-mapbox";

export type UseBurnMapStateProps = {
  defaultMapProvider: MapProviderChoice;
  hasMapboxToken: boolean;
  locale: string;
};

export function useBurnMapState({
  defaultMapProvider,
  hasMapboxToken,
  locale,
}: UseBurnMapStateProps) {
  const [uiTheme, setUiTheme] = useState<UiTheme>("dark");
  const [mapProvider, setMapProvider] = useState<MapProviderChoice>(defaultMapProvider);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<FlyToPayload | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(STORAGE_UI_THEME);
    if (t === "light" || t === "dark") {
      setUiTheme(t);
    }

    const p = localStorage.getItem(STORAGE_MAP_PROVIDER);
    if (p === "openfreemap") {
      setMapProvider("openfreemap");
    } else if (p === "mapbox" && hasMapboxToken) {
      setMapProvider("mapbox");
    } else {
      setMapProvider(defaultMapProvider);
    }
  }, [defaultMapProvider, hasMapboxToken]);
  useEffect(() => {
    document.documentElement.lang = locale === "tr" ? "tr" : "en";
    document.documentElement.classList.toggle("dark", uiTheme === "dark");
  }, [locale, uiTheme]);

  const persistTheme = useCallback((t: UiTheme) => {
    setUiTheme(t);
    localStorage.setItem(STORAGE_UI_THEME, t);
  }, []);

  const commitProvider = useCallback(
    (p: MapProviderChoice) => {
      if (p === "mapbox" && !hasMapboxToken) {
        setMapProvider("mapbox");
        localStorage.setItem(STORAGE_MAP_PROVIDER, "mapbox");
        return;
      }
      setMapProvider(p);
      localStorage.setItem(STORAGE_MAP_PROVIDER, p);
    },
    [hasMapboxToken],
  );

  const requestProvider = useCallback(
    (next: MapProviderChoice) => {
      if (next === mapProvider) return;
      if (next === "openfreemap") {
        const ack = localStorage.getItem(STORAGE_OFM_DISCLAIMER_ACK);
        if (!ack) {
          setDisclaimerOpen(true);
          return;
        }
      }
      commitProvider(next);
    },
    [commitProvider, mapProvider],
  );

  const handleDisclaimerConfirm = useCallback(() => {
    localStorage.setItem(STORAGE_OFM_DISCLAIMER_ACK, "1");
    commitProvider("openfreemap");
    setDisclaimerOpen(false);
  }, [commitProvider]);

  const handleDisclaimerDismiss = useCallback(() => {
    setDisclaimerOpen(false);
  }, []);

  const handleDetectionActivate = useCallback((detection: FirmsDetection) => {
    setSelectedId(detectionId(detection));
    setFlyTo({
      lng: detection.longitude,
      lat: detection.latitude,
      nonce: Date.now(),
    });
  }, []);

  return {
    uiTheme,
    mapProvider,
    disclaimerOpen,
    flyTo,
    selectedId,
    setDisclaimerOpen,
    persistTheme,
    requestProvider,
    commitProvider,
    handleDisclaimerConfirm,
    handleDisclaimerDismiss,
    handleDetectionActivate,
  };
}
