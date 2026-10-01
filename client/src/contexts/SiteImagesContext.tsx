import { createContext, useContext, useEffect, useState, type ImgHTMLAttributes, type ReactNode } from "react";

type SiteImageMap = Record<string, { src: string; alt: string }>;
type SiteImagesState = { slots: SiteImageMap; assets: SiteImageMap };
const SiteImagesContext = createContext<SiteImagesState>({ slots: {}, assets: {} });

export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<SiteImagesState>({ slots: {}, assets: {} });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/site-images", { cache: "no-cache", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setImages({ slots: data.images || {}, assets: data.assets || {} }); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return <SiteImagesContext.Provider value={images}>{children}</SiteImagesContext.Provider>;
}

export function useSiteImage(slot: string, fallback: string, fallbackAlt = "") {
  const images = useContext(SiteImagesContext);
  return images.slots[slot] || images.assets[fallback] || { src: fallback, alt: fallbackAlt };
}

export function ManagedImage({ slot, src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement> & { slot?: string }) {
  const image = useSiteImage(slot || "", src || "", alt || "");
  return <img {...props} src={image.src} alt={image.alt || alt || ""} />;
}
