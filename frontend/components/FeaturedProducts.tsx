'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, ArrowRight, TrendingUp, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll({
          includeInactive: false,
          limit: 8,
          sort: 'createdAt',
          order: 'desc'
        });
        setProducts(response.data ? response.data.slice(0, 4) : []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1500);
    } catch (err) {
      // Error handled silently - cart context will handle display
    }
  };

  if (loading) {
    return (
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="text-[#1D70B8] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-14 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D70B8]/10 rounded-full mb-6">
            <TrendingUp size={16} className="text-[#1D70B8]" />
            <span className="text-sm font-semibold text-[#1D70B8]">
              LES PLUS DEMANDÉS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A5C] mb-4">
            Produits Populaires
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Découvrez nos licences les plus populaires à prix réduit
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              href={`/produit/${product.id}`}
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative h-64 flex items-center justify-center p-6">
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    -{product.comparePrice && product.comparePrice > product.price ? Math.round((1 - product.price / product.comparePrice) * 100) : 0}%
                  </span>
                </div>

                {/* Image */}
                <div className="relative w-48 h-48 transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 border-t border-gray-50">
                {/* Category */}
                {product.category && (
                  <span className="text-xs font-semibold text-[#1D70B8] uppercase tracking-wider">
                    {product.category.name}
                  </span>
                )}

                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-3 group-hover:text-[#1D70B8] transition-colors">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} F</span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">{product.comparePrice.toLocaleString()} F</span>
                    )}
                  </div>

                  {/* Cart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                      addedProductId === product.id
                        ? 'bg-green-500 text-white'
                        : 'bg-[#1D70B8] hover:bg-[#155a96] text-white'
                    }`}
                  >
                    {addedProductId === product.id ? (
                      <Check size={18} />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 hover:gap-3"
          >
            Voir tous les produits
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
