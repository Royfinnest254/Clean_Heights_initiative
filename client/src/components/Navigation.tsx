import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useSiteImage } from "@/contexts/SiteImagesContext";

const CHI_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663425159343/Uj3DVokpwmZufniMNHSrGB/chi-logo-final_2d6d3417.png";

const navLinks = [
  { label: "Home", href: "/" },
  { 
    label: "Our Initiatives", 
    href: "/programs",
    dropdownItems: [
      { label: "Programs and Activities", href: "/programs" },
      { label: "Field Activities and Milestones", href: "/milestones" },
      { label: "Kamariny (Water Source & Tree Planting)", href: "/milestones#kamariny-water-source-protection-2026" },
      { label: "Kipgorgotich (Water Point & Clean-up)", href: "/milestones#kipgorgotich-april-2026" },
      { label: "Kapshoo (Tree Planting & Cleaning)", href: "/milestones#kapshoo-tree-planting-2026" },
      { label: "Oldoldol (Simba Group & Catchment)", href: "/milestones#simba-oldoldol" },
      { label: "Iten Town (Park & Reserve)", href: "/milestones#iten-park" },
      { label: "Kamebur Viewpoint (Escarpment Clean-up)", href: "/milestones#kamebur" }
    ]
  },
  { 
    label: "About", 
    href: "/about",
    dropdownItems: [
      { label: "Our Story & Vision", href: "/about" },
      { label: "Meet the Founder", href: "/about#founder" },
      { label: "Our Team", href: "/team" },
      { label: "Eco-Tourism Trails", href: "/ecotourism" }
    ]
  },
  { 
    label: "Get Involved", 
    href: "/contact",
    dropdownItems: [
      { label: "Contact Info & HQ", href: "/contact" },
      { label: "Send us a Message", href: "/contact#form" }
    ]
  }
];


export default function Navigation() {
  const logo = useSiteImage("brand.logo", CHI_LOGO, "Clean Heights Initiative logo");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const [mobileOpenSubmenus, setMobileOpenSubmenus] = useState<Record<string, boolean>>({});

  const isHero = location === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Collapsible menu toggling for mobile
  const toggleMobileSubmenu = (label: string) => {
    setMobileOpenSubmenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Cross-page smooth hash scroll coordinator
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          // Delay to ensure the DOM is rendered (especially when navigating between routes)
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };

    window.addEventListener("hashchange", handleHashScroll);
    
    // Trigger on initial mount / page change
    handleHashScroll();

    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [location]);

  // Intercept click handler for smooth scrolling on same-page hash links
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const currentPath = window.location.pathname;
      
      // If already on the /milestones page (or targeting it from the milestones page)
      if (currentPath === path || (path === "/milestones" && currentPath === "/milestones")) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }
      }
    }
  };


  // Adjust background classes based on specific page and scroll state
  const navBg = isHero
    ? scrolled
      ? "nav-scrolled"
      : "bg-transparent"
    : "bg-[var(--chi-warm-white)] border-b border-[#E5DFD3]";

  const linkColor =
    isHero && !scrolled ? "text-white/90" : "text-[var(--chi-charcoal)]";
  const logoColor =
    isHero && !scrolled ? "text-white" : "text-[var(--chi-forest)]";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Clean Heights Initiative home">
            <img
              src={logo.src}
              alt={logo.alt || "Clean Heights Initiative logo"}
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-contain bg-white p-0.5 shadow-sm chi-hover-lift flex-shrink-0"
            />
            <span className={`hidden sm:flex flex-col font-bold text-sm md:text-base leading-tight tracking-tight uppercase ${logoColor} transition-colors group-hover:text-[var(--chi-terracotta)]`}>
              <span className="font-extrabold tracking-widest block drop-shadow-sm">Clean Heights</span>
              <span className="text-[10px] md:text-xs font-medium opacity-70 tracking-[0.2em] -mt-0.5">Initiative</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              const hasDropdown = !!link.dropdownItems;
              
              return (
                <div key={link.label} className="group relative py-3">
                  <Link
                    href={link.href}
                    className={`text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 transition-colors ${linkColor} hover:text-[var(--chi-terracotta)] ${
                      isActive ? "text-[var(--chi-terracotta)] opacity-100" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {link.label}
                    {hasDropdown && (
                      <ChevronDown size={11} className="opacity-65 group-hover:rotate-180 transition-transform duration-300" />
                    )}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--chi-terracotta)] rounded-full animate-in slide-in-from-left-2" />
                    )}
                  </Link>

                  {/* Dropdown Container */}
                  {hasDropdown && (
                    <div className="invisible opacity-0 translate-y-3 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[var(--chi-warm-white)] border border-[#E5DFD3] rounded-xl shadow-xl transition-all duration-300 z-50 p-4">
                      <div className="flex flex-col gap-0.5 w-64 max-h-[320px] overflow-y-auto pr-1 text-left">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className="flex flex-col p-2.5 rounded-lg hover:bg-[var(--chi-forest)]/5 transition-all duration-200 text-left group/item"
                          >
                            <span className="text-xs font-bold text-[var(--chi-charcoal)] group-hover/item:text-[var(--chi-terracotta)] transition-colors uppercase tracking-wider">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ${linkColor} hover:bg-white/10 transition-colors focus:ring-2 focus:ring-[var(--chi-terracotta)]`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen slide-out panel */}
      <div 
        className={`fixed inset-0 z-40 bg-[var(--chi-warm-white)] flex flex-col transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5DFD3]">
          <div className="flex items-center gap-2 font-bold text-[var(--chi-forest)] text-xs uppercase tracking-widest">
            <img
              src={logo.src}
              alt={logo.alt || "CHI logo"}
              className="h-10 w-10 rounded-full object-contain bg-white p-0.5 shadow-sm"
            />
            <span className="flex flex-col">
              <span>Clean Heights</span>
              <span className="opacity-70 text-[9px] tracking-[0.2em] -mt-0.5">Initiative</span>
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-[var(--chi-grey)] hover:text-[var(--chi-terracotta)] transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col px-6 py-8 gap-6 max-h-[60vh] overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            const hasDropdown = !!link.dropdownItems;
            const isSubmenuOpen = !!mobileOpenSubmenus[link.label];

            return (
              <div key={link.label} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className={`text-lg font-extrabold uppercase tracking-widest transition-colors flex items-center gap-3 ${
                      isActive ? "text-[var(--chi-terracotta)]" : "text-[var(--chi-charcoal)]"
                    } hover:text-[var(--chi-forest)]`}
                    onClick={() => {
                      if (!hasDropdown) setMenuOpen(false);
                    }}
                  >
                    {isActive && <div className="w-2 h-2 rounded-full bg-[var(--chi-terracotta)]" />}
                    {link.label}
                  </Link>
                  {hasDropdown && (
                    <button
                      onClick={() => toggleMobileSubmenu(link.label)}
                      className="p-2 text-[var(--chi-grey)] hover:text-[var(--chi-terracotta)] transition-colors focus:outline-none"
                      aria-label={`Toggle ${link.label} submenu`}
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${
                          isSubmenuOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Mobile Collapsible Submenu */}
                {hasDropdown && isSubmenuOpen && (
                  <div className="flex flex-col pl-6 mt-3 gap-3 border-l-2 border-[#E5DFD3]/60">
                    {link.dropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-sm font-semibold text-[var(--chi-grey)] hover:text-[var(--chi-terracotta)] transition-colors uppercase tracking-wider text-left py-0.5"
                          onClick={(e) => {
                            setMenuOpen(false);
                            handleLinkClick(e, item.href);
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-auto px-6 pb-8">
          <p className="text-sm font-semibold text-[var(--chi-charcoal)] mb-2">Contact</p>
          <a href="mailto:info@cleanheightsinitiative.org" className="block text-sm text-[var(--chi-grey)] hover:text-[var(--chi-terracotta)] mb-1">
            info@cleanheightsinitiative.org
          </a>
          <a href="tel:+254728576944" className="block text-sm text-[var(--chi-grey)] hover:text-[var(--chi-terracotta)]">
            +254 728 576 944
          </a>
          <div className="mt-6 pt-5 border-t border-[#E5DFD3]">
            <p className="text-[10px] text-[var(--chi-grey)]/60 uppercase tracking-widest font-bold">
              Restoring Escarpments · Securing Water Futures
            </p>
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-[var(--chi-charcoal)]/40 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
