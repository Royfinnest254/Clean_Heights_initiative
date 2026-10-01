import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type LegalPageKey = "privacy" | "cookies" | "terms" | "accessibility";

const pageContent: Record<LegalPageKey, { title: string; intro: string; sections: { title: string; body: string }[] }> = {
  privacy: {
    title: "Privacy notice",
    intro: "This notice explains how Clean Heights Initiative handles information when you browse this website or contact us. It describes the practices visible in the current site code and should be reviewed against the organisation’s actual operating practices before being treated as final legal advice.",
    sections: [
      { title: "Who is responsible", body: "Clean Heights Initiative is the organisation responsible for the information described here. For privacy questions or requests, email info@cleanheightsinitiative.org." },
      { title: "Information you send us", body: "If you use the contact form, the site asks for your name, email address and message. Phone number, organisation and subject are optional fields. The form sends your message to our contact mailbox so we can respond. Do not include sensitive personal information that is not needed for your enquiry." },
      { title: "Information processed to deliver the site", body: "When a browser requests a page or image, the hosting provider may process technical request information such as an IP address, device and browser details, and the requested URL. Website photos, fonts, and news stories are served from this website. The Google Map is loaded only after you select the map button on the Contact page; social media and partner sites are opened only when you follow their links. Those services then receive connection information from your browser under their own privacy practices." },
      { title: "Cookies and local browser storage", body: "The current site does not include analytics or advertising trackers in its application code. It uses local browser storage for the display theme and this notice preference. The administrative portal uses a secure, essential session cookie when an administrator signs in. See our Cookie Notice for details." },
      { title: "How long we keep information", body: "Contact messages are kept in the organisation’s mailbox for as long as needed to respond, manage the relationship and meet applicable record-keeping obligations. The hosting provider may retain technical logs under its own retention settings. The organisation should confirm and document specific retention periods with its service providers." },
      { title: "Your choices and rights", body: "You may ask us to access, correct, object to the use of, or delete personal information we hold about you, subject to applicable law and obligations. Contact info@cleanheightsinitiative.org. You may also raise a complaint with Kenya’s Office of the Data Protection Commissioner (ODPC)." },
      { title: "Children and photographs", body: "We do not ask children to submit information through this site. Photographs or videos that identify a person should be collected and published only with an appropriate lawful basis and safeguards. Images of children require particular care and appropriate parent or guardian permissions." },
      { title: "Security and changes", body: "We use reasonable measures appropriate to the information and services involved. No internet transmission or storage system can be guaranteed completely secure. We may update this notice when the site or our practices change; the date below will show when this page was last updated." },
    ],
  },
  cookies: {
    title: "Cookie and browser storage notice",
    intro: "The website does not use advertising cookies or analytics trackers. Public pages are served from this domain, and the Google Map is loaded only after you choose to display it.",
    sections: [
      { title: "What the site stores", body: "The site stores a light/dark display preference and whether you have dismissed this notice in your browser’s local storage. These are browser storage entries rather than cookies and help remember your choices on this device. The contact form does not set an analytics cookie." },
      { title: "Third-party requests", body: "The website’s public text, photos, news stories, and fonts load from this domain. If you choose to load the Google Map or follow a social media or partner link, your browser connects directly to that service and sends it technical request information such as your IP address. You can use the Contact page without loading the map." },
      { title: "Manage browser storage", body: "You can clear site data in your browser settings. Clearing it may reset your display preference. If optional analytics or advertising tools are added in the future, they must remain off until you make an informed choice, with a way to reject and later change that choice." },
      { title: "Questions", body: "For questions about browser storage on this site, email info@cleanheightsinitiative.org. See the Privacy Notice for information about contact messages and other personal information." },
    ],
  },
  terms: {
    title: "Terms of use",
    intro: "These terms describe basic expectations for using the Clean Heights Initiative website. They do not remove rights that cannot legally be limited. The organisation should have this draft reviewed by a Kenyan lawyer before relying on it as a final legal document.",
    sections: [
      { title: "Using this website", body: "You may browse and share links to public pages for lawful, non-deceptive purposes. Do not attempt to disrupt the site, access restricted systems, upload malicious content, or use information on the site in a way that violates another person’s rights." },
      { title: "Content and photographs", body: "Unless a page says otherwise, the text, design and original materials on this website belong to Clean Heights Initiative or are used with permission. Contact info@cleanheightsinitiative.org before reproducing substantial content or images. Third-party names, logos and links belong to their respective owners." },
      { title: "Accuracy and external sites", body: "We work to keep information accurate and current, but program details and external links may change. A link to another website is provided for convenience and does not mean we control or endorse all of its content or privacy practices." },
      { title: "Contact", body: "Questions about these terms can be sent to info@cleanheightsinitiative.org. Any governing-law and dispute wording should be confirmed by legal counsel before publication." },
    ],
  },
  accessibility: {
    title: "Accessibility statement",
    intro: "Clean Heights Initiative wants this website to be usable by as many people as possible, including people who use assistive technologies or need keyboard access.",
    sections: [
      { title: "Our approach", body: "We aim to use clear page structure, readable contrast, descriptive links and text alternatives for meaningful images. We are working toward the Web Content Accessibility Guidelines (WCAG) 2.2 AA, but have not completed an independent conformance audit." },
      { title: "Tell us about a barrier", body: "If you have difficulty using a page or need information in another format, email info@cleanheightsinitiative.org and include the page address and the problem you encountered. We will review the request and work to provide a practical response." },
      { title: "Ongoing improvements", body: "Accessibility is reviewed as pages and features change. This statement will be updated as we assess the site and address reported barriers." },
    ],
  },
};

export default function LegalPage({ page }: { page: LegalPageKey }) {
  const content = pageContent[page];
  return (
    <div className="min-h-screen bg-[var(--chi-warm-white)] text-[var(--chi-charcoal)]">
      <Navigation />
      <main className="pt-32 pb-20">
        <article className="container mx-auto max-w-4xl px-4">
          <Link href="/" className="text-sm font-semibold text-[var(--chi-leaf)] hover:underline">← Home</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--chi-terracotta)]">Clean Heights Initiative</p>
          <h1 className="mt-3 text-4xl font-bold text-[var(--chi-forest)]">{content.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--chi-grey)]">{content.intro}</p>
          <p className="mt-3 text-sm text-[var(--chi-grey)]">Last updated: 29 September 2026</p>
          <div className="mt-10 space-y-8">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-[var(--chi-forest)]">{section.title}</h2>
                <p className="mt-3 leading-7 text-[var(--chi-grey)]">{section.body}</p>
              </section>
            ))}
          </div>
          <p className="mt-12 border-t border-[#E5DFD3] pt-6 text-sm text-[var(--chi-grey)]">For privacy requests: <a className="font-semibold text-[var(--chi-leaf)] underline" href="mailto:info@cleanheightsinitiative.org">info@cleanheightsinitiative.org</a>.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
