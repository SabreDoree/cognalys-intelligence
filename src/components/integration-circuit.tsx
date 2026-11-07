import Image from "next/image";
import styles from "./existing-tools.module.css";

export type Station = { id: string; name: string; event: string };

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
      <span className={styles.flowLine} aria-hidden="true" />
      <Image className={styles.hub} src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg`} alt="" width={112} height={112} unoptimized />
      <span className={`${styles.flowLine} ${styles.outgoing}`} aria-hidden="true" />
      <LogoTile station={to} side="destination" assetPath={assetPath} />
    </div>
    <div className={styles.stationNames}>
      <div><strong>{from.name}</strong><span>{from.event}</span></div>
      <strong className={styles.hubName}>Cognalys</strong>
      <div><strong>{to.name}</strong><span>{to.event}</span></div>
    </div>
  </div>;
}
