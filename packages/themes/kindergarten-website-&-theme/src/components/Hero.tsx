import React from 'react';
import { TranslationSchema } from '../types';
import { Calendar, Compass, Sparkles, Heart, Award, Smile } from 'lucide-react';

interface HeroProps {
  t: TranslationSchema;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ t, onOpenBooking }) => {
  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-amber-50/10">
      {/* Decorative Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-200/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold shadow-sm border border-amber-200/80">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-slate-800 leading-tight">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 gap-4 pt-2">
              <button
                id="hero-book-btn"
                onClick={onOpenBooking}
                className="btn-kindergarten-primary text-sm sm:text-base font-bold w-full sm:w-auto text-center flex items-center justify-center space-x-2 gap-2 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.hero.bookBtn}</span>
              </button>
              <a
                href="#services"
                className="btn-kindergarten-secondary text-sm sm:text-base font-bold w-full sm:w-auto text-center flex items-center justify-center space-x-2 gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                <Compass className="w-5 h-5" />
                <span>{t.hero.explorePrograms}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 border-t border-amber-200/80">
              <div className="flex items-center space-x-3 gap-3 p-2 bg-white/60 rounded-2xl border border-amber-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                  <Smile className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">{t.hero.happyKids}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 gap-3 p-2 bg-white/60 rounded-2xl border border-amber-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">{t.hero.certifiedStaff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Showcase Frame */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              <div className="aspect-4/3 rounded-3xl bg-amber-200/60 p-4 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-300 overflow-hidden border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80"
                  alt="Children playing together in kindergarten"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -top-5 -left-5 bg-white p-3.5 rounded-2xl shadow-xl border border-yellow-200 flex items-center space-x-2.5 gap-2.5 animate-bounce">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Creative Arts</p>
                  <p className="text-[10px] text-slate-500">Painting & Clay</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-5 -right-5 bg-white p-3.5 rounded-2xl shadow-xl border border-teal-200 flex items-center space-x-2.5 gap-2.5">
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Outdoor Play</p>
                  <p className="text-[10px] text-slate-500">Nature Explorers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
