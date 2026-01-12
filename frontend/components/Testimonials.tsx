'use client';

import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Kouassi Jean-Marc',
    role: 'Entrepreneur',
    location: 'Abidjan, Côte d\'Ivoire',
    rating: 5,
    text: 'Service exceptionnel ! J\'ai reçu ma licence Windows 11 en moins de 5 minutes. L\'activation s\'est faite sans problème. Je recommande vivement License Sale.',
    avatar: '👨🏾‍💼',
    product: 'Windows 11 Pro'
  },
  {
    id: 2,
    name: 'Marie-Claire Kouadio',
    role: 'Graphiste',
    location: 'Yamoussoukro',
    rating: 5,
    text: 'Adobe Photoshop à un prix imbattable ! Le support client a été très réactif pour m\'aider avec l\'installation. Merci beaucoup pour votre professionnalisme.',
    avatar: '👩🏾‍💻',
    product: 'Adobe Photoshop'
  },
  {
    id: 3,
    name: 'Amadou Traoré',
    role: 'Directeur IT',
    location: 'Bouaké',
    rating: 5,
    text: 'J\'ai équipé toute mon entreprise avec leurs licences Office. Prix compétitifs, livraison rapide et licences 100% authentiques. Un partenaire de confiance.',
    avatar: '👨🏿‍💼',
    product: 'Office 2024'
  },
  {
    id: 4,
    name: 'Fatou Diallo',
    role: 'Étudiante',
    location: 'Abidjan',
    rating: 5,
    text: 'Parfait pour les étudiants ! J\'ai obtenu Office 2021 à un excellent prix. Le paiement par Orange Money est très pratique. Merci License Sale !',
    avatar: '👩🏿‍🎓',
    product: 'Office 2021'
  },
  {
    id: 5,
    name: 'Koné Seydou',
    role: 'Architecte',
    location: 'Cocody',
    rating: 5,
    text: 'Excellente expérience ! J\'ai commandé plusieurs licences pour mon bureau. Tout s\'est bien passé, de la commande à l\'activation. Service impeccable.',
    avatar: '👨🏾‍💻',
    product: 'AutoCAD 2024'
  },
  {
    id: 6,
    name: 'Aïcha Bamba',
    role: 'Comptable',
    location: 'San-Pédro',
    rating: 5,
    text: 'Je suis très satisfaite de mon achat. La licence est authentique et fonctionne parfaitement. Le support m\'a aidée avec patience. Bravo !',
    avatar: '👩🏾‍💼',
    product: 'Office 2024'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D70B8]/10 rounded-full mb-6">
            <MessageCircle size={16} className="text-[#1D70B8]" />
            <span className="text-sm font-semibold text-[#1D70B8]">
              TÉMOIGNAGES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A5C] mb-5">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Des milliers de clients satisfaits nous font confiance
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-[#1D70B8]/20 hover:shadow-2xl hover:shadow-[#1D70B8]/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Decorative blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1D70B8] rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500" />

                {/* Quote Icon */}
                <div className="absolute top-6 right-6">
                  <div className="w-10 h-10 bg-[#1D70B8]/10 rounded-xl flex items-center justify-center">
                    <Quote size={20} className="text-[#1D70B8]" />
                  </div>
                </div>

                {/* Product Badge */}
                <div className="inline-block px-3 py-1 bg-[#E63946]/10 text-[#E63946] text-xs font-semibold rounded-full mb-4">
                  {testimonial.product}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                  <div className="w-12 h-12 bg-[#1D70B8] rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prevSlide}
              className="w-11 h-11 bg-gray-100 hover:bg-[#1D70B8] rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <ChevronLeft size={20} className="text-gray-600 group-hover:text-white" />
            </button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-[#1D70B8]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-11 h-11 bg-gray-100 hover:bg-[#1D70B8] rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <ChevronRight size={20} className="text-gray-600 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
