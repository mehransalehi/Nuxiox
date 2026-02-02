// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  // 1. Enable the dev proxy module
  modules: ['nitro-cloudflare-dev', 'nuxt-auth-utils'],

  nitro: {
    // 2. Tell Nitro to build for Cloudflare Workers
    preset: 'cloudflare-module',
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      (tailwindcss as any)(),
    ],
  },
  extends: [
    // Extend from a local layer
    './layers/base',
  ]
})