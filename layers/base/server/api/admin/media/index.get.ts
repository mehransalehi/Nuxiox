// server/api/admin/media/index.get.ts
import { media } from "~~/server/database/schema.gen";
import { useDb } from "~~/server/utils/db";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = useDb(event);

  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const items = await db.query.media.findMany({
    orderBy: [desc(media.createdAt)],
    limit,
    offset,
  });

  return { items, page, limit };
});
