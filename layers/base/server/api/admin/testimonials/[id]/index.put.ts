import { eq } from 'drizzle-orm'
import { testimonials } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  await useDb(event).update(testimonials).set({
    name: String(body.name ?? '').trim(),
    role: body.role ?? '',
    content: body.content ?? '',
    avatar: body.avatar ?? '',
    rating: Number(body.rating ?? 5),
    isActive: Boolean(body.isActive ?? true),
    updatedAt: Date.now(),
  }).where(eq(testimonials.id, id))
  return { success: true }
})
