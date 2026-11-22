import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users, userData } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const db = useDb(event)

  if (!body || !body.username || !body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'نام کاربری، ایمیل و رمز عبور الزامی است' })
  }

  if (body.password.length < 8) {
    throw createError({ statusCode: 400, message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
  }

  // Hash password with bcrypt
  const passwordHash = await bcrypt.hash(body.password, 10)

  let botToken = body.bot_token || null

  // Auto-fetch bot token from one-time setup endpoint
  if (body.auto_fetch && body.bot_url && !botToken) {
    try {
      const res = await fetch(`${body.bot_url.replace(/\/+$/, '')}/api/setup/token`)
      if (res.ok) {
        const data = await res.json()
        botToken = data.token || null
      }
    } catch (e) {
      console.error('Auto-fetch bot token failed:', e)
    }
  }

  // Insert user (D1 RETURNING is unreliable — query back after insert)
  await (db.insert(users) as any).values({
    username: body.username,
    email: body.email,
    password_hash: passwordHash,
    role: 'user',
  })

  // Query back the inserted user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email))
    .limit(1)

  if (!user) {
    throw createError({ statusCode: 400, message: 'کاربر ایجاد نشد' })
  }

  // Insert bot credentials into user_data
  await (db.insert(userData) as any).values({
    user_id: user.id,
    bot_url: body.bot_url || null,
    bot_token: botToken,
    cf_token: body.cf_token || null,
    instagram_account_id: body.instagram_account_id || null,
    instagram_user_id: body.instagram_user_id || null,
    instagram_page_id: body.instagram_page_id || null,
    instagram_access_token: body.instagram_access_token || null,
    instagram_is_active: body.instagram_is_active !== undefined ? body.instagram_is_active : true,
  })

  return { ...user, password_hash: undefined, bot_url: body.bot_url || null, bot_token: botToken ? '(set)' : null }
})