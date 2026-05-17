import { useState, useEffect } from "react";
import { TreePine, Droplet, Compass, Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TopographicBg from "@/components/TopographicBg";

interface Project {
  id: string;
  title: string;
  status: string;
  category: string;
  description: string;
  icon: string;
  ideas: string[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading projects:", err);
        setLoading(false);
      });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "TreePine":
        return <TreePine className="w-6 h-6 text-[var(--chi-leaf)]" />;
      case "Droplet":
        return <Droplet className="w-6 h-6 text-blue-500" />;
      case "Compass":
        return <Compass className="w-6 h-6 text-[var(--chi-terracotta)]" />;
      default:
        return <Lightbulb className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)]">
      <Navigation />

      {/* Header Section */}
      <section className="pt-32 pb-16 bg-white border-b border-[#E5DFD3] relative overflow-hidden">
        <TopographicBg color="#A0522D" opacity={0.03} />
        <div className="container mx-auto px-4 relative z-10">
          <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-terracotta)] mb-4">
            Active Planning
          </h6>
          <h1 className="text-[var(--chi-forest)] mb-6 leading-tight">
            Projects Brainstorm
          </h1>
          <p className="text-[var(--chi-grey)] max-w-2xl text-lg leading-relaxed">
            These are the projects we are currently working on and actively brainstorming. 
            We map out our goals and ideas here to keep our community involved in our restoration journey.
          </p>
        </div>
      </section>

      <div className="chi-glow-line" />

      {/* Projects Board Grid */}
      <section className="py-20 bg-[var(--chi-warm-white)]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-[var(--chi-grey)]">
              Loading brainstorming board...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white border border-[#E5DFD3] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Category & Status */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--chi-grey)] bg-[var(--chi-warm-white)] border border-[#E5DFD3] px-2.5 py-1 rounded-full">
                        {project.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Title & Icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-[var(--chi-warm-white)] rounded-xl border border-[#E5DFD3]">
                        {getIcon(project.icon)}
                      </div>
                      <h3 className="text-xl font-bold text-[var(--chi-forest)] font-serif">
                        {project.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-[var(--chi-grey)] text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Brainstorm Bullet List */}
                    <div className="border-t border-[#E5DFD3] pt-6">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--chi-terracotta)] mb-4">
                        Current Focus & Ideas
                      </h4>
                      <ul className="space-y-3">
                        {project.ideas.map((idea, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-[var(--chi-charcoal)]">
                            <CheckCircle2 className="w-4 h-4 text-[var(--chi-sage)] mt-0.5 flex-shrink-0" />
                            <span className="leading-tight">{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Suggest CTA Section */}
      <section className="py-20 bg-white border-y border-[#E5DFD3] relative overflow-hidden text-center">
        <TopographicBg color="#1B4332" opacity={0.02} />
        <div className="container mx-auto px-4 relative z-10 max-w-2xl">
          <div className="w-12 h-12 bg-[var(--chi-warm-white)] border border-[#E5DFD3] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-6 h-6 text-[var(--chi-terracotta)]" />
          </div>
          <h2 className="text-[var(--chi-forest)] text-3xl font-serif mb-4">
            Have a project idea?
          </h2>
          <p className="text-[var(--chi-grey)] text-base mb-8 leading-relaxed">
            We are always open to new brainstorming suggestions! If you see a degraded landscape, 
            a water trough in need of cleaning, or have ideas for eco-tourism around Iten, please reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/contact" className="chi-btn chi-btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider">
              Share Your Idea <ArrowRight size={15} />
            </Link>
            <a
              href="https://www.mchanga.africa/fundraiser/138903"
              target="_blank"
              rel="noopener noreferrer"
              className="chi-btn chi-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider"
            >
              Support Our M-Changa Fundraiser
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
