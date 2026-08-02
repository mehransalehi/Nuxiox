// packages/themes/dental-clinic/nuxt.config.ts
export default defineNuxtConfig({
  extends: ['../../base', '../../databases/cloudflare'],

  css: ['~~/packages/themes/dental-clinic/app/assets/theme.css'],

  modules: [],

  nitro: {
    preset: 'cloudflare-module',
  },

  compatibilityDate: '2025-07-15',
})
