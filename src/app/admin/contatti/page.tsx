'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave } from 'react-icons/fa';
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

export default function AdminContattiPage() {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState(45.4642);
  const [lng, setLng] = useState(9.1900);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
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
        
        setAddress(config.address || '');
        setEmail(config.email || '');
        setPhone(config.phone || '');
        setLat(config.mapCoordinates?.lat || 45.4642);
        setLng(config.mapCoordinates?.lng || 9.1900);
        setFacebookUrl(config.facebookUrl || '');
        setInstagramUrl(config.instagramUrl || '');
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
          address,
          email,
          phone,
          mapCoordinates: {
            lat: parseFloat(lat.toString()),
            lng: parseFloat(lng.toString()),
          },
          facebookUrl,
          instagramUrl,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestione Contatti</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Informazioni di contatto</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Indirizzo
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Via Roma 1, Borghetto, Italia"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="info@fcborghetto.it"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefono
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+39 123 456 7890"
              />
            </div>
            
            <div>
              <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL Facebook
              </label>
              <input
                id="facebookUrl"
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://facebook.com/fcborghetto"
              />
            </div>
            
            <div>
              <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL Instagram
              </label>
              <input
                id="instagramUrl"
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://instagram.com/fcborghetto"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Coordinate Mappa</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitudine
                  </label>
                  <input
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitudine
                  </label>
                  <input
                    id="lng"
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <h2 className="text-lg font-semibold mb-4">Anteprima Mappa</h2>
          <p className="text-sm text-gray-500 mb-4">
            Inserisci le coordinate corrette per visualizzare la posizione esatta sulla mappa.
          </p>
          
          <div className="h-[400px] w-full">
            <Map 
              position={[lat, lng]} 
              zoom={15}
              popupText={address || 'FC Borghetto'}
            />
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Suggerimento:</h3>
            <p className="text-sm text-gray-500">
              Puoi trovare le coordinate esatte cercando la tua posizione su Google Maps, 
              facendo clic con il pulsante destro del mouse sulla posizione desiderata e 
              selezionando "Che cosa c'è qui?". Le coordinate appariranno nella parte inferiore 
              della schermata.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 