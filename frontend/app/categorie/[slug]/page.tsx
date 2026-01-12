'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Product, Category } from '@/types/api';
import {
  Filter,
  Grid3X3,
  LayoutList,
  ChevronDown,
  ShoppingCart,
  Monitor,
  FileText,
  Shield,
  Server,
  Palette,
  PenTool,
  Check,
  Zap,
  Award,
  Loader2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Map des icônes par slug/nom de catégorie
const categoryIcons: { [key: string]: any } = {
  'windows': Monitor,
  'systemes': Monitor,
  'système': Monitor,
  'office': FileText,
  'bureautique': FileText,
  'antivirus': Shield,
  'sécurité': Shield,
  'serveur': Server,
  'server': Server,
  'adobe': Palette,
  'autodesk': PenTool,
};

const getIconForCategory = (category: Category) => {
  const slug = category.slug?.toLowerCase() || '';
  const name = category.name?.toLowerCase() || '';

  if (categoryIcons[slug]) return categoryIcons[slug];
  if (categoryIcons[name]) return categoryIcons[name];

  // Icônes par défaut basées sur des mots-clés
  if (name.includes('window') || name.includes('système')) return Monitor;
  if (name.includes('office') || name.includes('bureautique')) return FileText;
  if (name.includes('antivirus') || name.includes('sécurité')) return Shield;
  if (name.includes('serveur') || name.includes('server')) return Server;
  if (name.includes('adobe') || name.includes('creative')) return Palette;
  if (name.includes('autodesk') || name.includes('cad')) return PenTool;

  return Monitor; // Icône par défaut
};

const getCategoryColor = (category: Category) => {
  const slug = category.slug?.toLowerCase() || '';
  const name = category.name?.toLowerCase() || '';

  if (slug.includes('window') || slug.includes('système') || name.includes('window')) return { main: '#0078D4', light: '#EBF5FF' };
  if (slug.includes('office') || name.includes('office') || name.includes('bureautique')) return { main: '#D83B01', light: '#FFF4EE' };
  if (slug.includes('antivirus') || name.includes('antivirus') || name.includes('sécurité')) return { main: '#059669', light: '#ECFDF5' };
  if (slug.includes('server') || name.includes('serveur')) return { main: '#4F46E5', light: '#EEF2FF' };
  if (slug.includes('adobe') || name.includes('adobe')) return { main: '#DC2626', light: '#FEF2F2' };
  if (slug.includes('autodesk') || name.includes('autodesk')) return { main: '#0891B2', light: '#ECFEFF' };

  return { main: '#1D70B8', light: '#EBF5FF' };
};

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger la catégorie par slug
        const categoryData = await categoriesApi.getBySlug(slug);
        setCategory(categoryData);

        // Charger les produits de cette catégorie
        const productsResponse = await productsApi.getAll({
          categoryId: categoryData.id,
          includeInactive: false,
          limit: 100,
          sort: sortBy,
          order: sortOrder,
        });
        setProducts(productsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Catégorie introuvable');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, sortBy, sortOrder]);

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
                <p className="text-gray-500">Chargement de la catégorie...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-medium mb-4">{error || 'Catégorie introuvable'}</p>
              <Link
                href="/boutique"
                className="inline-block px-6 py-2 bg-[#1D70B8] text-white rounded-xl hover:bg-[#155a96] transition-colors"
              >
                Retour à la boutique
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = getIconForCategory(category);
  const colors = getCategoryColor(category);

  return (
    <main>
      <Header />

      {/* Hero Banner */}
      <section className="relative py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: colors.light }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{ backgroundColor: colors.main, filter: 'blur(150px)', opacity: 0.15 }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: colors.main, filter: 'blur(120px)', opacity: 0.1 }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${colors.main} 1px, transparent 1px), linear-gradient(90deg, ${colors.main} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">Accueil</Link>
            <span className="text-gray-300">/</span>
            <span style={{ color: colors.main }} className="font-medium">{category.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: `${colors.main}15` }}
              >
                <Icon size={16} style={{ color: colors.main }} />
                <span className="text-sm font-semibold" style={{ color: colors.main }}>
                  {products.length} PRODUITS DISPONIBLES
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0D3A5C] mb-6 leading-tight">
                {category.name}
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                {category.description || `Découvrez notre sélection de produits ${category.name}`}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3">
                {['Livraison instantanée', 'Licence à vie', 'Support technique'].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${colors.main}15` }}
                    >
                      <Check size={14} style={{ color: colors.main }} />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Main Icon Circle */}
                <div
                  className="w-72 h-72 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    backgroundColor: colors.main,
                    boxShadow: `0 25px 80px -20px ${colors.main}50`
                  }}
                >
                  <Icon size={120} className="text-white" strokeWidth={1.5} />
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Check size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">100% Officiel</p>
                      <p className="text-xs text-gray-500">Licences authentiques</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Zap size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Livraison instantanée</p>
                      <p className="text-xs text-gray-500">Par email en 5 min</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-16 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Award size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Support 24/7</p>
                      <p className="text-xs text-gray-500">Assistance technique</p>
                    </div>
                  </div>
                </div>

                {/* Decorative circles */}
                <div
                  className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 opacity-20"
                  style={{ borderColor: colors.main }}
                />
                <div
                  className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 opacity-10"
                  style={{ borderColor: colors.main }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors">
                  <Filter size={18} />
                  <span>Filtres</span>
                </button>
                <p className="text-gray-500">
                  <span className="font-bold text-gray-900">{products.length}</span> produit(s)
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={getSortValue()}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-10 bg-gray-100 rounded-xl text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#1D70B8]/20 cursor-pointer"
                  >
                    <option value="popular">Plus récents</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name">Nom (A-Z)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1D70B8]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1D70B8]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutList size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {products.map((product) => {
                const discount = calculateDiscount(product.price, product.comparePrice);

                return viewMode === 'grid' ? (
                  /* Grid View */
                  <Link
                    href={`/produit/${product.id}`}
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 flex items-center justify-center p-6 bg-gray-50">
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                            -{discount}%
                          </span>
                        </div>
                      )}

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
                      <span className="text-xs font-semibold text-[#1D70B8] uppercase tracking-wider">
                        {category.name}
                      </span>

                      {/* Name */}
                      <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#1D70B8] transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      {product.shortDesc && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.shortDesc}</p>
                      )}

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
                          disabled={product.stockQuantity <= 0}
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                            product.stockQuantity <= 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : addedProductId === product.id
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
                      {product.stockQuantity <= 0 && (
                        <p className="text-xs text-red-500 mt-2 font-medium">Rupture de stock</p>
                      )}
                    </div>
                  </Link>
                ) : (
                  /* List View */
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex"
                  >
                    {/* Image */}
                    <div className="relative w-56 flex-shrink-0 bg-gray-50">
                      {discount > 0 && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                            -{discount}%
                          </span>
                        </div>
                      )}

                      <div className="h-full flex items-center justify-center p-6">
                        <div className="relative w-32 h-32">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <span className="text-xs font-semibold text-[#1D70B8] uppercase tracking-wider">
                        {category.name}
                      </span>

                      <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#1D70B8] transition-colors">
                        {product.name}
                      </h3>

                      {product.shortDesc && (
                        <p className="text-sm text-gray-600 mb-3">{product.shortDesc}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} F</span>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">{product.comparePrice.toLocaleString()} F</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stockQuantity <= 0}
                          className={`px-6 py-3 font-semibold rounded-xl transition-colors flex items-center gap-2 ${
                            product.stockQuantity <= 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : addedProductId === product.id
                              ? 'bg-green-500 text-white'
                              : 'bg-[#1D70B8] hover:bg-[#0D3A5C] text-white'
                          }`}
                        >
                          {addedProductId === product.id ? (
                            <>
                              <Check size={18} />
                              Ajouté !
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={18} />
                              {product.stockQuantity <= 0 ? 'Rupture' : 'Ajouter au panier'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Cette catégorie ne contient pas encore de produits. Découvrez nos autres catégories.
              </p>
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#0D3A5C] transition-colors"
              >
                Retour à la boutique
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
