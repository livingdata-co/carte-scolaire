# carte-scolaire

Outil de recherche du collège de rattachement d’une adresse donnée.

## Pré-requis

- Node.js 18+
- yarn
- tippecanoe (pour la génération des tuiles vectorielles, optionnel)

## Utilisation

```bash
# Installation des dépendances
yarn

# Téléchargement des données pré-générées
yarn download-prepared-data

# Démarrage du service en mode développement
yarn dev
```

## Production des données

```bash
# Téléchargement des données sources (lent)
yarn download-sources

# Production du fichier des collèges
yarn build-colleges

# Production du fichier de la carte scolaire géolocalisée (~1 heure)
yarn build-data

# Création de l’index spatial
yarn build-index

# Génération des tuiles vectorielles
yarn build-tiles
```
