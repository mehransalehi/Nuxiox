import { settings } from "~~/server/database/schema.gen";
import {
  defaultSettings,
  type SiteSettings,
  type SiteSettingsLocale,
} from "~~/packages/base/utils/settings";
import { getLocale } from "~~/server/utils/getLocale";
import { requireAdmin } from "~~/server/utils/checkAdmin";
import { upsert } from "~~/server/utils/db/upsert";

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);

  const db = useDb(event);
  const locale = getLocale(event);
  const now = new Date();

  const body = (await readBody(event)) as Partial<SiteSettings>;

  // Generate a localized payload for each section dynamically
  const payload = Object.fromEntries(
    Object.entries(defaultSettings).map(([key, defaults]) => [
      key,
      { [locale]: { ...defaults, ...(body[key as keyof SiteSettings] ?? {}) } },
    ]),
  ) as SiteSettingsLocale;


  // Helper to upsert + merge existing locales
  const upsertSetting = async <K extends keyof SiteSettingsLocale>(
    key: K,
    description: string,
    isPublic = true,
  ) => {
    // Read existing setting for this key
    const existing = await db.query.settings.findFirst({
      where: (s, { eq }) => eq(s.key, key),
    });

    // Merge old locales + new locale
    const mergedValue = {
      ...(existing?.value ?? {}),
      ...payload[key],
    };

    // Upsert new data
    await upsert(
      db,
      settings,
      {
        key,
        value: mergedValue,
        description,
        isPublic,
        updatedAt: now,
      },
      settings.key,
      {
        value: mergedValue,
        description,
        isPublic,
        updatedAt: now,
      },
    );
  };

  // Define simple metadata for each setting
  const settingMeta: {
    [K in keyof SiteSettingsLocale]: { desc: string; isPublic?: boolean };
  } = {
    general: { desc: "General settings" },
    navbar: { desc: "Navbar settings" },
    footer: { desc: "Footer settings" },
    blog: { desc: "Blog settings", isPublic: false },
    seo: { desc: "SEO settings" },
    theme: { desc: "Theme settings" },
    about: { desc: "About section settings" },
  };

  // Loop all keys and perform upsert
  for (const [key, { desc, isPublic }] of Object.entries(settingMeta) as [
    keyof SiteSettingsLocale,
    { desc: string; isPublic?: boolean },
  ][]) {
    await upsertSetting(key, desc, isPublic ?? true);
  }

  return { success: true };
});
