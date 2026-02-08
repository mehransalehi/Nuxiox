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

export type SiteSettings = {
  general: GeneralSettings
  navbar: NavbarSettings
  footer: FooterSettings
}

export const defaultSettings: SiteSettings = {
  general: {
    showSidebar: true,
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
}
