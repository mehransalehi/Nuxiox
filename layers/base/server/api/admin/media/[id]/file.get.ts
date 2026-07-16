// server/api/admin/media/[id]/file.get.ts
import { media } from "~~/server/database/schema.gen";
 ;
import { getR2Bucket } from "~~/server/utils/r2";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = useDb(event);
  const bucket = getR2Bucket(event);
  const id = parseInt(getRouterParam(event, "id") || "0");

  const record = await db.query.media.findFirst({
    where: eq(media.id, id),
  });

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: "Media not found" });
  }

  const object = await bucket.get(record.path);
  if (!object) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  setHeader(event, "Content-Type", record.mimeType);
  setHeader(event, "Cache-Control", "public, max-age=31536000");
  
  return object.body;
});
