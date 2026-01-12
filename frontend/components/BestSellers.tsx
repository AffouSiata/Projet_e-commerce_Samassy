'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types/api';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll({
          includeInactive: false,
          limit: 12,
          sort: 'createdAt',
          order: 'desc'
        });
        if (response.data && Array.isArray(response.data)) {
          const featured = response.data.filter(p => p.isFeatured);
          setProducts(featured.length > 0 ? featured : response.data.slice(0, 12));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching best sellers:', err);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 400;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D3A5C]">
            Meilleures ventes
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-[#1D70B8] hover:text-white hover:border-[#1D70B8] transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-[#1D70B8] hover:text-white hover:border-[#1D70B8] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const discount = product.comparePrice && product.comparePrice > product.price
              ? Math.round((1 - product.price / product.comparePrice) * 100)
              : 0;

            return (
              <Link
                href={`/produit/${product.id}`}
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex-shrink-0 w-[280px]"
              >
                <div className="relative h-56 flex items-center justify-center p-4 bg-gray-50">
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  <div className="relative w-40 h-40 group-hover:scale-110 transition-transform duration-500">
                    <Image src={product.image} alt={product.name} fill className="object-contain" />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-50">
                  {product.category && (
                    <span className="text-xs font-semibold text-[#1D70B8] uppercase tracking-wider">
                      {product.category.name}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-gray-900 mt-1 mb-3 group-hover:text-[#1D70B8] transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">{product.price.toLocaleString()} F</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">{product.comparePrice.toLocaleString()} F</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={product.stockQuantity <= 0}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                        product.stockQuantity <= 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : addedProductId === product.id
                          ? 'bg-green-500 text-white'
                          : 'bg-[#1D70B8] text-white hover:bg-[#155a96] hover:scale-110'
                      }`}
                    >
                      {addedProductId === product.id ? <Check size={18} /> : <ShoppingCart size={18} />}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
