"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="contenu" className="error-page"><div><span className="eyebrow">UNE ERREUR EST SURVENUE</span><h1>Reprenons le fil.</h1><p>La page n’a pas pu être chargée. Vous pouvez réessayer ou revenir à l’accueil.</p><button className="button button-cyan" onClick={reset}>Réessayer</button><div><Link className="text-link" href="/">Retour à l’accueil</Link></div></div></main>;
}
