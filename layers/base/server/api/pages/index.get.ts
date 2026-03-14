import { pages, pagesLocales } from "~~/server/database/schema.gen";
import { desc } from "drizzle-orm";
import { useDb } from "~~/server/utils/db";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { getLocale } from "~~/server/utils/getLocale";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const db = useDb(event);
  const result = await db
    .select()
    .from(pages)
    .leftJoin(pagesLocales, eq(pages.id, pagesLocales.pageId))
    .orderBy(desc(pages.updatedAt));
  return result;
});
