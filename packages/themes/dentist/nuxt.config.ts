// ─── Normal Database (MySQL / libsql) ───────────────────────────────────────
// Active configuration — switch to cloudflare config below for D1.
// export default defineNuxtConfig({
//   extends: ['../../base', '../../databases/normal'],
//   css: ['~~/packages/themes/dentist/app/assets/theme.css'],
//   modules: ['@nuxtjs/i18n'],
//   i18n: {
//     locales: [
//       { code: 'en', file: 'en.json' },
//       { code: 'fa', file: 'fa.json' }
//     ]
//   }
// })

// ─── Cloudflare (D1 / SQLite) ───────────────────────────────────────────────
// Uncomment this block and comment the one above to switch to Cloudflare D1.
// Also update the import path in server/database/schema.gen.ts to point to the
// cloudflare layer.
export default defineNuxtConfig({
  extends: ['../../base', '../../databases/cloudflare'],
  css: ['~~/packages/themes/dentist/app/assets/theme.css'],
  modules: ['@nuxtjs/i18n'],
  nitro: {
    preset: 'cloudflare-module',
  },
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'fa', file: 'fa.json' }
    ]
  }
})