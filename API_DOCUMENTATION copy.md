# Documentation API — Licences (FR)

> Cette documentation décrit l'API REST pour la plateforme de vente de licences.
> Elle contient tous les endpoints, DTOs, validations, messages d'erreur, i18n, exemples et flux (admin & client).

---

## Sommaire
1. Aperçu général
2. Auth (admin)
3. Categories
4. Products
5. Cart (session cookie)
6. Orders
7. Health
8. Pagination / Filtrage / Tri
9. Localisation (i18n)
10. Session & Cookie
11. Structure des réponses / erreurs
12. Prisma models (Résumé)
13. Exemples de flux (cURL)
14. Conseils pour le frontend

---

## 1) Aperçu général
- Base URL (développement) : `https://licences-api.onrender.com/api`
- Swagger UI : `https://licences-api.onrender.com/api/docs`
- Authentification : JWT Bearer tokens (Header `Authorization: Bearer <token>`)
- Session cookie : `sessionId` (via `express-session`)
- Langue : `x-lang` header ou query param `?lang=` (fr par défaut)
- Principaux modules : Auth, Categories, Products, Cart, Orders, Health

---

## 2) Auth — Endpoints

### POST /api/auth/login
- Description : Connexion admin
- Body (JSON) :
  - `email` : string (email)
  - `password` : string
- Response 200 (LoginResponseDto) :
  ```json
  {
    "admin": {"id":"uuid","email":"admin@example.com","name":"...","role":"ADMIN","createdAt":"..."},
    "accessToken": "...jwt...",
    "refreshToken": "...jwt..."
  }
  ```
- Erreurs : 400 (validation), 401 (bad credentials)

### POST /api/auth/register
- Description : Créer un compte (inscription publique). Par défaut, le rôle est `CLIENT`.
- Note : Seul un `SUPER_ADMIN` authentifié peut créer des comptes `ADMIN` ou `SUPER_ADMIN` en fournissant le header `Authorization`.
- Body (RegisterDto) : `email`, `password`, `name`, `role?`
- Response 201 : RegisterResponseDto (Admin info + tokens)

Exemples cURL:

1) Inscription publique (role CLIENT par défaut)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"P@ssw0rd1","name":"User"}'
```

2) Créer un compte ADMIN par un SUPER_ADMIN authentifié
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Authorization: Bearer <SUPER_ADMIN_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin2@example.com","password":"P@ssw0rd1","name":"Admin 2","role":"ADMIN"}'
```

### GET /api/auth/me
- Guard : JWT
- Response 200 : AdminResponseDto

### POST /api/auth/refresh
- Guard : JWT
- Response 200 : TokensResponseDto

---

## 3) Categories

### GET /api/categories
- Public
- Query params :
  - `includeInactive` : boolean (optional)
  - `page` : number (optional)
  - `limit` : number (optional)
  - `sort` : "name" | "order"
  - `order` : "asc" | "desc"
- Response : CategoryListResponseDto

### GET /api/categories/:id
- Response : CategoryWithRelationsDto
- Errors : 404

### GET /api/categories/slug/:slug
- Response : CategoryWithRelationsDto

### POST /api/categories
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Body : CreateCategoryDto
- Response : 201 CategoryWithRelationsDto
- Errors : 400 validation, 409 existant

### PUT /api/categories/:id
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Body : UpdateCategoryDto
- Response : 200 CategoryWithRelationsDto

### PATCH /api/categories/:id/toggle
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Toggles `isActive`
- Response : CategoryResponseDto

### DELETE /api/categories/:id
- Guard : JWT + RolesGuard (SUPER_ADMIN)
- Soft delete (set `deletedAt`)
- Response : CategoryResponseDto

### PATCH /api/categories/:id/restore
- Guard : JWT + RolesGuard (SUPER_ADMIN)
- Restore soft deleted
- Response : CategoryResponseDto

---

## 4) Products

### GET /api/products
- Public
- Query params :
  - `includeInactive` : boolean
  - `categoryId` : string
  - `page`, `limit` : number
  - `sort` : price|name|createdAt|stockQuantity
  - `order` : asc|desc
  - `q` : string (search name, description, tags)
  - `minPrice`, `maxPrice` (numbers)
  - `tags` : comma-separated
  - `minStock`, `maxStock` (numbers)
- Response : ProductListResponseDto

### GET /api/products/:id
- Response : ProductWithCategoryDto
- Errors : 404 if not found

### GET /api/products/slug/:slug
- Response : ProductWithCategoryDto

### POST /api/products
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Body : CreateProductDto (Zod validations)
- Response 201 : ProductWithCategoryDto
- Errors : 400 validation, 404 category not found, 409 slug conflict

### PUT /api/products/:id
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Body : UpdateProductDto
- Response : ProductWithCategoryDto

### PATCH /api/products/:id/toggle
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Toggle isActive

### DELETE /api/products/:id
- Guard : JWT + RolesGuard (SUPER_ADMIN)
- Soft delete (deletedAt)

### PATCH /api/products/:id/restore
- Guard : JWT + RolesGuard (SUPER_ADMIN)
- Restore soft deleted

---

## 5) Cart (Panier)
- Cookie/session : `sessionId` via `Set-Cookie` header
- All cart endpoints read/write `session.cartId` so cookie must travel with requests

### GET /api/cart
- Get or create cart for the session
- Response : CartResponseDto
- Sets Cookie: sessionId on first call

### POST /api/cart/items
- Body : AddToCartDto { productId: uuid, quantity: int }
- Header optional: `x-lang` for localization
- Response : 201 CartResponseDto
- Errors : 404 product not found, 409 stock insufficient, 409 product unavailable

### PATCH /api/cart/items/:itemId
- Body : UpdateCartItemDto { quantity: int }
- If quantity = 0 -> item is removed
- Response : 200 CartResponseDto
- Errors : 404 item not found, 409 stock insufficient

### DELETE /api/cart/items/:itemId
- Remove item
- Response : 200 CartResponseDto

### DELETE /api/cart
- Clear cart
- Response : 200 CartResponseDto

---

## 6) Orders

### POST /api/orders
- Create an order from session cart
- Cookie: sessionId must be present
- Body : CreateOrderDto (customerName, customerEmail?, customerPhone, metadata?)
- Headers : `x-lang` optional to localize errors
- Behavior :
  - Validate cart not empty -> 404 with translated message `errors.order.emptyCart`
  - Check stock for each item -> 404 `errors.order.insufficientStock`
  - Decrement stock for each item, generate `orderNumber` and totalAmount
  - Clear cart after successful create
  - Generate `whatsappUrl` if configured
- Response : 201 OrderResponseDto

### GET /api/orders
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Query : `status` optional filter
- Response : list of OrderResponseDto

### GET /api/orders/:id
- Public
- Response : OrderResponseDto

### GET /api/orders/number/:orderNumber
- Public
- Response : OrderResponseDto

### PATCH /api/orders/:id/status
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Body : UpdateOrderStatusDto { status: PENDING|CONFIRMED|PROCESSING|COMPLETED|CANCELLED }
- Response : OrderResponseDto

### PATCH /api/orders/:id/cancel
- Guard : JWT + RolesGuard (SUPER_ADMIN|ADMIN)
- Restock items (increment stock on products)
- Response: OrderResponseDto

---

## 7) Health
- GET /api/health
- Response: `status`, `timestamp`, `uptime`

---

## 8) Pagination, Filtrage et Tri
- `page` (1-indexed), `limit` (default 20) — limit max 100 serveur
- `sort` et `order` sur les endpoints qui le supportent
- `q` sur `GET /products` -> contient recherche sur `name`, `description` et `tags`
- `tags` attendu comme chaîne CSV -> serveur convertit en tableau pour `hasSome`

---

## 9) i18n (Localisation)
- Résolution des locales : query `?lang=`, header `x-lang`, Accept-Language fallback
- Langues : `fr` (fallback), `en`
- Les messages d'erreur sont localisés via `this.i18n.t('errors.*', { lang })` dans les services
- Exemples clés d'erreurs (fr / en) :
  - `errors.product.notFound` -> "Produit avec l'ID {id} introuvable" / "Product with ID {id} not found"
  - `errors.cart.itemNotFound` -> "Item non trouvé dans le panier" / "Cart item not found"
  - `errors.order.emptyCart` -> "Le panier est vide" / "The cart is empty"

---

## 10) Session & Cookies (Cart)
- Cookie `sessionId` est créé par GET /api/cart (Set-Cookie)
- le frontend doit inclure `credentials: include` & envoyer la cookie avec les requêtes suivantes (axios/fetch) pour maintenir le même panier
- Exemple de code fetch :
```js
fetch('/api/cart', { credentials: 'include' })
```

---

## 11) Structure des réponses et format d'erreur
- Response standard d'erreur renvoyée par `AllExceptionsFilter` :
```json
{
  "statusCode": 404,
  "timestamp": "2025-11-23T...Z",
  "path": "/api/products/0000-...",
  "message": "Product with ID ... not found",
  "errors": [ ... ]
}
```
- `message` peut être une string traduite par la config i18n
- `errors` contient la validation Zod si la requête échoue (structure d'erreur détaillée)

---

## 12) Prisma Models (Résumé simplifié)
- Admin: id, email, password, name, role, isActive, createdAt, updatedAt
- Category: id, name, slug, description?, icon?, image?, isActive, order, parentId?, deletedAt?, createdAt, updatedAt
- Product: id, name, slug, description, shortDesc?, price, comparePrice?, image, images[], stockQuantity, isActive, isFeatured, tags[], metaTitle?, metaDesc?, categoryId, deletedAt?, createdAt, updatedAt
- Cart: id, sessionId (unique), items[], expiresAt, createdAt, updatedAt
- CartItem: id, cartId, productId, quantity, price, createdAt, updatedAt
- Order: id, orderNumber, customerName, customerEmail?, customerPhone, totalAmount, status, whatsappUrl?, items[], metadata?, deletedAt?, createdAt, updatedAt
- OrderItem: id, orderId, productId, quantity, price, productName, createdAt

---

## 13) Exemple de flows (cURL)
### Admin login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"abdulkabore@gmail.com","password":"password123"}'
```

### Create category (admin)
```bash
curl -X POST http://localhost:3000/api/categories \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Systèmes d\'exploitation","description":"OS"}'
```

### Create product (admin)
```bash
curl -X POST http://localhost:3000/api/products \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Windows 11 Pro","description":"Licence...","price":89.99, "stockQuantity":50, "categoryId":"<category-id>" }'
```

### Client cart flow (session cookie)
```bash
# Create or fetch cart -> cookie set via Set-Cookie
TMP_HEADERS=$(mktemp)
curl -s -D "$TMP_HEADERS" -o /dev/null http://localhost:3000/api/cart
SESSION_COOKIE=$(grep -i "Set-Cookie: sessionId" "$TMP_HEADERS" | sed 's/Set-Cookie: //;s/;.*//')

# Add product to cart
curl -s -X POST http://localhost:3000/api/cart/items \
  -H "Cookie: ${SESSION_COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"productId":"<product-uuid>", "quantity":2 }'

# Create order from cart
curl -s -X POST http://localhost:3000/api/orders \
  -H "Cookie: ${SESSION_COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Jean Dupont","customerPhone":"+33612345678" }'
```

---

## 14) Conseils & Notes pour le générateur frontend
- Authentication & Admin
  - Stockez `accessToken` localement (ex: localStorage), utilisez `Authorization` header
  - Vérifiez `admin.role` (SUPER_ADMIN|ADMIN|CLIENT) pour afficher/masquer les fonctionnalités critiques
- Cart & Sessions
  - Configurez `fetch` / `axios` pour envoyer `credentials: 'include'` afin de conserver la cookie `sessionId`
  - Affichez erreurs du `message` dans la réponse d'erreur, elles sont localisées par `x-lang`
- Product UI
  - Ajoutez filtres (q, tags, min/max price, stock, page, limit, sort/order)
  - Pagination : la réponse contient `page`, `limit`, `pageCount`, `total`
- Orders
  - After order creation, si `whatsappUrl` est renvoyée, proposer un bouton pour ouvrir ce lien
- i18n
  - Frontend peut passer `x-lang` header ou `?lang=` query param. Valeurs : `fr`, `en`.
- Validation & UX
  - Dupliquez les validations Zod côté frontend pour éviter les erreurs 400 récurrentes côté client.

---

## 15) Besoin d'un fichier OpenAPI / Postman / SDK ?
Je peux générer :
- Un fichier OpenAPI 3.0 (JSON/YAML) prêt à être importé dans un générateur d'UI.
- Une collection Postman.
- Des wrappers JS `fetch` / `axios` (simple client), ou des composants React/Vue pour la plupart des modules.

Dites-moi quel format vous voulez (OpenAPI JSON, Postman, React components, ou autres) et je le génère.

---

_Fin de la documentation — générée automatiquement par l'agent (fr)._

---

## Annexe: Créer un Super Admin (seed)

Un script d'assistance est disponible pour créer (ou mettre à jour) un super admin :
- `scripts/create-super-admin.ts` (idempotent - utilise `Prisma.upsert`)
- Un script alternatif est présent à la racine du projet `a.ts` (upsert également).

Par défaut, le script crée :
```text
name: Super Admin
email: superadmin@admin.com
password: admin123!
role: SUPER_ADMIN
```

Exécution (depuis la racine du projet) :
```bash
# via npm script
npm run seed:superadmin

# ou directement (si ts-node est installé)
npx ts-node scripts/create-super-admin.ts
```

Sécurité :
- Changez immédiatement le mot de passe par défaut après la création.
- Préférez passer les valeurs via variables d'environnement pour éviter d'encoder des secrets :
```bash
export SUPERADMIN_EMAIL=admin@exemple.com
export SUPERADMIN_PASSWORD=MonMdpSecurise!
export SUPERADMIN_NAME="Super Admin"
npx ts-node scripts/create-super-admin.ts
```

Note : Le script suppose que `DATABASE_URL` est déjà configuré (connexion à la DB).
