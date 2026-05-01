"use client";

import React, { useState, useRef, useCallback } from "react";
import { useMapStore } from "@/store/mapStore";
import { THEMES } from "@/lib/themes";
import { ThemeColors } from "@/types/map";
import {
  Edit2, Moon, Sun, ChevronLeft, RotateCcw, Check,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Color slots displayed in the grid view ──────────────────────────────────
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

// ─── Colour utilities ─────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#888888";
  return { r: parseInt(safe.slice(1,3),16), g: parseInt(safe.slice(3,5),16), b: parseInt(safe.slice(5,7),16) };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,"0")).join("");
}
function rgbToHsv(r: number, g: number, b: number) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
  let h=0, s=max===0?0:d/max, v=max;
  if(d!==0){ if(max===r) h=((g-b)/d+6)%6; else if(max===g) h=(b-r)/d+2; else h=(r-g)/d+4; h/=6; }
  return {h,s,v};
}
function hsvToRgb(h: number, s: number, v: number) {
  const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
  let r=0,g=0,b=0;
  switch(i%6){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;}
  return {r:r*255,g:g*255,b:b*255};
}

// ─── Saturation-Value 2D picker ───────────────────────────────────────────────
const SatValPicker = ({ h,s,v, onChange }: { h:number; s:number; v:number; onChange:(s:number,v:number)=>void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handle = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onChange(Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)), Math.max(0,Math.min(1,1-(e.clientY-rect.top)/rect.height)));
  }, [onChange]);
  const onMouseDown = (e: React.MouseEvent) => {
    handle(e);
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    const move = (e: MouseEvent) => handle(e);
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  };
  return (
    <div ref={ref} className="relative w-full h-36 rounded-xl cursor-crosshair select-none overflow-hidden"
      style={{ background:`hsl(${Math.round(h*360)},100%,50%)` }} onMouseDown={onMouseDown}>
      <div className="absolute inset-0" style={{ background:"linear-gradient(to right,white,transparent)" }}/>
      <div className="absolute inset-0" style={{ background:"linear-gradient(to top,black,transparent)" }}/>
      <div className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left:`${s*100}%`, top:`${(1-v)*100}%` }}/>
    </div>
  );
};

// ─── Hue rail ─────────────────────────────────────────────────────────────────
const HueSlider = ({ h, onChange }: { h:number; onChange:(h:number)=>void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handle = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onChange(Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)));
  }, [onChange]);
  const onMouseDown = (e: React.MouseEvent) => {
    handle(e);
    const up = () => { window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    const move = (e: MouseEvent) => handle(e);
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  };
  return (
    <div ref={ref} className="relative h-4 rounded-full cursor-pointer select-none"
      style={{ background:"linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }} onMouseDown={onMouseDown}>
      <div className="absolute top-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left:`${h*100}%`, background:`hsl(${Math.round(h*360)},100%,50%)` }}/>
    </div>
  );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────
type View = "list" | "grid" | "picker";

export const BasemapPanel = () => {
  const { config, setConfig } = useMapStore();
  const [view, setView] = useState<View>("list");
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [pickerKey, setPickerKey] = useState<keyof ThemeColors | null>(null);
  const [hexInput, setHexInput] = useState("");

  const activeTheme = THEMES.find(t => t.id === config.activeThemeId) ?? THEMES[0];
  const editingTheme = THEMES.find(t => t.id === editingThemeId) ?? activeTheme;

  // Apply a whole palette
  const applyTheme = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;
    setConfig({
      activeThemeId: themeId,
      themeColors: theme.colors,
      layers: config.layers.map(layer => {
        const map: Record<string, keyof ThemeColors> = { land:"land", water:"water", roads:"roads_major", buildings:"buildings", parks:"parks" };
        const k = map[layer.id]; return k ? { ...layer, color: theme.colors[k] } : layer;
      }),
      cartography: {
        ...config.cartography,
        grid: {
          ...config.cartography.grid,
          color: theme.colors.text
        }
      }
    });
  };

  // Live-update a single colour
  const updateColor = (key: keyof ThemeColors, hex: string) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    const newColors = { ...config.themeColors, [key]: hex };
    setConfig({
      themeColors: newColors,
      layers: config.layers.map(layer => {
        const map: Record<string, keyof ThemeColors> = { land:"land", water:"water", roads:"roads_major", buildings:"buildings", parks:"parks" };
        const k = map[layer.id]; return k ? { ...layer, color: newColors[k] } : layer;
      }),
    });
  };

  // Open grid editor
  const openEditor = (themeId: string) => {
    setEditingThemeId(themeId);
    applyTheme(themeId);
    setView("grid");
  };

  // Open single colour picker
  const openPicker = (key: keyof ThemeColors) => {
    setPickerKey(key);
    setHexInput(config.themeColors[key]);
    setView("picker");
  };

  // HSV state derived from current picker colour
  const pickerColor = pickerKey ? config.themeColors[pickerKey] : "#888888";
  const { r, g, b } = hexToRgb(pickerColor);
  const { h, s, v } = rgbToHsv(r, g, b);

  const handleHsvChange = (nh: number, ns: number, nv: number) => {
    if (!pickerKey) return;
    const { r, g, b } = hsvToRgb(nh, ns, nv);
    const hex = rgbToHex(r, g, b);
    setHexInput(hex);
    updateColor(pickerKey, hex);
  };

  const darkThemes  = THEMES.filter(t => t.isDark);
  const lightThemes = THEMES.filter(t => !t.isDark);

  // ── View: Single colour picker ───────────────────────────────────────────
  if (view === "picker" && pickerKey) {
    const slot = COLOR_SLOTS.find(s => s.key === pickerKey)!;
    const allSwatches = [...new Set(Object.values(config.themeColors))].slice(0, 8);
    const original = editingTheme.colors[pickerKey];
    return (
      <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("grid")} className="p-2 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all">
            <ChevronLeft className="w-4 h-4"/>
          </button>
          <div>
            <div className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">Color Editor</div>
            <div className="text-sm font-bold text-text-primary">Editing: {slot.label}</div>
          </div>
        </div>

        {/* Theme swatches for quick picks */}
        <div className="grid grid-cols-4 gap-2">
          {allSwatches.map((sw, i) => (
            <button key={i} onClick={() => { setHexInput(sw); updateColor(pickerKey, sw); }}
              className={cn("h-10 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
                sw === pickerColor ? "border-white shadow-md" : "border-transparent")}
              style={{ background: sw }}/>
          ))}
          <button onClick={() => { const o = original; setHexInput(o); updateColor(pickerKey, o); }}
            className="h-10 rounded-xl border-2 border-dashed border-border-subtle hover:border-text-muted transition-all flex items-center justify-center" title="Reset">
            <RotateCcw className="w-3 h-3 text-text-secondary"/>
          </button>
        </div>

        {/* 2D Picker */}
        <SatValPicker h={h} s={s} v={v} onChange={(ns, nv) => handleHsvChange(h, ns, nv)}/>

        {/* Hue slider */}
        <HueSlider h={h} onChange={(nh) => handleHsvChange(nh, s, v)}/>

        {/* Hex input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Hex</label>
          <input type="text" value={hexInput}
            onChange={e => { setHexInput(e.target.value); updateColor(pickerKey, e.target.value); }}
            className="w-full bg-bg-surface border border-border-subtle rounded-xl px-3 py-2.5 text-sm font-mono text-text-primary focus:outline-none focus:border-accent transition-colors"/>
        </div>

        {/* Current vs original */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-[9px] text-text-secondary uppercase tracking-wider">Current</div>
            <div className="h-8 rounded-lg border border-border-subtle" style={{ background: pickerColor }}/>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] text-text-secondary uppercase tracking-wider">Original</div>
            <div className="h-8 rounded-lg border border-border-subtle cursor-pointer hover:scale-95 transition-all"
              style={{ background: original }} onClick={() => { setHexInput(original); updateColor(pickerKey, original); }}/>
          </div>
        </div>
      </div>
    );
  }

  // ── View: Colour grid ────────────────────────────────────────────────────
  if (view === "grid") {
    return (
      <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("list")} className="p-2 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all">
              <ChevronLeft className="w-4 h-4"/>
            </button>
            <div>
              <div className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">Color Editor</div>
              <div className="text-sm font-bold text-text-primary">{editingTheme.name}</div>
            </div>
          </div>
          <button onClick={() => { applyTheme(editingTheme.id); }}
            className="text-[9px] text-text-secondary border border-border-subtle rounded-lg px-3 py-1.5 hover:bg-bg-elevated uppercase tracking-wider transition-all flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3"/> Reset All
          </button>
        </div>

        {/* 4-column colour grid */}
        <div className="grid grid-cols-2 gap-2">
          {COLOR_SLOTS.map(({ key, label }) => (
            <button key={key} onClick={() => openPicker(key)}
              className="group flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-bg-surface border border-border-subtle hover:border-accent/40 transition-all">
              <div className="w-full h-10 rounded-xl border border-white/10 transition-all group-hover:scale-95"
                style={{ background: config.themeColors[key] }}/>
              <span className="text-[8px] font-bold text-text-secondary uppercase tracking-tight text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        <button onClick={() => setView("list")}
          className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2">
          <Check className="w-4 h-4"/> Done
        </button>
      </div>
    );
  }

  // ── View: Palette list (default) ─────────────────────────────────────────
  const ThemeCard = ({ theme }: { theme: typeof THEMES[number] }) => {
    const isActive = config.activeThemeId === theme.id;
    return (
      <div className={cn("group relative rounded-2xl border overflow-hidden cursor-pointer transition-all",
        isActive ? "border-accent ring-1 ring-accent shadow-lg shadow-accent/10" : "border-border-subtle hover:border-text-muted")}
        onClick={() => applyTheme(theme.id)}>
        {/* Colour swatch strip */}
        <div className="flex h-20">
          {theme.swatchColors.map((color, i) => (
            <div key={i} className="flex-1" style={{ background: color }}/>
          ))}
        </div>
        {/* Label + Edit */}
        <div className="flex items-center justify-between px-3 py-2 bg-bg-surface/80 backdrop-blur-sm">
          <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">{theme.name}</span>
          <button
            className={cn("p-1.5 rounded-lg transition-all",
              isActive ? "opacity-100 bg-accent/20 text-accent" : "opacity-0 group-hover:opacity-100 bg-bg-elevated text-text-secondary hover:text-text-primary")}
            onClick={e => { e.stopPropagation(); openEditor(theme.id); }}
            title="Edit colors">
            <Edit2 className="w-3 h-3"/>
          </button>
        </div>
        {isActive && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent shadow-md shadow-accent/50 animate-pulse"/>}
      </div>
    );
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Active theme summary */}
      <div className="p-4 bg-bg-surface/50 border border-border-subtle rounded-2xl space-y-2">
        <div className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">Active Theme</div>
        <div className="text-sm font-bold text-text-primary">{activeTheme.name}</div>
        <p className="text-[10px] text-text-secondary leading-relaxed">{activeTheme.description}</p>
        <div className="flex gap-1.5 mt-2">
          {activeTheme.swatchColors.map((c,i) => <div key={i} className="h-3 flex-1 rounded-sm" style={{ background:c }}/>)}
        </div>
      </div>

      {/* Dark themes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Moon className="w-3.5 h-3.5 text-accent"/>
          <span className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Dark</span>
        </div>
        <div className="space-y-2">{darkThemes.map(t => <ThemeCard key={t.id} theme={t}/>)}</div>
      </div>

      {/* Light themes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sun className="w-3.5 h-3.5 text-accent"/>
          <span className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Light</span>
        </div>
        <div className="space-y-2">{lightThemes.map(t => <ThemeCard key={t.id} theme={t}/>)}</div>
      </div>
    </div>
  );
};
