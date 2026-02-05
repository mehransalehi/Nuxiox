// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['nitro-cloudflare-dev', 'nuxt-auth-utils'],

  nitro: {
    preset: 'cloudflare-module',
  },

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  extends: ['./layers/base'],
  watch: ['layers/**/*'],
})
