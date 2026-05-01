"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { Maximize2, Monitor, Smartphone, Share2, Printer, Check, Info, ArrowRightLeft } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LAYOUT_CATEGORIES = [
  {
    title: "Print - Portrait",
    icon: Printer,
    items: [
      { id: "A3", label: "A3 Portrait", sub: "29.7 x 42 cm", ratio: 210/297 },
      { id: "A4", label: "A4 Portrait", sub: "21 x 29.7 cm", ratio: 210/297 },
      { id: "50x70", label: "Poster 50x70", sub: "50 x 70 cm", ratio: 50/70 },
      { id: "18x24", label: "Poster 18x24", sub: "18 x 24 in", ratio: 18/24 },
      { id: "24x36", label: "Poster 24x36", sub: "24 x 36 in", ratio: 24/36 },
      { id: "LETTER", label: "Letter (US)", sub: "8.5 x 11 in", ratio: 216/279 },
    ],
  },
  {
    title: "Print - Landscape",
    icon: Printer,
    items: [
      { id: "A3-LANDSCAPE", label: "A3 Landscape", sub: "42 x 29.7 cm", ratio: 297/210 },
      { id: "A4-LANDSCAPE", label: "A4 Landscape", sub: "29.7 x 21 cm", ratio: 297/210 },
      { id: "50x70-LANDSCAPE", label: "Poster 70x50", sub: "70 x 50 cm", ratio: 70/50 },
      { id: "18x24-LANDSCAPE", label: "Poster 24x18", sub: "24 x 18 in", ratio: 24/18 },
      { id: "24x36-LANDSCAPE", label: "Poster 36x24", sub: "36 x 24 in", ratio: 36/24 },
      { id: "LETTER-LANDSCAPE", label: "Letter (US)", sub: "11 x 8.5 in", ratio: 279/216 },
    ],
  },
  {
    title: "Digital & Social",
    icon: Share2,
    items: [
      { id: "1:1", label: "Instagram Square", sub: "1080 x 1080 px", ratio: 1 },
      { id: "INSTA-PORTRAIT", label: "Insta Portrait", sub: "1080 x 1350 px", ratio: 1080/1350 },
      { id: "9:16", label: "Story (9:16)", sub: "1080 x 1920 px", ratio: 9/16 },
      { id: "16:9", label: "Desktop (16:9)", sub: "1920 x 1080 px", ratio: 16/9 },
      { id: "TWITTER", label: "Twitter/X Post", sub: "1200 x 675 px", ratio: 1200/675 },
      { id: "LINKEDIN", label: "LinkedIn Post", sub: "1200 x 627 px", ratio: 1200/627 },
    ],
  },
];

export const LayoutPanel = () => {
  const { config, setConfig } = useMapStore();

  const handleRatioSelect = (id: any) => {
    setConfig({
      poster: {
        ...config.poster,
        ratio: id,
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Custom Resolution */}
      <div 
        role="button"
        tabIndex={0}
        onClick={() => {
          if (config.poster.ratio !== "CUSTOM") {
            setConfig({ poster: { ...config.poster, ratio: "CUSTOM" } });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (config.poster.ratio !== "CUSTOM") {
              setConfig({ poster: { ...config.poster, ratio: "CUSTOM" } });
            }
          }
        }}
        className={cn(
          "w-full p-4 rounded-2xl flex flex-col gap-4 border transition-all text-left cursor-pointer",
          config.poster.ratio === "CUSTOM" 
            ? "bg-accent-dim/10 border-accent ring-1 ring-accent shadow-lg shadow-accent/10" 
            : "bg-bg-surface border-border-subtle hover:border-text-muted opacity-80 hover:opacity-100"
        )}
      >
        <div className="flex items-center justify-between px-1 w-full">
          <div className="flex items-center gap-2">
            <Maximize2 className={cn("w-4 h-4", config.poster.ratio === "CUSTOM" ? "text-accent" : "text-text-secondary")} />
            <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em] font-space">
              Custom Resolution
            </h3>
          </div>
          {config.poster.ratio === "CUSTOM" && (
            <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
            </div>
          )}
        </div>

        <div className="flex items-end gap-2 w-full" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-1.5 flex-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider cursor-default">Width</label>
            <div className="relative">
              <input 
                type="number" 
                value={config.poster.width || ""} 
                onChange={(e) => setConfig({ poster: { ...config.poster, ratio: "CUSTOM", width: parseInt(e.target.value) || 0 } })}
                className="w-full bg-bg-base border border-border-subtle rounded-xl pl-3 pr-7 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text"
                placeholder="1920"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-text-secondary font-bold select-none pointer-events-none">px</span>
            </div>
          </div>
          
          <button 
            onClick={() => setConfig({ poster: { ...config.poster, width: config.poster.height, height: config.poster.width }})}
            className="h-10 px-2 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors cursor-pointer"
            title="Swap width and height"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="space-y-1.5 flex-1">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider cursor-default">Height</label>
            <div className="relative">
              <input 
                type="number" 
                value={config.poster.height || ""} 
                onChange={(e) => setConfig({ poster: { ...config.poster, ratio: "CUSTOM", height: parseInt(e.target.value) || 0 } })}
                className="w-full bg-bg-base border border-border-subtle rounded-xl pl-3 pr-7 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text"
                placeholder="1080"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-text-secondary font-bold select-none pointer-events-none">px</span>
            </div>
          </div>
        </div>
      </div>

      {LAYOUT_CATEGORIES.map((category) => (
        <div key={category.title} className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <category.icon className="w-4 h-4 text-accent" />
            <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em] font-space">
              {category.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {category.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleRatioSelect(item.id)}
                className={cn(
                  "group relative p-4 bg-bg-surface border rounded-2xl transition-all text-left space-y-3",
                  config.poster.ratio === item.id
                    ? "border-accent ring-1 ring-accent shadow-lg shadow-accent/10"
                    : "border-border-subtle hover:border-text-muted"
                )}
              >
                <div>
                  <div className="text-[10px] font-bold text-text-primary uppercase tracking-tight line-clamp-1">
                    {item.label}
                  </div>
                  <div className="text-[9px] text-text-secondary font-mono">
                    {item.sub}
                  </div>
                </div>

                {/* Aspect Ratio Preview Box */}
                <div className="aspect-[4/3] w-full bg-bg-elevated rounded-lg flex items-center justify-center p-2 relative">
                  <div 
                    className="bg-accent rounded-sm shadow-sm transition-all group-hover:scale-105"
                    style={{ 
                      aspectRatio: item.ratio,
                      width: item.ratio >= 1.333 ? "100%" : "auto",
                      height: item.ratio < 1.333 ? "100%" : "auto",
                    }}
                  />
                </div>

                {config.poster.ratio === item.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
