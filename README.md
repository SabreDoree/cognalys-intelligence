# Cognalys Intelligence — site web

Site one-page français sur fond blanc, avec le logo fourni et une identité anthracite / bleu. Le positionnement est généraliste : automatisation, intelligence artificielle, connexion de logiciels et outils sur mesure, sans spécialisation sectorielle. Neuf exemples interactifs servent d’inspiration : connexion de logiciels, outil métier, assistant documentaire, devis, relances, factures, tri des demandes, dossiers et chiffres d’activité. Chaque demande est étudiée avant engagement sur sa faisabilité. Trois simulations, méthode, principes, FAQ et formulaire sécurisé complètent le parcours.

**Le code est complet. L’envoi réel des demandes et l’ouverture au référencement nécessitent vos coordonnées, vos informations légales et vos identifiants de services. Aucune donnée officielle n’a été inventée.**

## 1. Lancer le site

Prérequis : Node.js 22 ou supérieur et npm. Une connexion Internet est nécessaire pour installer les dépendances. Il s’agit d’une application Next.js : ouvrir directement un fichier HTML ne remplace pas le lancement du serveur.

```bash
cd cognalys-intelligence
npm ci
cp .env.example .env.local
npm run dev
```

Sous Windows PowerShell, remplacer `cp` par `Copy-Item .env.example .env.local` si nécessaire. Ouvrir [http://localhost:3000](http://localhost:3000).

Pour vérifier la version optimisée :

```bash
npm run check
npm run build
npm start
```

Le mode développement valide les champs, puis retourne explicitement **« aucun message n’a été envoyé ni enregistré »**. Une réponse HTTP 503 avec `code: development` est volontaire. Ce n’est jamais un envoi simulé présenté comme réussi.

## 2. Personnaliser

| Besoin | Fichier |
|---|---|
| Nom, slogan, textes du hero, services, méthode, FAQ, coordonnées, liens sociaux et informations légales | `src/config/site.ts` |
| Neuf exemples de projets, présentés comme des inspirations | `src/config/possibilities.ts` |
| Textes et étapes des trois simulations | `src/config/workflows.ts` |
| Titres et structure des sections | `src/app/page.tsx` |
| Couleurs, espacements, responsive, animations | `src/app/globals.css` |
| Traitement des demandes et messages serveur | `src/lib/contact-handler.ts` |
| Variables privées et paramètres de déploiement | `.env.local`, puis variables de l’hébergeur |
| Visuels, favicon, image de partage social | `public/` |

Les coordonnées vides ne sont pas affichées sur la page commerciale. Les informations légales manquantes apparaissent explicitement dans les pages concernées. Les textes de services n’annoncent aucun chiffre de performance, aucun client ou témoignage inventé.

`NEXT_PUBLIC_BOOKING_URL` est facultatif : renseigner un lien HTTPS de calendrier public. Le bouton principal « Parlons de votre projet » mène au formulaire. Si ce lien est renseigné, la section contact propose aussi « Réserver un échange », sans promettre un créneau confirmé. Aucun calendrier tiers ni script publicitaire n’est chargé dans la page.

Après modification des variables `NEXT_PUBLIC_*` ou des textes/configurations, reconstruire et redéployer le site.

## 3. Activer le formulaire réel

1. Dans `src/config/site.ts`, compléter les coordonnées et les informations officielles. Définir les pratiques réelles de conservation, les prestataires, leurs localisations et les éventuels transferts de données. Relire les deux pages légales, puis passer `legal.validated` à `true`.
2. Dans un compte Resend, vérifier le domaine d’envoi, créer une clé avec le droit d’envoyer, puis définir `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` et `CONTACT_TO_EMAIL`. L’adresse d’expédition doit appartenir au domaine vérifié. Le destinataire est fixé côté serveur ; le visiteur ne peut pas le remplacer.
3. Générer `CONTACT_TOKEN_SECRET` :

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

4. Créer une base Redis compatible avec l’API REST Upstash. Définir `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`. **Le stockage partagé de la limitation est obligatoire en production**, y compris sur un serveur Node. En développement sans Redis, les compteurs sont en mémoire.
5. Définir `NEXT_PUBLIC_SITE_URL` sur l’origine publique HTTPS, `CONTACT_MODE=resend`, puis reconstruire et redémarrer.
6. Soumettre une demande de recette depuis votre domaine, avec vos propres coordonnées. Vérifier son acceptation dans Resend et sa réception dans votre boîte email. Les tests livrés utilisent un fournisseur mocké ; ils ne prouvent pas la délivrabilité de votre domaine.

Une configuration incomplète ou une panne du limiteur provoque un refus explicite. Un succès n’est affiché qu’après réception d’un identifiant valide du fournisseur. L’acceptation par le fournisseur ne garantit pas la livraison finale ; surveiller les rejets et erreurs de réception dans le service d’email.

L’adresse du visiteur est utilisée comme `reply_to`. Il ne reçoit pas automatiquement une copie : cela évite qu’un formulaire public puisse envoyer des messages arbitraires à des tiers.

### Protection et comportement

- Validation Zod commune au navigateur et au serveur ; limites de longueur et refus de caractères de contrôle.
- Vérification de l’origine, JSON uniquement, corps limité à 16 Kio, champ piège antispam.
- Jeton HMAC signé, délai minimal de 2 secondes et expiration après 30 minutes.
- Plafond de 5 tentatives de soumission par heure et de 30 initialisations par heure, par identifiant client fiable.
- Compteurs Redis atomiques, TTL d’une heure, clés IP pseudonymisées par HMAC ; pas de message dans Redis.
- En l’absence de proxy de confiance, plafond global conservateur. Sur Vercel, utilisation de `x-vercel-forwarded-for`. Sur Node, ne choisir `CONTACT_IP_SOURCE=x-forwarded-for` que derrière un proxy qui **remplace** l’en-tête client.
- Reprise du même envoi avec une clé d’idempotence Resend ; en cas de timeout, le texte est conservé et le site ne prétend pas connaître le résultat final.
- Aucune journalisation applicative des messages, coordonnées ou clés. Les journaux des prestataires ont leurs propres règles, à renseigner dans la politique.

Le code ne promet pas de bloquer tous les robots. Ajuster les plafonds dans `siteConfig.form` et ajouter une protection d’infrastructure si le trafic réel l’exige.

Sur une prévisualisation ayant une origine différente de l’URL publique, ajouter **son origine exacte** à `CONTACT_ALLOWED_ORIGINS`. Ne pas utiliser de joker. Une erreur 403 « origine non autorisée » indique une origine absente de cette liste ou une requête intersite.

## 4. Déployer sur Vercel

1. Créer votre dépôt Git à partir du dossier du projet, sans `.env.local`, puis importer ce dépôt dans Vercel. Le preset est **Next.js** et le dossier racine est `cognalys-intelligence` si le dépôt contient le dossier parent.
2. Choisir Node.js 22 ou une version supérieure prise en charge. `vercel.json` définit `npm ci` et `npm run build`.
3. Ajouter les variables de `.env.example` dans les environnements concernés. Les secrets ne portent jamais le préfixe `NEXT_PUBLIC_`.
4. Pour une préproduction, laisser `SITE_INDEXABLE=false` et utiliser la protection d’accès de l’hébergeur si nécessaire. `noindex` n’est pas un contrôle d’accès.
5. Déployer, raccorder votre domaine HTTPS et renseigner l’URL exacte. Reconstruire après toute modification de variable publique.
6. Exécuter la recette réelle du formulaire. Compléter la checklist ci-dessous avant d’activer `SITE_INDEXABLE=true`.

Le site n’a pas été publié automatiquement et aucun compte externe n’a été créé pour vous.

## 5. Déployer sur un serveur Node.js

```bash
npm ci
# Configurer .env.local ou les variables du service.
npm run check
npm run build
npm start
```

Utiliser un gestionnaire de processus, un reverse proxy HTTPS et un port Node non exposé directement. Exemple de principe Nginx, à intégrer à votre configuration TLS :

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    # Remplacement, et non ajout à un en-tête envoyé par le visiteur :
    proxy_set_header X-Forwarded-For $remote_addr;
}
```

Avec ce proxy de confiance uniquement, définir `CONTACT_IP_SOURCE=x-forwarded-for`. Conserver Redis partagé. Définir HTTPS, les sauvegardes de configuration et la supervision dans l’infrastructure.

`output: standalone` est activé. Pour un déploiement minimal, copier `.next/standalone`, puis `public` dans ce dossier et `.next/static` dans `.next/standalone/.next/static`, et lancer son `server.js` avec les variables requises. La commande `npm start` reste la méthode la plus simple avec le projet complet.

## 6. Checklist avant ouverture publique

- [ ] Dénomination, forme juridique, adresse, SIREN, immatriculation et directeur de publication vérifiés.
- [ ] Capital et TVA précisés si applicables ; ne laisser aucun champ ambigu dans les mentions.
- [ ] Email, téléphone, hébergeur et coordonnées de l’hébergeur renseignés.
- [ ] Contact confidentialité, durées, sous-traitants et transferts confirmés ; les modèles légaux relus et adaptés.
- [ ] `legal.validated=true` seulement après cette validation.
- [ ] Domaine HTTPS et éventuel lien de réservation renseignés.
- [ ] Domaine d’envoi Resend vérifié, secrets privés et Redis configurés.
- [ ] Envoi de recette reçu dans la bonne boîte ; erreurs et réponses contrôlées.
- [ ] Formulaire, menu, liens et navigation revérifiés sur votre domaine.
- [ ] `npm run check`, `npm run build`, puis `npm run check:launch` exécutés.
- [ ] `SITE_INDEXABLE=true` une fois le site prêt, puis nouveau déploiement ; contrôler `robots.txt`, `sitemap.xml` et les métadonnées.

`check:launch` signale les données manquantes et retourne un code non nul. Ce contrôle de présence ne remplace pas la vérification du contenu officiel, du paramétrage des prestataires ou de la réception effective d’un email.

## 7. Architecture et tests

Next.js 16 / React 19 / TypeScript / Tailwind CSS 4, CSS dédié à l’identité, Zod pour la validation. Les pages de présentation sont pré-rendues ; seuls le menu mobile, le formulaire et la simulation nécessitent une logique client. Les FAQ utilisent des éléments HTML natifs. Pas de bibliothèque d’animation ni de tracker.

```text
src/app/                 Pages, SEO et routes API
src/components/          Composants de présentation et interactions
src/config/              Contenus et configuration publique
src/lib/                 Validation, sécurité, traitement et limiteur
public/                  Wordmark, favicon, ressources Open Graph
tests/                   Tests du formulaire, de la sécurité et du workflow
scripts/                 Lancement et vérification avant publication
docs/                    Recette et licences
```

Commandes : `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check:launch`. Le fichier `docs/VERIFICATION.md` précise les contrôles effectivement réalisés et leurs limites. Le logo fourni est conservé dans `public/logo-original.png` ; `wordmark.svg` le cadre sans redessiner ni recolorer ses pixels. Le favicon est un monogramme C dérivé, distinct du logo fourni.

Les animations respectent `prefers-reduced-motion`. Les contrôles disposent de libellés, d’un état de focus visible et d’une navigation clavier. L’optimisation repose sur le pré-rendu, la police locale, les SVG légers et l’absence de médias lourds. Aucun score Lighthouse ou Core Web Vitals de terrain n’est garanti.

## Références techniques et réglementaires

- [Installation et prérequis Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [API d’envoi Resend](https://resend.com/docs/api-reference/emails/send-email)
- [Idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [API REST Upstash](https://upstash.com/docs/redis/features/restapi)
- [En-têtes de requête Vercel](https://vercel.com/docs/headers/request-headers)
- [CNIL : exemples de mentions pour un formulaire](https://www.cnil.fr/fr/exemples-de-formulaire-de-collecte-de-donnees-caractere-personnel)
- [CNIL : informer les personnes](https://www.cnil.fr/fr/informer-les-personnes)

Les informations juridiques du site sont des modèles à adapter à la structure réelle et aux traitements effectivement mis en œuvre.
