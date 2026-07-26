export default defineNuxtConfig({
  extends: ['../databases/cloudflare','../base'],
  css: ['~~/layers/kids/app/assets/theme.css'],
  modules: ['@nuxtjs/i18n'],
  nitro: {
    preset: 'cloudflare-module',
  },
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'fa', file: 'fa.json' }
    ]
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=Vazirmatn:wght@400;500;700;800&display=swap'
        },
      ]
    }
  }
})