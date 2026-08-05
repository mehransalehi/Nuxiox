// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['nitro-cloudflare-dev', 'nuxt-auth-utils', '@pinia/nuxt', '@nuxt/image', '@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          // href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
          href: 'http://localhost:3000/libs/fontawesome-6.5.2/css/all.min.css',
        },
      ],
    },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fa', name: 'Persian', file: 'fa.json' },
      { code: 'ar', name: 'Arabic', file: 'ar.json' }
    ]
  },

  vite: {
    plugins: [tailwindcss()],
  },

  extends: ['./packages/themes/kinker'],
  watch: ['packages/**/*'],
})