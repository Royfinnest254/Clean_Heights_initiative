import { Link } from "wouter";
import { Mail, Phone, Instagram, Linkedin, MapPin, Leaf, Heart, ShieldCheck } from "lucide-react";


const CHI_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/chi-logo-final_2d6d3417.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/milestones" },
  { label: "About", href: "/about" },
  { label: "Get Involved", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--chi-charcoal)] text-white pt-20 pb-10 border-t-4 border-[var(--chi-leaf)] relative overflow-hidden">
      
      {/* Decorative large circle behind footer */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1 — Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={CHI_LOGO}
                alt="Clean Heights Initiative logo"
                className="h-12 w-12 rounded-full object-contain bg-white p-0.5"
              />
              <span className="font-extrabold text-sm uppercase tracking-widest leading-tight">
                Clean Heights<br/>
                <span className="text-[var(--chi-leaf)] text-[10px] tracking-[0.2em]">Initiative</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">
              A community-driven environmental organization restoring escarpment
              ecosystems and protecting water catchments through indigenous tree
              systems and local capacity building.
            </p>

          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[var(--chi-terracotta)] font-extrabold mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Our Focus */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[var(--chi-terracotta)] font-extrabold mb-6">
              Our Focus
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--chi-sage)] rounded-full"/> Escarpment Restoration</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--chi-sage)] rounded-full"/> Indigenous Tree Planting</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--chi-sage)] rounded-full"/> Water Catchment Protection</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--chi-sage)] rounded-full"/> Women's Empowerment</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[var(--chi-sage)] rounded-full"/> Climate Resilience</li>
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[var(--chi-terracotta)] font-extrabold mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@cleanheightsinitiative.org"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-start gap-3 group"
                >
                  <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center group-hover:bg-[var(--chi-terracotta)] transition-colors flex-shrink-0 mt-0.5">
                    <Mail size={12} className="text-[var(--chi-terracotta)] group-hover:text-white" />
                  </div>
                  <span className="break-all font-medium">info@cleanheightsinitiative.org</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+254728576944"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center group-hover:bg-[var(--chi-terracotta)] transition-colors flex-shrink-0">
                    <Phone size={12} className="text-[var(--chi-terracotta)] group-hover:text-white" />
                  </div>
                  <span className="font-medium">+254 728 576 944</span>
                </a>
              </li>
              <li className="flex items-start gap-3 mt-6 text-sm text-gray-400">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                   <MapPin size={12} className="text-[var(--chi-leaf)]" />
                </div>
                <div>
                  <p className="font-bold text-gray-300 mb-0.5">HQ</p>
                  <p>Iten, Elgeyo Marakwet</p>
                  <p>Kenya</p>
                </div>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.instagram.com/clean_heights_initiative?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all group chi-hover-lift hover:shadow-lg"
              >
                <img src="/instagram-logo.png" alt="Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/company/clean-heights-initiative/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all group chi-hover-lift hover:shadow-lg"
              >
                <img src="/linkedin-logo.png" alt="LinkedIn" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            © 2026 Clean Heights Initiative. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span>Powered by Community</span>
            <Heart size={10} className="text-[var(--chi-terracotta)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
