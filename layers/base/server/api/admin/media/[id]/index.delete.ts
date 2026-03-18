// server/api/admin/media/[id].delete.ts
import { media } from "~~/server/database/schema.gen";
import { useDb } from "~~/server/utils/db";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { getR2Bucket, deleteFromR2 } from "~~/server/utils/r2";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = useDb(event);
  const bucket = getR2Bucket(event);
  const id = parseInt(getRouterParam(event, "id") || "0");

  const record = await db.query.media.findFirst({
    where: eq(media.id, id),
  });

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: "Media not found" });
  }

  await deleteFromR2(bucket, record.path);
  await db.delete(media).where(eq(media.id, id));

  return { success: true };
});
