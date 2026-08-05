import React, { useState, useEffect } from 'react';
import { TranslationSchema, ServiceItem } from '../types';
import { Sparkles, ChevronRight, BookOpen } from 'lucide-react';

interface ServicesProps {
  t: TranslationSchema;
  onOpenBooking: () => void;
}

export const Services: React.FC<ServicesProps> = ({ t, onOpenBooking }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services/public')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setServices([]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="services" className="py-16 md:py-24 bg-amber-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.services.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
            {t.services.subtitle}
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-slate-200/60 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item) => (
              <div
                key={item.id}
                className="card-playful bg-white p-6 border border-amber-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.icon || '🎨'}
                    </div>
                    {item.ageGroup && (
                      <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100">
                        {item.ageGroup}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-heading text-slate-800 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={onOpenBooking}
                    className="text-xs font-bold text-amber-600 group-hover:text-rose-600 flex items-center space-x-1 gap-1 cursor-pointer"
                  >
                    <span>{t.services.viewDetails}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <BookOpen className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
