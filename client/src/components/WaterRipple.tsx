/**
 * WaterRipple – CSS-only concentric ripple effect referencing CHI's
 * water source protection mission. Expanding rings that fade out,
 * simulating the surface of a highland spring.
 */
export default function WaterRipple({
  color = "rgba(64, 145, 108, 0.15)",
  count = 4,
  className = "",
}: {
  color?: string;
  count?: number;
  className?: string;
}) {
  const rings = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center ${className}`}
    >
      {rings.map((i) => (
        <div
          key={i}
          className="ripple-ring"
          style={{
            borderColor: color,
            animationDelay: `${i * 2.5}s`,
          }}
        />
      ))}

      <style>{`
        .ripple-ring {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 1.5px solid;
          border-radius: 50%;
          opacity: 0;
          animation: rippleExpand 10s ease-out infinite;
        }
        @keyframes rippleExpand {
          0% {
            width: 60px;
            height: 60px;
            opacity: 0;
          }
          5% {
            opacity: 0.6;
          }
          100% {
            width: min(1400px, 140vw);
            height: min(1400px, 140vw);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
