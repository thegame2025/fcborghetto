'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave } from 'react-icons/fa';
import Image from 'next/image';

interface SiteConfig {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export default function AdminTemaPage() {
  const [siteName, setSiteName] = useState('FC Borghetto');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#1f2937');
  const [secondaryColor, setSecondaryColor] = useState('#ef4444');
  const [accentColor, setAccentColor] = useState('#f59e0b');
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
        
        setSiteName(config.siteName || 'FC Borghetto');
        setLogoPreview(config.logo || null);
        setPrimaryColor(config.primaryColor || '#1f2937');
        setSecondaryColor(config.secondaryColor || '#ef4444');
        setAccentColor(config.accentColor || '#f59e0b');
      } catch (error) {
        console.error('Errore:', error);
        toast.error('Errore durante il recupero della configurazione');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteConfig();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'immagine non può superare i 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogo(result);
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  };

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
          siteName,
          logo,
          primaryColor,
          secondaryColor,
          accentColor,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante il salvataggio della configurazione');
      }
      
      toast.success('Configurazione salvata con successo');
      setLogo(null); // Reset logo after saving
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante il salvataggio della configurazione');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Personalizzazione Tema</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Impostazioni Tema</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome del Sito
              </label>
              <input
                id="siteName"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="FC Borghetto"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className="flex items-center space-x-4">
                {logoPreview && (
                  <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                    <Image 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Colore Primario
                </label>
                <div className="flex">
                  <input
                    type="color"
                    id="primaryColor"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 rounded-l-md border border-gray-300"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Colore Secondario
                </label>
                <div className="flex">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-10 rounded-l-md border border-gray-300"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Colore Accent
                </label>
                <div className="flex">
                  <input
                    type="color"
                    id="accentColor"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-10 rounded-l-md border border-gray-300"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
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
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Intestazione</h3>
              <div 
                className="p-4 rounded-md shadow-sm" 
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center">
                  {logoPreview && (
                    <div className="relative w-8 h-8 mr-2">
                      <Image 
                        src={logoPreview} 
                        alt="Logo" 
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-white font-bold">{siteName}</span>
                  <div className="ml-auto flex space-x-4">
                    <div className="text-white text-sm">Home</div>
                    <div className="text-white text-sm">News</div>
                    <div 
                      className="text-white text-sm border-b-2" 
                      style={{ borderColor: secondaryColor }}
                    >
                      Annate
                    </div>
                    <div className="text-white text-sm">Live</div>
                    <div className="text-white text-sm">Contatti</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bottoni</h3>
              <div className="flex space-x-4">
                <button 
                  className="px-4 py-2 rounded-md text-white" 
                  style={{ backgroundColor: primaryColor }}
                >
                  Primario
                </button>
                <button 
                  className="px-4 py-2 rounded-md text-white" 
                  style={{ backgroundColor: secondaryColor }}
                >
                  Secondario
                </button>
                <button 
                  className="px-4 py-2 rounded-md text-white" 
                  style={{ backgroundColor: accentColor }}
                >
                  Accent
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Card</h3>
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="h-2" 
                  style={{ backgroundColor: secondaryColor }}
                ></div>
                <div className="p-4">
                  <h4 
                    className="text-lg font-semibold mb-2" 
                    style={{ color: primaryColor }}
                  >
                    Titolo Card
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Questo è un esempio di contenuto di una card.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Footer</h3>
              <div 
                className="p-4 rounded-md shadow-sm text-white" 
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-bold">{siteName}</h4>
                    <p className="text-sm opacity-75">© 2023 Tutti i diritti riservati</p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <span style={{ color: secondaryColor }}>F</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <span style={{ color: secondaryColor }}>I</span>
                    </div>
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