import { useState, useRef, useEffect } from "react";
import { ManagedImage } from "@/contexts/SiteImagesContext";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: ComparisonSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none group rounded-3xl shadow-2xl ${className}`}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* After Image (Background) */}
      <ManagedImage
        src={afterImage}
        alt="After restoration"
        className="w-full aspect-[16/10] object-cover pointer-events-none"
      />

      {/* Before Image (Foreground Clipped) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <ManagedImage
          src={beforeImage}
          alt="Before restoration"
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 group-hover:bg-[var(--chi-terracotta)] transition-colors"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-[var(--chi-terracotta)]">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-[var(--chi-terracotta)]" />
            <div className="w-0.5 h-4 bg-[var(--chi-terracotta)]" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 z-10 bg-[var(--chi-forest)]/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
        {afterLabel}
      </div>
    </div>
  );
}
