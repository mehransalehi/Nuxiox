import { pages, pagesLocales } from "~~/server/database/schema.gen";
import { defaultPageBuilder } from "~~/layers/base/utils/page-builder";
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
      statusMessage: "Title, slug and locale are required",
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
    const [resultPage] = await db.insert(pages).values({
      status: "draft",
    });
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, resultPage.insertId),
    });
    let localeRow = null;
    if (page) {
      try {
        const [result] = await db.insert(pagesLocales).values({
          pageId: page.id,
          locale: body.locale!,
          slug: body.slug!,
          title: body.title!,
          seo,
          builder: defaultPageBuilder,
        });

        localeRow = await db.query.pagesLocales.findFirst({
          where: eq(pagesLocales.id, result.insertId),
        });
      } catch (error) {
        // 2️⃣ Check if any locales remain
        const remaining = await db
          .select({ id: pagesLocales.id })
          .from(pagesLocales)
          .where(eq(pagesLocales.page_id, page.id))
          .limit(1);

        // 3️⃣ If no locales remain → delete page
        if (remaining.length === 0) {
          await db.delete(pages).where(eq(pages.id, page.id));
        }
        throw error;
      }
    }

    return {
      pages: { ...page },
      pages_locales: { ...localeRow },
    };
  } catch (error: any) {
    if (error?.message?.includes("UNIQUE")) {
      throw createError({
        statusCode: 409,
        statusMessage: "Slug already exists for this locale",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create page or slug must not saved before",
    });
  }
});
