import React, { useState } from 'react';
import { TranslationSchema } from '../types';
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle } from 'lucide-react';

interface ContactProps {
  t: TranslationSchema;
}

export const Contact: React.FC<ContactProps> = ({ t }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.message) return;
    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-amber-50/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.contact.title}</span>
            </div>

            <h2 class="text-3xl sm:text-4xl font-bold font-heading text-slate-800">
              {t.contact.subtitle}
            </h2>

            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-sm flex items-start space-x-4 gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{t.contact.addressTitle}</h4>
                  <p className="text-slate-600 text-sm mt-0.5">{t.contact.addressValue}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-sm flex items-start space-x-4 gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{t.contact.phoneTitle}</h4>
                  <p className="text-slate-600 text-sm mt-0.5">{t.contact.phoneValue}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-sm flex items-start space-x-4 gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{t.contact.hoursTitle}</h4>
                  <p className="text-slate-600 text-sm mt-0.5">{t.contact.hoursValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="p-8 rounded-3xl bg-white border border-amber-200/80 shadow-xl relative">
            <h3 className="text-xl font-bold font-heading text-slate-800 mb-6">
              {t.contact.formTitle}
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-bold text-base">{t.contact.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.contact.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.contact.email}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.contact.phone}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-kindergarten-primary text-center font-bold py-3 flex items-center justify-center space-x-2 gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : t.contact.submitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
