export function MachineStage() {
  return (
    <div aria-hidden="true" className="machine-stage">
      <div className="machine-stage__meta">
        <span className="machine-stage__tag">CAD STAGE // MODEL PREVIEW</span>
        <span className="machine-stage__tag">REF: STATIC-DATUM</span>
      </div>
      <svg
        className="machine-stage__drawing"
        focusable="false"
        viewBox="0 0 720 520"
      >
        {/* Blueprint Grid Lines */}
        <line className="machine-stage__grid" x1="60" y1="100" x2="660" y2="100" />
        <line className="machine-stage__grid" x1="60" y1="260" x2="660" y2="260" />
        <line className="machine-stage__grid" x1="60" y1="420" x2="660" y2="420" />
        <line className="machine-stage__grid" x1="180" y1="60" x2="180" y2="460" />
        <line className="machine-stage__grid" x1="360" y1="60" x2="360" y2="460" />
        <line className="machine-stage__grid" x1="540" y1="60" x2="540" y2="460" />

        {/* Outer Frame & Chassis Outline */}
        <path
          className="machine-stage__outline"
          d="M124 414V208h74v-72h282v72h92v206"
        />
        <path
          className="machine-stage__outline"
          d="M82 414h556M172 414v46m356-46v46M142 460h416"
        />
        <rect
          className="machine-stage__panel"
          height="132"
          width="214"
          x="232"
          y="178"
        />

        {/* Central Drive Axis & Bearings */}
        <circle
          className="machine-stage__axis"
          cx="339"
          cy="244"
          r="34"
        />
        <circle
          className="machine-stage__axis-inner"
          cx="339"
          cy="244"
          r="12"
        />

        {/* Structural Detail Paths */}
        <path
          className="machine-stage__detail"
          d="M198 246h34m214 0h126M198 354h374M282 136V94h114v42"
        />

        {/* Datum Centerlines */}
        <path
          className="machine-stage__datum-line"
          d="M46 414h626M360 54v416"
        />

        {/* CAD Crosshairs */}
        <g className="machine-stage__crosshairs">
          <path d="M175 244h10M180 239v10" />
          <path d="M495 244h10M500 239v10" />
          <path d="M334 136h10M339 131v10" />
          <path d="M334 354h10M339 349v10" />
        </g>

        {/* Dimension Vectors & Technical Marks */}
        <g className="machine-stage__dimensions">
          <line x1="82" y1="480" x2="638" y2="480" stroke="currentColor" strokeDasharray="3 3" />
          <text x="360" y="498" textAnchor="middle" className="machine-stage__dim-text">DATUM X // REFERENCE</text>
          <text x="70" y="270" textAnchor="middle" className="machine-stage__dim-text" transform="rotate(-90 70 270)">DATUM Y // REFERENCE</text>
        </g>
      </svg>
      <span className="machine-stage__plate" />
    </div>
  );
}
