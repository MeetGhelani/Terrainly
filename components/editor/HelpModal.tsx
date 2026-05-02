"use client";

import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { 
  X, Map as MapIcon, Palette, Layers, MousePointer2, 
  Navigation, Type, Download, Grid, Compass, 
  Mountain, Share2, Info, ChevronRight, Check,
  Zap, Command, Mouse, Sparkles, Sliders, Eye
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "welcome" | "navigation" | "styling" | "elements" | "pro";

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("welcome");

  useHotkeys("esc", onClose, { enabled: isOpen });

  if (!isOpen) return null;

  const TabButton = ({ id, label, icon: Icon }: { id: Tab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 group whitespace-nowrap",
        activeTab === id 
          ? "bg-accent text-white shadow-lg shadow-accent/20 scale-105" 
          : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
      )}
    >
      <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "group-hover:text-accent")} />
      <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-bg-panel border border-border-subtle rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header Area */}
        <div className="bg-bg-elevated/20 p-8 border-b border-border-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-[1.25rem] bg-accent/10 border border-accent/20 flex items-center justify-center relative">
              <Sparkles className="w-7 h-7 text-accent" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
            </div>
            <div>
              <h2 className="text-2xl font-space font-bold text-text-primary tracking-tight">Studio Masterclass</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[9px] font-bold uppercase tracking-tighter">Tutorial Mode</span>
                <div className="h-1 w-1 rounded-full bg-text-muted" />
                <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-medium">Become a terrain artist in minutes</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-text-muted transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 py-4 bg-bg-surface/30 border-b border-border-subtle flex items-center gap-2 overflow-x-auto no-scrollbar">
          <TabButton id="welcome" label="Welcome" icon={Sparkles} />
          <TabButton id="navigation" label="Tools & Navigation" icon={Navigation} />
          <TabButton id="styling" label="Theming Studio" icon={Palette} />
          <TabButton id="elements" label="Artistic Layers" icon={Layers} />
          <TabButton id="pro" label="Power User" icon={Zap} />
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-gradient-to-b from-transparent to-bg-panel/50">
          
          {activeTab === "welcome" && (
            <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                   Step-by-Step Workflow
                </div>
                <h3 className="text-4xl font-space font-bold text-text-primary">Create Your Masterpiece</h3>
                <p className="text-text-secondary leading-relaxed max-w-xl mx-auto">
                  Terrainly turns geographical data into museum-quality posters. Follow these three simple steps to start.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "01", icon: Navigation, title: "Pick Location", desc: "Use the search bar or geocoder to fly anywhere in the world. Zoom in for city details or out for terrain." },
                  { step: "02", icon: Sliders, title: "Curate Style", desc: "Select a base theme and customize colors. Toggle 3D terrain to bring your map to life." },
                  { step: "03", icon: Download, title: "Export Art", desc: "When ready, hit export. We'll render a high-fidelity image perfect for printing." }
                ].map((item, i) => (
                  <div key={i} className="relative p-6 rounded-3xl bg-bg-surface border border-border-subtle space-y-4 hover:border-accent/40 transition-all group">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-white font-bold font-space shadow-lg shadow-accent/20">{item.step}</div>
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-text-primary">{item.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setActiveTab("navigation")}
                  className="px-8 py-4 rounded-2xl bg-accent text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:scale-105 transition-all flex items-center gap-3"
                >
                  Explore the Tools <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "navigation" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-accent font-bold uppercase tracking-widest text-xs">
                    <Mouse className="w-4 h-4" /> Mouse Controls
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 rounded-[2rem] bg-bg-surface border border-border-subtle flex items-center gap-6 group hover:border-accent/30 transition-all">
                      <div className="px-4 py-2.5 min-w-[100px] rounded-xl bg-bg-elevated flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-text-secondary border border-border-subtle shadow-inner group-hover:text-accent transition-colors">
                        Left Click
                      </div>
                      <span className="text-xs text-text-primary font-medium leading-relaxed">Hold to Pan around the map</span>
                    </div>
                    <div className="p-5 rounded-[2rem] bg-bg-surface border border-border-subtle flex items-center gap-6 group hover:border-accent/30 transition-all">
                      <div className="px-4 py-2.5 min-w-[100px] rounded-xl bg-bg-elevated flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-text-secondary border border-border-subtle shadow-inner group-hover:text-accent transition-colors">
                        Right Click
                      </div>
                      <span className="text-xs text-text-primary font-medium leading-relaxed">Hold & Drag to Tilt and Rotate (3D Mode)</span>
                    </div>
                    <div className="p-5 rounded-[2rem] bg-bg-surface border border-border-subtle flex items-center gap-6 group hover:border-accent/30 transition-all">
                      <div className="px-4 py-2.5 min-w-[100px] rounded-xl bg-bg-elevated flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-text-secondary border border-border-subtle shadow-inner group-hover:text-accent transition-colors">
                        Scroll
                      </div>
                      <span className="text-xs text-text-primary font-medium leading-relaxed">Zoom In/Out for more detail</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-accent/20 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <Info className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">Pro Tip: Geocoding</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    You can search by coordinates! Try entering <code className="bg-bg-elevated px-2 py-0.5 rounded text-accent">40.7128, -74.0060</code> to fly straight to New York City.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] text-accent font-bold uppercase tracking-widest">
                    <Check className="w-3 h-3" /> Auto-updates labels
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "styling" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-bg-surface border border-border-subtle space-y-4 hover:border-accent transition-all cursor-default">
                  <div className="flex h-12 gap-1">
                    {["#0f172a", "#3b82f6", "#10b981", "#f59e0b"].map(c => <div key={c} className="flex-1 rounded-md" style={{ background: c }} />)}
                  </div>
                  <h4 className="font-bold text-text-primary">Theme Presets</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">Instantly transform the mood with curated color palettes from professional cartographers.</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-bg-surface border border-border-subtle space-y-4 hover:border-accent transition-all cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Palette className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-text-primary">Color Editor</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">Tweak individual colors for water, land, roads, and buildings to create something unique.</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-bg-surface border border-border-subtle space-y-4 hover:border-accent transition-all cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Mountain className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-text-primary">Terrain & Shadow</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">Toggle 3D terrain and hillshading to emphasize the natural elevation of the landscape.</p>
                </div>
              </div>

              <div className="bg-bg-elevated/40 p-8 rounded-[2rem] border border-border-subtle flex flex-col md:flex-row items-center gap-10">
                <div className="space-y-4 flex-1">
                  <h4 className="text-xl font-bold text-text-primary">The "Custom" Badge</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Whenever you modify a theme's color, we automatically create a <strong>"Custom Theme"</strong> card at the top. This ensures your unique edits are never lost even if you switch themes!
                  </p>
                </div>
                <div className="w-full md:w-64 p-6 bg-accent/5 border border-accent/20 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="text-[10px] text-accent font-bold uppercase tracking-widest">Custom Theme</div>
                  <div className="flex gap-1 h-3">
                    {[1,2,3,4,5].map(i => <div key={i} className="flex-1 bg-accent/30 rounded-sm" />)}
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "elements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              {[
                { icon: Info, title: "Pins & Markers", desc: "Place pins, hearts, or stars. They automatically inherit your theme's primary accent color for a perfect match." },
                { icon: Grid, title: "Coordinate Grids", desc: "Add a technical layer with coordinate grids. Customize spacing, thickness, and style (dashed/dotted)." },
                { icon: Share2, title: "GPX Trail Mapping", desc: "Import your favorite trail or travel route. We render them with high contrast to make them pop off the map." },
                { icon: Compass, title: "Compass Roses", desc: "Choose from Minimal, Classic, or Nautical styles to anchor your artwork in cartographic history." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-bg-surface border border-border-subtle flex gap-6 group hover:border-accent/40 hover:bg-accent/[0.02] transition-all min-h-[160px] items-start">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-300">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-text-primary group-hover:text-accent transition-colors">{item.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "pro" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-text-primary flex items-center gap-3">
                    <Command className="w-5 h-5 text-accent" /> Keyboard Shortcuts
                  </h4>
                  <div className="space-y-3">
                    {[
                      { key: "Ctrl + Z", label: "Undo last action" },
                      { key: "Ctrl + Y", label: "Redo action" },
                      { key: "Ctrl + S", label: "Quick Export" },
                      { key: "ESC", label: "Close current panel" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-subtle">
                        <span className="text-[11px] font-bold text-text-primary uppercase tracking-widest">{item.label}</span>
                        <kbd className="px-3 py-1.5 rounded-lg bg-bg-elevated text-accent text-[10px] font-bold border border-border-subtle shadow-inner">{item.key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-text-primary flex items-center gap-3">
                    <Eye className="w-5 h-5 text-accent" /> Interface Layout
                  </h4>
                  <div className="p-8 rounded-[2.5rem] bg-bg-elevated/40 border border-border-subtle space-y-4">
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      The Studio uses a <strong>Proportional Canvas</strong>. This means the layout you see on screen is exactly what will be exported, regardless of your screen size. 
                    </p>
                    <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden border border-border-subtle">
                      <div className="h-full bg-accent w-full animate-pulse" />
                    </div>
                    <p className="text-[10px] text-text-muted italic">
                      1:1 Visual Fidelity Guaranteed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <div className="flex items-center gap-6 px-10 py-6 rounded-[2.5rem] bg-accent text-white shadow-2xl shadow-accent/20 animate-pulse">
                   <Zap className="w-6 h-6" />
                   <span className="text-sm font-bold uppercase tracking-[0.3em]">You are ready to create.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Area */}
        <div className="p-8 bg-bg-elevated/30 border-t border-border-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <img src="/logos/logo.png" className="w-6 h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Terrainly" />
            <div className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Terrainly Studio Engine v1.1.4</div>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-3 px-8 py-3 rounded-full bg-text-primary text-bg-panel hover:bg-accent hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            Enter the Studio <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
