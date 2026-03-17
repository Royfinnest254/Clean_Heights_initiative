import { useState, useEffect } from "react";
import { MILESTONES } from "../../../shared/milestones";
import { Link } from "wouter";
import { ArrowRight, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function RandomImpactGallery() {
  const [randomPhotos, setRandomPhotos] = useState<{ src: string; alt: string; location: string }[]>([]);

  useEffect(() => {
    // Collect all photos from all milestones
    const allPhotos: { src: string; alt: string; location: string }[] = [];
    MILESTONES.forEach((m) => {
      const gallery = m.gallery || [m.photo];
      gallery.forEach((src) => {
        allPhotos.push({
          src,
          alt: m.alt,
          location: m.shortLocation,
        });
      });
    });

    // Shuffle and pick 10
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    setRandomPhotos(shuffled.slice(0, 10));
  }, []);

  if (randomPhotos.length === 0) return null;

  return (
    <section className="chi-section bg-white border-y border-[#E9EDEA]" aria-labelledby="gallery-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-4 block">
              Live Impact Archive
            </span>
            <h2 id="gallery-heading" className="text-[#1B4332] mb-6">
              Evidence in Motion
            </h2>
            <p className="text-[#4A4D4A] text-lg leading-relaxed">
              Real-time snapshots from our ongoing field operations. This randomized selection 
              represents the diversity of our restoration efforts across Elgeyo Marakwet.
            </p>
          </div>
          <Link href="/milestones" className="group flex items-center gap-2 text-[#C08A3E] font-bold uppercase tracking-widest text-[10px] hover:text-[#1B4332] transition-colors">
            View Complete Record
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
          {randomPhotos.map((photo, idx) => (
            <motion.div
              key={`${photo.src}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="break-inside-avoid relative group overflow-hidden bg-[#F8FBF8] border border-[#E9EDEA]/10 shadow-sm hover:shadow-xl transition-all duration-700"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-auto grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 text-white/60 text-[8px] font-bold uppercase tracking-widest mb-1">
                  <ImageIcon size={10} />
                  Field Shot
                </div>
                <p className="text-white text-xs font-medium tracking-tight">
                  {photo.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
            <div className="h-px bg-[#E9EDEA] w-32" />
        </div>
      </div>
    </section>
  );
}
