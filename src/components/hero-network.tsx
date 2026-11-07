import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./landing-hero.module.css";

const apps = [
  { id: "gmail", name: "Gmail", x: 20, y: 15, dx: -9, dy: 14, angle: -20, count: 48, group: "sourceA" },
  { id: "whatsapp", name: "WhatsApp", x: 13, y: 71, dx: 53, dy: 3, angle: -14, count: 17, group: "sourceB" },
  { id: "hubspot", name: "HubSpot", x: 78, y: 81, dx: -53, dy: -10, angle: 22, count: 9, group: "targetA" },
  { id: "notion", name: "Notion", x: 74, y: 11, dx: -19, dy: 7, angle: 15, count: 0, group: "targetB" },
  { id: "instagram", name: "Instagram", x: 89, y: 54, dx: -7, dy: -16, angle: -23, count: 23, group: "quiet" },
  { id: "shopify", name: "Shopify", x: 9, y: 41, dx: 37, dy: 44, angle: 18, count: 12, group: "targetB" },
  { id: "google-sheets", name: "Google Sheets", x: 44, y: 7, dx: 19, dy: 4, angle: -10, count: 0, group: "targetA" },
  { id: "google-ads", name: "Google Ads", x: 42, y: 88, dx: 44, dy: -10, angle: 12, count: 0, group: "quiet" },
];
const links = [
  { from: 0, to: -1, group: "incomingA" }, { from: -1, to: 2, group: "outgoingA" }, { from: -1, to: 6, group: "outgoingA" },
  { from: 1, to: -1, group: "incomingB" }, { from: -1, to: 3, group: "outgoingB" }, { from: -1, to: 5, group: "outgoingB" },
];
function Check() { return <svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10" /></svg>; }

export function HeroNetwork() {
  return <figure className={styles.illustration} aria-label="Illustration : un assistant relie vos messageries, votre CRM et vos applications pour organiser les tâches.">
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.glow} />
      <svg className={styles.connections} viewBox="0 0 100 96">
        {apps.map((app, index) => <line key={app.id} className={styles.connection} x1="50" y1="48" x2={app.x} y2={app.y} pathLength="1" style={{ "--i": index } as CSSProperties} />)}
        {links.map((link,index) => <line key={index} className={`${styles.pulse} ${styles[link.group]}`} x1={link.from < 0 ? 50 : apps[link.from].x} y1={link.from < 0 ? 48 : apps[link.from].y} x2={link.to < 0 ? 50 : apps[link.to].x} y2={link.to < 0 ? 48 : apps[link.to].y} pathLength="1" />)}
      </svg>
      {apps.map((app,index) => <div key={app.id} className={styles.position} style={{ "--x": app.x, "--y": app.y, "--dx": app.dx, "--dy": app.dy, "--angle": `${app.angle}deg`, "--i": index, "--float": `${5 + index % 4 * .5}s` } as CSSProperties}>
        <div className={styles.float}><div className={styles.tile}>
          <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/integrations/${app.id}.svg`} alt="" width={40} height={40} unoptimized priority />
          <span className={`${styles.tileRing} ${styles[app.group]}`} />
          {app.count > 0 && <span className={styles.badge}>{app.count}</span>}
          <span className={styles.firstCheck}><Check /></span>
          <span className={`${styles.loopCheck} ${styles[app.group]}`}><Check /></span>
        </div></div>
      </div>)}
      <div className={styles.botPosition}><div className={styles.botBounce}><span className={styles.botRing} /><Image className={styles.hubIcon} src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg`} alt="" width={96} height={96} unoptimized priority /></div></div>
    </div>
    <figcaption>Vos applications. Un même flux de travail.</figcaption>
  </figure>;
}
