import { H3Event, getRequestURL } from 'h3'
import { useRuntimeConfig } from '#imports'

export function getLocale(event: H3Event) {
  const config = useRuntimeConfig(event)

  const locale =
    getCookie(event, 'i18n_redirected') ||
    config.public.i18n.defaultLocale
  
  return locale
}