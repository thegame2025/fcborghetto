'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

interface Season {
  _id: string;
  year: string;
  name: string;
  description: string;
  image?: string;
  players: Player[];
}

interface Player {
  _id?: string;
  name: string;
  role: string;
  number?: number;
  image?: string;
}

export default function AnnateListPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/seasons');
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero delle annate');
        }
        
        const data = await response.json();
        setSeasons(data.seasons || []);
      } catch (error) {
        console.error('Errore:', error);
        setError('Si è verificato un errore durante il caricamento delle annate.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-600 underline"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Le nostre Annate</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Esplora le diverse annate calcistiche del FC Borghetto, scopri le squadre e i giocatori che hanno fatto la storia del nostro club.
        </p>
      </div>

      {seasons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seasons.map((season) => (
            <Link 
              href={`/annate/${season._id}`} 
              key={season._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                {season.image ? (
                  <Image 
                    src={season.image} 
                    alt={season.name} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                    <FaUsers className="text-white text-5xl" />
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                  {season.year}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{season.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {season.description || 'Nessuna descrizione disponibile.'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <FaUsers className="mr-2" />
                    <span>{season.players?.length || 0} Giocatori</span>
                  </div>
                  <div className="text-blue-600 flex items-center">
                    Dettagli <FaChevronRight className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FaCalendarAlt className="text-gray-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nessuna annata disponibile</h3>
          <p className="text-gray-500">
            Al momento non ci sono annate da visualizzare.
          </p>
        </div>
      )}
    </div>
  );
} 