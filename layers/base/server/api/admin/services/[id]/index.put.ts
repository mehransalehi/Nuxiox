import { eq } from 'drizzle-orm'
import { services } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  await useDb(event).update(services).set({
    title: String(body.title ?? '').trim(),
    subtitle: body.subtitle ?? '',
    description: body.description ?? '',
    icon: body.icon ?? '',
    image: body.image ?? '',
    link: body.link ?? '',
    sortOrder: Number(body.sortOrder ?? 0),
    isActive: Boolean(body.isActive ?? true),
    extra: Array.isArray(body.extra) ? body.extra : [],
    updatedAt: Date.now(),
  }).where(eq(services.id, id))
  return { success: true }
})
