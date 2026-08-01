import { z } from "zod";
import { blogPosts } from "~~/server/database/schema.gen";
import { eq } from "drizzle-orm";
import { requireAdmin } from "~~/server/utils/checkAdmin";

import { checkZod } from "~~/server/utils/checkZod";

const schema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!id) throw createError({ statusCode: 400, message: "Post id is required" });

  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event);

  await db
    .update(blogPosts)
    .set({
      status: body.status,
      published_at: body.status === "published" ? new Date() : null,
      updated_at: new Date(),
    })
    .where(eq(blogPosts.id, id));

  return { success: true };
});