"use client";

import React, { useRef } from "react";
import { useMapStore } from "@/store/mapStore";
import { Share2, Trash2, Upload, Route as RouteIcon, Info, MapPin } from "lucide-react";
import { parseGPX } from "@/lib/gpx";

export const RoutesPanel = () => {
  const { config, setConfig } = useMapStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newRoutes = parseGPX(content);
      if (newRoutes.length > 0) {
        setConfig({ routes: [...config.routes, ...newRoutes] });
      }
    };
    reader.readAsText(file);
  };

  const removeRoute = (id: string) => {
    setConfig({ routes: config.routes.filter(r => r.id !== id) });
  };

  const updateRouteName = (id: string, name: string) => {
    setConfig({
      routes: config.routes.map(r => r.id === id ? { ...r, name } : r)
    });
  };

  return (
    <div className="space-y-8 pb-8 select-none pt-2">
      {/* Import Section */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-80">Import GPX Data</h3>
        
        <input
          type="file"
          accept=".gpx"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 border-2 border-dashed border-white/10 rounded-2xl hover:border-accent/50 hover:bg-accent/5 transition-all group flex flex-col items-center gap-4 bg-bg-panel/20 shadow-inner"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/20 transition-all">
            <Upload className="w-6 h-6 text-text-muted group-hover:text-accent" />
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-text-secondary group-hover:text-text-primary uppercase tracking-wide">
              Upload Track Log
            </div>
            <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest leading-relaxed opacity-60">
              Select your .GPX file to render<br/>hiking or cycling routes
            </div>
          </div>
        </button>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl flex gap-4">
        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
          Uploaded routes are processed locally and rendered as high-precision vectors. Support for Garmin, Strava, and Komoot exports.
        </p>
      </div>

      {/* Active Routes List */}
      {config.routes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Active Trails</h3>
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest">{config.routes.length} Tracks</span>
          </div>
          
          <div className="space-y-3">
            {config.routes.map((route) => (
              <div key={route.id} className="p-4 bg-bg-panel/20 border border-white/5 rounded-xl space-y-3 group hover:border-white/10 transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div 
                      className="w-4 h-1 rounded-full shrink-0" 
                      style={{ backgroundColor: route.color }} 
                    />
                    <input
                      type="text"
                      value={route.name}
                      onChange={(e) => updateRouteName(route.id, e.target.value)}
                      className="bg-transparent border-none p-0 text-xs font-bold text-text-primary focus:ring-0 truncate w-full"
                    />
                  </div>
                  <button
                    onClick={() => removeRoute(route.id)}
                    className="p-1 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {route.points.length} Points
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RouteIcon className="w-3 h-3" />
                    Vector Route
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
