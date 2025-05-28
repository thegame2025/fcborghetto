'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaImage } from 'react-icons/fa';
import Image from 'next/image';

interface SiteConfig {
  homeTitle: string;
  homeDescription: string;
  homeImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
}

export default function AdminConfigPage() {
  const [homeTitle, setHomeTitle] = useState('');
  const [homeDescription, setHomeDescription] = useState('');
  const [homeImage, setHomeImage] = useState<string | null>(null);
  const [homeImagePreview, setHomeImagePreview] = useState<string | null>(null);
  
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [aboutImage, setAboutImage] = useState<string | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/site-config');
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero della configurazione');
        }
        
        const config = await response.json();
        
        // Hero section
        setHomeTitle(config.homeTitle || 'Benvenuti nel sito del FC Borghetto');
        setHomeDescription(config.homeDescription || 'Una squadra di calcio con una grande passione per lo sport e la comunità.');
        setHomeImagePreview(config.homeImage || null);
        
        // About section
        setAboutTitle(config.aboutTitle || 'Chi siamo');
        setAboutDescription(config.aboutDescription || 'FC Borghetto è una squadra di calcio con una grande passione per lo sport e la comunità. Fondata con l\'obiettivo di promuovere i valori dello sport e del fair play, la nostra squadra è composta da giocatori determinati e appassionati.');
        setAboutImagePreview(config.aboutImage || null);
      } catch (error) {
        console.error('Errore:', error);
        toast.error('Errore durante il recupero della configurazione');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteConfig();
  }, []);

  const handleHomeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'immagine non può superare i 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setHomeImage(result);
      setHomeImagePreview(result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAboutImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'immagine non può superare i 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAboutImage(result);
      setAboutImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Prepara i dati da inviare, evitando di sovrascrivere i campi non modificati
      const dataToUpdate: any = {
        homeTitle,
        homeDescription,
        aboutTitle,
        aboutDescription,
      };
      
      // Aggiungi le immagini solo se sono state cambiate
      if (homeImage) {
        dataToUpdate.homeImage = homeImage;
      }
      
      if (aboutImage) {
        dataToUpdate.aboutImage = aboutImage;
      }
      
      const response = await fetch('/api/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante il salvataggio della configurazione');
      }
      
      toast.success('Configurazione salvata con successo');
      // Reset delle immagini dopo il salvataggio
      setHomeImage(null);
      setAboutImage(null);
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
      <h1 className="text-2xl font-bold mb-6">Configurazione Home Page</h1>
      
      <div className="mb-6 border-b">
        <div className="flex">
          <button 
            className={`py-2 px-4 ${activeTab === 'hero' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('hero')}
          >
            Sezione Hero
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'about' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('about')}
          >
            Sezione Chi Siamo
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'hero' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Contenuti Sezione Hero</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="homeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Titolo Hero
                  </label>
                  <input
                    id="homeTitle"
                    type="text"
                    value={homeTitle}
                    onChange={(e) => setHomeTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Benvenuti nel sito del FC Borghetto"
                  />
                </div>
                
                <div>
                  <label htmlFor="homeDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrizione Hero
                  </label>
                  <textarea
                    id="homeDescription"
                    value={homeDescription}
                    onChange={(e) => setHomeDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Una squadra di calcio con una grande passione per lo sport e la comunità."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immagine Hero
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Immagine di sfondo per la sezione principale della home page. Dimensioni consigliate: 1920x1080px.
                  </p>
                  
                  {homeImagePreview ? (
                    <div className="relative w-full h-48 mb-4 border rounded-md overflow-hidden">
                      <Image 
                        src={homeImagePreview} 
                        alt="Hero Preview" 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setHomeImage(null);
                          setHomeImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        title="Rimuovi immagine"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <input
                        id="homeImage"
                        type="file"
                        accept="image/*"
                        onChange={handleHomeImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="homeImage"
                        className="cursor-pointer flex flex-col items-center justify-center text-gray-500"
                      >
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>Carica un'immagine</span>
                        <span className="text-xs mt-1">Max 5MB</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Anteprima Hero</h2>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="relative h-48 w-full">
                  {homeImagePreview ? (
                    <Image 
                      src={homeImagePreview} 
                      alt="Hero Preview" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-700 to-red-500"></div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h1 className="text-2xl font-bold mb-2">
                        {homeTitle || 'Benvenuti nel sito del FC Borghetto'}
                      </h1>
                      <p className="text-sm max-w-md mx-auto">
                        {homeDescription || 'Una squadra di calcio con una grande passione per lo sport e la comunità.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Contenuti Sezione Chi Siamo</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Titolo Chi Siamo
                  </label>
                  <input
                    id="aboutTitle"
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Chi siamo"
                  />
                </div>
                
                <div>
                  <label htmlFor="aboutDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrizione Chi Siamo
                  </label>
                  <textarea
                    id="aboutDescription"
                    value={aboutDescription}
                    onChange={(e) => setAboutDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="FC Borghetto è una squadra di calcio con una grande passione per lo sport e la comunità..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immagine Chi Siamo
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Immagine per la sezione Chi Siamo. Dimensioni consigliate: 800x600px.
                  </p>
                  
                  {aboutImagePreview ? (
                    <div className="relative w-full h-48 mb-4 border rounded-md overflow-hidden">
                      <Image 
                        src={aboutImagePreview} 
                        alt="About Preview" 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAboutImage(null);
                          setAboutImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        title="Rimuovi immagine"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <input
                        id="aboutImage"
                        type="file"
                        accept="image/*"
                        onChange={handleAboutImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="aboutImage"
                        className="cursor-pointer flex flex-col items-center justify-center text-gray-500"
                      >
                        <FaImage className="text-4xl mb-3" />
                        <span>Carica un'immagine</span>
                        <span className="text-xs mt-1">Max 5MB</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Anteprima Chi Siamo</h2>
              
              <div className="border rounded-lg overflow-hidden p-4">
                <h3 className="text-xl font-bold mb-3">{aboutTitle || 'Chi siamo'}</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {aboutImagePreview && (
                    <div className="relative w-full md:w-1/2 h-48">
                      <Image 
                        src={aboutImagePreview} 
                        alt="About Preview" 
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className={aboutImagePreview ? 'md:w-1/2' : 'w-full'}>
                    <p className="text-gray-600 text-sm">
                      {aboutDescription || 'FC Borghetto è una squadra di calcio con una grande passione per lo sport e la comunità...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="mr-2" />
            {isSaving ? 'Salvataggio...' : 'Salva configurazione'}
          </button>
        </div>
      </form>
    </div>
  );
} 