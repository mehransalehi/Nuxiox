import { eq } from 'drizzle-orm'
import { blogCommentLikes, blogComments } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session?.user?.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Comment id is required' })

  const db = useDb(event)
  await db.delete(blogCommentLikes).where(eq(blogCommentLikes.comment_id, id))
  await db.update(blogComments).set({ like_count: 0, updated_at: new Date() }).where(eq(blogComments.id, id))

  return { success: true }
})