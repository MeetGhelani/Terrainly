"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { Square, Layers, Sparkles } from "lucide-react";
import { ColorPicker } from "@/components/ui/ColorPicker";

const TEXTURES = [
  { id: "none", label: "Flat Color" },
  { id: "parchment", label: "Parchment" },
  { id: "linen", label: "Linen" },
  { id: "aged", label: "Aged Paper" },
  { id: "kraft", label: "Kraft Paper" },
  { id: "noise", label: "Subtle Noise" },
];

const FRAME_STYLES = [
  { id: "none", label: "Borderless" },
  { id: "thin", label: "Thin Line" },
  { id: "double", label: "Double Line" },
  { id: "ornate", label: "Vintage Ornate" },
];

export const FramePanel = () => {
  const { config, setConfig } = useMapStore();

  const updateFrame = (patch: Partial<typeof config.frame>) => {
    setConfig({
      frame: { ...config.frame, ...patch },
    });
  };

  return (
    <div className="space-y-8">
      {/* Border Styles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Border Style
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {FRAME_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => updateFrame({ style: style.id as any })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                config.frame.style === style.id
                  ? "bg-accent-dim border-accent/50 text-accent"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:border-text-muted"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {config.frame.style !== "none" && (
          <div className="pt-4 space-y-6 animate-in fade-in slide-in-from-top-2">
            <ColorPicker
              label="Border Color"
              value={config.frame.color}
              onChange={(color) => updateFrame({ color })}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Thickness
                </label>
                <span className="text-[10px] font-mono text-text-muted">
                  {config.frame.thickness}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={config.frame.thickness}
                onChange={(e) => updateFrame({ thickness: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Background Textures */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Background Texture
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {TEXTURES.map((texture) => (
            <button
              key={texture.id}
              onClick={() => updateFrame({ texture: texture.id as any })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                config.frame.texture === texture.id
                  ? "bg-accent-dim border-accent/50 text-accent"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:border-text-muted"
              }`}
            >
              {texture.label}
            </button>
          ))}
        </div>
      </div>

      {/* Effects */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Effects
          </h3>
        </div>

        <button
          onClick={() => updateFrame({ shadow: !config.frame.shadow })}
          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
            config.frame.shadow 
              ? "bg-accent-dim border-accent/50 text-accent" 
              : "bg-bg-surface border-border-subtle text-text-secondary"
          }`}
        >
          <span className="text-sm font-medium">Soft Drop Shadow</span>
          <div className={`w-1.5 h-1.5 rounded-full ${config.frame.shadow ? "bg-accent" : "bg-text-muted"}`} />
        </button>
      </div>
    </div>
  );
};
