'use client';

import { Zap, CreditCard, Headphones, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

const advantages = [
  {
    id: 1,
    icon: Zap,
    title: 'Livraison instantanée',
    description: 'Recevez vos clés par email en quelques minutes après votre achat',
    features: ['Email automatique', 'Téléchargement direct', 'Activation immédiate']
  },
  {
    id: 2,
    icon: CreditCard,
    title: 'Paiement sécurisé',
    description: 'Transactions 100% protégées avec cryptage SSL de bout en bout',
    features: ['Cryptage SSL', 'Données protégées', 'Paiement flexible']
  },
  {
    id: 3,
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Notre équipe technique est disponible pour vous aider à tout moment',
    features: ['Réponse rapide', 'Aide installation', 'WhatsApp & Email']
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: 'Licences authentiques',
    description: 'Garantie de remboursement 30 jours sur toutes nos licences officielles',
    features: ['100% officiel', 'Garantie 30 jours', 'Mises à jour incluses']
  }
];

export default function Advantages() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D70B8]/10 rounded-full mb-6">
            <Sparkles size={16} className="text-[#1D70B8]" />
            <span className="text-sm font-semibold text-[#1D70B8]">
              NOS AVANTAGES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A5C] mb-5">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Une expérience d'achat simple, rapide et sécurisée pour tous vos logiciels
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={advantage.id}
                className="group relative bg-white rounded-3xl p-7 border border-gray-100 hover:border-[#1D70B8]/20 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#1D70B8]/10"
              >
                {/* Decorative gradient blob */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${isEven ? 'bg-[#1D70B8]' : 'bg-[#E63946]'} rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Icon */}
                <div className={`relative w-16 h-16 ${isEven ? 'bg-[#1D70B8]' : 'bg-[#E63946]'} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${isEven ? 'shadow-[#1D70B8]/25' : 'shadow-[#E63946]/25'} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <Icon size={30} className="text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {advantage.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {advantage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className={`w-5 h-5 rounded-full ${isEven ? 'bg-[#1D70B8]' : 'bg-[#E63946]'} flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-10 py-8 px-6 bg-gradient-to-r from-[#1D70B8]/5 via-white to-[#E63946]/5 rounded-2xl border border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1D70B8] rounded-xl flex items-center justify-center shadow-lg shadow-[#1D70B8]/20">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-gray-900">+10 000</p>
                <p className="text-xs text-gray-500">Clients satisfaits</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E63946] rounded-xl flex items-center justify-center shadow-lg shadow-[#E63946]/20">
                <Zap size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-gray-900">5 minutes</p>
                <p className="text-xs text-gray-500">Livraison moyenne</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1D70B8] rounded-xl flex items-center justify-center shadow-lg shadow-[#1D70B8]/20">
                <CreditCard size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500">Paiement sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
