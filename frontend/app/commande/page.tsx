'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, CheckCircle, User, Mail, CreditCard, MessageCircle, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { ordersApi } from '@/lib/api';

export default function CommandePage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart, refreshCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'orange',
    isEnterprise: false,
    companyName: '',
    licenseQuantity: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Créer la commande via l'API
      const order = await ordersApi.create({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        metadata: {
          paymentMethod: formData.paymentMethod,
          isEnterprise: formData.isEnterprise,
          companyName: formData.companyName || undefined,
          licenseQuantity: formData.licenseQuantity || undefined,
          message: formData.message || undefined,
        }
      });

      setOrderNumber(order.orderNumber);

      // Si l'API retourne un URL WhatsApp, l'ouvrir
      if (order.whatsappUrl) {
        window.open(order.whatsappUrl, '_blank');
      }

      // Le panier est vidé automatiquement par l'API
      await refreshCart();
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link href="/" className="text-gray-500 hover:text-[#1D70B8]">Accueil</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1D70B8] font-medium">Commande</span>
            </nav>

            {/* Empty Cart */}
            <div className="bg-white rounded-3xl shadow-premium p-12 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag size={60} className="text-gray-300" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Ajoutez des produits à votre panier avant de passer commande.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1D70B8] to-[#1558A0] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                <ArrowLeft size={20} />
                Voir les produits
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-8 pb-16">
          <div className="max-w-2xl mx-auto px-4">
            {/* Success Message */}
            <div className="bg-white rounded-3xl shadow-premium p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={50} className="text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande envoyée !</h1>
              {orderNumber && (
                <p className="text-xl font-semibold text-[#1D70B8] mb-4">
                  Numéro de commande : {orderNumber}
                </p>
              )}
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Votre commande a été enregistrée avec succès. Nous vous contacterons dans les plus brefs délais pour confirmer votre commande et procéder au paiement.
              </p>
              <div className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1D70B8] to-[#1558A0] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Retour à l'accueil
                </Link>
                <p className="text-sm text-gray-500">
                  Un message WhatsApp a été ouvert pour confirmer votre commande.
                </p>
              </div>
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
            <Link href="/panier" className="text-gray-500 hover:text-[#1D70B8]">Panier</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1D70B8] font-medium">Commande</span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#1D70B8]/10 rounded-2xl flex items-center justify-center">
              <CreditCard size={28} className="text-[#1D70B8]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0D3A5C]">Finaliser la commande</h1>
              <p className="text-gray-500">{totalItems} article(s) - {totalPrice.toLocaleString()} F</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-premium p-6">
                  <h2 className="text-lg font-bold text-[#0D3A5C] mb-6 flex items-center gap-3">
                    <User size={22} className="text-[#1D70B8]" />
                    Informations personnelles
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-premium p-6">
                  <h2 className="text-lg font-bold text-[#0D3A5C] mb-6 flex items-center gap-3">
                    <Mail size={22} className="text-[#1D70B8]" />
                    Contact
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Numéro WhatsApp *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-200 rounded-l-xl bg-green-50 text-green-600 text-sm font-medium">
                          <MessageCircle size={16} className="mr-2" />
                          +225
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all"
                          placeholder="07 XX XX XX XX"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enterprise Option */}
                <div className="bg-white rounded-2xl shadow-premium p-6">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isEnterprise"
                      checked={formData.isEnterprise}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#1D70B8] border-gray-300 rounded focus:ring-[#1D70B8]"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1D70B8]/10 rounded-xl flex items-center justify-center">
                        <Building2 size={20} className="text-[#1D70B8]" />
                      </div>
                      <div>
                        <span className="font-bold text-[#0D3A5C]">Je suis une entreprise</span>
                        <p className="text-sm text-gray-500">Commande en volume avec devis personnalisé</p>
                      </div>
                    </div>
                  </label>

                  {/* Enterprise Fields */}
                  {formData.isEnterprise && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise *</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required={formData.isEnterprise}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all"
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantité de licences souhaitées *</label>
                        <select
                          name="licenseQuantity"
                          value={formData.licenseQuantity}
                          onChange={handleInputChange}
                          required={formData.isEnterprise}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all"
                        >
                          <option value="">Sélectionnez une quantité</option>
                          <option value="5-10">5 à 10 licences</option>
                          <option value="11-25">11 à 25 licences</option>
                          <option value="26-50">26 à 50 licences</option>
                          <option value="51-100">51 à 100 licences</option>
                          <option value="100+">Plus de 100 licences</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message / Besoins spécifiques</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all resize-none"
                          placeholder="Décrivez vos besoins, questions ou demandes particulières..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-premium p-6">
                  <h2 className="text-lg font-bold text-[#0D3A5C] mb-6 flex items-center gap-3">
                    <CreditCard size={22} className="text-[#1D70B8]" />
                    Mode de paiement
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'orange', name: 'Orange Money', color: 'bg-orange-500' },
                      { id: 'paypal', name: 'PayPal', color: 'bg-blue-600' },
                      { id: 'visa', name: 'Visa', color: 'bg-indigo-900' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? 'border-[#1D70B8] bg-[#1D70B8]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-12 h-12 ${method.color} rounded-full mb-2`}></div>
                        <span className="text-sm font-medium text-gray-700">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#1D70B8] to-[#1558A0] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={20} />
                      Commander via WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-premium p-6 sticky top-32">
                <h2 className="text-xl font-bold text-[#0D3A5C] mb-6">Votre commande</h2>

                {/* Items */}
                <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#1D70B8]">
                          {(item.price * item.quantity).toLocaleString()} F
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-semibold">{totalPrice.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison par email</span>
                    <span className="font-semibold text-green-600">Instantanée</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-[#0D3A5C]">Total</span>
                      <span className="text-2xl font-bold text-[#1D70B8]">
                        {totalPrice.toLocaleString()} F
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back to cart */}
                <Link
                  href="/panier"
                  className="w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft size={16} />
                  Modifier le panier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
