import { useState, useEffect, useRef, useCallback } from "react";                                       
import { Link } from "wouter";

import {
  Droplets,
  Leaf,
  Users,
  TreePine,
  Mountain,
  ShieldCheck,
  Sprout,
  Heart,
  HandHelping,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StatCounter from "@/components/StatCounter";
import RandomImpactGallery from "@/components/RandomImpactGallery";
import TopographicBg from "@/components/TopographicBg";
import ComparisonSlider from "@/components/ComparisonSlider";

/* ── Scroll reveal hook ── */
function useScrollReveal() {
  const observe = useCallback(() => {
    const els = document.querySelectorAll(".chi-reveal, .chi-reveal-left, .chi-reveal-scale");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("chi-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observe();
    return cleanup;
  }, [observe]);
}

/* ── Data ── */
const differentiators = [
  {
    icon: Mountain,
    title: "Stabilizing Riverbanks",
    desc: "Preventing the collapse of critical waterways through indigenous root systems that bind escarpment soils.",
  },
  {
    icon: ShieldCheck,
    title: "Preventing Soil Erosion",
    desc: "Restoring degraded escarpment landscapes with native species adapted to steep terrain and high rainfall.",
  },
  {
    icon: Droplets,
    title: "Protecting Water Sources",
    desc: "Safeguarding the springs and catchments that communities depend on for clean, reliable water access.",
  },
  {
    icon: Users,
    title: "Community-Led Solutions",
    desc: "Training and empowering local communities — especially women — to lead their own climate adaptation.",
  },
];

const pillars = [
  {
    icon: TreePine,
    number: "01",
    title: "Indigenous Ecosystem Restoration",
    items: [
      "Planting native tree species suited to escarpment environments",
      "Restoring degraded land and biodiversity",
      "Establishing community-managed indigenous tree nurseries",
    ],
  },
  {
    icon: Droplets,
    number: "02",
    title: "Water Catchment Protection",
    items: [
      "Strengthening riverbanks through strategic planting",
      "Reducing runoff and soil erosion across escarpment watersheds",
      "Improving water retention in the landscape",
    ],
  },
  {
    icon: Users,
    number: "03",
    title: "Community & Women Empowerment",
    items: [
      "Training local groups in tree nursery management",
      "Creating sustainable, climate-resilient income opportunities",
      "Building women-led conservation leadership",
    ],
  },
  {
    icon: Compass,
    number: "04",
    title: "Eco-Tourism & Youth Training",
    items: [
      "Training youth and community members in sustainable tourism",
      "Developing community-led eco-guides and monitors",
      "Creating sustainable livelihoods through environmental stewardship",
    ],
  },
];

const impactStats = [
  { value: 5000, label: "Indigenous Trees Planted", suffix: "+" },
  { value: 12, label: "Communities Engaged", suffix: "+" },
  { value: 45, label: "Women Trained", suffix: "+" },
  { value: 50, label: "Hectares Under Restoration", suffix: "+" },
];

const involveOptions = [
  {
    icon: HandHelping,
    title: "Partner With Us",
    desc: "Join forces with CHI to scale escarpment restoration across Kenya's Rift Valley.",
  },
  {
    icon: Sprout,
    title: "Support Our Projects",
    desc: "Fund indigenous tree nurseries, water catchment protection, and community training programs.",
  },
  {
    icon: Users,
    title: "Volunteer",
    desc: "Join our restoration field teams and experience the escarpment firsthand.",
  },
  {
    icon: Leaf,
    title: "Collaborate",
    desc: "Work directly with local communities on research, education, and sustainable livelihoods.",
  },
];

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const [news, setNews] = useState<BlogPost[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useScrollReveal();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`https://blog.cleanheightsinitiative.org/data/posts.json?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setNews(data.slice(0, 3));
        } else {
          throw new Error("Subdomain fetch failed");
        }
      } catch (err) {
        console.warn("CORS/Fetch failed from subdomain, attempting local fallback...", err);
        try {
          const localRes = await fetch(`/data/posts.json?t=${Date.now()}`);
          if (localRes.ok) {
            const data = await localRes.json();
            setNews(data.slice(0, 3));
          }
        } catch (localErr) {
          console.error("Local news fallback failed:", localErr);
        }
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)]">
      <Navigation />

      {/* ═══════════════════════════════════════════
          § 1 — HIGH-FIDELITY SINGLE PHOTO HERO (ZERO COMPRESSION)
      ═══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
        aria-label="Hero"
      >
        {/* Real High-Resolution Raw Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Kipgorgotich Escarpment"
            className="w-full h-full object-cover transform-gpu backface-hidden"
            loading="eager"
            style={{
              imageRendering: 'auto',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)'
            }}
          />
          {/* Subtle multi-stage black gradient to allow clean visual breathing room for text and branding */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/35 z-[1]" />
        </div>

        {/* Hero content area - perfectly centered and beautifully weighted */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-28 pb-20 flex flex-col items-center justify-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Elegant physical badge with micro-border */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 shadow-sm">
              <Leaf size={14} className="text-[var(--chi-leaf)] animate-pulse" />
              <span className="text-white text-xs font-black tracking-[0.2em] uppercase leading-none">
                Grassroots Conservation
              </span>
            </div>

            {/* Title with Playfair Serif for extreme elegance and luxury feel */}
            <h1 className="text-white font-serif font-bold mb-6 leading-tight tracking-tight drop-shadow-md text-4xl sm:text-6xl md:text-7xl max-w-5xl">
              Restoring Escarpment Ecosystems <br className="hidden sm:inline" /> to Protect Water, Land, and Livelihoods
            </h1>

            {/* Readability description */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-sm">
              A grassroots environmental initiative based in Iten, Elgeyo Marakwet, dedicated to restoring ecosystems, protecting vital water sources, building lasting community stewardship, and bridging sustainable tourism with conservation.
            </p>
          </div>
        </div>

        {/* Solid elegant bottom branding banner */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[var(--chi-forest)]/90 backdrop-blur-md border-t border-white/10 py-4">
          <p className="text-center text-white/75 text-xs font-extrabold tracking-[0.25em] uppercase">
            Restoring Escarpments · Securing Water Futures
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          § 1.5 — EDITORIAL FIELD DISPATCHES (NEWS)
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[var(--chi-warm-white)] border-b border-[#E5DFD3]/60 relative" aria-labelledby="news-heading">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-[var(--chi-terracotta)] text-xs font-black uppercase tracking-[0.25em] mb-2 block">
                Direct from the Escarpment
              </span>
              <h2 id="news-heading" className="text-[var(--chi-forest)] font-serif font-bold text-3xl sm:text-4xl">
                Field Dispatches & News
              </h2>
            </div>
            <a
              href="https://blog.cleanheightsinitiative.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-widest text-[var(--chi-grey)] hover:text-[var(--chi-terracotta)] transition-colors flex items-center gap-2"
            >
              Enter Storyteller Portal
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            </a>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 h-[420px] bg-gray-200/50 rounded-3xl animate-pulse" />
              <div className="lg:col-span-5 space-y-8">
                {[1, 2].map((n) => (
                  <div key={n} className="flex gap-4 animate-pulse">
                    <div className="w-24 h-24 bg-gray-200/50 rounded-2xl flex-shrink-0" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 bg-gray-200/50 rounded w-1/4" />
                      <div className="h-6 bg-gray-200/50 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              {/* Left Side: Featured Article (Big landscape display) */}
              <div className="lg:col-span-7">
                {(() => {
                  const featured = news[0];
                  return (
                    <article
                      onClick={() => window.open(`https://blog.cleanheightsinitiative.org/?post=${featured.id}`, '_blank')}
                      className="group cursor-pointer relative h-[450px] rounded-3xl overflow-hidden border border-[#E5DFD3]/80 shadow-md flex flex-col justify-end bg-[var(--chi-forest)]"
                    >
                      <img
                        src={featured.image.startsWith("images/") ? `https://blog.cleanheightsinitiative.org/${featured.image}` : featured.image}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--chi-forest)]/95 via-[var(--chi-forest)]/45 to-transparent z-[1]" />
                      
                      <div className="relative z-10 p-8 sm:p-10 flex flex-col items-start text-white">
                        <span className="bg-[var(--chi-terracotta)] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md mb-4 shadow-sm">
                          {featured.category}
                        </span>
                        <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider mb-2">
                          {featured.date} · By {featured.author}
                        </span>
                        <h3 className="text-white font-serif text-2xl sm:text-3xl leading-tight mb-3 drop-shadow-sm group-hover:text-[var(--chi-warm-white)] transition-colors">
                          {featured.title}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-xl line-clamp-2">
                          {featured.excerpt}
                        </p>
                        <span className="text-[var(--chi-warm-white)] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                          Read Dispatch
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </span>
                      </div>
                    </article>
                  );
                })()}
              </div>

              {/* Right Side: Editorial List (Clean, minimal typography) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-8 py-2">
                <div className="space-y-8 divide-y divide-[#E5DFD3]/60">
                  {news.slice(1, 3).map((post, idx) => (
                    <article
                      key={post.id}
                      onClick={() => window.open(`https://blog.cleanheightsinitiative.org/?post=${post.id}`, '_blank')}
                      className={`group cursor-pointer flex gap-5 items-start transition-all ${idx > 0 ? "pt-8" : ""}`}
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[var(--chi-forest)] flex-shrink-0 border border-[#E5DFD3]/40">
                        <img
                          src={post.image.startsWith("images/") ? `https://blog.cleanheightsinitiative.org/${post.image}` : post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-[9px] text-[var(--chi-terracotta)] font-extrabold uppercase tracking-widest">
                            {post.category}
                          </span>
                          <span className="text-[9px] text-[var(--chi-grey)] font-medium">
                            {post.date}
                          </span>
                        </div>
                        <h4 className="text-[var(--chi-forest)] font-serif font-bold text-lg leading-snug mb-1 group-hover:text-[var(--chi-terracotta)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-[var(--chi-grey)] text-xs leading-relaxed line-clamp-2 mb-2">
                          {post.excerpt}
                        </p>
                        <span className="text-[var(--chi-terracotta)] text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">
                          Read Story
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#E5DFD3]/60">
                  <a
                    href="https://blog.cleanheightsinitiative.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3.5 border border-[#E5DFD3] text-[var(--chi-forest)] hover:bg-[var(--chi-forest)] hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    Explore All Field Stories
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--chi-grey)]">
              No recent field stories published yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          § 2 — WHY CLEAN HEIGHTS? (Differentiator)
      ═══════════════════════════════════════════ */}
      <section
        id="about"
        ref={aboutRef as React.RefObject<HTMLElement>}
        className="chi-section bg-white relative overflow-hidden"
        aria-labelledby="why-chi-heading"
      >
        <TopographicBg color="#1B4332" opacity={0.03} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-terracotta)] mb-4 chi-reveal">
              What Sets Us Apart
            </h6>
            <h2
              id="why-chi-heading"
              className="text-[var(--chi-forest)] mb-6 chi-reveal chi-delay-1"
            >
              <span className="hand-etched">Why Clean Heights Initiative?</span>
            </h2>
            <p className="text-[var(--chi-grey)] text-lg leading-relaxed chi-reveal chi-delay-2 opacity-80">
              While many conservation programs focus on general tree planting, we
              specialize in{" "}
              <strong className="text-[var(--chi-forest)]">
                escarpment ecosystem restoration
              </strong>{" "}
              — a critical but often overlooked landscape. Our approach goes
              beyond planting trees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {differentiators.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`diff-card chi-reveal chi-delay-${i + 1} 
                  ${i % 2 !== 0 ? "lg:translate-y-8" : ""}`}
              >
                <div className="mb-6 inline-flex p-3 bg-[var(--chi-warm-white)] organic-radius border border-[var(--chi-terracotta)]/10 shadow-sm">
                  <Icon className="w-6 h-6 text-[var(--chi-terracotta)]" />
                </div>
                <h3 className="text-[var(--chi-charcoal)] text-xl mb-4 font-bold tracking-tight">
                  {title}
                </h3>
                <p className="text-[var(--chi-grey)] text-sm leading-relaxed opacity-75">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          § 3 — ESCARPMENT RESILIENCE MODEL (Signature)
      ═══════════════════════════════════════════ */}
      <section
        className="chi-section bg-[var(--chi-warm-white)] relative overflow-hidden border-y border-[#E5DFD3]"
        aria-labelledby="model-heading"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-forest)] mb-4 chi-reveal">
              Our Methodology
            </h6>
            <h2
              id="model-heading"
              className="text-[var(--chi-forest)] mb-6 chi-reveal chi-delay-1"
            >
              <span className="hand-etched">The Escarpment Resilience Model</span>
            </h2>
            <p className="text-[var(--chi-grey)] text-lg leading-relaxed chi-reveal chi-delay-2">
              Our work is guided by a community-driven model that integrates
              environmental restoration with livelihoods and long-term
              sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-12">
            {pillars.map(({ icon: Icon, number, title, items }, i) => (
              <div
                key={title}
                className={`paper-card p-10 rounded-3xl chi-reveal chi-delay-${i + 1} 
                  ${i === 1 ? "md:-mt-12 md:mb-12 shadow-xl z-20" : "md:mt-0 z-10"}`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-5xl font-black text-[var(--chi-forest)]/10 font-serif">
                    {number}
                  </span>
                  <div className="p-3 bg-[var(--chi-mint)] organic-radius">
                    <Icon className="w-6 h-6 text-[var(--chi-forest)]" />
                  </div>
                </div>
                <h3 className="text-[var(--chi-charcoal)] text-xl mb-6 font-bold leading-snug">
                  {title}
                </h3>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[var(--chi-grey)] text-sm leading-relaxed"
                    >
                      <Leaf
                        size={14}
                        className="text-[var(--chi-sage)] mt-1 flex-shrink-0"
                      />
                      <span className="opacity-80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════
          § 5 — COMMUNITY IN ACTION (Story)
      ═══════════════════════════════════════════ */}
      <section
        className="chi-section bg-white relative overflow-hidden"
        aria-labelledby="story-heading"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Photo Column */}
            <div className="lg:col-span-6 chi-reveal-left">
              <div className="relative rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-[var(--chi-terracotta)] z-0 rounded-tl-3xl opacity-40" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-[var(--chi-sage)] z-0 rounded-br-3xl opacity-40" />
                <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="/impact-group.jpg"
                    alt="Community women working at the CHI indigenous tree nursery"
                    className="w-full h-[520px] object-cover hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-6 chi-reveal chi-delay-1">
              <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-sage)] mb-4">
                Community in Action
              </h6>
              <h2 id="story-heading" className="text-[var(--chi-forest)] mb-6">
                Women and Communities Leading Restoration
              </h2>
              <div className="border-l-4 border-[var(--chi-terracotta)] pl-6 mb-8">
                <p className="text-[var(--chi-slate)] text-lg leading-relaxed italic">
                  "In escarpment regions, land degradation directly affects
                  livelihoods. Through our work, women and local communities are
                  not just participants — they are leaders in restoring
                  ecosystems that sustain their environment and future."
                </p>
              </div>
              <p className="text-[var(--chi-grey)] leading-relaxed mb-8">
                Our indigenous tree nurseries are managed by local women who
                understand the escarpment landscape intimately. They nurture
                native species suited to the steep terrain, creating both
                ecological resilience and sustainable income for their
                families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          § 5.5 — ECO-TOURISM & YOUTH TRAINING
      ═══════════════════════════════════════════ */}
      <section
        className="relative bg-[var(--chi-forest)] text-white overflow-hidden"
        aria-labelledby="tourism-heading"
      >
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Visual Column - Full Bleed */}
          <div className="w-full lg:w-1/2 relative min-h-[500px] chi-reveal-left">
            <img 
              src="/milestones/escarpment/eco-planting.jpg" 
              alt="Foreign visitors interacting with local community guides" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-l from-[var(--chi-forest)] via-transparent to-transparent hidden lg:block" />
          </div>

          {/* Text Column */}
          <div className="w-full lg:w-1/2 flex items-center bg-[var(--chi-forest)]">
            <div className="px-6 py-20 md:px-12 lg:px-20 max-w-2xl chi-reveal">
              <h6 className="text-[11px] font-extrabold uppercase tracking-[0.4em] text-[var(--chi-sage)] mb-8">
                Sustainable Horizons
              </h6>
              <h2 id="tourism-heading" className="text-white mb-8">
                Eco-Tourism: Bridging Tourism and Conservation in Iten
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-10">
                At Clean Heights Initiative, we believe the best way to protect the escarpment is by showing its value to the world. We actively train local youths to act as professional tour guides, equipping them to lead foreign visitors through these breathtaking landscapes. This not only creates sustainable income but transforms our youth into lifelong environmental ambassadors.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Youth Tour Guides", desc: "Equipping young people with professional hospitality and eco-tourism skills." },
                  { title: "Cultural Exchange", desc: "Hosting foreign visitors to share our rich heritage and conservation journey." }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm chi-hover-lift">
                    <h4 className="text-[var(--chi-sage)] text-xs font-bold uppercase tracking-widest mb-3">{item.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <TopographicBg color="#ffffff" opacity={0.03} />
      </section>

      {/* ═══════════════════════════════════════════
          § 5b — GALLERY
      ═══════════════════════════════════════════ */}
      <div className="h-px bg-[var(--chi-terracotta)] opacity-20 w-3/4 mx-auto my-4" />
      <RandomImpactGallery />

      {/* ═══════════════════════════════════════════
          § 5d — VISUAL IMPACT (Comparison)
      ═══════════════════════════════════════════ */}
      <section className="chi-section bg-[var(--chi-warm-white)] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 chi-reveal">
              <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-terracotta)] mb-4">
                Seeing is Believing
              </h6>
              <h2 className="text-[var(--chi-forest)] mb-6 leading-tight">
                <span className="hand-etched">The Power of Restoration</span>
              </h2>
              <p className="text-[var(--chi-grey)] text-lg leading-relaxed mb-8 opacity-90">
                Our escarpment restoration projects are transforming degraded landscapes back into vibrant, life-sustaining ecosystems. This slider shows the tangible progress of our water trough restoration in Kipgorgotich, providing clean water for local livestock and community needs.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "Native species prevent soil runoff",
                  "Restored canopy protects water springs",
                  "Cleaned water troughs used by cattle and local communities"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-[var(--chi-forest)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--chi-terracotta)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 chi-reveal-scale">
              <ComparisonSlider 
                beforeImage="/milestones/kipgorgotich/trough-dirty.jpg" 
                afterImage="/milestones/kipgorgotich/trough-clean.jpg"
                beforeLabel="Before"
                afterLabel="After"
              />
            </div>
          </div>
        </div>
      </section>




      {/* ═══════════════════════════════════════════
          § 6 — MEET THE FOUNDER
      ═══════════════════════════════════════════ */}
      <section
        className="chi-section bg-[var(--chi-warm-white)] border-y border-[#E5DFD3] relative overflow-hidden"
        aria-labelledby="founder-heading"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-6xl mx-auto">
            {/* Text */}
            <div className="lg:col-span-7 chi-reveal">
              <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-terracotta)] mb-4">
                Leadership
              </h6>
              <h2
                id="founder-heading"
                className="text-[var(--chi-forest)] mb-6"
              >
                Meet the Founder
              </h2>
              <div className="mb-6">
                <p className="text-2xl font-bold text-[var(--chi-charcoal)] mb-1 font-serif">
                  Cynthia Jelagat
                </p>
                <p className="text-[var(--chi-terracotta)] text-sm font-semibold uppercase tracking-widest">
                  Founder & Chairperson
                </p>
              </div>
              <p className="text-[var(--chi-grey)] leading-relaxed mb-5 text-lg">
                Clean Heights Initiative was founded by a passionate
                environmental advocate committed to community-led conservation
                and sustainable development.
              </p>
              <p className="text-[var(--chi-grey)] leading-relaxed mb-8">
                With a focus on escarpment ecosystems, she works directly with
                local communities to develop practical, lasting solutions to
                environmental challenges. Under her leadership, CHI bridges the
                gap between environmental protection, women's empowerment, and
                climate-resilient livelihoods.
              </p>
              {/* CTA removed */}

            </div>

            {/* Portrait */}
            <div className="lg:col-span-5 chi-reveal chi-delay-2">
              <div className="relative">
                <div className="absolute -inset-3 border-2 border-[var(--chi-terracotta)]/20 z-0 rounded-2xl" />
                <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl h-[520px]">
                  <img
                    src="/founder-portrait.jpg"
                    alt="Cynthia Jelagat — Founder and Chairperson of Clean Heights Initiative"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          § 7 — GET INVOLVED
      ═══════════════════════════════════════════ */}
      <section
        className="chi-section bg-white relative overflow-hidden"
        aria-labelledby="involve-heading"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-forest)] mb-4 chi-reveal">
              Join the Movement
            </h6>
            <h2
              id="involve-heading"
              className="text-[var(--chi-forest)] mb-6 chi-reveal chi-delay-1"
            >
              Be Part of the Change
            </h2>
            <p className="text-[var(--chi-grey)] text-lg leading-relaxed chi-reveal chi-delay-2">
              Whether you're an organization, funder, researcher, or individual
              — there's a role for you in restoring Kenya's escarpment
              ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {involveOptions.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`diff-card text-center chi-reveal chi-delay-${i + 1}`}
              >
                <div className="mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[var(--chi-forest)]" />
                </div>
                <h3 className="text-[var(--chi-charcoal)] text-lg mb-3 transition-colors">
                  {title}
                </h3>
                <p className="text-[var(--chi-grey)] text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════
          § 8 — PARTNERS
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-[var(--chi-warm-white)] border-y border-[#E5DFD3]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--chi-grey)] mb-10">
            In Partnership With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-16 md:gap-28">
            <a
              href="https://shoe4africa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
              aria-label="Visit Shoe4Africa website"
            >
              <img
                src="/partners/shoe4africa.png"
                alt="Shoe4Africa Logo"
                className="h-28 md:h-36 object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </a>
            <a
              href="https://nema.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
              aria-label="Visit NEMA website"
            >
              <img
                src="/partners/nema.png"
                alt="NEMA Logo"
                className="h-24 md:h-32 object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </a>
            <a
              href="https://elgeyomarakwet.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
              aria-label="Visit Elgeyo Marakwet County Government website"
            >
              <img
                src="/partners/elgeyo-marakwet.png"
                alt="Elgeyo Marakwet County Logo"
                className="h-28 md:h-36 object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </a>
            <a
              href="https://www.theswissside.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
              aria-label="Visit The Swiss Side website"
            >
              <img
                src="/partners/the-swiss-side.png"
                alt="The Swiss Side Training Camp Logo"
                className="h-28 md:h-36 object-contain group-hover:scale-110 transition-transform duration-500 rounded-2xl shadow-sm"
              />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          § CTA Banner
      ═══════════════════════════════════════════ */}
      <section
        className="py-24 bg-[var(--chi-forest)] text-white overflow-hidden relative"
        aria-labelledby="cta-heading"
      >
        <TopographicBg color="#ffffff" opacity={0.04} />
        <div className="absolute w-72 h-72 border border-white/5 top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="absolute w-48 h-48 border border-white/5 bottom-0 left-0 -translate-x-1/3 translate-y-1/3 rounded-full" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 id="cta-heading" className="text-white mb-6">
            Ready to Restore Our Escarpments?
          </h2>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto text-lg">
            Partner with Clean Heights Initiative to protect water catchments,
            restore indigenous forests, and build climate-resilient communities
            in Kenya's Rift Valley.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/contact"
              className="chi-btn border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold uppercase tracking-wider inline-flex"
            >
              Get In Touch
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
