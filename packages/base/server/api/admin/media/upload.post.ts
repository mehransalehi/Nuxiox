// server/api/admin/media/upload.post.ts
import { z } from "zod";
import { media } from "~~/server/database/schema.gen";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { uploadFile } from "~~/server/utils/mediaStorage";
import { processImage } from "~~/server/utils/imageProcessor";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  const db = useDb(event);

  const form = await readMultipartFormData(event);
  if (!form) {
    throw createError({ statusCode: 400, message: "No file uploaded" });
  }

  const fileEntry = form.find((item) => item.name === "file");
  const altEntry = form.find((item) => item.name === "alt");
  const titleEntry = form.find((item) => item.name === "title");

  if (!fileEntry || !fileEntry.data) {
    throw createError({ statusCode: 400, message: "File is required" });
  }

  const file = new File([fileEntry.data], fileEntry.filename || "upload", {
    type: fileEntry.type || "application/octet-stream",
  });

  // Validate file type — images only
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, message: "Invalid file type — only images allowed" });
  }

  // Max 2MB
  if (file.size > 2 * 1024 * 1024) {
    throw createError({
      statusCode: 400,
      message: "File too large (max 2MB)",
    });
  }

  const timestamp = Date.now();
  const ext = file.name.split(".").pop();
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
  const filePath = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${filename}`;

  // Process image (extract dimensions)
  const { buffer, width, height } = await processImage(file);

  // Upload to storage (filesystem or KV)
  await uploadFile(event, filePath, buffer, file.type);

  // Save metadata to DB
  const inserted = await db.insert(media).values({
    filename,
    original_name: file.name,
    mime_type: file.type,
    size: file.size,
    path: filePath,
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