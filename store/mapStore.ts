import { create } from "zustand";
import { temporal } from "zundo";
import { persist, createJSONStorage } from "zustand/middleware";
import { MapConfig } from "@/types/map";
import { DEFAULT_MAP_CONFIG } from "@/lib/defaults";
import { deserializeConfig } from "@/lib/share";

interface MapState {
  config: MapConfig;
  isOnboarded: boolean;
  isExportModalOpen: boolean;
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
  setConfig: (config: Partial<MapConfig>) => void;
  setOnboarded: (value: boolean) => void;
  setExportModalOpen: (value: boolean) => void;
  updateLocation: (lat: number, lng: number, zoom: number, pitch: number, bearing: number, label?: string) => void;
  resetConfig: () => void;
}

export const useMapStore = create<MapState>()(
  persist(
    temporal(
      (set) => ({
        config: DEFAULT_MAP_CONFIG,
        isOnboarded: false,
        isExportModalOpen: false,
        activeTab: "basemap",
        setActiveTab: (tab) => set({ activeTab: tab }),
        setConfig: (patch) =>
          set((state) => ({
            config: { ...state.config, ...patch },
          })),
        setOnboarded: (value) => set({ isOnboarded: value }),
        setExportModalOpen: (value) => set({ isExportModalOpen: value }),
        updateLocation: (lat, lng, zoom, pitch, bearing, label) =>
          set((state) => {
            const textUpdate = label ? {
              text: {
                ...state.config.text,
                city: label,
              }
            } : {};

            return {
              config: {
                ...state.config,
                ...textUpdate,
                location: {
                  ...state.config.location,
                  lat,
                  lng,
                  zoom,
                  pitch,
                  bearing,
                  label: label ?? state.config.location.label,
                },
              },
            };
          }),
        resetConfig: () => set({ config: DEFAULT_MAP_CONFIG }),
      }),
      {
        limit: 50,
        partialize: (state) => ({ config: state.config }),
      }
    ),
    {
      name: "terrainly-artwork-draft",
      storage: createJSONStorage(() => localStorage),
      // Only persist the config and onboarding status
      partialize: (state) => ({ 
        config: state.config, 
        isOnboarded: state.isOnboarded 
      }),
      // Priority: URL Hash > Local Storage > Defaults
      onRehydrateStorage: () => (state) => {
        if (typeof window !== "undefined" && window.location.hash.startsWith("#config=")) {
          const sharedConfig = deserializeConfig(window.location.hash);
          if (sharedConfig && state) {
            state.setConfig(sharedConfig);
          }
        }
      },
    }
  )
);
