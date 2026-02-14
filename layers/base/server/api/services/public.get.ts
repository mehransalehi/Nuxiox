import { and, asc, eq } from 'drizzle-orm'
import { services } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler((event) => useDb(event)
  .select()
  .from(services)
  .where(eq(services.isActive, true))
  .orderBy(asc(services.sortOrder), asc(services.id)))
