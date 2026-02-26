export default defineNuxtConfig({
  extends: ['../base'],
  css: ['~~/layers/dentist/app/assets/theme.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'fa', file: 'fa.json' }
    ]
  }
})
