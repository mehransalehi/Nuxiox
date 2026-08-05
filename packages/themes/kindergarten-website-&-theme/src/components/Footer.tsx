import React from 'react';
import { TranslationSchema } from '../types';
import { Sun, Heart } from 'lucide-react';

interface FooterProps {
  t: TranslationSchema;
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3 gap-2">
              <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                <Sun className="w-6 h-6 text-amber-200" />
              </div>
              <span className="text-xl font-bold font-heading text-white">
                {t.site.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.site.tagline}
            </p>
          </div>

          {/* Nav */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-heading">
              {t.nav.home}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-amber-400 transition-colors">{t.nav.about}</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">{t.nav.services}</a></li>
              <li><a href="#whyus" className="hover:text-amber-400 transition-colors">{t.nav.whyus}</a></li>
              <li><a href="#team" className="hover:text-amber-400 transition-colors">{t.nav.team}</a></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-heading">
              {t.nav.services}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Toddler Discovery</li>
              <li>Early Arts & Crafts</li>
              <li>Kindergarten Readiness</li>
              <li>STEM & Music Exploration</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-heading">
              {t.nav.contact}
            </h4>
            <p className="text-xs text-slate-400">{t.contact.addressValue}</p>
            <p className="text-xs text-slate-400">{t.contact.phoneValue}</p>
            <div className="flex space-x-3 gap-3 pt-2">
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm cursor-pointer hover:bg-rose-500 hover:text-white transition-colors">📷</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm cursor-pointer hover:bg-rose-500 hover:text-white transition-colors">📘</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm cursor-pointer hover:bg-rose-500 hover:text-white transition-colors">💬</span>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{t.site.copyright}</p>
          <p className="flex items-center space-x-1 gap-1 text-[11px] text-slate-400">
            <span>Designed for Nuxiox Theme Architecture</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
