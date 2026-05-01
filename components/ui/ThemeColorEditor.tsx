"use client";

import React, { useState, useRef, useCallback } from "react";
import { X, RotateCcw, ChevronLeft } from "lucide-react";
import { ThemeColors } from "@/types/map";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Color slot definitions ────────────────────────────────────────────────────
const COLOR_SLOTS: { key: keyof ThemeColors; label: string }[] = [
  { key: "overlay",          label: "Overlay" },
  { key: "text",             label: "Text" },
  { key: "land",             label: "Land" },
  { key: "landcover",        label: "Landcover" },
  { key: "water",            label: "Water" },
  { key: "waterways",        label: "Waterways" },
  { key: "parks",            label: "Parks" },
  { key: "buildings",        label: "Buildings" },
  { key: "aeroway",          label: "Aeroway" },
  { key: "rail",             label: "Rail" },
  { key: "roads_major",      label: "Roads Major" },
  { key: "roads_minor_high", label: "Roads Minor High" },
  { key: "roads_minor_mid",  label: "Roads Minor Mid" },
  { key: "roads_minor_low",  label: "Roads Minor Low" },
  { key: "roads_path",       label: "Roads Path" },
  { key: "road_outline",     label: "Road Outline" },
];

// ── Tiny HSV <-> RGB helpers ─────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
}
function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h, s, v };
}
function hsvToRgb(h: number, s: number, v: number) {
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r=v; g=t; b=p; break; case 1: r=q; g=v; b=p; break;
    case 2: r=p; g=v; b=t; break; case 3: r=p; g=q; b=v; break;
    case 4: r=t; g=p; b=v; break; case 5: r=v; g=p; b=q; break;
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

// ── Saturation / Value 2D Canvas Picker ──────────────────────────────────────
const SatValPicker = ({
  h, s, v,
  onChange,
}: { h: number; s: number; v: number; onChange: (s: number, v: number) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const handle = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    onChange(nx, 1 - ny);
  }, [onChange]);

  const onMouseDown = (e: React.MouseEvent) => {
    drag.current = true;
    handle(e);
    const up = () => { drag.current = false; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    const move = (e: MouseEvent) => { if (drag.current) handle(e); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const bg = `hsl(${Math.round(h * 360)}, 100%, 50%)`;

  return (
    <div
      ref={ref}
      className="relative w-full h-44 rounded-xl cursor-crosshair select-none overflow-hidden"
      style={{ background: bg }}
      onMouseDown={onMouseDown}
    >
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, white, transparent)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, black, transparent)" }} />
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%` }}
      />
    </div>
  );
};

// ── Hue Rail ─────────────────────────────────────────────────────────────────
const HueSlider = ({ h, onChange }: { h: number; onChange: (h: number) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handle = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onChange(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  }, [onChange]);

  const onMouseDown = (e: React.MouseEvent) => {
    handle(e);
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    const move = (e: MouseEvent) => handle(e);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      ref={ref}
      className="relative h-4 rounded-full cursor-pointer select-none"
      style={{ background: "linear-gradient(to right, #f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}
      onMouseDown={onMouseDown}
    >
      <div
        className="absolute top-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${h * 100}%`, background: `hsl(${Math.round(h * 360)},100%,50%)` }}
      />
    </div>
  );
};

// ── Per-Colour Picker View ────────────────────────────────────────────────────
const ColorPickerView = ({
  label,
  value,
  themeSwatches,
  originalValue,
  onChange,
  onBack,
}: {
  label: string;
  value: string;
  themeSwatches: string[];
  originalValue: string;
  onChange: (hex: string) => void;
  onBack: () => void;
}) => {
  const { r, g, b } = hexToRgb(value.length === 7 ? value : "#888888");
  const { h, s, v } = rgbToHsv(r, g, b);
  const [hexInput, setHexInput] = useState(value);

  const updateHsv = (nh: number, ns: number, nv: number) => {
    const { r, g, b } = hsvToRgb(nh, ns, nv);
    const hex = rgbToHex(r, g, b);
    setHexInput(hex);
    onChange(hex);
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Color Editor</span>
        </button>
        <span className="text-[10px] text-text-secondary uppercase tracking-widest">Editing: {label}</span>
      </div>

      {/* Theme swatches */}
      <div className="grid grid-cols-4 gap-2">
        {themeSwatches.map((sw, i) => (
          <button
            key={i}
            onClick={() => { setHexInput(sw); onChange(sw); }}
            className={cn("h-10 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
              sw === value ? "border-white" : "border-transparent")}
            style={{ background: sw }}
          />
        ))}
        <button
          onClick={() => { setHexInput(originalValue); onChange(originalValue); }}
          className="h-10 rounded-xl border-2 border-dashed border-border-subtle hover:border-text-muted transition-all flex items-center justify-center"
          title="Reset Color"
        >
          <RotateCcw className="w-3 h-3 text-text-secondary" />
        </button>
      </div>

      {/* 2D picker */}
      <SatValPicker h={h} s={s} v={v} onChange={(ns, nv) => updateHsv(h, ns, nv)} />

      {/* Hue slider */}
      <HueSlider h={h} onChange={(nh) => updateHsv(nh, s, v)} />

      {/* Hex input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Hex</label>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value);
          }}
          className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
};

// ── Main Color Editor Panel ───────────────────────────────────────────────────
interface ThemeColorEditorProps {
  colors: ThemeColors;
  originalColors: ThemeColors;
  themeName: string;
  onColorsChange: (colors: ThemeColors) => void;
  onClose: () => void;
}

export const ThemeColorEditor = ({
  colors,
  originalColors,
  themeName,
  onColorsChange,
  onClose,
}: ThemeColorEditorProps) => {
  const [editingKey, setEditingKey] = useState<keyof ThemeColors | null>(null);
  const editingSlot = COLOR_SLOTS.find(s => s.key === editingKey);

  const updateColor = (key: keyof ThemeColors, hex: string) => {
    onColorsChange({ ...colors, [key]: hex });
  };

  // Collect all unique swatches from current theme for quick picks
  const allSwatches = [...new Set(Object.values(colors))].slice(0, 8);

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4 md:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm bg-bg-panel border border-border-subtle rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Color Editor</div>
            <div className="text-sm font-bold text-text-primary">{themeName}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {editingKey && editingSlot ? (
          <ColorPickerView
            label={editingSlot.label}
            value={colors[editingKey]}
            themeSwatches={allSwatches}
            originalValue={originalColors[editingKey]}
            onChange={(hex) => updateColor(editingKey, hex)}
            onBack={() => setEditingKey(null)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-text-secondary uppercase tracking-widest">Click a color to edit</span>
              <button
                onClick={() => onColorsChange(originalColors)}
                className="text-[10px] text-text-secondary hover:text-text-primary uppercase tracking-wider border border-border-subtle rounded-lg px-3 py-1.5 hover:bg-bg-elevated transition-all"
              >
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {COLOR_SLOTS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setEditingKey(key)}
                  className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-bg-surface border border-border-subtle hover:border-accent/50 transition-all"
                >
                  <div
                    className="w-full h-12 rounded-xl transition-all group-hover:scale-95 border border-white/10"
                    style={{ background: colors[key] }}
                  />
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-tight text-center leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
