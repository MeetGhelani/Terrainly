"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { Type, AlignLeft, AlignCenter, AlignRight, Move } from "lucide-react";
import { ColorPicker } from "@/components/ui/ColorPicker";

const FONTS = [
  "Inter",
  "Space Grotesk",
  "JetBrains Mono",
  "Montserrat",
  "Playfair Display",
  "Lora",
  "Outfit",
  "Libre Baskerville",
];

export const TextPanel = () => {
  const { config, setConfig } = useMapStore();

  const updateText = (patch: Partial<typeof config.text>) => {
    setConfig({
      text: { ...config.text, ...patch },
    });
  };

  return (
    <div className="space-y-8">
      {/* Content Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Label Content
          </h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
              Primary Heading
            </label>
            <input
              type="text"
              value={config.text.city}
              onChange={(e) => updateText({ city: e.target.value })}
              className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
              Secondary Subtitle
            </label>
            <input
              type="text"
              value={config.text.subtitle}
              onChange={(e) => updateText({ subtitle: e.target.value })}
              className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
              Tagline / Coordinates
            </label>
            <input
              type="text"
              value={config.text.tagline}
              onChange={(e) => updateText({ tagline: e.target.value })}
              className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono"
            />
          </div>
        </div>
      </div>

      {/* Typography Styling */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Typography
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
              Font Family
            </label>
            <select
              value={config.text.font}
              onChange={(e) => updateText({ font: e.target.value })}
              className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <ColorPicker
            label="Text Color"
            value={config.text.color}
            onChange={(color) => updateText({ color })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                  Alignment
                </label>
              </div>
              <div className="flex bg-bg-surface border border-border-subtle rounded-lg p-1">
                {[
                  { id: "left", icon: AlignLeft },
                  { id: "center", icon: AlignCenter },
                  { id: "right", icon: AlignRight },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateText({ alignment: item.id as any })}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${
                      config.text.alignment === item.id
                        ? "bg-accent text-white"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                  Position
                </label>
              </div>
              <div className="flex bg-bg-surface border border-border-subtle rounded-lg p-1">
                {[
                  { id: "top", label: "Top" },
                  { id: "bottom", label: "Btm" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateText({ position: item.id as any })}
                    className={`flex-1 text-[10px] font-bold uppercase py-1.5 rounded-md transition-all ${
                      config.text.position === item.id
                        ? "bg-accent text-white"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positioning Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Custom Positioning
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                Horizontal Offset (X)
              </label>
              <span className="text-[10px] font-mono text-text-muted">
                {config.text.offsetX}px
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={config.text.offsetX}
              onChange={(e) => updateText({ offsetX: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                Vertical Offset (Y)
              </label>
              <span className="text-[10px] font-mono text-text-muted">
                {config.text.offsetY}px
              </span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="1"
              value={config.text.offsetY}
              onChange={(e) => updateText({ offsetY: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
          
          <p className="text-[10px] text-text-muted italic bg-bg-surface/50 p-2 rounded-lg leading-relaxed">
            Note: Text already automatically clears your border thickness. Use these sliders for fine-tuning.
          </p>
        </div>
      </div>

      {/* Poster Layout */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest">
            Poster Layout
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "1:1", label: "Square" },
            { id: "A3", label: "A3 Poster" },
            { id: "9:16", label: "Mobile" },
            { id: "16:9", label: "Desktop" },
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => setConfig({ poster: { ...config.poster, ratio: ratio.id as any } })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                config.poster.ratio === ratio.id
                  ? "bg-accent-dim border-accent/50 text-accent"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:border-text-muted"
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
