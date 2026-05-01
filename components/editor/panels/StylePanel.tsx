"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { Type, AlignLeft, AlignCenter, AlignRight, RotateCcw } from "lucide-react";

const FONTS = [
  "Default (Space Grotesk)",
  "Inter",
  "Montserrat",
  "Playfair Display",
  "Lora",
  "Outfit",
  "JetBrains Mono",
  "Libre Baskerville",
];

const FONT_VALUES: Record<string, string> = {
  "Default (Space Grotesk)": "Space Grotesk",
  "Inter": "Inter",
  "Montserrat": "Montserrat",
  "Playfair Display": "Playfair Display",
  "Lora": "Lora",
  "Outfit": "Outfit",
  "JetBrains Mono": "JetBrains Mono",
  "Libre Baskerville": "Libre Baskerville",
};

// Reusable toggle
const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
      enabled ? "bg-accent" : "bg-bg-elevated border border-border-subtle"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export const StylePanel = () => {
  const { config, setConfig } = useMapStore();

  const updateText = (patch: Partial<typeof config.text>) =>
    setConfig({ text: { ...config.text, ...patch } });

  const fontLabel = Object.entries(FONT_VALUES).find(([, v]) => v === config.text.font)?.[0]
    ?? "Default (Space Grotesk)";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Visibility Toggles ── */}
      <div className="space-y-1">
        <div className="flex items-center justify-between py-4 border-b border-border-subtle">
          <div>
            <span className="text-sm font-semibold text-text-primary">Poster text</span>
            <p className="text-[10px] text-text-secondary mt-0.5">Show city label on map</p>
          </div>
          <Toggle
            enabled={config.showPosterText}
            onChange={() => setConfig({ showPosterText: !config.showPosterText })}
          />
        </div>

        <div className="flex flex-col py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-text-primary">Overlay layer</span>
              <p className="text-[10px] text-text-secondary mt-0.5">Top, bottom, left, right gradient fades</p>
            </div>
            <Toggle
              enabled={config.showOverlayLayer}
              onChange={() => setConfig({ showOverlayLayer: !config.showOverlayLayer })}
            />
          </div>

          {config.showOverlayLayer && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Top Fade</label>
                  <div className="relative">
                    <input
                      type="number" min="0" max="100"
                      value={config.overlayTopFade ?? 0}
                      onChange={e => setConfig({ overlayTopFade: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                      className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Bottom Fade</label>
                  <div className="relative">
                    <input
                      type="number" min="0" max="100"
                      value={config.overlayBottomFade ?? 0}
                      onChange={e => setConfig({ overlayBottomFade: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                      className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Left Fade</label>
                  <div className="relative">
                    <input
                      type="number" min="0" max="100"
                      value={config.overlayLeftFade ?? 0}
                      onChange={e => setConfig({ overlayLeftFade: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                      className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Right Fade</label>
                  <div className="relative">
                    <input
                      type="number" min="0" max="100"
                      value={config.overlayRightFade ?? 0}
                      onChange={e => setConfig({ overlayRightFade: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                      className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Text Inputs ── */}
      <div className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Display city
            </label>
            <input
              type="text"
              value={config.text.city}
              onChange={e => updateText({ city: e.target.value })}
              className="w-full bg-bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Display country
            </label>
            <input
              type="text"
              value={config.text.subtitle}
              onChange={e => updateText({ subtitle: e.target.value })}
              className="w-full bg-bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Tagline / Coordinates
          </label>
          <input
            type="text"
            value={config.text.tagline}
            onChange={e => updateText({ tagline: e.target.value })}
            className="w-full bg-bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary font-mono focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* ── Font & Styling ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Font Family
          </label>
          <div className="relative">
            <select
              value={fontLabel}
              onChange={e => updateText({ font: FONT_VALUES[e.target.value] })}
              className="w-full bg-bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
            >
              {FONTS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">▾</div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Text Color
          </label>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 h-10 rounded-xl overflow-hidden border border-border-subtle cursor-pointer">
              <input
                type="color"
                value={config.text.color || config.themeColors.text}
                onChange={e => updateText({ color: e.target.value })}
                className="absolute -top-2 -left-2 w-[150%] h-[150%] cursor-pointer"
              />
            </div>
            <button 
              onClick={() => updateText({ color: "" })}
              className="w-10 h-10 shrink-0 flex items-center justify-center bg-bg-surface border border-border-subtle rounded-xl text-text-secondary hover:text-text-primary transition-colors"
              title="Reset to theme color"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-bold text-text-secondary uppercase tracking-wider">
          <label>Text Size</label>
          <span className="text-accent">{config.text.size ?? 32}px</span>
        </div>
        <input
          type="range"
          min="24"
          max="120"
          value={config.text.size ?? 32}
          onChange={e => updateText({ size: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* ── Text position & alignment ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Alignment
          </label>
          <div className="flex bg-bg-surface border border-border-subtle rounded-xl p-1">
            {[
              { id: "left", icon: AlignLeft },
              { id: "center", icon: AlignCenter },
              { id: "right", icon: AlignRight },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => updateText({ alignment: id as any })}
                className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${
                  config.text.alignment === id
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Position
          </label>
          <div className="flex bg-bg-surface border border-border-subtle rounded-xl p-1">
            {[{ id: "top", label: "Top" }, { id: "bottom", label: "Btm" }].map(item => (
              <button
                key={item.id}
                onClick={() => updateText({ position: item.id as any })}
                className={`flex-1 text-[10px] font-bold uppercase py-1.5 rounded-lg transition-all ${
                  config.text.position === item.id
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
