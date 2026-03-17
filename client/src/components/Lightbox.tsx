import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxPhoto {
  src: string;
  alt: string;
  caption?: string;
  date?: string;
  location?: string;
  description?: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const photo = photos[currentIndex];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!photo) return null;

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/30 hover:bg-black/60 rounded-full p-2 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={22} />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 sm:left-6 z-10 text-white/80 hover:text-white bg-black/30 hover:bg-black/60 rounded-full p-3 transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image + caption */}
      <div
        className="relative max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[70vh] w-full object-contain rounded-lg"
        />
        <div className="mt-4 text-center px-4">
          {photo.date && (
            <span className="chi-badge bg-[#F4A261] text-[#1B1B1B] mb-2 inline-block">
              {photo.date}
            </span>
          )}
          {photo.location && (
            <p className="text-white font-semibold text-lg">{photo.location}</p>
          )}
          {photo.description && (
            <p className="text-white/70 text-sm mt-1 max-w-2xl">{photo.description}</p>
          )}
        </div>
        {/* Counter */}
        <p className="text-white/40 text-xs mt-3">
          {currentIndex + 1} / {photos.length}
        </p>
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 sm:right-6 z-10 text-white/80 hover:text-white bg-black/30 hover:bg-black/60 rounded-full p-3 transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
