import { z } from 'zod'
import { blogCategories } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

const schema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const body = schema.parse(await readBody(event))
  const db = useDb(event)

  const [created] = await db.insert(blogCategories).values({
    name: body.name,
    slug: body.slug,
    description: body.description ?? null,
  }).returning()

  return created
})
