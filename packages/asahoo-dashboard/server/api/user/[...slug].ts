import { users } from '~~/server/database/schema.gen'
import { eq } from 'drizzle-orm'
import { getCloudflareEnv } from '~~/server/utils/cloudflare'

/**
 * Call the bot worker, preferring the Cloudflare service binding when available.
 * Falls back to standard fetch for local dev and non-Cloudflare environments.
 */
async function callBot(path: string, options: { method: string; headers: Record<string, string>; body?: string }, event: any) {
  const cloudflareEnv = getCloudflareEnv(event)
  const botBinding = (cloudflareEnv as any).BOT as any

  if (botBinding) {
    // Service binding — works within the same Cloudflare account, avoids error 1042
    const url = new URL(path, 'https://internal')
    const request = new Request(url.toString(), options)
    return await botBinding.fetch(request)
  }

  // Fallback: direct HTTP fetch (local dev, custom servers, different accounts)
  return await fetch(path, options)
}

export default defineEventHandler(async (event) => {
  try {
    // 1. Get user session
    const session = await getUserSession(event)
    if (!session?.user?.id) {
      throw createError({ statusCode: 401, statusMessage: 'احراز هویت نشده‌اید' })
    }

    // 2. Look up user's bot credentials
    const db = useDb(event)
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    }) as any

    if (!user || !user.bot_url || !user.bot_token) {
      throw createError({ statusCode: 503, statusMessage: 'اعتبارنامه ربات پیکربندی نشده است. با مدیر تماس بگیرید.' })
    }

    const botUrl = user.bot_url.replace(/\/+$/, '')
    const botToken = user.bot_token

    // 3. Extract slug from route params — for [...slug] this captures everything after /api/user/
    const slug = getRouterParam(event, 'slug') || ''

    // Map dashboard API paths to bot API paths
    // The bot serves profile at /api/business/profile, not /api/profile
    const apiPath = slug === 'profile' ? 'business/profile' : slug

    // Forward query params
    const query = getQuery(event) as Record<string, string>
    const queryString = Object.keys(query).length > 0
      ? '?' + new URLSearchParams(query).toString()
      : ''

    const targetUrl = `${botUrl}/api/${apiPath}${queryString}`

    const method = event.method
    const headers: Record<string, string> = {
      'X-Admin-Key': botToken,
    }

    // Forward request body for mutating methods
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const body = await readBody(event)
      const response = await callBot(targetUrl, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      }, event)

      if (!response.ok) {
        const errorText = await response.text()
        throw createError({
          statusCode: 502,
          statusMessage: errorText || 'خطا از سمت ربات',
        })
      }

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        return await response.json()
      }
      return await response.text()
    }

    // GET, DELETE, and other methods — no body
    const response = await callBot(targetUrl, { method, headers }, event)

    if (!response.ok) {
      const errorText = await response.text()
      throw createError({
        statusCode: 502,
        statusMessage: errorText || 'خطا از سمت ربات',
      })
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return await response.json()
    }
    return await response.text()
  } catch (error: any) {
    // Pass through well-formed HTTP errors from createError
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'خطای داخلی سرور',
    })
  }
})