import { eq, and } from "drizzle-orm";
import {
  blogPostCategories,
  blogPosts,
  blogPostsLocales,
} from "~~/server/database/schema.gen";
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "Post id is required" });

  const locale = getQuery(event).locale as string;
  if (!locale) throw createError({ statusCode: 400, message: 'Locale is required' })
    
  const db = useDb(event)

  const [post] = await db
    .select({
      id: blogPosts.id,
      featuredImage: blogPosts.featured_image,
      status: blogPosts.status,
      allowComments: blogPosts.allow_comments,
      allowAnonymousComments: blogPosts.allow_anonymous_comments,
      publishedAt: blogPosts.published_at,
      createdAt: blogPosts.created_at,
      updatedAt: blogPosts.updated_at,

      locale: blogPostsLocales.locale,
      title: blogPostsLocales.title,
      slug: blogPostsLocales.slug,
      excerpt: blogPostsLocales.excerpt,
      content: blogPostsLocales.content,
      seo: blogPostsLocales.seo,
    })
    .from(blogPosts)
    .innerJoin(
      blogPostsLocales,
      eq(blogPostsLocales.post_id, blogPosts.id),
    )
    .where(
      and(
        eq(blogPosts.id, id),
        eq(blogPostsLocales.locale, locale),
      ),
    )
    .limit(1)

  if (!post) throw createError({ statusCode: 404, message: "Post not found" })

  const categories = await db
    .select({ categoryId: blogPostCategories.category_id })
    .from(blogPostCategories)
    .where(eq(blogPostCategories.post_id, id))
  
  return {
    ...post,
    categoryIds: categories.map((c) => c.categoryId),
  }
});