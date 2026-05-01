/**
 * PNG Metadata Utility
 * Injects pHYs (Physical pixel dimensions) chunk into PNG blobs
 * to ensure 300 DPI recognition in print software.
 */

/**
 * Injects DPI metadata into a PNG Blob
 * @param blob - The source PNG Blob
 * @param dpi - Target DPI (default 300)
 * @returns {Promise<Blob>} - A new Blob with DPI metadata
 */
export async function injectPNGDPI(blob: Blob, dpi: number = 300): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Check if it's a PNG
  if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
    return blob; // Not a PNG
  }

  // Calculate pixels per meter
  // 1 inch = 0.0254 meters
  const ppm = Math.round(dpi / 0.0254);

  // Create pHYs chunk
  // Length: 9 bytes (4 bytes for X, 4 bytes for Y, 1 byte for unit)
  const physChunk = new Uint8Array(12 + 9); // 4 (length) + 4 (type) + 9 (data) + 4 (crc)
  
  const view = new DataView(physChunk.buffer);
  
  // 1. Length (9)
  view.setUint32(0, 9);
  
  // 2. Type "pHYs"
  physChunk[4] = 0x70; // p
  physChunk[5] = 0x48; // H
  physChunk[6] = 0x59; // Y
  physChunk[7] = 0x73; // s
  
  // 3. Data (PPM X, PPM Y, Unit)
  view.setUint32(8, ppm);
  view.setUint32(12, ppm);
  physChunk[16] = 1; // Unit: Meter
  
  // 4. CRC
  const crc = calculateCRC(physChunk.slice(4, 17));
  view.setUint32(17, crc);

  // Find where to insert (before IDAT chunk)
  let offset = 8; // Skip PNG signature
  while (offset < bytes.length) {
    const length = new DataView(bytes.buffer).getUint32(offset);
    const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
    
    if (type === 'IDAT' || type === 'IEND') {
      // Insert before IDAT
      const result = new Uint8Array(bytes.length + physChunk.length);
      result.set(bytes.slice(0, offset));
      result.set(physChunk, offset);
      result.set(bytes.slice(offset), offset + physChunk.length);
      return new Blob([result], { type: 'image/png' });
    }
    
    offset += 12 + length;
  }

  return blob;
}

/**
 * Standard CRC32 calculation for PNG chunks
 */
function calculateCRC(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  const table = getCRCTable();
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

let crcTable: Uint32Array | null = null;
function getCRCTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    crcTable[n] = c;
  }
  return crcTable;
}
