'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaPlay, FaStop } from 'react-icons/fa';

interface SiteConfig {
  liveStreamUrl: string;
  liveStreamActive: boolean;
}

export default function AdminLivePage() {
  const [liveStreamUrl, setLiveStreamUrl] = useState('');
  const [liveStreamActive, setLiveStreamActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/site-config');
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero della configurazione');
        }
        
        const config = await response.json();
        
        setLiveStreamUrl(config.liveStreamUrl || '');
        setLiveStreamActive(config.liveStreamActive || false);
      } catch (error) {
        console.error('Errore:', error);
        toast.error('Errore durante il recupero della configurazione');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          liveStreamUrl,
          liveStreamActive,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante il salvataggio della configurazione');
      }
      
      toast.success('Configurazione salvata con successo');
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante il salvataggio della configurazione');
    } finally {
      setIsSaving(false);
    }
  };

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

  const isValidYoutubeUrl = liveStreamUrl && getYoutubeEmbedUrl(liveStreamUrl);
  const embedUrl = isValidYoutubeUrl ? getYoutubeEmbedUrl(liveStreamUrl) : '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestione Live Streaming</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Configurazione Streaming</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="liveStreamUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL YouTube
              </label>
              <input
                id="liveStreamUrl"
                type="text"
                value={liveStreamUrl}
                onChange={(e) => setLiveStreamUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {liveStreamUrl && !isValidYoutubeUrl && (
                <p className="mt-1 text-sm text-red-500">
                  URL YouTube non valido
                </p>
              )}
            </div>
            
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setLiveStreamActive(!liveStreamActive)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  liveStreamActive ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    liveStreamActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {liveStreamActive ? 'Streaming attivo' : 'Streaming disattivato'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setLiveStreamActive(true)}
                disabled={!isValidYoutubeUrl || liveStreamActive || isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlay className="mr-2" /> Attiva
              </button>
              
              <button
                type="button"
                onClick={() => setLiveStreamActive(false)}
                disabled={!liveStreamActive || isSaving}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaStop className="mr-2" /> Disattiva
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="mr-2" />
                {isSaving ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Anteprima</h2>
          
          {embedUrl ? (
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg border border-gray-200">
              <iframe
                src={embedUrl}
                title="YouTube Video Preview"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-gray-500">
                Inserisci un URL YouTube valido per visualizzare l'anteprima
              </p>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Stato pubblico:</h3>
            <div className={`flex items-center ${liveStreamActive ? 'text-green-600' : 'text-gray-500'}`}>
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${liveStreamActive ? 'bg-green-600' : 'bg-gray-500'}`}></span>
              <span>{liveStreamActive ? 'Streaming visibile al pubblico' : 'Streaming non visibile'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 