export type MenuItem = {
  label: string
  href: string
}

export type InfoItem = {
  key: string
  value: string
}

export type GeneralSettings = {
  showSidebar: boolean
  direction: 'ltr' | 'rtl'
  language: 'en' | 'fa'
}

export type NavbarSettings = {
  menus: MenuItem[]
  darkLogo: string
  lightLogo: string
  info: InfoItem[]
}

export type FooterSettings = {
  menus: MenuItem[]
  darkLogo: string
  lightLogo: string
  info: InfoItem[]
}

export type BlogSettings = {
  commentsEnabled: boolean
  commentsRequireApproval: boolean
  allowAnonymousCommentsByDefault: boolean
  recaptchaSiteKey: string
  recaptchaSecretKey: string
}

export type SeoSettings = {
  siteName: string
  siteUrl: string
  defaultTitle: string
  titleSuffix: string
  defaultDescription: string
  defaultOgImage: string
  robots: string
  twitterHandle: string
  googleSiteVerification: string
  bingSiteVerification: string
  yandexVerification: string
}

export type AboutSettings = {
  info: InfoItem[]
}

export type SiteSettings = {
  general: GeneralSettings
  navbar: NavbarSettings
  footer: FooterSettings
  blog: BlogSettings
  seo: SeoSettings
  theme: ThemeSettings
  about: AboutSettings
}

export type ThemePalette = {
  primary: string
  secondary: string
  accent: string
  neutral: string
}

export type ThemeSettings = {
  preset: string
  light: ThemePalette
  dark: ThemePalette
}

export const defaultThemePalette: ThemePalette = {
  primary: '#570df8',
  secondary: '#f000b8',
  accent: '#37cdbe',
  neutral: '#3d4451',
}

export const defaultSettings: SiteSettings = {
  general: {
    showSidebar: true,
    direction: 'ltr',
    language: 'en',
  },
  navbar: {
    menus: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    darkLogo: 'https://placehold.co/140x40/111827/FFFFFF?text=Logo',
    lightLogo: 'https://placehold.co/140x40/E5E7EB/111827?text=Logo',
    info: [
      { key: 'Email', value: 'hello@example.com' },
      { key: 'Phone', value: '+1 (555) 123-4567' },
    ],
  },
  footer: {
    menus: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Support', href: '/support' },
    ],
    darkLogo: 'https://placehold.co/140x40/111827/FFFFFF?text=Footer',
    lightLogo: 'https://placehold.co/140x40/E5E7EB/111827?text=Footer',
    info: [
      { key: 'Address', value: '123 Market Street, San Francisco' },
      { key: 'Twitter', value: 'https://twitter.com/example' },
    ],
  },
  blog: {
    commentsEnabled: true,
    commentsRequireApproval: true,
    allowAnonymousCommentsByDefault: true,
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
  },
  seo: {
    siteName: 'Nuxiox',
    siteUrl: '',
    defaultTitle: 'Nuxiox',
    titleSuffix: '',
    defaultDescription: 'Modern website powered by Nuxiox.',
    defaultOgImage: '',
    robots: 'index,follow',
    twitterHandle: '',
    googleSiteVerification: '',
    bingSiteVerification: '',
    yandexVerification: '',
  },
  theme: {
    preset: 'light',
    light: { ...defaultThemePalette },
    dark: { ...defaultThemePalette },
  },
  about: {
    info: [
      { key: 'Experience', value: '10+ years' },
      { key: 'Projects', value: '120+' },
    ],
  },
}
