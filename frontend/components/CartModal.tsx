'use client';

import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1D70B8]/10 rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} className="text-[#1D70B8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0D3A5C]">Mon Panier</h2>
              <p className="text-sm text-gray-500">{totalItems} article(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Votre panier est vide
              </h3>
              <p className="text-gray-500 mb-8 max-w-xs">
                Parcourez notre catalogue et ajoutez des produits à votre panier.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#1D70B8] hover:bg-[#0D3A5C] text-white font-semibold rounded-xl transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            /* Cart Items */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[#1D70B8] font-bold mt-1">
                      {item.price.toLocaleString()} F
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-white rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                        >
                          <Minus size={14} className="text-gray-500" />
                        </button>
                        <span className="px-3 text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                        >
                          <Plus size={14} className="text-gray-500" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500">Sous-total</span>
              <span className="text-xl font-bold text-[#0D3A5C]">
                {totalPrice.toLocaleString()} F
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/panier"
                onClick={onClose}
                className="w-full px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Voir le panier
              </Link>
              <Link
                href="/commande"
                onClick={onClose}
                className="w-full px-6 py-4 bg-[#1D70B8] hover:bg-[#0D3A5C] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Commander
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
