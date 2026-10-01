export type PageSeo = {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

const siteName = "Clean Heights Initiative";
const fallbackImage = "/hero-bg.jpg";

export const seoPages: Record<string, PageSeo> = {
  "/": {
    title: "Community Conservation in Iten, Kenya | Clean Heights Initiative",
    description: "Clean Heights Initiative is a community-led environmental organization in Iten, Elgeyo Marakwet, Kenya. Learn about our local ecosystem restoration, water-source protection, youth, and community work.",
    image: "/hero-bg.jpg",
  },
  "/about": {
    title: "About Clean Heights Initiative | Our Mission and Community Work",
    description: "Meet Clean Heights Initiative, a grassroots organization based in Iten, Kenya, working with communities on environmental restoration, water protection, and local stewardship.",
    image: "/founder-portrait.jpg",
  },
  "/team": {
    title: "Our Team | Clean Heights Initiative, Iten Kenya",
    description: "Meet the people working with Clean Heights Initiative on community-led environmental action in Elgeyo Marakwet, Kenya.",
    image: "/founder-portrait.jpg",
  },
  "/programs": {
    title: "Programs and Activities | Clean Heights Initiative",
    description: "Explore Clean Heights Initiative programs and community activities in Iten and Elgeyo Marakwet, Kenya, including local environmental and water-source work.",
  },
  "/news": {
    title: "Latest News and Community Stories | Clean Heights Initiative",
    description: "Read field updates and community stories from Clean Heights Initiative in Iten, Elgeyo Marakwet, Kenya.",
    image: "/hero-bg.jpg",
  },
  "/milestones": {
    title: "Community Field Work and Milestones | Clean Heights Initiative",
    description: "See documented community activities and field milestones from Clean Heights Initiative in Iten and Elgeyo Marakwet, Kenya.",
  },
  "/contact": {
    title: "Contact Clean Heights Initiative | Iten, Kenya",
    description: "Contact Clean Heights Initiative in Iten, Elgeyo Marakwet, Kenya, to ask about our community environmental work, partnerships, or activities.",
  },
  "/ecotourism": {
    title: "Community Eco-tourism | Clean Heights Initiative",
    description: "Learn about Clean Heights Initiative's community eco-tourism and conservation work around the Elgeyo Escarpment in Kenya.",
  },
  "/privacy": {
    title: "Privacy Notice | Clean Heights Initiative",
    description: "Read the Clean Heights Initiative website privacy notice and learn how to contact us with questions.",
  },
  "/cookies": {
    title: "Cookie and Browser Storage Notice | Clean Heights Initiative",
    description: "Read about browser storage and cookies used by the Clean Heights Initiative website.",
  },
  "/terms": {
    title: "Terms of Use | Clean Heights Initiative",
    description: "Read the terms for using the Clean Heights Initiative website.",
  },
  "/accessibility": {
    title: "Accessibility Statement | Clean Heights Initiative",
    description: "Read the Clean Heights Initiative accessibility statement and how to report a website access barrier.",
  },
  "/admin": {
    title: `Content Portal | ${siteName}`,
    description: "Restricted content management sign-in.",
    noIndex: true,
  },
  "/admin/setup": {
    title: `Administrator Setup | ${siteName}`,
    description: "Restricted one-time administrator setup.",
    noIndex: true,
  },
};

export function getPageSeo(pathname: string): PageSeo {
  return seoPages[pathname.replace(/\/$/, "") || "/"] || {
    title: `Page not found | ${siteName}`,
    description: "This Clean Heights Initiative page could not be found.",
    image: fallbackImage,
    noIndex: true,
  };
}
