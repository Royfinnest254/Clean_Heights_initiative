import { useState } from "react";
import { MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";

import { MILESTONES, type Milestone } from "../../../shared/milestones";

export default function Milestones() {
  const [lightboxIndex, setLightboxIndex] = useState<{ milestoneIdx: number; photoIdx: number } | null>(null);

  const openLightbox = (mIdx: number, pIdx: number) => setLightboxIndex({ milestoneIdx: mIdx, photoIdx: pIdx });
  const closeLightbox = () => setLightboxIndex(null);
  
  const getActivePhotos = () => {
    if (lightboxIndex === null) return [];
    const m = MILESTONES[lightboxIndex.milestoneIdx];
    const imgs = m.gallery || [m.photo];
    return imgs.map((src: string) => ({
      src,
      alt: m.alt,
      date: m.date,
      location: m.location,
      description: m.description
    }));
  };

  const photos = getActivePhotos();

  const prevPhoto = () =>
    setLightboxIndex((state) => (state === null ? null : { ...state, photoIdx: (state.photoIdx - 1 + photos.length) % photos.length }));
  const nextPhoto = () =>
    setLightboxIndex((state) => (state === null ? null : { ...state, photoIdx: (state.photoIdx + 1) % photos.length }));

  return (
    <div className="min-h-screen bg-[#F8FBF8] text-[#1A1C1A]">
      <Navigation />

      {/* ── Page Header ── */}
      <section className="pt-32 pb-16 bg-white border-b border-[#E9EDEA]">
        <div className="container mx-auto px-4">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-6 block">
            Archival Record
          </span>
          <h1 className="text-[#1B4332] mb-6 leading-tight">Institutional Milestones</h1>
          <p className="text-[#4A4D4A] max-w-2xl text-lg leading-relaxed">
            A verified chronological record of CHI's operational impact in Elgeyo Marakwet. 
            Every deployment is documented with field photography and measured data.
          </p>
        </div>
      </section>

      {/* ── Project Showcase Sections ── */}
      <section className="bg-white py-24" aria-labelledby="milestones-record-heading">
        <h2 id="milestones-record-heading" className="sr-only">Operational Record</h2>
        
        <div className="container mx-auto px-4 space-y-48">
          {MILESTONES.map((m: Milestone, mIdx: number) => (
            <div key={mIdx} className="project-spotlight">
              {/* Info Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
                <div className="lg:col-span-12">
                   <div className="flex flex-wrap items-center gap-4 mb-8">
                     <span className="bg-[#C08A3E] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2">
                       {m.date}
                     </span>
                     <span className="text-[#C08A3E] text-[10px] font-extrabold uppercase tracking-[0.2em] flex items-center gap-2">
                       <MapPin size={12} />
                       {m.location}
                     </span>
                   </div>
                </div>
                
                <div className="lg:col-span-7">
                  <h2 className="text-[#1B4332] text-4xl mb-6 font-primary">{m.shortLocation}</h2>
                  <p className="text-[#4A4D4A] text-lg leading-relaxed max-w-2xl opacity-90">
                    {m.description}
                  </p>
                </div>
                
                <div className="lg:col-span-5 flex flex-wrap gap-8 lg:justify-end pb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C08A3E]">Deployment</span>
                    <span className="text-xl font-bold text-[#1B4332]">{m.load} Recovered</span>
                  </div>
                  {m.mass && (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C08A3E]">Impact Mass</span>
                      <span className="text-xl font-bold text-[#1B4332]">{m.mass}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C08A3E]">Personnel</span>
                    <span className="text-xl font-bold text-[#1B4332]">{m.personnel} Active</span>
                  </div>
                </div>
              </div>

              {/* Scattered Gallery */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {(m.gallery || [m.photo]).map((img: string, pIdx: number) => (
                   <div 
                    key={pIdx} 
                    className="break-inside-avoid group cursor-zoom-in"
                    onClick={() => openLightbox(mIdx, pIdx)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(mIdx, pIdx); }}
                  >
                    <div className="relative overflow-hidden border border-[#E9EDEA] bg-[#F8FBF8]">
                      <img
                        src={img}
                        alt={`${m.shortLocation} - Image ${pIdx + 1}`}
                        className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── More Coming Soon ── */}
      <section className="py-12 bg-white border-t border-[#D8F3DC] text-center">
        <div className="container mx-auto px-4">
          <p className="text-[#555555] text-lg mb-2">
            We're adding new milestones regularly. Follow our work.
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

      {/* Lightbox */}
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
