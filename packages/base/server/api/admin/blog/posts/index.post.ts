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

  // check if slug already exists for locale
  const existing = await db.query.blogPostsLocales.findFirst({
    where: (t, { eq, and }) =>
      and(eq(t.slug, body.slug), eq(t.locale, body.locale)),
  });

  if (existing) {
    throw createError({
      statusCode: 409,
      message: "Post slug already exists for this locale",
    });
  }

  const [post] = await db
    .insert(blogPosts)
    .values({
      author_id: admin.id,
      featured_image: body.featuredImage || null,
      status: body.status,
      allow_comments: body.allowComments,
      allow_anonymous_comments: body.allowAnonymousComments,
      published_at: body.status === "published" ? new Date() : null,
    })
    .returning({ id: blogPosts.id });

  if (post) {
    await db.insert(blogPostsLocales).values({
      post_id: post.id,
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
          post_id: post.id,
          category_id: categoryId,
        })),
      );
    }

    return { id: post.id };
  } else {
    throw createError({ statusCode: 400, message: "Post not saved" });
  }
});
