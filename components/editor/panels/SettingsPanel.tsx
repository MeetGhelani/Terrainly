"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { Lock, Unlock, Mountain, ShieldAlert, Image as ImageIcon } from "lucide-react";

export const SettingsPanel = () => {
  const { config, setConfig, resetConfig } = useMapStore();

  const ToggleRow = ({
    label,
    description,
    enabled,
    icon: Icon,
    onChange,
  }: {
    label: string;
    description: string;
    enabled: boolean;
    icon: any;
    onChange: () => void;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-border-subtle/60 last:border-0">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
          <Icon className={`w-4 h-4 ${enabled ? 'text-accent' : 'text-text-secondary'}`} />
        </div>
        <div className="space-y-1 pr-4">
          <div className="text-sm font-bold text-text-primary">{label}</div>
          <div className="text-[10px] text-text-secondary leading-relaxed">{description}</div>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none mt-1 ${
          enabled ? "bg-accent" : "bg-bg-elevated border border-border-subtle"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Workspace Controls */}
      <div className="space-y-2">
        <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-80 mb-4">
          Workspace Controls
        </div>
        <div className="bg-bg-surface/50 border border-border-subtle rounded-2xl p-2">
          <ToggleRow
            label="Lock Canvas"
            description="Prevent accidental panning and zooming once you have framed the perfect shot."
            enabled={config.isLocked}
            icon={config.isLocked ? Lock : Unlock}
            onChange={() => setConfig({ isLocked: !config.isLocked })}
          />
        </div>
      </div>



      {/* Export Preferences */}
      <div className="space-y-2">
        <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-80 mb-4">
          Export Preferences
        </div>
        <div className="bg-bg-surface/50 border border-border-subtle rounded-2xl p-2">
          <ToggleRow
            label="Terrainly Watermark"
            description="Include a subtle 'Created with Terrainly' badge on your final high-resolution exports."
            enabled={config.watermark}
            icon={ImageIcon}
            onChange={() => setConfig({ watermark: !config.watermark })}
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 pt-6 mt-6 border-t border-border-subtle">
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Danger Zone</span>
        </div>
        
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
          <h4 className="text-sm font-bold text-red-200 mb-1">Reset Studio</h4>
          <p className="text-[10px] text-red-200/60 mb-4 leading-relaxed">
            This will completely wipe your current configuration, resetting all colors, layers, and locations back to the default Terrainly state. This action cannot be undone.
          </p>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset the studio? All custom settings will be lost.")) {
                resetConfig();
              }
            }}
            className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Reset Everything
          </button>
        </div>
      </div>

    </div>
  );
};
