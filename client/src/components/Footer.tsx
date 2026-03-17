import { Link } from "wouter";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

const CHI_LOGO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/chi-logo-final_2d6d3417.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Founder", href: "/founder" },
  { label: "Milestones", href: "/milestones" },
  { label: "Impact & Reports", href: "/impact" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1C1A] text-white pt-20 pb-10 border-t border-[#1B4332]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1 — Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={CHI_LOGO}
                alt="Clean Heights Initiative logo"
                className="h-10 w-10 rounded-full object-contain bg-white p-0.5"
              />
              <span className="font-extrabold text-sm uppercase tracking-widest leading-tight">
                Clean Heights<br />
                <span className="opacity-60 text-[10px] tracking-[0.2em]">Initiative</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">
              A registered environmental steward dedicated to highland restoration and water security in ITEN.
            </p>
          </div>

          {/* Column 2 — Strategy */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C08A3E] font-extrabold mb-6">
              Strategy
            </h4>
            <ul className="space-y-3">
              {quickLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-[#C08A3E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Transparency */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C08A3E] font-extrabold mb-6">
              Impact
            </h4>
            <ul className="space-y-3">
              {quickLinks.slice(3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-[#C08A3E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C08A3E] font-extrabold mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:cleanheightsinitiative@gmail.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-start gap-3"
                >
                  <Mail size={14} className="mt-1 text-[#C08A3E] flex-shrink-0" />
                  <span className="break-all font-medium">cleanheightsinitiative@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+254728576944"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Phone size={14} className="text-[#C08A3E] flex-shrink-0" />
                  <span className="font-medium">+254 728 576 944</span>
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.instagram.com/clean_heights_initiative"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-white/10 flex items-center justify-center hover:bg-[#C08A3E] hover:border-[#C08A3E] transition-all group"
              >
                <Instagram size={16} className="text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            © 2026 Clean Heights Initiative.
          </p>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Iten, Elgeyo Marakwet County, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
