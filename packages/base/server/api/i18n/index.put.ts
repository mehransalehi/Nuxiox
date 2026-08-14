// server/api/i18n/index.put.ts
// Saves i18n translation overrides. Admin-only.
// Body: { en: { "dotted.key": "value" }, fa: { ... } }
import { settings } from "~~/server/database/schema.gen"
import { requireAdmin } from "~~/server/utils/checkAdmin"
import { upsert } from "~~/server/utils/db/upsert"

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDb(event)
  const body = (await readBody(event)) as Record<string, Record<string, string>>

  // Read existing, merge new overrides per locale
  const existing = await db.query.settings.findFirst({
    where: (s, { eq }) => eq(s.key, "i18n_overrides"),
  })
  const currentValue = (existing?.value as Record<string, any>) ?? {}
  const merged = { ...currentValue }

  for (const [locale, overrides] of Object.entries(body)) {
    if (overrides && typeof overrides === "object") {
      merged[locale] = { ...(merged[locale] ?? {}), ...overrides }
      // Remove empty overrides (key set to "" means reset to default)
      for (const [key, val] of Object.entries(overrides)) {
        if (val === "") {
          delete merged[locale][key]
        }
      }
      // Remove locale entry if empty
      if (Object.keys(merged[locale]).length === 0) {
        delete merged[locale]
      }
    }
  }

  await upsert(
    db,
    settings,
    {
      key: "i18n_overrides",
      value: merged,
      description: "i18n translation overrides",
      isPublic: true,
      updatedAt: new Date(),
    },
    settings.key,
    {
      value: merged,
      updatedAt: new Date(),
    },
  )

  return { success: true }
})