import React, { useState, useEffect } from 'react';
import { TranslationSchema, BlogPostItem } from '../types';
import { Sparkles, ArrowRight, Search, Calendar as CalendarIcon } from 'lucide-react';

interface BlogProps {
  t: TranslationSchema;
}

export const Blog: React.FC<BlogProps> = ({ t }) => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/blog/posts/recent')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="blog" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.blog.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
            {t.blog.subtitle}
          </h2>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.blog.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-amber-200 text-xs font-medium focus:ring-2 focus:ring-rose-400 focus:outline-none bg-amber-50/20"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="aspect-16/9 bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.featuredImage || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-rose-600 flex items-center space-x-1 gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-lg font-heading text-slate-800 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <span className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1.5 gap-1.5 cursor-pointer">
                    <span>{t.blog.readMore}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm font-medium">
            {t.blog.notFound}
          </div>
        )}
      </div>
    </section>
  );
};
