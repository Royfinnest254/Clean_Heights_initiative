import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, Leaf, ShieldCheck, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TopographicBg from "@/components/TopographicBg";

const PORTRAIT_PLACEHOLDER = "/founder-portrait.jpg";

/* ── Scroll reveal hook ── */
function useScrollReveal() {
  const observe = useCallback(() => {
    const els = document.querySelectorAll(
      ".chi-reveal, .chi-reveal-left, .chi-reveal-scale"
    );
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

export default function About() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)]">
      <Navigation />

      {/* ── Page Hero ── */}
      <section
        className="pt-32 pb-16 bg-white border-b border-[#E5DFD3] relative overflow-hidden"
        aria-labelledby="about-heading"
      >
        <TopographicBg color="#A0522D" opacity={0.03} />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-terracotta)] mb-4 chi-reveal">
            Who We Are
          </h6>
          <h1
            id="about-heading"
            className="text-[var(--chi-forest)] mb-6 leading-tight chi-reveal chi-delay-1"
          >
            About <span className="chi-shimmer">Clean Heights</span>
          </h1>
          <p className="text-[var(--chi-grey)] text-xl leading-relaxed chi-reveal chi-delay-2">
            A community-driven environmental organization focused on restoring
            escarpment ecosystems and protecting water catchments through
            indigenous tree systems, local capacity building, and
            climate-resilient livelihoods.
          </p>
        </div>
      </section>

      {/* ── Vision / Mission ── */}
      <section id="mission" className="chi-section bg-[var(--chi-warm-white)] scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="diff-card chi-reveal">
              <h2 className="text-[var(--chi-forest)] mb-4 flex items-center gap-3">
                <Leaf className="text-[var(--chi-sage)]" />
                Our Mission
              </h2>
              <p className="text-[var(--chi-grey)] leading-relaxed text-lg">
                To restore degraded escarpment landscapes through indigenous
                tree planting, protect critical water catchments, and empower
                local communities — especially women — to lead climate-resilient
                conservation from the ground up.
              </p>
            </div>
            <div className="diff-card chi-reveal chi-delay-1">
              <h2 className="text-[var(--chi-forest)] mb-4 flex items-center gap-3">
                <ShieldCheck className="text-[var(--chi-sage)]" />
                Our Vision
              </h2>
              <p className="text-[var(--chi-grey)] leading-relaxed text-lg">
                A future where Kenya's escarpment ecosystems flourish,
                water sources are secured for generations, and local
                communities thrive through sustainable, nature-based
                livelihoods and indigenous knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values (Card grid) ── */}
      <section id="values" className="py-20 bg-[var(--chi-forest)] text-white relative overflow-hidden scroll-mt-28">
        <TopographicBg color="#ffffff" opacity={0.04} />
        <div className="container mx-auto px-4 relative z-10 max-w-6xl text-center">
          <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-mint)] mb-4 chi-reveal">
            Core Values
          </h6>
          <h2 className="text-[var(--chi-mint)] mb-12 chi-reveal chi-delay-1">
            What Drives Our Work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 chi-hover-lift chi-reveal chi-delay-1">
              <div className="text-[var(--chi-leaf)] mb-4">
                <Leaf size={32} className="mx-auto" />
              </div>
              <h3 className="text-white text-xl mb-3">Ecological Integrity</h3>
              <p className="text-white/70 text-sm">
                Focusing strictly on indigenous, ecologically appropriate species rather than fast-growing exotics.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 chi-hover-lift chi-reveal chi-delay-2">
              <div className="text-[var(--chi-leaf)] mb-4">
                <Heart size={32} className="mx-auto" />
              </div>
              <h3 className="text-white text-xl mb-3">Community Ownership</h3>
              <p className="text-white/70 text-sm">
                Ensuring that local people are the primary leaders and beneficiaries of restoration efforts.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 chi-hover-lift chi-reveal chi-delay-3">
              <div className="text-[var(--chi-leaf)] mb-4">
                <ShieldCheck size={32} className="mx-auto" />
              </div>
              <h3 className="text-white text-xl mb-3">Long-term Resilience</h3>
              <p className="text-white/70 text-sm">
                Building environmental systems that can withstand and adapt to climate change impacts over generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="chi-glow-line" />

      {/* ── Founder Info ── */}
      <section
        id="founder"
        className="chi-section bg-[var(--chi-warm-white)] scroll-mt-28"
        aria-labelledby="founder-heading"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7 chi-reveal">
              <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-terracotta)] mb-4">
                Leadership
              </h6>
              <h2 id="founder-heading" className="text-[var(--chi-forest)] mb-6">
                Meet the Founder
              </h2>
              <div className="mb-6">
                <p className="text-2xl font-bold text-[var(--chi-charcoal)] mb-1 font-serif">
                  Cynthia Jelagat
                </p>
                <p className="text-[var(--chi-terracotta)] text-sm font-semibold uppercase tracking-widest">
                  Founder and Chairperson
                </p>
              </div>
              <div className="space-y-6 text-[var(--chi-grey)] leading-relaxed text-lg">
                <p>
                  Clean Heights Initiative was founded by a passionate
                  environmental advocate committed to community-led conservation
                  and sustainable development.
                </p>
                <p>
                  With a focus on escarpment ecosystems, she works directly
                  with local communities to develop practical, lasting solutions
                  to environmental challenges. Her approach combines indigenous
                  knowledge with modern conservation science.
                </p>
                <p>
                  Under her leadership, the initiative bridges environmental
                  protection, women's empowerment, and sustainable livelihoods
                  — proving that community-driven conservation creates lasting,
                  transformative impact.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 chi-reveal chi-delay-1">
              <div className="relative">
                <div className="absolute -inset-3 border-2 border-[var(--chi-terracotta)]/20 z-0 rounded-2xl" />
                <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl h-[600px]">
                  <img
                    src={PORTRAIT_PLACEHOLDER}
                    alt="Cynthia Jelagat — Founder and Chairperson of Clean Heights Initiative"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Forward Looking ── */}
      <section
        className="chi-section bg-white border-y border-[#E5DFD3] relative overflow-hidden"
        aria-labelledby="path-heading"
      >
         <TopographicBg color="#A0522D" opacity={0.03} />
        <div className="container mx-auto px-4 max-w-4xl text-center chi-reveal relative z-10">
          <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-forest)] mb-4">
            Looking Ahead
          </h6>
          <h2 id="path-heading" className="text-[var(--chi-forest)] mb-6">
            CHI's Path Forward
          </h2>
          <div className="space-y-6 text-[var(--chi-grey)] text-lg leading-relaxed mb-10 text-left">
            <p className="text-center">
              Cynthia's vision for Clean Heights Initiative extends to
              comprehensive escarpment ecosystem restoration across Kenya's
              Rift Valley. CHI aims to expand indigenous tree nurseries,
              strengthen riverbank protection, and create scalable models
              for community-led conservation.
            </p>
          </div>
          
          <Link href="/contact" className="chi-btn chi-btn-primary chi-hover-lift">
            Partner With Us <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
