"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { Layers } from "lucide-react";

// Converts map radius (metres) ↔ MapLibre zoom level
// Approximate: every 2× distance = ~1 zoom level out
const radiusToZoom = (r: number): number => {
  const zoom = 16 - Math.log2(r / 100);
  return Math.max(0, Math.min(18, zoom));
};

const zoomToRadius = (z: number): number => {
  return Math.round(100 * Math.pow(2, 16 - z));
};

const formatRadius = (m: number): string => {
  if (m >= 1000) {
    return `${(m / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;
  }
  return `${m} m`;
};

// Reusable toggle row matching the reference image
const ToggleRow = ({
  label,
  description,
  enabled,
  onChange,
}: { label: string; description?: string; enabled: boolean; onChange: () => void }) => (
  <div className="py-3.5 border-b border-border-subtle/60 last:border-0">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? "bg-accent" : "bg-bg-elevated border border-border-subtle"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
    {description && (
      <div className="text-[10px] text-text-secondary mt-1.5 pr-8 leading-relaxed">
        {description}
      </div>
    )}
  </div>
);

// Layer ID → human label for the LAYERS section
const LAYER_ROWS: { id: string; label: string }[] = [
  { id: "landcover", label: "Show landcover" },
  { id: "buildings", label: "Show buildings" },
  { id: "water",     label: "Show water" },
  { id: "parks",     label: "Show parks" },
  { id: "roads",     label: "Show roads" },
  { id: "rail",      label: "Show rail" },
  { id: "aeroway",   label: "Show aeroway" },
];

export const LayersPanel = () => {
  const { config, setConfig, updateLocation } = useMapStore();

  const toggleLayer = (id: string) => {
    setConfig({
      layers: config.layers.map(l =>
        l.id === id ? { ...l, visible: !l.visible } : l
      ),
    });
  };

  const getLayerVisible = (id: string) =>
    config.layers.find(l => l.id === id)?.visible ?? true;

  const handleRadiusChange = (metres: number) => {
    setConfig({ mapRadius: metres });
    const zoom = radiusToZoom(metres);
    updateLocation(config.location.lat, config.location.lng, zoom, config.location.pitch, config.location.bearing);
  };

  // Slider: log scale from 100m to 20,000,000m
  // Map to a 0-100 linear range for the input
  const MIN_LOG = Math.log10(100);
  const MAX_LOG = Math.log10(20_000_000);
  const radiusToSlider = (r: number) =>
    Math.round(((Math.log10(r) - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100);
  const sliderToRadius = (s: number) =>
    Math.round(Math.pow(10, MIN_LOG + (s / 100) * (MAX_LOG - MIN_LOG)));

  const sliderVal = radiusToSlider(config.mapRadius);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Layer Visibility ── */}
      {/* ── Coordinate Grid ── */}
      <div className="space-y-4">
        <div>
          <ToggleRow
            label="Coordinate grid"
            enabled={config.cartography.grid.enabled}
            onChange={() =>
              setConfig({
                cartography: {
                  ...config.cartography,
                  grid: { 
                    ...config.cartography.grid, 
                    enabled: !config.cartography.grid.enabled,
                    // Always sync color to theme text when turning on
                    color: !config.cartography.grid.enabled
                      ? (config.themeColors.text || "#ffffff")
                      : config.cartography.grid.color,
                    // Ensure opacity starts at a healthy 50% if it was very low
                    opacity: !config.cartography.grid.enabled && config.cartography.grid.opacity < 0.2
                      ? 0.5
                      : config.cartography.grid.opacity
                  },
                },
              })
            }
          />
          {config.cartography.grid.enabled && (
            <div className="pl-4 pr-2 py-4 space-y-4 mb-2">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-text-secondary font-medium">
                  <span>Spacing</span>
                  <span>{config.cartography.grid.spacing}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={config.cartography.grid.spacing}
                  onChange={(e) => setConfig({
                    cartography: {
                      ...config.cartography,
                      grid: { ...config.cartography.grid, spacing: parseInt(e.target.value) }
                    }
                  })}
                  className="w-full h-1 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-text-secondary font-medium">
                  <span>Thickness</span>
                  <span>{config.cartography.grid.thickness || 1}px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={config.cartography.grid.thickness || 1}
                  onChange={(e) => setConfig({
                    cartography: {
                      ...config.cartography,
                      grid: { ...config.cartography.grid, thickness: parseFloat(e.target.value) }
                    }
                  })}
                  className="w-full h-1 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-text-secondary font-medium">
                  <span>Opacity</span>
                  <span>{Math.round(config.cartography.grid.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={config.cartography.grid.opacity}
                  onChange={(e) => setConfig({
                    cartography: {
                      ...config.cartography,
                      grid: { ...config.cartography.grid, opacity: parseFloat(e.target.value) }
                    }
                  })}
                  className="w-full h-1 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-secondary font-medium">Style</span>
                <select
                  className="bg-bg-elevated text-text-primary text-[11px] border border-border-subtle rounded px-2 py-1 outline-none focus:border-accent"
                  value={JSON.stringify(config.cartography.grid.dashArray)}
                  onChange={(e) => setConfig({
                    cartography: {
                      ...config.cartography,
                      grid: { ...config.cartography.grid, dashArray: JSON.parse(e.target.value) }
                    }
                  })}
                >
                  <option value="[1,0]">Solid</option>
                  <option value="[4,4]">Dashed</option>
                  <option value="[2,4]">Dotted</option>
                  <option value="[8,4,2,4]">Dash-Dot</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-text-secondary font-semibold uppercase tracking-wider">Color</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2.5">
                    {[config.themeColors.text || '#ffffff'].map((color, i) => (
                      <div key={i} className="relative w-5 h-5 flex items-center justify-center">
                        <input
                          type="color"
                          value={config.cartography.grid.color}
                          onChange={(e) => setConfig({
                            cartography: { ...config.cartography, grid: { ...config.cartography.grid, color: e.target.value } }
                          })}
                          className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-20"
                        />
                        <div
                          className="w-full h-full rounded-full border border-white/10 transition-all ring-2 ring-accent ring-offset-2 ring-offset-bg-panel scale-110 shadow-lg shadow-accent/20"
                          style={{ backgroundColor: config.cartography.grid.color }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setConfig({
                      cartography: { 
                        ...config.cartography, 
                        grid: { ...config.cartography.grid, color: config.themeColors.text || "#ffffff" } 
                      }
                    })}
                    className="text-[9px] font-bold text-accent uppercase tracking-widest hover:text-accent-hover transition-colors px-2 py-1.5 bg-accent/10 hover:bg-accent/20 rounded border border-accent/20"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <ToggleRow
            label="Compass rose"
            enabled={config.cartography.compass}
            onChange={() =>
              setConfig({ cartography: { ...config.cartography, compass: !config.cartography.compass } })
            }
          />
          {config.cartography.compass && (
            <div className="pl-4 pr-2 py-4 mb-2 space-y-3">
              <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">Compass Variant</span>
              <div className="grid grid-cols-3 gap-2">
                {(['minimal', 'classic', 'modern', 'ornate', 'nautical'] as const).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setConfig({
                      cartography: { ...config.cartography, compassStyle: variant }
                    })}
                    className={`px-2 py-2 text-[10px] font-bold uppercase tracking-tight rounded border transition-all ${
                      config.cartography.compassStyle === variant
                        ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105'
                        : 'bg-bg-elevated/50 text-text-secondary border-border-subtle hover:border-text-muted'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>


              <div className="space-y-2.5 pt-2 pb-4">
                <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">Corner Position</span>
                <div className="grid grid-cols-2 gap-1.5 w-16 h-16 p-1.5 bg-bg-elevated/20 rounded border border-border-subtle/30">
                  {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setConfig({
                        cartography: { ...config.cartography, compassPosition: pos }
                      })}
                      className={`w-full h-full rounded border border-transparent transition-all ${
                        config.cartography.compassPosition === pos 
                          ? 'bg-accent border-accent/50 shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)] scale-105' 
                          : 'bg-bg-elevated/60 border-border-subtle/40 hover:border-text-muted/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Compass Sliders */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                    <span>Size</span>
                    <span>{config.cartography.compassSize || 64}px</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="200"
                    step="4"
                    value={config.cartography.compassSize || 64}
                    onChange={(e) => setConfig({
                      cartography: { ...config.cartography, compassSize: parseInt(e.target.value) }
                    })}
                    className="w-full h-1 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                    <span>Opacity</span>
                    <span>{Math.round((config.cartography.compassOpacity ?? 0.8) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={config.cartography.compassOpacity ?? 0.8}
                    onChange={(e) => setConfig({
                      cartography: { ...config.cartography, compassOpacity: parseFloat(e.target.value) }
                    })}
                    className="w-full h-1 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                    <span>Margin from Corner</span>
                    <span>{config.cartography.compassMargin ?? 20}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="2"
                    value={config.cartography.compassMargin ?? 20}
                    onChange={(e) => setConfig({
                      cartography: { ...config.cartography, compassMargin: parseInt(e.target.value) }
                    })}
                    className="w-full h-1 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
                
                <p className="text-[10px] text-text-muted italic bg-bg-surface/30 p-2 rounded leading-relaxed">
                  Tip: Use margin to clear thick map borders.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-0">
        <ToggleRow
          label="3D Terrain Topography"
          description="Hold Right-Click and drag to tilt the camera and view elevation."
          enabled={config.terrain3d}
          onChange={() => setConfig({ terrain3d: !config.terrain3d })}
        />
        <div className="h-px w-full bg-border-subtle/40 my-1" />
        {LAYER_ROWS.map(({ id, label }) => (
          <ToggleRow
            key={id}
            label={label}
            enabled={getLayerVisible(id)}
            onChange={() => toggleLayer(id)}
          />
        ))}
      </div>

      {/* ── Map Details (Distance Slider) ── */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <span className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
            Map Details
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Distance (m)</span>
            <span className="text-sm font-mono text-text-primary font-semibold">
              {formatRadius(config.mapRadius)}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={sliderVal}
            onChange={e => handleRadiusChange(sliderToRadius(Number(e.target.value)))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-accent bg-bg-elevated"
          />

          <div className="flex justify-between text-[9px] font-mono text-text-secondary">
            <span>100 m</span>
            <span>100 km</span>
            <span>1,000 km</span>
            <span>20,000 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
