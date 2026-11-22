import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const userId = query.user_id

  if (!userId) {
    throw createError({ statusCode: 400, message: 'user_id is required' })
  }

  // Get BoxAPI API key from Cloudflare env or process env
  const cloudflareEnv = getCloudflareEnv(event)
  const boxApiKey = (cloudflareEnv as any).BOXAPI_API_KEY || process.env.BOXAPI_API_KEY

  if (!boxApiKey) {
    throw createError({ statusCode: 500, message: 'BOXAPI_API_KEY not configured' })
  }

  try {
    const response = await fetch('https://api.sendbox.chat/api/v1/service/info', {
      headers: {
        'X-Api-Key': boxApiKey,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[instagram/auth-url] BoxAPI returned error', {
        status: response.status,
        body: errorText,
      })
      throw createError({ statusCode: 502, message: 'BoxAPI returned an error' })
    }

    const result = await response.json()
    const oauthUrl = result?.data?.instagram_oauth_url

    if (!oauthUrl) {
      throw createError({ statusCode: 502, message: 'Instagram OAuth URL not available from BoxAPI' })
    }

    // Append our internal user id so the callback knows which user to associate
    const separator = oauthUrl.includes('?') ? '&' : '?'
    const url = `${oauthUrl}${separator}id=${userId}`

    return { url }
  } catch (error: any) {
    // Re-throw createError instances as-is
    if (error.statusCode) throw error
    throw createError({
      statusCode: 502,
      message: `Failed to fetch BoxAPI info: ${error?.message || 'Unknown error'}`,
    })
  }
})