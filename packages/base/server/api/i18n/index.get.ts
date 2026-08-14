// server/api/i18n/index.get.ts
// Returns i18n translation overrides stored in settings.
// Public — used by the frontend plugin to merge overrides at runtime.
import { settings } from "~~/server/database/schema.gen"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const db = useDb(event)
  const row = await db.query.settings.findFirst({
    where: eq(settings.key, "i18n_overrides"),
  })

  setHeader(event, "Cache-Control", "public, max-age=60, s-maxage=300")
  return (row?.value as Record<string, any>) ?? {}
})