import { and, eq, sql } from 'drizzle-orm'
import { blogCommentLikes, blogComments } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Comment id is required' })

  const db = useDb(event)
  const session = await getUserSession(event)

  if (session?.user?.id) {
    const existing = await db
      .select({ id: blogCommentLikes.id })
      .from(blogCommentLikes)
      .where(and(eq(blogCommentLikes.commentId, id), eq(blogCommentLikes.userId, session.user.id)))
      .limit(1)

    if (existing.length > 0) {
      return { success: true, alreadyLiked: true }
    }

    await db.insert(blogCommentLikes).values({
      commentId: id,
      userId: session.user.id,
    })
  } else {
    const cookie = getCookie(event, 'blog_comment_likes')
    const likedIds = cookie ? (JSON.parse(cookie) as number[]) : []
    if (likedIds.includes(id)) {
      return { success: true, alreadyLiked: true }
    }

    likedIds.push(id)
    setCookie(event, 'blog_comment_likes', JSON.stringify(likedIds.slice(-200)), {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  await db
    .update(blogComments)
    .set({ likeCount: sql`${blogComments.likeCount} + 1` })
    .where(eq(blogComments.id, id))

  const [comment] = await db
    .select({ likeCount: blogComments.likeCount })
    .from(blogComments)
    .where(eq(blogComments.id, id))
    .limit(1)

  return { success: true, likeCount: comment?.likeCount ?? 0 }
})
