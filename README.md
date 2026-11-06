# 🚀 DevFact Flow

**Application SaaS de gestion de devis et de facturation pour freelances et petites entreprises.**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Better_Auth-FF4F00?style=for-the-badge" alt="Better Auth" />
</p>

DevFact Flow couvre l'intégralité du cycle de vente : de la création du client jusqu'à l'envoi de la facture PDF par email. Rapide, sécurisée et intuitive.

🌍 **[Voir la démo en ligne](https://devfact-flow.vercel.app)**

---

## 📑 Sommaire

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#️-stack-technique)
- [Installation en local](#-installation-en-local)
- [Tests](#-tests)
- [Déploiement](#️-déploiement)
- [Auteur](#-auteur)
- [Licence](#-licence)

---

## ✨ Fonctionnalités

### 👤 Utilisateurs & multi-tenancy

- **Authentification sécurisée** : inscription et connexion via Better Auth (mots de passe hashés, sessions).
- **Isolation des données** : chaque utilisateur dispose de son propre espace de travail, strictement cloisonné.
- **Rôles (RBAC)** : distinction entre utilisateurs standards et Super Admins (accès à un panneau d'administration global).
- **Profil & paramètres** : informations personnelles, mot de passe et informations de l'entreprise (SIRET, TVA, adresse).

### 🤝 Gestion des clients

- CRUD complet : création, modification et suppression.
- **Sécurité métier** : impossible de supprimer un client ayant des devis acceptés ou des factures payées, afin de conserver l'historique comptable.
- Modale de détails avec statistiques (nombre de devis, nombre de factures).

### 📄 Devis & factures

- **Cycle de vie complet** : création de devis avec lignes dynamiques et calcul de la TVA (HT/TTC) en temps réel.
- **Conversion en un clic** : un devis accepté devient une facture (relation 1-à-1 stricte).
- **Verrouillage des statuts** : un devis `ACCEPTED` ou une facture `PAID` ne peut plus être modifié ni supprimé.
- **Génération PDF** : export de devis et factures conformes, avec les informations de l'émetteur et du client.
- **Envoi par email** : envoi direct du PDF au client via l'API Resend.

### 📊 Dashboard & analytics

- KPI dynamiques : chiffre d'affaires, clients, devis, factures.
- Graphique d'évolution du chiffre d'affaires sur les 6 derniers mois (Recharts).
- Liste des derniers devis avec badges de statut colorés.

### 🛡️ Sécurité & performance

- **Validation stricte** : toutes les entrées utilisateur sont validées côté serveur avec Zod.
- **CSRF & rate limiting** : protection contre les attaques par force brute, gérée nativement par Better Auth.
- **Security headers** : Content Security Policy (CSP) et headers HTTP configurés de façon stricte.
- **Optimisations** : cache Next.js (`unstable_cache`), sélection partielle des données Prisma (`select`) et compilation via Turbopack.

---

## 🛠️ Stack technique

| Domaine | Technologie |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions, Turbopack) |
| Langage | TypeScript |
| Base de données | PostgreSQL (Neon en production) |
| ORM | Prisma 7 |
| Authentification | Better Auth |
| UI/UX | Tailwind CSS v4, shadcn/ui (Base UI), Lucide Icons |
| Graphiques | Recharts |
| Emails | Resend |
| Génération PDF | @react-pdf/renderer |
| Validation | Zod |
| Tests | Vitest (unitaires/intégration), Playwright (E2E) |

---

## 🚀 Installation en local

### Prérequis

- Node.js v20 ou supérieur
- [pnpm](https://pnpm.io/) (npm ou yarn fonctionnent aussi)
- Une base PostgreSQL locale ou distante

### Étapes

**1. Cloner le dépôt**

```bash
git clone https://github.com/MacFly-99/DevFact-Flow
cd DevFact-Flow
```

**2. Installer les dépendances**

```bash
pnpm install
```

**3. Configurer les variables d'environnement**

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

# Compte Super Admin (utilisé par le script de seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="un_mot_de_passe_solide"
ADMIN_NAME="Super Admin"
```

**4. Initialiser la base de données**

```bash
pnpm exec prisma db push
pnpm exec prisma generate
```

**5. Créer le compte Super Admin**

```bash
pnpm exec prisma db seed
```

**6. Lancer le serveur de développement**

```bash
pnpm dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🧪 Tests

Le projet dispose d'une suite de tests qui couvre la logique métier, les Server Actions, les composants et le parcours utilisateur complet.

### Tests unitaires & d'intégration (Vitest)

Ils vérifient la logique métier (calculs de TVA, validation Zod) et les Server Actions, sans toucher à la base de données réelle.

```bash
pnpm test:run
```

Résultat attendu :

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

### Tests end-to-end (Playwright)

Ils simulent un utilisateur réel dans un navigateur : connexion, création de client, création de devis, acceptation, conversion en facture.

```bash
pnpm test:e2e
```

Résultat attendu :

```text
Running 2 tests using 2 workers
  1) [chromium] > tests/e2e/login.spec.ts
  2) [chromium] > tests/e2e/business-flow.spec.ts

  2 passed (13.9s)
```

> **Note :** ne pas lancer le serveur de dev avant, Playwright s'en occupe.

---

## ☁️ Déploiement

L'application est optimisée pour Vercel avec une base PostgreSQL hébergée sur Neon.

1. Connecte ton dépôt GitHub à Vercel.
2. Ajoute toutes les variables d'environnement de ton `.env` dans les paramètres du projet Vercel.
3. Le script de build (`prisma generate && prisma db push && next build`) prépare automatiquement la base distante.

---

## 👨‍💻 Auteur

**MacFly-99** : [@MacFly-99](https://github.com/MacFly-99)

---

## 📝 Licence

Projet propriétaire. Usage interne uniquement.