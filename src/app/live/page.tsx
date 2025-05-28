'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig } from '@/lib/utils';
import { FaExclamationTriangle } from 'react-icons/fa';

interface SiteConfig {
  liveStreamUrl: string;
  liveStreamActive: boolean;
}

export default function LivePage() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const config = await getSiteConfig();
        setSiteConfig(config);
      } catch (error) {
        console.error('Errore durante il recupero della configurazione:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteConfig();
  }, []);

  // Funzione per estrarre l'ID del video YouTube dall'URL
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Pattern per estrarre l'ID del video YouTube da vari formati di URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : '';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const isStreamActive = siteConfig?.liveStreamActive && siteConfig?.liveStreamUrl;
  const embedUrl = isStreamActive ? getYoutubeEmbedUrl(siteConfig.liveStreamUrl) : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Diretta Streaming</h1>
      
      {isStreamActive && embedUrl ? (
        <div className="max-w-4xl mx-auto">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
            <iframe
              src={embedUrl}
              title="FC Borghetto Live Stream"
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">Diretta in corso</h2>
            <p className="text-gray-700">
              Benvenuto alla diretta streaming della partita. Buona visione!
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="flex justify-center mb-6">
            <FaExclamationTriangle size={48} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Nessuna diretta in corso</h2>
          <p className="text-gray-600 mb-6">
            Al momento non ci sono partite in diretta streaming.
            <br />
            Torna più tardi o controlla i nostri canali social per gli aggiornamenti sulle prossime partite.
          </p>
        </div>
      )}
    </div>
  );
} 