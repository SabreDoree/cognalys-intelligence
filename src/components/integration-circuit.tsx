import Image from "next/image";
import styles from "./existing-tools.module.css";

export type Station = { id: string; name: string; event: string };

function Cable({ outgoing = false }: { outgoing?: boolean }) {
  const path = outgoing ? "M0 18H50C64 18 68 7 82 7H120" : "M0 7H38C52 7 56 18 70 18H120";
  return <div className={`${styles.leg} ${outgoing ? styles.outgoing : styles.incoming}`} aria-hidden="true">
    <div className={styles.wire}>
      <svg viewBox="0 0 120 28" preserveAspectRatio="none" focusable="false">
        <path d={path} className={styles.sheath} /><path d={path} className={styles.filament} />
      </svg>
      <span className={styles.arrowhead} />
      <svg className={styles.packet} viewBox="0 0 16 19" focusable="false">
        <path d="M2 1h8l4 4v12H2Z" fill="currentColor" stroke="#15264f" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M10 1v5h4M5 9h6m-6 3h4" fill="none" stroke="#263e65" strokeWidth="1.15" strokeLinecap="round" />
      </svg>
      <span className={styles.plug}><svg viewBox="0 0 23 18" focusable="false">
        <path d="M15 6h7m-7 6h7" fill="none" stroke="#dae6ff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="m1 6 5-4h9l2 2v10l-2 2H6l-5-4Z" fill="currentColor" stroke="#263654" strokeWidth="1.4" />
        <path d="M6 4h8M7 7v5m4-5v5" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.4" />
      </svg></span>
    </div>
  </div>;
}

function LogoTile({ station, side, assetPath }: { station: Station; side: "source" | "destination"; assetPath: string }) {
  return <div className={`${styles.station} ${styles[side]}`}>
    <span className={styles.role}>{side === "source" ? "Départ" : "Arrivée"}</span>
    <div className={styles.tile} data-logo={station.id}>
      <Image src={`${assetPath}/${station.id}.svg`} alt="" width={80} height={80} unoptimized />
    </div>
  </div>;
}

export function IntegrationCircuit({ from, to, assetPath }: { from: Station; to: Station; assetPath: string }) {
  return <div className={styles.diagram} role="img" aria-label={`De ${from.name} vers ${to.name} via Cognalys. ${from.event}. ${to.event}.`}>
    <div className={styles.rail}>
      <LogoTile station={from} side="source" assetPath={assetPath} />
      <Cable />
      <svg className={styles.hub} viewBox="0 0 200 160" aria-hidden="true" focusable="false">
        <ellipse className={styles.hubGlow} cx="100" cy="118" rx="82" ry="27" />
        <image href={`${assetPath}/cognalys-hub.svg`} width="200" height="160" />
        <path className={styles.hubLight} d="m20 86 77 38q3 2 6 0l77-38" />
      </svg>
      <Cable outgoing />
      <LogoTile station={to} side="destination" assetPath={assetPath} />
    </div>
    <div className={styles.stationNames}>
      <div><strong>{from.name}</strong><span>{from.event}</span></div>
      <strong className={styles.hubName}>Cognalys</strong>
      <div><strong>{to.name}</strong><span>{to.event}</span></div>
    </div>
  </div>;
}
