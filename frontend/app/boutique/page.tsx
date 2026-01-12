'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Product, Category } from '@/types/api';
import {
  ShoppingCart,
  Star,
  Check,
  Filter,
  Grid3X3,
  LayoutList,
  ChevronRight,
  Search,
  X,
  Loader2
} from 'lucide-react';

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'name' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Charger les produits et catégories au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les catégories et produits en parallèle
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsApi.getAll({
            includeInactive: false,
            limit: 100,
            sort: sortBy === 'popular' ? 'createdAt' : sortBy,
            order: sortOrder,
            q: searchQuery || undefined,
            categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          }),
          categoriesApi.getAll({
            includeInactive: false,
            limit: 50,
          }),
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, sortBy, sortOrder, searchQuery]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1500);
    } catch (err) {
      // Error handled silently - cart context will handle display
    }
  };

  const handleSortChange = (value: string) => {
    switch (value) {
      case 'price-asc':
        setSortBy('price');
        setSortOrder('asc');
        break;
      case 'price-desc':
        setSortBy('price');
        setSortOrder('desc');
        break;
      case 'name':
        setSortBy('name');
        setSortOrder('asc');
        break;
      case 'popular':
      default:
        setSortBy('createdAt');
        setSortOrder('desc');
        break;
    }
  };

  const getSortValue = () => {
    if (sortBy === 'price' && sortOrder === 'asc') return 'price-asc';
    if (sortBy === 'price' && sortOrder === 'desc') return 'price-desc';
    if (sortBy === 'name') return 'name';
    return 'popular';
  };

  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round((1 - price / comparePrice) * 100);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <Loader2 size={48} className="text-[#1D70B8] animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Chargement des produits...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#1D70B8] text-white rounded-xl hover:bg-[#155a96] transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-[#1D70B8]">Accueil</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-[#1D70B8] font-medium">Boutique</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0D3A5C] mb-2">Boutique</h1>
            <p className="text-gray-500">Découvrez toutes nos licences logicielles à prix réduit</p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl shadow-premium p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D70B8]/20 focus:border-[#1D70B8]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={getSortValue()}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D70B8]/20 focus:border-[#1D70B8]"
                >
                  <option value="popular">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name">Nom (A-Z)</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#1D70B8] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#1D70B8] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LayoutList size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Categories */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-premium p-6 sticky top-32">
                <h3 className="font-bold text-[#0D3A5C] mb-4">Catégories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#1D70B8] text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tous les produits
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-[#1D70B8] text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1">
              {/* Results count */}
              <p className="text-gray-500 mb-4">
                {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
              </p>

              {products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-premium p-12 text-center">
                  <p className="text-gray-500">Aucun produit trouvé</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 text-[#1D70B8] hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      href={`/produit/${product.id}`}
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                    >
                      {/* Image */}
                      <div className="relative h-56 flex items-center justify-center p-6 bg-gray-50">
                        {product.comparePrice && product.comparePrice > product.price && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                              -{calculateDiscount(product.price, product.comparePrice)}%
                            </span>
                          </div>
                        )}
                        <div className="relative w-36 h-36 transition-transform duration-500 group-hover:scale-110">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 border-t border-gray-50">
                        {product.category && (
                          <span className="text-xs font-semibold text-[#1D70B8] uppercase tracking-wider">
                            {product.category.name}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#1D70B8] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        {product.shortDesc && (
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.shortDesc}</p>
                        )}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-baseline gap-2">
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
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                              product.stockQuantity <= 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : addedProductId === product.id
                                ? 'bg-green-500 text-white'
                                : 'bg-[#1D70B8] hover:bg-[#155a96] text-white'
                            }`}
                          >
                            {addedProductId === product.id ? <Check size={18} /> : <ShoppingCart size={18} />}
                          </button>
                        </div>
                        {product.stockQuantity <= 0 && (
                          <p className="text-xs text-red-500 mt-2 font-medium">Rupture de stock</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <Link
                      href={`/produit/${product.id}`}
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 flex"
                    >
                      {/* Image */}
                      <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center p-4 bg-gray-50">
                        {product.comparePrice && product.comparePrice > product.price && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-flex items-center px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                              -{calculateDiscount(product.price, product.comparePrice)}%
                            </span>
                          </div>
                        )}
                        <div className="relative w-28 h-28 transition-transform duration-500 group-hover:scale-110">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col justify-center">
                        {product.category && (
                          <span className="text-xs font-semibold text-[#1D70B8] uppercase tracking-wider">
                            {product.category.name}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#1D70B8] transition-colors">
                          {product.name}
                        </h3>
                        {product.shortDesc && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDesc}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} F</span>
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
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                              product.stockQuantity <= 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : addedProductId === product.id
                                ? 'bg-green-500 text-white'
                                : 'bg-[#1D70B8] hover:bg-[#155a96] text-white'
                            }`}
                          >
                            {addedProductId === product.id ? (
                              <>
                                <Check size={18} />
                                Ajouté
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={18} />
                                {product.stockQuantity <= 0 ? 'Rupture' : 'Ajouter'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
