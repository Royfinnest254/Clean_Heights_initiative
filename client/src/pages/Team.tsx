import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, User, MessageCircle } from "lucide-react";
import TopographicBg from "@/components/TopographicBg";
import Footer from "@/components/Footer";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "leadership" | "board" | "field";
  bio: string;
  photo: string;
  quote?: string;
}

/* ── Scroll reveal ── */
function useScrollReveal() {
  const observe = useCallback(() => {
    const els = document.querySelectorAll(".chi-reveal, .chi-reveal-scale");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("chi-visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => observe(), [observe]);
}

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useScrollReveal();

  useEffect(() => {
    fetch(`/data/team.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Team data sync failed", err);
        setLoading(false);
      });
  }, []);

  const leadership = team.filter(m => m.category === "leadership");
  const board = team.filter(m => m.category === "board");
  const field = team.filter(m => m.category === "field");

  if (loading) return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] flex items-center justify-center">
      <div className="text-[var(--chi-forest)] animate-pulse font-bold tracking-widest text-xs uppercase">Connecting to leadership...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] font-sans selection:bg-[var(--chi-sage)] selection:text-white">
      {/* Header */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--chi-forest)] text-white">
        <TopographicBg color="#ffffff" opacity={0.05} />
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Back Home
          </Link>
          <div className="max-w-3xl">
            <h6 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[var(--chi-sage)] mb-6 chi-reveal">
              Our People
            </h6>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 leading-tight chi-reveal chi-delay-1">
              The Hands Behind <br/>
              <span className="italic text-[var(--chi-sage)]">The Heights</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed chi-reveal chi-delay-2">
              Meet the conservationists, board members, and field coordinators dedicated 
              to the restoration of Elgeyo Marakwet's ancestral landscapes.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {leadership.map((member) => (
            <div key={member.id} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center chi-reveal">
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group border-4 border-white mb-8 lg:mb-0">
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--chi-forest)]/40 to-transparent" />
                </div>
              </div>
              <div className="lg:col-span-7">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--chi-sage)]/10 text-[var(--chi-forest)] text-[10px] font-bold uppercase tracking-widest mb-6">
                  {member.role}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--chi-forest)] mb-10">
                  {member.name}
                </h2>
                <div className="prose prose-lg text-[var(--chi-grey)] leading-relaxed mb-10 max-w-2xl">
                  {member.bio}
                </div>
                {member.quote && (
                  <blockquote className="border-l-4 border-[var(--chi-terracotta)] pl-6 py-2 mb-8">
                    <p className="text-xl italic font-serif text-[var(--chi-charcoal)]">
                      "{member.quote}"
                    </p>
                  </blockquote>
                )}
                <div className="flex gap-4">
                  <a href="/contact" className="chi-btn chi-btn-primary">
                    <MessageCircle size={18} /> Get in Touch
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory Board */}
      {board.length > 0 && (
        <section className="py-24 bg-white border-y border-[#E5DFD3]">
          <div className="container mx-auto px-4">
            <h3 className="text-center text-3xl font-serif text-[var(--chi-forest)] mb-16 chi-reveal">
              Advisory Board
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {board.map((m) => (
                <div key={m.id} className="bg-[var(--chi-warm-white)] p-8 rounded-2xl border border-[#E5DFD3] hover:shadow-xl transition-all chi-reveal-scale">
                  <div className="w-16 h-16 rounded-full bg-[var(--chi-forest)]/5 flex items-center justify-center mb-6">
                     {m.photo ? (
                        <img src={m.photo} className="w-full h-full rounded-full object-cover" />
                     ) : (
                        <User className="text-[var(--chi-forest)]" size={32} />
                     )}
                  </div>
                  <h4 className="text-xl font-bold text-[var(--chi-forest)] mb-2">{m.name}</h4>
                  <p className="text-[var(--chi-terracotta)] text-[10px] font-extrabold uppercase tracking-widest mb-4">
                    {m.role}
                  </p>
                  <p className="text-sm text-[var(--chi-grey)] leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Field Coordinators */}
      {field.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
             <h3 className="text-3xl font-serif text-[var(--chi-forest)] mb-8 chi-reveal">
              Field Coordinators
            </h3>
            <p className="text-[var(--chi-grey)] max-w-2xl mx-auto mb-16 chi-reveal">
              The locally-led team driving our daily restoration efforts across escarpment communities.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {field.map((m) => (
                <div key={m.id} className="chi-reveal-scale">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm border border-[#E5DFD3]">
                     <img src={m.photo} className="w-full h-full object-cover" />
                  </div>
                  <h5 className="font-bold text-[var(--chi-forest)]">{m.name}</h5>
                  <p className="text-[10px] font-bold text-[var(--chi-grey)] uppercase">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
