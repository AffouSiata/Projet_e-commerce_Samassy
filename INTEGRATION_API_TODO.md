# Intégrations API - État d'avancement

## ✅ Pages déjà intégrées

### 1. `/boutique/page.tsx`
- ✅ Utilise `productsApi.getAll()` avec filtres (catégorie, recherche, tri)
- ✅ Utilise `categoriesApi.getAll()` pour la sidebar
- ✅ États de chargement et erreurs gérés
- ✅ Pagination supportée (limit: 100)
- ✅ Rupture de stock affichée

### 2. `/categorie/[slug]/page.tsx`
- ✅ Utilise `categoriesApi.getBySlug(slug)`
- ✅ Utilise `productsApi.getAll({ categoryId })`
- ✅ États de chargement et erreurs gérés
- ✅ Tri dynamique (prix, nom, date)
- ✅ Icônes et couleurs dynamiques par catégorie

## 🔄 Pages à intégrer

### 3. `/produit/[id]/page.tsx`
**État: Partiellement fait**

**À faire:**
```typescript
// Remplacer les données mockées par:
import { productsApi } from '@/lib/api';

// Dans useEffect:
const product = await productsApi.getById(id);

// Pour produits similaires:
const similar = await productsApi.getAll({
  categoryId: product.categoryId,
  limit: 4
});
```

**Points clés:**
- L'ID est un UUID string, pas un number
- Gérer stockQuantity pour limite de quantité
- Afficher tags si présents
- Produits similaires basés sur categoryId

---

### 4. `/commande/page.tsx`
**État: À intégrer**

**Problème actuel:** Redirige vers WhatsApp sans créer de commande en base

**À faire:**
```typescript
import { ordersApi, cartApi } from '@/lib/api';

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Créer la commande
    const order = await ordersApi.create({
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      metadata: {
        paymentMethod: formData.paymentMethod,
        companyName: formData.companyName, // si fourni
      }
    });

    // L'API renvoie order.whatsappUrl si configuré
    if (order.whatsappUrl) {
      window.open(order.whatsappUrl, '_blank');
    }

    // Rediriger vers confirmation
    router.push(`/commande/confirmation?order=${order.orderNumber}`);

  } catch (err) {
    setError(err.response?.data?.message);
  }
};
```

**Points clés:**
- L'API crée la commande ET vide le panier automatiquement
- orderNumber est généré par l'API
- whatsappUrl est optionnel et généré par l'API
- Redirect vers page de confirmation avec orderNumber

---

### 5. `/compte/page.tsx` (Dashboard)
**État: À intégrer**

**Problème actuel:** Données utilisateur et commandes hardcodées

**À faire:**
```typescript
import { authApi, ordersApi } from '@/lib/api';

const [user, setUser] = useState<Admin | null>(null);
const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      // Récupérer l'utilisateur connecté
      const userData = await authApi.getMe();
      setUser(userData);

      // Récupérer ses commandes
      const ordersData = await ordersApi.getAll();
      setOrders(ordersData);
    } catch (err) {
      // Si pas connecté, rediriger vers /connexion
      router.push('/connexion');
    }
  };

  fetchData();
}, []);
```

**Affichage:**
- user.name, user.email
- orders.length pour nombre total
- orders.slice(0, 3) pour les 3 dernières

---

### 6. `/compte/commandes/page.tsx`
**État: À intégrer**

**À faire:**
```typescript
import { ordersApi } from '@/lib/api';

const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  const fetchOrders = async () => {
    const data = await ordersApi.getAll();
    setOrders(data);
  };
  fetchOrders();
}, []);
```

**Affichage:**
- Tableau avec: orderNumber, date, totalAmount, status
- Filtres par status optionnels
- Lien vers détails: `/compte/commandes/${order.id}`

---

### 7. `/compte/profil/page.tsx`
**État: À intégrer**

**À faire:**
```typescript
import { authApi } from '@/lib/api';

const [user, setUser] = useState<Admin | null>(null);

useEffect(() => {
  const fetchUser = async () => {
    const data = await authApi.getMe();
    setUser(data);
  };
  fetchUser();
}, []);
```

**Affichage:**
- Formulaire pré-rempli avec user.name, user.email
- Note: L'API ne supporte pas la modification de profil actuellement
- Afficher message "Modification du profil bientôt disponible"

---

### 8. `/compte/licences/page.tsx`
**État: Décision utilisateur**

**Decision prise:** Afficher message "Licences via WhatsApp"

**À faire:**
```typescript
// Remplacer les données mockées par:
<div className="text-center py-12">
  <h3 className="text-xl font-bold mb-4">Vos licences vous sont envoyées par WhatsApp</h3>
  <p className="text-gray-600 mb-6">
    Après validation de votre commande, toutes vos clés de licence
    vous sont transmises directement via WhatsApp pour une livraison instantanée.
  </p>
  <Link href="/commande" className="btn-primary">
    Passer une nouvelle commande
  </Link>
</div>
```

---

### 9. Page d'accueil - `/page.tsx`
**État: Composants à intégrer**

#### 9a. `components/FeaturedProducts.tsx`
```typescript
import { productsApi } from '@/lib/api';

useEffect(() => {
  const fetchProducts = async () => {
    const response = await productsApi.getAll({
      includeInactive: false,
      limit: 8,
      sort: 'createdAt',
      order: 'desc'
    });
    setProducts(response.data);
  };
  fetchProducts();
}, []);
```

#### 9b. `components/BestSellers.tsx`
```typescript
import { productsApi } from '@/lib/api';

useEffect(() => {
  const fetchProducts = async () => {
    // Simuler "best sellers" avec produits featured
    const response = await productsApi.getAll({
      includeInactive: false,
      limit: 12,
      sort: 'createdAt',
      order: 'desc'
    });
    // Filtrer ceux qui ont isFeatured = true si possible
    const featured = response.data.filter(p => p.isFeatured);
    setProducts(featured.length > 0 ? featured : response.data.slice(0, 12));
  };
  fetchProducts();
}, []);
```

#### 9c. `components/Categories.tsx`
```typescript
import { categoriesApi } from '@/lib/api';

useEffect(() => {
  const fetchCategories = async () => {
    const response = await categoriesApi.getAll({
      includeInactive: false,
      limit: 6
    });
    setCategories(response.data);
  };
  fetchCategories();
}, []);
```

---

## Notes importantes

### AuthContext déjà implémenté ✅
Le fichier `/context/AuthContext.tsx` existe et fournit:
- `login(email, password)` - Appelle authApi.login()
- `register(email, password, name)` - Appelle authApi.register()
- `logout()` - Nettoie les tokens
- `user` - Utilisateur connecté (ou null)
- `isAuthenticated` - Boolean
- `loading` - État de chargement

**Utilisation:**
```typescript
import { useAuth } from '@/context/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

### CartContext déjà implémenté ✅
Le fichier `/context/CartContext.tsx` est complet:
- Toutes les opérations panier utilisent l'API
- Sync automatique avec le backend
- Session cookies gérées automatiquement

### Protection des routes
Pour les pages compte, ajouter:
```typescript
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { isAuthenticated, loading } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.push('/connexion');
  }
}, [isAuthenticated, loading, router]);

if (loading) return <Loader />;
if (!isAuthenticated) return null;
```

---

## Checklist finale

- [x] `/boutique` - Produits avec API
- [x] `/categorie/[slug]` - Catégorie avec API
- [ ] `/produit/[id]` - Détail produit avec API
- [ ] `/commande` - Créer commande via API
- [ ] `/compte` - Dashboard avec API
- [ ] `/compte/commandes` - Liste commandes avec API
- [ ] `/compte/profil` - Profil avec API
- [ ] `/compte/licences` - Message "WhatsApp"
- [ ] Homepage `FeaturedProducts` - API
- [ ] Homepage `BestSellers` - API
- [ ] Homepage `Categories` - API

---

## Test après intégration

1. **Tester `/boutique`:**
   - Vérifier que les produits s'affichent
   - Tester filtres par catégorie
   - Tester recherche
   - Tester tri (prix, nom)

2. **Tester `/categorie/[slug]`:**
   - Naviguer depuis homepage
   - Vérifier produits de la catégorie
   - Tester tri

3. **Tester `/produit/[id]`:**
   - Cliquer sur un produit
   - Vérifier détails
   - Ajouter au panier
   - Vérifier produits similaires

4. **Tester `/commande`:**
   - Remplir formulaire
   - Créer commande
   - Vérifier redirection
   - Vérifier que panier est vidé

5. **Tester `/compte`:**
   - Se connecter
   - Vérifier infos utilisateur
   - Vérifier liste commandes

---

## Commandes pour tester l'API directement

```bash
# Vérifier l'API est accessible
curl https://licences-api.onrender.com/api/health

# Lister les produits
curl https://licences-api.onrender.com/api/products?limit=5

# Lister les catégories
curl https://licences-api.onrender.com/api/categories
```
