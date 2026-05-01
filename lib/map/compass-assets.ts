export type CompassStyle = "minimal" | "classic" | "modern" | "ornate" | "nautical";

export const getCompassSVG = (style: CompassStyle, color: string, size: string | number) => {
  const s = size;
  switch (style) {
    case "minimal":
      return `<svg width="${s}" height="${s}" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,4 37,28 30,24 23,28" fill="${color}" opacity="1" />
        <polygon points="30,56 37,32 30,36 23,32" fill="${color}" opacity="0.35" />
        <circle cx="30" cy="30" r="3" fill="${color}" />
        <text x="30" y="3" text-anchor="middle" font-size="8" font-weight="700" font-family="monospace" fill="${color}" dy="-1">N</text>
      </svg>`;
    case "classic":
      return `<svg width="${s}" height="${s}" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="40,6 46,36 40,30 34,36" fill="${color}" />
        <polygon points="40,6 34,36 40,30 46,36" fill="${color}" opacity="0.45" />
        <polygon points="40,74 46,44 40,50 34,44" fill="${color}" opacity="0.45" />
        <polygon points="40,74 34,44 40,50 46,44" fill="${color}" />
        <polygon points="74,40 44,46 50,40 44,34" fill="${color}" opacity="0.45" />
        <polygon points="74,40 44,34 50,40 44,46" fill="${color}" />
        <polygon points="6,40 36,46 30,40 36,34" fill="${color}" />
        <polygon points="6,40 36,34 30,40 36,46" fill="${color}" opacity="0.45" />
        <circle cx="40" cy="40" r="5" fill="${color}" />
        <text x="40" y="5" text-anchor="middle" font-size="9" font-weight="800" font-family="Georgia, serif" fill="${color}">N</text>
        <text x="40" y="79" text-anchor="middle" font-size="9" font-family="Georgia, serif" fill="${color}" opacity="0.6">S</text>
        <text x="77" y="43" text-anchor="middle" font-size="9" font-family="Georgia, serif" fill="${color}" opacity="0.6">E</text>
        <text x="4" y="43" text-anchor="middle" font-size="9" font-family="Georgia, serif" fill="${color}" opacity="0.6">W</text>
      </svg>`;
    case "modern":
      return `<svg width="${s}" height="${s}" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" stroke="${color}" stroke-width="0.75" opacity="0.25" />
        <polygon points="40,6 44,36 40,32 36,36" fill="${color}" />
        <polygon points="40,74 44,44 40,48 36,44" fill="${color}" opacity="0.3" />
        <line x1="40" y1="26" x2="40" y2="54" stroke="${color}" stroke-width="0.5" opacity="0.2" />
        <line x1="26" y1="40" x2="54" y2="40" stroke="${color}" stroke-width="0.5" opacity="0.2" />
        <circle cx="40" cy="40" r="3.5" fill="${color}" />
        <text x="40" y="4" text-anchor="middle" font-size="8" font-weight="700" letter-spacing="2" font-family="monospace" fill="${color}">N</text>
      </svg>`;
    case "ornate":
      return `<svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" stroke="${color}" stroke-width="1" opacity="0.2" />
        <circle cx="50" cy="50" r="42" stroke="${color}" stroke-width="0.5" opacity="0.15" />
        <polygon points="50,6 55,38 50,32 45,38" fill="${color}" />
        <polygon points="50,94 55,62 50,68 45,62" fill="${color}" opacity="0.55" />
        <polygon points="94,50 62,55 68,50 62,45" fill="${color}" opacity="0.55" />
        <polygon points="6,50 38,55 32,50 38,45" fill="${color}" opacity="0.55" />
        <circle cx="50" cy="50" r="10" stroke="${color}" stroke-width="1" opacity="0.4" fill="none" />
        <circle cx="50" cy="50" r="5" fill="${color}" opacity="0.8" />
        <text x="50" y="5" text-anchor="middle" font-size="9" font-weight="800" font-family="Georgia, serif" fill="${color}">N</text>
        <text x="50" y="99" text-anchor="middle" font-size="8" font-family="Georgia, serif" fill="${color}" opacity="0.5">S</text>
        <text x="97" y="53" text-anchor="middle" font-size="8" font-family="Georgia, serif" fill="${color}" opacity="0.5">E</text>
        <text x="4" y="53" text-anchor="middle" font-size="8" font-family="Georgia, serif" fill="${color}" opacity="0.5">W</text>
      </svg>`;
    case "nautical":
      return `<svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="2.5" opacity="0.5" fill="none" />
        <polygon points="50,8 54,42 50,38 46,42" fill="${color}" />
        <polygon points="50,92 54,58 50,62 46,58" fill="${color}" opacity="0.3" />
        <circle cx="50" cy="50" r="10" stroke="${color}" stroke-width="1.5" opacity="0.5" fill="none" />
        <circle cx="50" cy="50" r="5.5" fill="${color}" />
        <text x="50" y="6" text-anchor="middle" font-size="9" font-weight="800" font-family="Georgia, serif" fill="${color}">N</text>
      </svg>`;
    default:
      return `<svg width="${s}" height="${s}" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,4 37,28 30,24 23,28" fill="${color}" />
        <circle cx="30" cy="30" r="3" fill="${color}" />
      </svg>`;
  }
};
