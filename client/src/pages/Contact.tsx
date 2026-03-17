import { useState, useRef, FormEvent } from "react";
import { Mail, Phone, MapPin, Instagram, Send, CheckCircle, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type FormStatus = "idle" | "submitting" | "success" | "error";

const subjectOptions = [
  "Partnership Enquiry",
  "Volunteer Interest",
  "Media / Press",
  "General Enquiry",
];

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = formRef.current;
    if (!form) return;

    // Check honeypot (spam bot protection)
    const honeypot = form.querySelector<HTMLInputElement>('[name="website"]');
    if (honeypot?.value) {
      setStatus("idle");
      return;
    }

    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID || "xreyoblz";
      
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setStatus("success");
        setErrorMessage("");
        form.reset();
      } else {
        const errorData = await response.json();
        const msg = errorData.error || (errorData.errors ? errorData.errors.map((e: any) => e.message).join(", ") : "Submission failed");
        setErrorMessage(msg);
        throw new Error(msg);
      }
    } catch (err: any) {
      console.error("Formspree error:", err);
      setStatus("error");
      if (!errorMessage) setErrorMessage(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBF8] text-[#1A1C1A]">
      <Navigation />

      {/* ── Page Header ── */}
      <section className="pt-32 pb-16 bg-white border-b border-[#E9EDEA]">
        <div className="container mx-auto px-4">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-6 block">
            Institutional Liaison
          </span>
          <h1 className="text-[#1B4332] mb-6 leading-tight">Channel for Partnership</h1>
          <p className="text-[#4A4D4A] max-w-2xl text-lg leading-relaxed">
            Formal communication channels for institutional partnerships, 
            research collaboration, and community engagement. 
          </p>
        </div>
      </section>

      {/* ── Form + Details ── */}
      <section className="chi-section" aria-labelledby="contact-form-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div>
              <h2 id="contact-form-heading" className="text-[#1B4332] mb-10 text-3xl">
                Enquiry Submission
              </h2>

              {status === "success" && (
                <div className="flex items-start gap-4 bg-[#F8FBF8] border-2 border-[#1B4332] p-8 mb-10">
                  <CheckCircle size={24} className="text-[#1B4332] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#2D6A4F]">Message sent!</p>
                    <p className="text-sm text-[#555555]">
                      Thank you! We'll be in touch shortly.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-600">Submission Error</p>
                    <p className="text-sm text-[#555555] mb-2">{errorMessage}</p>
                    <p className="text-xs text-[#555555]">
                       Please check your connection or contact us at{" "}
                      <a
                        href="mailto:cleanheightsinitiative@gmail.com"
                        className="underline text-[#2D6A4F]"
                      >
                        cleanheightsinitiative@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                action="https://formspree.io/f/xreyoblz"
                method="POST"
                className="space-y-5"
                noValidate
              >
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="website"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none h-0 w-0"
                />

                <div>
                  <label htmlFor="from_name" className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332] mb-2 block">
                    Full Entity/Name <span className="text-[#C08A3E]">*</span>
                  </label>
                  <input
                    id="from_name"
                    name="from_name"
                    type="text"
                    className="chi-input !rounded-none !border-[#E9EDEA] focus:!border-[#1B4332] !bg-white"
                    placeholder="e.g. Jane Muthoni"
                    required
                    minLength={2}
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="from_email" className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332] mb-2 block">
                    Official Email <span className="text-[#C08A3E]">*</span>
                  </label>
                  <input
                    id="from_email"
                    name="from_email"
                    type="email"
                    className="chi-input !rounded-none !border-[#E9EDEA] focus:!border-[#1B4332] !bg-white"
                    placeholder="liaison@organisation.com"
                    required
                    aria-required="true"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332] mb-2 block">
                      Direct Line <span className="text-[#4A4D4A] font-normal opacity-50">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="chi-input !rounded-none !border-[#E9EDEA] focus:!border-[#1B4332] !bg-white"
                      placeholder="+254..."
                    />
                  </div>

                  <div>
                    <label htmlFor="organisation" className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332] mb-2 block">
                      Affiliation <span className="text-[#4A4D4A] font-normal opacity-50">(optional)</span>
                    </label>
                    <input
                      id="organisation"
                      name="organisation"
                      type="text"
                      className="chi-input !rounded-none !border-[#E9EDEA] focus:!border-[#1B4332] !bg-white"
                      placeholder="NGO, Research, Corporate"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332] mb-2 block">
                    Nature of Enquiry <span className="text-[#C08A3E]">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="chi-input !rounded-none !border-[#E9EDEA] focus:!border-[#1B4332] !bg-white"
                    required
                    aria-required="true"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Department…
                    </option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332] mb-2 block">
                    Detailed Proposal / Enquiry <span className="text-[#C08A3E]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={8}
                    className="chi-input !rounded-none !border-[#E9EDEA] focus:!border-[#1B4332] !bg-white resize-none"
                    placeholder="Statement of interest…"
                    required
                    minLength={20}
                    aria-required="true"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="chi-btn chi-btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed text-xs font-black uppercase tracking-[0.2em] py-5 px-10"
                  id="contact-submit-btn"
                >
                  {status === "submitting" ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Transmitting…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Transmit Enquiry
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Direct Contact Details */}
            <div className="bg-white border border-[#E9EDEA] p-12">
              <h2 className="text-[#1B4332] mb-12 text-3xl font-serif">
                Headquarters
              </h2>

              <div className="space-y-12 mb-16">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-none bg-[#F8FBF8] border border-[#E9EDEA] flex items-center justify-center flex-shrink-0 group-hover:border-[#C08A3E] transition-colors">
                    <Mail size={18} className="text-[#1B4332]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#C08A3E] mb-2 tracking-[0.2em]">Official Correspondence</p>
                    <a
                      href="mailto:cleanheightsinitiative@gmail.com"
                      className="text-[#1A1C1A] font-bold text-sm tracking-tight hover:text-[#1B4332]"
                    >
                      cleanheightsinitiative@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-none bg-[#F8FBF8] border border-[#E9EDEA] flex items-center justify-center flex-shrink-0 group-hover:border-[#C08A3E] transition-colors">
                    <Phone size={18} className="text-[#1B4332]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#C08A3E] mb-2 tracking-[0.2em]">Primary Line</p>
                    <a
                      href="tel:+254728576944"
                      className="text-[#1A1C1A] font-bold text-sm"
                    >
                      +254 728 576 944
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-none bg-[#F8FBF8] border border-[#E9EDEA] flex items-center justify-center flex-shrink-0 group-hover:border-[#C08A3E] transition-colors">
                    <MapPin size={18} className="text-[#1B4332]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#C08A3E] mb-2 tracking-[0.2em]">Operational Base</p>
                    <p className="text-[#1A1C1A] font-bold text-sm">Iten, Elgeyo Marakwet, Kenya</p>
                  </div>
                </div>
              </div>

              {/* Map embed */}
              <div className="rounded-none overflow-hidden h-72 border border-[#E9EDEA]">
                <iframe
                  title="Iten, Elgeyo Marakwet County, Kenya map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=35.47%2C0.57%2C35.55%2C0.66&layer=mapnik&marker=0.615%2C35.509"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <p className="text-[#555555] text-xs mt-2 text-center">
                Iten, Elgeyo Marakwet County, Kenya
              </p>

              {/* Social links */}
              <div className="mt-8">
                <p className="font-semibold text-[#1B1B1B] mb-3">Follow CHI</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/clean_heights_initiative"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Clean Heights Initiative on Instagram"
                    className="flex items-center gap-2 chi-btn chi-btn-outline text-sm py-2 px-4"
                  >
                    <Instagram size={16} />
                    Instagram
                  </a>
                  {/* Facebook placeholder */}
                  <span
                    className="chi-btn chi-btn-outline text-sm py-2 px-4 opacity-40 cursor-not-allowed"
                    aria-label="Facebook (coming soon)"
                    title="Coming soon"
                  >
                    Facebook
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
