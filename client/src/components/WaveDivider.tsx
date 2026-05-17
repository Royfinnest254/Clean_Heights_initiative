/**
 * WaveDivider – animated SVG section divider inspired by the flowing rivers,
 * rolling highland terrain, and morning mist of Elgeyo Marakwet.
 * Multiple variants with gentle undulation animation.
 */
export default function WaveDivider({
  variant = "terrain",
  color = "#1B4332",
  flip = false,
  className = "",
}: {
  variant?: "terrain" | "water" | "mist";
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  const dividerPaths = {
    terrain: {
      back: "M0,60 C120,20 240,90 360,50 C480,10 600,80 720,40 C840,5 960,70 1080,35 C1200,0 1320,55 1440,30 L1440,120 L0,120 Z",
      mid:  "M0,70 C150,35 280,95 420,55 C560,20 680,85 840,50 C960,15 1100,75 1260,40 C1340,25 1400,60 1440,45 L1440,120 L0,120 Z",
      front:"M0,80 C180,50 300,100 480,65 C620,35 760,90 920,55 C1060,25 1200,80 1360,50 C1410,40 1430,65 1440,55 L1440,120 L0,120 Z",
    },
    water: {
      back: "M0,55 Q180,20 360,55 T720,55 T1080,55 T1440,55 L1440,120 L0,120 Z",
      mid:  "M0,65 Q180,30 360,65 T720,65 T1080,65 T1440,65 L1440,120 L0,120 Z",
      front:"M0,75 Q180,45 360,75 T720,75 T1080,75 T1440,75 L1440,120 L0,120 Z",
    },
    mist: {
      back: "M0,50 C240,30 480,70 720,40 C960,10 1200,60 1440,35 L1440,120 L0,120 Z",
      mid:  "M0,65 C200,45 440,80 720,55 C1000,30 1240,70 1440,50 L1440,120 L0,120 Z",
      front:"M0,80 C180,60 400,95 720,70 C1040,45 1280,85 1440,65 L1440,120 L0,120 Z",
    },
  };

  const paths = dividerPaths[variant];

  return (
    <div
      aria-hidden="true"
      className={`relative w-full h-[60px] md:h-[80px] lg:h-[100px] overflow-hidden ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Back layer — deepest, slowest */}
        <path
          d={paths.back}
          fill={color}
          opacity="0.15"
          className="wave-layer wave-back"
        />
        {/* Mid layer */}
        <path
          d={paths.mid}
          fill={color}
          opacity="0.25"
          className="wave-layer wave-mid"
        />
        {/* Front layer — most visible */}
        <path
          d={paths.front}
          fill={color}
          opacity="0.4"
          className="wave-layer wave-front"
        />
      </svg>

      <style>{`
        @keyframes waveShift1 {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-20px); }
          100% { transform: translateX(0); }
        }
        @keyframes waveShift2 {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(15px); }
          100% { transform: translateX(0); }
        }
        @keyframes waveShift3 {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-10px); }
          100% { transform: translateX(0); }
        }
        .wave-back  { animation: waveShift1 12s ease-in-out infinite; }
        .wave-mid   { animation: waveShift2 8s ease-in-out infinite; }
        .wave-front { animation: waveShift3 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
