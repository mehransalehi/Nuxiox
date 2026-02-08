type Locale = 'en' | 'fa'

const messages = {
  en: {
    languages: {
      english: 'English',
      persian: 'Persian',
    },
    common: {
      saveSettings: 'Save Settings',
      loadingSettings: 'Loading settings...',
      unableToLoadSettings: 'Unable to load settings.',
      addMenu: 'Add menu',
      addInfo: 'Add info',
      menus: 'Menus',
      infoList: 'Info list',
      lightLogoUrl: 'Light logo URL',
      darkLogoUrl: 'Dark logo URL',
      label: 'Label',
      valueOrUrl: 'Value or URL',
      pathPlaceholder: '/path',
      closeSidebar: 'Close sidebar',
      dragToReorder: 'Drag to reorder',
    },
    auth: {
      signIn: 'Sign in',
      loginToPanel: 'Login to your admin panel',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      signingIn: 'Signing in…',
      loginFailed: 'Login failed',
    },
    site: {
      mainMenu: 'Main Menu',
      toggleSidebar: 'Toggle sidebar',
      openMenu: 'Open menu',
      brand: 'Brand',
      stayConnected: 'Stay connected with us through the links below.',
      thanks: 'Thanks for visiting.',
      menu: 'Menu',
      information: 'Information',
      language: 'Language',
    },
    admin: {
      sidebar: {
        adminPanel: 'Admin Panel',
        baseLayer: 'Base Layer',
        main: 'Main',
        management: 'Management',
        dashboard: 'Dashboard',
        settings: 'Settings',
        logout: 'Logout',
      },
      topbar: {
        title: 'Dashboard',
        subtitle: 'Welcome to your admin workspace',
        openSidebar: 'Open sidebar',
        openUserMenu: 'Open user menu',
        logout: 'Logout',
      },
      sidebarToggle: {
        expand: 'Expand sidebar',
        collapse: 'Collapse sidebar',
      },
      theme: {
        lightMode: 'Switch to light mode',
        darkMode: 'Switch to dark mode',
      },
      dashboard: {
        welcomeBack: 'Welcome back',
        noUser: 'No user loaded',
        logout: 'Logout',
        overview: 'Overview',
        overviewBody:
          'This is the main content section where each admin page details can be rendered inside the reusable admin base layout.',
        revenue: 'Revenue',
        orders: 'Orders',
        users: 'Users',
        conversion: 'Conversion',
      },
      settings: {
        title: 'Settings',
        description: 'Configure general layout, navbar, and footer settings.',
        generalTab: 'General Settings',
        navbarTab: 'Navbar Settings',
        footerTab: 'Footer Settings',
        generalTitle: 'General Settings',
        showSidebar: 'Show main sidebar',
        direction: 'Layout direction',
        language: 'Website language',
        directionLtr: 'Left to right (LTR)',
        directionRtl: 'Right to left (RTL)',
        navbarTitle: 'Navbar Settings',
        navbarDescription: 'Manage menu items, logos, and info links.',
        footerTitle: 'Footer Settings',
        footerDescription: 'Manage footer menus, logos, and info links.',
        settingsSaved: 'Settings saved successfully.',
        settingsFailed: 'Failed to save settings.',
      },
    },
    page: {
      homeTitle: 'THIS IS INDEX',
    },
  },
  fa: {
    languages: {
      english: 'انگلیسی',
      persian: 'فارسی',
    },
    common: {
      saveSettings: 'ذخیره تنظیمات',
      loadingSettings: 'در حال بارگذاری تنظیمات...',
      unableToLoadSettings: 'امکان بارگذاری تنظیمات وجود ندارد.',
      addMenu: 'افزودن منو',
      addInfo: 'افزودن اطلاعات',
      menus: 'منوها',
      infoList: 'لیست اطلاعات',
      lightLogoUrl: 'آدرس لوگوی روشن',
      darkLogoUrl: 'آدرس لوگوی تیره',
      label: 'عنوان',
      valueOrUrl: 'مقدار یا آدرس',
      pathPlaceholder: '/مسیر',
      closeSidebar: 'بستن سایدبار',
      dragToReorder: 'برای جابه‌جایی بکشید',
    },
    auth: {
      signIn: 'ورود',
      loginToPanel: 'ورود به پنل مدیریت',
      email: 'ایمیل',
      password: 'رمز عبور',
      login: 'ورود',
      signingIn: 'در حال ورود…',
      loginFailed: 'ورود ناموفق بود',
    },
    site: {
      mainMenu: 'منوی اصلی',
      toggleSidebar: 'باز و بسته کردن سایدبار',
      openMenu: 'باز کردن منو',
      brand: 'برند',
      stayConnected: 'از طریق لینک‌های زیر با ما در ارتباط باشید.',
      thanks: 'ممنون از بازدید شما.',
      menu: 'منو',
      information: 'اطلاعات',
      language: 'زبان',
    },
    admin: {
      sidebar: {
        adminPanel: 'پنل مدیریت',
        baseLayer: 'لایه پایه',
        main: 'اصلی',
        management: 'مدیریت',
        dashboard: 'داشبورد',
        settings: 'تنظیمات',
        logout: 'خروج',
      },
      topbar: {
        title: 'داشبورد',
        subtitle: 'به فضای مدیریت خود خوش آمدید',
        openSidebar: 'باز کردن سایدبار',
        openUserMenu: 'باز کردن منوی کاربر',
        logout: 'خروج',
      },
      sidebarToggle: {
        expand: 'باز کردن سایدبار',
        collapse: 'جمع کردن سایدبار',
      },
      theme: {
        lightMode: 'تغییر به حالت روشن',
        darkMode: 'تغییر به حالت تیره',
      },
      dashboard: {
        welcomeBack: 'خوش آمدید',
        noUser: 'کاربری بارگذاری نشده است',
        logout: 'خروج',
        overview: 'نمای کلی',
        overviewBody:
          'این بخش اصلی است که در آن جزئیات صفحات مدیریت در قالب پایه نمایش داده می‌شوند.',
        revenue: 'درآمد',
        orders: 'سفارش‌ها',
        users: 'کاربران',
        conversion: 'نرخ تبدیل',
      },
      settings: {
        title: 'تنظیمات',
        description: 'تنظیمات کلی، ناوبری و فوتر را پیکربندی کنید.',
        generalTab: 'تنظیمات عمومی',
        navbarTab: 'تنظیمات ناوبری',
        footerTab: 'تنظیمات فوتر',
        generalTitle: 'تنظیمات عمومی',
        showSidebar: 'نمایش سایدبار اصلی',
        direction: 'جهت چیدمان',
        language: 'زبان وب‌سایت',
        directionLtr: 'چپ به راست (LTR)',
        directionRtl: 'راست به چپ (RTL)',
        navbarTitle: 'تنظیمات ناوبری',
        navbarDescription: 'مدیریت آیتم‌های منو، لوگوها و اطلاعات تماس.',
        footerTitle: 'تنظیمات فوتر',
        footerDescription: 'مدیریت منوهای فوتر، لوگوها و اطلاعات تماس.',
        settingsSaved: 'تنظیمات با موفقیت ذخیره شد.',
        settingsFailed: 'ذخیره تنظیمات ناموفق بود.',
      },
    },
    page: {
      homeTitle: 'این صفحه اصلی است',
    },
  },
} as const

const getValueByPath = (obj: Record<string, any>, path: string) =>
  path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)

export const useI18n = () => {
  const localeCookie = useCookie<Locale | null>('site-locale', {
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  const locale = useState<Locale>('locale', () => localeCookie.value ?? 'en')

  const setLocale = (value: Locale, options: { persist?: boolean } = {}) => {
    locale.value = value
    if (options.persist !== false) {
      localeCookie.value = value
    }
  }

  const setLocaleFromSettings = (settingsLocale?: Locale) => {
    if (localeCookie.value) {
      locale.value = localeCookie.value
      return
    }
    if (settingsLocale) {
      setLocale(settingsLocale, { persist: false })
    }
  }

  const t = (key: string) => {
    const current = messages[locale.value] as Record<string, any>
    const value = getValueByPath(current, key)
    return value ?? key
  }

  const availableLocales = computed(() => [
    { value: 'en', label: t('languages.english') },
    { value: 'fa', label: t('languages.persian') },
  ])

  return {
    locale,
    setLocale,
    setLocaleFromSettings,
    t,
    availableLocales,
  }
}
