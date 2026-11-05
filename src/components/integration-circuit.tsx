import styles from "./existing-tools.module.css";

type Side = "from" | "to";

function wire(index: number, side: Side, stacked: boolean) {
  if (stacked) {
    const x = 32 + 64 * index;
    return side === "from"
      ? `M${x} 64 V68 C${x} 95 77 83 77 115 V127 Q77 143 93 143 H109`
      : `M211 143 H227 Q243 143 243 159 V173 C243 199 ${x} 193 ${x} 219 V226`;
  }

  const y = 32 + 64 * index;
  return side === "from"
    ? `M171 ${y} H188 C230 ${y} 222 160 253 160 H265`
    : `M435 160 H447 C478 160 470 ${y} 512 ${y} H529`;
}

function Plug({ x, y, output }: { x: number; y: number; output: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${output ? -1 : 1} 1)`}>
    <g className={styles.plugSlide}>
      <path d="M-21 0h9" stroke="#45557e" strokeWidth="3" strokeLinecap="round" />
      <path d="M0-2.6h6M0 2.6h6" stroke="#526589" strokeWidth="2" strokeLinecap="round" />
      <path d="m-14-3 4-3H0l2 2v8l-2 2h-10l-4-3Z" fill="currentColor" stroke="#35477c" strokeWidth=".8" />
      <path d="M-10-4H0M-8-1v4m3-4v4" fill="none" stroke="#fff" strokeOpacity=".72" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </g>;
}

export function IntegrationCircuit({ active, count, stacked, hubUrl }: {
  active: number; count: number; stacked: boolean; hubUrl: string;
}) {
  const ports = stacked ? { left: 106, right: 214, y: 143 } : { left: 262, right: 438, y: 160 };
  const hub = stacked ? { x: 96, y: 86, width: 128 } : { x: 246, y: 67, width: 208 };
  return <svg className={stacked ? styles.stackedCircuit : styles.wideCircuit} viewBox={stacked ? "0 0 320 290" : "0 0 700 320"} aria-hidden="true" focusable="false">
    {(["from", "to"] as const).map(side => {
      const activeWire = wire(active, side, stacked);
      return <g key={side} className={side === "from" ? styles.input : styles.output}>
        {Array.from({ length: count }, (_, index) => (
          <path key={index} d={wire(index, side, stacked)} className={styles.trace} />
        ))}
        <g key={active}>
          <path d={activeWire} className={styles.routeGlow} />
          <path d={activeWire} className={styles.route} />
          <path d={activeWire} pathLength="1" className={styles.signal} />
        </g>
      </g>;
    })}
    <g transform={`translate(${hub.x} ${hub.y}) scale(${hub.width / 200})`}>
      <g key={active}>
        <path className={styles.hubRipple} d="m4 98 91-46q5-3 10 0l91 46q5 3 0 6l-91 46q-5 3-10 0L4 104q-5-3 0-6Z" />
        <image href={hubUrl} width="200" height="160" />
        <path className={styles.hubLight} d="m20 86 77 38q3 2 6 0l77-38" />
      </g>
    </g>
    <g key={active}>
      <g className={styles.input}><Plug x={ports.left} y={ports.y} output={false} /></g>
      <g className={styles.output}><Plug x={ports.right} y={ports.y} output /></g>
    </g>
    <text x={stacked ? 160 : 350} y={stacked ? 195 : 244} textAnchor="middle" className={styles.hubName}>Cognalys</text>
  </svg>;
}
