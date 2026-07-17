import { ne,eq, and } from "drizzle-orm";
import { z } from "zod";
import {
  blogPostCategories,
  blogPosts,
  blogPostsLocales,
} from "~~/server/database/schema.gen";
 ;
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { checkZod } from "~~/server/utils/checkZod";

const schema = z.object({
  locale: z.string(),
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220),
  excerpt: z.string().max(500).nullable().optional(),
  content: z.string().min(2),
  seo: z.record(z.string(), z.string()).optional().default({}),
  featuredImage: z.string().url().nullable().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  allowComments: z.boolean(),
  allowAnonymousComments: z.boolean(),
  categoryIds: z.array(z.number().int().positive()),
});

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Post id is required",
    });

  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event);

  // check if another post already uses this slug+locale
  const existing = await db
  .select({ id: blogPostsLocales.id })
  .from(blogPostsLocales)
  .where(
    and(
      eq(blogPostsLocales.slug, body.slug),
      eq(blogPostsLocales.locale, body.locale),
      ne(blogPostsLocales.post_id, id) // exclude current post
    )
  )
  .limit(1);
  console.log(existing);
  if (existing.length>0) {
    throw createError({
      statusCode: 409,
      statusMessage: "Slug already exists for this locale",
    });
  }

  await db
    .update(blogPosts)
    .set({
      featured_image: body.featuredImage || null,
      status: body.status,
      allow_comments: body.allowComments,
      allow_anonymous_comments: body.allowAnonymousComments,
      published_at: body.status === "published" ? new Date() : null,
      updated_at: new Date(),
    })
    .where(eq(blogPosts.id, id));

  await db
    .update(blogPostsLocales)
    .set({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? null,
      content: body.content,
      seo: body.seo ?? {},
    })
    .where(
      and(
        eq(blogPostsLocales.post_id, id),
        eq(blogPostsLocales.locale, body.locale),
      ),
    );

  await db.delete(blogPostCategories).where(eq(blogPostCategories.post_id, id));

  if (body.categoryIds.length) {
    await db.insert(blogPostCategories).values(
      body.categoryIds.map((categoryId) => ({
        post_id: id,
        category_id: categoryId,
      })),
    );
  }

  return { success: true };
});
