export type Locale = 'en' | 'fa' | 'ar';

export interface TranslationSchema {
  site: {
    name: string;
    englishName: string;
    tagline: string;
    copyright: string;
    language: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    whyus: string;
    team: string;
    gallery: string;
    blog: string;
    contact: string;
    bookAppointment: string;
  };
  hero: {
    title: string;
    subtitle: string;
    bookBtn: string;
    explorePrograms: string;
    badge: string;
    happyKids: string;
    certifiedStaff: string;
    instagram: string;
    facebook: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    exploreBtn: string;
    yearsExp: string;
    safeEnvironment: string;
    smallClasses: string;
    ageGroups: string;
  };
  services: {
    title: string;
    subtitle: string;
    viewDetails: string;
    ageGroupLabel: string;
    scheduleLabel: string;
    all: string;
  };
  whyus: {
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
  };
  team: {
    title: string;
    subtitle: string;
    roleLabel: string;
    bioLabel: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    clickToEnlarge: string;
  };
  blog: {
    title: string;
    subtitle: string;
    readMore: string;
    searchPlaceholder: string;
    allCategories: string;
    comments: string;
    leaveComment: string;
    yourComment: string;
    yourName: string;
    postComment: string;
    notFound: string;
  };
  contact: {
    title: string;
    subtitle: string;
    addressTitle: string;
    addressValue: string;
    phoneTitle: string;
    phoneValue: string;
    emailTitle: string;
    emailValue: string;
    hoursTitle: string;
    hoursValue: string;
    formTitle: string;
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    messageLabel: string;
    submitBtn: string;
    successMsg: string;
  };
  booking: {
    modalTitle: string;
    modalSubtitle: string;
    parentName: string;
    childName: string;
    childAge: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
    submitBooking: string;
    successMessage: string;
    closeBtn: string;
  };
  cms: {
    notFound: string;
  };
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
  ageGroup?: string;
  order: number;
}

export interface ColleagueItem {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  order: number;
}

export interface TestimonialItem {
  id: number;
  name: string;
  content: string;
  rating?: number;
  order: number;
}

export interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  createdAt: string;
}

export interface ThemeFileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  children?: ThemeFileNode[];
}
