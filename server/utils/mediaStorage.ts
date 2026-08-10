// server/utils/mediaStorage.ts
// Unified media storage — uses filesystem (Node.js) or KV (Cloudflare)
import { promises as fs } from 'fs'
import * as path from 'path'
import { getCloudflareEnv } from './cloudflare'

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads')

function isCloudflare(event: any): boolean {
  return typeof getCloudflareEnv(event).MEDIA_KV !== 'undefined'
}

function getKV(event: any): any {
  return getCloudflareEnv(event).MEDIA_KV
}

/**
 * Upload a file — filesystem on Node.js, KV on Cloudflare.
 */
export async function uploadFile(
  event: any,
  filePath: string,
  buffer: Uint8Array,
  mimeType: string,
): Promise<void> {
  if (isCloudflare(event)) {
    await getKV(event).put(filePath, buffer, {
      metadata: { contentType: mimeType },
    })
  } else {
    const fullPath = path.join(UPLOADS_DIR, filePath)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, buffer)
  }
}

/**
 * Get a file's body for streaming back.
 * Returns ReadableStream on Cloudflare, Buffer on Node.js.
 */
export async function getFile(
  event: any,
  filePath: string,
): Promise<{ body: ReadableStream | Buffer; mimeType: string } | null> {
  if (isCloudflare(event)) {
    const object = await getKV(event).getWithMetadata(filePath, { type: 'stream' })
    if (!object.value) return null
    return {
      body: object.value,
      mimeType: object.metadata?.contentType ?? 'application/octet-stream',
    }
  } else {
    const fullPath = path.join(UPLOADS_DIR, filePath)
    try {
      const data = await fs.readFile(fullPath)
      return { body: data, mimeType: 'application/octet-stream' }
    } catch {
      return null
    }
  }
}

/**
 * Delete a file.
 */
export async function deleteFile(event: any, filePath: string): Promise<void> {
  if (isCloudflare(event)) {
    await getKV(event).delete(filePath)
  } else {
    const fullPath = path.join(UPLOADS_DIR, filePath)
    try {
      await fs.unlink(fullPath)
    } catch {
      // File already gone — noop
    }
  }
}
