import { eq } from 'drizzle-orm'
import { pages } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page id' })
  }

  const db = useDb(event)
  const [page] = await db.select().from(pages).where(eq(pages.id, id))
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
