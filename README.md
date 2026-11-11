# Business Suites Kepler

Site vitrine statique construit avec Astro, en espagnol et anglais. Toutes les photos publiées sont en WebP. Les réservations passent par le moteur officiel Cloudbeds.

## Développement

Utiliser Node.js 24 et travailler sur la branche `dev`.

```sh
npm ci
npm run dev
```

Ouvrir http://localhost:4321/.

## Structure

- `src/pages/` : accueil ES `/`, accueil EN `/en/` et avis de confidentialité dans les deux langues.
- `src/layouts/SiteLayout.astro` : document commun, styles, Google Analytics et script de navigation.
- `src/components/` : métadonnées SEO, en-tête/pied de page communs, tag GA4 `G-BQ28GN72RB` et navigation.
- `src/data/` : coordonnées de l’hôtel, caractéristiques et traductions des hébergements. Les coordonnées géographiques proviennent du moteur Cloudbeds officiel.
- `src/styles/` : styles d'origine, conservés pour préserver le design.
- `public/assets/` : photos WebP, avec deux tailles pour l'image d'accueil.

Lors des modifications de contenu, maintenir les versions ES et EN à jour.

## Validation et déploiement

```sh
npm run check
npm run build
npx playwright install firefox
npm test
npm run preview
```

Les tests utilisent le site compilé dans `dist/` pour vérifier les dix pages, les liens internes, les images, les données structurées, les métadonnées bilingues, GA4, le sitemap et la navigation de 320 à 1440 pixels.

Le projet est lié à Vercel. `vercel.json` configure explicitement Astro et le répertoire `dist/`.

```sh
vercel --prod --yes
```

## Pages d’hébergement et SEO

| Hébergement | Espagnol | Anglais |
| --- | --- | --- |
| Grand Suite | `/habitaciones/grand-suite/` | `/en/rooms/grand-suite/` |
| King | `/habitaciones/king/` | `/en/rooms/king/` |
| Queen | `/habitaciones/queen/` | `/en/rooms/queen/` |

Les cartes de l’accueil et les pages d’hébergement proposent des liens internes et conservent les boutons de réservation Cloudbeds. Les textes décrivent les caractéristiques déjà présentes sur le site ; les prix et disponibilités restent dans le moteur de réservation.

`src/pages/sitemap.xml.ts` génère `/sitemap.xml` depuis les mêmes données de routes bilingues que les pages. Chaque URL possède ses alternates ES/EN et `x-default`. `public/robots.txt` déclare ce sitemap. Soumettre `https://www.businesssuiteskepler.com/sitemap.xml` dans Google Search Console après le déploiement.

Les données structurées `Hotel` reprennent l’adresse, le téléphone, l’email, les coordonnées géographiques, les 13 hébergements et les services affichés. Les pages individuelles ajoutent `HotelRoom` et `BreadcrumbList`. Source des coordonnées : [moteur de réservation officiel Cloudbeds](https://hotels.cloudbeds.com/reservation/lSYkcf), vérifié le 10 octobre 2026.

## Chinese version

Simplified Chinese pages live under `/zh/`: home, location, privacy notice and all three room pages. Shared UI strings are in `src/data/i18n.ts`; room translations are in `src/data/rooms.zh.ts`. Every page links to its ES/EN/中文 equivalents, with `zh-Hans` alternates in HTML and sitemap. Chinese booking links open the existing English Cloudbeds flow. Olivia accepts `zh` and replies in Simplified Chinese via the dedicated Kepler VPS gateway.

## Agenda mensuel

La section `#eventos` figure entre les services et l’emplacement sur les trois accueils. Les événements approuvés de novembre 2026 à février 2027 sont dans `src/data/events.json`, avec leurs textes ES/EN/中文, sources officielles et images WebP locales sous `public/assets/events/`.

`EventsAgenda.astro` conserve une version statique de secours et charge l’agenda validé du CRM depuis `/api/events-calendar`. Le flux est propre à Kepler, sans identifiants privés, et sélectionne le mois sur le serveur à l’heure de Mexico (`America/Mexico_City`). Il est relu au chargement, toutes les minutes et au retour dans l’onglet. Les visuels du flux sont servis en WebP.

Pour préparer un nouveau mois, ouvrir le CRM `/admin/mail`, créer le mois, choisir **Business Suites Kepler**, compléter les textes ES/EN/中文 puis **Valider et programmer ce mois**. Le site affichera ce mois à minuit le premier jour, sans modification du dépôt ni redéploiement. Un brouillon reste privé ; un mois sans programme validé affiche un message d’attente. Les modifications d’un programme déjà validé restent privées jusqu’à leur validation suivante. En cas de panne temporaire, seule la version encore courante est conservée.

Les tests Firefox couvrent aussi l’ordre du menu, les ancres des trois langues, la chronologie, les formats mobiles et le changement de mois. `PLAYWRIGHT_FIREFOX_EXECUTABLE_PATH` permet d’utiliser un Firefox Playwright déjà installé.
