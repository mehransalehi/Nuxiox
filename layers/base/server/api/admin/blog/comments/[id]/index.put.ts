import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { blogComments } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

const schema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Comment id is required' })

  const body = schema.parse(await readBody(event))
  const db = useDb(event)

  await db.update(blogComments).set({ status: body.status }).where(eq(blogComments.id, id))
  return { success: true }
})
