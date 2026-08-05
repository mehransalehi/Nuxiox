import React, { useState, useEffect } from 'react';
import { TranslationSchema, TestimonialItem } from '../types';
import { Sparkles, Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  t: TranslationSchema;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ t }) => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials/public')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => {
        setTestimonials([]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-amber-50/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.testimonials.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
            {t.testimonials.subtitle}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-slate-200/60 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white border border-amber-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-amber-100 -z-0" />

                <div className="space-y-3 relative z-10">
                  <div className="flex text-amber-400 space-x-1 gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm italic leading-relaxed">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900 text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Kindergarten Parent</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
