import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schema.gen'
import { z } from 'zod'

const updateUserSchema = z.object({
  username: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readValidatedBody(event, updateUserSchema.parse)
  const db = useDb(event)

  // Only allow updating users with role='user'
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!existing || existing.role !== 'user') {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  // Build update values
  const updateValues: Record<string, unknown> = {}
  if (body.username !== undefined) updateValues.username = body.username
  if (body.email !== undefined) updateValues.email = body.email
  if (body.password !== undefined) {
    updateValues.password_hash = await bcrypt.hash(body.password, 10)
  }
  updateValues.updated_at = new Date()

  await db.update(users).set(updateValues).where(eq(users.id, id))

  return { success: true }
})