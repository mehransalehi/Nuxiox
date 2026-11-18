import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema.gen'

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
    bot_url: body.bot_url || null,
    bot_token: botToken,
    cf_token: body.cf_token || null,
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

  // Exclude password_hash from response
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
})