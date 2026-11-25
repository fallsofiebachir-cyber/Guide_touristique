# Teranga Guides — Gestion des guides touristiques

Application front-end pédagogique réalisée avec Angular standalone pour gérer un répertoire fictif de guides touristiques au Sénégal. Les données sont inventées et ne doivent pas être remplacées par des données personnelles réelles.

## Prérequis

- Node.js 22.12 ou ultérieur (version LTS compatible avec Angular 22)
- npm 10 ou ultérieur
- Un navigateur récent

## Installation et lancement

```bash
npm install
npm start
```

Ouvrir ensuite [http://localhost:4200](http://localhost:4200). Le serveur recharge l’application après les changements de code. Pour arrêter le serveur, utiliser `Ctrl+C` dans le terminal.

## Vérification de compilation

```bash
npm run build
```

Les fichiers optimisés sont générés dans `dist/`. Le build de production est lancé automatiquement par la configuration Angular.

## Fonctionnalités

- Liste responsive de six guides fictifs couvrant plusieurs régions du Sénégal.
- Recherche par prénom, nom ou spécialité, avec état vide explicite.
- Filtres combinables par région et statut (Actif / Inactif).
- Notes formatées et indicateurs de statut.
- Ajout et modification via un formulaire réactif : champs obligatoires, longueur minimale et maximale, validation d’e-mail, format de téléphone sénégalais et note comprise entre 0 et 5.
- Suppression avec demande de confirmation et notifications de succès.
- Sauvegarde de démonstration dans le `localStorage` du navigateur, avec possibilité de réinitialiser les données.
- Navigation entre le répertoire et la page « À propos ».

## Architecture principale

```text
src/app/
├── app.ts, app.html, app.css       # composant racine et navigation
├── app.routes.ts                   # configuration du routage
├── models/guide-touristique.ts     # type GuideTouristique et StatutGuide
├── services/guide-touristique.service.ts # jeu initial et opérations CRUD
├── components/
│   ├── guide-list/                 # tableau, note et actions de fiche
│   └── guide-form/                 # formulaire réactif et validations
└── pages/
    ├── guides-page.*               # recherche, filtres et orchestration CRUD
    └── about-page.*                # limites et évolution proposée
```

## Explication des fichiers Angular principaux

- `src/main.ts` démarre l’application Angular.
- `src/app/app.ts` est le composant racine; son template contient la navigation et le `router-outlet`.
- `src/app/app.routes.ts` associe les URL aux écrans.
- `src/app/models/guide-touristique.ts` définit le contrat TypeScript d’une fiche.
- `src/app/services/guide-touristique.service.ts` centralise les données et les opérations CRUD.
- `src/app/components/` contient les composants réutilisables de liste et de formulaire.
- `angular.json` configure les commandes CLI et la compilation.
- `package.json` décrit les dépendances et commandes npm.

## Limites et évolution possible

1. Les données sont conservées uniquement dans le navigateur courant : elles ne sont pas partagées entre utilisateurs et peuvent disparaître si les données du navigateur sont effacées.
2. Le `localStorage` et les validations côté client ne sont pas des mécanismes de sécurité. Le prototype ne convient pas pour stocker de vraies coordonnées personnelles ni pour gérer des comptes d’agents.

Pour une version multi-utilisateur, remplacer le stockage local du service par `HttpClient` et une API REST, par exemple `GET /api/guides`, `POST /api/guides`, `PUT /api/guides/:id` et `DELETE /api/guides/:id`. L’API devra appliquer côté serveur les validations, l’authentification et les autorisations, persister les données dans une base et renvoyer des erreurs gérées par l’interface.

## Démonstration rapide

1. Lancer l’application et présenter les fiches de démonstration.
2. Rechercher une spécialité et appliquer les filtres région/statut.
3. Ajouter une fiche avec une adresse e-mail ou un téléphone invalide pour montrer les validations, puis corriger et enregistrer.
4. Modifier une fiche et démontrer la confirmation de suppression.
5. Présenter « À propos » pour expliquer les limites et la piste API REST.

## Ressources

- [Documentation Angular](https://angular.dev/)
- [Angular CLI](https://angular.dev/tools/cli)
- [Formulaires réactifs](https://angular.dev/guide/forms/reactive-forms)
- [Routage Angular](https://angular.dev/guide/routing)
