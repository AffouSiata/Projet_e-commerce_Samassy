// Types basés sur l'API Documentation

// Auth Types
export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT';
}

export interface LoginResponse {
  admin: Admin;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  admin: Admin;
  accessToken: string;
  refreshToken: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  order: number;
  parentId?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
  parent?: Category;
  children?: Category[];
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
  parentId?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
  parentId?: string;
}

export interface CategoryListResponse {
  data: Category[];
  pagination: PaginationMeta;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  metaTitle?: string;
  metaDesc?: string;
  categoryId: string;
  category?: Category;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  slug?: string;
  description: string;
  shortDesc?: string;
  price: number;
  comparePrice?: number;
  image: string;
  images?: string[];
  stockQuantity: number;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDesc?: string;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  price?: number;
  comparePrice?: number;
  image?: string;
  images?: string[];
  stockQuantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  metaTitle?: string;
  metaDesc?: string;
  categoryId?: string;
}

export interface ProductListResponse {
  data: Product[];
  pagination: PaginationMeta;
}

export interface ProductQueryParams {
  includeInactive?: boolean;
  categoryId?: string;
  page?: number;
  limit?: number;
  sort?: 'price' | 'name' | 'createdAt' | 'stockQuantity';
  order?: 'asc' | 'desc';
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  minStock?: number;
  maxStock?: number;
}

// Cart Types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartResponse {
  cart: Cart;
  totalItems: number;
  totalPrice: number;
}

// Order Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  totalAmount: number;
  status: OrderStatus;
  whatsappUrl?: string;
  items: OrderItem[];
  metadata?: Record<string, any>;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  metadata?: Record<string, any>;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderResponse {
  order: Order;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
}

// Error Response
export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errors?: any[];
}

// Health
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}
