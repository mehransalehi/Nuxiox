// server/api/admin/media/[id]/index.delete.ts
import { media } from "~~/server/database/schema.gen";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { deleteFile } from "~~/server/utils/mediaStorage";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const db = useDb(event);
  const id = parseInt(getRouterParam(event, "id") || "0");

  const record = await db.query.media.findFirst({
    where: eq(media.id, id),
  });

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: "Media not found" });
  }

  await deleteFile(event, record.path);
  await db.delete(media).where(eq(media.id, id));

  return { success: true };
});