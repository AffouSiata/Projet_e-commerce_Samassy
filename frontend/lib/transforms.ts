import type { Product, Category } from '@/types/api';

// Interface pour les produits affichés dans le frontend
export interface DisplayProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  originalPrice: number;  // Mapper de comparePrice
  image: string;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  rating: number;         // Default 0 si absent
  reviews: number;        // Default 0 si absent
  categoryId: string;
  category?: Category;
}

// Interface pour les catégories affichées dans le frontend
export interface DisplayCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  order: number;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  products?: DisplayProduct[];
}

/**
 * Transforme un produit de l'API en format d'affichage frontend
 */
export function transformProduct(apiProduct: Product): DisplayProduct {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    shortDesc: apiProduct.shortDesc,
    price: apiProduct.price,
    originalPrice: apiProduct.comparePrice || apiProduct.price, // Utiliser comparePrice ou price
    image: apiProduct.image,
    images: apiProduct.images,
    stockQuantity: apiProduct.stockQuantity,
    isActive: apiProduct.isActive,
    isFeatured: apiProduct.isFeatured,
    tags: apiProduct.tags,
    rating: 0,  // API ne fournit pas de rating
    reviews: 0, // API ne fournit pas de reviews
    categoryId: apiProduct.categoryId,
    category: apiProduct.category,
  };
}

/**
 * Transforme une liste de produits de l'API
 */
export function transformProducts(apiProducts: Product[]): DisplayProduct[] {
  return apiProducts.map(transformProduct);
}

/**
 * Transforme une catégorie de l'API en format d'affichage frontend
 */
export function transformCategory(apiCategory: Category): DisplayCategory {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    description: apiCategory.description,
    icon: apiCategory.icon,
    image: apiCategory.image,
    isActive: apiCategory.isActive,
    order: apiCategory.order,
    parentId: apiCategory.parentId,
    parent: apiCategory.parent,
    children: apiCategory.children,
    products: apiCategory.products ? transformProducts(apiCategory.products) : undefined,
  };
}

/**
 * Transforme une liste de catégories de l'API
 */
export function transformCategories(apiCategories: Category[]): DisplayCategory[] {
  return apiCategories.map(transformCategory);
}

/**
 * Calcule le pourcentage de réduction
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  if (originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Formate un prix en CFA
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' CFA';
}
