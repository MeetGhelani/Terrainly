"use client";

import React from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ label, value, defaultValue = "#ffffff", onChange }: ColorPickerProps) => {
  const presets = [
    "#ffffff", "#000000", "#1e2d45", "#5d3a1a", "#d4af37", "#999999", "#800000", "#0a1628"
  ];

  const effectiveColor = value || defaultValue;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em]">
          {label}
        </label>
        <span className="text-[10px] font-black font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded uppercase tracking-wider">
          {value ? value.toUpperCase() : "AUTO"}
        </span>
      </div>
      
      <div className="space-y-3">
        {/* Main Input Row */}
        <div className="flex gap-2">
          <div className="relative w-12 h-12 shrink-0 group">
            <input
              type="color"
              value={effectiveColor}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="w-full h-full rounded-xl border-2 border-white/10 shadow-inner transition-transform group-hover:scale-105 group-active:scale-95"
              style={{ backgroundColor: effectiveColor }}
            />
          </div>
          <div className="relative flex-1 group">
            <input
              type="text"
              value={value}
              placeholder={`Auto (${defaultValue})`}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full bg-bg-surface/50 border border-white/5 rounded-xl px-4 text-sm font-bold text-text-primary focus:outline-none focus:border-accent/50 focus:bg-bg-surface transition-all placeholder:text-text-muted/50 uppercase tracking-widest"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-6 h-6 rounded-full border border-white/10 transition-all hover:scale-110 active:scale-90 ${value === p ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-panel scale-110' : ''}`}
              style={{ backgroundColor: p }}
              title={p}
            />
          ))}
          {/* Reset/Auto button */}
          <button
            onClick={() => onChange("")}
            className={`px-3 h-6 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-tighter transition-all hover:bg-white/10 ${!value ? 'bg-accent text-white border-accent' : 'bg-bg-elevated text-text-muted'}`}
          >
            Auto
          </button>
        </div>
      </div>
    </div>
  );
};
