import { useState, useEffect, useCallback } from "react";
import { MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import TopographicBg from "@/components/TopographicBg";
import type { Milestone } from "@shared/milestones";

/* ── Scroll reveal — re-runs when deps change ── */
function useScrollReveal(dep: any) {
  const observe = useCallback(() => {
    const els = document.querySelectorAll(
      ".chi-reveal, .chi-reveal-left, .chi-reveal-scale"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("chi-visible");
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Re-run every time dep changes (e.g. after data loads)
  useEffect(() => {
    const timer = setTimeout(() => observe(), 80);
    return () => clearTimeout(timer);
  }, [dep, observe]);
}

/* ── MilestoneImage helper component with shimmer placeholder and fade-in ── */
function MilestoneImage({
  src,
  alt,
  onClick,
  onMouseEnter,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  onMouseEnter?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[#E5DFD3] bg-[var(--chi-warm-white)] group-hover:shadow-xl transition-shadow"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {/* Shimmer Placeholder while image is loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-pulse min-h-[220px]" style={{ animationDuration: "1.5s" }} />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto group-hover:scale-[1.03] transition-all duration-500 ease-out ${
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-95"
        }`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function Milestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<{
    milestoneIdx: number;
    photoIdx: number;
  } | null>(null);

  // Re-trigger scroll reveal after data loads
  useScrollReveal(loading);

  // Speculative hover pre-fetching for high-res lightbox images
  const handlePrefetch = useCallback((mIdx: number) => {
    const m = milestones[mIdx];
    if (!m || !m.gallery) return;
    
    m.gallery.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [milestones]);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      // Direct fetch from local JSON with cache-buster
      const response = await fetch(`/data/milestones.json?v=${new Date().getTime()}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Local data fetch failed");
      const data = await response.json();
      setMilestones(data);
    } catch (err: any) {
      console.error("Error fetching milestones:", err);
      if (err.name === 'AbortError') {
        setError("The request timed out. Please check your connection.");
      } else {
        setError("Failed to load field records. The data might be temporarily unavailable.");
      }
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const openLightbox = (mIdx: number, pIdx: number) =>
    setLightboxIndex({ milestoneIdx: mIdx, photoIdx: pIdx });
  const closeLightbox = () => setLightboxIndex(null);

  const getActivePhotos = () => {
    if (lightboxIndex === null || milestones.length === 0) return [];
    const m = milestones[lightboxIndex.milestoneIdx];
    if (!m) return [];
    return (m.gallery || [m.photo]).map((src: string) => ({
      src, alt: m.alt, date: m.date, location: m.location, description: m.description,
    }));
  };

  const photos = getActivePhotos();
  const prevPhoto = () =>
    setLightboxIndex(s => s === null ? null : { ...s, photoIdx: (s.photoIdx - 1 + photos.length) % photos.length });
  const nextPhoto = () =>
    setLightboxIndex(s => s === null ? null : { ...s, photoIdx: (s.photoIdx + 1) % photos.length });

  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)]">
      <Navigation />

      {/* ── Page Header — always visible, no chi-reveal ── */}
      <section className="pt-32 pb-16 bg-white border-b border-[#E5DFD3] relative overflow-hidden">
        <TopographicBg color="#A0522D" opacity={0.03} />
        <div className="container mx-auto px-4 relative z-10">
          <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-terracotta)] mb-4">
            Field Record
          </h6>
          <h1 className="text-[var(--chi-forest)] mb-6 leading-tight">
            Our Work
          </h1>
          <p className="text-[var(--chi-grey)] max-w-2xl text-lg leading-relaxed">
            A chronological record of CHI's restoration work across Elgeyo
            Marakwet. Every community effort is documented with field
            photography and impact data.
          </p>
        </div>
      </section>

      <div className="chi-glow-line" />

      {/* ── Timeline Skeleton Loader ── */}
      {loading && (
        <section className="bg-white py-24">
          <div className="container mx-auto px-4 space-y-40">
            {[1, 2].map((idx) => (
              <div key={idx} className="animate-pulse">
                {/* Info Header Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-12">
                  <div className="lg:col-span-12">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="lg:col-span-7">
                    <div className="h-8 w-60 bg-gray-200 rounded mb-4" />
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                  <div className="lg:col-span-5 flex flex-wrap gap-8 lg:justify-end pb-2">
                    <div className="h-10 w-20 bg-gray-200 rounded" />
                    <div className="h-10 w-20 bg-gray-200 rounded" />
                    <div className="h-10 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
                {/* Gallery Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="h-64 bg-gray-200 rounded-xl" />
                  <div className="h-80 bg-gray-200 rounded-xl hidden sm:block" />
                  <div className="h-72 bg-gray-200 rounded-xl hidden lg:block" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Error / Empty State ── */}
      {!loading && (milestones.length === 0 || error) && (
        <section className="bg-white py-40 text-center">
          <div className="container mx-auto px-4 max-w-md">
            <p className="text-[var(--chi-grey)] italic mb-8 leading-relaxed">
              {error || "Field records for the current season are being synchronized. Please check back shortly."}
            </p>
            <button 
              onClick={fetchMilestones}
              className="chi-btn chi-btn-outline inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              Retry Connection
            </button>
          </div>
        </section>
      )}

      {/* ── Project Showcase Sections ── */}
      {!loading && milestones.length > 0 && (
        <section className="bg-white py-24" aria-labelledby="milestones-record-heading">
          <h2 id="milestones-record-heading" className="sr-only">Restoration Record</h2>
          <div className="container mx-auto px-4 space-y-40">
            {milestones.map((m: Milestone, mIdx: number) => (
              <div key={m.id || mIdx} id={m.id} className="project-spotlight chi-reveal scroll-mt-28">
                {/* Info Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-12">
                  <div className="lg:col-span-12">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <span className="text-[var(--chi-terracotta)] text-[11px] font-extrabold uppercase tracking-widest border-b border-[var(--chi-terracotta)]/30 pb-1">
                        {m.date}
                      </span>
                      <span className="text-[var(--chi-terracotta)] text-[10px] font-extrabold uppercase tracking-[0.2em] flex items-center gap-2">
                        <MapPin size={12} />
                        {m.location}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <h2 className="text-[var(--chi-forest)] text-3xl mb-4">
                      {m.shortLocation}
                    </h2>
                    <p className="text-[var(--chi-grey)] text-lg leading-relaxed max-w-2xl">
                      {m.description}
                    </p>
                  </div>

                  <div className="lg:col-span-5 flex flex-wrap gap-8 lg:justify-end pb-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--chi-terracotta)]">Recovered</span>
                      <span className="text-xl font-bold text-[var(--chi-forest)]">{m.load}</span>
                    </div>
                    {m.mass && (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--chi-terracotta)]">Impact Mass</span>
                        <span className="text-xl font-bold text-[var(--chi-forest)]">{m.mass}</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--chi-terracotta)]">Team Size</span>
                      <span className="text-xl font-bold text-[var(--chi-forest)]">{m.personnel} Active</span>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                  {(m.gallery || [m.photo]).map((img: string, pIdx: number) => (
                    <div
                      key={pIdx}
                      className="break-inside-avoid group cursor-zoom-in"
                      onClick={() => openLightbox(mIdx, pIdx)}
                      onMouseEnter={() => handlePrefetch(mIdx)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(mIdx, pIdx); }}
                    >
                      <MilestoneImage
                        src={img}
                        alt={`${m.shortLocation} - Image ${pIdx + 1}`}
                        onClick={() => openLightbox(mIdx, pIdx)}
                        onMouseEnter={() => handlePrefetch(mIdx)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="chi-glow-line" />

      {/* ── Follow CTA ── */}
      <section className="py-16 bg-white border-t border-[#E5DFD3] text-center relative overflow-hidden">
        <TopographicBg color="#A0522D" opacity={0.03} />
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-[var(--chi-grey)] text-lg mb-4">
            We're documenting new restoration milestones regularly. Follow our journey.
          </p>
          <a
            href="https://www.instagram.com/clean_heights_initiative"
            target="_blank"
            rel="noopener noreferrer"
            className="chi-btn chi-btn-primary inline-flex"
          >
            Follow on Instagram
          </a>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex.photoIdx}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      <Footer />
    </div>
  );
}
