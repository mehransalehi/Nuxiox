import { eq, and } from "drizzle-orm";
import { pages, pagesLocales } from "~~/server/database/schema.gen";
import { defaultPageBuilder } from "~~/packages/base/utils/page-builder";
import type { PageBuilder } from "~~/packages/base/types/page-builder";

import { requireAdmin } from "~~/server/utils/checkAdmin";

type UpdatePagePayload = {
  title?: string;
  slug?: string;
  locale: string;
  status?: "draft" | "published";
  seo?: Record<string, unknown>;
  builder?: PageBuilder;
};

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid page id" });
  }

  const body = (await readBody(event)) as UpdatePagePayload;

  const db = useDb(event);

  // ---- update pages table ----
  const pagePayload: any = {
    updatedAt: new Date(),
  };

  if (body.status !== undefined) {
    pagePayload.status = body.status;
  }

  await db
    .update(pages)
    .set(pagePayload)
    .where(eq(pages.id, id));

  const page = await db.query.pages.findFirst({
    where: eq(pages.id, id),
  });
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  // ---- update locale table ----
  const localePayload: any = {};

  if (body.title !== undefined) localePayload.title = body.title;
  if (body.slug !== undefined) localePayload.slug = body.slug;
  if (body.seo !== undefined) localePayload.seo = body.seo;
  if (body.builder !== undefined)
    localePayload.builder = body.builder ?? defaultPageBuilder;

  let localeRow = null;

  if (Object.keys(localePayload).length > 0) {
    await db
      .update(pagesLocales)
      .set(localePayload)
      .where(
        and(eq(pagesLocales.page_id, id), eq(pagesLocales.locale, body.locale)),
      );

    localeRow = await db.query.pagesLocales.findFirst({
      where: and(eq(pagesLocales.page_id, id), eq(pagesLocales.locale, body.locale)),
    });
  }

  return {
    ...page,
    locale: localeRow,
  };
});