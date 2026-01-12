'use client';

import { useEffect, useState } from 'react';

/**
 * Composant pour "réveiller" l'API Render au chargement de la page
 * Cela réduit le temps d'attente lors de la connexion
 */
export default function ApiWakeUp() {
  const [status, setStatus] = useState<'idle' | 'waking' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const wakeUpApi = async () => {
      try {
        setStatus('waking');
        console.log('🔔 Réveil de l\'API en arrière-plan...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch('https://licences-api.onrender.com/api/health', {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus('ready');
          console.log('✅ API prête !');
        } else {
          setStatus('error');
          console.warn('⚠️ API réveillée mais erreur:', response.status);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn('⏱️ Timeout du réveil de l\'API (normal si cold start)');
        } else {
          console.warn('⚠️ Erreur lors du réveil de l\'API:', error.message);
        }
        setStatus('error');
      }
    };

    // Lancer le wake-up au montage du composant
    wakeUpApi();
  }, []);

  // Ce composant ne rend rien visuellement
  // Son seul but est d'appeler l'API en arrière-plan
  return null;
}
