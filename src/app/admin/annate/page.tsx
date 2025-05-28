'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import Image from 'next/image';

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

export default function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  
  // Form state
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Player>({ name: '', role: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/seasons');
      
      if (!response.ok) {
        throw new Error('Errore durante il recupero delle annate');
      }
      
      const data = await response.json();
      setSeasons(data.seasons || []);
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante il recupero delle annate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'immagine non può superare i 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handlePlayerImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'immagine non può superare i 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const updatedPlayers = [...players];
      updatedPlayers[index].image = result;
      setPlayers(updatedPlayers);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPlayer = () => {
    if (!newPlayer.name || !newPlayer.role) {
      toast.error('Nome e ruolo del giocatore sono obbligatori');
      return;
    }
    
    setPlayers([...players, newPlayer]);
    setNewPlayer({ name: '', role: '' });
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeasonId(season._id);
    setYear(season.year);
    setName(season.name);
    setDescription(season.description);
    setImagePreview(season.image || null);
    setPlayers(season.players || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSeason = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa annata?')) return;

    try {
      const response = await fetch(`/api/seasons/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione dell\'annata');
      }
      
      toast.success('Annata eliminata con successo');
      fetchSeasons();
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante l\'eliminazione dell\'annata');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!year || !name) {
      toast.error('Anno e nome dell\'annata sono obbligatori');
      return;
    }
    
    try {
      setIsSaving(true);
      
      const seasonData = {
        year,
        name,
        description,
        image: image || imagePreview,
        players,
      };
      
      const url = editingSeasonId 
        ? `/api/seasons/${editingSeasonId}` 
        : '/api/seasons';
      
      const method = editingSeasonId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seasonData),
      });
      
      if (!response.ok) {
        throw new Error(`Errore durante il ${editingSeasonId ? 'aggiornamento' : 'salvataggio'} dell'annata`);
      }
      
      toast.success(`Annata ${editingSeasonId ? 'aggiornata' : 'creata'} con successo`);
      resetForm();
      fetchSeasons();
    } catch (error) {
      console.error('Errore:', error);
      toast.error(`Errore durante il ${editingSeasonId ? 'aggiornamento' : 'salvataggio'} dell'annata`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setEditingSeasonId(null);
    setYear('');
    setName('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setPlayers([]);
    setShowForm(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione Annate</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md flex items-center`}
        >
          {showForm ? 'Annulla' : <><FaPlus className="mr-2" /> Nuova Annata</>}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingSeasonId ? 'Modifica' : 'Nuova'} Annata</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Anno Sportivo*
                </label>
                <input
                  id="year"
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="es. 2023-2024"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Annata*
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="es. Prima Squadra"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrizione dell'annata..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Immagine Annata
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Immagine rappresentativa dell'annata (es. foto di squadra). Dimensioni consigliate: 1200x800px.
              </p>
              
              {imagePreview ? (
                <div className="relative w-full h-64 mb-4 border rounded-md overflow-hidden">
                  <Image 
                    src={imagePreview} 
                    alt="Anteprima Annata" 
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
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
                    id="seasonImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="seasonImage"
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
            
            <div>
              <h3 className="text-lg font-medium mb-3">Giocatori</h3>
              
              <div className="mb-4 p-4 border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Giocatore
                    </label>
                    <input
                      id="playerName"
                      type="text"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nome e Cognome"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="playerRole" className="block text-sm font-medium text-gray-700 mb-1">
                      Ruolo
                    </label>
                    <select
                      id="playerRole"
                      value={newPlayer.role}
                      onChange={(e) => setNewPlayer({...newPlayer, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleziona ruolo</option>
                      <option value="Portiere">Portiere</option>
                      <option value="Difensore">Difensore</option>
                      <option value="Centrocampista">Centrocampista</option>
                      <option value="Attaccante">Attaccante</option>
                      <option value="Allenatore">Allenatore</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Numero
                    </label>
                    <input
                      id="playerNumber"
                      type="number"
                      min="1"
                      max="99"
                      value={newPlayer.number || ''}
                      onChange={(e) => setNewPlayer({...newPlayer, number: parseInt(e.target.value) || undefined})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Numero"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddPlayer}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Aggiungi Giocatore
                  </button>
                </div>
              </div>
              
              {players.length > 0 ? (
                <div className="mt-4 border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ruolo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Numero
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Foto
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Azioni
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {players.map((player, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{player.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{player.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{player.number || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {player.image ? (
                                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                  <Image 
                                    src={player.image} 
                                    alt={player.name} 
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <input
                                    id={`playerImage-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePlayerImageChange(e, index)}
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor={`playerImage-${index}`}
                                    className="cursor-pointer text-gray-400 hover:text-gray-500"
                                    title="Aggiungi foto"
                                  >
                                    +
                                  </label>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemovePlayer(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Rimuovi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nessun giocatore aggiunto</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="mr-2" />
                {isSaving ? 'Salvataggio...' : 'Salva Annata'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Annate Disponibili
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Elenco delle annate calcistiche create
          </p>
        </div>
        
        {seasons.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {seasons.map((season) => (
              <div key={season._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{season.name}</h4>
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {season.year}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{season.description}</p>
                    
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500">
                        {season.players?.length || 0} Giocatori
                      </span>
                      
                      {season.image && (
                        <div className="ml-4 relative h-12 w-20 rounded overflow-hidden">
                          <Image 
                            src={season.image} 
                            alt={season.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSeason(season)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                      title="Modifica"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteSeason(season._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      title="Elimina"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Nessuna annata disponibile</p>
          </div>
        )}
      </div>
    </div>
  );
} 