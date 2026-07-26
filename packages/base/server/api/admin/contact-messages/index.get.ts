import { desc } from 'drizzle-orm'
import { contactMessages } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return useDb(event).select().from(contactMessages).orderBy(desc(contactMessages.id))
})
