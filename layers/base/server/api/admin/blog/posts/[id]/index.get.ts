import { eq, and } from 'drizzle-orm'
import { blogPostCategories, blogPosts, blogPostsLocales } from '~~/server/database/schema.gen'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const locale = getQuery(event).locale as string

  if (!id) throw createError({ statusCode: 400, statusMessage: 'Post id is required' })
  if (!locale) throw createError({ statusCode: 400, statusMessage: 'Locale is required' })
    
  const db = useDb(event)

  const [post] = await db
    .select({
      id: blogPosts.id,
      featuredImage: blogPosts.featuredImage,
      status: blogPosts.status,
      allowComments: blogPosts.allowComments,
      allowAnonymousComments: blogPosts.allowAnonymousComments,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,

      title: blogPostsLocales.title,
      slug: blogPostsLocales.slug,
      excerpt: blogPostsLocales.excerpt,
      content: blogPostsLocales.content,
      seo: blogPostsLocales.seo,
      locale:blogPostsLocales.locale,
    })
    .from(blogPosts)
    .leftJoin(
      blogPostsLocales,
      and(
        eq(blogPostsLocales.postId, blogPosts.id),
        eq(blogPostsLocales.locale, locale)
      )
    )
    .where(eq(blogPosts.id, id))
    .limit(1)

  if (!post)
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })

  const categories = await db
    .select({ categoryId: blogPostCategories.categoryId })
    .from(blogPostCategories)
    .where(eq(blogPostCategories.postId, id))
  return {
    ...post,
    seo: (post.seo ?? {}) as Record<string, string>,
    categoryIds: categories.map((c) => c.categoryId),
  }
})
