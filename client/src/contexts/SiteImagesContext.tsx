import { createContext, useContext, useEffect, useState, type ImgHTMLAttributes, type ReactNode } from "react";

type SiteImageMap = Record<string, { src: string; alt: string }>;
const SiteImagesContext = createContext<SiteImageMap>({});

export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<SiteImageMap>({});
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/site-images", { cache: "no-cache", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.images) setImages(data.images); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return <SiteImagesContext.Provider value={images}>{children}</SiteImagesContext.Provider>;
}

export function useSiteImage(slot: string, fallback: string, fallbackAlt = "") {
  const images = useContext(SiteImagesContext);
  return images[slot] || { src: fallback, alt: fallbackAlt };
}

export function ManagedImage({ slot, src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement> & { slot: string }) {
  const image = useSiteImage(slot, src || "", alt || "");
  return <img {...props} src={image.src} alt={image.alt || alt || ""} />;
}
