import React from 'react';
import { TranslationSchema } from '../types';
import { ShieldCheck, HeartHandshake, Utensils, Rocket } from 'lucide-react';

interface WhyUsProps {
  t: TranslationSchema;
}

export const WhyUs: React.FC<WhyUsProps> = ({ t }) => {
  return (
    <section id="whyus" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            {t.whyus.title}
          </div>
          <p className="text-slate-600 text-base sm:text-lg">
            {t.whyus.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/60 space-y-3 text-center hover:-translate-y-1 transition-transform shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <HeartHandshake className="w-7 h-7 text-amber-800" />
            </div>
            <h3 className="font-bold text-lg font-heading text-slate-800">
              {t.whyus.card1Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {t.whyus.card1Desc}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-teal-50/70 border border-teal-200/60 space-y-3 text-center hover:-translate-y-1 transition-transform shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-teal-200 text-teal-800 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <ShieldCheck className="w-7 h-7 text-teal-800" />
            </div>
            <h3 className="font-bold text-lg font-heading text-slate-800">
              {t.whyus.card2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {t.whyus.card2Desc}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-rose-50/70 border border-rose-200/60 space-y-3 text-center hover:-translate-y-1 transition-transform shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-rose-200 text-rose-800 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <Utensils className="w-7 h-7 text-rose-800" />
            </div>
            <h3 className="font-bold text-lg font-heading text-slate-800">
              {t.whyus.card3Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {t.whyus.card3Desc}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200/60 space-y-3 text-center hover:-translate-y-1 transition-transform shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-purple-200 text-purple-800 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <Rocket className="w-7 h-7 text-purple-800" />
            </div>
            <h3 className="font-bold text-lg font-heading text-slate-800">
              {t.whyus.card4Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {t.whyus.card4Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
