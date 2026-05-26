"use client";

import type { FeatureCollection, Point } from "geojson";
import { useRef } from "react";

import { LocaleSwitcher } from "./locale-switcher";
import { WildfireMapDynamic } from "./map/wildfire-map-dynamic";
import { OpenFreeMapDisclaimerModal } from "./openfreemap-disclaimer-modal";
import { useBurnMapState } from "./use-burn-map-state";
import { STORAGE_OFM_DISCLAIMER_ACK } from "@/lib/burnmap-storage";
import type { FirmsLoadState } from "@/lib/nasa/firms/constants";
import {
  detectionAcquiredAtIso,
  detectionId,
  type FireDetectionPointProperties,
} from "@/lib/nasa/firms/detections-to-geojson";
import type { FirmsDetectionSummary } from "@/lib/nasa/firms/summary";
import type { FirmsConfidence, FirmsDetection } from "@/lib/nasa/firms/schemas";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale, MapProviderChoice } from "@/lib/i18n/types";

export type BurnMapExperienceProps = {
  locale: Locale;
  dictionary: Dictionary;
  detections: FirmsDetection[];
  geojson: FeatureCollection<Point, FireDetectionPointProperties>;
  bounds: [[number, number], [number, number]] | null;
  summary: FirmsDetectionSummary;
  mapboxAccessToken: string;
  hasMapboxToken: boolean;
  defaultMapProvider: MapProviderChoice;
  loadState: FirmsLoadState;
};

function confidenceLabel(confidence: FirmsConfidence, dictionary: Dictionary): string {
  if (confidence === "h") return dictionary.confidenceHigh;
  if (confidence === "l") return dictionary.confidenceLow;
  return dictionary.confidenceNominal;
}

function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", options).format(value);
}

function formatUtc(iso: string | null, locale: Locale, fallback: string): string {
  if (!iso) return fallback;
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(iso));
}

function formatCoords(detection: FirmsDetection): string {
  return `${detection.latitude.toFixed(3)}, ${detection.longitude.toFixed(3)}`;
}

/**
 * Client shell: premium FIRMS operator dashboard, basemap provider, theme, locale, and fly-to queue.
 */
export function BurnMapExperience({
  locale,
  dictionary,
  detections,
  geojson,
  bounds,
  summary,
  mapboxAccessToken,
  hasMapboxToken,
  defaultMapProvider,
  loadState,
}: BurnMapExperienceProps) {
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useBurnMapState({
    defaultMapProvider,
    hasMapboxToken,
    locale,
  });

  const shell =
    uiTheme === "dark"
      ? "overflow-x-hidden bg-[#090a0c] text-zinc-50"
      : "overflow-x-hidden bg-[#f4f1ec] text-stone-950";
  const panel =
    uiTheme === "dark"
      ? "border-white/10 bg-white/[0.045] shadow-black/30"
      : "border-stone-300/80 bg-white/80 shadow-stone-300/35";
  const muted = uiTheme === "dark" ? "text-zinc-400" : "text-stone-600";
  const quiet = uiTheme === "dark" ? "text-zinc-500" : "text-stone-500";
  const accent = uiTheme === "dark" ? "text-orange-300" : "text-orange-700";
  const line = uiTheme === "dark" ? "border-white/10" : "border-stone-300";
  const mapSurface =
    "relative h-[var(--burnmap-map-height)] min-h-[360px] w-full overflow-hidden rounded-lg shadow-2xl " +
    (uiTheme === "dark"
      ? "border border-white/10 shadow-orange-950/20"
      : "border border-stone-300/90 shadow-stone-400/25");
  const placeholderSurface =
    "flex h-[var(--burnmap-map-height)] min-h-[360px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 text-center " +
    (uiTheme === "dark" ? "border-zinc-600 bg-zinc-950/80" : "border-stone-400 bg-stone-100/70");
  const toggleBtn = (active: boolean) =>
    `min-h-[40px] rounded-md px-3 py-2 text-xs font-medium transition-colors ${
      active
        ? "bg-orange-500 text-zinc-950 shadow-sm shadow-orange-950/20"
        : "text-current/70 hover:bg-current/10"
    }`;
  const banner =
    loadState === "missing-key"
      ? "border-red-400/35 bg-red-500/10 text-red-100"
      : "border-amber-400/35 bg-amber-500/10 text-amber-100";

  return (
    <div className={`min-h-dvh ${shell}`}>
      <OpenFreeMapDisclaimerModal
        open={disclaimerOpen}
        dictionary={dictionary}
        onConfirm={handleDisclaimerConfirm}
        onDismiss={handleDisclaimerDismiss}
      />

      <main className="mx-auto flex w-full max-w-[1560px] flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
        <header className={`grid gap-4 border-b pb-4 lg:grid-cols-[minmax(0,1fr)_auto] ${line}`}>
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${accent}`}>
              {dictionary.heroKicker}
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {dictionary.heroTitle}
              </h1>
              <span className={`pb-1 font-mono text-xs uppercase tracking-[0.2em] ${quiet}`}>
                {dictionary.liveWindowLabel}: 24h UTC
              </span>
            </div>
            <p className={`mt-3 max-w-3xl text-sm leading-6 sm:text-base ${muted}`}>
              {dictionary.heroSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-start justify-start gap-2 lg:justify-end">
            <div className={`flex items-center gap-1 rounded-lg border p-0.5 ${line}`} role="group" aria-label="Theme">
              <button
                type="button"
                onClick={() => persistTheme("dark")}
                className={toggleBtn(uiTheme === "dark")}
                aria-pressed={uiTheme === "dark"}
              >
                {dictionary.themeDark}
              </button>
              <button
                type="button"
                onClick={() => persistTheme("light")}
                className={toggleBtn(uiTheme === "light")}
                aria-pressed={uiTheme === "light"}
              >
                {dictionary.themeLight}
              </button>
            </div>

            <div className={`flex items-center gap-1 rounded-lg border p-0.5 ${line}`}>
              <button
                type="button"
                onClick={() => requestProvider("mapbox")}
                className={toggleBtn(mapProvider === "mapbox")}
                aria-pressed={mapProvider === "mapbox"}
              >
                {dictionary.providerMapbox}
              </button>
              <button
                type="button"
                onClick={() => requestProvider("openfreemap")}
                className={toggleBtn(mapProvider === "openfreemap")}
                aria-pressed={mapProvider === "openfreemap"}
              >
                {dictionary.providerOpenFreeMap}
              </button>
            </div>

            <LocaleSwitcher locale={locale} dictionary={dictionary} />
          </div>
        </header>

        {loadState !== "ok" ? (
          <p className={`rounded-lg border px-4 py-3 text-sm ${banner}`} role="status">
            {loadState === "missing-key" ? dictionary.firmsKeyMissing : dictionary.firmsUnavailable}
          </p>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
          <div className="min-w-0 space-y-4">
            <div className={`grid overflow-hidden rounded-lg border shadow-lg ${panel} sm:grid-cols-2 lg:grid-cols-5`}>
              {[
                [dictionary.detectionsLabel, formatNumber(summary.total, locale)],
                [
                  dictionary.latestPassLabel,
                  formatUtc(summary.latestAcquiredAt, locale, dictionary.latestUnknown),
                ],
                [dictionary.highConfidenceLabel, formatNumber(summary.highConfidence, locale)],
                [
                  dictionary.frpLabel,
                  `${formatNumber(summary.totalFrp, locale, { maximumFractionDigits: 1 })} MW`,
                ],
                [
                  dictionary.peakFrpLabel,
                  `${formatNumber(summary.peakFrp, locale, { maximumFractionDigits: 1 })} MW`,
                ],
              ].map(([label, value]) => (
                <div key={label} className={`border-b p-4 sm:border-r sm:last:border-r-0 lg:border-b-0 ${line}`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${quiet}`}>
                    {label}
                  </p>
                  <p className="mt-2 font-mono text-xl font-semibold tabular-nums sm:text-2xl">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className={`rounded-lg border p-2 shadow-2xl ${panel}`} ref={mapWrapperRef} tabIndex={-1}>
              <div className="grid gap-2 px-2 pb-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">{dictionary.mapPanelTitle}</h2>
                  <p className={`mt-0.5 break-words text-[11px] leading-4 sm:text-xs sm:leading-5 ${muted}`}>
                    {dictionary.mapPanelSubtitle}
                  </p>
                </div>
                <div className={`max-w-full break-words font-mono text-xs uppercase tracking-[0.16em] ${quiet}`}>
                  {dictionary.sourceLabel}: {dictionary.sourceValue}
                </div>
              </div>

              <WildfireMapDynamic
                provider={mapProvider}
                mapboxAccessToken={mapboxAccessToken}
                geojson={geojson}
                bounds={bounds}
                uiTheme={uiTheme}
                flyTo={flyTo}
                dictionary={dictionary}
                onSwitchToFree={() => {
                  if (!localStorage.getItem(STORAGE_OFM_DISCLAIMER_ACK)) {
                    setDisclaimerOpen(true);
                  } else {
                    commitProvider("openfreemap");
                  }
                }}
                mapSurfaceClassName={mapSurface}
                placeholderClassName={placeholderSurface}
              />
            </div>
          </div>

          <aside className={`flex min-h-0 flex-col rounded-lg border shadow-lg ${panel}`}>
            <div className={`border-b p-4 ${line}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent}`}>
                {dictionary.railTitle}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                {formatNumber(detections.length, locale)} / {formatNumber(summary.total, locale)}
              </h2>
              <p className={`mt-2 text-sm leading-6 ${muted}`}>{dictionary.railSubtitle}</p>
              <p className={`mt-1 text-xs ${quiet}`}>{dictionary.showingLimit}</p>
            </div>

            <ul
              className="max-h-[62dvh] min-h-[260px] space-y-2 overflow-y-auto p-2 xl:max-h-[calc(var(--burnmap-map-height)+106px)]"
              aria-label={dictionary.detectionsListLabel}
            >
              {detections.map((detection) => {
                const id = detectionId(detection);
                const active = selectedId === id;
                const acquiredAt = detectionAcquiredAtIso(detection);
                const confidence = confidenceLabel(detection.confidence, dictionary);
                const dayNight =
                  detection.daynight === "D" ? dictionary.dayDetection : dictionary.nightDetection;

                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => {
                        handleDetectionActivate(detection);
                        mapWrapperRef.current?.focus();
                      }}
                      className={`w-full rounded-md border px-3 py-3 text-left transition-colors ${
                        active
                          ? "border-orange-400/70 bg-orange-500/15"
                          : uiTheme === "dark"
                            ? "border-white/10 hover:border-orange-400/35 hover:bg-white/[0.055]"
                            : "border-stone-300/80 hover:border-orange-500/40 hover:bg-white"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-mono text-sm font-semibold tabular-nums">
                            {formatCoords(detection)}
                          </span>
                          <span className={`mt-1 block text-xs ${muted}`}>
                            {formatUtc(acquiredAt, locale, dictionary.latestUnknown)}
                          </span>
                        </span>
                        <span className={`rounded px-2 py-1 text-xs font-semibold ${accent}`}>
                          {confidence}
                        </span>
                      </span>
                      <span className={`mt-3 grid grid-cols-3 gap-2 font-mono text-xs tabular-nums ${quiet}`}>
                        <span>{formatNumber(detection.frp, locale, { maximumFractionDigits: 1 })} MW</span>
                        <span>{formatNumber(detection.bright_ti4, locale, { maximumFractionDigits: 1 })} K</span>
                        <span>{dayNight}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {summary.total === 0 ? (
              <p className={`px-4 pb-4 text-sm ${muted}`}>{dictionary.emptyList}</p>
            ) : null}
          </aside>
        </section>
      </main>
    </div>
  );
}
