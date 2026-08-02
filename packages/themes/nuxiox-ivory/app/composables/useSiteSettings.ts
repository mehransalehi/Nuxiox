import { ref, computed } from 'vue';

export interface SiteSettings {
  general: {
    showSidebar: boolean;
    direction: 'ltr' | 'rtl';
    language: 'en' | 'fa' | 'ar';
  };
  navbar: {
    menus: { label: string; href: string }[];
    darkLogo: string;
    lightLogo: string;
    info: { key: string; value: string }[];
  };
  footer: {
    menus: { label: string; href: string }[];
    darkLogo: string;
    lightLogo: string;
    info: { key: string; value: string }[];
  };
  blog: {
    commentsEnabled: boolean;
    commentsRequireApproval: boolean;
    allowAnonymousCommentsByDefault: boolean;
    recaptchaSiteKey: string;
    recaptchaSecretKey: string;
  };
  seo: {
    siteName: string;
    siteUrl: string;
    defaultTitle: string;
    titleSuffix: string;
    defaultDescription: string;
    defaultOgImage: string;
    robots: string;
    twitterHandle: string;
    googleSiteVerification: string;
    bingSiteVerification: string;
    yandexVerification: string;
  };
  theme: {
    preset: string;
    light: { primary: string; secondary: string; accent: string; neutral: string };
    dark: { primary: string; secondary: string; accent: string; neutral: string };
  };
  about: {
    info: { key: string; value: string }[];
  };
}

const settingsData = ref<SiteSettings>({
  general: { showSidebar: false, direction: 'ltr', language: 'en' },
  navbar: {
    menus: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/#about' },
      { label: 'Services', href: '/#services' },
      { label: 'Results', href: '/#results' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact Us', href: '/#contact' },
    ],
    darkLogo: '/src/assets/images/hero_implant_render_1785665450567.jpg',
    lightLogo: '/src/assets/images/hero_implant_render_1785665450567.jpg',
    info: [
      { key: 'phone', value: '+49 30 892 1011' },
      { key: 'hours', value: 'Mon-Sat: 08:00 - 19:00' },
      { key: 'location', value: 'Germany, Berlin' },
    ],
  },
  footer: {
    menus: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/#about' },
      { label: 'Services', href: '/#services' },
      { label: 'Results', href: '/#results' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact Us', href: '/#contact' },
    ],
    darkLogo: '/src/assets/images/hero_implant_render_1785665450567.jpg',
    lightLogo: '/src/assets/images/hero_implant_render_1785665450567.jpg',
    info: [
      { key: 'address', value: 'Friedrichstraße 123, 10117 Berlin, Germany' },
      { key: 'email', value: 'ivoryclinic.eu@gmail.com' },
      { key: 'phone', value: '+49 30 892 1011' },
      { key: 'copyright', value: '© 2026 Ivory Clinic. All rights reserved.' },
    ],
  },
  blog: {
    commentsEnabled: true,
    commentsRequireApproval: false,
    allowAnonymousCommentsByDefault: true,
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
  },
  seo: {
    siteName: 'Ivory Dental Clinic',
    siteUrl: 'https://ivoryclinic.eu',
    defaultTitle: 'Ivory Dental Clinic — Innovative Implantology & Smile Aesthetics',
    titleSuffix: 'Ivory Dental Clinic',
    defaultDescription: 'High-end dental clinic specialized in Straumann dental implants, teeth whitening, prosthetics, and 3D digital diagnosis.',
    defaultOgImage: '/src/assets/images/smile_patient_hero_1785665461829.jpg',
    robots: 'index, follow',
    twitterHandle: '@ivorydental',
    googleSiteVerification: '',
    bingSiteVerification: '',
    yandexVerification: '',
  },
  theme: {
    preset: 'light',
    light: {
      primary: '#00C4DF',
      secondary: '#0284C7',
      accent: '#38BDF8',
      neutral: '#0F172A',
    },
    dark: {
      primary: '#38BDF8',
      secondary: '#00C4DF',
      accent: '#0284C7',
      neutral: '#F8FAFC',
    },
  },
  about: {
    info: [
      { key: 'phone', value: '+49 30 892 1011' },
      { key: 'email', value: 'ivoryclinic.eu@gmail.com' },
      { key: 'address', value: 'Friedrichstraße 123, 10117 Berlin' },
      { key: 'hours', value: 'Mon-Fri 08:00-19:00, Sat 09:00-15:00' },
      { key: 'emergency_phone', value: '+49 170 555 4321' },
      { key: 'facebook', value: 'https://facebook.com' },
      { key: 'instagram', value: 'https://instagram.com' },
      { key: 'years_exp', value: '12' },
      { key: 'clinics_count', value: '04' },
      { key: 'patients_restored', value: '1350+' },
      { key: 'reviews_count', value: '12,398' },
    ],
  },
});

let isFetching = false;

export function useSiteSettings() {
  const refreshSettings = async () => {
    if (isFetching) return;
    isFetching = true;
    try {
      const res = await fetch('/api/settings/public');
      if (res.ok) {
        const data = await res.json();
        settingsData.value = data;
      }
    } catch (e) {
      console.warn('Could not refresh public settings from API, using default', e);
    } finally {
      isFetching = false;
    }
  };

  if (typeof window !== 'undefined' && !settingsData.value.about?.info?.length) {
    refreshSettings();
  }

  return {
    settings: computed(() => settingsData.value),
    refreshSettings,
  };
}

export function getInfoValue(settings: SiteSettings, keyName: string, fallback = ''): string {
  if (!settings) return fallback;
  const allInfo = [
    ...(settings.about?.info ?? []),
    ...(settings.footer?.info ?? []),
    ...(settings.navbar?.info ?? []),
  ];
  const match = allInfo.find(i => i.key.toLowerCase() === keyName.toLowerCase());
  return match ? match.value : fallback;
}
