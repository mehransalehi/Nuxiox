import { eq, and } from "drizzle-orm";
import { pages, pagesLocales } from "~~/server/database/schema.gen";
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "Invalid page id" });
  }

  const { locale } = getQuery(event);

  if (!locale || typeof locale !== "string") {
    throw createError({ statusCode: 400, message: "Locale is required" });
  }

  const db = useDb(event);

  // 1️⃣ Delete the locale — use .returning() to get a usable result
  const deleted = await db
    .delete(pagesLocales)
    .where(and(eq(pagesLocales.page_id, id), eq(pagesLocales.locale, locale)))
    .returning({ id: pagesLocales.id });

  if (!deleted || deleted.length === 0) {
    throw createError({ statusCode: 404, message: "Locale not found" });
  }

  // 2️⃣ Check if any locales remain
  const remaining = await db
    .select({ id: pagesLocales.id })
    .from(pagesLocales)
    .where(eq(pagesLocales.page_id, id))
    .limit(1);

  // 3️⃣ If no locales remain → delete page
  if (remaining.length === 0) {
    await db.delete(pages).where(eq(pages.id, id));
  }

  return {
    success: true,
    deletedLocale: locale,
    pageDeleted: remaining.length === 0,
  };
});