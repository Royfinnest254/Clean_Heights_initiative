import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, ImageIcon } from "lucide-react";

/* ── Local Scroll reveal ── */
function useScrollRevealGallery(dependencies: any[]) {
  const observe = useCallback(() => {
    const els = document.querySelectorAll(
      ".gallery-section .chi-reveal, .gallery-section .chi-reveal-left, .gallery-section .chi-reveal-scale"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("chi-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dependencies[0].length > 0) {
      const timer = setTimeout(() => observe(), 100);
      return () => clearTimeout(timer);
    }
  }, dependencies);
}

export default function RandomImpactGallery() {
  const [randomPhotos, setRandomPhotos] = useState<{ src: string; alt: string; location: string }[]>([]);

  useEffect(() => {
    const processPhotos = (milestones: any[]) => {
      const allPhotos: { src: string; alt: string; location: string }[] = [];
      milestones.forEach((m: any) => {
        const gallery = m.gallery || [m.photo];
        gallery.forEach((src: string) => {
          if (src) allPhotos.push({ src, alt: m.alt || '', location: m.shortLocation || '' });
        });
      });
      const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
      setRandomPhotos(shuffled.slice(0, 12));
    };

    fetch(`/data/milestones.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => processPhotos(data))
      .catch(err => console.error("Gallery fetch failed:", err));
  }, []);

  useScrollRevealGallery([randomPhotos]);

  if (randomPhotos.length === 0) return null;

  return (
    <section className="chi-section bg-white border-y border-[#E5DFD3] gallery-section" aria-labelledby="gallery-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-sage)] mb-4 chi-reveal">
              From the Field
            </h6>
            <h2 id="gallery-heading" className="text-[var(--chi-forest)] mb-4 chi-reveal chi-delay-1">
              Restoration in Progress
            </h2>
            <p className="text-[var(--chi-grey)] text-lg leading-relaxed chi-reveal chi-delay-2">
              Real snapshots from our ongoing restoration efforts across escarpment
              communities in Elgeyo Marakwet.
            </p>
          </div>
          <Link href="/milestones" className="chi-btn chi-btn-outline group chi-hover-lift chi-reveal chi-delay-2">
            View All Work
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {randomPhotos.map((photo, idx) => (
            <GalleryImage key={`${photo.src}-${idx}`} photo={photo} delay={idx % 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryImage({ photo, delay }: { photo: any, delay: number }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`break-inside-avoid relative group overflow-hidden rounded-xl bg-[var(--chi-warm-white)] border border-[#E5DFD3] shadow-sm hover:shadow-xl transition-shadow chi-reveal chi-delay-${delay + 1}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto brightness-[1.02] ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 group-hover:scale-[1.03] transition-transform duration-500`}
        loading="lazy"
        decoding="async"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 rounded-xl">
        <div className="flex items-center gap-2 text-white/60 text-[8px] font-bold uppercase tracking-widest mb-1">
          <ImageIcon size={10} />
          Field Shot
        </div>
        <p className="text-white text-xs font-medium tracking-tight shadow-sm">
          {photo.location}
        </p>
      </div>
    </div>
  );
}
