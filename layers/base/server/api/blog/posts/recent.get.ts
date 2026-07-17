import { desc, eq, and } from 'drizzle-orm'
import { blogPosts, blogPostsLocales } from '~~/server/database/schema.gen'
import { getLocale } from "~~/server/utils/getLocale";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const locale = getLocale(event)
  const limit = Math.min(10, Math.max(1, Number(query.limit ?? 5)))

  const db = useDb(event)

  return db
    .select({
      id: blogPosts.id,
      title: blogPostsLocales.title,
      slug: blogPostsLocales.slug,
      excerpt: blogPostsLocales.excerpt,
      featuredImage: blogPosts.featured_image,
      publishedAt: blogPosts.published_at,
    })
    .from(blogPosts)
    .innerJoin(
      blogPostsLocales,
      and(
        eq(blogPostsLocales.post_id, blogPosts.id),
        eq(blogPostsLocales.locale, locale),
      ),
    )
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.published_at))
    .limit(limit)
})