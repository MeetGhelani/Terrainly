export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: string[];
}

export const searchLocation = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    if (!response.ok) throw new Error("Search failed");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
};
