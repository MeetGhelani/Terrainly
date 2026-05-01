export const BASEMAPS = {
  vector: {
    name: "Midnight Vector",
    url: "https://tiles.openfreemap.org/styles/liberty",
  },
  satellite: {
    name: "Satellite Hybrid",
    url: "https://tiles.openfreemap.org/styles/positron", // We will overlay satellite tiles on this
    satelliteUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  antique: {
    name: "Historical Antique",
    url: "https://tiles.openfreemap.org/styles/bright", // We will apply a sepia filter in style-builder
  },
  terrain: {
    name: "Terrain & Contours",
    url: "https://tiles.openfreemap.org/styles/liberty", // We will add hillshading sources
  },
};
