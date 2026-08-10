// server/utils/r2.ts
import { getCloudflareEnv } from './cloudflare'

export function getR2Bucket(event: any) {
  return getCloudflareEnv(event).MEDIA_BUCKET;
}

export async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  file: File | Buffer,
  contentType: string
) {
  await bucket.put(key, file, {
    httpMetadata: { contentType },
  });
}

export async function getFromR2(bucket: R2Bucket, key: string) {
  return await bucket.get(key);
}

export async function deleteFromR2(bucket: R2Bucket, key: string) {
  await bucket.delete(key);
}
