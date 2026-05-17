import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function StatCounter({
  value,
  label,
  suffix = "",
  prefix = "",
  duration = 1800,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (started) {
      setCount(value);
    }
  }, [started, value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
        <div className="absolute inset-0 bg-[var(--chi-terracotta)]/10 organic-radius group-hover:scale-110 transition-transform duration-700" />
        <div className="stat-number text-[var(--chi-forest)] relative z-10 font-bold">
          {prefix}
          {count.toLocaleString()}
          {suffix}
        </div>
      </div>
      <p className="text-[var(--chi-grey)] font-bold text-xs uppercase tracking-[0.2em] max-w-[120px] mx-auto leading-relaxed opacity-80">
        {label}
      </p>
    </div>
  );
}
