"use client";

import React, { useState } from "react";
import { useMapStore } from "@/store/mapStore";
import { 
  Download, FileImage, FileText, Share2, Check, Copy, 
  Printer, Monitor, Globe, ChevronRight, Loader2, Info
} from "lucide-react";
import { getShareUrl } from "@/lib/share";
import { jsPDF } from "jspdf";
import { BASEMAPS } from "@/lib/map/basemaps";
import maplibregl from 'maplibre-gl';
import { applyLayerStyling, applyTerrainStyling } from "@/lib/map/style-builder";
import { project } from "@/lib/map/projection";
import { ICON_PATHS } from "@/lib/map/overlays";
import { TEXTURES } from "@/lib/map/textures";

// Helper to load an image for canvas
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};
import { injectPNGDPI } from "@/lib/map/png-metadata";
import { LAYOUT_RATIOS, getDimScale } from "@/lib/map/layout";
import { getCompassSVG } from "@/lib/map/compass-assets";
import { hexToRGBA } from "@/lib/themes";

// ── THEME PALETTE HELPERS ──────────────────────────────────────────────────
export const ExportPanel = () => {
  const { config } = useMapStore();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<'png' | 'pdf' | 'svg'>('png');

  // We lock to High Quality (300 DPI) for all exports to ensure professional results
  const quality = 300; 

  const handleShare = () => {
    const url = getShareUrl(config);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportDesign = async () => {
    setExporting(true);
    try {
      // ─── STEP 1: Resolve Target Dimensions ───────────────────────────────────
      const mapCanvas = document.querySelector('.maplibregl-canvas') as HTMLCanvasElement;
      if (!mapCanvas) throw new Error("Map canvas not found.");

      const artworkMaster = document.getElementById('map-artwork-master');
      const studioW = artworkMaster ? artworkMaster.clientWidth  : mapCanvas.clientWidth;
      const studioH = artworkMaster ? artworkMaster.clientHeight : mapCanvas.clientHeight;

      const isLandscape = config.poster.ratio.includes('LANDSCAPE');
      const baseSizes: Record<string, { w: number, h: number }> = {
        'A4':     { w: 210, h: 297 }, 
        'A3':     { w: 297, h: 420 }, 
        'A2':     { w: 420, h: 594 },
        'A5':     { w: 148, h: 210 },
        'LETTER': { w: 216, h: 279 },
        '50x70':  { w: 500, h: 700 },
        '18x24':  { w: 457, h: 610 },
        '24x36':  { w: 610, h: 914 },
        '1:1':    { w: 300, h: 300 },
        'INSTA-PORTRAIT': { w: 108, h: 135 },
        '9:16':   { w: 108, h: 192 },
        '16:9':   { w: 192, h: 108 },
        'SQUARE': { w: 300, h: 300 },
      };
      const ratioKey = config.poster.ratio.replace('-LANDSCAPE', '');
      const mmSize = baseSizes[ratioKey] || baseSizes['A3'];
      const mmW = isLandscape ? mmSize.h : mmSize.w;
      const mmH = isLandscape ? mmSize.w : mmSize.h;
      const targetW = Math.round((mmW / 25.4) * quality);
      const targetH = Math.round((mmH / 25.4) * quality);

      const scale = targetW / studioW;
      
      // ─── STEP 2: High-Resolution Shadow Map ──────────────────────────────────
      const exportContainer = document.createElement('div');
      exportContainer.style.width = `${studioW}px`;
      exportContainer.style.height = `${studioH}px`;
      exportContainer.style.position = 'fixed';
      exportContainer.style.left = '-99999px';
      exportContainer.style.top = '0px';
      exportContainer.style.visibility = 'hidden';
      document.body.appendChild(exportContainer);

      const exportMap = new maplibregl.Map({
        container: exportContainer,
        style: BASEMAPS[config.basemap].url,
        center: [config.location.lng, config.location.lat],
        zoom: config.location.zoom,
        pitch: config.location.pitch,
        bearing: config.location.bearing,
        attributionControl: false,
        preserveDrawingBuffer: true,
        pixelRatio: scale,
        fadeDuration: 0,
        transformRequest: (url: string) => {
          if (url.includes('arcgisonline.com') || url.includes('amazonaws.com')) {
            return { url, crossOrigin: 'anonymous' };
          }
          return { url };
        }
      } as any);

      await new Promise((resolve) => {
        exportMap.on('style.load', () => {
          applyLayerStyling(exportMap, config);
          applyTerrainStyling(exportMap, config);
          resolve(null);
        });
      });
      await new Promise((resolve) => exportMap.once('idle', resolve));

      const highResMapData = exportMap.getCanvas().toDataURL('image/png', 1.0);
      exportMap.remove();
      document.body.removeChild(exportContainer);

        // ─── STEP 3: Layout-Aware Overlay Canvas ─────────────────────────────────
        const fontWarmup = document.createElement('div');
        fontWarmup.style.fontFamily = `'${config.text.font}', 'JetBrains Mono', sans-serif`;
        fontWarmup.innerText = 'Warmup';
        fontWarmup.style.position = 'absolute';
        fontWarmup.style.visibility = 'hidden';
        document.body.appendChild(fontWarmup);
        await document.fonts.ready;

      const overlayCanvas = document.createElement('canvas');
      overlayCanvas.width = targetW;
      overlayCanvas.height = targetH;
      const oc = overlayCanvas.getContext('2d');
      if (!oc) throw new Error("Overlay context error");

      // ── Overlay A: Grid ───────────────────────────────────────────────────────
      if (config.cartography.grid.enabled) {
        const gridSpacing  = config.cartography.grid.spacing * scale;
        const gridThickness = (config.cartography.grid.thickness || 1) * scale;
        const dashArray    = config.cartography.grid.dashArray;
        const isSolid      = !dashArray || dashArray.length < 2 || dashArray[1] === 0;

        oc.strokeStyle = config.cartography.grid.color || config.themeColors.text || '#ffffff';
        oc.lineWidth   = gridThickness;
        oc.globalAlpha = config.cartography.grid.opacity ?? 0.5;

        if (!isSolid) {
          oc.setLineDash(dashArray.map(d => d * scale));
        }

        for (let x = 0; x <= targetW; x += gridSpacing) {
          oc.beginPath(); oc.moveTo(x, 0); oc.lineTo(x, targetH); oc.stroke();
        }
        for (let y = 0; y <= targetH; y += gridSpacing) {
          oc.beginPath(); oc.moveTo(0, y); oc.lineTo(targetW, y); oc.stroke();
        }
        oc.setLineDash([]);
        oc.globalAlpha = 1.0;
      }

      // ── Overlay B: Routes (PRECISION DRAWING) ─────────────────────────────────
      for (const route of config.routes) {
        if (!route.points || route.points.length < 2) continue;

        oc.strokeStyle = route.color;
        oc.lineWidth   = (route.width || 2) * scale;
        oc.globalAlpha = route.opacity || 1.0;
        oc.lineJoin    = 'round';
        oc.lineCap     = 'round';

        oc.beginPath();
        route.points.forEach((pt, i) => {
          const pos = project(
            { lng: pt[0], lat: pt[1] },
            { lng: config.location.lng, lat: config.location.lat },
            config.location.zoom,
            targetW,
            targetH,
            0
          );
          if (i === 0) oc.moveTo(pos.x, pos.y);
          else oc.lineTo(pos.x, pos.y);
        });
        oc.stroke();
        oc.globalAlpha = 1.0;
      }

      // ── Overlay C: Markers ────────────────────────────────────────────────────
      const markerPromises = config.overlays
        .filter(o => o.type === 'marker')
        .map(async (overlay) => {
          const pos = project(
            { lng: overlay.lng, lat: overlay.lat },
            { lng: config.location.lng, lat: config.location.lat },
            config.location.zoom,
            targetW,
            targetH,
            0
          );
          if (pos.x < 0 || pos.x > targetW || pos.y < 0 || pos.y > targetH) return null;

          const markerSize = overlay.size * scale;
          const markerColor = overlay.color || '#ffffff';
          const iconPath = ICON_PATHS[overlay.icon || 'default'] || ICON_PATHS.default;
          const isFilled = ['heart', 'star', 'circle', 'square', 'sun', 'moon', 'building', 'target', 'shop', 'flower', 'tree', 'flag'].includes(overlay.icon || '');

          const svgStr = `<svg width="${markerSize}" height="${markerSize}" viewBox="0 0 24 24" fill="${isFilled ? markerColor : 'none'}" stroke="${isFilled ? 'white' : markerColor}" stroke-width="${isFilled ? 1 : 2}" xmlns="http://www.w3.org/2000/svg"><path d="${iconPath}"/></svg>`;
          const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);

          return new Promise<{img: HTMLImageElement, x: number, y: number, size: number, url: string}>((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ img, x: pos.x - markerSize / 2, y: pos.y - markerSize, size: markerSize, url: svgUrl });
            img.src = svgUrl;
          });
        });

      const loadedMarkers = (await Promise.all(markerPromises)).filter(Boolean);
      for (const m of loadedMarkers) {
        if (!m) continue;
        oc.drawImage(m.img, m.x, m.y, m.size, m.size);
        URL.revokeObjectURL(m.url);
      }


      // ── Overlay E: Atmospheric Gradients ─────────────────────────────────────
      if (config.showOverlayLayer) {
        const topFade = config.overlayTopFade ?? 0;
        const botFade = config.overlayBottomFade ?? 0;
        const overlayColor = config.themeColors.overlay || '#000000';

        if (topFade > 0) {
          const topH = targetH * (topFade / 100);
          const topGrd = oc.createLinearGradient(0, 0, 0, topH);
          topGrd.addColorStop(0, hexToRGBA(overlayColor, 0.8));
          topGrd.addColorStop(1, hexToRGBA(overlayColor, 0));
          oc.fillStyle = topGrd;
          oc.fillRect(0, 0, targetW, topH);
        }
        if (botFade > 0) {
          const botH = targetH * (botFade / 100);
          const botGrd = oc.createLinearGradient(0, targetH, 0, targetH - botH);
          botGrd.addColorStop(0, hexToRGBA(overlayColor, 0.8));
          botGrd.addColorStop(1, hexToRGBA(overlayColor, 0));
          oc.fillStyle = botGrd;
          oc.fillRect(0, targetH - botH, targetW, botH);
        }
        if ((config.overlayLeftFade ?? 0) > 0) {
          const leftW = targetW * ((config.overlayLeftFade ?? 0) / 100);
          const leftGrd = oc.createLinearGradient(0, 0, leftW, 0);
          leftGrd.addColorStop(0, hexToRGBA(overlayColor, 0.8));
          leftGrd.addColorStop(1, hexToRGBA(overlayColor, 0));
          oc.fillStyle = leftGrd;
          oc.fillRect(0, 0, leftW, targetH);
        }
        if ((config.overlayRightFade ?? 0) > 0) {
          const rightW = targetW * ((config.overlayRightFade ?? 0) / 100);
          const rightGrd = oc.createLinearGradient(targetW, 0, targetW - rightW, 0);
          rightGrd.addColorStop(0, hexToRGBA(overlayColor, 0.8));
          rightGrd.addColorStop(1, hexToRGBA(overlayColor, 0));
          oc.fillStyle = rightGrd;
          oc.fillRect(targetW - rightW, 0, rightW, targetH);
        }
      }

      // ── Overlay D: Compass Rose ───────────────────────────────────────────────
      if (config.cartography.compass) {
        const frameThicknessRaw = config.frame.style !== 'none' ? config.frame.thickness * 4 : 0;
        const frameThickness = frameThicknessRaw * scale;

        const compassSize   = (config.cartography.compassSize || 64) * scale;
        const compassOffset = ((config.cartography.compassMargin ?? 20) * scale) + frameThickness;
        const compassColor  = config.themeColors.text || '#ffffff';
        const pos           = config.cartography.compassPosition || 'br'; 

        const svgStr  = getCompassSVG(config.cartography.compassStyle as any || 'minimal', compassColor, compassSize);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl  = URL.createObjectURL(svgBlob);

        const compassImg = await new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = svgUrl;
        });

        const drawX = pos.endsWith('r')   ? targetW - compassOffset - compassSize : compassOffset;
        const drawY = pos.startsWith('b')  ? targetH - compassOffset - compassSize : compassOffset;

        oc.save();
        oc.globalAlpha = config.cartography.compassOpacity ?? 0.8;
        oc.drawImage(compassImg, drawX, drawY, compassSize, compassSize);
        oc.restore();
        URL.revokeObjectURL(svgUrl);
      }

      // ── Overlay F: Typography ────────────────────────────────────────────────
      if (config.showPosterText) {
        oc.fillStyle = config.text.color || config.themeColors.text || '#ffffff';
        
        const frameThicknessRaw = config.frame.style !== 'none' ? config.frame.thickness * 4 : 0;
        const frameThickness = frameThicknessRaw * scale;

        const paddingX = (targetW * LAYOUT_RATIOS.PADDING_X) + frameThickness;
        const paddingY = (targetH * LAYOUT_RATIOS.PADDING_Y) + frameThickness + (config.text.offsetY * scale);
        
        const mtSubtitle = targetH * LAYOUT_RATIOS.TYPO_GAP_SUBTITLE;
        const mtTagline  = targetH * LAYOUT_RATIOS.TYPO_GAP_TAGLINE;
        const font = `'${config.text.font}', sans-serif`;

        const drawTracked = (text: string, x: number, baselineY: number, size: number, trackingEm: number, weight: string, alpha: number = 1.0) => {
          oc.font = `${weight} ${size}px ${font}`;
          oc.globalAlpha = alpha;
          const charGap = size * trackingEm;
          const chars = text.split('');
          let totalW = chars.reduce((sum, c) => sum + oc.measureText(c).width + charGap, 0) - charGap;
          let curX = config.text.alignment === 'center' ? x - totalW / 2 : config.text.alignment === 'right' ? x - totalW : x;
          chars.forEach(c => {
            oc.fillText(c, curX, baselineY);
            curX += oc.measureText(c).width + charGap;
          });
          oc.globalAlpha = 1.0;
        };

        const horizontalShift = config.text.offsetX * scale;
        const anchorX = (config.text.alignment === 'center' ? targetW / 2 : config.text.alignment === 'right' ? targetW - paddingX : paddingX) + horizontalShift;
        const isTop = config.text.position === 'top';

        // Match the Math.max logic in MapCanvas to preserve proportions on small fonts
        const studioFontSize = config.text.size ?? 32;
        const studioSubSize  = Math.max(14, studioFontSize * LAYOUT_RATIOS.FONT_SIZE_SUBTITLE_RATIO);
        const studioTagSize  = Math.max(12, studioFontSize * LAYOUT_RATIOS.FONT_SIZE_TAGLINE_RATIO);

        const fontSize    = studioFontSize * scale;
        const subSize     = studioSubSize * scale;
        const taglineSize = studioTagSize * scale;

        const lineHeightCity = fontSize * 1.1;
        const lineHeightSub  = subSize * 1.1;
        const lineHeightTag  = taglineSize * 1.1;

        if (isTop) {
          const cityBaseline = paddingY + lineHeightCity;
          drawTracked(config.text.city.toUpperCase(), anchorX, cityBaseline, fontSize, LAYOUT_RATIOS.TRACKING_CITY, '900');
          if (config.text.subtitle) {
            const subBaseline = cityBaseline + mtSubtitle + lineHeightSub;
            drawTracked(config.text.subtitle.toUpperCase(), anchorX, subBaseline, subSize, LAYOUT_RATIOS.TRACKING_SUBTITLE, '500', 0.8);
          }
          if (config.text.tagline) {
            const prevBottom = config.text.subtitle ? cityBaseline + mtSubtitle + subSize : cityBaseline;
              const tagBaseline = prevBottom + mtTagline + taglineSize;
              oc.font = `400 ${taglineSize}px 'JetBrains Mono', monospace`;
              oc.globalAlpha = 0.6;
              oc.textAlign = config.text.alignment as CanvasTextAlign;
              oc.fillText(config.text.tagline, anchorX, tagBaseline);
              oc.textAlign = 'left';
              oc.globalAlpha = 1.0;
            }
          } else {
            let blockH = lineHeightCity;
            if (config.text.subtitle) blockH += mtSubtitle + lineHeightSub;
            if (config.text.tagline)  blockH += mtTagline + lineHeightTag;
            
            const blockTop = targetH - paddingY - blockH;
            const cityBaseline = blockTop + lineHeightCity;
            
            drawTracked(config.text.city.toUpperCase(), anchorX, cityBaseline, fontSize, LAYOUT_RATIOS.TRACKING_CITY, '900');
            
            if (config.text.subtitle) {
              const subBaseline = cityBaseline + mtSubtitle + lineHeightSub;
              drawTracked(config.text.subtitle.toUpperCase(), anchorX, subBaseline, subSize, LAYOUT_RATIOS.TRACKING_SUBTITLE, '500', 0.8);
              
              if (config.text.tagline) {
                const tagBaseline = subBaseline + mtTagline + lineHeightTag;
                oc.font = `400 ${taglineSize}px 'JetBrains Mono', monospace`;
                oc.globalAlpha = 0.6;
                oc.textAlign = config.text.alignment as CanvasTextAlign;
                oc.fillText(config.text.tagline, anchorX, tagBaseline);
                oc.textAlign = 'left';
                oc.globalAlpha = 1.0;
              }
            } else if (config.text.tagline) {
              const tagBaseline = cityBaseline + mtTagline + lineHeightTag;
              oc.font = `400 ${taglineSize}px 'JetBrains Mono', monospace`;
              oc.globalAlpha = 0.6;
              oc.textAlign = config.text.alignment as CanvasTextAlign;
              oc.fillText(config.text.tagline, anchorX, tagBaseline);
              oc.textAlign = 'left';
              oc.globalAlpha = 1.0;
            }
          }
      }

      // ─── STEP 4: Final Assembly ──────────────────────────────────────────────
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width  = targetW;
      finalCanvas.height = targetH;
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) throw new Error("Final context error");

      ctx.fillStyle = config.poster.bgColor || '#070b12';
      ctx.fillRect(0, 0, targetW, targetH);

      // ── Overlay Texture Background ──
      if (config.frame.texture !== 'none') {
        ctx.save();
        const colors: Record<string, string> = {
          parchment: '#f4e4bc',
          linen: '#faf9f6',
          aged: '#dcb35c',
          noise: '#ffffff',
          kraft: '#a68064'
        };
        ctx.fillStyle = colors[config.frame.texture] || '#ffffff';
        ctx.globalAlpha = (config.frame.textureOpacity ?? 40) / 100;
        ctx.fillRect(0, 0, targetW, targetH);
        
        // Add Procedural Noise for texture
        ctx.globalAlpha = 0.05 * ((config.frame.textureOpacity ?? 40) / 40);
        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * targetW;
          const y = Math.random() * targetH;
          const size = Math.random() * 2 * scale;
          ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
          ctx.fillRect(x, y, size, size);
        }
        ctx.restore();
      }

      const mapImg = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = highResMapData;
      });
      ctx.drawImage(mapImg, 0, 0, targetW, targetH);
      ctx.drawImage(overlayCanvas, 0, 0);

      // ── Step F.5: Apply Paper Texture ───────────────────────────────────────
      const textureUrl = TEXTURES[config.frame.texture as keyof typeof TEXTURES];
      if (textureUrl && config.frame.texture !== 'none' && config.frame.textureOpacity > 0) {
        try {
          const textureImg = await loadImage(textureUrl);
          ctx.save();
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = config.frame.textureOpacity / 100;
          
          // Apply only inside the safe area (excluding physical frame padding)
          const framePadding = (config.frame.thickness * 4) * scale;
          const contentX = framePadding;
          const contentY = framePadding;
          const contentW = targetW - framePadding * 2;
          const contentH = targetH - framePadding * 2;
          
          // Smart "Cover" scaling for the texture
          const textureRatio = textureImg.width / textureImg.height;
          const contentRatio = contentW / contentH;
          let drawW, drawH, drawX, drawY;
          
          if (textureRatio > contentRatio) {
            drawH = contentH;
            drawW = contentH * textureRatio;
            drawX = contentX - (drawW - contentW) / 2;
            drawY = contentY;
          } else {
            drawW = contentW;
            drawH = contentW / textureRatio;
            drawX = contentX;
            drawY = contentY - (drawH - contentH) / 2;
          }
          
          ctx.drawImage(textureImg, drawX, drawY, drawW, drawH);
          ctx.restore();
        } catch (err) {
          console.warn("Texture load failed, skipping blending:", err);
        }
      }

      // ── Overlay G: Realistic Frame ──────────────────────────────────────────
      if (config.frame.style !== 'none') {
        ctx.save();
        const thickness = config.frame.thickness * scale;
        const outerPad = thickness * 2;
        const frameW = thickness * 4; // Total width of the frame structure

        // 1. Draw Inner Map Shadow for depth
        if (config.frame.shadow) {
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 30 * scale;
          ctx.strokeStyle = 'rgba(0,0,0,0.5)';
          ctx.lineWidth = 2 * scale;
          ctx.strokeRect(outerPad, outerPad, targetW - outerPad*2, targetH - outerPad*2);
          ctx.shadowBlur = 0;
        }

        // 2. Define the Frame Path (Hollow Rect) - Only for Material Frames
        const isMaterialFrame = ['oak', 'walnut', 'mahogany', 'aluminum', 'gold', 'black-gallery'].includes(config.frame.style);
        
        if (isMaterialFrame) {
          ctx.beginPath();
          ctx.rect(0, 0, targetW, targetH);
          ctx.rect(frameW, frameW, targetW - frameW*2, targetH - frameW*2);
          ctx.clip('evenodd');
        }

        // 3. Draw the Material
        switch (config.frame.style) {
          case 'oak':
          case 'walnut':
          case 'mahogany':
          case 'aluminum':
          case 'gold':
          case 'black-gallery': {
            const thickness = (config.frame.thickness * 4) * scale;
            
            const drawBar = (x: number, y: number, w: number, h: number, isVertical: boolean) => {
              ctx.save();
              const style = config.frame.style;
              
              if (style === 'oak') {
                ctx.fillStyle = '#5d3a1a';
                ctx.fillRect(x, y, w, h);
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#8b5a2b';
                for (let i = 0; i < (isVertical ? w : h); i += 4 * scale) {
                  if (isVertical) ctx.fillRect(x + i, y, 2 * scale, h);
                  else ctx.fillRect(x, y + i, w, 2 * scale);
                }
              } else if (style === 'walnut') {
                ctx.fillStyle = '#2d1b0f';
                ctx.fillRect(x, y, w, h);
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#3d2b1f';
                for (let i = 0; i < (isVertical ? w : h); i += 2 * scale) {
                  if (isVertical) ctx.fillRect(x + i, y, 1 * scale, h);
                  else ctx.fillRect(x, y + i, w, 1 * scale);
                }
              } else if (style === 'mahogany') {
                ctx.fillStyle = '#600000';
                ctx.fillRect(x, y, w, h);
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#800000';
                for (let i = 0; i < (isVertical ? w : h); i += 4 * scale) {
                  if (isVertical) ctx.fillRect(x + i, y, 2 * scale, h);
                  else ctx.fillRect(x, y + i, w, 2 * scale);
                }
              } else if (style === 'aluminum') {
                const grad = isVertical ? ctx.createLinearGradient(x, y, x+w, y) : ctx.createLinearGradient(x, y, x, y+h);
                grad.addColorStop(0, '#999'); grad.addColorStop(0.5, '#eee'); grad.addColorStop(1, '#999');
                ctx.fillStyle = grad;
                ctx.fillRect(x, y, w, h);
              } else if (style === 'gold') {
                const grad = isVertical ? ctx.createLinearGradient(x, y, x+w, y) : ctx.createLinearGradient(x, y, x, y+h);
                grad.addColorStop(0, '#d4af37'); grad.addColorStop(0.5, '#f9f295'); grad.addColorStop(1, '#b8860b');
                ctx.fillStyle = grad;
                ctx.fillRect(x, y, w, h);
              } else if (style === 'black-gallery') {
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(x, y, w, h);
              }
              
              // Internal Shadow for depth
              ctx.globalAlpha = 0.3;
              ctx.fillStyle = '#000';
              if (isVertical) {
                if (x === 0) ctx.fillRect(x + w - 2*scale, y, 2*scale, h);
                else ctx.fillRect(x, y, 2*scale, h);
              } else {
                if (y === 0) ctx.fillRect(x, y + h - 2*scale, w, 2*scale);
                else ctx.fillRect(x, y, 2*scale, w);
              }
              ctx.restore();
            };

            drawBar(0, 0, targetW, thickness, false); // Top
            drawBar(0, targetH - thickness, targetW, thickness, false); // Bottom
            drawBar(0, thickness, thickness, targetH - thickness*2, true); // Left
            drawBar(targetW - thickness, thickness, thickness, targetH - thickness*2, true); // Right
            break;
          }

          case 'thin':
          case 'double':
          case 'ornate': {
            const color = config.frame.color || config.themeColors.text || '#ffffff';
            const thickness = config.frame.thickness * scale;
            const safePadding = (config.frame.thickness * 4) * scale;
            const gap = (config.frame.thickness * 2) * scale;

            ctx.fillStyle = color;
            
            const drawFrameRect = (x: number, y: number, w: number, h: number, weight: number) => {
              ctx.fillRect(x, y, w, weight); // Top
              ctx.fillRect(x, y + h - weight, w, weight); // Bottom
              ctx.fillRect(x, y + weight, weight, h - weight * 2); // Left
              ctx.fillRect(x + w - weight, y + weight, weight, h - weight * 2); // Right
            };

            if (config.frame.style === 'thin') {
              drawFrameRect(safePadding, safePadding, targetW - safePadding*2, targetH - safePadding*2, thickness);
            } else if (config.frame.style === 'double') {
              // Outer thick (Match border-width: thickness * 1.5)
              drawFrameRect(safePadding, safePadding, targetW - safePadding*2, targetH - safePadding*2, thickness * 1.5);
              // Inner hairline (Match top: -gap)
              ctx.globalAlpha = 0.8;
              const pInner = safePadding - gap;
              drawFrameRect(pInner, pInner, targetW - pInner*2, targetH - pInner*2, 1 * scale);
              ctx.globalAlpha = 1.0;
            } else if (config.frame.style === 'ornate') {
              // Main boundary
              drawFrameRect(safePadding, safePadding, targetW - safePadding*2, targetH - safePadding*2, thickness);
              
              // Outer spread (Match top: -gap)
              ctx.globalAlpha = 0.6;
              const pOuter = safePadding - gap;
              drawFrameRect(pOuter, pOuter, targetW - pOuter*2, targetH - pOuter*2, 1 * scale);
              
              // Inner spread (Match top: gap)
              const pInner = safePadding + gap;
              drawFrameRect(pInner, pInner, targetW - pInner*2, targetH - pInner*2, 1 * scale);
              
              // Corner L-Accents (Match MapCanvas -top-3 -left-3)
              ctx.globalAlpha = 1.0;
              // Align with the outermost spread line (safePadding - gap)
              const accentOffset = safePadding - gap; 
              const accentSize = 20 * scale; // Slightly tighter size for a refined look
              const accentWeight = 2 * scale;
              
              ctx.strokeStyle = color;
              ctx.lineWidth = accentWeight;
              ctx.lineCap = 'square';
              
              // Top Left
              ctx.beginPath(); ctx.moveTo(accentOffset, accentOffset + accentSize); ctx.lineTo(accentOffset, accentOffset); ctx.lineTo(accentOffset + accentSize, accentOffset); ctx.stroke();
              // Top Right
              ctx.beginPath(); ctx.moveTo(targetW - accentOffset - accentSize, accentOffset); ctx.lineTo(targetW - accentOffset, accentOffset); ctx.lineTo(targetW - accentOffset, accentOffset + accentSize); ctx.stroke();
              // Bottom Left
              ctx.beginPath(); ctx.moveTo(accentOffset, targetH - accentOffset - accentSize); ctx.lineTo(accentOffset, targetH - accentOffset); ctx.lineTo(accentOffset + accentSize, targetH - accentOffset); ctx.stroke();
              // Bottom Right
              ctx.beginPath(); ctx.moveTo(targetW - accentOffset - accentSize, targetH - accentOffset); ctx.lineTo(targetW - accentOffset, targetH - accentOffset); ctx.lineTo(targetW - accentOffset, targetH - accentOffset - accentSize); ctx.stroke();
            }
            break;
          }
        }
        ctx.restore();
      }

      // ─── STEP 4.5: Watermark ──────────────────────────────────────────────────
      if (config.watermark) {
        ctx.save();
        ctx.fillStyle = config.themeColors.text || '#ffffff';
        ctx.globalAlpha = 0.5;
        const wmSize = Math.max(12, Math.round(targetW * 0.012));
        ctx.font = `600 ${wmSize}px 'Inter', sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        const padX = targetW * 0.02;
        const padY = targetH * 0.02;
        ctx.fillText("© CREATED WITH TERRAINLY", targetW - padX, targetH - padY);
        ctx.restore();
      }

      // ─── STEP 5: Export ──────────────────────────────────────────────────────
      if (format === 'pdf') {
        const orientation = targetW > targetH ? 'landscape' : 'portrait';
        const pdf = new jsPDF({ orientation, unit: 'px', format: [targetW, targetH] });
        pdf.addImage(finalCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, targetW, targetH);
        pdf.save(`terrainly-${config.text.city.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      } else if (format === 'svg') {
        const svgHeader = `<svg width="${targetW}" height="${targetH}" viewBox="0 0 ${targetW} ${targetH}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;
        const bgRect = `<rect width="${targetW}" height="${targetH}" fill="${config.poster.bgColor || '#070b12'}"/>`;
        const mapImgData = `<image width="${targetW}" height="${targetH}" xlink:href="${highResMapData}"/>`;
        const overlayImgData = `<image width="${targetW}" height="${targetH}" xlink:href="${overlayCanvas.toDataURL('image/png')}"/>`;
        
        let wmSvg = '';
        if (config.watermark) {
           const wmSize = Math.max(12, Math.round(targetW * 0.012));
           const padX = targetW * 0.02;
           const padY = targetH * 0.02;
           wmSvg = `<text x="${targetW - padX}" y="${targetH - padY}" font-family="Inter, sans-serif" font-weight="600" font-size="${wmSize}px" fill="${config.themeColors.text || '#ffffff'}" opacity="0.5" text-anchor="end">© CREATED WITH TERRAINLY</text>`;
        }
        
        const svgContent = svgHeader + bgRect + mapImgData + overlayImgData + wmSvg + `</svg>`;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `terrainly-${config.text.city.toLowerCase().replace(/\s+/g, '-')}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
      } else {
        const blob = await new Promise<Blob>((resolve) => finalCanvas.toBlob((b) => resolve(b!), 'image/png', 1.0));
        const finalBlob = await injectPNGDPI(blob, 300);
        const link = document.createElement('a');
        link.download = `terrainly-${config.text.city.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = URL.createObjectURL(finalBlob);
        link.click();
      }
      document.body.removeChild(fontWarmup);
    } catch (err) {
      console.error("Export Failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-80">Export Format</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'png', label: 'PNG Image', icon: FileImage },
              { id: 'pdf', label: 'PDF Print', icon: FileText },
              { id: 'svg', label: 'SVG Vector', icon: Globe },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as any)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
                  format === f.id 
                    ? "bg-[#111928] border-accent/40 text-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)] scale-[1.02]" 
                    : "bg-[#0b101a] border-border-subtle hover:border-text-muted hover:bg-[#0e1420] text-text-secondary"
                }`}
              >
                <f.icon className="w-5 h-5" />
                <span className={`text-[11px] font-black uppercase tracking-widest ${format === f.id ? "text-accent" : "text-text-muted"}`}>
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-bg-panel/20 border border-white/5 rounded-2xl flex items-start gap-4">
          <Printer className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">High Fidelity Mode</p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Exporting at 300 DPI professional resolution. All elements are scaled proportionally for the highest print quality.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={exportDesign}
          disabled={exporting}
          className="w-full relative group h-14 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all duration-300 overflow-hidden bg-accent hover:bg-accent-hover text-white shadow-accent/20 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.6)] hover:-translate-y-1 disabled:opacity-60 disabled:hover:transform-none disabled:hover:shadow-none"
        >
          {/* Diagonal glass shine effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl z-0">
            <div className="absolute top-0 left-[-150%] h-full w-[100%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 ease-out group-hover:left-[150%]" />
          </div>
          {exporting ? (
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-black uppercase tracking-widest">Compositing...</span>
            </div>
          ) : (
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Download className="w-5 h-5 group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300" />
              <span className="text-sm font-black uppercase tracking-widest">Export {format.toUpperCase()}</span>
            </div>
          )}
        </button>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <button
          onClick={handleShare}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${
            copied 
              ? "bg-success/10 border-success/40 text-success" 
              : "bg-bg-panel/20 border-white/5 text-text-secondary hover:bg-bg-panel/40"
          }`}
        >
          <div className="flex items-center gap-3">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase tracking-wide">
              {copied ? "Share URL Copied" : "Copy Share Link"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-40" />
        </button>
      </div>
    </div>
  );
};
