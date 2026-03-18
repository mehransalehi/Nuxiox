// server/utils/imageProcessor.ts
export async function processImage(file: File) {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  
  // Get dimensions (basic implementation)
  let width: number | undefined;
  let height: number | undefined;
  
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    const dimensions = getJPEGDimensions(uint8Array);
    width = dimensions.width;
    height = dimensions.height;
  } else if (file.type === 'image/png') {
    const dimensions = getPNGDimensions(uint8Array);
    width = dimensions.width;
    height = dimensions.height;
  }
  
  return { buffer: uint8Array, width, height };
}

function getJPEGDimensions(data: Uint8Array) {
  let offset = 2;
  while (offset < data.length) {
    if (data[offset] !== 0xFF) break;
    const marker = data[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      const height = (data[offset + 5] << 8) | data[offset + 6];
      const width = (data[offset + 7] << 8) | data[offset + 8];
      return { width, height };
    }
    offset += 2 + ((data[offset + 2] << 8) | data[offset + 3]);
  }
  return { width: undefined, height: undefined };
}

function getPNGDimensions(data: Uint8Array) {
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
    const width = (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19];
    const height = (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23];
    return { width, height };
  }
  return { width: undefined, height: undefined };
}
