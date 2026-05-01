"use client";

import React from "react";

interface GridOverlayProps {
  enabled: boolean;
  color: string;
  opacity: number;
  spacing: number;
  thickness: number;
  dashArray: number[];
}

export const GridOverlay = ({ enabled, color, opacity, spacing, thickness, dashArray }: GridOverlayProps) => {
  if (!enabled) return null;

  // Robust check for solid line: no gap or single value
  const isSolid = !dashArray || dashArray.length < 2 || dashArray[1] === 0;
  const strokeDashArray = isSolid ? "" : dashArray.join(", ");

  // Create a base64 SVG for the grid pattern
  // We use two separate lines for a cleaner, non-jointed look
  const svg = `
    <svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0" x2="${spacing}" y2="0" stroke="${color}" stroke-width="${thickness}" ${isSolid ? "" : `stroke-dasharray="${strokeDashArray}"`} />
      <line x1="0" y1="0" x2="0" y2="${spacing}" stroke="${color}" stroke-width="${thickness}" ${isSolid ? "" : `stroke-dasharray="${strokeDashArray}"`} />
    </svg>
  `;
  
  const encoded = typeof window !== 'undefined' ? btoa(svg) : "";
  const background = encoded ? `url("data:image/svg+xml;base64,${encoded}")` : "none";

  return (
    <div 
      className="absolute pointer-events-none z-[15] overflow-hidden"
      style={{
        inset: `-${thickness}px`,
        backgroundImage: isSolid
          ? `linear-gradient(to right, ${color} ${thickness}px, transparent ${thickness}px), linear-gradient(to bottom, ${color} ${thickness}px, transparent ${thickness}px)`
          : background,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity: opacity,
        transition: "opacity 0.2s, background-size 0.2s"
      }}
    />
  );
};
