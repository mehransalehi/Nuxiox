// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['nitro-cloudflare-dev', 'nuxt-auth-utils', '@pinia/nuxt', '@nuxt/image', '@nuxtjs/i18n'],

  nitro: {
    preset: 'cloudflare-module',
  },

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
        },
      ],
    },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'fa', name: 'Persian', file: 'fa.json' }
    ]
  },

  vite: {
    plugins: [tailwindcss()],
  },

  extends: ['./layers/dentist'],
  watch: ['layers/**/*'],
})