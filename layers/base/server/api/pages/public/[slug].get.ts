import { and, eq } from 'drizzle-orm'
import { pages } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
  }

  const db = useDb(event)
  const [page] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.slug, slug), eq(pages.status, 'published')))

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
