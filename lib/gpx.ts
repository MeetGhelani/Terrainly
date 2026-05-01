import { gpx } from "@tmcw/togeojson";
import { Route } from "@/types/map";

export const parseGPX = (xmlString: string): Route[] => {
  try {
    const dom = new DOMParser().parseFromString(xmlString, "text/xml");
    const geojson = gpx(dom);
    
    const routes: Route[] = [];

    geojson.features.forEach((feature: any) => {
      if (feature.geometry.type === "LineString") {
        routes.push({
          id: crypto.randomUUID(),
          name: feature.properties?.name || "Imported Route",
          points: feature.geometry.coordinates as [number, number][],
          color: "#4f8ef7",
          width: 3,
          opacity: 0.8,
        });
      } else if (feature.geometry.type === "MultiLineString") {
        feature.geometry.coordinates.forEach((coords: [number, number][], idx: number) => {
          routes.push({
            id: crypto.randomUUID(),
            name: `${feature.properties?.name || "Imported Route"} (Part ${idx + 1})`,
            points: coords,
            color: "#4f8ef7",
            width: 3,
            opacity: 0.8,
          });
        });
      }
    });

    return routes;
  } catch (error) {
    console.error("GPX parsing error:", error);
    return [];
  }
};
