import { asc } from 'drizzle-orm'
import { services } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return useDb(event).select().from(services).orderBy(asc(services.sortOrder), asc(services.id))
})
