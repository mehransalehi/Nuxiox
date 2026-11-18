import bcrypt from 'bcryptjs'
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

  const [user] = await db
    .insert(users)
    .values({
      username: body.username,
      email: body.email,
      password_hash: passwordHash,
      role: 'user',
      bot_url: body.bot_url || null,
      bot_token: body.bot_token || null,
      cf_token: body.cf_token || null,
    } as any)
    .returning()

  if (!user) {
    throw createError({ statusCode: 400, message: 'User not created' })
  }

  // Exclude password_hash from response
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
})