"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Loader2, X, Navigation } from "lucide-react";
import { useMapStore } from "@/store/mapStore";

export const SearchPanel = () => {
  const { config, updateLocation } = useMapStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    updateLocation(lat, lng, config.location.zoom, config.location.pitch || 0, config.location.bearing || 0, result.display_name.split(',')[0]);
    setQuery("");
    setResults([]);
  };

  const handleLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        updateLocation(latitude, longitude, 12, 0, 0, "My Location");
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        {isSearching ? (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent animate-spin" />
        ) : (
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, mountain, or coords..."
          className="w-full bg-bg-surface border border-border-subtle rounded-2xl py-4 pl-12 pr-12 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-all placeholder:text-text-muted/60 shadow-inner"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-bg-elevated rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        )}
      </div>

      <button 
        onClick={handleLocate}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-bg-surface border border-border-subtle hover:border-accent/30 hover:bg-accent/5 transition-all group"
      >
        <Navigation className="w-5 h-5 text-accent" />
        <span className="text-sm font-bold text-text-primary tracking-wide">Use My Location</span>
      </button>

      {results.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-2 mb-3">
            Search Results
          </p>
          <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle/30">
            {results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-5 py-4 hover:bg-accent/5 flex items-start gap-4 transition-colors group/item"
              >
                <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center shrink-0 group-hover/item:bg-accent/20 transition-colors">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-text-primary line-clamp-1 group-hover/item:text-accent transition-colors">
                    {result.display_name.split(",")[0]}
                  </div>
                  <div className="text-[10px] text-text-secondary line-clamp-1 uppercase tracking-wider mt-1">
                    {result.display_name.split(",").slice(1).join(",").trim()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
