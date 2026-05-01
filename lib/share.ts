import LZString from "lz-string";
import { MapConfig } from "@/types/map";

export const serializeConfig = (config: MapConfig): string => {
  try {
    const json = JSON.stringify(config);
    return LZString.compressToEncodedURIComponent(json);
  } catch (error) {
    console.error("Serialization error:", error);
    return "";
  }
};

export const deserializeConfig = (hash: string): MapConfig | null => {
  try {
    const compressed = hash.replace("#config=", "");
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.error("Deserialization error:", error);
    return null;
  }
};

export const getShareUrl = (config: MapConfig): string => {
  const serialized = serializeConfig(config);
  const url = new URL(window.location.href);
  url.hash = `config=${serialized}`;
  return url.toString();
};
