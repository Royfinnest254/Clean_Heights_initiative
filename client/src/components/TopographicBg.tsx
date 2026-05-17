/**
 * TopographicBg – animated SVG contour lines referencing the Keiyo Escarpment terrain.
 * Pure CSS animation, zero JS overhead, fully decorative.
 */
export default function TopographicBg({
  color = "#1B4332",
  opacity = 0.06,
  className = "",
}: {
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke={color} opacity={opacity}>
          {/* Contour line set 1 — slow drift */}
          <g className="topo-drift-1" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 5">
            <path d="M-100,750 Q200,680 400,720 Q650,760 900,690 Q1100,630 1300,670 Q1420,690 1540,650" />
            <path strokeWidth="0.8" d="M-100,700 Q180,630 380,670 Q620,710 880,640 Q1080,580 1280,620 Q1400,640 1540,600" />
            <path d="M-100,650 Q160,580 360,620 Q590,660 860,590 Q1060,530 1260,570 Q1380,590 1540,550" />
            <path strokeWidth="1.2" d="M-100,600 Q240,540 460,570 Q700,600 940,540 Q1140,490 1360,520 Q1460,540 1540,500" />
            <path d="M-100,550 Q220,490 440,520 Q680,550 920,490 Q1120,440 1340,470 Q1440,490 1540,450" />
            <path strokeWidth="0.9" d="M-100,500 Q200,440 400,470 Q640,500 880,440 Q1080,390 1300,420 Q1420,440 1540,400" />
            <path d="M-100,450 Q180,390 380,420 Q620,450 860,390 Q1060,340 1280,370 Q1400,390 1540,350" />
            <path strokeWidth="1.1" d="M-100,400 Q160,340 360,370 Q590,400 840,340 Q1040,290 1260,320 Q1380,340 1540,300" />
          </g>
          {/* Contour line set 2 — reverse drift for depth */}
          <g className="topo-drift-2" opacity="0.6" strokeWidth="0.7" strokeDasharray="1 4">
            <path d="M-100,820 Q300,760 500,800 Q750,840 1000,770 Q1200,710 1400,750 Q1480,770 1540,740" />
            <path d="M-100,870 Q280,810 480,850 Q730,890 980,820 Q1180,760 1380,800 Q1460,820 1540,790" />
            <path d="M-100,350 Q220,290 440,320 Q690,350 940,280 Q1140,220 1360,250 Q1460,265 1540,230" />
            <path d="M-100,300 Q200,240 400,270 Q640,300 880,230 Q1080,170 1300,200 Q1420,215 1540,180" />
            <path d="M-100,250 Q180,190 380,220 Q620,250 860,180 Q1060,120 1280,150 Q1400,165 1540,130" />
          </g>
        </g>
      </svg>

      <style>{`
        @keyframes topoDrift1 {
          0%   { transform: translateX(0px) translateY(0px); }
          50%  { transform: translateX(18px) translateY(-8px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes topoDrift2 {
          0%   { transform: translateX(0px) translateY(0px); }
          50%  { transform: translateX(-14px) translateY(6px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        .topo-drift-1 {
          animation: topoDrift1 18s ease-in-out infinite;
          transform-origin: center;
        }
        .topo-drift-2 {
          animation: topoDrift2 24s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
