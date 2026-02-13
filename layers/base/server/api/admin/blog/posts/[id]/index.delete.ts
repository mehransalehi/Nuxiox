import { eq } from 'drizzle-orm'
import { blogPosts } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Post id is required' })

  const db = useDb(event)
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
  return { success: true }
})
