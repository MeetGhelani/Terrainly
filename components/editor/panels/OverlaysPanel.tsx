"use client";

import React, { useRef, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import { 
  Pin, Heart, Home, Star, Circle, Square, X, Target, 
  Sun, Moon, Building, Send, Snowflake, Store, Camera, 
  Flower, Trees as Tree, Flag, Settings, Edit3, Info, 
  Plus, Upload, Trash2, Droplets 
} from "lucide-react";
import { Overlay } from "@/types/map";

const MARKER_ICONS = [
  { id: 'default', icon: Droplets, label: 'Default' },
  { id: 'pin', icon: Pin, label: 'Pin' },
  { id: 'heart', icon: Heart, label: 'Heart' },
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'square', icon: Square, label: 'Square' },
  { id: 'x', icon: X, label: 'X' },
  { id: 'target', icon: Target, label: 'Target' },
  { id: 'sun', icon: Sun, label: 'Sun' },
  { id: 'moon', icon: Moon, label: 'Moon' },
  { id: 'building', icon: Building, label: 'Building' },
  { id: 'send', icon: Send, label: 'Send' },
  { id: 'snowflake', icon: Snowflake, label: 'Snowflake' },
  { id: 'shop', icon: Store, label: 'Shop' },
  { id: 'camera', icon: Camera, label: 'Camera' },
  { id: 'flower', icon: Flower, label: 'Flower' },
  { id: 'tree', icon: Tree, label: 'Tree' },
  { id: 'flag', icon: Flag, label: 'Flag' },
];

export const OverlaysPanel = () => {
  const { config, setConfig } = useMapStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAll, setShowAll] = useState(false);

  const addMarker = (iconId: string) => {
    const newOverlay: Overlay = {
      id: crypto.randomUUID(),
      type: 'marker',
      lat: config.location.lat,
      lng: config.location.lng,
      label: iconId.charAt(0).toUpperCase() + iconId.slice(1),
      icon: iconId, 
      color: config.themeColors.roads_major, 
      size: 32,
    };
    setConfig({ overlays: [...config.overlays, newOverlay] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB to avoid bloated localStorage)
    if (file.size > 1024 * 1024) {
      alert("Marker image must be under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newMarker = {
        id: crypto.randomUUID(),
        url: dataUrl,
        name: file.name.split('.')[0]
      };
      
      setConfig({ 
        uploadedMarkers: [...(config.uploadedMarkers || []), newMarker] 
      });
    };
    reader.readAsDataURL(file);
  };

  const addCustomMarker = (url: string, name: string) => {
    const newOverlay: Overlay = {
      id: crypto.randomUUID(),
      type: 'marker',
      lat: config.location.lat,
      lng: config.location.lng,
      label: name,
      icon: url, // Store the data URL as the icon ID
      color: config.themeColors.roads_major,
      size: 48, // Default larger for custom icons
    };
    setConfig({ overlays: [...config.overlays, newOverlay] });
  };

  const removeUploadedMarker = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfig({
      uploadedMarkers: config.uploadedMarkers.filter(m => m.id !== id)
    });
  };

  return (
    <div className="space-y-7 pb-6 select-none pt-2">
      {/* Marker Icons Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-80">Standard Markers</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {(showAll ? MARKER_ICONS : MARKER_ICONS.slice(0, 11)).map((item) => (
            <button
              key={item.id}
              onClick={() => addMarker(item.id)}
              className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl bg-bg-panel/20 border border-white/5 hover:bg-accent/10 hover:border-accent/30 group transition-all"
            >
              <item.icon className="w-7 h-7 text-accent group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-text-secondary group-hover:text-text-primary">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-accent/30 hover:bg-accent/5 group transition-all h-full"
          >
            <div className="flex flex-col gap-0.5 items-center">
              {showAll ? (
                <div className="w-4 h-0.5 bg-text-muted rounded-full" />
              ) : (
                <Plus className="w-4 h-4 text-text-muted" />
              )}
            </div>
            <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary mt-4 uppercase tracking-wider">
              {showAll ? 'Show less' : 'Show more'}
            </span>
          </button>
        </div>
      </div>

      {/* Uploaded Markers Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-80 flex items-center justify-between">
          Your Uploads
          <span className="text-[8px] font-medium opacity-50 lowercase tracking-normal">Supports SVG, PNG</span>
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {/* Custom Uploaded Markers */}
          {config.uploadedMarkers?.map((m) => (
            <button 
              key={m.id}
              onClick={() => addCustomMarker(m.url, m.name)}
              className="relative flex flex-col items-center justify-center gap-2 p-4 min-h-[96px] rounded-xl bg-bg-panel/40 border border-white/5 hover:border-accent/30 group transition-all"
            >
              <img src={m.url} alt={m.name} className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
              <button 
                onClick={(e) => removeUploadedMarker(e, m.id)}
                className="absolute top-1 right-1 p-1 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
              <span className="text-[9px] font-bold text-text-secondary truncate w-full text-center">{m.name}</span>
            </button>
          ))}

          {/* Upload Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 p-4 min-h-[96px] rounded-xl border-2 border-dashed border-white/10 hover:border-accent/30 hover:bg-accent/5 group transition-all"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/20 transition-all">
              <Upload className="w-4 h-4 text-text-muted group-hover:text-accent" />
            </div>
            <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary text-center leading-tight uppercase tracking-wider mt-1">Add Icon</span>
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".svg,.png,.jpg,.jpeg" 
          onChange={handleFileUpload}
        />
      </div>

      {/* Active Selection List (Minimalist) */}
      {config.overlays.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
             <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Active Overlays</h3>
             <button 
               onClick={() => setConfig({ overlays: [] })}
               className="text-[9px] font-bold text-danger/60 hover:text-danger uppercase tracking-widest transition-colors"
             >
               Clear All
             </button>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {config.overlays.map((overlay) => (
              <div key={overlay.id} className="p-3 bg-bg-panel/10 border border-white/5 rounded-lg flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: overlay.color }} />
                  <span className="text-[11px] font-bold text-text-secondary">{overlay.label}</span>
                </div>
                <button
                  onClick={() => setConfig({ overlays: config.overlays.filter(o => o.id !== overlay.id) })}
                  className="p-1 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
