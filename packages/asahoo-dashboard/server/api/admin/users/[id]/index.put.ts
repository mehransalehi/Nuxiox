import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema.gen'

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

  // Build update values — ALWAYS include bot fields (allow clearing)
  const updateValues: Record<string, unknown> = {
    username: body.username,
    email: body.email,
    bot_url: body.bot_url || null,
    bot_token: body.bot_token || null,
    cf_token: body.cf_token || null,
    updated_at: new Date(),
  }

  if (body.password && body.password.length >= 8) {
    updateValues.password_hash = await bcrypt.hash(body.password, 10)
  }

  // Auto-fetch bot token if only URL is provided (no token)
  if (body.bot_url && !body.bot_token) {
    try {
      const res = await fetch(`${String(body.bot_url).replace(/\/+$/, '')}/api/setup/token`)
      if (res.ok) {
        const data = await res.json()
        if (data.token) {
          updateValues.bot_token = data.token
        }
      }
    } catch (e) {
      console.error('Auto-fetch bot token failed:', e)
    }
  }

  await (db.update(users) as any).set(updateValues).where(eq(users.id, id))

  return {
    success: true,
    bot_url: updateValues.bot_url as string | null,
    bot_token: updateValues.bot_token ? '(set)' : null,
    cf_token: updateValues.cf_token ? '(set)' : null,
  }
})