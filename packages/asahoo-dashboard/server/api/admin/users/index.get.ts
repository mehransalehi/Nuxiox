import { eq, like, and, asc } from 'drizzle-orm'
import { users, userData } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const db = useDb(event)
  const query = getQuery(event)

  const conditions = [eq(users.role, 'user')]
  if (query.search) {
    conditions.push(like(users.email, `%${query.search}%`))
  }

  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      token: users.token,
      bot_url: userData.bot_url,
      bot_token: userData.bot_token,
      cf_token: userData.cf_token,
      instagram_account_id: userData.instagram_account_id,
      instagram_user_id: userData.instagram_user_id,
      instagram_page_id: userData.instagram_page_id,
      instagram_is_active: userData.instagram_is_active,
      created_at: users.created_at,
      updated_at: users.updated_at,
    })
    .from(users)
    .leftJoin(userData, eq(userData.user_id, users.id))
    .where(and(...conditions))
    .orderBy(asc(users.created_at))

  return allUsers
})