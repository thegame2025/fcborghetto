'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import PlayerCard from '@/components/PlayerCard';

interface Player {
  _id?: string;
  name: string;
  role: string;
  number?: number;
  image?: string;
}

interface Season {
  _id: string;
  name: string;
  year: string;
  description?: string;
  players: Player[];
}

export default function SeasonDetailPage() {
  const params = useParams();
  const { id } = params;
  
  const [season, setSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedPlayers, setGroupedPlayers] = useState<Record<string, Player[]>>({});
  
  useEffect(() => {
    const fetchSeason = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/seasons/${id}`);
        
        if (response.ok) {
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
        }
      } catch (error) {
        console.error('Errore:', error);
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

  if (!season) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Annata non trovata</p>
        <Link href="/annate" className="text-blue-600 hover:underline">
          Torna alle annate
        </Link>
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
    // Container principale che contiene tutto
    <div className="container mx-auto px-4 py-8">
      {/* Link per tornare indietro */}
      <div className="mb-8">
        <Link 
          href="/annate" 
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Torna alle annate
        </Link>
      </div>
      
      {/* Div con descrizione e anno dell'annata */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h1 className="text-3xl font-bold mb-2">{season.name}</h1>
        <p className="text-lg text-gray-600 mb-4">Anno: {season.year}</p>
        {season.description && (
          <p className="text-gray-700">{season.description}</p>
        )}
      </div>

      {/* Sezioni per ogni ruolo */}
      <div className="space-y-16">
        {sortedRoles.map((role) => (
          <section key={role} className="mb-12">
            {/* Titolo del ruolo */}
            <div className="bg-blue-600 text-white py-2 px-4 rounded-t-lg">
              <h2 className="text-2xl font-bold">{role}</h2>
            </div>
            
            {/* Grid con le card */}
            <div className="bg-gray-50 p-6 rounded-b-lg shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
                {groupedPlayers[role].map((player, index) => (
                  <PlayerCard
                    key={player._id || index}
                    name={player.name}
                    role={role}
                    number={player.number}
                    image={player.image}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
} 