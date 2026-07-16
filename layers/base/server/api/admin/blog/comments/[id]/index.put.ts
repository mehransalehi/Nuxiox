import { eq } from "drizzle-orm";
import { z } from "zod";
import { blogComments } from "~~/server/database/schema.gen";
 ;
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { checkZod } from "~~/server/utils/checkZod";

const schema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, "id"));
  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Comment id is required",
    });

  const body = await readValidatedBody(event, checkZod(schema));
  const db = useDb(event);

  await db
    .update(blogComments)
    .set({ status: body.status })
    .where(eq(blogComments.id, id));
  return { success: true };
});
