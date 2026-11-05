import { Icon } from "./icon";

/** Illustration éditoriale : aucun traitement réel ni résultat client revendiqué. */
export function HeroFlow() {
  return <figure className="hero-story" aria-label="Exemple : une demande de devis devient un dossier préparé, à valider par votre équipe">
    <figcaption><span className="story-dot" /> UN EXEMPLE PARMI D’AUTRES</figcaption>
    <div className="story-email"><div className="story-email-top"><span className="story-icon"><Icon name="mail" /></span><div><strong>Une demande de devis arrive.</strong><span>Dans votre boîte email habituelle</span></div><span className="story-time">09:41</span></div><p>« Bonjour, pouvez-vous me faire un devis pour votre prestation ? Voici les informations… »</p></div>
    <div className="story-connector"><span />Au lieu de tout reprendre à la main<Icon name="arrow" /></div>
    <div className="story-result"><div className="story-result-heading"><span className="story-icon"><Icon name="spark" /></span><div><span>CE QUI PEUT ÊTRE PRIS EN CHARGE</span><h2>Le devis se prépare.</h2></div></div><ul><li><Icon name="check" /><span>Le besoin est relevé dans le message.</span></li><li><Icon name="check" /><span>Un devis est préparé selon vos tarifs.</span></li><li><Icon name="check" /><span>Une relance est prévue si le client ne répond pas.</span></li></ul><div className="story-human"><Icon name="hand" /><p><strong>Votre équipe garde la main.</strong><span>Validation avant envoi si vous choisissez ce contrôle.</span></p></div></div>
    <p className="story-footnote">Une possibilité parmi d’autres, à adapter à votre métier et à vos outils.</p>
  </figure>;
}
