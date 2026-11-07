import { Icon } from "./icon";
import { HeroNetwork } from "./hero-network";
import styles from "./landing-hero.module.css";

export function LandingHero() {
  return <section className={`shell ${styles.hero}`} aria-labelledby="hero-heading">
    <div className={styles.copy}>
      <p className={styles.eyebrow}><span /> L’AUTOMATISATION AU SERVICE DE VOTRE ACTIVITÉ</p>
      <h1 id="hero-heading" aria-label="Vos tâches répétitives, prises en charge.">
        Vos tâches répétitives,
        <span className={styles.reel} aria-hidden="true">
          <span className={styles.phrase}>prises en charge.</span>
          <span className={styles.phrase}>automatisées.</span>
          <span className={styles.phrase}>confiées à un agent IA.</span>
          <span className={styles.phrase}><span className={styles.erased}>disparues.</span></span>
        </span>
      </h1>
      <p className={styles.intro}>Devis, relances, service client, saisie et suivi des prospects : connectez vos outils et réduisez le travail manuel de votre équipe.</p>
      <div className={styles.actions}>
        <a href="#contact" className={styles.primary}>Automatiser mon entreprise<span className={styles.ctaLook}><Icon name="arrow" /><span className={styles.ctaEyes} aria-hidden="true"><i /><i /></span></span></a>
        <a href="#demonstration" className={styles.secondary}>Voir les démonstrations<Icon name="play" /></a>
      </div>
      <div className={styles.assurances} aria-label="Notre approche">
        <span><Icon name="plug" />Vos outils conservés</span><span><Icon name="workflow" />Solution sur mesure</span><span><Icon name="hand" />Vous gardez la main</span>
      </div>
    </div>
    <HeroNetwork />
  </section>;
}
