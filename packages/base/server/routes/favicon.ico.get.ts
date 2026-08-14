// server/routes/favicon.ico.get.ts
// Serve the custom favicon from settings, or fall back to the default static favicon.
import { settings } from "~~/server/database/schema.gen"
import { media } from "~~/server/database/schema.gen"
import { getFile } from "~~/server/utils/mediaStorage"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const db = useDb(event)

  // Read custom favicon from settings (general.globals.favicon)
  const row = await db.query.settings.findFirst({
    where: (s, { eq }) => eq(s.key, "general"),
  })

  let faviconUrl = ""
  if (row?.value) {
    const value = typeof row.value === "string" ? JSON.parse(row.value) : row.value
    faviconUrl = value?.globals?.favicon || ""
  }

  // If a custom favicon URL is set, extract media id and serve the file
  if (faviconUrl) {
    const match = faviconUrl.match(/\/api\/admin\/media\/(\d+)\/file/)
    if (match) {
      const id = parseInt(match[1], 10)
      const record = await db.query.media.findFirst({
        where: eq(media.id, id),
      })
      if (record) {
        const result = await getFile(event, record.path)
        if (result) {
          setHeader(event, "Content-Type", record.mime_type)
          setHeader(event, "Cache-Control", "public, max-age=31536000")
          return result.body
        }
      }
    }
  }

  // Fall back to the default static favicon (public/default-favicon.ico)
  try {
    const fallback = await useStorage("assets:server").getItemRaw("default-favicon.ico")
    if (fallback) {
      setHeader(event, "Content-Type", "image/x-icon")
      setHeader(event, "Cache-Control", "public, max-age=31536000")
      return fallback
    }
  } catch {
    // assets:server not available — return 404
  }

  throw createError({ statusCode: 404, message: "No favicon configured" })
})