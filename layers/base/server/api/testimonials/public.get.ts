import { desc, eq } from 'drizzle-orm'
import { testimonials } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler((event) => useDb(event)
  .select()
  .from(testimonials)
  .where(eq(testimonials.isActive, true))
  .orderBy(desc(testimonials.id))
  .limit(6))
