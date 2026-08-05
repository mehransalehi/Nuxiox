import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <img
          src={imageUrl}
          alt="Enlarged view"
          className="max-w-full max-h-[80vh] rounded-3xl object-contain shadow-2xl border-4 border-white/20"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
