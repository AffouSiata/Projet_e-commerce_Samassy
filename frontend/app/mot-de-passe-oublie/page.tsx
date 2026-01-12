'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Email envoyé !
            </h2>

            <p className="text-gray-600 mb-6">
              Nous avons envoyé un lien de réinitialisation à <span className="font-semibold text-[#1D70B8]">{email}</span>
            </p>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                Vérifiez votre boîte de réception et cliquez sur le lien pour créer un nouveau mot de passe.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/connexion"
                className="w-full px-6 py-3 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                Retour à la connexion
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="w-full px-6 py-3 text-gray-600 hover:text-[#1D70B8] font-medium transition-colors"
              >
                Renvoyer l'email
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Vous n'avez pas reçu l'email ? Vérifiez vos spams ou contactez-nous.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex">
      {/* Left Side - Image & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0D3A5C] to-[#1D70B8]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white rounded-full" />
          <div className="absolute top-32 left-32 w-48 h-48 border border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <Link href="/">
              <div className="bg-white rounded-xl p-3 inline-block">
                <Image
                  src="/logo.jpeg"
                  alt="License Sale"
                  width={130}
                  height={50}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Main Content */}
          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Récupération de <span className="text-[#E63946]">mot de passe</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Pas de panique ! Nous allons vous envoyer un lien pour créer un nouveau mot de passe sécurisé.
            </p>
          </div>

          {/* Footer */}
          <div className="text-white/50 text-sm">
            © 2024 License Sale. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <Image
                src="/logo.jpeg"
                alt="License Sale"
                width={130}
                height={50}
                className="object-contain mx-auto"
              />
            </Link>
          </div>

          {/* Back Link */}
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1D70B8] mb-6 transition-colors"
          >
            <ChevronLeft size={18} />
            Retour à la connexion
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0D3A5C] mb-2">
              Mot de passe oublié ?
            </h2>
            <p className="text-gray-500">
              Entrez votre email et nous vous enverrons un lien de réinitialisation
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 pl-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#1D70B8] focus:ring-4 focus:ring-[#1D70B8]/10 transition-all duration-300"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] hover:from-[#0D3A5C] hover:to-[#1558A0] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer le lien
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Astuce :</span> Vérifiez aussi votre dossier spam si vous ne recevez pas l'email dans les prochaines minutes.
            </p>
          </div>

          {/* Sign up link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-[#1D70B8] hover:text-[#0D3A5C] font-semibold transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
