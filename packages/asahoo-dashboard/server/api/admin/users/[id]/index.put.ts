import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users, userData } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body || !body.username || !body.email) {
    throw createError({ statusCode: 400, message: 'نام کاربری و ایمیل الزامی است' })
  }

  const db = useDb(event)

  // Only allow updating users with role='user'
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!existing || existing.role !== 'user') {
    throw createError({ statusCode: 404, message: 'کاربر یافت نشد' })
  }

  // Update user base fields
  const userUpdate: Record<string, unknown> = {
    username: body.username,
    email: body.email,
    updated_at: new Date(),
  }

  if (body.password && body.password.length >= 8) {
    userUpdate.password_hash = await bcrypt.hash(body.password, 10)
  }

  await (db.update(users) as any).set(userUpdate).where(eq(users.id, id))

  // Upsert bot credentials into user_data
  let botToken = body.bot_token || null

  // Auto-fetch bot token if auto_fetch is true, URL is provided, and no token sent
  if (body.auto_fetch && body.bot_url && !botToken) {
    try {
      const res = await fetch(`${String(body.bot_url).replace(/\/+$/, '')}/api/setup/token`)
      if (res.ok) {
        const data = await res.json()
        if (data.token) {
          botToken = data.token
        }
      }
    } catch (e) {
      console.error('Auto-fetch bot token failed:', e)
    }
  }

  await (db.insert(userData) as any).values({
    user_id: id,
    bot_url: body.bot_url || null,
    bot_token: botToken,
    cf_token: body.cf_token || null,
    instagram_account_id: body.instagram_account_id || null,
    instagram_user_id: body.instagram_user_id || null,
    instagram_page_id: body.instagram_page_id || null,
    instagram_access_token: body.instagram_access_token || null,
    instagram_is_active: body.instagram_is_active !== undefined ? body.instagram_is_active : true,
  }).onConflictDoUpdate({
    target: (userData as any).user_id,
    set: {
      bot_url: body.bot_url || null,
      bot_token: botToken,
      cf_token: body.cf_token || null,
      instagram_account_id: body.instagram_account_id || null,
      instagram_user_id: body.instagram_user_id || null,
      instagram_page_id: body.instagram_page_id || null,
      instagram_access_token: body.instagram_access_token || null,
      instagram_is_active: body.instagram_is_active !== undefined ? body.instagram_is_active : true,
      updated_at: new Date(),
    },
  })

  return {
    success: true,
    bot_url: body.bot_url || null,
    bot_token: botToken ? '(set)' : null,
    cf_token: body.cf_token ? '(set)' : null,
    instagram_account_id: body.instagram_account_id || null,
    instagram_user_id: body.instagram_user_id || null,
    instagram_is_active: body.instagram_is_active !== undefined ? body.instagram_is_active : true,
  }
})