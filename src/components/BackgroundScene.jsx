// Simple 3-stage waste flow: Collection → Sorting → Processing
export default function BackgroundScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1300px]"
        viewBox="0 0 1200 340"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.1, stroke: '#1A50D6', fill: 'none' }}
      >
        {/* Animated flow paths */}
        <path className="flow-path"   d="M 310 165 Q 390 120 480 165" />
        <path className="flow-path-2" d="M 720 165 Q 800 120 890 165" />

        {/* STAGE 1 · COLLECTION */}
        <g className="bg-stage-1" transform="translate(90, 100)">
          <rect x="0" y="40" width="140" height="80" rx="10" strokeWidth="3.5" />
          <path d="M100 40 L100 5 Q100 0 108 0 L140 0 L140 40" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="105" y="7" width="28" height="20" rx="3" strokeWidth="2.5" />
          <line x1="125" y1="0" x2="125" y2="-14" strokeWidth="3" strokeLinecap="round" />
          <path className="fly-1" d="M125 -14 Q132 -22 128 -30" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="30"  cy="122" r="20" strokeWidth="3.5" />
          <circle cx="30"  cy="122" r="8"  strokeWidth="2.5" />
          <circle cx="112" cy="122" r="20" strokeWidth="3.5" />
          <circle cx="112" cy="122" r="8"  strokeWidth="2.5" />
          <rect x="12" y="12" width="82" height="30" rx="4" strokeWidth="2.5" />
          <line x1="35" y1="16" x2="35" y2="40" strokeWidth="2" />
          <line x1="53" y1="16" x2="53" y2="40" strokeWidth="2" />
          <line x1="71" y1="16" x2="71" y2="40" strokeWidth="2" />
          <circle className="fly-1" cx="8"  cy="4" r="5" strokeWidth="2" />
          <rect   className="fly-2" x="90" y="-8" width="14" height="10" rx="2" strokeWidth="2" />
        </g>
        <text style={{ fontFamily:'Inter,sans-serif', fontSize:22, fontWeight:700, fill:'#1A50D6', letterSpacing:1 }}
              x="162" y="300" textAnchor="middle">Collection</text>

        {/* STAGE 2 · SORTING */}
        <g className="spin-slow" transform="translate(510, 90)">
          <circle cx="100" cy="100" r="85" strokeWidth="2" strokeDasharray="6 5" />
          <path d="M100 20 A80 80 0 0 1 169 160" strokeWidth="4" strokeLinecap="round" />
          <polygon points="169,160 183,148 158,142" fill="#1A50D6" opacity="0.55" stroke="none" />
          <path d="M169 160 A80 80 0 0 1 31 160" strokeWidth="4" strokeLinecap="round" />
          <polygon points="31,160 17,172 42,178"  fill="#1A50D6" opacity="0.55" stroke="none" />
          <path d="M31 160 A80 80 0 0 1 100 20"  strokeWidth="4" strokeLinecap="round" />
          <polygon points="100,20 88,8 112,8"    fill="#1A50D6" opacity="0.55" stroke="none" />
          <text x="100" y="115" textAnchor="middle"
                style={{ fontFamily:'Inter,sans-serif', fontSize:42, fontWeight:900, fill:'#1A50D6', opacity:0.3 }}>R</text>
        </g>
        <text style={{ fontFamily:'Inter,sans-serif', fontSize:22, fontWeight:700, fill:'#1A50D6', letterSpacing:1 }}
              x="610" y="300" textAnchor="middle">Sorting</text>

        {/* STAGE 3 · PROCESSING */}
        <g className="bg-stage-3" transform="translate(900, 88)">
          <path d="M95 180 Q30 155 25 95 Q22 30 95 18 Q168 30 165 95 Q160 155 95 180 Z"
                strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M95 180 L95 80"          strokeWidth="2.5" strokeLinecap="round" />
          <path d="M95 150 Q70 130 55 110"  strokeWidth="2"   strokeLinecap="round" />
          <path d="M95 130 Q120 110 135 90" strokeWidth="2"   strokeLinecap="round" />
          <path d="M95 110 Q72 92 62 72"    strokeWidth="2"   strokeLinecap="round" />
          <path d="M95 95 Q118 78 128 58"   strokeWidth="2"   strokeLinecap="round" />
          <g className="sp-1" transform="translate(158, 38)">
            <line x1="0" y1="-11" x2="0"  y2="11"  strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-11" y1="0" x2="11" y2="0"   strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-7" y1="-7" x2="7"  y2="7"   strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="-7"  x2="-7" y2="7"   strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g className="sp-2" transform="translate(26, 52) scale(0.7)">
            <line x1="0" y1="-11" x2="0"  y2="11"  strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-11" y1="0" x2="11" y2="0"   strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g className="sp-3" transform="translate(172, 132) scale(0.55)">
            <line x1="0" y1="-11" x2="0"  y2="11"  strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-11" y1="0" x2="11" y2="0"   strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
        <text style={{ fontFamily:'Inter,sans-serif', fontSize:22, fontWeight:700, fill:'#1A50D6', letterSpacing:1 }}
              x="995" y="300" textAnchor="middle">Processing</text>

      </svg>
    </div>
  )
}
