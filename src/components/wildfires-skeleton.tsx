/**
 * Placeholder UI while the server resolves NASA FIRMS fire detection data inside {@link Suspense}.
 */
export function WildfiresSkeleton() {
  return (
    <div
      className="flex min-h-dvh flex-col bg-[#090a0c]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading fire detection data from NASA FIRMS</span>
      <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
        <div className="h-[132px] w-full animate-pulse border-b border-white/10 pb-4" aria-hidden />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
          <div className="space-y-4">
            <div className="grid overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] sm:grid-cols-2 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 animate-pulse border-b border-white/10 bg-zinc-900/40 sm:border-r lg:border-b-0" />
              ))}
            </div>
            <div
              className="flex h-[var(--burnmap-map-height)] min-h-[360px] w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.045]"
              aria-hidden
            >
              <div className="h-10 w-10 animate-pulse rounded-full bg-orange-500/25" />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="h-24 animate-pulse border-b border-white/10" />
            <ul className="mt-4 flex flex-col gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="h-20 animate-pulse rounded-md border border-white/10 bg-zinc-900/50" />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
