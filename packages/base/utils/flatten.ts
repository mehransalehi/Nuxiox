// packages/base/utils/flatten.ts
// Flatten/unflatten nested objects to/from dotted-key maps.
// Used for i18n translation overrides — stored as dotted keys in DB,
// merged as nested objects via vue-i18n's mergeLocaleMessage.

/**
 * Unflatten a dotted-key map into a nested object.
 * @example unflatten({ "common.save": "ذخیره", "admin.settings.title": "تنظیمات" })
 *          → { common: { save: "ذخیره" }, admin: { settings: { title: "تنظیمات" } } }
 */
export function unflatten(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".")
    let current = result
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = current[parts[i]] ?? {}
      current = current[parts[i]]
    }
    current[parts[parts.length - 1]] = value
  }
  return result
}

/**
 * Flatten a nested object into a dotted-key map.
 * @example flatten({ common: { save: "ذخیره" }, admin: { settings: { title: "تنظیمات" } } })
 *          → { "common.save": "ذخیره", "admin.settings.title": "تنظیمات" }
 */
export function flatten(
  obj: Record<string, any>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey))
    } else if (typeof value === "string") {
      result[fullKey] = value
    }
  }
  return result
}