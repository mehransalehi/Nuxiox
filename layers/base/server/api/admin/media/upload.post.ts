// server/api/admin/media/upload.post.ts
import { z } from "zod";
import { media } from "~~/server/database/schema.gen";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { getR2Bucket, uploadToR2 } from "~~/server/utils/r2";
import { processImage } from "~~/server/utils/imageProcessor";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const db = useDb(event);
  const bucket = getR2Bucket(event);

  const form = await readMultipartFormData(event);
  if (!form) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  const fileEntry = form.find((item) => item.name === "file");
  const altEntry = form.find((item) => item.name === "alt");
  const titleEntry = form.find((item) => item.name === "title");

  if (!fileEntry || !fileEntry.data) {
    throw createError({ statusCode: 400, statusMessage: "File is required" });
  }

  const file = new File([fileEntry.data], fileEntry.filename || "upload", {
    type: fileEntry.type || "application/octet-stream",
  });

  // Validate file type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file type" });
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw createError({
      statusCode: 400,
      statusMessage: "File too large (max 10MB)",
    });
  }

  const timestamp = Date.now();
  const ext = file.name.split(".").pop();
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
  const path = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${filename}`;

  // Process image
  const { buffer, width, height } = await processImage(file);

  // Upload to R2
  await uploadToR2(bucket, path, buffer, file.type);

  // Save to DB
  const inserted = await db.insert(media).values({
    filename,
    original_name: file.name,
    mime_type: file.type,
    size: file.size,
    path,
    thumbnail_path: null,
    alt: altEntry?.data?.toString() || null,
    title: titleEntry?.data?.toString() || null,
    width,
    height,
    uploaded_by: admin.id,
  }).returning({ id: media.id });

  const record = await db.query.media.findFirst({
    where: eq(media.id, inserted[0].id),
  });

  return record;
});