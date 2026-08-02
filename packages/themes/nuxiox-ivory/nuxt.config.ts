export default defineNuxtConfig({
  extends: ['../../base', '../../databases/cloudflare'],
  css: ['~~/packages/themes/nuxiox-ivory/app/assets/theme.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'fa', file: 'fa.json' },
      { code: 'ar', file: 'ar.json' }
    ]
  },
  compatibilityDate: '2025-07-15',
})
