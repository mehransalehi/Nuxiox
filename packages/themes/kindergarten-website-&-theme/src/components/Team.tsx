import React, { useState, useEffect } from 'react';
import { TranslationSchema, ColleagueItem } from '../types';
import { Sparkles, GraduationCap } from 'lucide-react';

interface TeamProps {
  t: TranslationSchema;
}

export const Team: React.FC<TeamProps> = ({ t }) => {
  const [colleagues, setColleagues] = useState<ColleagueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/colleagues/public')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setColleagues(data);
        setLoading(false);
      })
      .catch(() => {
        setColleagues([]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="team" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.team.title}</span>
          </div>
          <p className="text-slate-600 text-base sm:text-lg">
            {t.team.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {colleagues.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-sm text-center p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-amber-200 shadow-inner">
                  <img
                    src={person.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-rose-500 text-white p-1 rounded-full text-xs shadow-md">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg font-heading text-slate-800">{person.name}</h3>
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mt-1">{person.role}</p>
                </div>

                {person.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {person.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
