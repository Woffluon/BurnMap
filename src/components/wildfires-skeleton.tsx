/**
 * Placeholder UI while the server resolves NASA EONET wildfire data inside {@link Suspense}.
 */
export function WildfiresSkeleton() {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[min(100%,1400px)] flex-col gap-6 bg-zinc-950 px-4 py-6 text-zinc-50 lg:gap-8 lg:px-8 lg:py-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading wildfire data from NASA EONET</span>
      <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-zinc-800/60" aria-hidden />
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-stretch lg:gap-8">
        <div
          className="flex h-[var(--burnmap-map-height)] min-h-[280px] w-full items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-900/40"
          aria-hidden
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-orange-500/20" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-8 w-48 animate-pulse rounded-md bg-zinc-800" />
          <div className="h-4 w-full max-w-md animate-pulse rounded-md bg-zinc-800/80" />
          <ul className="mt-4 flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="h-16 animate-pulse rounded-lg border border-zinc-800/80 bg-zinc-900/50"
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
