"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
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
import { SearchPanel } from "@/components/editor/panels/SearchPanel";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TABS = [
  { id: "search", label: "Location" },
  { id: "basemap", label: "Theme" },
  { id: "layout", label: "Layout" },
  { id: "style", label: "Style" },
  { id: "layers", label: "Layers" },
  { id: "overlays", label: "Markers" },
  { id: "routes", label: "Routes" },
  { id: "settings", label: "Settings" },
];

export const MobilePanel = () => {
  const { activeTab, setActiveTab } = useMapStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or on backdrop
  const handleClose = () => setActiveTab(null);

  const renderPanel = () => {
    if (!activeTab) return null;
    switch (activeTab) {
      case "search": return <SearchPanel />;
      case "basemap": return <BasemapPanel />;
      case "layout": return <LayoutPanel />;
      case "style": return <StylePanel />;
      case "layers": return <LayersPanel />;
      case "overlays": return <OverlaysPanel />;
      case "routes": return <RoutesPanel />;
      case "frame": return <FramePanel />;
      case "text": return <TextPanel />;
      case "settings": return <SettingsPanel />;
      default: return null;
    }
  };

  if (!activeTab) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden flex-col justify-end p-4 pb-24">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        ref={panelRef}
        className="relative w-full bg-bg-panel border border-border-subtle rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.5)] max-h-[70vh] flex flex-col animate-in slide-in-from-bottom-full duration-500 overflow-hidden"
      >
        {/* Handle */}
        <div className="w-12 h-1 bg-bg-elevated rounded-full mx-auto mt-4 mb-2" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-border-subtle/30">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] font-space">
            {TABS.find(t => t.id === activeTab)?.label ?? activeTab}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-bg-elevated text-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};
