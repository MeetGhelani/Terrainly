import { ThemeColors, ThemePalette } from "@/types/map";

// Helper to convert hex to rgba with variable opacity
const hexToRGBA = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ─── Midnight Blue (Luxury) ──────────────────────────────────────────────────
const midnightBlue: ThemeColors = {
  land:             "#0A1628",
  landcover:        "#0D1B32",
  water:            "#061020",
  waterways:        "#081628",
  parks:            "#0F2235",
  buildings:        "#6E5A45",
  roads_major:      "#C99C37", // Bright Gold
  roads_minor_high: "#8A6820", // Muted Gold
  roads_minor_mid:  "#3D4E68", // Lighter Slate (Increased contrast)
  roads_minor_low:  "#2A3A52", // Medium Slate (Increased contrast)
  roads_path:       "#4D5E78", 
  road_outline:     "#08101E", 
  aeroway:          "#1E293B",
  rail:             "#FF7B00",
  text:             "#D6B352",
  overlay:          "#0A1628",
};

// ─── Noir (Minimalist) ───────────────────────────────────────────────────────
const noir: ThemeColors = {
  land:             "#000000",
  landcover:        "#050505",
  water:            "#0B0B0B",
  waterways:        "#121212",
  parks:            "#171717",
  buildings:        "#6F6F6F",
  roads_major:      "#FFFFFF", // Pure White
  roads_minor_high: "#A0A0A0", // Medium Grey
  roads_minor_mid:  "#4D4D4D", // Brighter Dark Grey
  roads_minor_low:  "#333333", // Brighter Deep Grey
  roads_path:       "#404040",
  road_outline:     "#000000",
  aeroway:          "#111111",
  rail:             "#00F5FF",
  text:             "#FFFFFF",
  overlay:          "#000000",
};

// ─── Neon (Cyberpunk) ────────────────────────────────────────────────────────
const neon: ThemeColors = {
  land:             "#0B0F1A",
  landcover:        "#131826",
  water:            "#001433",
  waterways:        "#001F4D",
  parks:            "#1A0B2A",
  buildings:        "#FF2D95",
  roads_major:      "#00F5FF", 
  roads_minor_high: "#FF00FF", 
  roads_minor_mid:  "#A050FF", // Brighter Purple
  roads_minor_low:  "#6000CC", // Brighter Deep Purple
  roads_path:       "#400088",
  road_outline:     "#0B0F1A",
  aeroway:          "#1A0B2A",
  rail:             "#39FF14",
  text:             "#00F5FF",
  overlay:          "#0B0F1A",
};

// ─── Japanese Ink (Artistic) ─────────────────────────────────────────────────
const japaneseInk: ThemeColors = {
  land:             "#FAF8F5",
  landcover:        "#F3F0E9",
  water:            "#E8E4E0",
  waterways:        "#DFDAD5",
  parks:            "#F0EDE8",
  buildings:        "#959595",
  roads_major:      "#8B2500", 
  roads_minor_high: "#333333", 
  roads_minor_mid:  "#888888", // Darker for light background
  roads_minor_low:  "#A0A0A0", // Darker for light background
  roads_path:       "#BCBAB6",
  road_outline:     "#FAF8F5",
  aeroway:          "#E8E4E0",
  rail:             "#2B4C7E",
  text:             "#2C2C2C",
  overlay:          "#FAF8F5",
};

// ─── Blueprint (Technical) ───────────────────────────────────────────────────
const blueprint: ThemeColors = {
  land:             "#1A3A5C",
  landcover:        "#234B75",
  water:            "#0E2740",
  waterways:        "#0A1D30",
  parks:            "#1F466F",
  buildings:        "#6EA4CC",
  roads_major:      "#FFFFFF", 
  roads_minor_high: "#D8EEFA", 
  roads_minor_mid:  "#8CBEE0", // Brighter Steel Blue
  roads_minor_low:  "#5A7DA1", // Brighter Muted Navy
  roads_path:       "#435F7D",
  road_outline:     "#1A3A5C",
  aeroway:          "#234B75",
  rail:             "#FFD700",
  text:             "#E8F4FF",
  overlay:          "#1A3A5C",
};

// ─── Old Navy (Premium) ──────────────────────────────────────────────────────
const oldNavy: ThemeColors = {
  land:             "#061327",
  landcover:        "#0A1E3B",
  water:            "#0B1E3B",
  waterways:        "#0F2240",
  parks:            "#0F2240",
  buildings:        "#2A3F5C",
  roads_major:      "#E2B85C", 
  roads_minor_high: "#8A6020", 
  roads_minor_mid:  "#5A6A82", // Brighter Cool Grey
  roads_minor_low:  "#404E66", // Brighter Dark Grey
  roads_path:       "#2A3445",
  road_outline:     "#061327",
  aeroway:          "#0A1E3B",
  rail:             "#FF4D00",
  text:             "#E2B85C",
  overlay:          "#061327",
};

// ─── Coral (Lifestyle) ───────────────────────────────────────────────────────
const coral: ThemeColors = {
  land:             "#F3E1DA",
  landcover:        "#EDD5CC",
  water:            "#DFC0B5",
  waterways:        "#D4B1A5",
  parks:            "#EACFC6",
  buildings:        "#E39B89",
  roads_major:      "#6E2F28", 
  roads_minor_high: "#B9473A", 
  roads_minor_mid:  "#C05040", // Darker Coral
  roads_minor_low:  "#D07A68", // Darker Coral Low
  roads_path:       "#E09888",
  road_outline:     "#F3E1DA",
  aeroway:          "#DFC0B5",
  rail:             "#1A5F7A",
  text:             "#6E2F28",
  overlay:          "#F3E1DA",
};

// ─── Terracotta (Warm) ───────────────────────────────────────────────────────
const terracotta: ThemeColors = {
  land:             "#F5EDE4",
  landcover:        "#EDE1D4",
  water:            "#A8C4C4",
  waterways:        "#97B6B6",
  parks:            "#E8E0D0",
  buildings:        "#D9A08A",
  roads_major:      "#8B4513", 
  roads_minor_high: "#A0522D", 
  roads_minor_mid:  "#B06040", // Darker Brown
  roads_minor_low:  "#C08A68", // Darker Tan
  roads_path:       "#DCA882",
  road_outline:     "#F5EDE4",
  aeroway:          "#A8C4C4",
  rail:             "#2F4F4F",
  text:             "#8B4513",
  overlay:          "#F5EDE4",
};

// ─── Sage (Nature) ───────────────────────────────────────────────────────────
const sage: ThemeColors = {
  land:             "#DDE8DD",
  landcover:        "#D1DFD1",
  water:            "#C5D4CB",
  waterways:        "#B8C7BE",
  parks:            "#D3DFD7",
  buildings:        "#8BAD9B",
  roads_major:      "#2D4739", 
  roads_minor_high: "#3F624F", 
  roads_minor_mid:  "#507060", // Darker Sage
  roads_minor_low:  "#709080", // Darker Sage Low
  roads_path:       "#92B4A2",
  road_outline:     "#DDE8DD",
  aeroway:          "#C5D4CB",
  rail:             "#7A3A23",
  text:             "#2D4739",
  overlay:          "#DDE8DD",
};

// ─── Heatwave (Burnt) ────────────────────────────────────────────────────────
const heatwave: ThemeColors = {
  land:             "#1C0E09",
  landcover:        "#2D1810",
  water:            "#2C140C",
  waterways:        "#3D1C11",
  parks:            "#381A10",
  buildings:        "#D2A55E",
  roads_major:      "#FF5F1F", 
  roads_minor_high: "#B04010", 
  roads_minor_mid:  "#805030", // Brighter Wood
  roads_minor_low:  "#604030", // Brighter Ash
  roads_path:       "#493623",
  road_outline:     "#1C0E09",
  aeroway:          "#2C140C",
  rail:             "#FFD700",
  text:             "#FFD78A",
  overlay:          "#1C0E09",
};

// ─── Ruby (Lush) ─────────────────────────────────────────────────────────────
const ruby: ThemeColors = {
  land:             "#1A070F",
  landcover:        "#2B0D18",
  water:            "#2A0D17",
  waterways:        "#3B1221",
  parks:            "#351021",
  buildings:        "#EE8EA4",
  roads_major:      "#C0103C", 
  roads_minor_high: "#780C2C", 
  roads_minor_mid:  "#603840", // Brighter Ruby
  roads_minor_low:  "#4D2D35", // Brighter Mauve
  roads_path:       "#392427",
  road_outline:     "#1A070F",
  aeroway:          "#2A0D17",
  rail:             "#FFD7BC",
  text:             "#F6D7BC",
  overlay:          "#1A070F",
};

// ─── Ocean (Coastal) ─────────────────────────────────────────────────────────
const ocean: ThemeColors = {
  land:             "#F0F8FA",
  landcover:        "#E6F2F5",
  water:            "#B8D8E8",
  waterways:        "#A6CCE0",
  parks:            "#D8EAE8",
  buildings:        "#67AED0",
  roads_major:      "#1A5F7A", 
  roads_minor_high: "#14536A", 
  roads_minor_mid:  "#206888", // Darker Ocean
  roads_minor_low:  "#4080A0", // Darker Sky
  roads_path:       "#7ABCD4",
  road_outline:     "#F0F8FA",
  aeroway:          "#B8D8E8",
  rail:             "#FF8C00",
  text:             "#1A5F7A",
  overlay:          "#F0F8FA",
};

// ─── Emerald City (Deep) ─────────────────────────────────────────────────────
const emeraldCity: ThemeColors = {
  land:             "#062C22",
  landcover:        "#0A3D2F",
  water:            "#0D4536",
  waterways:        "#115A46",
  parks:            "#0F523E",
  buildings:        "#1A785B",
  roads_major:      "#4ADEB0", 
  roads_minor_high: "#18A070", 
  roads_minor_mid:  "#407060", // Brighter Green
  roads_minor_low:  "#2D5545", // Brighter Moss
  roads_path:       "#25493F",
  road_outline:     "#062C22",
  aeroway:          "#0D4536",
  rail:             "#FF2D95",
  text:             "#E3F9F1",
  overlay:          "#062C22",
};

// ─── Forest (Evergreen) ──────────────────────────────────────────────────────
const forest: ThemeColors = {
  land:             "#F0F4F0",
  landcover:        "#E6EDE6",
  water:            "#B8D4D4",
  waterways:        "#A6C4C4",
  parks:            "#D4E8D4",
  buildings:        "#8AB19A",
  roads_major:      "#2D4A3E", 
  roads_minor_high: "#3A5E4D", 
  roads_minor_mid:  "#507060", // Darker Evergreen
  roads_minor_low:  "#709080", // Darker Leaf
  roads_path:       "#90B4A0",
  road_outline:     "#F0F4F0",
  aeroway:          "#B8D4D4",
  rail:             "#8B4513",
  text:             "#2D4A3E",
  overlay:          "#F0F4F0",
};

// ─── Sunset (Dreamy) ─────────────────────────────────────────────────────────
const sunset: ThemeColors = {
  land:             "#FDF5F0",
  landcover:        "#F9EBE2",
  water:            "#EDD0C4",
  waterways:        "#E2C1B4",
  parks:            "#F8E8E2",
  buildings:        "#EAA898",
  roads_major:      "#C45C3E", 
  roads_minor_high: "#B84830", 
  roads_minor_mid:  "#A05040", // Darker Red
  roads_minor_low:  "#B87060", // Darker Salmon
  roads_path:       "#D87058",
  road_outline:     "#FDF5F0",
  aeroway:          "#EDD0C4",
  rail:             "#4B0082",
  text:             "#C45C3E",
  overlay:          "#FDF5F0",
};

// ─── Autumn (Premium) ────────────────────────────────────────────────────────
const autumn: ThemeColors = {
  land:             "#FBF7F0",
  landcover:        "#F3EEE2",
  water:            "#D4C8B4",
  waterways:        "#C7BAA3",
  parks:            "#EDE6D8",
  buildings:        "#C8943C",
  roads_major:      "#8B4513", 
  roads_minor_high: "#8B2500", 
  roads_minor_mid:  "#804020", // Darker Brown
  roads_minor_low:  "#A06030", // Darker Orange
  roads_path:  "#B85820",
  road_outline:     "#FBF7F0",
  aeroway:          "#D4C8B4",
  rail:             "#2D4739",
  text:             "#8B4513",
  overlay:          "#FBF7F0",
};

// ─── Monochrome Blue (Premium) ───────────────────────────────────────────────
const monochromeBlue: ThemeColors = {
  land:             "#F5F8FA",
  landcover:        "#EDF2F5",
  water:            "#C8DCF0",
  waterways:        "#B6CFE6",
  parks:            "#DDE8F2",
  buildings:        "#8EB0CC",
  roads_major:      "#1A3A5C", 
  roads_minor_high: "#1A3D6C", 
  roads_minor_mid:  "#305880", // Darker Blue
  roads_minor_low:  "#5078A0", // Darker Sky Blue
  roads_path:       "#8AB8D4",
  road_outline:     "#F5F8FA",
  aeroway:          "#C8DCF0",
  rail:             "#FFD700",
  text:             "#1A3A5C",
  overlay:          "#F5F8FA",
};

// ─── Copper (Metallic) ───────────────────────────────────────────────────────
const copper: ThemeColors = {
  land:             "#E1D2C6",
  landcover:        "#D4C2AE",
  water:            "#CBB5A1",
  waterways:        "#BC9F86",
  parks:            "#D8C6B5",
  buildings:        "#C88B72",
  roads_major:      "#4E2F22", 
  roads_minor_high: "#7C452E", 
  roads_minor_mid:  "#6D3D2A", // Darker Bronze
  roads_minor_low:  "#8D4F36", // Darker Copper
  roads_path:       "#9E5A3C",
  road_outline:     "#E1D2C6",
  aeroway:          "#CBB5A1",
  rail:             "#1A5F7A",
  text:             "#4E2F22",
  overlay:          "#E1D2C6",
};

// ─── Rustic (Earthy) ─────────────────────────────────────────────────────────
const rustic: ThemeColors = {
  land:             "#DFD5C8",
  landcover:        "#D2C6B7",
  water:            "#C4B8A8",
  waterways:        "#B6A996",
  parks:            "#D2C6B7",
  buildings:        "#9E7A62",
  roads_major:      "#44362C", 
  roads_minor_high: "#563A2A", 
  roads_minor_mid:  "#4D3628", // Darker Oak
  roads_minor_low:  "#6D4E39", // Darker Earth
  roads_path:       "#7A5040",
  road_outline:     "#DFD5C8",
  aeroway:          "#C4B8A8",
  rail:             "#2D4739",
  text:             "#44362C",
  overlay:          "#DFD5C8",
};

// ─── Pastel Dream (Soft) ─────────────────────────────────────────────────────
const pastelDream: ThemeColors = {
  land:             "#FAF7F2",
  landcover:        "#F3EDE4",
  water:            "#D4E4ED",
  waterways:        "#C1D9E6",
  parks:            "#E8EDE4",
  buildings:        "#CEC3CB",
  roads_major:      "#5D5A6D", 
  roads_minor_high: "#6870A0", 
  roads_minor_mid:  "#555060", // Darker Purple
  roads_minor_low:  "#706880", // Darker Indigo
  roads_path:       "#9898B8",
  road_outline:     "#FAF7F2",
  aeroway:          "#D4E4ED",
  rail:             "#FFB6C1",
  text:             "#5D5A6D",
  overlay:          "#FAF7F2",
};

// ─── Exported Palette List ───────────────────────────────────────────────────
export const THEMES: ThemePalette[] = [
  { id: "midnight-blue", name: "Midnight Blue", description: "Deep navy with gold accents", isDark: true, colors: midnightBlue, swatchColors: ["#0A1628", "#C99C37", "#061020", "#6E5A45", "#0F2235"] },
  { id: "noir", name: "Noir", description: "Pure ink-on-paper minimalism", isDark: true, colors: noir, swatchColors: ["#000000", "#FFFFFF", "#0B0B0B", "#6F6F6F", "#171717"] },
  { id: "neon", name: "Neon", description: "Cyberpunk neon highlights", isDark: true, colors: neon, swatchColors: ["#0B0F1A", "#00F5FF", "#001433", "#FF2D95", "#1A0B2A"] },
  { id: "japanese-ink", name: "Japanese Ink", description: "Traditional artistic style", isDark: false, colors: japaneseInk, swatchColors: ["#FAF8F5", "#8B2500", "#E8E4E0", "#959595", "#F0EDE8"] },
  { id: "blueprint", name: "Blueprint", description: "Technical schematic feel", isDark: true, colors: blueprint, swatchColors: ["#1A3A5C", "#FFFFFF", "#0E2740", "#6EA4CC", "#1F466F"] },
  { id: "old-navy", name: "Old Navy", description: "Deep navy with premium gold", isDark: true, colors: oldNavy, swatchColors: ["#061327", "#E2B85C", "#0B1E3B", "#2A3F5C", "#0F2240"] },
  { id: "coral", name: "Coral", description: "Soft lifestyle palette", isDark: false, colors: coral, swatchColors: ["#F3E1DA", "#6E2F28", "#DFC0B5", "#E39B89", "#EACFC6"] },
  { id: "terracotta", name: "Terracotta", description: "Warm earthy tones", isDark: false, colors: terracotta, swatchColors: ["#F5EDE4", "#8B4513", "#A8C4C4", "#D9A08A", "#E8E0D0"] },
  { id: "sage", name: "Sage", description: "Calming botanical greens", isDark: false, colors: sage, swatchColors: ["#DDE8DD", "#2D4739", "#C5D4CB", "#8BAD9B", "#D3DFD7"] },
  { id: "heatwave", name: "Heatwave", description: "Burnt umber and flame orange", isDark: true, colors: heatwave, swatchColors: ["#1C0E09", "#FF5F1F", "#2C140C", "#D2A55E", "#381A10"] },
  { id: "ruby", name: "Ruby", description: "Lush plum and ruby red", isDark: true, colors: ruby, swatchColors: ["#1A070F", "#C0103C", "#2A0D17", "#EE8EA4", "#351021"] },
  { id: "ocean", name: "Ocean", description: "Bright coastal palette", isDark: false, colors: ocean, swatchColors: ["#F0F8FA", "#1A5F7A", "#B8D8E8", "#67AED0", "#D8EAE8"] },
  { id: "emerald-city", name: "Emerald City", description: "Deep jewel-toned greens", isDark: true, colors: emeraldCity, swatchColors: ["#062C22", "#4ADEB0", "#0D4536", "#1A785B", "#0F523E"] },
  { id: "forest", name: "Forest", description: "Evergreen and sage mist", isDark: false, colors: forest, swatchColors: ["#F0F4F0", "#2D4A3E", "#B8D4D4", "#8AB19A", "#D4E8D4"] },
  { id: "sunset", name: "Sunset", description: "Dreamy horizon tones", isDark: false, colors: sunset, swatchColors: ["#FDF5F0", "#C45C3E", "#EDD0C4", "#EAA898", "#F8E8E2"] },
  { id: "autumn", name: "Autumn", description: "Rich harvest harvest colors", isDark: false, colors: autumn, swatchColors: ["#FBF7F0", "#8B4513", "#D4C8B4", "#C8943C", "#EDE6D8"] },
  { id: "monochrome-blue", name: "Monochrome Blue", description: "Sleek navy technical style", isDark: false, colors: monochromeBlue, swatchColors: ["#F5F8FA", "#1A3A5C", "#C8DCF0", "#8EB0CC", "#DDE8F2"] },
  { id: "copper", name: "Copper", description: "Metallic copper and earthy tones", isDark: false, colors: copper, swatchColors: ["#E1D2C6", "#4E2F22", "#CBB5A1", "#C88B72", "#D8C6B5"] },
  { id: "rustic", name: "Rustic", description: "Aged parchment and wood tones", isDark: false, colors: rustic, swatchColors: ["#DFD5C8", "#44362C", "#C4B8A8", "#9E7A62", "#D2C6B7"] },
  { id: "pastel-dream", name: "Pastel Dream", description: "Soft mauve and indigo tones", isDark: false, colors: pastelDream, swatchColors: ["#FAF7F2", "#5D5A6D", "#D4E4ED", "#CEC3CB", "#E8EDE4"] },
];

export const DEFAULT_THEME = THEMES[0];

export { hexToRGBA };
