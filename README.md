# Business Suites Kepler

Site vitrine statique de Business Suites Kepler, avec versions espagnole et anglaise et photos de la propriété.

## Aperçu local

Depuis la racine du dépôt :

```sh
python3 -m http.server 8080
```

Ouvrir ensuite [http://localhost:8080/](http://localhost:8080/).

Le site ne nécessite ni installation de dépendances ni étape de compilation. Les boutons de réservation redirigent vers le moteur officiel Cloudbeds, qui reste la seule source des tarifs et disponibilités.

## Langues

- Espagnol : `/` (`index.html`).
- Anglais : `/en/` (`en/index.html`).

Le sélecteur ES / EN conserve la section consultée. Les deux pages partagent les photos du dossier `assets`; les boutons de réservation utilisent la langue correspondante. Lors des modifications, maintenir les deux versions HTML à jour.
