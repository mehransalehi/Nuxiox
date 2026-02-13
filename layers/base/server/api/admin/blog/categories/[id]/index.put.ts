import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { blogCategories } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

const schema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(160),
  description: z.string().max(1000).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Category id is required' })

  const body = schema.parse(await readBody(event))
  const db = useDb(event)

  await db.update(blogCategories).set({
    name: body.name,
    slug: body.slug,
    description: body.description ?? null,
    updatedAt: new Date(),
  }).where(eq(blogCategories.id, id))

  return { success: true }
})
