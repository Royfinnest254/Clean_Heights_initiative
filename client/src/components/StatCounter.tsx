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
    if (!started) return;

    let start = 0;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="stat-number text-white mb-2">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="text-[#D8F3DC] font-medium text-sm uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}
