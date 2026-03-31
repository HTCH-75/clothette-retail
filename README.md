# The Clothette Retail

Plateforme de gestion des stocks multi-marques pour The Clothette Retail.

## Structure du projet

```
clothette-retail/
├── index.html          # Point d'entrée
├── vercel.json         # Config déploiement Vercel
└── public/
    ├── style.css       # Styles globaux
    ├── data.js         # Données (marques, stocks, historique)
    └── app.js          # Logique applicative et routing
```

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@clothette.com | admin123 |
| Les Deux | lesdeux@clothette.com | lesdeux123 |
| NN07 | nn07@clothette.com | nn07123 |

## Déploiement sur Vercel

### Étape 1 — GitHub
1. Créez un compte sur [github.com](https://github.com)
2. Créez un nouveau repository (ex: `clothette-retail`)
3. Uploadez tous les fichiers de ce dossier

### Étape 2 — Vercel
1. Créez un compte sur [vercel.com](https://vercel.com)
2. Cliquez "Add New Project"
3. Connectez votre compte GitHub
4. Sélectionnez le repository `clothette-retail`
5. Cliquez "Deploy" — aucune configuration nécessaire

Votre site sera en ligne sur `clothette-retail.vercel.app` en moins de 2 minutes.

## Fonctionnalités

- **Authentification** par rôle (admin / marque)
- **Isolation des données** : chaque marque ne voit que ses stocks
- **Dashboard** : ventes, CA, sell-through, top références
- **Gestion des stocks** : vue temps réel par point de vente
- **Dépôt de fichiers** : ventes et réassort
- **Catalogue** : gestion des collections, résolution des références introuvables
- **Historique** : tous les imports tracés

## Prochaines étapes (après déploiement)

1. Connecter **Supabase** pour la base de données réelle
2. Activer l'**import automatique** des fichiers GL
3. Ajouter **NN07 GL Haussmann**
4. Système de **notifications** par email
