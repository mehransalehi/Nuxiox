import { asc, eq } from 'drizzle-orm'
import { colleagues } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler((event) => useDb(event)
  .select()
  .from(colleagues)
  .where(eq(colleagues.isActive, true))
  .orderBy(asc(colleagues.sortOrder), asc(colleagues.id)))
