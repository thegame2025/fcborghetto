'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig } from '@/lib/utils';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaInstagram } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Importa la mappa in modo dinamico lato client
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

interface SiteConfig {
  address: string;
  email: string;
  phone: string;
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  facebookUrl: string;
  instagramUrl: string;
}

export default function ContattiPage() {
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Contatti</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Informazioni di contatto</h2>
            
            <div className="space-y-4">
              {siteConfig?.address && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Indirizzo</h3>
                    <p className="text-gray-600">{siteConfig.address}</p>
                  </div>
                </div>
              )}
              
              {siteConfig?.email && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaEnvelope className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Email</h3>
                    <a href={`mailto:${siteConfig.email}`} className="text-gray-600 hover:text-blue-600">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              )}
              
              {siteConfig?.phone && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaPhone className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Telefono</h3>
                    <a href={`tel:${siteConfig.phone}`} className="text-gray-600 hover:text-blue-600">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {(siteConfig?.facebookUrl || siteConfig?.instagramUrl) && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Seguici sui social</h3>
                <div className="flex space-x-4">
                  {siteConfig?.facebookUrl && (
                    <a 
                      href={siteConfig.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {siteConfig?.instagramUrl && (
                    <a 
                      href={siteConfig.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      <FaInstagram size={24} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Orari</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Lunedì - Venerdì:</span>
                <span>15:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sabato:</span>
                <span>10:00 - 12:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Domenica:</span>
                <span>Chiuso</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Dove siamo</h2>
          <div className="h-[400px] w-full">
            {siteConfig?.mapCoordinates && 
             siteConfig.mapCoordinates.lat && 
             siteConfig.mapCoordinates.lng ? (
              <Map 
                position={[siteConfig.mapCoordinates.lat, siteConfig.mapCoordinates.lng]} 
                zoom={15}
                popupText={siteConfig.address || 'FC Borghetto'}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Coordinate mappa non disponibili</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 