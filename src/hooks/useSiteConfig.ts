'use client';

import { useState, useEffect } from 'react';

interface SiteConfig {
  siteName?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  homeTitle?: string;
  homeDescription?: string;
  homeImage?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutImage?: string;
  address?: string;
  email?: string;
  phone?: string;
  mapCoordinates?: [number, number];
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string | null;
  liveStreamUrl?: string | null;
  liveStreamActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/site-config', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero della configurazione');
        }
        
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Errore:', error);
        setError('Si è verificato un errore durante il caricamento della configurazione');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Funzione per aggiornare la configurazione (da usare solo nell'area admin)
  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(newConfig),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante l\'aggiornamento della configurazione');
      }
      
      const data = await response.json();
      setConfig(data);
      return { success: true };
    } catch (error) {
      console.error('Errore:', error);
      setError('Si è verificato un errore durante l\'aggiornamento della configurazione');
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    } finally {
      setIsLoading(false);
    }
  };

  return { config, isLoading, error, updateConfig };
} 