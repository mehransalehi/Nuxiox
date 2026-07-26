import { desc, eq, and, sql } from "drizzle-orm";
import {
  blogComments,
  blogPosts,
  blogPostsLocales,
  users,
} from "~~/server/database/schema.gen";
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = useDb(event);

  return db
    .select({
      id: blogPosts.id,
      title: blogPostsLocales.title,
      locale: blogPostsLocales.locale,
      slug: blogPostsLocales.slug,
      status: blogPosts.status,
      allowComments: blogPosts.allow_comments,
      allowAnonymousComments: blogPosts.allow_anonymous_comments,
      publishedAt: blogPosts.published_at,
      updatedAt: blogPosts.updated_at,
      authorEmail: users.email,
      commentsCount: sql<number>`count(${blogComments.id})`,
    })
    .from(blogPosts)
    .innerJoin(
      blogPostsLocales,
      eq(blogPostsLocales.post_id, blogPosts.id),
    )
    .leftJoin(users, eq(users.id, blogPosts.author_id))
    .leftJoin(blogComments, eq(blogComments.post_id, blogPosts.id))
    .groupBy(
      blogPosts.id,
      blogPostsLocales.id,
      blogPostsLocales.title,
      blogPostsLocales.locale,
      blogPostsLocales.slug,
      blogPosts.status,
      blogPosts.published_at,
      blogPosts.updated_at,
      users.email,
    )
    .orderBy(desc(blogPosts.updated_at));
});