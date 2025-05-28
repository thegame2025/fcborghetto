'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function InitializePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [step, setStep] = useState(1); // 1: Chiave setup, 2: Crea admin
  const router = useRouter();

  const handleSetupKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verifica la chiave di setup
      const response = await fetch('/api/initialize?setup_key=' + encodeURIComponent(setupKey), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Chiave di setup non valida');
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      toast.success(data.message || 'Chiave di setup valida');
      setStep(2);
    } catch (error) {
      console.error('Errore durante la verifica della chiave di setup:', error);
      toast.error('Si è verificato un errore durante la verifica della chiave di setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password.length < 8) {
        toast.error('La password deve contenere almeno 8 caratteri');
        setIsLoading(false);
        return;
      }

      // Crea l'amministratore
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-setup-key': setupKey
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Si è verificato un errore durante la creazione dell\'amministratore');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      toast.success(data.message || 'Amministratore creato con successo');
      
      // Reindirizza alla pagina di login dopo un breve ritardo
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (error) {
      console.error('Errore durante la creazione dell\'amministratore:', error);
      toast.error('Si è verificato un errore durante la creazione dell\'amministratore');
      setIsLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/initialize?setup_key=' + encodeURIComponent(setupKey));
      
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Errore durante l\'inizializzazione del database');
        setIsInitializing(false);
        return;
      }
      
      const data = await response.json();
      toast.success('Database inizializzato con successo');
    } catch (error) {
      console.error('Errore durante l\'inizializzazione del database:', error);
      toast.error('Si è verificato un errore durante l\'inizializzazione del database');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? 'Inizializzazione' : 'Crea Amministratore'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 
            ? 'Inserisci la chiave di setup per iniziare la configurazione' 
            : 'Crea un account amministratore per gestire il sito'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 ? (
            <form onSubmit={handleSetupKeySubmit} className="space-y-6">
              <div>
                <label htmlFor="setupKey" className="block text-sm font-medium text-gray-700">
                  Chiave di setup
                </label>
                <div className="mt-1">
                  <input
                    id="setupKey"
                    name="setupKey"
                    type="password"
                    required
                    value={setupKey}
                    onChange={(e) => setSetupKey(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Inserisci la chiave di setup"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Verifica in corso...' : 'Verifica chiave'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleAdminCreate} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nome utente
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="admin"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Minimo 8 caratteri"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Creazione in corso...' : 'Crea amministratore'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <button
                  onClick={initializeDatabase}
                  disabled={isInitializing}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isInitializing ? 'Inizializzazione in corso...' : 'Inizializza database'}
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Questo inizializzerà il database con configurazioni predefinite. Puoi modificarle in seguito.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 