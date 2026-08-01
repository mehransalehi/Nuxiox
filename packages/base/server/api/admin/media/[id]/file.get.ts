// server/api/admin/media/[id]/file.get.ts
import { media } from "~~/server/database/schema.gen";
import { getFile } from "~~/server/utils/mediaStorage";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const id = parseInt(getRouterParam(event, "id") || "0");

  const record = await db.query.media.findFirst({
    where: eq(media.id, id),
  });

  if (!record) {
    throw createError({ statusCode: 404, message: "Media not found" });
  }

  const result = await getFile(event, record.path);
  if (!result) {
    throw createError({ statusCode: 404, message: "File not found in storage" });
  }

  setHeader(event, "Content-Type", record.mime_type);
  setHeader(event, "Cache-Control", "public, max-age=31536000");

  return result.body;
});