import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  Admin,
  Category,
  CategoryListResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
  Product,
  ProductListResponse,
  ProductQueryParams,
  CreateProductDto,
  UpdateProductDto,
  CartResponse,
  AddToCartDto,
  UpdateCartItemDto,
  Order,
  CreateOrderDto,
  UpdateOrderStatusDto,
  HealthResponse,
  ApiError,
} from '@/types/api';

// Configuration de base
const API_BASE_URL = 'https://licences-api.onrender.com/api';

// Création de l'instance axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // IMPORTANT: Pour envoyer les cookies (sessionId) avec chaque requête
  withCredentials: true,
  // Timeout de 90 secondes (pour gérer le cold start de Render qui peut prendre jusqu'à 60s)
  timeout: 90000,
});

// Intercepteur pour ajouter le token JWT aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ajouter la langue (fr par défaut)
    config.headers['x-lang'] = 'fr';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs et le refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as any;

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          setAccessToken(accessToken);
          setRefreshToken(newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/connexion';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Gestion des tokens dans localStorage
const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

export const setRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

// ============================================
// AUTH API
// ============================================

export const authApi = {
  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    return response.data;
  },

  async register(data: RegisterDto): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    return response.data;
  },

  async getMe(): Promise<Admin> {
    const response = await apiClient.get<Admin>('/auth/me');
    return response.data;
  },

  async refresh(): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post('/auth/refresh');
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    return response.data;
  },

  logout(): void {
    clearTokens();
  },
};

// ============================================
// CATEGORIES API
// ============================================

export const categoriesApi = {
  async getAll(params?: {
    includeInactive?: boolean;
    page?: number;
    limit?: number;
    sort?: 'name' | 'order';
    order?: 'asc' | 'desc';
  }): Promise<CategoryListResponse> {
    const response = await apiClient.get<CategoryListResponse>('/categories', { params });
    return response.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async getBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  },

  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async toggle(id: string): Promise<Category> {
    const response = await apiClient.patch<Category>(`/categories/${id}/toggle`);
    return response.data;
  },

  async delete(id: string): Promise<Category> {
    const response = await apiClient.delete<Category>(`/categories/${id}`);
    return response.data;
  },

  async restore(id: string): Promise<Category> {
    const response = await apiClient.patch<Category>(`/categories/${id}/restore`);
    return response.data;
  },
};

// ============================================
// PRODUCTS API
// ============================================

export const productsApi = {
  async getAll(params?: ProductQueryParams): Promise<ProductListResponse> {
    const response = await apiClient.get<ProductListResponse>('/products', { params });
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  async create(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async toggle(id: string): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}/toggle`);
    return response.data;
  },

  async delete(id: string): Promise<Product> {
    const response = await apiClient.delete<Product>(`/products/${id}`);
    return response.data;
  },

  async restore(id: string): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${id}/restore`);
    return response.data;
  },
};

// ============================================
// CART API
// ============================================

export const cartApi = {
  async get(): Promise<CartResponse> {
    const response = await apiClient.get<CartResponse>('/cart');
    return response.data;
  },

  async addItem(data: AddToCartDto): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>('/cart/items', data);
    return response.data;
  },

  async updateItem(itemId: string, data: UpdateCartItemDto): Promise<CartResponse> {
    const response = await apiClient.patch<CartResponse>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  async removeItem(itemId: string): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>(`/cart/items/${itemId}`);
    return response.data;
  },

  async clear(): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>('/cart');
    return response.data;
  },
};

// ============================================
// ORDERS API
// ============================================

export const ordersApi = {
  async create(data: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  async getAll(params?: { status?: string }): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders', { params });
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async getByOrderNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  async updateStatus(id: string, data: UpdateOrderStatusDto): Promise<Order> {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  async cancel(id: string): Promise<Order> {
    const response = await apiClient.patch<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};

// ============================================
// HEALTH API
// ============================================

export const healthApi = {
  async check(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },
};

// Export de l'instance axios pour des cas d'usage personnalisés
export default apiClient;
