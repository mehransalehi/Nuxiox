import React, { useState, useEffect } from 'react';
import { Locale, TranslationSchema } from '../types';
import { Sun, Calendar, Globe, Code, Menu, X, ChevronDown } from 'lucide-react';

interface NavbarProps {
  t: TranslationSchema;
  currentLocale: Locale;
  onSelectLocale: (locale: Locale) => void;
  onOpenBooking: () => void;
  onToggleThemeInspector: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  t,
  currentLocale,
  onSelectLocale,
  onOpenBooking,
  onToggleThemeInspector,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  ];

  return (
    <header
      id="site-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-amber-100'
          : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center space-x-3 gap-2 group">
          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            <Sun className="w-6 h-6 animate-spin-slow text-amber-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold font-heading text-slate-800 leading-tight">
              {t.site.name}
            </span>
            <span className="text-[10px] text-amber-600 font-medium">
              {t.site.tagline}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 gap-6 font-medium text-slate-600 text-sm">
          <a href="#hero" className="hover:text-rose-500 transition-colors">{t.nav.home}</a>
          <a href="#about" className="hover:text-rose-500 transition-colors">{t.nav.about}</a>
          <a href="#services" className="hover:text-rose-500 transition-colors">{t.nav.services}</a>
          <a href="#whyus" className="hover:text-rose-500 transition-colors">{t.nav.whyus}</a>
          <a href="#gallery" className="hover:text-rose-500 transition-colors">{t.nav.gallery}</a>
          <a href="#team" className="hover:text-rose-500 transition-colors">{t.nav.team}</a>
          <a href="#blog" className="hover:text-rose-500 transition-colors">{t.nav.blog}</a>
          <a href="#contact" className="hover:text-rose-500 transition-colors">{t.nav.contact}</a>
        </nav>

        {/* Action Controls & Language Selector */}
        <div className="hidden sm:flex items-center space-x-3 gap-3">
          {/* Nuxiox Theme Inspector Button */}
          <button
            id="theme-inspector-btn"
            onClick={onToggleThemeInspector}
            className="flex items-center space-x-1 gap-1 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
            title="Inspect Nuxiox Theme Vue SFCs & i18n JSON files"
          >
            <Code className="w-3.5 h-3.5 text-rose-500" />
            <span>Theme Code</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="language-dropdown-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center space-x-1.5 gap-1.5 px-3 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors border border-amber-200"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>{languages.find((l) => l.code === currentLocale)?.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-amber-100 py-1.5 z-50 text-xs">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLocale(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 flex items-center space-x-2 gap-2 hover:bg-amber-50 transition-colors ${
                      currentLocale === lang.code ? 'font-bold text-rose-600 bg-amber-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Book Tour Button */}
          <button
            id="nav-book-btn"
            onClick={onOpenBooking}
            className="btn-kindergarten-primary text-xs font-bold flex items-center space-x-1.5 gap-1.5 cursor-pointer shadow-md hover:shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>{t.nav.bookAppointment}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center space-x-2 gap-2">
          <button
            onClick={onToggleThemeInspector}
            className="p-2 rounded-full bg-slate-100 text-slate-700"
            title="Theme Code"
          >
            <Code className="w-4 h-4 text-rose-500" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-slate-700 hover:text-rose-500 hover:bg-amber-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-100 px-4 pt-3 pb-6 space-y-3 mt-2 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase">{t.site.language}</span>
            <div className="flex space-x-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLocale(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    currentLocale === lang.code ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>

          <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.home}</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.about}</a>
          <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.services}</a>
          <a href="#whyus" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.whyus}</a>
          <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.gallery}</a>
          <a href="#team" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.team}</a>
          <a href="#blog" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.blog}</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-slate-700 font-medium hover:text-rose-500">{t.nav.contact}</a>

          <button
            onClick={() => {
              onOpenBooking();
              setIsMobileMenuOpen(false);
            }}
            className="w-full btn-kindergarten-primary text-center font-bold py-2.5 mt-2 flex items-center justify-center space-x-2 gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{t.nav.bookAppointment}</span>
          </button>
        </div>
      )}
    </header>
  );
};
