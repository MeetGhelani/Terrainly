import maplibregl from "maplibre-gl";
import { MapConfig, Overlay, Route } from "@/types/map";

// Map of icon IDs to their SVG paths
export const ICON_PATHS: Record<string, string> = {
  default: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
  pin: "M12 17v5 M5 7h14l-2 8H7l-2-8z M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  heart: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
  home: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  star: "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  circle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  square: "M3 3h18v18H3z",
  x: "M18 6 6 18 M6 6l12 12",
  target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41",
  moon: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
  building: "M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16",
  send: "m22 2-7 20-4-9-9-4Z M22 2 11 13",
  snowflake: "m12 2 0 20 M20 6.6 4 17.4 M4 6.6 20 17.4",
  shop: "M3 9 2 21h20l-1-12z M12 3a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z",
  camera: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M12 17a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
  flower: "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0z",
  tree: "M12 2L4 12h3l-4 6h18l-4-6h3L12 2z M11 18h2v4h-2v-4z",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
};

export const updateOverlays = (map: maplibregl.Map, config: MapConfig, markersRef: React.MutableRefObject<maplibregl.Marker[]>) => {
  markersRef.current.forEach(m => m.remove());
  markersRef.current = [];

  config.overlays.forEach(overlay => {
    if (overlay.type === 'marker') {
      const el = document.createElement('div');
      el.className = 'custom-marker flex items-center justify-center';
      el.style.width = `${overlay.size}px`;
      el.style.height = `${overlay.size}px`;
      el.style.cursor = 'pointer';

      // Handle Data URL Icons (Uploaded Markers)
      if (overlay.icon?.startsWith('data:')) {
        const img = document.createElement('img');
        img.src = overlay.icon;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        img.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.4))";
        el.appendChild(img);
      } else {
        // Handle Internal SVG Icons
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", overlay.color);
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.4))";

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", ICON_PATHS[overlay.icon || 'default'] || ICON_PATHS.default);
        
        if (['pin', 'heart', 'star', 'circle', 'square', 'sun', 'moon', 'building', 'target', 'shop', 'flower', 'tree', 'flag'].includes(overlay.icon || '')) {
          svg.setAttribute("fill", overlay.color);
          svg.setAttribute("stroke", "white");
          svg.setAttribute("stroke-width", "1");
        }

        svg.appendChild(path);
        el.appendChild(svg);
      }

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([overlay.lng, overlay.lat])
        .addTo(map);
      
      markersRef.current.push(marker);
    }
  });
};

export const updateRoutes = (map: maplibregl.Map, config: MapConfig) => {
  config.routes.forEach(route => {
    const sourceId = `route-${route.id}`;
    const layerId = `route-layer-${route.id}`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: route.points },
        },
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': route.color,
          'line-width': route.width,
          'line-opacity': route.opacity,
        },
      });
    } else {
      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: route.points },
      });
      map.setPaintProperty(layerId, 'line-color', route.color);
      map.setPaintProperty(layerId, 'line-width', route.width);
      map.setPaintProperty(layerId, 'line-opacity', route.opacity);
    }
  });
};

