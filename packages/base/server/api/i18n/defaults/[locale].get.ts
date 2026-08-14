// server/api/i18n/defaults/[locale].get.ts
// Serves the merged default messages (base + active theme) for a given locale.
// Used by the admin i18n editor to show original/default values.
import { promises as fs } from "fs"
import * as path from "path"

// Base layer locale files (bundled at build time)
import enBase from "~~/packages/base/i18n/locales/en.json"
import faBase from "~~/packages/base/i18n/locales/fa.json"
import arBase from "~~/packages/base/i18n/locales/ar.json"

const baseDefaults: Record<string, any> = { en: enBase, fa: faBase, ar: arBase }

// Deep-merge two objects (mutates target)
function deepMerge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, "locale") || "en"
  if (!baseDefaults[locale]) {
    throw createError({ statusCode: 404, message: `Locale '${locale}' not found` })
  }

  // Start with base layer defaults
  const result = JSON.parse(JSON.stringify(baseDefaults[locale]))

  // Try to load the active theme's locale files (which override/extend base)
  try {
    const rootConfigPath = path.resolve(process.cwd(), "nuxt.config.ts")
    const rootConfig = await fs.readFile(rootConfigPath, "utf-8")
    const themeMatch = rootConfig.match(/extends:\s*\[\s*['"].\/packages\/themes\/([^/'"]+)/)
    if (themeMatch) {
      const themeName = themeMatch[1]
      const themeLocalePath = path.resolve(
        process.cwd(),
        "packages/themes",
        themeName,
        "i18n/locales",
        `${locale}.json`,
      )
      try {
        const themeContent = await fs.readFile(themeLocalePath, "utf-8")
        const themeMessages = JSON.parse(themeContent)
        deepMerge(result, themeMessages)
      } catch {
        // Theme's locale file not found — that's fine
      }
    }
  } catch {
    // Cannot read root config — use base only
  }

  setHeader(event, "Cache-Control", "public, max-age=86400, s-maxage=86400")
  return result
})