import { eq } from 'drizzle-orm'
import { contactMessages } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  const id = Number(getRouterParam(event, 'id'))
  await useDb(event).delete(contactMessages).where(eq(contactMessages.id, id))
  return { success: true }
})
