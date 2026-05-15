# <img src="/public/logos/logo.png" width="32" height="32" valign="middle" /> Terrainly — Premium Cartographic Poster Studio

Terrainly is a professional-grade creative suite designed for generating high-fidelity map art, cinematic posters, and high-resolution wallpapers from any location on Earth. Combining advanced 3D terrain data with a minimalist design aesthetic, it allows users to transform geographical data into stunning physical or digital art.

# Desktop Preview
![Terrainly Homepage Preview](/public/homepage.png)

# Mobile Preview
<img src="/public/mobile-preview.png" width="300" alt="Terrainly Mobile Preview" />



## 🚀 Key Features

*   **Global 3D Terrain Engine**: Real-time 3D elevation rendering allowing you to tilt, rotate, and explore mountains and valleys in high detail.
*   **Aesthetic Texture Blending**: Premium tactile overlays including **Crumpled Paper**, Parchment, and Linen styles. Uses advanced `overlay` blending for realistic, high-fidelity map art.
*   **Session Persistence & Auto-Save**: Never lose a design. Your creative progress is automatically synced to local storage, allowing you to pick up exactly where you left off.
*   **Custom Marker Gallery**: Upload your own **SVG, PNG, or JPG** icons to create truly unique map markers. Features a persistent "Your Uploads" gallery for easy reuse.
*   **Artistic Typography System**: A curated collection of premium fonts (Playfair, Lora, Outfit, etc.) designed for editorial-grade poster layouts.
*   **Dynamic Layer Management**: Granular control over map elements including landcover, buildings, water, and road visibility.
*   **Precision Coordinate Grids**: Customizable technical overlays with adjustable spacing, thickness, and color.
*   **High-Resolution Export**: Export your compositions as pixel-perfect PNGs optimized for print or social media (Instagram, A3, 24x36, etc.).
*   **1:1 Visual Fidelity**: Our synchronized rendering pipeline ensures that your final high-resolution export perfectly matches the studio design, including all textures and overlays.
*   **Fully Responsive Mobile Studio**: A touch-optimized mobile experience with a horizontal tabbed navigation, allowing for full artistic control directly on your smartphone.
*   **Power-User Shortcuts**: Professional-grade keyboard controls (`Ctrl+Z`, `Ctrl+Y`, `Ctrl+S`, `ESC`) for a lightning-fast workflow.


## 🛠 How to Use

![Terrainly Help Guide Preview](/public/help-guide.png)

1.  **Find Your Muse**: Use the global search bar to navigate to any city, mountain range, or landmark.
2.  **Shape the View**: Use right-click and drag to tilt the map into 3D mode. Adjust the "Map Details" slider to control the coverage radius.
3.  **Customize Style**:
    *   **Theme**: Choose from curated color palettes (Midnight, Blueprint, Satellite, etc.).
    *   **Typography**: Edit the city name, country, and coordinates to match your design.
    *   **Layers**: Toggle the coordinate grid, compass rose, and map features to refine the composition.
4.  **Export & Print**: Open the Export panel, choose your target size (Portrait, Landscape, or Social), and download your high-resolution artwork.

## 💻 Tech Stack

*   **Frontend**: Next.js 15, React, TypeScript
*   **Styling**: Tailwind CSS
*   **Map Engine**: MapLibre GL JS + Custom 3D Terrain Layer
*   **State Management**: Zustand with Zundo (Undo/Redo support)
*   **Icons**: Lucide React
*   **Geocoding**: OpenStreetMap (Nominatim)

## 🏁 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start creating.

---

**Terrainly** — *Your terrain. Your art.*
