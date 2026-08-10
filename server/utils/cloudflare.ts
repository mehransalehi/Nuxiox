// server/utils/cloudflare.ts
// Unified access to Cloudflare Workers bindings (env).
//
// Nitro stores bindings in different locations depending on the preset:
//   - cloudflare-module preset (production): event.context._platform.cloudflare.env
//   - cloudflare-pages preset (production):  event.context.cloudflare.env
//   - nitro-cloudflare-dev (local dev):       event.context.cloudflare.env
//   - global fallback:                        globalThis.__env__

/**
 * Get the Cloudflare Workers env object (bindings: DB, MEDIA_KV, MEDIA_BUCKET, etc.)
 * from the event context, regardless of the Nitro preset.
 */
export function getCloudflareEnv(event: any): Record<string, any> {
  return (
    event.context?.cloudflare?.env ??
    event.context?._platform?.cloudflare?.env ??
    (typeof globalThis.__env__ !== 'undefined' ? globalThis.__env__ : {}) ??
    {}
  )
}