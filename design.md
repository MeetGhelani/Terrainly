# 🗺️ Terrainly — Design & Architecture Document

> **Project Name:** Terrainly  
> **Tagline:** *Your terrain. Your art.*  
> **License:** MIT — Free to use, modify, and deploy by anyone, forever.  
> **Deployment Target:** Vercel (free tier)  
> **Version:** v1.0 Full Scope — Everything Included

---

## 1. Project Overview

Terrainly is a free, open-source, browser-based cartographic poster engine. Users can generate stunning, highly customizable map art and wallpapers of any location in the world — no account, no payment, no watermark. Just design and download.

Built from scratch with a richer feature set than anything else out there — a sharp Midnight Ink aesthetic, powerful customization, and a fully free stack from data to deployment.

---

## 2. Goals & Principles

| Principle | Description |
|-----------|-------------|
| **Free forever** | No paid APIs, no paywalls, no premium tiers |
| **No login required** | Users just open and create — download when done |
| **Privacy-first** | No tracking, no analytics by default |
| **Performant** | Runs entirely in the browser; no heavy backend |
| **Open source** | MIT licensed; community-extensible |
| **Beautiful by default** | Midnight Ink UI — sharp, modern, premium on first load |

---

## 3. Recommended Tech Stack

### Why Next.js + TypeScript?

Next.js is recommended over plain React or Vite for this project because:
- Zero-config deployment to **Vercel** (native platform, 1-click deploy)
- Built-in API routes (useful for future server-side features)
- File-based routing keeps the project organized as it grows
- TypeScript keeps the codebase manageable and self-documenting
- Large ecosystem, excellent documentation, easy to onboard contributors

### Full Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | Vercel-native, organized, scalable |
| Language | TypeScript | Type safety, maintainability |
| Map Renderer | MapLibre GL JS | Free, WebGL-powered, OSM-compatible |
| Map Data | OpenStreetMap via OpenFreeMap tiles | 100% free, no API key needed |
| Geocoding | Nominatim (OSM) | Free, no key needed |
| Terrain/Elevation | OpenTopoData or Terrarium tiles | Free DEM tiles |
| Styling | Tailwind CSS | Utility-first, fast dark theme |
| Canvas Export | MapLibre's `map.getCanvas()` + html2canvas | High-res PNG download |
| SVG Export | Custom SVG serializer | Vector export |
| PDF Export | jsPDF + canvas | Print-ready with bleed marks |
| State History | Zustand + `zundo` middleware | Undo/redo support |
| URL State | `lz-string` (LZ compression) | Shareable config in URL hash |
| GPX Parsing | `@tmcw/togeojson` | GPX file → GeoJSON route |
| AI Themes | Anthropic Claude API (BYOK) | Optional, user supplies key |
| Icons | Lucide React | Free, consistent icon set |
| Fonts | Google Fonts API | Free, user-selectable |
| Hotkeys | `react-hotkeys-hook` | Keyboard shortcuts |
| Package Manager | pnpm | Fast, disk-efficient |
| Deployment | Vercel (free tier) | Auto-deploy from GitHub |

### Is Vercel Free Tier Feasible?

**Yes, completely.** Because:
- All map tiles are fetched client-side (no bandwidth on your server)
- Geocoding calls go directly from browser to Nominatim
- No database, no user auth, no file storage needed
- The app is essentially a static frontend with no serverless function load
- Vercel free tier supports unlimited static deployments

---

## 4. Feature Set — v1.0

### 4.1 Core Map Engine
- Search any city, region, or address worldwide (Nominatim geocoding)
- Manual coordinate input (lat/lng)
- Zoom, pan, and fit-to-bounds controls
- Real-time map preview with instant style updates

### 4.2 Map Layers & Styling
- Individual layer controls: Roads, Water, Parks, Buildings, Land
- Per-layer color picker (solid or gradient)
- **Gradient color themes** — multi-stop gradients assignable per layer
- Layer visibility toggles
- Road width/opacity sliders

### 4.3 Basemap Modes
- **Default vector** (OpenFreeMap — clean, stylized)
- **Satellite/Hybrid** — raster satellite tiles blended with vector overlays
- **Historical/Antique** — sepia-toned style with aged paper feel
- **Terrain/Elevation** — hillshading + contour lines via OpenTopoData DEM

### 4.4 Custom Overlays
- **Pin markers** — drop custom icons at any location (home, favorite spot, memory)
- **Label overlays** — add custom text labels on the map
- **Route drawing** — draw polylines on the map to highlight a trail, road trip, running path, etc.
- Marker color, size, and icon customization
- Route color, width, and dash-style options

### 4.5 Cartographic Elements
- **Compass rose** — toggle on/off, choose style (minimal, ornate, classic)
- **Scale bar** — toggle on/off, auto-scales to zoom level
- Positioning control for both (corner placement)

### 4.6 Frame & Border Styles
- None (borderless)
- Thin line (minimal, modern)
- Double line (classic poster)
- Vintage ornate border (SVG decorative frame)
- Shadow drop (soft elevation effect)
- Custom border color and thickness

### 4.7 Background Textures
- None (flat color)
- Parchment
- Linen
- Aged paper
- Kraft paper
- Noise grain (subtle)
- Textures are SVG/CSS-based — no external image assets needed

### 4.8 Typography
- City name (large display text)
- Country / region label (subtitle)
- Custom tagline or coordinates line
- Font selection via Google Fonts (search + load any family)
- Font size, weight, color, letter-spacing controls
- Text alignment (left, center, right)
- Label position on poster (top, bottom, overlay)

### 4.9 Neighborhood & District Labels
- Toggle auto-labels from OSM place data
- Control font size and color of district labels
- Option to show/hide specific label types (districts, suburbs, landmarks)

### 4.10 Poster Layout
- Preset aspect ratios: Square (1:1), Portrait A3 (√2:1), Landscape, Phone Wallpaper (9:16), Desktop Wallpaper (16:9)
- Custom width/height input
- DPI setting for export (150 / 300 / 72)
- Background color (behind map and texture)

### 4.11 Export
- **High-resolution PNG** — download at 72 / 150 / 300 DPI, no watermark ever
- **SVG export** — fully scalable vector file, editable in Illustrator / Inkscape
- **Print-ready PDF** — with configurable bleed marks (3mm/5mm) for professional printing
- Filename auto-generated from city name and date

### 4.12 Undo / Redo History
- Full undo/redo stack via `zundo` Zustand middleware
- Keyboard shortcuts: `Ctrl+Z` / `Ctrl+Shift+Z` (or `Cmd` on Mac)
- History depth: 50 steps
- History is per-session (cleared on page reload)

### 4.13 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+S` | Download PNG |
| `Ctrl+E` | Open export panel |
| `Ctrl+K` | Focus search bar |
| `Ctrl+/` | Show keyboard shortcuts help |
| `Escape` | Close any open modal/drawer |
| `[` / `]` | Cycle through panel tabs |
| `+` / `-` | Zoom map in/out |
| `0` | Reset map zoom to fit |

### 4.14 Shareable URL Config
- Entire map config serialized to JSON → compressed with LZ-string → base64 encoded → stored in URL hash (`#config=...`)
- No backend needed — link encodes everything
- Share button copies URL to clipboard
- On load, URL hash is parsed and config is restored instantly
- URLs stay bookmarkable and work offline

### 4.15 Community Theme Presets
- Curated built-in presets ship with the app (e.g. "Midnight Tokyo", "Sahara Dusk", "Arctic Blueprint", "Soviet Ink")
- Each preset is a full `MapConfig` snapshot (layers + basemap + frame + typography)
- User can submit their own via GitHub PR (theme presets live in `/lib/themes/community/`)
- Browsable preset gallery in the Style panel with thumbnail previews

### 4.16 AI-Powered Theme Generator (Optional — BYOK)
- Users who want AI themes paste their own Claude API key in Settings (stored only in `localStorage`, never sent to any server)
- Describe a mood or place: *"rainy night in Kyoto"*, *"desert at golden hour"*, *"cold Scandinavian winter"*
- Claude API generates a full color palette for every map layer + matching frame/texture recommendation
- If no key is provided, the AI section is hidden — zero impact on other users
- API calls go directly from the browser to Anthropic (no proxy, no backend)

### 4.17 GPX File Import
- Drag-and-drop or file picker for `.gpx` files
- Parsed client-side via `@tmcw/togeojson` — no upload to any server
- Route rendered as a styled polyline overlay on the map
- Editable: color, width, opacity, dash style after import
- Useful for hiking trails, running routes, road trips, cycling paths

### 4.18 Multi-Page / Collage Layouts
- **City Grid:** Generate a 2×2 or 3×3 grid of different cities as one combined poster
- **Travel Collage:** Arrange multiple map crops with custom labels into a single layout
- Each cell in the grid has its own independent style config
- Export as a single high-res PNG or PDF
- Layout editor is a drag-resize grid (CSS Grid-based, no external library needed)

### 4.19 Mobile-Optimized UI
- On screens < 768px, the side panel becomes a **bottom drawer** (slides up from bottom edge)
- Drawer has drag handle — swipe up for full panel, swipe down to minimize to a tab bar
- Map canvas takes full screen; drawer overlays on top
- Touch-friendly controls: larger tap targets (44px minimum), swipe gestures on map
- Export button pinned to bottom of screen on mobile

---

## 5. UI Design System

### 5.1 Visual Language

**Theme:** Midnight Ink — deep navy darkness, electric blue accents, sharp typographic precision. Like a premium developer tool meets a cartographer's drafting table lit by a cold blue monitor glow.

**Mood:** Sharp, modern, focused, technical. Confident and clean like GitHub Dark, VS Code, or Planetscale.

### 5.2 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#070b12` | App background (deep navy-black) |
| `--bg-panel` | `#0d1320` | Sidebar/panel background |
| `--bg-surface` | `#131d2e` | Cards, input backgrounds |
| `--bg-elevated` | `#1a2840` | Hover states, dropdowns |
| `--border` | `#1e2d45` | Dividers, input borders |
| `--text-primary` | `#e8eef8` | Main text (cool blue-white) |
| `--text-secondary` | `#7a90b0` | Labels, hints |
| `--text-muted` | `#3a5070` | Disabled, placeholders |
| `--accent` | `#4f8ef7` | Primary accent (electric blue) |
| `--accent-hover` | `#74a8ff` | Hover state of accent |
| `--accent-dim` | `#1a3a6a` | Subtle accent backgrounds |
| `--danger` | `#f75a5a` | Errors, destructive actions |
| `--success` | `#4fbe8a` | Confirmations |

### 5.3 Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| App heading | `Inter` | 700 | 18–24px |
| UI labels | `Inter` | 400–500 | 12–14px |
| Monospace (coords) | `JetBrains Mono` | 400 | 12px |
| Section titles | `Inter` | 600 | 11px uppercase tracked |
| Accent/logo | `Space Grotesk` | 700 | 20px |

### 5.4 Layout

```
┌─────────────────────────────────────────────────────────┐
│  Terrainly              [Search location...]    [Export]  │  ← Top Bar (56px)
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  LEFT PANEL  │           MAP CANVAS PREVIEW            │
│  (320px)     │                                          │
│              │                                          │
│  ┌─────────┐ │                                          │
│  │ Layers  │ │                                          │
│  │ Style   │ │                                          │
│  │ Overlays│ │                                          │
│  │ Text    │ │                                          │
│  │ Frame   │ │                                          │
│  │ Export  │ │                                          │
│  └─────────┘ │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

- **Left panel:** 320px fixed, scrollable, tabbed sections
- **Canvas area:** fills remaining space, centered map preview
- **Top bar:** minimal — logo, search, export button
- **Responsive:** On mobile, panel slides up from bottom as a drawer

### 5.5 Panel Sections (Tabs / Accordion)

1. **📍 Location** — Search, coordinates, zoom
2. **🗺️ Basemap** — Mode selection (Vector / Satellite / Antique / Terrain)
3. **🎨 Style** — Layers, colors, gradients, community presets, AI theme generator
4. **📌 Overlays** — Markers, routes, labels, GPX import
5. **🧭 Cartography** — Compass, scale bar, neighborhood labels
6. **🖼️ Frame** — Border style, texture, background
7. **✍️ Text** — City name, subtitle, font, positioning
8. **📐 Export** — Size, DPI, PNG / SVG / PDF download, share URL
9. **⚙️ Settings** — Claude API key (optional), keyboard shortcuts reference

---

## 6. Project File Structure

```
terrainly/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Main editor page
│   └── globals.css             # CSS variables — Midnight Ink theme tokens
│
├── components/
│   ├── editor/
│   │   ├── MapCanvas.tsx       # MapLibre map instance
│   │   ├── SidePanel.tsx       # Left panel container (desktop)
│   │   ├── BottomDrawer.tsx    # Mobile bottom drawer
│   │   ├── TopBar.tsx          # Search + export bar
│   │   ├── CollageEditor.tsx   # Multi-map grid/collage layout
│   │   └── panels/
│   │       ├── LocationPanel.tsx
│   │       ├── BasemapPanel.tsx
│   │       ├── StylePanel.tsx       # Includes preset gallery
│   │       ├── OverlaysPanel.tsx    # Markers, routes, GPX import
│   │       ├── CartographyPanel.tsx
│   │       ├── FramePanel.tsx
│   │       ├── TextPanel.tsx
│   │       ├── ExportPanel.tsx      # PNG + SVG + PDF + Share URL
│   │       └── SettingsPanel.tsx    # API key, shortcuts ref
│   └── ui/
│       ├── ColorPicker.tsx
│       ├── GradientEditor.tsx
│       ├── SliderInput.tsx
│       ├── Toggle.tsx
│       ├── FontSelector.tsx
│       ├── Tooltip.tsx
│       ├── KeyboardShortcutsModal.tsx
│       ├── PresetCard.tsx
│       └── AiThemeInput.tsx
│
├── lib/
│   ├── map/
│   │   ├── style-builder.ts    # Builds MapLibre style JSON from config
│   │   ├── basemaps.ts         # Basemap tile source configs
│   │   ├── terrain.ts          # Elevation/hillshade setup
│   │   ├── export-png.ts       # PNG export via map.getCanvas()
│   │   ├── export-svg.ts       # SVG serialization
│   │   └── export-pdf.ts       # jsPDF + bleed marks
│   ├── geocoding.ts            # Nominatim search wrapper
│   ├── textures.ts             # SVG texture generators
│   ├── gpx.ts                  # GPX → GeoJSON parser
│   ├── share.ts                # URL config encode/decode (lz-string)
│   ├── ai-theme.ts             # Claude API theme generator
│   ├── shortcuts.ts            # Hotkey definitions
│   └── defaults.ts             # Default map config values
│
├── lib/themes/
│   ├── builtin/                # Official curated presets
│   │   ├── midnight-tokyo.ts
│   │   ├── sahara-dusk.ts
│   │   ├── arctic-blueprint.ts
│   │   └── soviet-ink.ts
│   └── community/              # Community-submitted presets (PR-based)
│       └── index.ts            # Auto-imports all community themes
│
├── store/
│   └── mapStore.ts             # Zustand + zundo (undo/redo) store
│
├── types/
│   └── map.ts                  # TypeScript interfaces for full config
│
├── public/
│   ├── textures/               # SVG/PNG texture assets
│   └── compass/                # Compass rose SVG variants (5+ styles)
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. State Management

Use **Zustand** + **`zundo`** middleware for global map configuration state with full undo/redo history.

```typescript
// types/map.ts — Core config shape
interface MapConfig {
  location: { lat: number; lng: number; zoom: number; label: string };
  basemap: 'vector' | 'satellite' | 'antique' | 'terrain';
  layers: LayerConfig[];
  overlays: Overlay[];          // Pin markers + text labels
  routes: Route[];              // Drawn routes + GPX imports
  cartography: {
    compass: boolean;
    compassStyle: 'minimal' | 'classic' | 'ornate' | 'nautical' | 'modern';
    compassPosition: 'tl' | 'tr' | 'bl' | 'br';
    scaleBar: boolean;
    scaleBarPosition: 'tl' | 'tr' | 'bl' | 'br';
    neighborhoodLabels: boolean;
  };
  frame: { style: string; color: string; thickness: number; texture: string };
  text: { city: string; subtitle: string; tagline: string; font: string; position: string };
  poster: {
    ratio: string;
    width: number;
    height: number;
    dpi: 72 | 150 | 300;
    bgColor: string;
    layout: 'single' | 'grid-2x2' | 'grid-3x3' | 'collage';
  };
}

// store/mapStore.ts
import { create } from 'zustand';
import { temporal } from 'zundo';

const useMapStore = create(
  temporal(
    (set) => ({
      config: defaultConfig,
      setConfig: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
    }),
    { limit: 50 }   // 50-step history
  )
);
// Access undo/redo via useMapStore.temporal.getState().undo() / .redo()
```

---

## 8. Free Data Sources

All data sources and libraries used are completely free with no API key required (except the optional AI feature which uses the user's own key).

| Feature | Source | Notes |
|---------|--------|-------|
| Map tiles (vector) | OpenFreeMap | No key, free forever |
| Map tiles (satellite) | ESRI World Imagery (public) | No key for basic use |
| Geocoding | Nominatim (OSM) | Free, no key needed |
| Terrain/DEM | OpenTopoData API | Free tier, no key |
| Fonts | Google Fonts | Free CDN |
| Map data | OpenStreetMap contributors | ODbL license |
| AI themes | Anthropic Claude API | User supplies their own key |

### NPM Dependencies Summary

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "typescript": "^5",
    "maplibre-gl": "^4",
    "zustand": "^4",
    "zundo": "^2",
    "lz-string": "^1.5",
    "@tmcw/togeojson": "^5",
    "jspdf": "^2",
    "react-hotkeys-hook": "^4",
    "lucide-react": "latest",
    "tailwindcss": "^3"
  }
}
```

All dependencies are MIT or Apache 2.0 licensed — fully open source compatible.

---

## 9. Deployment on Vercel

### Steps
1. Push code to GitHub (public or private repo)
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select the repo → Vercel auto-detects Next.js
4. Click Deploy — done. Live in ~60 seconds.

### Environment Variables Needed
None required for v1 (all APIs are keyless and called client-side).

### Vercel Free Tier Limits (as of 2025)
- **Bandwidth:** 100 GB/month (map tiles don't count — fetched by browser from OSM)
- **Deployments:** Unlimited
- **Custom domain:** Supported
- **Serverless functions:** 100k invocations/month (we use 0 in v1)

Terrainly will comfortably run within free tier limits even with thousands of users.

---

## 10. Build Order (Recommended)

Since everything ships in v1.0, build in this sequence to avoid rework:

| Phase | Focus | Key Deliverables |
|-------|-------|-----------------|
| **Phase 1** | Foundation | Next.js scaffold, Zustand store, MapLibre canvas rendering |
| **Phase 2** | Core map | Location search, basemap modes, layer styling, gradients |
| **Phase 3** | Overlays | Markers, route drawing, GPX import, neighborhood labels |
| **Phase 4** | Cartography | Compass rose (5 styles), scale bar, frame/texture system |
| **Phase 5** | Typography | Font selector, text positioning, label controls |
| **Phase 6** | Export | PNG, SVG, PDF with bleed marks |
| **Phase 7** | Power UX | Undo/redo, keyboard shortcuts, shareable URL |
| **Phase 8** | AI & Themes | Preset gallery, AI theme generator (BYOK) |
| **Phase 9** | Collage | Multi-map grid/collage layout editor |
| **Phase 10** | Mobile | Bottom drawer, touch gestures, responsive polish |
| **Phase 11** | Deploy | Vercel deployment, README, OSM attribution |

---

## 11. Licensing & Attribution

- **Code:** MIT License — anyone can fork, modify, deploy
- **Map data:** © OpenStreetMap contributors (ODbL) — attribution required in UI footer
- **Name "Terrainly":** You own this — no trademark restrictions.
- **Tile provider:** Credit OpenFreeMap and OSM in the app footer

---

*Document version: 2.0 — Full Scope | Terrainly personal project*
