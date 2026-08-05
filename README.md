# Ma Bibliothèque — déploiement Netlify

Ce dossier contient tout ce qu'il faut : la page (`index.html`) et une petite
fonction serverless (`netlify/functions/library.js`) qui sauvegarde tes livres
dans **Netlify Blobs** (stockage clé-valeur inclus gratuitement avec Netlify).
Comme les données vivent côté serveur, elles sont accessibles depuis
n'importe quel appareil qui ouvre le site.

⚠️ Important : le **glisser-déposer** d'un simple dossier sur netlify.com ne
déploie pas la fonction. Il faut utiliser la CLI Netlify (ou connecter un
dépôt Git), comme ci-dessous.

## Déploiement (première fois)

```bash
# 1. Installer la CLI Netlify si tu ne l'as pas déjà
npm install -g netlify-cli

# 2. Depuis ce dossier, installer la dépendance @netlify/blobs
npm install

# 3. Se connecter à ton compte Netlify
netlify login

# 4. Créer/lier un site Netlify
netlify init
# (choisis "Create & configure a new site" si tu n'en as pas déjà un)

# 5. Déployer en production
netlify deploy --prod
```

Netlify Blobs fonctionne automatiquement dès que le site est déployé,
aucune configuration supplémentaire n'est nécessaire.

## Mettre à jour le site plus tard

```bash
netlify deploy --prod
```

## Tester en local avant de déployer

```bash
netlify dev
```
Puis ouvre l'URL affichée (en général `http://localhost:8888`) — la fonction
et le stockage Blobs sont simulés localement.

## (Recommandé) Protéger tes données

Sans protection, **toute personne qui trouve l'URL de ton site peut voir et
modifier ta liste de livres** (il n'y a pas de compte utilisateur). Pour une
appli perso c'est en général suffisant si l'URL reste privée, mais si tu veux
un minimum de sécurité :

1. Dans le dashboard Netlify : *Site configuration → Environment variables*,
   ajoute une variable `LIBRARY_API_KEY` avec une valeur secrète de ton choix
   (ex. une longue chaîne aléatoire).
2. Ouvre `index.html`, trouve la ligne :
   ```js
   var API_KEY = "";
   ```
   et mets-y la même valeur secrète.
3. Redéploie (`netlify deploy --prod`).

Sans clé configurée, l'API reste ouverte (comportement par défaut).

## Structure du projet

```
index.html                     → l'application (front-end)
netlify/functions/library.js   → l'API qui lit/écrit dans Netlify Blobs
netlify.toml                   → configuration Netlify
package.json                   → dépendance @netlify/blobs
```
