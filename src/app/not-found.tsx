import Link from "next/link";
import { Icon } from "@/components/icon";

export default function NotFound() {
  return <main id="contenu" className="error-page"><div><span className="eyebrow">ERREUR 404</span><h1>Cette page a pris<br />un autre chemin.</h1><p>Le lien est peut-être incorrect ou la page n’existe plus. Retrouvez les solutions Cognalys depuis l’accueil.</p><Link href="/" className="button button-cyan">Retour à l’accueil<Icon name="arrow" /></Link></div></main>;
}
