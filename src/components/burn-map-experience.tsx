"use client";

import type { FeatureCollection, Point } from "geojson";
import { useMemo, useRef } from "react";

import { useBurnMapState } from "./use-burn-map-state";
import { STORAGE_OFM_DISCLAIMER_ACK } from "@/lib/burnmap-storage";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale, MapProviderChoice, UiTheme } from "@/lib/i18n/types";
import type { EonetEvent } from "@/lib/nasa/eonet/schemas";
import type { WildfirePointProperties } from "@/lib/nasa/eonet/events-to-geojson";

import { LocaleSwitcher } from "./locale-switcher";
import { OpenFreeMapDisclaimerModal } from "./openfreemap-disclaimer-modal";
import { WildfireMapDynamic } from "./map/wildfire-map-dynamic";
import type { FlyToPayload } from "./map/wildfire-map-mapbox";

export type BurnMapExperienceProps = {
  locale: Locale;
  dictionary: Dictionary;
  events: EonetEvent[];
  geojson: FeatureCollection<Point, WildfirePointProperties>;
  bounds: [[number, number], [number, number]] | null;
  mapboxAccessToken: string;
  hasMapboxToken: boolean;
  /** Used before localStorage hydration. */
  defaultMapProvider: MapProviderChoice;
  loadFailed: boolean;
  days: number;
};

/**
 * Client shell: theme, locale, basemap provider, OpenFreeMap disclaimer, list fly-to, and map.
 */
export function BurnMapExperience({
  locale,
  dictionary,
  events,
  geojson,
  bounds,
  mapboxAccessToken,
  hasMapboxToken,
  defaultMapProvider,
  loadFailed,
  days,
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
    handleIncidentActivate,
  } = useBurnMapState({
    defaultMapProvider,
    hasMapboxToken,
    locale,
  });

  const count = events.length;

  const statsParts = useMemo(() => {
    const tpl = count === 1 ? dictionary.heroStatsSingular : dictionary.heroStatsTemplate;
    const withDays = tpl.replace("{days}", String(days));
    return withDays.split("<<COUNT>>");
  }, [count, days, dictionary]);

  const shell = uiTheme === "dark" ? "bg-zinc-950 text-zinc-50" : "bg-zinc-100 text-zinc-900";
  const card = uiTheme === "dark"
    ? "border-zinc-800/90 bg-zinc-900/40 hover:border-orange-500/30"
    : "border-zinc-300 bg-white/90 hover:border-orange-400/60 shadow-sm";
  const kicker = uiTheme === "dark" ? "text-orange-400/90" : "text-orange-700";
  const sub = uiTheme === "dark" ? "text-zinc-400" : "text-zinc-600";
  const mono = uiTheme === "dark" ? "text-zinc-500" : "text-zinc-600";
  const accent = uiTheme === "dark" ? "text-orange-300" : "text-orange-600";
  const mapSurface =
    "relative h-[var(--burnmap-map-height)] min-h-[280px] w-full overflow-hidden rounded-xl shadow-lg " +
    (uiTheme === "dark"
      ? "border border-zinc-800/90 shadow-orange-950/20"
      : "border border-zinc-300/90 shadow-zinc-400/20");
  const placeholderSurface =
    "flex h-[var(--burnmap-map-height)] min-h-[280px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 text-center " +
    (uiTheme === "dark" ? "border-zinc-600 bg-zinc-900/60" : "border-zinc-400 bg-zinc-200/50");

  const banner =
    uiTheme === "dark"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
      : "border-amber-600/40 bg-amber-100/90 text-amber-950";

  const toggleBtn = (active: boolean) =>
    `rounded-md px-4 py-3 sm:px-2.5 sm:py-1.5 text-sm sm:text-xs font-medium transition-colors min-h-[44px] sm:min-h-0 ${
      active
        ? "bg-orange-500/10 text-orange-900 dark:bg-orange-500/25 dark:text-orange-100"
        : "opacity-70 hover:bg-black/5 dark:hover:bg-white/10"
    }`;

  return (
    <div className={`flex min-h-dvh flex-col ${shell}`}>
      <OpenFreeMapDisclaimerModal
        open={disclaimerOpen}
        dictionary={dictionary}
        onConfirm={handleDisclaimerConfirm}
        onDismiss={handleDisclaimerDismiss}
      />

      <div className="mx-auto flex w-full max-w-[min(100%,1400px)] flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:gap-8 lg:px-8 lg:py-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-current/10 pb-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-current/15 p-0.5" role="group" aria-label="Theme">
            <button
              type="button"
              onClick={() => persistTheme("light")}
              className={toggleBtn(uiTheme === "light")}
              aria-pressed={uiTheme === "light"}
            >
              {dictionary.themeLight}
            </button>
            <button
              type="button"
              onClick={() => persistTheme("dark")}
              className={toggleBtn(uiTheme === "dark")}
              aria-pressed={uiTheme === "dark"}
            >
              {dictionary.themeDark}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-current/15 p-0.5">
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

        {loadFailed ? (
          <p className={`rounded-lg border px-4 py-3 text-sm ${banner}`} role="status">
            {dictionary.eonetUnavailable}
          </p>
        ) : null}

        <div className="grid flex-1 grid-cols-1 gap-6 lg:min-h-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-stretch lg:gap-8">
          <div className="flex min-h-0 flex-col" ref={mapWrapperRef} tabIndex={-1}>
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

          <section
            className="flex min-h-0 min-w-0 flex-col gap-5"
            aria-labelledby="burnmap-heading"
          >
            <div className="flex flex-col gap-2">
              <p className={`text-xs font-medium uppercase tracking-[0.2em] ${kicker}`}>
                {dictionary.heroKicker}
              </p>
              <h1 id="burnmap-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {dictionary.heroTitle}
              </h1>
              <p className={`text-sm leading-relaxed ${sub}`}>
                {statsParts[0]}
                <span className={`font-mono text-lg ${accent}`}>{count}</span>
                {statsParts[1] ?? ""}
              </p>
            </div>

            <ul
              className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 max-h-[50vh] lg:max-h-[var(--burnmap-map-height)]"
              aria-label={dictionary.incidentsListLabel}
            >
              {events.map((event) => {
                const point = event.geometry.find((g) => g.type === "Point");
                const canFly = point !== undefined && point.type === "Point";
                const coords = canFly
                  ? `${point.coordinates[1].toFixed(2)}°, ${point.coordinates[0].toFixed(2)}°`
                  : dictionary.areaMultiPoint;

                return (
                  <li key={event.id}>
                    <button
                      type="button"
                      disabled={!canFly}
                      onClick={() => {
                        handleIncidentActivate(event);
                        mapWrapperRef.current?.focus();
                      }}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors min-h-[44px] ${card} ${
                        selectedId === event.id ? "ring-2 ring-orange-500/50" : ""
                      } ${!canFly ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <span className="block text-sm font-medium">{event.title}</span>
                      <span className={`mt-1 block font-mono text-xs ${mono}`}>{coords}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {count === 0 && !loadFailed ? (
              <p className={`text-sm ${sub}`}>{dictionary.emptyList}</p>
            ) : null}
          </section>
        </div>
      </div>

    </div>
  );
}
