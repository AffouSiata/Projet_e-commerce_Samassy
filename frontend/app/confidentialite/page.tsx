'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, ChevronRight } from 'lucide-react';

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-[#1D70B8]">Accueil</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-[#1D70B8] font-medium">Politique de Confidentialité</span>
          </nav>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#1D70B8]/10 rounded-2xl flex items-center justify-center">
              <Shield size={28} className="text-[#1D70B8]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0D3A5C]">Politique de Confidentialité</h1>
              <p className="text-gray-500">Protection de vos données personnelles</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-premium p-8 space-y-8">

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                License Sale s'engage à protéger la vie privée de ses utilisateurs. Cette politique
                de confidentialité explique comment nous collectons, utilisons et protégeons vos
                données personnelles lorsque vous utilisez notre site web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Données collectées</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Nous collectons les données suivantes lors de vos commandes :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Nom et prénom</strong> : pour identifier votre commande</li>
                <li><strong>Adresse email</strong> : pour vous envoyer votre licence et les confirmations</li>
                <li><strong>Numéro WhatsApp</strong> : pour la livraison de votre licence et le support client</li>
                <li><strong>Nom d'entreprise</strong> (si applicable) : pour les commandes professionnelles</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Utilisation des données</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Traiter et livrer vos commandes</li>
                <li>Vous envoyer les clés de licence par email et WhatsApp</li>
                <li>Vous contacter en cas de problème avec votre commande</li>
                <li>Répondre à vos demandes de support</li>
                <li>Améliorer nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Protection des données</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données
                personnelles contre tout accès, modification, divulgation ou destruction non autorisés.
                Vos données sont stockées de manière sécurisée et ne sont accessibles qu'aux personnes
                habilitées.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Partage des données</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous ne vendons, n'échangeons ni ne louons vos données personnelles à des tiers.
                Vos données peuvent uniquement être partagées avec :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-3 space-y-2">
                <li>Les prestataires de paiement (Orange Money, PayPal, Visa) pour traiter vos transactions</li>
                <li>Les autorités légales si la loi l'exige</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience de navigation.
                Les cookies sont de petits fichiers stockés sur votre appareil qui nous permettent de :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-3 space-y-2">
                <li>Mémoriser votre panier d'achat</li>
                <li>Analyser le trafic du site</li>
                <li>Améliorer la navigation</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur,
                mais cela peut affecter certaines fonctionnalités du site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Conservation des données</h2>
              <p className="text-gray-600 leading-relaxed">
                Vos données personnelles sont conservées pendant la durée nécessaire à la gestion
                de votre commande et au respect de nos obligations légales. Les données de facturation
                sont conservées conformément à la réglementation fiscale en vigueur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Vos droits</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Conformément à la réglementation en vigueur, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
                <li><strong>Droit de suppression</strong> : demander l'effacement de vos données</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Pour exercer ces droits, contactez-nous à : sam_building@outlook.fr
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Modifications</h2>
              <p className="text-gray-600 leading-relaxed">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
                Les modifications prendront effet dès leur publication sur cette page.
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant cette politique de confidentialité ou vos données
                personnelles, contactez-nous :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-3 space-y-2">
                <li>Par WhatsApp : +225 07 78 88 85 62</li>
                <li>Par email : sam_building@outlook.fr</li>
                <li>Via notre <Link href="/contact" className="text-[#1D70B8] hover:underline">formulaire de contact</Link></li>
              </ul>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
