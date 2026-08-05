import React from 'react';
import { TranslationSchema } from '../types';
import { CheckCircle2, Heart, ShieldCheck, Users, Sparkles } from 'lucide-react';

interface AboutProps {
  t: TranslationSchema;
}

export const About: React.FC<AboutProps> = ({ t }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Grid Visual Column */}
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-amber-100 aspect-square hover:scale-102 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80"
                    alt="Child drawing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 bg-teal-100/80 rounded-3xl text-center space-y-1 shadow-sm border border-teal-200">
                  <p className="text-3xl font-extrabold text-teal-800 font-heading">15+</p>
                  <p className="text-xs font-bold text-teal-900 uppercase tracking-wider">{t.about.yearsExp}</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-6 bg-rose-100/80 rounded-3xl text-center space-y-1 shadow-sm border border-rose-200">
                  <p className="text-3xl font-extrabold text-rose-800 font-heading">1.5 - 6</p>
                  <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">{t.about.ageGroups}</p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-amber-100 aspect-square hover:scale-102 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
                    alt="Outdoor play"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text & Mission Column */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center space-x-2 gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.about.title}</span>
            </div>

            <h2 class="text-3xl sm:text-4xl font-bold font-heading text-slate-800 leading-snug">
              {t.about.subtitle}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t.about.description}
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center space-x-3 gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-700 text-sm sm:text-base">{t.about.safeEnvironment}</span>
              </li>
              <li className="flex items-center space-x-3 gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-700 text-sm sm:text-base">{t.about.smallClasses}</span>
              </li>
            </ul>

            <div className="pt-4">
              <a
                href="#services"
                className="btn-kindergarten-secondary inline-block text-sm font-bold shadow-md hover:shadow-lg"
              >
                {t.about.exploreBtn}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
