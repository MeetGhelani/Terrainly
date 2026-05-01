"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "@/store/mapStore";
import { applyLayerStyling, applyTerrainStyling } from "@/lib/map/style-builder";
import { BASEMAPS } from "@/lib/map/basemaps";
import { updateOverlays, updateRoutes } from "@/lib/map/overlays";
import { Overlay } from "@/types/map";
import { CompassRose } from "@/components/editor/CompassRose";
import { GridOverlay } from "@/components/editor/GridOverlay";
import { AuraBackground } from "@/components/editor/AuraBackground";
import { InfoBox } from "@/components/editor/InfoBox";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hexToRGBA } from "@/lib/themes";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { LAYOUT_RATIOS } from "@/lib/map/layout";

export const MapCanvas = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const textMarkers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const { config, updateLocation, setConfig } = useMapStore();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initMap = () => {
      if (map.current || !mapContainer.current) return;
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: BASEMAPS[config.basemap].url,
        center: [config.location.lng, config.location.lat],
        zoom: config.location.zoom,
        attributionControl: false,
        // @ts-ignore
        preserveDrawingBuffer: true,
        // Ensure tiles are requested with CORS
        transformRequest: (url) => {
          if (url.includes('arcgisonline.com') || url.includes('amazonaws.com')) {
            return { url, crossOrigin: 'anonymous' };
          }
          return { url };
        }
      });

      // @ts-ignore
      window.__terrainly_map = map.current;

      // Handle initial lock state
      if (config.isLocked) {
        map.current.dragPan.disable();
        map.current.scrollZoom.disable();
        map.current.boxZoom.disable();
        map.current.dragRotate.disable();
        map.current.keyboard.disable();
        map.current.doubleClickZoom.disable();
        map.current.touchZoomRotate.disable();
      }

      map.current.on("moveend", () => {
        if (!map.current) return;
        const { lng, lat } = map.current.getCenter();
        const zoom = map.current.getZoom();
        const pitch = map.current.getPitch();
        const bearing = map.current.getBearing();
        updateLocation(lat, lng, zoom, pitch, bearing);
      });

      map.current.on("style.load", () => {
        if (!map.current) return;
        applyLayerStyling(map.current, config);
        updateRoutes(map.current, config);
      });
    };

    initMap();
    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      applyLayerStyling(map.current, config);
      updateOverlays(map.current, config, markers);
      updateRoutes(map.current, config);
    }
  }, [config.layers, config.basemap, config.cartography.grid, config.overlays, config.routes, config.themeColors]);

  // Theme Sync Effect
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      applyLayerStyling(map.current, config);
    }
  }, [config.themeColors]);

  // Lock Canvas Effect
  useEffect(() => {
    if (!map.current) return;
    const methods = ['dragPan', 'scrollZoom', 'boxZoom', 'dragRotate', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'] as const;
    methods.forEach(method => {
      if (config.isLocked) {
        map.current?.[method].disable();
      } else {
        map.current?.[method].enable();
      }
    });
  }, [config.isLocked]);

  // 3D Terrain & Hillshade Effect
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;
    
    if (m.isStyleLoaded()) {
      applyTerrainStyling(m, config);
    } else {
      m.once('style.load', () => applyTerrainStyling(m, config));
    }
  }, [config.terrain3d, config.themeColors]);

  // Sync Map State with Config (e.g. from Geocoder or Store)
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;
    const center = m.getCenter();
    const zoom = m.getZoom();
    const pitch = m.getPitch();
    const bearing = m.getBearing();

    // Only jump if there is a significant difference to avoid loops
    const diff = 
      Math.abs(center.lat - config.location.lat) > 0.0001 ||
      Math.abs(center.lng - config.location.lng) > 0.0001 ||
      Math.abs(zoom - config.location.zoom) > 0.1 ||
      Math.abs(pitch - (config.location.pitch ?? 0)) > 1 ||
      Math.abs(bearing - (config.location.bearing ?? 0)) > 1;

    if (diff) {
      m.jumpTo({
        center: [config.location.lng, config.location.lat],
        zoom: config.location.zoom,
        pitch: config.location.pitch ?? 0,
        bearing: config.location.bearing ?? 0
      });
    }
  }, [config.location]);

  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[config.text.alignment] ?? "items-center text-center";

  const posClass = config.text.position === "top" ? "top-0 bottom-auto" : "bottom-0 top-auto";

  // Proportional units for the Studio Canvas (Sync with Export Engine)
  // We use cqmin (Container Query Min) to ensure the compass scales relative 
  // to the smaller dimension of the artwork master, matching our Export Engine math.
  const compassOffset = `${LAYOUT_RATIOS.COMPASS_OFFSET_RATIO * 100}cqmin`; 
  const compassSize = `${LAYOUT_RATIOS.COMPASS_SIZE_RATIO * 100}cqmin`;
  
  const textPaddingX = `${LAYOUT_RATIOS.PADDING_X * 100}%`;
  const textPaddingY = `${LAYOUT_RATIOS.PADDING_Y * 100}%`;

  const overlayColor = config.themeColors.overlay || "#000000";

  return (
    <div className="w-full h-full relative overflow-hidden bg-bg-base flex items-center justify-center transition-all duration-500">
      <InfoBox />

      {/* The Master Artwork Container (Everything inside here is exported) */}
      <div 
        id="map-artwork-master"
        className="relative w-full h-full shadow-2xl overflow-hidden"
        style={{ 
          backgroundColor: config.poster.bgColor || "#070b12",
          containerType: 'size' 
        }}
      >
        {/* Background/Aura effects */}
        <AuraBackground />

        {/* The Map itself (Grid is now inside here) */}
        <div ref={mapContainer} className="absolute inset-0 w-full h-full z-10" />

        {/* Gradient overlays */}
        {config.showOverlayLayer && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {(config.overlayTopFade ?? 0) > 0 && (
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: `${config.overlayTopFade}%`,
                  background: `linear-gradient(to bottom, ${hexToRGBA(overlayColor, 0.8)} 0%, ${hexToRGBA(overlayColor, 0.4)} 40%, ${hexToRGBA(overlayColor, 0.1)} 75%, ${hexToRGBA(overlayColor, 0)} 100%)`,
                }}
              />
            )}
            {(config.overlayBottomFade ?? 0) > 0 && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${config.overlayBottomFade}%`,
                  background: `linear-gradient(to top, ${hexToRGBA(overlayColor, 0.8)} 0%, ${hexToRGBA(overlayColor, 0.4)} 40%, ${hexToRGBA(overlayColor, 0.1)} 75%, ${hexToRGBA(overlayColor, 0)} 100%)`,
                }}
              />
            )}
            {(config.overlayLeftFade ?? 0) > 0 && (
              <div
                className="absolute left-0 top-0 bottom-0"
                style={{
                  width: `${config.overlayLeftFade}%`,
                  background: `linear-gradient(to right, ${hexToRGBA(overlayColor, 0.8)} 0%, ${hexToRGBA(overlayColor, 0.4)} 40%, ${hexToRGBA(overlayColor, 0.1)} 75%, ${hexToRGBA(overlayColor, 0)} 100%)`,
                }}
              />
            )}
            {(config.overlayRightFade ?? 0) > 0 && (
              <div
                className="absolute right-0 top-0 bottom-0"
                style={{
                  width: `${config.overlayRightFade}%`,
                  background: `linear-gradient(to left, ${hexToRGBA(overlayColor, 0.8)} 0%, ${hexToRGBA(overlayColor, 0.4)} 40%, ${hexToRGBA(overlayColor, 0.1)} 75%, ${hexToRGBA(overlayColor, 0)} 100%)`,
                }}
              />
            )}
          </div>
        )}

        {/* Grid Overlay */}
        <GridOverlay 
          enabled={config.cartography.grid.enabled}
          color={config.cartography.grid.color}
          opacity={config.cartography.grid.opacity}
          spacing={config.cartography.grid.spacing}
          thickness={config.cartography.grid.thickness || 1}
          dashArray={config.cartography.grid.dashArray}
        />

        {/* Compass Rose */}
        {config.cartography.compass && (
          <div 
            className="absolute z-50 pointer-events-none"
            style={{
              width: compassSize,
              height: compassSize,
              [config.cartography.compassPosition?.startsWith('b') ? 'bottom' : 'top']: compassOffset,
              [config.cartography.compassPosition?.endsWith('r') ? 'right' : 'left']: compassOffset,
            }}
          >
            <CompassRose 
              style={config.cartography.compassStyle || "minimal"} 
              color={config.themeColors.text || "#ffffff"}
            />
          </div>
        )}

        {/* Poster Text Overlay */}
        {config.showPosterText && (
          <div 
            className={cn(
              "absolute z-50 pointer-events-none flex flex-col",
              config.text.alignment === 'center' ? 'items-center text-center' : 
              config.text.alignment === 'right' ? 'items-end text-right' : 'items-start text-left',
              config.text.position === 'top' ? 'top-0' : 'bottom-0',
              'left-0 right-0'
            )}
            style={{ 
              paddingLeft: textPaddingX, 
              paddingRight: textPaddingX, 
              [config.text.position === 'top' ? 'top' : 'bottom']: textPaddingY,
            }}
          >
            <div className="flex flex-col">
              <h1 
                className="font-black uppercase"
                style={{ 
                  fontFamily: `'${config.text.font}', sans-serif`,
                  fontSize: `${config.text.size ?? 32}px`,
                  lineHeight: '1.1',
                  letterSpacing: '0.35em',
                  marginRight: config.text.alignment === 'right' ? '-0.35em' : undefined,
                  color: config.text.color || config.themeColors.text || "#ffffff"
                }}
              >
                {config.text.city}
              </h1>
              
              {config.text.subtitle && (
                <p 
                  className="font-medium uppercase opacity-80"
                  style={{ 
                    fontFamily: `'${config.text.font}', sans-serif`,
                    fontSize: `${Math.max(14, (config.text.size ?? 32) * LAYOUT_RATIOS.FONT_SIZE_SUBTITLE_RATIO)}px`,
                    lineHeight: '1.1',
                    letterSpacing: '0.25em',
                    marginRight: config.text.alignment === 'right' ? '-0.25em' : undefined,
                    marginTop: `${LAYOUT_RATIOS.TYPO_GAP_SUBTITLE * 100}cqh`, 
                    color: config.text.color || config.themeColors.text || "#ffffff"
                  }}
                >
                  {config.text.subtitle}
                </p>
              )}

              {config.text.tagline && (
                <p 
                  className="font-mono opacity-60"
                  style={{ 
                    fontSize: `${Math.max(12, (config.text.size ?? 32) * LAYOUT_RATIOS.FONT_SIZE_TAGLINE_RATIO)}px`,
                    lineHeight: '1.1',
                    marginTop: `${LAYOUT_RATIOS.TYPO_GAP_TAGLINE * 100}cqh`,
                    color: config.text.color || config.themeColors.text || "#ffffff"
                  }}
                >
                  {config.text.tagline}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
