'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function PanierPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link href="/" className="text-gray-500 hover:text-[#1D70B8]">Accueil</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1D70B8] font-medium">Panier</span>
            </nav>

            {/* Empty Cart */}
            <div className="bg-white rounded-3xl shadow-premium p-12 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart size={60} className="text-gray-300" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Vous n'avez pas encore ajouté de produits à votre panier. Parcourez notre catalogue pour trouver les meilleures licences.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1D70B8] to-[#1558A0] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                <ArrowLeft size={20} />
                Continuer mes achats
              </Link>
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
            <span className="text-gray-300">/</span>
            <span className="text-[#1D70B8] font-medium">Panier</span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1D70B8]/10 rounded-2xl flex items-center justify-center">
                <ShoppingBag size={28} className="text-[#1D70B8]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0D3A5C]">Mon Panier</h1>
                <p className="text-gray-500">{totalItems} article(s)</p>
              </div>
            </div>
            <button
              onClick={clearCart}
              className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Vider le panier
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-premium p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Livraison instantanée par email</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                        >
                          <Minus size={18} className="text-gray-600" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                        >
                          <Plus size={18} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#1D70B8]">
                          {(item.price * item.quantity).toLocaleString()} F
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            {item.price.toLocaleString()} F / unité
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-premium p-6 sticky top-32">
                <h2 className="text-xl font-bold text-[#0D3A5C] mb-6">Récapitulatif</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total ({totalItems} articles)</span>
                    <span className="font-semibold">{totalPrice.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-semibold text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-[#0D3A5C]">Total</span>
                      <span className="text-2xl font-bold text-[#1D70B8]">
                        {totalPrice.toLocaleString()} F
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/commande"
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#1D70B8] to-[#1558A0] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Passer la commande
                  <ArrowRight size={20} />
                </Link>

                <Link
                  href="/"
                  className="w-full mt-4 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Continuer mes achats
                </Link>

                {/* Security badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center mb-3">Paiement 100% sécurisé</p>
                  <div className="flex justify-center gap-2">
                    <div className="px-3 py-1 bg-orange-100 rounded text-xs font-medium text-orange-600">Orange Money</div>
                    <div className="px-3 py-1 bg-blue-100 rounded text-xs font-medium text-blue-600">PayPal</div>
                    <div className="px-3 py-1 bg-indigo-100 rounded text-xs font-medium text-indigo-900">Visa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
