import { useEffect, useRef } from "react";

/**
 * useScrollReveal – attaches an IntersectionObserver to a container ref.
 * Any child element with class `chi-reveal` will have `chi-revealed` added
 * when it enters the viewport, triggering the CSS fade-up transition.
 */
export default function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll reveal disabled for static website experience
  }, []);

  return ref;
}
