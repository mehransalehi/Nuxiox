import { eq } from 'drizzle-orm'
import { settings } from '~~/server/database/schema.gen'
import { defaultHomeBuilder } from '~~/layers/base/utils/page-builder'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, 'home_sections'))
  return row?.value ?? structuredClone(defaultHomeBuilder)
})
