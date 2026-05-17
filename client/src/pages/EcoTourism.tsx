import { motion } from "framer-motion";
import { 
  Map as MapIcon, 
  Camera, 
  Compass, 
  Binoculars, 
  TreePine,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HighlandAurora from "@/components/HighlandAurora";
import TopographicBg from "@/components/TopographicBg";
import RandomImpactGallery from "@/components/RandomImpactGallery";

export default function EcoTourism() {
  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)] selection:bg-[var(--chi-terracotta)] selection:text-white">
      <Navigation />

      <main className="pt-24">
        {/* ── Hero Section ── */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <HighlandAurora variant="water" className="opacity-60" />
          <TopographicBg color="#1B4332" opacity={0.05} />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h6 className="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--chi-terracotta)] mb-8">
                Sustainable Horizons
              </h6>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.8] tracking-tighter text-[var(--chi-forest)] mb-12">
                The Heights <br/>
                <span className="italic text-[var(--chi-sage)]">Awaits</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--chi-grey)] leading-relaxed max-w-2xl mx-auto font-medium">
                Experience the raw beauty of the Elgeyo Marakwet escarpment through 
                community-led tours that protect the land they traverse.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Core Experiences ── */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <h2 className="text-5xl font-serif text-[var(--chi-forest)] mb-8">Travel with Purpose</h2>
                <p className="text-lg text-[var(--chi-grey)] leading-relaxed mb-12">
                  Eco-tourism at CHI is not just about visiting; it's about participating in the 
                  restoration of a vital ecosystem. Every trail we map and every visitor we host 
                  contributes directly to our community nurseries and forest protection programs.
                </p>
                
                <ul className="space-y-6">
                  {[
                    { icon: Compass, title: "Indigenous Trails", desc: "Walk paths used by generations of escarpment residents." },
                    { icon: Binoculars, title: "Bird-Watching", desc: "Discover rare high-altitude species in their natural habitat." },
                    { icon: Camera, title: "Photography Tours", desc: "Capture the mist-covered heights and golden rift valleys." }
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--chi-forest)]/5 flex items-center justify-center text-[var(--chi-forest)] flex-shrink-0">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--chi-forest)]">{item.title}</h4>
                        <p className="text-sm text-[var(--chi-grey)]">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
                  <img 
                    src="/milestones/escarpment/escarpment-1.jpg" 
                    alt="The Escarpment Heights" 
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--chi-forest)]/40 to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12">
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-lg inline-block max-w-sm">
                      <h4 className="text-xl font-serif text-[var(--chi-forest)] mb-2">Keiyo Escarpment</h4>
                      <p className="text-sm text-[var(--chi-grey)]">Our primary destination for high-altitude trekking and indigenous forest exploration.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Impact Gallery Integration ── */}
        <RandomImpactGallery />

        {/* ── Call to Adventure ── */}
        <section className="py-40 bg-[var(--chi-forest)] text-white relative overflow-hidden">
          <TopographicBg color="#ffffff" opacity={0.04} />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl font-serif mb-12">Plan Your Visit</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-16 leading-relaxed">
              We offer bespoke experiences for researchers, conservationists, and nature lovers 
              looking to witness the restoration of the Elgeyo Marakwet heights first-hand.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="chi-btn chi-btn-primary px-12 py-5 text-lg">Inquire Now</button>
              <button className="chi-btn chi-btn-outline border-white/20 text-white hover:bg-white hover:text-[var(--chi-forest)] px-12 py-5 text-lg">Download Trail Map</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
