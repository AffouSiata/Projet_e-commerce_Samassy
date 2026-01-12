'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { authApi } from '@/lib/api';
import type { Admin } from '@/types/api';

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email
        });
      } catch (err) {
        router.push('/connexion');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Note: L'API ne supporte pas encore la modification du profil
    // Simuler une sauvegarde pour l'instant
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <Loader2 size={48} className="text-[#1D70B8] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            href="/compte"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            Retour au tableau de bord
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <User size={32} />
                Mon Profil
              </h1>
              <p className="text-white/80">
                Gérez vos informations personnelles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fadeInUp">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-green-800">Profil mis à jour !</h4>
              <p className="text-sm text-green-600">Vos informations ont été sauvegardées avec succès</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-premium p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {user.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                <div className="px-4 py-2 bg-blue-50 text-[#1D70B8] rounded-lg text-sm font-semibold inline-block">
                  Membre
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Mail size={14} className="text-[#1D70B8]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium text-gray-800">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                      <User size={14} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Nom complet</div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Info Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-[#1D70B8] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#1D70B8] mb-1">Modification du profil bientôt disponible</h4>
                <p className="text-sm text-gray-600">
                  La fonctionnalité de modification des informations personnelles sera disponible prochainement.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Informations personnelles</h2>
              </div>

              <div className="space-y-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none opacity-75 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none opacity-75 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
