"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMapStore } from "@/store/mapStore";
import { MapPin, ZoomIn, Compass, Search, Loader2, X } from "lucide-react";

interface GeoResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

export const LocationPanel = () => {
  const { config, updateLocation } = useMapStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Geocoding via Nominatim (free, no API key) ──────────────────────────────
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=6&addressdetails=0`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: GeoResult[] = await res.json();
      setResults(data);
      setShowDropdown(data.length > 0);
    } catch (err) {
      console.error("Geocoding failed:", err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce: wait 400ms after user stops typing before firing the request
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!query.trim()) { setResults([]); setShowDropdown(false); return; }
    debounceTimer.current = setTimeout(() => fetchResults(query), 400);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query, fetchResults]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Handle result selection ─────────────────────────────────────────────────
  const handleSelect = (result: GeoResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    // Extract a clean city/place name from display_name (first segment before comma)
    const label = result.display_name.split(',')[0].trim();

    // Fly the map to the selected location
    // The map listens to config.location changes and will fly there via MapCanvas
    updateLocation(lat, lng, 12, config.location.pitch, config.location.bearing, label);

    // Also imperatively fly the map for instant feedback
    // @ts-ignore
    const liveMap = window.__terrainly_map;
    if (liveMap) {
      liveMap.flyTo({ center: [lng, lat], zoom: 12, duration: 1200, essential: true });
    }

    setQuery(label);
    setShowDropdown(false);
  };

  // ── Coordinate input change ─────────────────────────────────────────────────
  const handleCoordChange = (key: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (key === 'lat') updateLocation(numValue, config.location.lng, config.location.zoom, config.location.pitch, config.location.bearing);
      else updateLocation(config.location.lat, numValue, config.location.zoom, config.location.pitch, config.location.bearing);
      // Fly map imperatively
      // @ts-ignore
      const liveMap = window.__terrainly_map;
      if (liveMap) {
        const center: [number, number] = key === 'lat'
          ? [config.location.lng, numValue]
          : [numValue, config.location.lat];
        liveMap.flyTo({ center, zoom: config.location.zoom, duration: 800 });
      }
    }
  };

  // ── Shorten display name for dropdown readability ───────────────────────────
  const shortenName = (name: string) => {
    const parts = name.split(',').map(p => p.trim());
    return parts.slice(0, 3).join(', ');
  };

  return (
    <div className="space-y-8">
      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em] font-space">
            Navigation
          </span>
        </div>

        <div className="relative group">
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setShowDropdown(false); setQuery(""); }
              if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]);
            }}
            placeholder="Search city, landmark or address..."
            autoComplete="off"
            className="w-full bg-bg-panel border border-border-subtle rounded-xl px-4 py-3 pl-10 pr-10 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-all shadow-inner"
          />

          {/* Left icon */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
            {searching
              ? <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
              : <Search className="w-3.5 h-3.5 text-text-muted group-focus-within:text-accent transition-colors" />
            }
          </div>

          {/* Clear button */}
          {query && (
            <button
              onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dropdown */}
          {showDropdown && results.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1 z-50 bg-bg-panel border border-border-subtle rounded-xl overflow-hidden shadow-2xl"
            >
              {results.map((r, i) => (
                <button
                  key={r.place_id}
                  onClick={() => handleSelect(r)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent/5 transition-colors ${
                    i < results.length - 1 ? 'border-b border-border-subtle/30' : ''
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-text-primary truncate">
                      {r.display_name.split(',')[0].trim()}
                    </div>
                    <div className="text-[10px] text-text-muted truncate mt-0.5">
                      {shortenName(r.display_name)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Precision Coordinates ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Precision Coordinates
          </span>
          <button
            onClick={() => {
              if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const { latitude, longitude } = pos.coords;
                  updateLocation(latitude, longitude, 12, config.location.pitch, config.location.bearing, "My Location");
                  // @ts-ignore
                  window.__terrainly_map?.flyTo({ center: [longitude, latitude], zoom: 12, duration: 1500 });
                });
              }
            }}
            className="flex items-center gap-1.5 px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-md border border-accent/20 transition-all text-[9px] font-bold uppercase tracking-wider"
          >
            <Compass className="w-3 h-3" />
            Locate Me
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-px bg-border-subtle/30 rounded-lg overflow-hidden border border-border-subtle/30">
          <div className="bg-bg-panel/40 p-3 space-y-1.5">
            <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={config.location.lat.toFixed(4)}
              onChange={(e) => handleCoordChange('lat', e.target.value)}
              className="w-full bg-transparent text-xs text-text-primary font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="bg-bg-panel/40 p-3 space-y-1.5 border-l border-border-subtle/30">
            <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={config.location.lng.toFixed(4)}
              onChange={(e) => handleCoordChange('lng', e.target.value)}
              className="w-full bg-transparent text-xs text-text-primary font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* ── Zoom ────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
            Magnification
          </span>
          <span className="text-[10px] font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">
            x{config.location.zoom.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          step="0.1"
          value={config.location.zoom}
          onChange={(e) => updateLocation(config.location.lat, config.location.lng, parseFloat(e.target.value), config.location.pitch, config.location.bearing)}
          className="w-full h-1 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* ── Active Viewport ─────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-border-subtle/30">
        <div className="flex items-center gap-3 p-3.5 bg-accent/[0.03] rounded-xl border border-accent/10">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Active Viewport</div>
            <div className="text-[11px] text-text-primary font-medium truncate">
              {config.location.label || "Unnamed Location"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
