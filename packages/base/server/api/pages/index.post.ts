import { pages, pagesLocales } from "~~/server/database/schema.gen";
import { defaultPageBuilder } from "~~/packages/base/utils/page-builder";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { eq } from "drizzle-orm";

type CreatePagePayload = {
  title: string;
  slug: string;
  locale: string;
};

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = (await readBody(event)) as Partial<CreatePagePayload>;

  if (!body?.title || !body?.slug || !body?.locale) {
    throw createError({
      statusCode: 400,
      message: "Title, slug and locale are required",
    });
  }

  const db = useDb(event);

  const seo = {
    title: body.title,
    description: `Learn more about ${body.title}.`,
    canonical: `/${body.slug}`,
    robots: "index,follow",
  };

  try {
    // 1️⃣ Insert page row with .returning() to get the ID back
    const [pageRow] = await db
      .insert(pages)
      .values({ status: "draft" })
      .returning({ id: pages.id })

    if (!pageRow) {
      throw createError({
        statusCode: 500,
        message: "Failed to create page row",
      })
    }

    // 2️⃣ Insert locale row
    let localeRow = null
    try {
      const [result] = await db
        .insert(pagesLocales)
        .values({
          page_id: pageRow.id,
          locale: body.locale!,
          slug: body.slug!,
          title: body.title!,
          seo,
          builder: defaultPageBuilder,
        })
        .returning({ id: pagesLocales.id })

      if (result) {
        localeRow = await db.query.pagesLocales.findFirst({
          where: eq(pagesLocales.id, result.id),
        })
      }
    } catch (error) {
      // Locale insertion failed — clean up the parent page
      await db.delete(pages).where(eq(pages.id, pageRow.id))
      throw error
    }

    return {
      pages: { ...pageRow },
      pages_locales: { ...localeRow },
    };
  } catch (error: any) {
    if (error?.message?.includes("UNIQUE")) {
      throw createError({
        statusCode: 409,
        message: "Slug already exists for this locale",
      });
    }

    throw createError({
      statusCode: 500,
      message: "Failed to create page or slug must not saved before",
    });
  }
});
