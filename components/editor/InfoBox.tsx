"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";

export const InfoBox = ({ variant = "fixed" }: { variant?: "fixed" | "compact" }) => {
  const { config } = useMapStore();

  const isLandscape = config.poster.ratio.includes('LANDSCAPE') || ['16:9', 'TWITTER', 'LINKEDIN'].includes(config.poster.ratio);
  const orientation = isLandscape ? 'Landscape' : 'Portrait';

  const data = [
    { label: "Location", value: config.text.city || "Select Location" },
    { label: "Theme", value: config.activeThemeId || "Standard" },
    { label: "Layout", value: `${config.poster.ratio.replace('-LANDSCAPE', '')} ${orientation}` },
    { label: "Poster Size", value: config.poster.ratio.includes('A3') ? '29.7 x 42 cm' : '21 x 29.7 cm' },
    { label: "Markers", value: `${config.overlays.length} markers` },
    { label: "Coordinates", value: `${config.location.lat.toFixed(4)}, ${config.location.lng.toFixed(4)}` },
  ];

  if (variant === "compact") {
    return (
      <div className="w-[calc(100%-2rem)] mx-4 mt-3 mb-1 px-4 py-3 bg-bg-panel/40 backdrop-blur-md border border-border-subtle/30 rounded-lg md:hidden z-20 shadow-2xl pointer-events-none select-none">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col min-w-0 text-center">
              <span className="text-[7px] font-bold text-text-secondary uppercase tracking-[0.2em] font-space leading-none mb-1">
                {item.label}
              </span>
              <span className="text-[9px] font-bold text-text-primary truncate leading-tight tracking-tight">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-8 z-[60] w-72 bg-bg-panel/40 backdrop-blur-md border border-border-subtle/30 rounded-lg p-5 pointer-events-none select-none shadow-2xl hidden md:block">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">
              {item.label}
            </span>
            <span className="block text-[11px] font-bold text-text-primary truncate text-left leading-tight mt-0.5">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
