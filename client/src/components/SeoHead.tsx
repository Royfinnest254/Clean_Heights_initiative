import { useEffect } from "react";
import { useLocation } from "wouter";
import { getPageSeo } from "../../../shared/seo";

const origin = "https://cleanheightsinitiative.org";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const pathname = window.location.pathname.replace(/\/$/, "") || "/";
    const page = getPageSeo(pathname);
    const canonical = `${origin}${pathname === "/" ? "/" : pathname}`;
    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertMeta("name", "robots", page.noIndex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Clean Heights Initiative");
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", `${origin}${page.image || "/hero-bg.jpg"}`);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", `${origin}${page.image || "/hero-bg.jpg"}`);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [location]);

  return null;
}
