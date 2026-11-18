import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema.gen'
import { z } from 'zod'

const createUserSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  bot_url: z.string().optional(),
  bot_token: z.string().optional(),
  cf_token: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readValidatedBody(event, createUserSchema.parse)
  const db = useDb(event)

  // Hash password with bcrypt
  const passwordHash = await bcrypt.hash(body.password, 10)

  let botToken = body.bot_token || null

  // Auto-fetch bot token from one-time setup endpoint
  if (body.bot_url && !botToken) {
    try {
      const res = await fetch(`${body.bot_url.replace(/\/+$/, '')}/api/setup/token`)
      if (res.ok) {
        const data = await res.json()
        botToken = data.token || null
      }
    } catch {
      // Silently fail — token can be set manually later
    }
  }

  const [user] = await db
    .insert(users)
    .values({
      username: body.username,
      email: body.email,
      password_hash: passwordHash,
      role: 'user',
      bot_url: body.bot_url || null,
      bot_token: botToken,
      cf_token: body.cf_token || null,
    } as any)
    .returning()

  if (!user) {
    throw createError({ statusCode: 400, message: 'User not created' })
  }

  // If bot token was auto-fetched, ensure it's saved to the record
  if (botToken) {
    await db.update(users).set({ bot_token: botToken }).where(eq(users.id, user.id))
  }

  // Exclude password_hash from response
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
})