'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Restez informé de nos offres</h3>
              <p className="text-white/80 text-sm">Recevez nos promotions exclusives et nouveautés directement par email</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-[#1D70B8] rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg">
                <Send size={18} />
                <span className="hidden sm:inline">S'abonner</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-3 inline-block mb-5 shadow-lg">
              <Image
                src="/logo.jpeg"
                alt="License Sale"
                width={120}
                height={45}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Votre partenaire de confiance pour l'achat de licences numériques authentiques. Nous garantissons des produits 100% légitimes et un support client réactif.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
              Liens Rapides
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Accueil</Link></li>
              <li><Link href="/boutique" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Boutique</Link></li>
              <li><Link href="/a-propos" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
              Nos Produits
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li><Link href="/categorie/systemes" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Windows</Link></li>
              <li><Link href="/categorie/office" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Microsoft Office</Link></li>
              <li><Link href="/categorie/antivirus" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Antivirus</Link></li>
              <li><Link href="/categorie/adobe" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Adobe Creative</Link></li>
              <li><Link href="/categorie/autodesk" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all">Autodesk</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
              Contactez-nous
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-[#FF6600] to-[#FF8C00] rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-[#1D70B8]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1D70B8]/30 transition-colors">
                  <Phone size={18} className="text-[#3B9DE8]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                  <p className="text-gray-300 text-sm">+225 07 78 88 85 62</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-[#E63946]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#E63946]/30 transition-colors">
                  <Mail size={18} className="text-[#E63946]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-gray-300 text-sm">sam_building@outlook.fr</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-[#FF6600]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6600]/30 transition-colors">
                  <MapPin size={18} className="text-[#FF6600]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Adresse</p>
                  <p className="text-gray-300 text-sm">Abidjan, Côte d'Ivoire</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © 2024 <span className="text-white font-semibold">License Sale</span>. Tous droits réservés.
            </p>

            {/* Payment Badge */}
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs">Paiement via</span>
              <div className="bg-gradient-to-r from-[#FF6600] to-[#FF8C00] rounded-lg px-5 py-2.5 shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-sm">Orange Money</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-5 text-xs">
              <Link href="/cgv" className="text-gray-500 hover:text-white transition-colors">CGV</Link>
              <span className="text-gray-700">•</span>
              <Link href="/mentions-legales" className="text-gray-500 hover:text-white transition-colors">Mentions légales</Link>
              <span className="text-gray-700">•</span>
              <Link href="/confidentialite" className="text-gray-500 hover:text-white transition-colors">Confidentialité</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
