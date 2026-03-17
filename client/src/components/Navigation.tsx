import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const CHI_LOGO =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/chi-logo-final_2d6d3417.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Founder", href: "/founder" },
  { label: "Milestones", href: "/milestones" },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const isHero = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navBg = isHero
    ? scrolled
      ? "nav-scrolled"
      : "bg-transparent"
    : "bg-white border-b border-[#D8F3DC]";

  const linkColor = isHero && !scrolled ? "text-white/90" : "text-[#1A1C1A]";
  const logoColor = isHero && !scrolled ? "text-white" : "text-[#1B4332]";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${navBg}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" aria-label="Clean Heights Initiative home">
            <img
              src={CHI_LOGO}
              alt="Clean Heights Initiative logo"
              className="h-10 w-10 rounded-full object-contain bg-white p-0.5 shadow-sm flex-shrink-0"
            />
            <span className={`hidden sm:flex flex-col font-bold text-sm leading-tight tracking-tight uppercase ${logoColor}`}>
              <span className="font-extrabold tracking-widest">Clean Heights</span>
              <span className="text-[10px] font-medium opacity-80 tracking-[0.2em] -mt-0.5">Initiative</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-[0.15em] transition-all relative ${linkColor} hover:text-[#C08A3E] ${
                    isActive ? "text-[#C08A3E] opacity-100" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-[1.5px] bg-[#C08A3E] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden p-2 rounded-md transition-colors ${linkColor} hover:bg-white/10`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen slide-out panel */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D8F3DC]">
          <div className="flex items-center gap-2 font-bold text-[#2D6A4F]">
            <img
              src={CHI_LOGO}
              alt="CHI logo"
              className="h-10 w-10 rounded-full object-contain bg-white p-0.5 shadow-sm"
            />
            <span>Clean Heights Initiative</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-[#555555] hover:text-[#2D6A4F]"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col px-6 py-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xl font-semibold transition-colors ${
                location === link.href ? "text-[#2D6A4F]" : "text-[#1B1B1B]"
              } hover:text-[#2D6A4F]`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto px-6 pb-8">
          <p className="text-sm text-[#555555]">
            cleanheightsinitiative@gmail.com
          </p>
          <p className="text-sm text-[#555555]">+254 728 576 944</p>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
