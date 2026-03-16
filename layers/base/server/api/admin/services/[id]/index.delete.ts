import { eq } from 'drizzle-orm'
import { services } from '~~/server/database/schema.gen'
import { useDb } from '~~/server/utils/db'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const id = Number(getRouterParam(event, 'id'))

  await useDb(event).delete(services).where(eq(services.id, id))

  return { success: true }
})
