import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { Send, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TopographicBg from "@/components/TopographicBg";

type FormStatus = "idle" | "submitting" | "success" | "error";

const subjectOptions = [
  "Partnership Enquiry",
  "Volunteer Interest",
  "Support / Donation",
  "Media / Press",
  "General Enquiry",
];

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

  useEffect(() => observe(), [observe]);
}

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  useScrollReveal();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = formRef.current;
    if (!form) return;

    // Honeypot check
    const honeypot = form.querySelector<HTMLInputElement>('[name="website"]');
    if (honeypot?.value) {
      // Silently fail for bots
      setStatus("idle");
      return;
    }

    try {
      const data = Object.fromEntries(new FormData(form).entries());

      const response = await fetch(`/contact.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        setErrorMessage("");
        form.reset();
      } else {
        const msg = result.error || "Submission failed";
        setErrorMessage(msg);
        throw new Error(msg);
      }
    } catch (err: any) {
      console.error("Contact form error:", err);
      setStatus("error");
      if (!errorMessage) {
        setErrorMessage(err.message || "An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)]">
      <Navigation />

      {/* ── Page Header ── */}
      <section className="pt-32 pb-16 bg-white border-b border-[#E5DFD3] relative overflow-hidden">
        <TopographicBg color="#A0522D" opacity={0.03} />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h6 className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--chi-leaf)] mb-4 chi-reveal">
            Partnerships & Contact
          </h6>
          <h1 className="text-[var(--chi-forest)] mb-6 leading-tight chi-reveal chi-delay-1">
            Let's Restore the <br className="hidden sm:block" />
            <span className="chi-shimmer">Escarpment Together</span>
          </h1>
          <p className="text-[var(--chi-grey)] text-lg leading-relaxed chi-reveal chi-delay-2 max-w-2xl mx-auto">
            Whether you want to partner, volunteer, support, or collaborate —
            we'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="chi-glow-line" />

      {/* ── Contact Options Grid ── */}
      <section
        id="info"
        className="chi-section bg-[var(--chi-warm-white)] scroll-mt-28"
        aria-labelledby="contact-ways-heading"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 id="contact-ways-heading" className="sr-only">
            Ways to Contact Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="diff-card text-center chi-reveal">
              <div className="mb-4">
                <Mail className="text-[var(--chi-terracotta)] mx-auto" size={24} />
              </div>
              <h3 className="text-[var(--chi-charcoal)] mb-2 text-lg">Email Us</h3>
              <a
                href="mailto:info@cleanheightsinitiative.org"
                className="text-[var(--chi-grey)] hover:text-[var(--chi-forest)] text-sm transition-colors"
              >
                info@cleanheightsinitiative.org
              </a>
            </div>

            <div className="diff-card text-center chi-reveal chi-delay-1">
              <div className="mb-4">
                <MapPin className="text-[var(--chi-sage)] mx-auto" size={24} />
              </div>
              <h3 className="text-[var(--chi-charcoal)] mb-2 text-lg">HQ Location</h3>
              <p className="text-[var(--chi-grey)] text-sm">
                Iten, Elgeyo Marakwet <br />
                Rift Valley, Kenya
              </p>
            </div>

            <div className="diff-card text-center chi-reveal chi-delay-2">
              <div className="mb-4">
                <Phone className="text-[var(--chi-forest)] mx-auto" size={24} />
              </div>
              <h3 className="text-[var(--chi-charcoal)] mb-2 text-lg">Call Us</h3>
              <a
                href="tel:+254728576944"
                className="text-[var(--chi-grey)] hover:text-[var(--chi-forest)] text-sm transition-colors"
              >
                +254 728 576 944
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section id="form" className="pb-24 bg-[var(--chi-warm-white)] scroll-mt-28" aria-labelledby="form-heading">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-transparent border-t border-[#E5DFD3] pt-12 chi-reveal">
            <h2 id="form-heading" className="text-[var(--chi-forest)] text-2xl mb-8">
              Send us a Message
            </h2>

            {status === "success" && (
              <div className="bg-[#E6F4EA] border border-[#2D6A4F] rounded-lg p-5 mb-8 text-[var(--chi-forest)]">
                <p className="font-bold flex items-center gap-2">
                  <ExternalLink size={18} />
                  Message sent successfully!
                </p>
                <p className="text-sm mt-1">
                  Thank you for reaching out. A member of our team will get
                  back to you shortly.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="bg-[#FDE8E8] border border-[#C81E1E] rounded-lg p-5 mb-8 text-[#9B1C1C]">
                <p className="font-bold">Submission Failed</p>
                <p className="text-sm mt-1 mb-2">{errorMessage}</p>
                <p className="text-xs">
                  Please try again or contact us directly at{" "}
                  <a
                    href="mailto:info@cleanheightsinitiative.org"
                    className="underline hover:text-[#771D1D]"
                  >
                    info@cleanheightsinitiative.org
                  </a>
                </p>
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="website"
                aria-hidden="true"
                tabIndex={-1}
                autoComplete="off"
                className="absolute opacity-0 pointer-events-none h-0 w-0"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="from_name" className="chi-label">
                    Name *
                  </label>
                  <input
                    id="from_name"
                    name="from_name"
                    type="text"
                    required
                    aria-required="true"
                    className="chi-input"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="from_email" className="chi-label">
                    Email Address *
                  </label>
                  <input
                    id="from_email"
                    name="from_email"
                    type="email"
                    required
                    aria-required="true"
                    className="chi-input"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="chi-label">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="chi-input"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="organisation" className="chi-label">
                    Organization (optional)
                  </label>
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    className="chi-input"
                    placeholder="Organization Name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="chi-label">
                  Reason for Contact *
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    required
                    aria-required="true"
                    className="chi-input appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236B7B6B%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an option...
                    </option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="chi-label">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  minLength={20}
                  aria-required="true"
                  className="chi-input resize-none"
                  placeholder="Tell us how you'd like to get involved..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className={`chi-btn w-full justify-center ${
                  status === "submitting"
                    ? "bg-gray-300 cursor-not-allowed border-gray-300 text-gray-600"
                    : "chi-btn-primary"
                }`}
              >
                {status === "submitting" ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section id="map" className="h-[400px] w-full relative border-t border-[#E5DFD3] scroll-mt-28">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63832.61051515286!2d35.47413695277717!3d0.67566196232591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1781b0a701b22e1b%3A0x67feec3b3bbdf340!2sIten%2C%20Kenya!5e0!3m2!1sen!2sus!4v1711718816913!5m2!1sen!2sus"
          width="100%" 
          height="100%" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade" 
          className="border-0 grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-700"
          title="Clean Heights Initiative Location in Iten, Elgeyo Marakwet"
        />
      </section>

      <Footer />
    </div>
  );
}
