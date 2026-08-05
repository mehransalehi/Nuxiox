declare const defineNuxtConfig: any

export default defineNuxtConfig({
  extends: ['../../base', '../../databases/cloudflare'],

  css: ['~~/packages/themes/mim-beauty/app/assets/theme.css'],

  modules: ['@nuxtjs/i18n'],

  nitro: {
    preset: 'cloudflare-module',
  },

  i18n: {
    locales: [
      { code: 'fa', file: 'fa.json' },
      { code: 'en', file: 'en.json' },
      { code: 'ar', file: 'ar.json' },
    ],
  },

  compatibilityDate: '2025-07-15',
})
