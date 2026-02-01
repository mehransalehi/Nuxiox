// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 1. Enable the dev proxy module
  modules: ['nitro-cloudflare-dev'],

  nitro: {
    // 2. Tell Nitro to build for Cloudflare Workers
    preset: 'cloudflare-module',
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
