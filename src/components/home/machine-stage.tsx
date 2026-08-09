export function MachineStage() {
  return (
    <div aria-hidden="true" className="machine-stage">
      <svg
        className="machine-stage__drawing"
        focusable="false"
        viewBox="0 0 720 520"
      >
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
        <circle
          className="machine-stage__axis"
          cx="339"
          cy="244"
          r="34"
        />
        <path
          className="machine-stage__detail"
          d="M198 246h34m214 0h126M198 354h374M282 136V94h114v42"
        />
        <path
          className="machine-stage__datum-line"
          d="M46 414h626M360 54v416"
        />
      </svg>
      <span className="machine-stage__plate" />
    </div>
  );
}
