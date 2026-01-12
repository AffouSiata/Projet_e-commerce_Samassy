'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  ShoppingCart,
  Check,
  Shield,
  Truck,
  Headphones,
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Share2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types/api';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsApi.getById(id);
        setProduct(productData);

        // Charger produits similaires (même catégorie)
        if (productData.categoryId) {
          const response = await productsApi.getAll({
            categoryId: productData.categoryId,
            includeInactive: false,
            limit: 5,
          });
          // Exclure le produit actuel
          const similar = response.data.filter(p => p.id !== id).slice(0, 4);
          setSimilarProducts(similar);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Produit non trouvé');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      // Error handled silently - cart context will handle display
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 size={48} className="text-[#1D70B8] animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-8">{error || 'Ce produit n\'existe pas ou n\'est plus disponible.'}</p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-bold rounded-xl hover:bg-[#155a96] transition-all"
          >
            Retour à la boutique
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#1D70B8] transition-colors">Accueil</Link>
            <ChevronRight size={14} className="text-gray-300" />
            {product.category && (
              <>
                <Link href={`/categorie/${product.category.slug}`} className="text-gray-500 hover:text-[#1D70B8] transition-colors">{product.category.name}</Link>
                <ChevronRight size={14} className="text-gray-300" />
              </>
            )}
            <span className="text-[#1D70B8] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12 flex items-center justify-center">
                {/* Discount Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-lg font-bold rounded-full shadow-lg">
                    -{discount}%
                  </span>
                </div>

                {/* Wishlist & Share */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all">
                    <Heart size={22} />
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 hover:text-[#1D70B8] text-gray-400 transition-all">
                    <Share2 size={22} />
                  </button>
                </div>

                {/* Image */}
                <div className="relative w-72 h-72 lg:w-96 lg:h-96">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12 flex flex-col">
                {/* Category */}
                {product.category && (
                  <span className="text-sm font-semibold text-[#1D70B8] uppercase tracking-wider mb-2">
                    {product.category.name}
                  </span>
                )}

                {/* Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-[#0D3A5C] mb-6">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Tags / Features */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-3">Tags :</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-[#1D70B8] rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="text-4xl font-bold text-[#0D3A5C]">{product.price.toLocaleString()} F</span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <>
                        <span className="text-xl text-gray-400 line-through">{product.comparePrice.toLocaleString()} F</span>
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                          Économisez {(product.comparePrice - product.price).toLocaleString()} F
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {/* Quantity Selector */}
                  <div className="flex items-center bg-gray-100 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors"
                    >
                      <Minus size={18} className="text-gray-600" />
                    </button>
                    <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors"
                    >
                      <Plus size={18} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl ${
                      added
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gradient-to-r from-[#1D70B8] to-[#1558A0] hover:from-[#1558A0] hover:to-[#0F4070] text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check size={22} />
                        Ajouté au panier !
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={22} />
                        Ajouter au panier
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Truck size={24} className="text-[#1D70B8]" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Livraison instantanée</p>
                      <p className="text-xs text-gray-500">Par email en 5 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Shield size={24} className="text-[#1D70B8]" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">100% Authentique</p>
                      <p className="text-xs text-gray-500">Licence officielle</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Headphones size={24} className="text-[#1D70B8]" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Support 24/7</p>
                      <p className="text-xs text-gray-500">Assistance technique</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <RefreshCw size={24} className="text-[#1D70B8]" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Garantie satisfait</p>
                      <p className="text-xs text-gray-500">Remboursement 30 jours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#0D3A5C] mb-8">
              Produits similaires
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((item) => {
                const itemDiscount = item.comparePrice && item.comparePrice > item.price
                  ? Math.round((1 - item.price / item.comparePrice) * 100)
                  : 0;
                return (
                  <Link
                    href={`/produit/${item.id}`}
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 flex items-center justify-center p-4 bg-gray-50">
                      {/* Discount Badge */}
                      {itemDiscount > 0 && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            -{itemDiscount}%
                          </span>
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative w-32 h-32 transition-transform duration-500 group-hover:scale-110">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 border-t border-gray-50">
                      {/* Category */}
                      {item.category && (
                        <span className="text-xs font-semibold text-[#1D70B8] uppercase tracking-wider mb-1 block">
                          {item.category.name}
                        </span>
                      )}

                      {/* Name */}
                      <h3 className="text-sm font-bold text-gray-900 mb-3 group-hover:text-[#1D70B8] transition-colors line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">{item.price.toLocaleString()} F</span>
                        {item.comparePrice && item.comparePrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">{item.comparePrice.toLocaleString()} F</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
