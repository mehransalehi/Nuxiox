import { eq } from 'drizzle-orm'
import { blogPosts } from '~~/server/database/schema.gen'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id)
    throw createError({ statusCode: 400, message: 'Post id is required' })

  const db = useDb(event)

  await db.delete(blogPosts).where(eq(blogPosts.id, id))

  return { success: true }
})
