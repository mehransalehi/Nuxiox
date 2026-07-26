import { eq } from 'drizzle-orm'
import { settings } from '~~/server/database/schema.gen'
import { defaultHomeBuilder } from '~~/packages/base/utils/page-builder'
import { requireAdmin } from "~~/server/utils/checkAdmin";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)

  const db = useDb(event)
  const [row] = await db.select().from(settings).where(eq(settings.key, 'home_sections'))
  return typeof row?.value == 'string' ? JSON.parse(row?.value) : row?.value ?? structuredClone(defaultHomeBuilder)
})
