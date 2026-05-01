"use client";

import React from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] font-mono text-text-secondary select-all">
          {value.toUpperCase()}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg bg-bg-surface border border-border-subtle cursor-pointer overflow-hidden p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-bg-surface border border-border-subtle rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-mono"
        />
      </div>
    </div>
  );
};
