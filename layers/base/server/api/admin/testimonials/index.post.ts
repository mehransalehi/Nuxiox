import { testimonials } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  const body = await readBody(event)
  const [created] = await useDb(event).insert(testimonials).values({
    name: String(body.name ?? '').trim(),
    role: body.role ?? '',
    content: body.content ?? '',
    avatar: body.avatar ?? '',
    rating: Number(body.rating ?? 5),
    isActive: Boolean(body.isActive ?? true),
  }).returning()
  return created
})
