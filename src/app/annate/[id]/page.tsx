'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

interface Player {
  _id?: string;
  name: string;
  role: string;
  number?: number;
  image?: string;
}

interface Season {
  _id: string;
  year: string;
  name: string;
  description: string;
  image?: string;
  players: Player[];
  createdAt: string;
  updatedAt: string;
}

export default function SeasonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [season, setSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Group players by role
  const [groupedPlayers, setGroupedPlayers] = useState<Record<string, Player[]>>({});
  
  useEffect(() => {
    const fetchSeason = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/seasons/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Annata non trovata');
          }
          throw new Error('Errore durante il recupero dell\'annata');
        }
        
        const data = await response.json();
        setSeason(data);
        
        // Group players by role
        if (data.players && Array.isArray(data.players)) {
          const grouped: Record<string, Player[]> = {};
          data.players.forEach((player: Player) => {
            if (!grouped[player.role]) {
              grouped[player.role] = [];
            }
            grouped[player.role].push(player);
          });
          setGroupedPlayers(grouped);
        }
      } catch (error) {
        console.error('Errore:', error);
        setError((error as Error).message || 'Si è verificato un errore durante il caricamento dell\'annata.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSeason();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !season) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
          <FaExclamationTriangle className="text-3xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">{error || 'Annata non trovata'}</h2>
          <p className="mb-4">L'annata richiesta potrebbe essere stata rimossa o non essere disponibile.</p>
          <Link 
            href="/annate" 
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Torna alle annate
          </Link>
        </div>
      </div>
    );
  }

  // Define the order of roles for display
  const roleOrder = [
    'Allenatore',
    'Staff',
    'Portiere',
    'Difensore',
    'Centrocampista',
    'Attaccante'
  ];

  // Sort roles based on the defined order
  const sortedRoles = Object.keys(groupedPlayers).sort((a, b) => {
    const indexA = roleOrder.indexOf(a);
    const indexB = roleOrder.indexOf(b);
    return indexA - indexB;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <Link 
        href="/annate" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <FaArrowLeft className="mr-2" /> Torna alle annate
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative h-64 md:h-80">
          {season.image ? (
            <Image 
              src={season.image} 
              alt={season.name} 
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center text-white mb-2">
              <FaCalendarAlt className="mr-2" />
              <span className="font-medium">{season.year}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{season.name}</h1>
          </div>
        </div>
        
        {/* Description */}
        <div className="p-6 md:p-8 border-b">
          <h2 className="text-xl font-semibold mb-4">Descrizione</h2>
          <p className="text-gray-700">
            {season.description || 'Nessuna descrizione disponibile per questa annata.'}
          </p>
        </div>
        
        {/* Players */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Giocatori</h2>
          
          {season.players && season.players.length > 0 ? (
            <div className="space-y-8">
              {sortedRoles.map((role) => (
                <div key={role}>
                  <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                    {role}
                    <span className="text-gray-500 text-sm font-normal ml-2">
                      ({groupedPlayers[role].length})
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {groupedPlayers[role].map((player, index) => (
                      <div 
                        key={player._id || index} 
                        className="bg-gray-50 rounded-lg p-4 text-center"
                      >
                        <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                          {player.image ? (
                            <Image 
                              src={player.image} 
                              alt={player.name} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-gray-800">{player.name}</h4>
                        
                        {player.number && (
                          <div className="inline-block bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mt-1">
                            {player.number}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Nessun giocatore disponibile per questa annata.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 