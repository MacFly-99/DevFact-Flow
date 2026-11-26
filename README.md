<h1 align="center">🚀 DevFact Flow 🧾</h1>

<p align="center">
  <strong>💼 Application SaaS de gestion de devis et de facturation pour freelances et petites entreprises.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Better_Auth-FF4F00?style=for-the-badge" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Statut-En%20production-success?style=flat-square" alt="Statut" />
  <img src="https://img.shields.io/badge/Tests-Vitest%20%2B%20Playwright-blueviolet?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/Licence-Propri%C3%A9taire-red?style=flat-square" alt="Licence" />
</p>

<p align="center">
  🌍 <a href="https://devfact-flow.vercel.app"><strong>Voir la démo en ligne</strong></a> ✨
</p>

---

✨ DevFact Flow couvre l'intégralité du cycle de vente : de la création du client jusqu'à l'envoi de la facture PDF par email. **Rapide ⚡, sécurisée 🔒 et intuitive 🎯.**

🐍 L'application s'appuie également sur un micro-service Python (**DevSpend-Flow**) pour gérer l'analyse des dépenses (hébergement, maintenance, noms de domaine) et calculer la rentabilité nette de chaque projet en temps réel 📈.

---

<a id="sommaire"></a>

## 📑 Sommaire

- [✨ Fonctionnalités](#fonctionnalites)
- [🏗️ Architecture micro-services](#architecture)
- [🛠️ Stack technique](#stack)
- [🚀 Installation en local](#installation)
- [🧪 Tests](#tests)
- [☁️ Déploiement](#deploiement)
- [👨‍💻 Auteur](#auteur)
- [📝 Licence](#licence)

---

<a id="fonctionnalites"></a>

## ✨ Fonctionnalités

### 👤 Utilisateurs & multi-tenancy

- 🔐 **Authentification sécurisée** : inscription et connexion via Better Auth (mots de passe hashés, sessions).
- 🧱 **Isolation des données** : chaque utilisateur dispose de son propre espace de travail, strictement cloisonné.
- 👑 **Rôles (RBAC)** : distinction entre utilisateurs standards et Super Admins (accès à un panneau d'administration global).
- ⚙️ **Profil & paramètres** : informations personnelles, mot de passe et informations de l'entreprise (SIRET, TVA, adresse).

### 🤝 Gestion des clients

- 📋 **CRUD complet** : création, modification et suppression.
- 🛑 **Sécurité métier** : impossible de supprimer un client ayant des devis acceptés ou des factures payées, afin de conserver l'historique comptable.
- 🔍 **Modale de détails** avec statistiques (nombre de devis, nombre de factures).

### 📄 Devis & factures

- 🔄 **Cycle de vie complet** : création de devis avec lignes dynamiques et calcul de la TVA (HT/TTC) en temps réel.
- ⚡ **Conversion en un clic** : un devis accepté devient une facture (relation 1-à-1 stricte).
- 🔒 **Verrouillage des statuts** : un devis `ACCEPTED` ou une facture `PAID` ne peut plus être modifié ni supprimé.
- 🖨️ **Génération PDF double** : export d'une version **Client** (sans les marges) ou d'une version **Interne** (avec le détail des dépenses et la rentabilité nette).
- 📧 **Envoi par email** : envoi direct du PDF au client via l'API Resend.

### 💸 Suivi des dépenses (intégration DevSpend-Flow)

- 🗂️ **Dépenses par projet** : ajout de coûts (serveurs, noms de domaine) directement depuis la page du devis.
- 📈 **Rentabilité en temps réel** : affichage de la marge et du bénéfice net estimé sur le devis.
- 🔐 **Verrouillage métier** : impossible d'ajouter ou de modifier une dépense une fois le devis accepté.
- 🏷️ **Traçabilité** : identification claire du client associé à chaque dépense sur le dashboard global.

### 📊 Dashboard & analytics

- 🎯 **KPI dynamiques** : chiffre d'affaires, clients, devis, factures.
- 💰 **Évolution du chiffre d'affaires** sur les 6 derniers mois (Recharts).
- 📉 **Évolution des dépenses** et répartition par catégorie.
- 🟢🟡🔴 **Derniers devis** avec badges de statut colorés.

### 🛡️ Sécurité & performance

- ✅ **Validation stricte** : toutes les entrées utilisateur sont validées côté serveur avec Zod.
- 🚧 **CSRF & rate limiting** : protection contre les attaques par force brute, gérée nativement par Better Auth.
- 🧰 **Security headers** : Content Security Policy (CSP) et headers HTTP configurés de façon stricte.
- 🏎️ **Optimisations** : cache Next.js (`unstable_cache`), sélection partielle des données Prisma (`select`) et compilation via Turbopack.

<p align="right"><a href="#sommaire">⬆️ Retour au sommaire</a></p>

---

<a id="architecture"></a>

## 🏗️ Architecture micro-services

Ce projet repose sur une architecture distribuée pour séparer les responsabilités :

| Service | Rôle |
| --- | --- |
| ⚛️ **DevFact-Flow** (Next.js) | Frontend, authentification, base de données (Prisma / PostgreSQL) et génération des documents. |
| 🐍 **[DevSpend-Flow](https://github.com/MacFly-99/DevSpend-Flow)** (Python / FastAPI) | Micro-service indépendant : CRUD des dépenses et calculs analytiques. |

🔗 **Communication** : les deux services échangent par requêtes REST, authentifiées par une clé API (`X-API-Key`).

<p align="right"><a href="#sommaire">⬆️ Retour au sommaire</a></p>

---

<a id="stack"></a>

## 🛠️ Stack technique

| Domaine | Technologie |
| --- | --- |
| 🖥️ Framework frontend | Next.js 16 (App Router, Server Actions, Turbopack) |
| 🔷 Langage | TypeScript |
| 🗄️ Base de données | PostgreSQL (Neon en production) |
| 🔌 ORM | Prisma 7 |
| 🔐 Authentification | Better Auth |
| 🐍 Micro-service data | Python 3.14, FastAPI, SQLAlchemy |
| 🎨 UI/UX | Tailwind CSS v4, shadcn/ui (Base UI), Lucide Icons |
| 📊 Graphiques | Recharts |
| 📧 Emails | Resend |
| 📄 Génération PDF | @react-pdf/renderer |
| ✅ Validation | Zod |
| 🧪 Tests | Vitest (unitaires / intégration), Playwright (E2E) |

<p align="right"><a href="#sommaire">⬆️ Retour au sommaire</a></p>

---

<a id="installation"></a>

## 🚀 Installation en local

### 📦 Prérequis

- 🟢 Node.js v20 ou supérieur
- 📥 [pnpm](https://pnpm.io/) (npm ou yarn fonctionnent aussi)
- 🐘 Une base PostgreSQL locale ou distante
- 🐍 Le micro-service **DevSpend-Flow** (lancé en local ou via Docker) pour les fonctionnalités de dépenses

### 🪜 Étapes

**1️⃣ Cloner le dépôt**

```bash
git clone https://github.com/MacFly-99/DevFact-Flow
cd DevFact-Flow
```

**2️⃣ Installer les dépendances**

```bash
pnpm install
```

**3️⃣ Configurer les variables d'environnement**

Crée un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/devfact-flow"

# Authentification (Better Auth)
BETTER_AUTH_SECRET="un_secret_long_et_aleatoire"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Emails (Resend)
RESEND_API_KEY="re_votre_cle_api_resend"

# Connexion au micro-service Python (DevSpend-Flow)
DEVSPEND_API_URL="http://127.0.0.1:8000/api/v1"
DEVSPEND_API_KEY="votre_cle_api_python_secrete"

# Compte Super Admin (utilisé par le script de seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="un_mot_de_passe_solide"
ADMIN_NAME="Super Admin"
```

**4️⃣ Initialiser la base de données**

```bash
pnpm exec prisma db push
pnpm exec prisma generate
```

**5️⃣ Créer le compte Super Admin**

```bash
pnpm exec prisma db seed
```

**6️⃣ Lancer le serveur de développement**

```bash
pnpm dev
```

🎉 L'application est accessible sur [http://localhost:3000](http://localhost:3000).

> [!TIP]
> 💡 N'oublie pas de lancer **DevSpend-Flow** en parallèle pour voir les widgets de dépenses.

<p align="right"><a href="#sommaire">⬆️ Retour au sommaire</a></p>

---

<a id="tests"></a>

## 🧪 Tests

Le projet dispose d'une suite de tests qui couvre la logique métier, les Server Actions, les composants et le parcours utilisateur complet.

### ⚡ Tests unitaires & d'intégration (Vitest)

Ils vérifient la logique métier (calculs de TVA, validation Zod) et les Server Actions, sans toucher à la base de données réelle.

```bash
pnpm test:run
```

📋 Résultat attendu :

```text
✓ tests/unit/calculations.test.ts (3 tests)
✓ tests/actions/quotes.test.ts (2 tests)
✓ tests/actions/clients.test.ts (3 tests)
✓ tests/components/quote-form.test.tsx (2 tests)
✓ tests/components/client-modal.test.tsx (2 tests)

Test Files  5 passed (5)
     Tests  12 passed (12)
  Duration  2.88s
```

### 🎭 Tests end-to-end (Playwright)

Ils simulent un utilisateur réel dans un navigateur : connexion, création de client, création de devis, acceptation, conversion en facture.

```bash
pnpm test:e2e
```

📋 Résultat attendu :

```text
Running 2 tests using 2 workers
  1) [chromium] › tests/e2e/login.spec.ts
  2) [chromium] › tests/e2e/business-flow.spec.ts

  2 passed (13.9s)
```

> [!WARNING]
> ⚠️ Ne lance pas le serveur de dev avant : Playwright s'en occupe.

<p align="right"><a href="#sommaire">⬆️ Retour au sommaire</a></p>

---

<a id="deploiement"></a>

## ☁️ Déploiement

L'application est optimisée pour **▲ Vercel**, avec une base PostgreSQL hébergée sur **🐘 Neon**.

1. 🔗 Connecte ton dépôt GitHub à Vercel.
2. 🔑 Ajoute toutes les variables d'environnement de ton `.env` dans les paramètres du projet Vercel.
3. 🏗️ Le script de build (`prisma generate && prisma db push && next build`) prépare automatiquement la base distante.

<p align="right"><a href="#sommaire">⬆️ Retour au sommaire</a></p>

---

<a id="auteur"></a>

## 👨‍💻 Auteur

**MacFly-99** — [@MacFly-99](https://github.com/MacFly-99) 🦅

---

<a id="licence"></a>

## 📝 Licence

🔒 Projet propriétaire. Usage interne uniquement.