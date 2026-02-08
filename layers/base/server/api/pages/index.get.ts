import { pages } from '~~/server/database/schema.gen'
import { desc } from 'drizzle-orm'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const db = useDb(event)
  return db
    .select({
      id: pages.id,
      slug: pages.slug,
      title: pages.title,
      status: pages.status,
      createdAt: pages.createdAt,
      updatedAt: pages.updatedAt,
    })
    .from(pages)
    .orderBy(desc(pages.updatedAt))
})
