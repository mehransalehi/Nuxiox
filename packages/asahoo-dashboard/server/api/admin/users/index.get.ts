import { eq, like, and, asc } from 'drizzle-orm'
import { users } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const db = useDb(event)
  const query = getQuery(event)

  const conditions = [eq(users.role, 'user')]
  if (query.search) {
    conditions.push(like(users.email, `%${query.search}%`))
  }

  const allUsers = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .orderBy(asc(users.created_at))

  // Exclude password_hash from response
  return allUsers.map(({ password_hash, ...rest }) => rest)
})