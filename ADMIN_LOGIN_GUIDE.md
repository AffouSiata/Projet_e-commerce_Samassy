# Guide de Connexion Admin

## Connexion avec le compte SUPER_ADMIN par défaut

Un compte SUPER_ADMIN a été créé automatiquement dans la base de données avec les credentials suivants:

```
Email: superadmin@admin.com
Mot de passe: admin123!
```

### Étapes pour se connecter:

1. Lancez votre serveur de développement:
   ```bash
   cd frontend
   npm run dev
   ```

2. Ouvrez votre navigateur et allez sur: `http://localhost:3000/connexion`

3. Entrez les identifiants:
   - **Email**: `superadmin@admin.com`
   - **Mot de passe**: `admin123!`

4. Cliquez sur "Se connecter"

### ⚠️ Avertissement sur le Cold Start

L'API est hébergée sur Render (plan gratuit) et peut être en sommeil. La première connexion après une période d'inactivité peut prendre **30-60 secondes**.

Vous verrez:
- Un spinner de chargement "Connexion en cours..."
- Après 5 secondes: un message bleu "Le serveur met un peu de temps à répondre (démarrage)"
- Après 30 secondes max: connexion réussie ou timeout

**Soyez patient lors de la première connexion !**

### ✅ Après la connexion

Une fois connecté, vous serez redirigé vers `/compte` (votre espace client/admin).

En tant que SUPER_ADMIN, vous avez accès à toutes les fonctionnalités:
- ✅ Créer/modifier/supprimer des catégories
- ✅ Créer/modifier/supprimer des produits
- ✅ Gérer les commandes
- ✅ Créer d'autres comptes ADMIN

## Créer un nouveau compte ADMIN

### Option 1: Via script Node.js

Un script d'exemple a été créé: `create-admin.example.js`

1. Installez Node.js si ce n'est pas déjà fait
2. Éditez le script pour changer l'email/mot de passe souhaités
3. Exécutez:
   ```bash
   cd frontend
   node create-admin.example.js
   ```

### Option 2: Via API directement

1. Connectez-vous d'abord avec le SUPER_ADMIN pour obtenir un token

2. Utilisez ce token pour créer un nouveau ADMIN:
   ```bash
   curl -X POST https://licences-api.onrender.com/api/auth/register \
     -H "Authorization: Bearer <VOTRE_TOKEN>" \
     -H "Content-Type: application/json" \
     -H "x-lang: fr" \
     -d '{
       "email": "admin@licensesale.com",
       "password": "VotreMotDePasse123!",
       "name": "Admin Name",
       "role": "ADMIN"
     }'
   ```

## Différences entre les rôles

### SUPER_ADMIN
- Toutes les permissions
- Peut créer/supprimer des catégories
- Peut créer/supprimer des produits
- Peut créer d'autres SUPER_ADMIN et ADMIN
- Peut restaurer des éléments supprimés

### ADMIN
- Peut créer/modifier des catégories et produits
- Peut gérer les commandes
- **Ne peut pas** supprimer définitivement
- **Ne peut pas** créer d'autres admins

### CLIENT
- Utilisateur normal du site e-commerce
- Peut passer des commandes
- Peut consulter ses commandes
- Peut gérer son profil

## Sécurité

⚠️ **IMPORTANT**: Pour la production, changez immédiatement le mot de passe du SUPER_ADMIN par défaut!

Pour changer le mot de passe, vous devrez soit:
1. Créer un endpoint de changement de mot de passe dans l'API
2. Accéder directement à la base de données
3. Utiliser le script seed avec de nouveaux credentials

## Dépannage

### Problème: "Le serveur met trop de temps à répondre"
- **Cause**: L'API Render est en cold start
- **Solution**: Attendez 30-60 secondes, ne fermez pas la page

### Problème: "Email ou mot de passe incorrect"
- Vérifiez bien l'email: `superadmin@admin.com` (sans espace)
- Vérifiez le mot de passe: `admin123!` (avec le !)
- Ouvrez la console (F12) pour voir les logs détaillés

### Problème: "Erreur réseau"
- Vérifiez votre connexion internet
- Vérifiez que l'API est en ligne: https://licences-api.onrender.com/api/health

## Support

Pour plus d'informations sur l'API, consultez:
- `API_DOCUMENTATION copy.md` - Documentation complète de l'API
- Swagger UI: https://licences-api.onrender.com/api/docs
