/**
 * Shared Layout Ratios
 * These constants ensure the UI and Export Engine are perfectly synchronized.
 * Values are expressed as ratios (0 to 1) relative to the poster dimensions.
 */

export const LAYOUT_RATIOS = {
  // Edge Padding (Distance from the nearest boundary)
  PADDING_X: 0.05,
  PADDING_Y: 0.05,

  // Compass Rose
  // Size and Offset are relative to the shorter dimension (min(width, height))
  COMPASS_SIZE_RATIO: 0.075,
  COMPASS_OFFSET_RATIO: 0.04,

  // Typography (Relative to total height)
  // These ratios help maintain the "visual weight" across formats
  FONT_SIZE_CITY_RATIO: 0.045, // approx 4.5% of height
  FONT_SIZE_SUBTITLE_RATIO: 0.35, // multiplier of city font size
  FONT_SIZE_TAGLINE_RATIO: 0.25,  // multiplier of city font size
  
  TYPO_GAP_SUBTITLE: 0.012, // Gap between City and Subtitle
  TYPO_GAP_TAGLINE: 0.008,  // Gap between Subtitle and Tagline
  
  TRACKING_CITY: 0.35,
  TRACKING_SUBTITLE: 0.25,
  TRACKING_TAGLINE: 0.15,
};

/**
 * Calculates a non-linear scaling factor for typography.
 * Ensures text doesn't get too small on mobile or too giant on print.
 */
export function getDimScale(width: number, height: number): number {
  const reference = 3600; // Reference high-res dimension
  const minDim = Math.min(width, height);
  // Clamp scale to prevent extremes
  return Math.max(0.45, Math.min(minDim, height) / reference);
}
