import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowDown, Droplets, Leaf, Users, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StatCounter from "@/components/StatCounter";
import RandomImpactGallery from "@/components/RandomImpactGallery";

// Real photos from CHI's own CDN (Elgeyo Marakwet)
const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/2dgU6Wmo8pfA_91767b5e.jpg";

const FIELD_PHOTO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/J2ENpcwPoagJ_891e75d3.jpg";

const photoStrip = [
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/2dgU6Wmo8pfA_91767b5e.jpg",
    caption: "Kerio Valley Escarpment",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/E56gq8Y9NtBX_f55a709a.jpg",
    caption: "Elgeyo Highlands",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/J2ENpcwPoagJ_891e75d3.jpg",
    caption: "Community Field Work",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/0Ggfik1BwXnD_308f8bc2.jpg",
    caption: "Iten Water Reserve Clean-up",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/TCMEstykHNsw_be5b42ec.jpg",
    caption: "Volunteer Team, Feb 2026",
  },
];

const pillars = [
  {
    icon: Droplets,
    title: "Water Source Protection",
    desc: "We safeguard the springs, rivers, and water catchment zones that sustain life in Elgeyo Marakwet. Every clean-up directly protects the water that communities depend on.",
  },
  {
    icon: Leaf,
    title: "Ecosystem Restoration",
    desc: "Through structured clean-up operations and community action, we restore escarpment ecosystems, removing plastic and glass waste that degrades fragile highland habitats.",
  },
  {
    icon: Users,
    title: "Environmental Stewardship",
    desc: "We build lasting environmental responsibility in Iten and across the county — mobilising volunteers, documenting impact, and inspiring the next generation of conservationists.",
  },
];

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F0FAF4] text-[#1B1B1B]">
      <Navigation />

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        aria-label="Hero"
      >
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Pristine Rift Valley escarpment panorama"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Gradients for text legibility */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0d2b1e]/90 via-[#0d2b1e]/30 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-transparent h-32" />

        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-white mb-8 animate-fade-up-delay-1 leading-[1.1] tracking-tight">
              Protecting the Highlands.{" "}<br />
              <span className="text-[#E9AF1F]">Sustaining the Water.</span>{" "}<br />
              Empowering the Community.
            </h1>
            <p className="text-xl text-white/90 mb-12 animate-fade-up-delay-2 max-w-2xl mx-auto font-medium leading-relaxed">
              A grassroots environmental initiative based in Iten, Elgeyo Marakwet — cleaning up
              ecosystems, protecting water sources, and building lasting community stewardship.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
              <button
                onClick={scrollToAbout}
                className="chi-btn chi-btn-primary px-10 py-4 shadow-xl"
              >
                Our Mission
                <ArrowDown size={18} />
              </button>
              <Link href="/impact" className="chi-btn chi-btn-outline-white px-10 py-4 uppercase tracking-widest text-xs font-bold">
                View Results
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ArrowDown size={20} className="text-white/40" />
        </div>
      </section>

      <RandomImpactGallery />

      {/* ── Three Pillars ── */}
      <section
        id="about"
        ref={aboutRef as React.RefObject<HTMLElement>}
        className="chi-section bg-white"
        aria-labelledby="pillars-heading"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 id="pillars-heading" className="text-[#1B4332] mb-6">
                Our Foundational Pillars
              </h2>
              <p className="text-[#4A4D4A] text-lg leading-relaxed">
                Clean Heights Initiative operates at the intersection of environmental preservation 
                and community resilience in Elgeyo Marakwet.
              </p>
            </div>
            <div className="h-px bg-[#E9EDEA] flex-grow mx-8 hidden lg:block mb-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#C08A3E] mb-4">
              Core Strategy 2026
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="pillar-card group border-none !p-0">
                <div className="w-14 h-14 rounded-sm bg-[#F8FBF8] flex items-center justify-center mb-8 border border-[#E9EDEA] group-hover:border-[#C08A3E] transition-colors">
                  <Icon className="w-6 h-6 text-[#1B4332]" />
                </div>
                <h3 className="text-[#1A1C1A] mb-4 text-2xl">{title}</h3>
                <p className="text-[#4A4D4A] text-sm leading-relaxed mb-6">{desc}</p>
                <div className="w-10 h-[2px] bg-[#E9EDEA] group-hover:bg-[#C08A3E] group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Counter ── */}
      <section
        className="chi-section bg-[#1B4332] text-white border-y border-[#2D6A4F]"
        aria-labelledby="stats-heading"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 border-b border-white/20 pb-8">
            <h2 className="text-white text-3xl font-bold tracking-tight">Verified Field Performance</h2>
            <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">Status: March 2026 Archive</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatCounter value={24} label="Waste Units Collected" />
            <StatCounter value={63} label="Kg Recovered Material" suffix=" kg" />
            <StatCounter value={35} label="Field Deployments" />
            <StatCounter value={5} label="Secured Water Points" />
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="chi-section bg-[#F8FBF8] border-y border-[#E9EDEA]" aria-labelledby="what-we-do-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Photo Column */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-[#C08A3E] z-0" />
              
              {/* Main Team Photo */}
              <div className="col-span-8 relative z-10 aspect-[4/5] overflow-hidden shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                <img
                  src="/impact-team.jpg"
                  alt="CHI team showing impact, Iten Elgeyo Marakwet"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  loading="lazy"
                />
              </div>

              {/* Staggered Field Photo */}
              <div className="col-span-12 -mt-32 ml-16 relative z-20 aspect-video overflow-hidden shadow-2xl border-4 border-white grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                <img
                  src="/impact-field.jpg"
                  alt="CHI field operations in progress"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-6">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-6 block">
                Evidence-Based Action
              </span>
              <h2 id="what-we-do-heading" className="text-[#1B4332] mb-8">
                Measurable Impact <br /> in Every Operation
              </h2>
              <div className="space-y-6 text-[#4A4D4A] leading-relaxed italic text-lg border-l-4 border-[#C08A3E] pl-8 py-2 mb-10">
                "CHI organises structured environmental clean-ups across Elgeyo Marakwet County — targeting
                escarpment water catchment zones, public parks, urban open spaces, and natural water points."
              </div>
              <p className="text-[#4A4D4A] leading-relaxed mb-10">
                Data-driven reporting gives funders and partners full visibility into our impact — from
                kilograms of waste recovered to the specific sites where interventions took place. We recruit local volunteers,
                provide equipment, and build environmental habits that outlast each individual event.
              </p>
              <Link href="/impact" className="chi-btn chi-btn-primary px-10">
                Explore The Data
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ── CTA Banner ── */}
      <section className="chi-section bg-[#1B4332] text-white overflow-hidden relative" aria-labelledby="cta-heading">
        <div className="absolute w-64 h-64 border border-white/5 top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 id="cta-heading" className="text-white mb-6">
            Partner With Our Mission
          </h2>
          <p className="text-white/80 mb-10 max-w-2xl mx-auto text-lg">
            Clean Heights Initiative is open to collaboration with corporate partners, environmental 
            agencies, and community stakeholders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/contact" className="chi-btn chi-btn-primary bg-[#C08A3E] border-[#C08A3E] hover:bg-[#A67632] hover:border-[#A67632] px-12">
              Begin Collaboration
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
