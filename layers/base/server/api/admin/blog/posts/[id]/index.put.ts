import { eq, and } from "drizzle-orm";
import { z } from "zod";
import {
  blogPostCategories,
  blogPosts,
  blogPostsLocales,
} from "~~/server/database/schema.gen";
import { useDb } from "~~/server/utils/db";
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

  await db
    .update(blogPosts)
    .set({
      featuredImage: body.featuredImage || null,
      status: body.status,
      allowComments: body.allowComments,
      allowAnonymousComments: body.allowAnonymousComments,
      publishedAt: body.status === "published" ? new Date() : null,
      updatedAt: new Date(),
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
        eq(blogPostsLocales.postId, id),
        eq(blogPostsLocales.locale, body.locale),
      ),
    );

  await db.delete(blogPostCategories).where(eq(blogPostCategories.postId, id));

  if (body.categoryIds.length) {
    await db.insert(blogPostCategories).values(
      body.categoryIds.map((categoryId) => ({
        postId: id,
        categoryId,
      })),
    );
  }

  return { success: true };
});
