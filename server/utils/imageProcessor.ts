// server/utils/imageProcessor.ts
export async function processImage(file: File) {
  const buffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(buffer)

  let width: number | undefined
  let height: number | undefined

  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    const dims = getJPEGDimensions(uint8Array)
    width = dims.width
    height = dims.height
  } else if (file.type === 'image/png') {
    const dims = getPNGDimensions(uint8Array)
    width = dims.width
    height = dims.height
  } else if (file.type === 'image/webp') {
    const dims = getWebPDimensions(uint8Array)
    width = dims.width
    height = dims.height
  } else if (file.type === 'image/gif') {
    const dims = getGIFDimensions(uint8Array)
    width = dims.width
    height = dims.height
  }

  return { buffer: uint8Array, width, height }
}

function getJPEGDimensions(data: Uint8Array) {
  let offset = 2
  while (offset < data.length) {
    if (data[offset] !== 0xff) break
    const marker = data[offset + 1]
    if (marker === 0xc0 || marker === 0xc2) {
      const height = (data[offset + 5] << 8) | data[offset + 6]
      const width = (data[offset + 7] << 8) | data[offset + 8]
      return { width, height }
    }
    offset += 2 + ((data[offset + 2] << 8) | data[offset + 3])
  }
  return { width: undefined, height: undefined }
}

function getPNGDimensions(data: Uint8Array) {
  if (
    data[0] === 0x89 && data[1] === 0x50 &&
    data[2] === 0x4e && data[3] === 0x47
  ) {
    const width = (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19]
    const height = (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23]
    return { width, height }
  }
  return { width: undefined, height: undefined }
}

function getWebPDimensions(data: Uint8Array) {
  // WebP: file starts with "RIFF" + size + "WEBP"
  const riff =
    data[0] === 0x52 && data[1] === 0x49 &&
    data[2] === 0x46 && data[3] === 0x46
  const webp =
    data[8] === 0x57 && data[9] === 0x45 &&
    data[10] === 0x42 && data[11] === 0x50
  if (!riff || !webp) return { width: undefined, height: undefined }

  const vp8Sig = String.fromCharCode(data[12]) + String.fromCharCode(data[13]) + String.fromCharCode(data[14]) + String.fromCharCode(data[15])

  if (vp8Sig === 'VP8 ') {
    // Lossy VP8
    const w = ((data[27] << 8) | data[26]) & 0x3fff
    const h = ((data[29] << 8) | data[28]) & 0x3fff
    return { width: w, height: h }
  } else if (vp8Sig === 'VP8L') {
    // Lossless VP8L
    const bits =
      (data[21] << 24) | (data[20] << 16) | (data[19] << 8) | data[18]
    const w = (bits & 0x3fff) + 1
    const h = ((bits >> 14) & 0x3fff) + 1
    return { width: w, height: h }
  } else if (vp8Sig === 'VP8X') {
    // Extended VP8X
    const w = ((data[27] << 16) | (data[26] << 8) | data[24]) + 1
    const h = ((data[30] << 16) | (data[29] << 8) | data[28]) + 1
    return { width: w, height: h }
  }

  return { width: undefined, height: undefined }
}

function getGIFDimensions(data: Uint8Array) {
  if (
    data[0] === 0x47 && data[1] === 0x49 &&
    data[2] === 0x46
  ) {
    const width = (data[7] << 8) | data[6]
    const height = (data[9] << 8) | data[8]
    return { width, height }
  }
  return { width: undefined, height: undefined }
}
