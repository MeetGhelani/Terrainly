import { create } from "zustand";
import { temporal } from "zundo";
import { MapConfig } from "@/types/map";
import { DEFAULT_MAP_CONFIG } from "@/lib/defaults";
import { deserializeConfig } from "@/lib/share";

interface MapState {
  config: MapConfig;
  isOnboarded: boolean;
  isExportModalOpen: boolean;
  setConfig: (config: Partial<MapConfig>) => void;
  setOnboarded: (value: boolean) => void;
  setExportModalOpen: (value: boolean) => void;
  updateLocation: (lat: number, lng: number, zoom: number, pitch: number, bearing: number, label?: string) => void;
  resetConfig: () => void;
}

// Initial state check for URL hash and onboarding
const getInitialOnboarded = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("terrainly_onboarded") === "true";
  }
  return false;
};

const getInitialState = (): MapConfig => {
  if (typeof window !== "undefined" && window.location.hash.startsWith("#config=")) {
    const saved = deserializeConfig(window.location.hash);
    if (saved) return saved;
  }
  return DEFAULT_MAP_CONFIG;
};

export const useMapStore = create<MapState>()(
  temporal(
    (set) => ({
      config: getInitialState(),
      isOnboarded: getInitialOnboarded(),
      isExportModalOpen: false,
      setConfig: (patch) =>
        set((state) => ({
          config: { ...state.config, ...patch },
        })),
      setOnboarded: (value) => {
        localStorage.setItem("terrainly_onboarded", String(value));
        set({ isOnboarded: value });
      },
      setExportModalOpen: (value) => set({ isExportModalOpen: value }),
      updateLocation: (lat, lng, zoom, pitch, bearing, label) =>
        set((state) => ({
          config: {
            ...state.config,
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
        })),
      resetConfig: () => set({ config: DEFAULT_MAP_CONFIG }),
    }),
    {
      limit: 50, // 50 steps of history
      partialize: (state) => {
        const { config } = state;
        return { config };
      },
    }
  )
);
