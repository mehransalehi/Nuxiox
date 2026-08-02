import { ref, computed, onMounted } from 'vue';

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

const defaultSettings: SiteSettings = {
  general: {
    showSidebar: true,
    direction: 'ltr',
    language: 'en'
  },
  navbar: {
    menus: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/#services" },
      { label: "About Us", href: "/#about" },
      { label: "Why Us", href: "/#whyus" },
      { label: "Technology", href: "/#technology" },
      { label: "Specialists", href: "/#team" },
      { label: "Results", href: "/#results" },
      { label: "Reviews", href: "/#testimonials" },
      { label: "Articles", href: "/#blog" },
      { label: "Emergency", href: "/emergency-care" },
      { label: "Contact & Book", href: "/#contact" }
    ],
    darkLogo: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=120&q=80",
    lightLogo: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=120&q=80",
    info: [
      { key: "phone", value: "+1 (800) 555-SMILE" },
      { key: "hours", value: "Mon-Sat: 8:00 AM - 7:00 PM" },
      { key: "emergency", value: "24/7 Priority Hotline" }
    ]
  },
  footer: {
    menus: [
      { label: "Cosmetic Dentistry", href: "/#services" },
      { label: "Computer-Guided Implants", href: "/#services" },
      { label: "Invisible Aligners", href: "/#services" },
      { label: "Laser Teeth Whitening", href: "/#services" },
      { label: "Emergency Dental Care", href: "/emergency-care" },
      { label: "Pricing & Financing", href: "/pricing-plans" }
    ],
    darkLogo: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=120&q=80",
    lightLogo: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=120&q=80",
    info: [
      { key: "address", value: "742 Medical Plaza, Suite 400, Beverly Hills, CA" },
      { key: "email", value: "concierge@smilecraftdental.com" },
      { key: "phone", value: "+1 (800) 555-7645" }
    ]
  },
  blog: {
    commentsEnabled: true,
    commentsRequireApproval: false,
    allowAnonymousCommentsByDefault: true,
    recaptchaSiteKey: "",
    recaptchaSecretKey: ""
  },
  seo: {
    siteName: "SmileCraft Dental Clinic",
    siteUrl: "https://smilecraftdental.com",
    defaultTitle: "SmileCraft | Advanced Dental Care & Cosmetic Excellence",
    titleSuffix: "SmileCraft Dental Clinic",
    defaultDescription: "Premier cosmetic and restorative dental practice offering 3D guided implants, laser teeth whitening, invisible aligners, and painless dental care.",
    defaultOgImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200",
    robots: "index, follow",
    twitterHandle: "@SmileCraftDental",
    googleSiteVerification: "",
    bingSiteVerification: "",
    yandexVerification: ""
  },
  theme: {
    preset: "medical-teal",
    light: { primary: "#0d9488", secondary: "#0284c7", accent: "#0d9488", neutral: "#0f172a" },
    dark: { primary: "#14b8a6", secondary: "#38bdf8", accent: "#14b8a6", neutral: "#f8fafc" }
  },
  about: {
    info: [
      { key: "Years of Excellence", value: "18+ Years" },
      { key: "Happy Patients", value: "18,500+" },
      { key: "Board Certified Doctors", value: "12 Specialists" },
      { key: "Success Rate", value: "99.6%" },
      { key: "3D Digital Precision", value: "100% Digital Scans" }
    ]
  }
};

const settingsState = ref<SiteSettings>(defaultSettings);

export function useSiteSettings() {
  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings/public');
      if (res.ok) {
        const data = await res.json();
        settingsState.value = data;
      }
    } catch (err) {
      console.warn('Failed to fetch site settings, using default', err);
    }
  };

  onMounted(() => {
    refreshSettings();
  });

  return {
    settings: computed(() => settingsState.value),
    refreshSettings
  };
}
