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
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hexToRGBA } from "@/lib/themes";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { LAYOUT_RATIOS } from "@/lib/map/layout";
import { TEXTURES } from "@/lib/map/textures";

export const MapCanvas = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const textMarkers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const { config, updateLocation, setConfig } = useMapStore();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Small timeout to ensure container has dimensions in all browsers
    const timer = setTimeout(() => {
      if (!mapContainer.current) return;
      
      const validBasemap = BASEMAPS[config.basemap] ? config.basemap : 'vector';

      const initMap = () => {
        if (map.current || !mapContainer.current) return;
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: BASEMAPS[validBasemap].url,
          center: [config.location.lng, config.location.lat],
          zoom: config.location.zoom,
          attributionControl: false,
          // @ts-ignore
          preserveDrawingBuffer: true,
          transformRequest: (url) => {
            if (url.includes('arcgisonline.com') || url.includes('amazonaws.com')) {
              return { url, crossOrigin: 'anonymous' };
            }
            return { url };
          }
        });

        // @ts-ignore
        window.__terrainly_map = map.current;

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
          updateOverlays(map.current, config, markers);
        });
      };

      initMap();
    }, 50);

    return () => {
      clearTimeout(timer);
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      applyLayerStyling(map.current, config);
      updateOverlays(map.current, config, markers);
      updateRoutes(map.current, config);
    }
  }, [config.layers, config.cartography.grid, config.overlays, config.routes, config.themeColors]);

  // Handle Basemap Swapping
  useEffect(() => {
    if (!map.current) return;
    const validBasemap = BASEMAPS[config.basemap] ? config.basemap : 'vector';
    const styleUrl = BASEMAPS[validBasemap].url;
    
    // Only update if the URL has actually changed to avoid unnecessary reloads
    if (map.current.getStyle()?.sources?.['openmaptiles'] && map.current.getStyle()?.name === BASEMAPS[validBasemap].name) return;
    
    map.current.setStyle(styleUrl);
    
    // Once the new style loads, we must re-apply all our custom styling
    map.current.once('style.load', () => {
      if (map.current) {
        applyLayerStyling(map.current, config);
        applyTerrainStyling(map.current, config);
        updateOverlays(map.current, config, markers);
        updateRoutes(map.current, config);
      }
    });
  }, [config.basemap]);

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
  }, [config.terrain3d]);

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

  const frameThickness = config.frame.style !== 'none' ? config.frame.thickness * 4 : 0;
  
  // Proportional units for the Studio Canvas (Sync with Export Engine)
  const compassOffset = `calc(${frameThickness}px + ${config.cartography.compassMargin ?? 20}px)`;
  const compassSize = `${(config.cartography.compassSize || 64) * 0.15}cqmin`; 
  
  const textPaddingX = `calc(${LAYOUT_RATIOS.PADDING_X * 100}% + ${frameThickness}px)`;
  const textPaddingY = `calc(${LAYOUT_RATIOS.PADDING_Y * 100}% + ${frameThickness}px + ${config.text.offsetY}px)`;

  const overlayColor = config.themeColors.overlay || "#000000";

  return (
    <div className="w-full h-full relative overflow-hidden bg-bg-base flex items-center justify-center transition-all duration-500">

      {/* The Master Artwork Container (Everything inside here is exported) */}
      <div 
        id="map-artwork-master"
        className="relative w-full h-full shadow-2xl overflow-hidden"
        style={{ 
          backgroundColor: config.poster.bgColor || "#070b12"
        }}
      >
        {/* The Map itself (Base Layer) */}
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {/* Texture Overlay Layer (On top of map, behind frame/text) */}
        {config.frame.texture !== 'none' && (
          <div 
            className="absolute inset-0 z-[40] pointer-events-none mix-blend-overlay transition-all duration-500"
            style={{ opacity: (config.frame.textureOpacity ?? 40) / 100 }}
          >
            {config.frame.texture === 'crumpled' && (
              <div 
                className="absolute inset-0" 
                style={{ 
                  backgroundImage: `url(${TEXTURES.crumpled})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} 
              />
            )}
            {config.frame.texture === 'parchment' && (
              <div className="absolute inset-0 bg-[#f4e4bc] opacity-80" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/papyros.png")` }} />
            )}
            {config.frame.texture === 'linen' && (
              <div className="absolute inset-0 bg-[#faf9f6]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/linen-design.png")` }} />
            )}
            {config.frame.texture === 'aged' && (
              <div className="absolute inset-0 bg-[#dcb35c] opacity-40" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stucco-tiles.png")` }} />
            )}
            {config.frame.texture === 'noise' && (
              <div className="absolute inset-0 bg-white/5 opacity-10" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-light.png")` }} />
            )}
            {config.frame.texture === 'kraft' && (
              <div className="absolute inset-0 bg-[#a68064]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cardboard.png")` }} />
            )}
          </div>
        )}

        {/* Frame Overlay Layer (High Z-Index, on top of map but below text if needed) */}
        {config.frame.style !== 'none' && (
          <div className="absolute inset-0 pointer-events-none z-[45]">
            {/* 1. Real Material Frames (4-Bar Layout) */}
            {['oak', 'walnut', 'mahogany', 'aluminum', 'gold', 'black-gallery'].includes(config.frame.style) && (() => {
              const thickness = config.frame.thickness * 4;
              const style = config.frame.style;
              
              const getFrameStyle = (isVertical: boolean): React.CSSProperties => {
                const baseStyles: React.CSSProperties = {
                  position: 'absolute',
                  pointerEvents: 'none',
                  ...(style === 'oak' && {
                    background: isVertical 
                      ? `repeating-linear-gradient(0deg, #8b5a2b, #8b5a2b 2px, #a0522d 2px, #a0522d 4px)`
                      : `repeating-linear-gradient(90deg, #8b5a2b, #8b5a2b 2px, #a0522d 2px, #a0522d 4px)`,
                    backgroundColor: '#5d3a1a',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                  }),
                  ...(style === 'walnut' && {
                    background: isVertical
                      ? `repeating-linear-gradient(0deg, #3d2b1f, #3d2b1f 1px, #4d3b2f 1px, #4d3b2f 3px)`
                      : `repeating-linear-gradient(90deg, #3d2b1f, #3d2b1f 1px, #4d3b2f 1px, #4d3b2f 3px)`,
                    backgroundColor: '#2d1b0f',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)'
                  }),
                  ...(style === 'mahogany' && {
                    background: isVertical
                      ? `repeating-linear-gradient(0deg, #800000, #800000 2px, #4d0000 2px, #4d0000 4px)`
                      : `repeating-linear-gradient(90deg, #800000, #800000 2px, #4d0000 2px, #4d0000 4px)`,
                    backgroundColor: '#600000',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)'
                  }),
                  ...(style === 'aluminum' && {
                    background: isVertical
                      ? `linear-gradient(to bottom, #999, #eee 10%, #999 20%, #eee 30%, #999 40%, #eee 50%, #999 60%, #eee 70%, #999 80%, #eee 90%, #999)`
                      : `linear-gradient(to right, #999, #eee 10%, #999 20%, #eee 30%, #999 40%, #eee 50%, #999 60%, #eee 70%, #999 80%, #eee 90%, #999)`,
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.3)'
                  }),
                  ...(style === 'gold' && {
                    background: isVertical
                      ? `linear-gradient(to bottom, #d4af37, #f9f295 50%, #b8860b)`
                      : `linear-gradient(to right, #d4af37, #f9f295 50%, #b8860b)`,
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)'
                  }),
                  ...(style === 'black-gallery' && {
                    backgroundColor: '#0a0a0a',
                    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
                  }),
                };
                return baseStyles;
              };

              return (
                <>
                  <div style={{ ...getFrameStyle(false), top: 0, left: 0, right: 0, height: thickness }} />
                  <div style={{ ...getFrameStyle(false), bottom: 0, left: 0, right: 0, height: thickness }} />
                  <div style={{ ...getFrameStyle(true), top: thickness, bottom: thickness, left: 0, width: thickness }} />
                  <div style={{ ...getFrameStyle(true), top: thickness, bottom: thickness, right: 0, width: thickness }} />
                </>
              );
            })()}

            {/* 2. Line-Based Frames (Cartography Grade) */}
            {['thin', 'double', 'ornate'].includes(config.frame.style) && (() => {
              const thickness = config.frame.thickness;
              const color = config.frame.color || config.themeColors.text || '#fff';
              const gap = thickness * 2;
              
              return (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ padding: `${thickness * 4}px` }}
                >
                  <div className="w-full h-full relative">
                    {/* Style 1: Thin Line (Single clean stroke) */}
                    {config.frame.style === 'thin' && (
                      <div className="absolute inset-0 border" style={{ borderColor: color, borderWidth: `${thickness}px` }} />
                    )}

                    {/* Style 2: Double Line (Thick outer, thin inner) */}
                    {config.frame.style === 'double' && (
                      <>
                        <div className="absolute inset-0 border" style={{ borderColor: color, borderWidth: `${thickness * 1.5}px` }} />
                        <div className="absolute border" style={{ 
                          top: `-${gap}px`, left: `-${gap}px`, right: `-${gap}px`, bottom: `-${gap}px`,
                          borderColor: color, borderWidth: `1px`, opacity: 0.8 
                        }} />
                      </>
                    )}

                    {/* Style 3: Vintage Ornate (Triple line + Corner Accents) */}
                    {config.frame.style === 'ornate' && (
                      <>
                        {/* Triple boundary */}
                        <div className="absolute inset-0 border" style={{ borderColor: color, borderWidth: `${thickness}px` }} />
                        <div className="absolute border" style={{ 
                          top: `-${gap}px`, left: `-${gap}px`, right: `-${gap}px`, bottom: `-${gap}px`,
                          borderColor: color, borderWidth: `1px`, opacity: 0.6 
                        }} />
                        <div className="absolute border" style={{ 
                          top: `${gap}px`, left: `${gap}px`, right: `${gap}px`, bottom: `${gap}px`,
                          borderColor: color, borderWidth: `1px`, opacity: 0.6 
                        }} />
                        
                        {/* Corner "L" Accents (The Ornate part) */}
                        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: color }} />
                        <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: color }} />
                        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: color }} />
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: color }} />
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Optional Inner Shadow for Depth */}
            {config.frame.shadow && (
              <div 
                className="absolute z-10 pointer-events-none" 
                style={{ 
                  top: config.frame.thickness * 4, left: config.frame.thickness * 4, right: config.frame.thickness * 4, bottom: config.frame.thickness * 4,
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7), inset 0 0 10px rgba(0,0,0,0.9)'
                }} 
              />
            )}
          </div>
        )}
        {/* Background/Aura effects */}
        <AuraBackground />


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
              opacity: config.cartography.compassOpacity ?? 0.8,
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
              transform: `translateX(${config.text.offsetX}px)`,
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
