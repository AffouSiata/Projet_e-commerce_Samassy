'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Monitor, FileText, Shield, Server, Palette, PenTool, ArrowRight, LayoutGrid, Loader2, LucideIcon } from 'lucide-react';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/types/api';

// Mapping des icônes et couleurs par slug de catégorie
const categoryStyles: Record<string, { icon: LucideIcon; color: string; lightColor: string }> = {
  'windows': { icon: Monitor, color: '#0078D4', lightColor: '#EBF5FF' },
  'systemes': { icon: Monitor, color: '#0078D4', lightColor: '#EBF5FF' },
  'office': { icon: FileText, color: '#D83B01', lightColor: '#FFF4EE' },
  'bureautique': { icon: FileText, color: '#D83B01', lightColor: '#FFF4EE' },
  'antivirus': { icon: Shield, color: '#059669', lightColor: '#ECFDF5' },
  'windows-server': { icon: Server, color: '#4F46E5', lightColor: '#EEF2FF' },
  'serveur': { icon: Server, color: '#4F46E5', lightColor: '#EEF2FF' },
  'adobe': { icon: Palette, color: '#DC2626', lightColor: '#FEF2F2' },
  'autodesk': { icon: PenTool, color: '#0891B2', lightColor: '#ECFEFF' },
};

// Style par défaut
const defaultStyle = { icon: LayoutGrid, color: '#1D70B8', lightColor: '#EBF5FF' };

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll({
          includeInactive: false,
          limit: 6,
        });
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-14 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-center py-12">
            <Loader2 size={40} className="text-[#1D70B8] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;
  return (
    <section className="py-14 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D70B8]/10 rounded-full mb-6">
            <LayoutGrid size={16} className="text-[#1D70B8]" />
            <span className="text-sm font-semibold text-[#1D70B8]">
              EXPLOREZ NOS LOGICIELS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A5C] mb-4">
            Nos Catégories
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explorez nos licences par catégorie et trouvez ce qu'il vous faut
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const style = categoryStyles[category.slug] || defaultStyle;
            const Icon = style.icon;
            return (
              <div
                key={category.id}
                className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1 border border-gray-100 hover:border-gray-200"
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: style.lightColor }}
                >
                  <Icon size={26} style={{ color: style.color }} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  {category.description || `Découvrez nos licences ${category.name}`}
                </p>

                {/* Button */}
                <Link
                  href={`/categorie/${category.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:gap-3"
                  style={{
                    backgroundColor: style.lightColor,
                    color: style.color
                  }}
                >
                  Découvrir
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
