"use client";

import React from "react";
import { useMapStore } from "@/store/mapStore";
import { ExportPanel } from "@/components/editor/panels/ExportPanel";
import { X } from "lucide-react";

export const ExportModal = () => {
  const { isExportModalOpen, setExportModalOpen } = useMapStore();

  if (!isExportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm"
        onClick={() => setExportModalOpen(false)}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[450px] max-h-[90vh] flex flex-col bg-bg-panel border border-border-subtle rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0 bg-bg-surface/50 backdrop-blur-md">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-[0.2em] font-space">
            Export Artwork
          </h2>
          <button 
            onClick={() => setExportModalOpen(false)}
            className="p-2 -mr-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <ExportPanel />
        </div>
      </div>
    </div>
  );
};
