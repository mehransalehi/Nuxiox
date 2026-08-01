import { and, eq, sql } from 'drizzle-orm'
import { blogCommentLikes, blogComments } from '~~/server/database/schema.gen'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Comment id is required' })

  const db = useDb(event)
  const session = await getUserSession(event)

  if (session?.user?.id) {
    const existing = await db
      .select({ id: blogCommentLikes.id })
      .from(blogCommentLikes)
      .where(and(eq(blogCommentLikes.comment_id, id), eq(blogCommentLikes.user_id, session.user.id)))
      .limit(1)

    if (existing.length > 0) {
      return { success: true, alreadyLiked: true }
    }

    await db.insert(blogCommentLikes).values({
      comment_id: id,
      user_id: session.user.id,
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
    .set({ like_count: sql`${blogComments.like_count} + 1` })
    .where(eq(blogComments.id, id))

  const [comment] = await db
    .select({ likeCount: blogComments.like_count })
    .from(blogComments)
    .where(eq(blogComments.id, id))
    .limit(1)

  return { success: true, likeCount: comment?.likeCount ?? 0 }
})