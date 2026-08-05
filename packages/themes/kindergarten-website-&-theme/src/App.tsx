import React, { useState, useEffect } from 'react';
import { Locale } from './types';
import { translations } from './locales';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { WhyUs } from './components/WhyUs';
import { Gallery } from './components/Gallery';
import { Team } from './components/Team';
import { Testimonials } from './components/Testimonials';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ImageModal } from './components/ImageModal';
import { ThemeInspectorDrawer } from './components/ThemeInspectorDrawer';

export default function App() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isThemeInspectorOpen, setIsThemeInspectorOpen] = useState(false);

  const t = translations[currentLocale];
  const isRtl = currentLocale === 'fa' || currentLocale === 'ar';

  useEffect(() => {
    document.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLocale;
  }, [currentLocale, isRtl]);

  return (
    <div className={`min-h-screen bg-[#FFFDF9] text-slate-800 font-sans selection:bg-rose-200 selection:text-rose-900 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Top Navbar */}
      <Navbar
        t={t}
        currentLocale={currentLocale}
        onSelectLocale={(loc) => setCurrentLocale(loc)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onToggleThemeInspector={() => setIsThemeInspectorOpen(!isThemeInspectorOpen)}
      />

      {/* Main Sections */}
      <main>
        <Hero t={t} onOpenBooking={() => setIsBookingOpen(true)} />
        <About t={t} />
        <Services t={t} onOpenBooking={() => setIsBookingOpen(true)} />
        <WhyUs t={t} />
        <Gallery t={t} onOpenImage={(url) => setActiveImageUrl(url)} />
        <Team t={t} />
        <Testimonials t={t} />
        <Blog t={t} />
        <Contact t={t} />
      </main>

      {/* Footer */}
      <Footer t={t} />

      {/* Interactive Modals */}
      <BookingModal
        t={t}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <ImageModal
        imageUrl={activeImageUrl}
        onClose={() => setActiveImageUrl(null)}
      />

      {/* Nuxiox Theme Spec Code Inspector Drawer */}
      <ThemeInspectorDrawer
        isOpen={isThemeInspectorOpen}
        onClose={() => setIsThemeInspectorOpen(false)}
      />
    </div>
  );
}
