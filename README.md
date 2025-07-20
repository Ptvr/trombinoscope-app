# Trombinoscope Mobile App

Application mobile de trombinoscope développée en JavaScript avec React Native, dans le cadre d’un projet pour un client fictif.  
Elle permet de visualiser les membres d'une entreprise fictive via une API connectée à une base de données Firebase.

---

## Objectif du projet

- Répondre aux besoins d'un client fictif avec des demandes spécifiques.
- Développer une application modulaire en React Native.
- Gérer les données utilisateurs via une API.
- Utiliser Firebase comme backend pour la base de données.

---

## Fonctionnalités

-  Affichage des membres de l’entreprise sous forme de trombinoscope
-  Récupération dynamique des données via API
-  Widgets personnalisables (ex : météo, heure, etc.)

---

## Architecture

- `App.js` : point d’entrée principal de l'application
- `screens/` : contient les différentes pages (chacune avec son propre dossier et composants)
- `Home/` : contient les **widgets** (WeatherComponent, TimeComponent…)
- Chaque widget a son propre fichier `.js` et peut être ajouté facilement au fichier `Home.js`

---
##  Technologies et librairies

- **React Native**
- **Firebase** : base de données temps réel
- **API Masurao**
- Librairies React Native standards pour l’UI et la navigation
