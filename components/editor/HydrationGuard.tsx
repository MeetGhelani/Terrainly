"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/store/mapStore";

export const HydrationGuard = ({ children }: { children: React.ReactNode }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if store is already hydrated on mount
    const checkHydration = () => {
      // @ts-ignore - Zustand persist middleware adds this
      if (useMapStore.persist?.hasHydrated()) {
        setHydrated(true);
      } else {
        // If not hydrated yet, listen for it
        // @ts-ignore
        const unsub = useMapStore.persist?.onHydrate(() => setHydrated(true));
        return unsub;
      }
    };

    const unsub = checkHydration();
    
    // Fallback: If for some reason hydration doesn't fire, 
    // set to true after 1s so the user isn't stuck forever
    const timer = setTimeout(() => setHydrated(true), 1500);

    return () => {
      if (unsub) unsub();
      clearTimeout(timer);
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="fixed inset-0 bg-[#070b12] flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
              Restoring Session
            </p>
            <div className="h-0.5 w-24 bg-accent/20 rounded-full overflow-hidden">
              <div className="h-full bg-accent animate-progress-fast" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
