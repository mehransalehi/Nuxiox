import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './**/*.{vue,js,ts}', // all vue/js/ts files in this layer
  ],
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('rtl', '[dir=\"rtl\"] &')
      addVariant('ltr', '[dir=\"ltr\"] &')
    }),
  ],
}
