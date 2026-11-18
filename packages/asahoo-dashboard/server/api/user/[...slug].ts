import { settings } from '~~/server/database/schema.gen'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const db = useDb(event)

    // Read bot_config from settings
    const rows = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'bot_config'))

    if (!rows.length) {
      throw createError({ statusCode: 503, statusMessage: 'Bot not configured' })
    }

    const botConfig = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value

    if (!botConfig.url || !botConfig.token) {
      throw createError({ statusCode: 503, statusMessage: 'Bot not configured' })
    }

    // Extract slug from route params — for [...slug] this captures everything after /api/user/
    const slug = getRouterParam(event, 'slug') || ''

    // Forward query params
    const query = getQuery(event) as Record<string, string>
    const queryString = Object.keys(query).length > 0
      ? '?' + new URLSearchParams(query).toString()
      : ''

    const targetUrl = `${botConfig.url}/api/${slug}${queryString}`

    const method = event.method
    const headers: Record<string, string> = {
      'X-Admin-Key': botConfig.token,
    }

    // Forward request body for mutating methods
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const body = await readBody(event)
      const response = await fetch(targetUrl, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw createError({
          statusCode: 502,
          statusMessage: errorText || 'Bot returned an error',
        })
      }

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        return await response.json()
      }
      return await response.text()
    }

    // GET, DELETE, and other methods — no body
    const response = await fetch(targetUrl, { method, headers })

    if (!response.ok) {
      const errorText = await response.text()
      throw createError({
        statusCode: 502,
        statusMessage: errorText || 'Bot returned an error',
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
      statusMessage: error.message || 'Internal server error',
    })
  }
})