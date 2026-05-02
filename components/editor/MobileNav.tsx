"use client";

import React from "react";
import { 
  Search,
  Palette, 
  Square, 
  Type, 
  Layers, 
  Pin, 
  Compass, 
  Settings 
} from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TABS = [
  { id: "search", icon: Search, label: "Location" },
  { id: "basemap", icon: Palette, label: "Theme" },
  { id: "layout", icon: Square, label: "Layout" },
  { id: "style", icon: Type, label: "Style" },
  { id: "layers", icon: Layers, label: "Layers" },
  { id: "overlays", icon: Pin, label: "Markers" },
  { id: "routes", icon: Compass, label: "Routes" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export const MobileNav = () => {
  const { activeTab, setActiveTab } = useMapStore();

  const handleTabClick = (id: string) => {
    if (activeTab === id) {
      setActiveTab(null);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-bg-panel/80 backdrop-blur-xl border-t border-border-subtle flex md:hidden items-center justify-start overflow-x-auto z-[60] safe-area-pb custom-scrollbar-h">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center min-w-[25%] h-full gap-1 transition-all relative shrink-0",
            activeTab === tab.id ? "text-accent scale-110" : "text-text-secondary"
          )}
        >
          <tab.icon className="w-6 h-6" />
          <span className="text-[8px] font-bold uppercase tracking-tighter">
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-b-full" />
          )}
        </button>
      ))}
    </nav>
  );
};
