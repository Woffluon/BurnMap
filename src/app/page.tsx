import { Suspense } from "react";

import { WildfiresContent } from "@/components/wildfires-content";
import { WildfiresSkeleton } from "@/components/wildfires-skeleton";

/**
 * Home route: streams wildfire data from the server while showing an accessible loading fallback.
 */
export default function Home() {
  return (
    <Suspense fallback={<WildfiresSkeleton />}>
      <WildfiresContent />
    </Suspense>
  );
}
