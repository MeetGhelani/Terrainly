"use client";

import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useMapStore } from "@/store/mapStore";
import { 
  Map as MapIcon, 
  Palette, 
  Layers, 
  Type, 
  Square, 
  Layout,
  Compass, 
  Pin, 
  Download, 
  Settings 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { BasemapPanel } from "@/components/editor/panels/BasemapPanel";
import { StylePanel } from "@/components/editor/panels/StylePanel";
import { LayoutPanel } from "@/components/editor/panels/LayoutPanel";
import { LayersPanel } from "@/components/editor/panels/LayersPanel";
import { OverlaysPanel } from "@/components/editor/panels/OverlaysPanel";
import { RoutesPanel } from "@/components/editor/panels/RoutesPanel";
import { FramePanel } from "@/components/editor/panels/FramePanel";
import { TextPanel } from "@/components/editor/panels/TextPanel";
import { SettingsPanel } from "@/components/editor/panels/SettingsPanel";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TABS = [
  { id: "basemap", icon: Palette, label: "Theme" },
  { id: "layout", icon: Layout, label: "Layout" },
  { id: "frame", icon: Square, label: "Frame" },
  { id: "style", icon: Type, label: "Style" },
  { id: "layers", icon: Layers, label: "Layers" },
  { id: "overlays", icon: Pin, label: "Markers" },
  { id: "routes", icon: Compass, label: "Routes" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export const SidePanel = () => {
  const { activeTab, setActiveTab } = useMapStore();

  useHotkeys("esc", () => setActiveTab(null), {
    enabled: activeTab !== null,
    enableOnFormTags: false, // Don't close if user is typing
  });

  const handleTabClick = (id: string) => {
    if (activeTab === id) {
      setActiveTab(null); // Collapse
    } else {
      setActiveTab(id);
    }
  };

  const renderPanel = () => {
    if (!activeTab) return null;
    switch (activeTab) {
      case "basemap":
        return <BasemapPanel />;
      case "layout":
        return <LayoutPanel />;
      case "style":
        return <StylePanel />;
      case "layers":
        return <LayersPanel />;
      case "overlays":
        return <OverlaysPanel />;
      case "routes":
        return <RoutesPanel />;
      case "frame":
        return <FramePanel />;
      case "text":
        return <TextPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <aside className={cn(
      "fixed left-0 top-14 bottom-0 bg-bg-panel border-r border-border-subtle md:flex hidden shrink-0 transition-all duration-300 z-40 shadow-2xl",
      activeTab ? "w-[400px]" : "w-24"
    )}>
      {/* Vertical Navigation Strip */}
      <nav className="w-24 h-full border-r border-border-subtle flex flex-col items-center py-4 gap-2 shrink-0 bg-bg-panel/50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "group relative flex flex-col items-center justify-center w-20 h-16 rounded-xl transition-all shrink-0",
              activeTab === tab.id 
                ? "bg-accent text-white shadow-lg shadow-accent/20" 
                : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
              tab.id === "settings" && "mt-auto mb-2"
            )}
            title={tab.label}
          >
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-tight text-center px-1 leading-tight">
              {tab.label}
            </span>
            
            {activeTab === tab.id && (
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-accent rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      {activeTab && (
        <div className="flex-1 flex flex-col min-w-0 bg-bg-panel animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="h-14 border-b border-border-subtle flex items-center px-6 shrink-0">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em] font-space">
              {TABS.find(t => t.id === activeTab)?.label ?? activeTab}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {renderPanel()}
          </div>
        </div>
      )}
    </aside>
  );
};
