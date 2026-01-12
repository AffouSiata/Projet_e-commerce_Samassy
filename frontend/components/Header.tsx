'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, ChevronDown, User, Heart, Phone, Mail, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import CartModal from './CartModal';
import { useCart } from '@/context/CartContext';

// Produits par catégorie pour le menu
const categoryProducts: { [key: string]: { id: number; name: string; price: number; originalPrice: number; image: string; rating: number }[] } = {
  "SYSTÈMES D'EXPLOITATION": [
    { id: 1, name: 'Windows 11 Professionnel', price: 45000, originalPrice: 75000, image: '/products/windows-11-pro.jpg', rating: 4.9 },
    { id: 2, name: 'Windows 11 Famille', price: 35000, originalPrice: 55000, image: '/products/windows-11-pro.jpg', rating: 4.8 },
    { id: 4, name: 'Windows 10 Professionnel', price: 25000, originalPrice: 45000, image: '/products/windows-10-pro.jpg', rating: 4.9 },
    { id: 5, name: 'Windows 10 Famille', price: 20000, originalPrice: 35000, image: '/products/windows-10-pro.jpg', rating: 4.7 },
    { id: 3, name: 'Windows 11 Entreprise', price: 65000, originalPrice: 95000, image: '/products/windows-11-pro.jpg', rating: 4.9 },
    { id: 6, name: 'Windows 10 Entreprise', price: 55000, originalPrice: 85000, image: '/products/windows-10-pro.jpg', rating: 4.8 },
  ],
  "OFFICE": [
    { id: 9, name: 'Office 2024 Pro Plus', price: 65000, originalPrice: 95000, image: '/products/office-2024-pro.webp', rating: 4.9 },
    { id: 10, name: 'Office 2024 Famille', price: 55000, originalPrice: 80000, image: '/products/office-2024-pro.webp', rating: 4.8 },
    { id: 11, name: 'Office 2021 Pro Plus', price: 45000, originalPrice: 75000, image: '/products/office-2021-pro.jpg', rating: 4.8 },
    { id: 12, name: 'Office 2021 Famille', price: 35000, originalPrice: 55000, image: '/products/office-2021-pro.jpg', rating: 4.7 },
    { id: 15, name: 'Microsoft 365 Famille', price: 40000, originalPrice: 55000, image: '/products/office-standard.png', rating: 4.8 },
    { id: 16, name: 'Microsoft 365 Personnel', price: 30000, originalPrice: 45000, image: '/products/office-standard.png', rating: 4.7 },
  ],
  "ANTIVIRUS": [
    { id: 17, name: 'Norton 360 Deluxe', price: 25000, originalPrice: 40000, image: '/products/norton-360.jpg', rating: 4.6 },
    { id: 18, name: 'Norton 360 Premium', price: 35000, originalPrice: 55000, image: '/products/norton-360.jpg', rating: 4.8 },
    { id: 19, name: 'Kaspersky Total Security', price: 30000, originalPrice: 45000, image: '/products/norton-360.jpg', rating: 4.8 },
    { id: 21, name: 'Bitdefender Total Security', price: 28000, originalPrice: 42000, image: '/products/norton-360.jpg', rating: 4.7 },
    { id: 23, name: 'McAfee Total Protection', price: 22000, originalPrice: 35000, image: '/products/norton-360.jpg', rating: 4.5 },
    { id: 24, name: 'McAfee LiveSafe', price: 32000, originalPrice: 50000, image: '/products/norton-360.jpg', rating: 4.6 },
  ],
  "WINDOWS SERVER": [
    { id: 25, name: 'Windows Server 2022 Standard', price: 180000, originalPrice: 250000, image: '/products/windows-server-2022.jpg', rating: 4.9 },
    { id: 26, name: 'Windows Server 2022 Datacenter', price: 350000, originalPrice: 450000, image: '/products/windows-server-2022.jpg', rating: 4.9 },
    { id: 27, name: 'Windows Server 2022 Essentials', price: 120000, originalPrice: 180000, image: '/products/windows-server-2022.jpg', rating: 4.8 },
    { id: 28, name: 'Windows Server 2019 Standard', price: 150000, originalPrice: 200000, image: '/products/windows-server-2022.jpg', rating: 4.8 },
    { id: 29, name: 'Windows Server 2019 Datacenter', price: 280000, originalPrice: 380000, image: '/products/windows-server-2022.jpg', rating: 4.9 },
    { id: 31, name: 'Windows Server 2016 Standard', price: 120000, originalPrice: 170000, image: '/products/windows-server-2022.jpg', rating: 4.7 },
  ],
  "AUTODESK": [
    { id: 41, name: 'AutoCAD 2024', price: 120000, originalPrice: 180000, image: '/products/autocad.jpg', rating: 4.9 },
    { id: 42, name: 'AutoCAD LT 2024', price: 75000, originalPrice: 110000, image: '/products/autocad.jpg', rating: 4.8 },
    { id: 43, name: 'Autodesk Revit 2024', price: 150000, originalPrice: 200000, image: '/products/autocad.jpg', rating: 4.8 },
    { id: 44, name: 'Autodesk 3ds Max 2024', price: 130000, originalPrice: 170000, image: '/products/autocad.jpg', rating: 4.8 },
    { id: 45, name: 'Autodesk Maya 2024', price: 140000, originalPrice: 185000, image: '/products/autocad.jpg', rating: 4.9 },
    { id: 47, name: 'Autodesk Fusion 360', price: 85000, originalPrice: 120000, image: '/products/autocad.jpg', rating: 4.7 },
  ],
  "ADOBE": [
    { id: 33, name: 'Adobe Creative Cloud', price: 85000, originalPrice: 120000, image: '/products/adobe-acrobat.jpg', rating: 4.9 },
    { id: 34, name: 'Adobe Photoshop', price: 45000, originalPrice: 65000, image: '/products/adobe-acrobat.jpg', rating: 4.9 },
    { id: 35, name: 'Adobe Illustrator', price: 45000, originalPrice: 65000, image: '/products/adobe-acrobat.jpg', rating: 4.8 },
    { id: 36, name: 'Adobe Premiere Pro', price: 50000, originalPrice: 70000, image: '/products/adobe-acrobat.jpg', rating: 4.8 },
    { id: 38, name: 'Adobe Acrobat Pro', price: 35000, originalPrice: 50000, image: '/products/adobe-acrobat.jpg', rating: 4.7 },
    { id: 39, name: 'Adobe Lightroom', price: 30000, originalPrice: 45000, image: '/products/adobe-acrobat.jpg', rating: 4.8 },
  ],
};

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('Français');
  const [currency, setCurrency] = useState('XOF Fr');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  const categories = [
    { name: "SYSTÈMES D'EXPLOITATION", link: '/categorie/systemes' },
    { name: 'OFFICE', link: '/categorie/office' },
    { name: 'ANTIVIRUS', link: '/categorie/antivirus' },
    { name: 'WINDOWS SERVER', link: '/categorie/windows-server' },
    { name: 'AUTODESK', link: '/categorie/autodesk' },
    { name: 'ADOBE', link: '/categorie/adobe' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar - Elegant & Modern */}
      <div className={`bg-gradient-to-r from-[#1D70B8] via-[#1558A0] to-[#1D70B8] transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0 opacity-0 py-0 overflow-hidden' : 'max-h-20 opacity-100'} relative z-[60]`}>
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between text-white">
            {/* Left - Contact Info */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                <Phone size={14} />
                <span className="font-medium">+225 07 78 88 85 62</span>
              </div>
              <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                <Mail size={14} />
                <span className="font-medium">sam_building@outlook.fr</span>
              </div>
            </div>

            {/* Center - Promo Text */}
            <div className="hidden lg:block text-center">
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF6600] rounded-full animate-pulse"></span>
                Livraison instantanée par email • Support 24/7
                <span className="w-2 h-2 bg-[#FF6600] rounded-full animate-pulse"></span>
              </p>
            </div>

            {/* Right - Language & Currency */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLangMenu(!showLangMenu);
                    setShowCurrencyMenu(false);
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Globe size={14} />
                  {language} <ChevronDown size={12} />
                </button>
                {showLangMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-[70]"
                      onClick={() => setShowLangMenu(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-lg overflow-hidden z-[80] min-w-[130px]">
                      <button
                        onClick={() => {
                          setLanguage('Français');
                          setShowLangMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1D70B8] hover:text-white transition-all text-left"
                      >
                        Français
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('English');
                          setShowLangMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1D70B8] hover:text-white transition-all text-left"
                      >
                        English
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCurrencyMenu(!showCurrencyMenu);
                    setShowLangMenu(false);
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
                >
                  {currency} <ChevronDown size={12} />
                </button>
                {showCurrencyMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-[70]"
                      onClick={() => setShowCurrencyMenu(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-lg overflow-hidden z-[80] min-w-[110px]">
                      <button
                        onClick={() => {
                          setCurrency('EUR €');
                          setShowCurrencyMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1D70B8] hover:text-white transition-all text-left"
                      >
                        EUR €
                      </button>
                      <button
                        onClick={() => {
                          setCurrency('USD $');
                          setShowCurrencyMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1D70B8] hover:text-white transition-all text-left"
                      >
                        USD $
                      </button>
                      <button
                        onClick={() => {
                          setCurrency('XOF Fr');
                          setShowCurrencyMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#1D70B8] hover:text-white transition-all text-left"
                      >
                        XOF Fr
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header + NavBar Container - Sticky on scroll */}
      <div className={`transition-all duration-500 ease-in-out bg-white ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-2xl' : 'shadow-md'}`}>
        {/* Main Header */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between gap-8">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/logo.jpeg"
                  alt="License Sale"
                  width={140}
                  height={52}
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherchez vos logiciels préférés..."
                    className="w-full pl-5 pr-14 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-full text-sm outline-none focus:border-[#1D70B8] focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                  />
                  <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] hover:from-[#3B9DE8] hover:to-[#1D70B8] rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg">
                    <Search size={18} className="text-white" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* User Account */}
                <Link
                  href="/connexion"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-gray-50 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <User size={18} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs text-gray-500">Mon Compte</p>
                    <p className="text-sm font-bold text-gray-800">Connexion</p>
                  </div>
                </Link>

                {/* Wishlist */}
                <button className="relative p-2.5 hover:bg-gray-50 rounded-full transition-all duration-300 group">
                  <Heart size={22} className="text-gray-600 group-hover:text-[#E63946] transition-colors" strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E63946] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </button>

                {/* Cart */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 hover:bg-gray-50 rounded-full transition-all duration-300 group"
                >
                  <ShoppingCart size={22} className="text-gray-600 group-hover:text-[#1D70B8] transition-colors" strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Elegant Categories */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center justify-between">
              {/* Categories Menu */}
              <div className="flex items-center gap-1">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="relative group"
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link
                      href={category.link}
                      className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-all duration-300 ${
                        hoveredCategory === category.name
                          ? 'text-[#1D70B8] bg-gradient-to-b from-blue-50 to-transparent'
                          : 'text-gray-700 hover:text-[#1D70B8]'
                      }`}
                    >
                      <span>{category.name}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${hoveredCategory === category.name ? 'rotate-180' : ''}`}
                      />
                    </Link>

                    {/* Mega Dropdown Menu */}
                    {hoveredCategory === category.name && categoryProducts[category.name] && (
                      <div
                        className="absolute top-full left-0 mt-0 w-[280px] bg-white rounded-b-2xl shadow-2xl z-50 border border-gray-100 border-t-0 overflow-hidden"
                        onMouseEnter={() => setHoveredCategory(category.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <div className="py-3 px-2 max-h-[400px] overflow-y-auto">
                          {categoryProducts[category.name].map((product) => (
                            <Link
                              key={product.id}
                              href={`/produit/${product.id}`}
                              className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group/item"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800 group-hover/item:text-[#1D70B8] mb-1">
                                  {product.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#1D70B8]">
                                    {product.price.toLocaleString()} Fr
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    {product.originalPrice.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <div className="w-7 h-7 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-full flex items-center justify-center">
                                  <ChevronDown size={14} className="text-white -rotate-90" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] px-4 py-3">
                          <Link
                            href={category.link}
                            className="flex items-center justify-center gap-2 text-white font-semibold text-sm hover:gap-3 transition-all"
                          >
                            Voir tous les produits
                            <ChevronDown size={14} className="-rotate-90" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="flex items-center gap-6">
                <Link href="/a-propos" className="text-sm font-semibold text-gray-700 hover:text-[#1D70B8] transition-colors py-4">
                  À propos
                </Link>
                <Link href="/contact" className="text-sm font-semibold text-gray-700 hover:text-[#1D70B8] transition-colors py-4">
                  Contact
                </Link>
                <Link href="/faq" className="text-sm font-semibold text-gray-700 hover:text-[#1D70B8] transition-colors py-4">
                  FAQ
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer when header becomes fixed */}
      {isScrolled && <div className="h-[145px]"></div>}

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
