# License Sale - E-commerce de Licences Numériques 🔑

Site e-commerce français pour la vente de licences logicielles authentiques (Windows, Office, Antivirus, VPN, etc.).

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Backend](#api-backend)
- [Déploiement](#déploiement)
- [Documentation](#documentation)
- [Contribuer](#contribuer)

## 🎯 Aperçu

License Sale est une plateforme e-commerce complète permettant l'achat de licences logicielles avec:
- ✅ Catalogue de produits avec filtres avancés
- ✅ Panier d'achat persistant (session cookies)
- ✅ Système d'authentification JWT
- ✅ Espace client avec historique des commandes
- ✅ Interface admin pour la gestion (CRUD produits/catégories)
- ✅ Paiements et livraison instantanée par email
- ✅ Design responsive et moderne

## ✨ Fonctionnalités

### Client
- 🔍 **Recherche et filtrage** - Recherche par nom, catégorie, prix, tags
- 🛒 **Panier intelligent** - Gestion du stock en temps réel, persistance session
- 🔐 **Authentification sécurisée** - JWT avec refresh tokens
- 📦 **Suivi des commandes** - Historique complet, statuts en temps réel
- 💳 **Checkout simplifié** - Formulaire de commande optimisé
- 📱 **100% Responsive** - Mobile-first design

### Admin
- 👥 **Gestion des rôles** - SUPER_ADMIN, ADMIN, CLIENT
- 📊 **Dashboard** - Vue d'ensemble des ventes et commandes
- 🏷️ **CRUD Produits** - Gestion complète du catalogue
- 📂 **CRUD Catégories** - Organisation hiérarchique
- 📋 **Gestion des commandes** - Suivi et modification des statuts
- 🔄 **Soft delete** - Restauration possible des éléments supprimés

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.0.3 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API + localStorage

### Backend API
- **Base URL**: `https://licences-api.onrender.com/api`
- **Authentification**: JWT (Bearer tokens)
- **Documentation**: Swagger UI disponible
- **Database**: PostgreSQL (via Prisma)

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/AffouSiata/Projet_e-commerce_Samassy.git
   cd Projet_e-commerce_Samassy
   ```

2. **Installer les dépendances**
   ```bash
   cd frontend
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuration

### Variables d'environnement (optionnel)

Créez un fichier `.env.local` dans `/frontend` pour personnaliser:

```env
# API Base URL (par défaut: https://licences-api.onrender.com/api)
NEXT_PUBLIC_API_URL=https://licences-api.onrender.com/api

# Autres configs...
```

### Commandes disponibles

```bash
# Développement
npm run dev          # Lance le serveur de dev (port 3000)

# Production
npm run build        # Compile l'application
npm start            # Lance le serveur de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
```

## 📁 Structure du projet

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Layout racine avec providers
│   ├── page.tsx              # Page d'accueil
│   ├── connexion/            # Page de connexion
│   ├── inscription/          # Page d'inscription
│   ├── boutique/             # Catalogue produits
│   ├── categorie/[slug]/     # Pages catégories dynamiques
│   ├── produit/[id]/         # Pages produits dynamiques
│   ├── panier/               # Page panier
│   ├── commande/             # Checkout et confirmation
│   └── compte/               # Espace client/admin
├── components/               # Composants réutilisables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CartModal.tsx
│   ├── ApiWakeUp.tsx         # Wake-up automatique de l'API
│   └── ...
├── context/                  # React Contexts
│   ├── AuthContext.tsx       # Gestion authentification
│   └── CartContext.tsx       # Gestion panier
├── lib/                      # Utilitaires et services
│   ├── api.ts                # Client API Axios
│   ├── cache.ts              # Cache en mémoire
│   ├── productService.ts     # Service produits avec cache
│   └── transforms.ts         # Transformations de données
├── types/                    # Types TypeScript
│   └── api.ts                # Types API
└── public/                   # Assets statiques
    ├── logo.jpeg
    └── products/             # Images produits
```

## 🌐 API Backend

### Endpoints principaux

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/auth/login` | POST | Connexion | Public |
| `/auth/register` | POST | Inscription | Public |
| `/products` | GET | Liste produits | Public |
| `/products/:id` | GET | Détail produit | Public |
| `/categories` | GET | Liste catégories | Public |
| `/cart` | GET | Récupérer panier | Session |
| `/cart/items` | POST | Ajouter au panier | Session |
| `/orders` | POST | Créer commande | JWT |
| `/orders` | GET | Liste commandes | JWT Admin |

### Documentation complète

- 📖 [API Documentation](API_DOCUMENTATION%20copy.md) - Documentation détaillée de l'API
- 🔗 [Swagger UI](https://licences-api.onrender.com/api/docs) - Documentation interactive

## 🔐 Authentification Admin

### Credentials par défaut

```
Email: superadmin@admin.com
Mot de passe: admin123!
Role: SUPER_ADMIN
```

⚠️ **IMPORTANT**: Changez ce mot de passe en production !

### Guides disponibles

- 📘 [ADMIN_LOGIN_GUIDE.md](ADMIN_LOGIN_GUIDE.md) - Guide de connexion admin
- 🚀 [COLD_START_SOLUTION.md](COLD_START_SOLUTION.md) - Solutions au problème de cold start Render

## 🐌 Cold Start (Render.com)

L'API backend est hébergée sur Render (plan gratuit) et peut être en veille. La première connexion après inactivité peut prendre **30-60 secondes**.

### Solutions implémentées
- ✅ Timeout API de 90 secondes
- ✅ Messages d'information progressifs
- ✅ Wake-up automatique de l'API (composant `ApiWakeUp`)

### Solutions permanentes
- 🔄 Service de ping externe (UptimeRobot, Cron-job)
- 💰 Upgrade Render Starter (7$/mois)
- 🚀 Migration vers Railway.app ou Fly.io

Voir [COLD_START_SOLUTION.md](COLD_START_SOLUTION.md) pour plus de détails.

## 🚢 Déploiement

### Option 1: Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd frontend
vercel
```

### Option 2: Build manuel

```bash
cd frontend
npm run build
npm start
```

Le serveur démarre sur le port 3000.

## 📚 Documentation additionnelle

- [CLAUDE.md](CLAUDE.md) - Guide pour Claude Code (architecture détaillée)
- [ADMIN_LOGIN_GUIDE.md](ADMIN_LOGIN_GUIDE.md) - Connexion admin
- [COLD_START_SOLUTION.md](COLD_START_SOLUTION.md) - Problème cold start
- [API_DOCUMENTATION copy.md](API_DOCUMENTATION%20copy.md) - API complète

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Affou Siata** - [@AffouSiata](https://github.com/AffouSiata)
- Assisté par **Claude Code** (Anthropic)

## 🙏 Remerciements

- Next.js et l'équipe Vercel
- Tailwind CSS
- Lucide Icons
- La communauté open source

---

**🌟 Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !**

*Développé avec ❤️ pour la vente de licences numériques*
