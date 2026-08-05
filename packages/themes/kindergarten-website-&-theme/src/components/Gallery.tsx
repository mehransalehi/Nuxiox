import React, { useState } from 'react';
import { TranslationSchema } from '../types';
import { Sparkles, ZoomIn } from 'lucide-react';

interface GalleryProps {
  t: TranslationSchema;
  onOpenImage: (url: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ t, onOpenImage }) => {
  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      title: 'Building Blocks & STEM',
      category: 'Learning'
    },
    {
      url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
      title: 'Finger Painting & Crafts',
      category: 'Arts'
    },
    {
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      title: 'Outdoor Garden Discovery',
      category: 'Outdoors'
    },
    {
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      title: 'Storytime Reading Circle',
      category: 'Storytelling'
    },
    {
      url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80',
      title: 'Music & Movement Dance',
      category: 'Music'
    },
    {
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      title: 'Healthy Snack Time',
      category: 'Meals'
    }
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-amber-50/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.gallery.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
            {t.gallery.subtitle}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {t.gallery.clickToEnlarge}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => onOpenImage(photo.url)}
              className="group relative rounded-3xl overflow-hidden aspect-4/3 shadow-md border-4 border-white cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center text-white space-y-2">
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold font-heading text-base">{photo.title}</p>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold uppercase tracking-wider">
                  {photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
