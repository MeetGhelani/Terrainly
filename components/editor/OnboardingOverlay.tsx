"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMapStore } from "@/store/mapStore";
import { Search, MapPin, Compass, Navigation, Loader2 } from "lucide-react";
import { searchLocation, SearchResult } from "@/lib/geocoding";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OnboardingOverlay = () => {
  const { isOnboarded, setOnboarded, updateLocation, setConfig, config } = useMapStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  // If already onboarded, don't show anything
  // We use a state to handle the hydration delay
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!isOnboarded);
  }, [isOnboarded]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        const data = await searchLocation(query);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setSelectedLocation(result);
    setQuery(result.display_name.split(",")[0]);
    setResults([]);
  };

  const handleGetLocation = () => {
    setIsGeolocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocode to get a name
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            setSelectedLocation({
              display_name: data.display_name,
              lat: latitude.toString(),
              lon: longitude.toString(),
            });
            setQuery(data.display_name.split(",")[0]);
          } catch (e) {
            setSelectedLocation({
              display_name: "My Location",
              lat: latitude.toString(),
              lon: longitude.toString(),
            });
            setQuery("My Location");
          }
          setIsGeolocating(false);
        },
        () => {
          alert("Could not get your location. Please search manually.");
          setIsGeolocating(false);
        }
      );
    }
  };

  const handleConfirm = () => {
    if (!selectedLocation) return;

    const lat = parseFloat(selectedLocation.lat);
    const lng = parseFloat(selectedLocation.lon);
    
    // Parse location for better labeling
    const parts = selectedLocation.display_name.split(",");
    const city = (parts[0] || "EXPLORE").trim().toUpperCase();
    const country = (parts[parts.length - 1] || "WORLD").trim().toUpperCase();

    // Update location and default composition settings
    updateLocation(lat, lng, 12, 0, 0, selectedLocation.display_name);
    
    setConfig({
      text: {
        ...config.text,
        city: city,
        subtitle: country,
        tagline: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`,
      },
      basemap: "vector", // Default to a crisp vector style
      cartography: {
        ...config.cartography,
        grid: {
          ...config.cartography.grid,
          enabled: false, // Start with a clean look
        }
      }
    });

    setOnboarded(true);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-bg-base/80 backdrop-blur-2xl animate-in fade-in duration-700" />
      
      {/* Content Container */}
      <div className="relative w-full max-w-md flex flex-col items-center animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-32 h-32 relative mb-6">
            <img 
              src="/logos/logo.png" 
              alt="Terrainly Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(79,142,247,0.3)] animate-pulse"
            />
          </div>
          <h1 className="text-4xl font-space font-extrabold tracking-tight text-white uppercase mb-2">
            Terrainly
          </h1>
          <p className="text-text-secondary text-sm font-medium tracking-wide uppercase opacity-70">
            Cartographic Poster Studio
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full bg-bg-panel border border-border-subtle rounded-3xl shadow-2xl p-6 space-y-4">
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 px-1">
            Choose Location
          </div>

          <div className="relative group">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a city or place"
              className="w-full bg-bg-surface border border-border-subtle rounded-xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-all placeholder:text-text-muted font-medium"
            />

            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-surface border border-border-subtle rounded-2xl shadow-2xl overflow-hidden z-10 max-h-60 overflow-y-auto">
                {results.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(result)}
                    className="w-full text-left px-4 py-3 hover:bg-bg-elevated flex items-start gap-3 border-b border-border-subtle/50 last:border-0 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-accent mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary line-clamp-1">{result.display_name.split(",")[0]}</div>
                      <div className="text-xs text-text-secondary line-clamp-1">{result.display_name.split(",").slice(1).join(",")}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleGetLocation}
            disabled={isGeolocating}
            className="w-full flex items-center justify-center gap-3 py-4 bg-bg-elevated/50 hover:bg-bg-elevated border border-border-subtle rounded-xl transition-all group text-text-primary font-bold uppercase text-xs tracking-widest"
          >
            {isGeolocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
            ) : (
              <Navigation className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            )}
            <span>Get My Location</span>
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="w-full py-4 bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:hover:bg-accent text-white rounded-xl font-bold uppercase tracking-[0.1em] transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
          >
            OK
          </button>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-[10px] text-text-muted uppercase tracking-[0.3em] font-medium opacity-50">
          Powered by OpenStreetMap • Vector Tiles
        </p>
      </div>
    </div>
  );
};
