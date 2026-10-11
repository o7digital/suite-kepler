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
- `src/components/` : tag GA4 `G-BQ28GN72RB` et comportement du menu/sélecteur de langue.
- `src/styles/` : styles d'origine, conservés pour préserver le design.
- `public/assets/` : photos WebP, avec deux tailles pour l'image d'accueil.

Lors des modifications de contenu, maintenir les versions ES et EN à jour.

## Validation et déploiement

```sh
npm run build
npx playwright install chromium
npm test
npm run preview
```

Les tests utilisent le site compilé dans `dist/` pour vérifier les quatre routes, les images, les métadonnées, GA4 et la navigation mobile/ordinateur.

Le projet est lié à Vercel. `vercel.json` configure explicitement Astro et le répertoire `dist/`.

```sh
vercel --prod --yes
```
