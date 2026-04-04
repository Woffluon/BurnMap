"use client";

import { useEffect } from "react";

/**
 * Client error boundary for the `app` segment: surfaces EONET/network failures without a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center text-zinc-100"
      role="alert"
    >
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-zinc-400">
        BurnMap could not load NASA EONET data. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-orange-500/50 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-200 transition hover:bg-orange-500/20"
      >
        Retry
      </button>
    </div>
  );
}
