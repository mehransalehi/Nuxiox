import { eq } from "drizzle-orm"
import { blogCategories } from "~~/server/database/schema.gen"
 
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = Number(getRouterParam(event, "id"))
  if (!id)
    throw createError({ statusCode: 400, statusMessage: "Category id is required" })

  const db = useDb(event)

  await db.delete(blogCategories).where(eq(blogCategories.id, id))

  return { success: true }
})
