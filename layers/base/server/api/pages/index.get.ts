import { pages, pagesLocales } from "~~/server/database/schema.gen";
import { desc } from "drizzle-orm";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { getLocale } from "~~/server/utils/getLocale";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const db = useDb(event);
  const result = await db
    .select()
    .from(pages)
    .leftJoin(pagesLocales, eq(pages.id, pagesLocales.page_id))
    .orderBy(desc(pages.updated_at));
  return result;
});
