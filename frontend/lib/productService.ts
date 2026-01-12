import { productsApi, categoriesApi } from '@/lib/api';
import type { ProductQueryParams, Product, Category } from '@/types/api';
import { transformProduct, transformProducts, transformCategory, transformCategories, type DisplayProduct, type DisplayCategory } from './transforms';
import cache from './cache';

/**
 * Service pour récupérer les produits depuis l'API avec cache
 */
export const productService = {
  /**
   * Récupère tous les produits avec filtres optionnels
   */
  async getProducts(params?: ProductQueryParams): Promise<{ data: DisplayProduct[]; pagination: any }> {
    try {
      // Générer une clé de cache basée sur les paramètres
      const cacheKey = `products_${JSON.stringify(params || {})}`;

      // Vérifier le cache
      const cached = cache.get<{ data: DisplayProduct[]; pagination: any }>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appeler l'API
      const response = await productsApi.getAll(params);

      // Transformer les données
      const result = {
        data: transformProducts(response.data),
        pagination: response.pagination,
      };

      // Mettre en cache (10 minutes)
      cache.set(cacheKey, result, 10 * 60 * 1000);

      return result;
    } catch (error: any) {
      throw new Error('Erreur lors du chargement des produits');
    }
  },

  /**
   * Récupère un produit par son ID
   */
  async getProductById(id: string): Promise<DisplayProduct> {
    try {
      const cacheKey = `product_${id}`;

      // Vérifier le cache
      const cached = cache.get<DisplayProduct>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appeler l'API
      const product = await productsApi.getById(id);
      const transformed = transformProduct(product);

      // Mettre en cache (30 minutes)
      cache.set(cacheKey, transformed, 30 * 60 * 1000);

      return transformed;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Produit non trouvé');
      }
      throw new Error('Erreur lors du chargement du produit');
    }
  },

  /**
   * Récupère un produit par son slug
   */
  async getProductBySlug(slug: string): Promise<DisplayProduct> {
    try {
      const cacheKey = `product_slug_${slug}`;

      // Vérifier le cache
      const cached = cache.get<DisplayProduct>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appeler l'API
      const product = await productsApi.getBySlug(slug);
      const transformed = transformProduct(product);

      // Mettre en cache (30 minutes)
      cache.set(cacheKey, transformed, 30 * 60 * 1000);

      return transformed;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Produit non trouvé');
      }
      throw new Error('Erreur lors du chargement du produit');
    }
  },
};

/**
 * Service pour récupérer les catégories depuis l'API avec cache
 */
export const categoryService = {
  /**
   * Récupère toutes les catégories
   */
  async getCategories(params?: {
    includeInactive?: boolean;
    page?: number;
    limit?: number;
    sort?: 'name' | 'order';
    order?: 'asc' | 'desc';
  }): Promise<{ data: DisplayCategory[]; pagination: any }> {
    try {
      const cacheKey = `categories_${JSON.stringify(params || {})}`;

      // Vérifier le cache
      const cached = cache.get<{ data: DisplayCategory[]; pagination: any }>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appeler l'API
      const response = await categoriesApi.getAll(params);

      // Transformer les données
      const result = {
        data: transformCategories(response.data),
        pagination: response.pagination,
      };

      // Mettre en cache (5 minutes)
      cache.set(cacheKey, result, 5 * 60 * 1000);

      return result;
    } catch (error: any) {
      throw new Error('Erreur lors du chargement des catégories');
    }
  },

  /**
   * Récupère une catégorie par son ID
   */
  async getCategoryById(id: string): Promise<DisplayCategory> {
    try {
      const cacheKey = `category_${id}`;

      // Vérifier le cache
      const cached = cache.get<DisplayCategory>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appeler l'API
      const category = await categoriesApi.getById(id);
      const transformed = transformCategory(category);

      // Mettre en cache (5 minutes)
      cache.set(cacheKey, transformed, 5 * 60 * 1000);

      return transformed;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Catégorie non trouvée');
      }
      throw new Error('Erreur lors du chargement de la catégorie');
    }
  },

  /**
   * Récupère une catégorie par son slug
   */
  async getCategoryBySlug(slug: string): Promise<DisplayCategory> {
    try {
      const cacheKey = `category_slug_${slug}`;

      // Vérifier le cache
      const cached = cache.get<DisplayCategory>(cacheKey);
      if (cached) {
        return cached;
      }

      // Appeler l'API
      const category = await categoriesApi.getBySlug(slug);
      const transformed = transformCategory(category);

      // Mettre en cache (5 minutes)
      cache.set(cacheKey, transformed, 5 * 60 * 1000);

      return transformed;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Catégorie non trouvée');
      }
      throw new Error('Erreur lors du chargement de la catégorie');
    }
  },
};
