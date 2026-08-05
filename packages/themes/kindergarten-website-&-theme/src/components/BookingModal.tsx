import React, { useState } from 'react';
import { TranslationSchema } from '../types';
import { X, Calendar, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  t: TranslationSchema;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ t, isOpen, onClose }) => {
  const [form, setForm] = useState({
    parentName: '',
    childName: '',
    childAge: '3',
    preferredDate: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parentName || !form.preferredDate) return;
    setLoading(true);
    try {
      await fetch('/api/booking', {
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

  const handleCloseModal = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-amber-100 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center pt-2">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
            🎒
          </div>
          <h3 className="text-2xl font-bold font-heading text-slate-800">
            {t.booking.modalTitle}
          </h3>
          <p className="text-xs text-slate-500">
            {t.booking.modalSubtitle}
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <p className="text-slate-700 font-medium text-sm leading-relaxed">
              {t.booking.successMessage}
            </p>
            <button
              onClick={handleCloseModal}
              className="btn-kindergarten-primary text-sm font-bold w-full py-2.5 cursor-pointer"
            >
              {t.booking.closeBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.booking.parentName}
              </label>
              <input
                type="text"
                required
                value={form.parentName}
                onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.booking.childName}
                </label>
                <input
                  type="text"
                  value={form.childName}
                  onChange={(e) => setForm({ ...form, childName: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.booking.childAge}
                </label>
                <select
                  value={form.childAge}
                  onChange={(e) => setForm({ ...form, childAge: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="1.5">1.5 - 2 Years</option>
                  <option value="3">3 - 4 Years</option>
                  <option value="5">5 - 6 Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.booking.preferredDate}
              </label>
              <input
                type="date"
                required
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.booking.notes}
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-kindergarten-primary text-center font-bold py-3 text-sm flex items-center justify-center space-x-2 gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : t.booking.submitBooking}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
