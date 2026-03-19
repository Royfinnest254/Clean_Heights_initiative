import { Link } from "wouter";
import { Mail, Phone, MapPin, Droplets, Leaf, Users, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PORTRAIT_PLACEHOLDER = "/founder-portrait.jpg";

const values = [
  { icon: Droplets, label: "Water Source Protection" },
  { icon: Leaf, label: "Ecosystem Restoration" },
  { icon: Users, label: "Inclusive Community Engagement" },
  { icon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ), label: "Women's Leadership in Conservation" },
  { icon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8"/>
    </svg>
  ), label: "Transparent, Data-Driven Reporting" },
];

export default function Founder() {
  return (
    <div className="min-h-screen bg-[#F8FBF8] text-[#1A1C1A]">
      <Navigation />

      {/* ── Page Hero ── */}
      <section className="pt-32 pb-24 bg-white border-b border-[#E9EDEA]" aria-labelledby="founder-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Text */}
            <div className="lg:col-span-7">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-6 block">
                Executive Leadership
              </span>
              <h1 id="founder-heading" className="text-[#1B4332] mb-6 leading-tight">
                Meet Our Founder
              </h1>
              <div className="mb-8">
                <p className="text-3xl font-bold text-[#1A1C1A] mb-1">Cynthia Jelagat</p>
                <p className="text-[#C08A3E] text-xs font-extrabold uppercase tracking-widest">
                  Founder &amp; Chairperson
                </p>
              </div>
              <p className="text-[#4A4D4A] leading-relaxed text-lg max-w-2xl">
                Born and raised in the highlands of Elgeyo Marakwet, Cynthia Jelagat has spent her life
                watching the escarpment she loves face mounting environmental pressure — from plastic waste
                choking water sources to ecosystems struggling under the weight of climate change and 
                limited infrastructure.
              </p>
            </div>

            {/* Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 border border-[#E9EDEA] z-0" />
              <div className="rounded-none overflow-hidden shadow-2xl h-[550px] relative z-10 grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                <img
                  src={PORTRAIT_PLACEHOLDER}
                  alt="Cynthia Jelagat — Founder and Chairperson of Clean Heights Initiative"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="absolute top-8 -right-4 bg-[#C08A3E] text-white py-3 px-6 shadow-xl z-20">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Institutional Tenure</p>
                <p className="text-2xl font-black">EST. 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder Bio ── */}
      <section className="chi-section bg-white" aria-labelledby="bio-heading">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3 border-r border-[#E9EDEA] pr-8">
              <h2 id="bio-heading" className="text-[#1B4332] text-3xl mb-4">
                The Vision
              </h2>
              <div className="w-12 h-1 bg-[#C08A3E]" />
            </div>
            <div className="md:w-2/3 space-y-8 text-[#4A4D4A] leading-relaxed text-lg font-serif">
              <p>
                "Clean Heights Initiative was born from a realization that our highland ecosystems are the lifeblood
                of this entire region. When the escarpment suffers, the water suffers, and the community downstream 
                is ultimately the one that pays the price."
              </p>
              <div className="h-px bg-[#E9EDEA] w-full" />
              <div className="not-serif space-y-6 text-base italic opacity-80">
                <p>
                  [Founder bio — paragraph 1. Cynthia’s upbringing in Elgeyo Marakwet and her connection to the highland landscape.]
                </p>
                <p>
                  [Founder bio — paragraph 2. Founding CHI and the early challenges of mobilizing volunteers in Iten.]
                </p>
                <p>
                  [Founder bio — paragraph 3. Strategic vision for the next five years — expanding sites and building government partnerships.]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pull Quote ── */}
      <section className="py-24 bg-[#1B4332] relative overflow-hidden" aria-label="Founder quote">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <blockquote>
            <p className="text-white text-3xl md:text-5xl font-bold leading-[1.15] mb-10 tracking-tight">
              Healthy highland ecosystems underpin everything — clean water, biodiversity,
              and our community's future.
            </p>
            <cite className="text-[#C08A3E] font-bold not-italic uppercase tracking-[0.2em] text-xs">
              — Cynthia Jelagat, Founder &amp; Chairperson
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="chi-section bg-[#F8FBF8] border-y border-[#E9EDEA]" aria-labelledby="vision-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            {/* Values */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-6 block">
                Foundational Values
              </span>
              <h2 id="vision-heading" className="text-[#1B4332] mb-10">
                Strategic Commitments
              </h2>
              <ul className="space-y-6">
                {values.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-none bg-white border border-[#E9EDEA] flex items-center justify-center flex-shrink-0 text-[#1B4332] group-hover:border-[#C08A3E] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-[#1A1C1A] text-sm tracking-wide uppercase">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Forward-looking paragraph */}
            <div>
              <h3 className="text-[#40916C] mb-4">CHI's Path Forward</h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                Cynthia's vision for Clean Heights Initiative extends well beyond the March
                2026 milestones. In the near term, CHI aims to expand its regular clean-up
                programme to cover every major water catchment zone in Elgeyo Marakwet County —
                from the escarpment above Iten to the Kerio Valley floor.
              </p>
              <p className="text-[#555555] leading-relaxed mb-4">
                Longer term, CHI is building partnerships with county government, international
                conservation organisations, and local schools to embed environmental stewardship
                into the fabric of community life. A youth volunteer programme, structured
                monitoring and evaluation system, and annual public reporting cycle are all on
                the roadmap.
              </p>
              <p className="text-[#555555] leading-relaxed">
                Women's leadership in conservation remains central. Cynthia is committed to
                ensuring that CHI's programmes create genuine economic and leadership opportunities
                for women across the county.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Strip ── */}
      <section className="py-20 bg-white" aria-labelledby="contact-strip-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto border border-[#E9EDEA] p-12 bg-[#F8FBF8]">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-6 block text-center">
              Direct Access
            </span>
            <h3 id="contact-strip-heading" className="text-[#1B4332] mb-12 text-center text-3xl">
              Connect With Leadership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
              <a
                href="mailto:cleanheightsinitiative@gmail.com"
                className="flex flex-col items-center gap-4 text-[#4A4D4A] hover:text-[#C08A3E] transition-colors text-center"
              >
                <div className="w-12 h-12 rounded-none bg-white border border-[#E9EDEA] flex items-center justify-center group-hover:border-[#C08A3E]">
                  <Mail size={18} className="text-[#1B4332]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest break-all">Email HQ</span>
              </a>
              <a
                href="tel:+254728576944"
                className="flex flex-col items-center gap-4 text-[#4A4D4A] hover:text-[#C08A3E] transition-colors text-center"
              >
                <div className="w-12 h-12 rounded-none bg-white border border-[#E9EDEA] flex items-center justify-center">
                  <Phone size={18} className="text-[#1B4332]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Call Office</span>
              </a>
              <div className="flex flex-col items-center gap-4 text-[#4A4D4A] text-center">
                <div className="w-12 h-12 rounded-none bg-white border border-[#E9EDEA] flex items-center justify-center">
                  <MapPin size={18} className="text-[#1B4332]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest leading-tight">Iten, Elgeyo Marakwet</span>
              </div>
            </div>
            <div className="text-center">
              <Link href="/contact" className="chi-btn chi-btn-primary px-12">
                Send Formal Enquiry
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
