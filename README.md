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
npx playwright install chromium
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
