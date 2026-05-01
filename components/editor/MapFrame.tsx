"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Returns the width/height ratio (w/h) for each layout preset */
const getRatio = (poster: { ratio: string; width: number; height: number }): number => {
  if (poster.ratio === "CUSTOM") {
    const w = poster.width || 1;
    const h = poster.height || 1;
    return w / h;
  }
  switch (poster.ratio) {
    case "A3":
    case "A4":
    case "A5":   return 210 / 297;   
    case "A3-LANDSCAPE":
    case "A4-LANDSCAPE":
    case "A5-LANDSCAPE":   return 297 / 210;   
    case "LETTER": return 216 / 279; 
    case "LETTER-LANDSCAPE": return 279 / 216; 
    case "50x70": return 50 / 70;
    case "50x70-LANDSCAPE": return 70 / 50;
    case "18x24": return 18 / 24;
    case "18x24-LANDSCAPE": return 24 / 18;
    case "24x36": return 24 / 36;
    case "24x36-LANDSCAPE": return 36 / 24;

    case "9:16":   return 9 / 16;    
    case "16:9":   return 16 / 9;
    case "TWITTER": return 1200 / 675;    
    case "INSTA-PORTRAIT": return 1080 / 1350;
    case "LINKEDIN": return 1200 / 627;
    
    case "1:1":
    default:       return 1;
  }
};

const getFrameLabel = (poster: { ratio: string; width: number; height: number }): string => {
  if (poster.ratio === "CUSTOM") {
    return `Custom · ${poster.width} × ${poster.height}`;
  }
  const map: Record<string, string> = {
    "A3": "A3 Portrait",
    "A4": "A4 Portrait",
    "A5": "A5 Portrait",
    "A3-LANDSCAPE": "A3 Landscape",
    "A4-LANDSCAPE": "A4 Landscape",
    "A5-LANDSCAPE": "A5 Landscape",
    "LETTER": "Letter Portrait",
    "LETTER-LANDSCAPE": "Letter Landscape",
    "50x70": "Poster · 50×70 cm",
    "50x70-LANDSCAPE": "Poster · 70×50 cm",
    "18x24": "Poster · 18×24 in",
    "18x24-LANDSCAPE": "Poster · 24×18 in",
    "24x36": "Poster · 24×36 in",
    "24x36-LANDSCAPE": "Poster · 36×24 in",
    "9:16": "Story · 9:16",
    "16:9": "Desktop · 16:9",
    "1:1": "Square · 1:1",
    "INSTA-PORTRAIT": "Insta Portrait · 4:5",
    "LINKEDIN": "LinkedIn · 1.91:1",
    "TWITTER": "Twitter/X · 16:9",
  };
  return map[poster.ratio] ?? poster.ratio;
};

export const MapFrame = ({ children }: { children: React.ReactNode }) => {
  const { config } = useMapStore();
  const ratio = getRatio(config.poster);

  // Frame border style
  const frameBorderClass = {
    none: "",
    thin: "ring-1 ring-white/10",
    double: "ring-4 ring-double ring-white/10",
    ornate: "ring-2 ring-accent/30",
  }[config.frame.style] ?? "";

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#05080f]">

      {/* ── Blurred ambient background ── */}
      {/* This mirrors the map poster at very low quality / heavily blurred
          to create the "out of canvas" backdrop effect */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      >
        {/* Dark base */}
        <div className="absolute inset-0 bg-[#05080f]" />

        {/* Colour glow patches that subtly echo the accent palette */}
        <div className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(79,142,247,0.4) 0%, transparent 70%)," +
              "radial-gradient(ellipse 50% 60% at 75% 65%, rgba(30,80,140,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Frosted glass noise */}
        <div
          className="absolute inset-0 backdrop-blur-3xl scale-110"
          style={{ filter: "blur(80px)" }}
        />

        {/* Subtle grid lines on the backdrop */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,142,247,0.6) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(79,142,247,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Poster frame ── */}
      <div
        className={cn(
          "relative z-10 overflow-hidden shadow-[0_8px_80px_rgba(0,0,0,0.7)] transition-all duration-700 ease-out",
          frameBorderClass,
        )}
        style={{
          aspectRatio: ratio,
          // Robust mathematical fit: constrain width and height strictly to viewport bounding box
          // while preserving the precise aspect ratio, preventing 0x0 collapse.
          width: `min(calc(100vw - 448px), calc((100vh - 104px) * ${ratio}))`,
          height: `min(calc(100vh - 104px), calc((100vw - 448px) / ${ratio}))`,
        }}
      >
        {/* Map fills the poster */}
        <div className="absolute inset-0">{children}</div>

        {/* Poster border overlay (decorative) */}
        {config.frame.style !== "none" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 ${config.frame.thickness * 4}px ${config.frame.color}22`,
            }}
          />
        )}
      </div>

      {/* ── Format badge ── */}
      <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 bg-bg-panel/70 backdrop-blur-md border border-border-subtle rounded-lg text-[9px] font-mono text-text-secondary tracking-widest uppercase select-none">
        {getFrameLabel(config.poster)}
      </div>
    </div>
  );
};
