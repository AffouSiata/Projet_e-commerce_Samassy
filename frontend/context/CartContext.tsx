'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { cartApi } from '@/lib/api';
import type { Cart as ApiCart, CartItem as ApiCartItem, Product } from '@/types/api';

// Interface pour les items du panier (compatible avec l'ancien format)
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  product?: Product;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Fonction pour convertir les items de l'API en format local
  const convertApiItemsToLocal = (apiItems: ApiCartItem[]): CartItem[] => {
    return apiItems.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product?.name || '',
      price: item.price,
      originalPrice: item.product?.comparePrice || item.price,
      image: item.product?.image || '',
      quantity: item.quantity,
      product: item.product,
    }));
  };

  // Charger le panier depuis l'API au montage
  const refreshCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.get();
      const localItems = convertApiItemsToLocal(response.cart.items);
      setItems(localItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du panier');
      // En cas d'erreur, initialiser un panier vide
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized.current) {
      refreshCart();
      isInitialized.current = true;
    }
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.addItem({ productId, quantity });
      const localItems = convertApiItemsToLocal(response.cart.items);
      setItems(localItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout au panier');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.removeItem(itemId);
      const localItems = convertApiItemsToLocal(response.cart.items);
      setItems(localItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.updateItem(itemId, { quantity });
      const localItems = convertApiItemsToLocal(response.cart.items);
      setItems(localItems);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartApi.clear();
      setItems([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du vidage du panier');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      loading,
      error,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
