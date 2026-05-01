"use client";

import React from "react";

import { getCompassSVG, CompassStyle } from "@/lib/map/compass-assets";

interface CompassRoseProps {
  style: CompassStyle;
  color: string;
  size?: number | string;
}

export const CompassRose = ({ style, color, size = "100%" }: CompassRoseProps) => {
  const svg = getCompassSVG(style, color, size);
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};
