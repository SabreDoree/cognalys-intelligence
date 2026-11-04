"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="fr"><body style={{ margin: 0, padding: "15vh 24px", background: "#ffffff", color: "#292929", fontFamily: "Arial, sans-serif", textAlign: "center" }}><main><h1>Le site est temporairement indisponible.</h1><p>Une erreur a interrompu le chargement. Réessayez dans un instant.</p><button onClick={reset} style={{ padding: "14px 24px", background: "#2864cf", color: "#ffffff", border: 0, borderRadius: 4, cursor: "pointer" }}>Réessayer</button></main></body></html>;
}
