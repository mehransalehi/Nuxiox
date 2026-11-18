import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const db = useDb(event)

  // Only allow deleting users with role='user'
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!existing || existing.role !== 'user') {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  await db.delete(users).where(eq(users.id, id))

  return { success: true }
})