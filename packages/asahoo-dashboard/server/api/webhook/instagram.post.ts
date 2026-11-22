import { defineEventHandler, readRawBody, getHeader } from 'h3'
import { eq } from 'drizzle-orm'
import { userData } from '~~/server/database/schema.gen'
import { getCloudflareEnv } from '~~/server/utils/cloudflare'

// ── In-memory dedup set (events come infrequently, no expiry needed) ──
const seenEventIds = new Set<string>()

// ── Constant-time string comparison ──────────────────────────────────
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// ── HMAC-SHA256 via Web Crypto API (Cloudflare Workers / Node 20+) ──
async function computeHmacHex(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export default defineEventHandler(async (event) => {
  try {
    // ── 1. Read raw body for HMAC verification ────────────────────────
    const rawBody = await readRawBody(event)
    if (!rawBody) {
      console.warn('[webhook/instagram] Empty body received')
      return { status: 'ok' }
    }
    const body = JSON.parse(rawBody)

    const {
      event_id,
      event_type,
      account_id,
    } = body as {
      event_id: string
      event_type: 'messaging' | 'comments' | 'mentions'
      account_id: string | null
      data?: any
    }

    // ── 2. HMAC verification ──────────────────────────────────────────
    const cloudflareEnv = getCloudflareEnv(event)
    const webhookSecret = (cloudflareEnv as any).BOXAPI_WEBHOOK_SECRET || process.env.BOXAPI_WEBHOOK_SECRET

    if (webhookSecret) {
      const signature = getHeader(event, 'X-BoxApi-Signature') || ''
      const timestamp = getHeader(event, 'X-BoxApi-Timestamp') || ''
      const now = Math.floor(Date.now() / 1000)

      // Reject timestamps older than 300 seconds
      if (!timestamp || Math.abs(now - parseInt(timestamp, 10)) > 300) {
        console.warn('[webhook/instagram] Rejected — timestamp out of range', { timestamp, now })
        return { status: 'ok' }
      }

      const expectedSig = await computeHmacHex(`${timestamp}.${rawBody}`, webhookSecret)
      const receivedSig = signature.replace(/^sha256=/, '')

      if (!timingSafeEqual(expectedSig, receivedSig)) {
        console.warn('[webhook/instagram] Rejected — invalid HMAC signature')
        return { status: 'ok' }
      }
    } else {
      console.warn('[webhook/instagram] BOXAPI_WEBHOOK_SECRET not configured — skipping HMAC verification')
    }

    // ── 3. Deduplication ──────────────────────────────────────────────
    if (event_id && seenEventIds.has(event_id)) {
      console.log('[webhook/instagram] Duplicate event — skipping', { event_id })
      return { status: 'ok' }
    }
    if (event_id) {
      seenEventIds.add(event_id)
    }

    // ── 4. Comment events — infrastructure-only for now ───────────────
    if (event_type === 'comments') {
      console.log('[webhook/instagram] Comment event received — infrastructure only, ignoring', { event_id })
      return { status: 'ok' }
    }

    // ── 5. Look up user by instagram_account_id in user_data ──────────
    if (!account_id) {
      console.warn('[webhook/instagram] Missing account_id in event', { event_id })
      return { status: 'ok' }
    }

    const db = useDb(event)
    const [config] = await db
      .select({
        bot_url: userData.bot_url,
        bot_token: userData.bot_token,
      })
      .from(userData)
      .where(eq(userData.instagram_account_id, account_id))
      .limit(1)

    if (!config?.bot_url || !config?.bot_token) {
      console.warn('[webhook/instagram] Bot not configured for account', { account_id, event_id })
      return { status: 'ok' }
    }

    // ── 6. Forward to bot worker ──────────────────────────────────────
    const botUrl = config.bot_url.replace(/\/+$/, '')
    const targetUrl = `${botUrl}/api/instagram/webhook`

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': config.bot_token,
      },
      body: rawBody,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[webhook/instagram] Bot returned error', {
        status: response.status,
        error: errorText,
        account_id,
        event_id,
      })
    } else {
      console.log('[webhook/instagram] Forwarded to bot successfully', {
        account_id,
        event_id,
        botUrl: targetUrl,
      })
    }

    // ── 7. Always return 200 to BoxAPI ────────────────────────────────
    return { status: 'ok' }
  } catch (error: any) {
    console.error('[webhook/instagram] Unexpected error', {
      error: error?.message || error,
    })
    return { status: 'ok' }
  }
})