import { eq } from 'drizzle-orm'
import { colleagues } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  const id = Number(getRouterParam(event, 'id'))
  await useDb(event).delete(colleagues).where(eq(colleagues.id, id))
  return { success: true }
})
