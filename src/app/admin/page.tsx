'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaNewspaper, FaUsers, FaVideo, FaEnvelope, FaCog, FaEdit } from 'react-icons/fa';

interface Stats {
  newsCount: number;
  seasonsCount: number;
  playersCount: number;
}

interface Season {
  _id: string;
  name: string;
  year: string;
  players?: Array<{ _id: string; name: string; }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch news count
        const newsResponse = await fetch('/api/news/count');
        const newsData = await newsResponse.json();
        
        // Fetch seasons count
        const seasonsResponse = await fetch('/api/seasons/count');
        const seasonsData = await seasonsResponse.json();
        
        // We'll create a new API endpoint to get player counts or calculate it here
        let playersCount = 0;
        if (seasonsData.success && Array.isArray(seasonsData.seasons)) {
          // If we have the full seasons data, we can calculate player count
          playersCount = seasonsData.seasons.reduce((acc: number, season: Season) => {
            return acc + (season.players ? season.players.length : 0);
          }, 0);
        }
        
        setStats({
          newsCount: newsData.count || 0,
          seasonsCount: seasonsData.count || 0,
          playersCount: playersCount,
        });
      } catch (error) {
        console.error('Errore durante il recupero delle statistiche:', error);
        // Fallback to 0 if there's an error
        setStats({
          newsCount: 0,
          seasonsCount: 0,
          playersCount: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardItems = [
    {
      title: 'Homepage',
      description: 'Impostazioni generali del sito e della home',
      icon: <FaCog size={24} />,
      href: '/admin/configurazione',
      color: 'bg-blue-500',
    },
    {
      title: 'Gestisci News',
      description: 'Crea, modifica ed elimina le notizie del sito',
      icon: <FaNewspaper size={24} />,
      href: '/admin/news',
      color: 'bg-green-500',
    },
    {
      title: 'Gestisci Annate',
      description: 'Gestisci le annate calcistiche e i giocatori',
      icon: <FaUsers size={24} />,
      href: '/admin/annate',
      color: 'bg-red-500',
    },
    {
      title: 'Streaming Live',
      description: 'Configura lo streaming live delle partite',
      icon: <FaVideo size={24} />,
      href: '/admin/live',
      color: 'bg-purple-500',
    },
    {
      title: 'Contatti',
      description: 'Modifica le informazioni di contatto e la mappa',
      icon: <FaEnvelope size={24} />,
      href: '/admin/contatti',
      color: 'bg-yellow-500',
    },
    {
      title: 'Modifica Tema',
      description: 'Personalizza i colori e l\'aspetto del sito',
      icon: <FaEdit size={24} />,
      href: '/admin/tema',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Amministratore</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Totale News</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : stats?.newsCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaNewspaper className="text-blue-500" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Annate</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : stats?.seasonsCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUsers className="text-green-500" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Giocatori</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : stats?.playersCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUsers className="text-purple-500" size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Gestione Sito</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`${item.color} h-2`}></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-md ${item.color} bg-opacity-10`}>
                  {item.icon}
                </div>
                <h3 className="ml-3 font-semibold">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 