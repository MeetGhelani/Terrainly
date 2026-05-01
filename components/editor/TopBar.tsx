"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMapStore } from "@/store/mapStore";
import { Undo2, Redo2, Search, Share2, Download, Menu, Loader2, MapPin, X, Crosshair, Mountain } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { searchLocation, SearchResult } from "@/lib/geocoding";

export const TopBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { config, updateLocation, setConfig, setExportModalOpen } = useMapStore();
  const { undo, redo, pastStates, futureStates } = useMapStore.temporal.getState();
  const searchRef = useRef<HTMLDivElement>(null);

  // Keyboard Shortcuts
  useHotkeys('ctrl+z, cmd+z', (e) => { e.preventDefault(); undo(); });
  useHotkeys('ctrl+shift+z, cmd+shift+z, ctrl+y, cmd+y', (e) => { e.preventDefault(); redo(); });
  useHotkeys('ctrl+s, cmd+s', (e) => { e.preventDefault(); console.log("Exporting..."); });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        const data = await searchLocation(query);
        setResults(data);
        setIsSearching(false);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Simple city/country split for labeling
    const parts = result.display_name.split(",");
    const city = parts[0]?.trim().toUpperCase();
    const country = parts[parts.length - 1]?.trim().toUpperCase();

    updateLocation(lat, lng, 12, config.location.pitch, config.location.bearing, result.display_name);
    
    // Also update text labels automatically
    setConfig({
      text: {
        ...useMapStore.getState().config.text,
        city: city || "CITY",
        subtitle: country || "COUNTRY",
        tagline: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`,
      }
    });

    // Imperatively fly the live map — store update alone won't move it
    // because MapCanvas only reads location on initial mount.
    // @ts-ignore
    const liveMap = window.__terrainly_map;
    if (liveMap) {
      liveMap.flyTo({ center: [lng, lat], zoom: 12, duration: 1400, essential: true });
    }

    setQuery("");
    setShowResults(false);
  };  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
          const data = await res.json();
          
          const city = (data.address.city || data.address.town || data.address.village || data.address.county || "YOUR LOCATION").toUpperCase();
          const country = (data.address.country || "").toUpperCase();
          
          updateLocation(lat, lng, 14, config.location.pitch, config.location.bearing, data.display_name || "Current Location");
          
          setConfig({
            text: {
              ...useMapStore.getState().config.text,
              city,
              subtitle: country,
              tagline: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`,
            }
          });
        } catch (e) {
          updateLocation(lat, lng, 14, config.location.pitch, config.location.bearing, "Current Location");
          setConfig({
            text: {
              ...useMapStore.getState().config.text,
              city: "CURRENT LOCATION",
              subtitle: "",
              tagline: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`,
            }
          });
        }

        // @ts-ignore
        const liveMap = window.__terrainly_map;
        if (liveMap) {
          liveMap.flyTo({ center: [lng, lat], zoom: 14, duration: 1400, essential: true });
        }
      });
    }
  };

  const handleAddMarker = () => {
    const id = `marker-${Date.now()}`;
    setConfig({
      overlays: [
        ...config.overlays,
        {
          id,
          type: "text-label",
          label: "New Point",
          lat: config.location.lat,
          lng: config.location.lng,
          color: "#ffffff",
          size: 16,
          fontFamily: "Space Grotesk",
          fontSize: 16,
          fontWeight: "bold",
          textColor: "#ffffff",
        }
      ]
    });
  };

  return (
    <header className="h-14 border-b border-border-subtle bg-bg-panel flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Menu className="w-5 h-5 text-text-secondary" />
        </div>
        <div className="flex items-center gap-2">
          <img src="/logos/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="font-space text-xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
            Terrainly
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-1 ml-4 border-l border-border-subtle pl-4">
          <button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            className="p-1.5 rounded-md hover:bg-bg-elevated text-text-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            className="p-1.5 rounded-md hover:bg-bg-elevated text-text-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-6 hidden md:flex items-center gap-2" ref={searchRef}>
        <div className="flex items-center gap-3 px-3 py-1.5  mr-2 shrink-0 h-10">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent leading-none">Location</span>
        </div>

        <div className="flex-1 relative group">
          {isSearching ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
          )}
          <input
            type="text"
            value={query || (showResults ? query : config.location.label || "")}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 3 && setShowResults(true)}
            placeholder="Search city, coordinate or landmark..."
            className="w-full bg-bg-surface border border-border-subtle rounded-full py-2.5 pl-11 pr-12 text-xs text-text-primary focus:outline-none focus:border-accent/50 transition-all placeholder:text-text-muted/60 shadow-inner"
          />
          
          {(query || results.length > 0) && (
            <button 
              onClick={() => { setQuery(""); setResults([]); setShowResults(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-bg-elevated rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
            </button>
          )}

          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-bg-panel border border-border-subtle rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {results.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(result)}
                    className="w-full text-left px-5 py-4 hover:bg-accent/5 flex items-start gap-4 transition-colors border-b border-border-subtle/30 last:border-0 group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 group-hover/item:bg-accent/20 transition-colors">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-text-primary line-clamp-1 group-hover/item:text-accent transition-colors">
                        {result.display_name.split(",")[0]}
                      </div>
                      <div className="text-[10px] text-text-secondary line-clamp-1 uppercase tracking-wider mt-0.5">
                        {result.display_name.split(",").slice(1).join(",").trim()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          <button 
            onClick={handleLocate}
            className="w-10 h-10 flex items-center justify-center bg-bg-panel border border-border-subtle rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-all group"
            title="Locate Me"
          >
            <Crosshair className="w-4 h-4 text-text-secondary group-hover:text-accent" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
