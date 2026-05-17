/**
 * HighlandAurora – animated gradient mesh background inspired by
 * the mist, foliage, and golden light of the Elgeyo Marakwet highlands.
 * Uses animated radial-gradient blobs with CSS keyframes for a
 * living, organic feel. Pure CSS, zero JS overhead.
 */
export default function HighlandAurora({
  variant = "green",
  className = "",
}: {
  variant?: "green" | "gold" | "dark" | "water";
  className?: string;
}) {
  const palettes = {
    green: {
      blob1: "rgba(27, 67, 50, 0.12)",
      blob2: "rgba(64, 145, 108, 0.10)",
      blob3: "rgba(192, 138, 62, 0.06)",
      blob4: "rgba(45, 106, 79, 0.08)",
    },
    gold: {
      blob1: "rgba(192, 138, 62, 0.14)",
      blob2: "rgba(27, 67, 50, 0.08)",
      blob3: "rgba(233, 175, 31, 0.06)",
      blob4: "rgba(64, 145, 108, 0.07)",
    },
    dark: {
      blob1: "rgba(64, 145, 108, 0.20)",
      blob2: "rgba(192, 138, 62, 0.12)",
      blob3: "rgba(27, 67, 50, 0.25)",
      blob4: "rgba(45, 106, 79, 0.15)",
    },
    water: {
      blob1: "rgba(64, 145, 108, 0.14)",
      blob2: "rgba(74, 144, 164, 0.10)",
      blob3: "rgba(27, 67, 50, 0.08)",
      blob4: "rgba(45, 106, 79, 0.12)",
    },
  };

  const p = palettes[variant];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Blob 1 — large, slow orbit */}
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${p.blob1}, transparent 70%)`,
        }}
      />
      {/* Blob 2 — medium, counter-orbit */}
      <div
        className="aurora-blob aurora-blob-2"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${p.blob2}, transparent 65%)`,
        }}
      />
      {/* Blob 3 — small accent */}
      <div
        className="aurora-blob aurora-blob-3"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${p.blob3}, transparent 60%)`,
        }}
      />
      {/* Blob 4 — ambient fill */}
      <div
        className="aurora-blob aurora-blob-4"
        style={{
          background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${p.blob4}, transparent 70%)`,
        }}
      />

      <style>{`
        .aurora-blob {
          position: absolute;
          width: 100%;
          height: 100%;
          will-change: transform;
          filter: blur(40px);
        }
        @keyframes auroraOrbit1 {
          0%   { transform: translate(-10%, -5%)  scale(1); }
          25%  { transform: translate(15%, 10%)   scale(1.15); }
          50%  { transform: translate(5%, -15%)   scale(1.05); }
          75%  { transform: translate(-15%, 5%)   scale(1.1); }
          100% { transform: translate(-10%, -5%)  scale(1); }
        }
        @keyframes auroraOrbit2 {
          0%   { transform: translate(10%, 10%)   scale(1.1); }
          25%  { transform: translate(-20%, -5%)  scale(0.95); }
          50%  { transform: translate(-5%, 20%)   scale(1.15); }
          75%  { transform: translate(15%, -10%)  scale(1); }
          100% { transform: translate(10%, 10%)   scale(1.1); }
        }
        @keyframes auroraOrbit3 {
          0%   { transform: translate(20%, -10%)  scale(1); }
          33%  { transform: translate(-10%, 15%)  scale(1.2); }
          66%  { transform: translate(-15%, -20%) scale(0.9); }
          100% { transform: translate(20%, -10%)  scale(1); }
        }
        @keyframes auroraOrbit4 {
          0%   { transform: translate(-5%, 15%)   scale(1.05); }
          50%  { transform: translate(10%, -10%)  scale(0.95); }
          100% { transform: translate(-5%, 15%)   scale(1.05); }
        }
        .aurora-blob-1 { animation: auroraOrbit1 20s ease-in-out infinite; }
        .aurora-blob-2 { animation: auroraOrbit2 25s ease-in-out infinite; }
        .aurora-blob-3 { animation: auroraOrbit3 18s ease-in-out infinite; }
        .aurora-blob-4 { animation: auroraOrbit4 30s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
