export default defineNuxtConfig({
  extends: ['../databases/normal','../base'],
  css: ['~~/layers/dentist/app/assets/theme.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'fa', file: 'fa.json' }
    ]
  }
})


//config for using cloudflare
/* export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-module',
  },
  extends: ['../databases/cloudflare','../base'],
  css: ['~~/layers/dentist/app/assets/theme.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'fa', file: 'fa.json' }
    ]
  }
}) */
