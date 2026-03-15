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
  locale: z.string().min(2),
  title: z.string().min(2).max(220),
  slug: z.string().min(2).max(220),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(2),
  seo: z.record(z.string(), z.string()).optional().default({}),
  featuredImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  allowComments: z.boolean().default(true),
  allowAnonymousComments: z.boolean().default(true),
  categoryIds: z.array(z.number().int().positive()).default([]),
});

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event);

  const [post] = await db
    .insert(blogPosts)
    .values({
      authorId: admin.id,
      featuredImage: body.featuredImage || null,
      status: body.status,
      allowComments: body.allowComments,
      allowAnonymousComments: body.allowAnonymousComments,
      publishedAt: body.status === "published" ? new Date() : null,
    })
    .returning({ id: blogPosts.id });

  if (post) {
    await db.insert(blogPostsLocales).values({
      postId: post.id,
      locale: body.locale,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? null,
      content: body.content,
      seo: body.seo ?? {},
    });

    if (body.categoryIds.length) {
      await db.insert(blogPostCategories).values(
        body.categoryIds.map((categoryId) => ({
          postId: post.id,
          categoryId,
        })),
      );
    }

    return { id: post.id };
  } else {
    throw createError({ statusCode: 400, statusMessage: "Post not saved" });
  }
});
