import { settings } from "~~/server/database/schema.gen";
import {
  defaultSeoSettingsGlobal,
  defaultSeoSettingsLocale,
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
  const now = new Date();

  const body = (await readBody(event)) as Partial<SiteSettings & { _locale?: string }>;
  const locale = body._locale || getLocale(event);

  // Generate a localized payload for each section dynamically
  const payload = Object.fromEntries(
    Object.entries(defaultSettings).map(([key, defaults]) => [
      key,
      { [locale]: { ...defaults, ...(body[key as keyof SiteSettings] ?? {}) } },
    ]),
  ) as SiteSettingsLocale;

  // Override SEO payload: split locale fields under [locale], globals under globals
  if (body.seo) {
    payload.seo = {
      [locale]: {
        siteName: body.seo.siteName,
        defaultTitle: body.seo.defaultTitle,
        titleSuffix: body.seo.titleSuffix,
        defaultDescription: body.seo.defaultDescription,
        defaultOgImage: body.seo.defaultOgImage,
      },
      globals: {
        siteUrl: body.seo.siteUrl,
        robots: body.seo.robots,
        twitterHandle: body.seo.twitterHandle,
        googleSiteVerification: body.seo.googleSiteVerification,
        bingSiteVerification: body.seo.bingSiteVerification,
        yandexVerification: body.seo.yandexVerification,
      },
    }
  }

  // Override general payload: locale fields under [locale], favicon under globals (site-wide)
  if (body.general) {
    payload.general = {
      [locale]: {
        showSidebar: body.general.showSidebar,
        direction: body.general.direction,
      },
      globals: {
        favicon: body.general.favicon,
        language: body.general.language, // admin panel language — global, not per-locale
      },
    }
  }

  // Override i18n payload: store under globals (site-wide, not per-locale)
  if (body.i18n) {
    payload.i18n = {
      globals: {
        defaultLocale: body.i18n.defaultLocale,
      },
    }
  }


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
    i18n: { desc: "i18n locale settings" },
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
