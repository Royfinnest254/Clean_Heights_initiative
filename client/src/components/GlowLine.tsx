/**
 * GlowLine – animated glowing accent line with a light pulse traveling
 * along its length, evoking a river of light or energy flowing through
 * the highlands. Used as a premium section separator.
 */
export default function GlowLine({
  color = "#40916C",
  accentColor = "#C08A3E",
  width = "80%",
  className = "",
}: {
  color?: string;
  accentColor?: string;
  width?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center ${className}`}
    >
      <div className="glow-line-container" style={{ width }}>
        {/* Base line */}
        <div className="glow-line-base" style={{ backgroundColor: color }} />
        {/* Traveling glow */}
        <div
          className="glow-line-pulse"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
            boxShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}40`,
          }}
        />
      </div>

      <style>{`
        .glow-line-container {
          position: relative;
          height: 2px;
          overflow: hidden;
        }
        .glow-line-base {
          position: absolute;
          inset: 0;
          opacity: 0.2;
        }
        .glow-line-pulse {
          position: absolute;
          top: -1px;
          width: 80px;
          height: 4px;
          border-radius: 4px;
          animation: glowTravel 4s ease-in-out infinite;
        }
        @keyframes glowTravel {
          0%   { left: -80px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: calc(100% + 80px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
