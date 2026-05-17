import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Scale, 
  Handshake, 
  Eye, 
  Users,
  CheckCircle2,
  FileText
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HighlandAurora from "@/components/HighlandAurora";

export default function Obligations() {
  const commitments = [
    {
      icon: Handshake,
      title: "Community Stewardship",
      desc: "Our primary obligation is to the people of the Elgeyo Marakwet escarpment. Every decision we make is rooted in local consensus and indigenous wisdom."
    },
    {
      icon: Eye,
      title: "Radical Transparency",
      desc: "We maintain an open-book policy for our restoration targets. Our data, from seedling survival rates to water quality metrics, is accessible to our community and partners."
    },
    {
      icon: Scale,
      title: "Ethical Conservation",
      desc: "We reject top-down environmentalism. Our restoration efforts are designed to enhance human livelihoods alongside ecological health, ensuring no one is left behind."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)] selection:bg-[var(--chi-terracotta)] selection:text-white">
      <Navigation />

      <main className="pt-24">
        {/* ── Header ── */}
        <header className="relative py-32 overflow-hidden border-b border-[#E5DFD3]">
          <HighlandAurora variant="dark" className="opacity-40" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl md:text-8xl font-serif text-[var(--chi-forest)] mb-12 leading-none">
                Our Sacred <br/>
                <span className="italic text-[var(--chi-terracotta)]">Obligations</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--chi-grey)] leading-relaxed font-medium max-w-2xl mx-auto">
                Clean Heights Initiative operates under a strict code of environmental 
                stewardship and community accountability.
              </p>
            </div>
          </div>
        </header>

        {/* ── Core Commitments ── */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {commitments.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-12 rounded-[2.5rem] bg-[var(--chi-warm-white)] border border-[#E5DFD3] hover:shadow-2xl transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[var(--chi-forest)] text-white flex items-center justify-center mb-8 group-hover:bg-[var(--chi-terracotta)] transition-colors shadow-lg">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-[var(--chi-forest)] mb-6">{item.title}</h3>
                  <p className="text-[var(--chi-grey)] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Accountability Table ── */}
        <section className="py-32 bg-[var(--chi-warm-white)]">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border border-[#E5DFD3]">
              <div className="p-12 md:p-20 border-b border-[#E5DFD3] bg-[var(--chi-forest)] text-white">
                <h2 className="text-4xl font-serif mb-6">Guarantees to our Community</h2>
                <p className="text-white/70">We hold ourselves to the highest standards of field operation and social impact.</p>
              </div>
              
              <div className="p-8 md:p-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[
                    "100% Native species reforestation",
                    "Local employment priority",
                    "Fair wage guarantees for nursery workers",
                    "Protecting ancestral water rights",
                    "No-chemical soil restoration",
                    "Transparent project reporting"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 text-lg font-medium text-[var(--chi-forest)]">
                      <CheckCircle2 className="text-[var(--chi-sage)] flex-shrink-0" size={24} />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-12 bg-gray-50 flex flex-wrap items-center justify-between gap-8 border-t border-[#E5DFD3]">
                <div className="flex items-center gap-4">
                  <FileText className="text-[var(--chi-grey)]" size={32} />
                  <p className="text-sm text-[var(--chi-grey)] font-bold uppercase tracking-widest">Charter of Stewardship</p>
                </div>
                <button className="chi-btn chi-btn-outline">Download Full Charter (PDF)</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
