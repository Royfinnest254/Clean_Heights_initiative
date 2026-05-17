/**
 * FloatingParticles – botanical-inspired particles that drift upward,
 * referencing pollen, spores, leaves, and water droplets in the highland air.
 * Renders a mix of dots, SVG leaf shapes, and water droplet silhouettes.
 */

type ParticleType = "dot" | "leaf" | "droplet";

interface ParticleConfig {
  x: number;
  delay: number;
  dur: number;
  size: number;
  o: number;
  type: ParticleType;
  rotation?: number;
}

const PARTICLES: ParticleConfig[] = [
  { x: 8,  delay: 0,    dur: 14, size: 3,   o: 0.35, type: "dot" },
  { x: 18, delay: 2.5,  dur: 18, size: 8,   o: 0.18, type: "leaf", rotation: 45 },
  { x: 28, delay: 5,    dur: 12, size: 4,   o: 0.3,  type: "dot" },
  { x: 38, delay: 1,    dur: 20, size: 6,   o: 0.15, type: "droplet" },
  { x: 48, delay: 7,    dur: 15, size: 3,   o: 0.3,  type: "dot" },
  { x: 58, delay: 3.5,  dur: 17, size: 10,  o: 0.14, type: "leaf", rotation: -30 },
  { x: 67, delay: 9,    dur: 13, size: 3.5, o: 0.35, type: "dot" },
  { x: 75, delay: 0.5,  dur: 19, size: 5,   o: 0.16, type: "droplet" },
  { x: 83, delay: 6,    dur: 16, size: 3,   o: 0.28, type: "dot" },
  { x: 92, delay: 4,    dur: 11, size: 9,   o: 0.12, type: "leaf", rotation: 60 },
  { x: 14, delay: 8,    dur: 22, size: 2.5, o: 0.18, type: "dot" },
  { x: 43, delay: 11,   dur: 14, size: 7,   o: 0.13, type: "droplet" },
  { x: 62, delay: 13,   dur: 18, size: 2,   o: 0.22, type: "dot" },
  { x: 87, delay: 2,    dur: 16, size: 11,  o: 0.11, type: "leaf", rotation: -45 },
  { x: 23, delay: 6,    dur: 20, size: 3,   o: 0.25, type: "dot" },
  { x: 53, delay: 10,   dur: 15, size: 6,   o: 0.14, type: "droplet" },
  { x: 73, delay: 4.5,  dur: 19, size: 8,   o: 0.12, type: "leaf", rotation: 20 },
  { x: 96, delay: 7.5,  dur: 13, size: 2.5, o: 0.30, type: "dot" },
];

function LeafSvg({ size, color, rotation = 0 }: { size: number; color: string; rotation?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 10 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M5 0 C7.5 3.5 10 7 5 14 C0 7 2.5 3.5 5 0Z"
        fill={color}
      />
      <path
        d="M5 2 L5 12"
        stroke={color}
        strokeWidth="0.3"
        opacity="0.5"
      />
      <path
        d="M5 5 L3 7 M5 7 L7 9"
        stroke={color}
        strokeWidth="0.2"
        opacity="0.4"
      />
    </svg>
  );
}

function DropletSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 10 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 0 C5 0 10 6 10 8.5 C10 11 7.76 13 5 13 C2.24 13 0 11 0 8.5 C0 6 5 0 5 0Z"
        fill={color}
      />
      <ellipse
        cx="4"
        cy="8"
        rx="1.2"
        ry="1.8"
        fill="white"
        opacity="0.25"
      />
    </svg>
  );
}

export default function FloatingParticles({
  color = "#40916C",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle-item"
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: "-12px",
            opacity: p.o,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            animationName: p.type === "leaf" ? "particleFloatSpin" : "particleFloat",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        >
          {p.type === "dot" && (
            <span
              style={{
                display: "block",
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background: color,
              }}
            />
          )}
          {p.type === "leaf" && (
            <LeafSvg size={p.size} color={color} rotation={p.rotation} />
          )}
          {p.type === "droplet" && (
            <DropletSvg size={p.size} color={color} />
          )}
        </span>
      ))}

      <style>{`
        @keyframes particleFloat {
          0%   { transform: translateY(0)   translateX(0)    scale(1);   opacity: 0; }
          10%  { opacity: var(--p-o, 0.3); }
          50%  { transform: translateY(-55vh) translateX(12px)  scale(1.1); }
          90%  { opacity: var(--p-o, 0.3); }
          100% { transform: translateY(-110vh) translateX(-6px) scale(0.8); opacity: 0; }
        }
        @keyframes particleFloatSpin {
          0%   { transform: translateY(0)    translateX(0)    rotate(0deg)   scale(1);   opacity: 0; }
          10%  { opacity: var(--p-o, 0.2); }
          25%  { transform: translateY(-28vh) translateX(20px) rotate(45deg)  scale(1.1); }
          50%  { transform: translateY(-55vh) translateX(-10px) rotate(120deg) scale(1.05); }
          75%  { transform: translateY(-82vh) translateX(15px) rotate(200deg) scale(0.95); }
          90%  { opacity: var(--p-o, 0.2); }
          100% { transform: translateY(-110vh) translateX(-8px) rotate(300deg) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
