import { and, asc, eq } from 'drizzle-orm'
import {
  blogComments,
  blogPosts,
  blogPostsLocales,
} from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'
import { getLocale } from "~~/server/utils/getLocale";

type CommentNode = {
  id: number
  postId: number
  userId: number | null
  parentId: number | null
  authorName: string | null
  content: string
  likeCount: number
  createdAt: Date
  replies: CommentNode[]
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const locale = getLocale(event)

  if (!slug)
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })

  const db = useDb(event)

  const [post] = await db
    .select({
      id: blogPosts.id,
      title: blogPostsLocales.title,
      slug: blogPostsLocales.slug,
      excerpt: blogPostsLocales.excerpt,
      content: blogPostsLocales.content,
      featuredImage: blogPosts.featuredImage,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .innerJoin(
      blogPostsLocales,
      and(
        eq(blogPostsLocales.postId, blogPosts.id),
        eq(blogPostsLocales.locale, locale),
      ),
    )
    .where(and(
      eq(blogPostsLocales.slug, slug),
      eq(blogPosts.status, 'published'),
    ))
    .limit(1)

  if (!post)
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })

  const comments = await db
    .select({
      id: blogComments.id,
      postId: blogComments.postId,
      userId: blogComments.userId,
      parentId: blogComments.parentId,
      authorName: blogComments.authorName,
      content: blogComments.content,
      likeCount: blogComments.likeCount,
      createdAt: blogComments.createdAt,
    })
    .from(blogComments)
    .where(and(
      eq(blogComments.postId, post.id),
      eq(blogComments.status, 'approved'),
    ))
    .orderBy(asc(blogComments.createdAt))

  const byId = new Map<number, CommentNode>()
  const roots: CommentNode[] = []

  comments.forEach((c) => {
    byId.set(c.id, { ...c, replies: [] })
  })

  byId.forEach((comment) => {
    if (comment.parentId && byId.has(comment.parentId)) {
      byId.get(comment.parentId)?.replies.push(comment)
    } else {
      roots.push(comment)
    }
  })

  return { post, comments: roots }
})
