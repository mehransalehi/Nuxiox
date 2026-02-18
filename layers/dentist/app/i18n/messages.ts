import { baseMessages as parentMessages } from '#layers/base/app/i18n/messages'
import { defu } from 'defu'

export const baseMessages = defu({
  en: {
    site: {
      brand: 'Dashboard',
    },
  },
  fa: {
    admin: {
      dashboard: 'داشبورد',
    },
  },
}, parentMessages)