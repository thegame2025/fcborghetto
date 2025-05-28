'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaImage, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

interface NewsEditPageProps {
  params: {
    id: string;
  }
}

export default function EditNewsPage({ params }: NewsEditPageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsFetching(true);
        
        const response = await fetch(`/api/news/${id}`);
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero della news');
        }
        
        const news = await response.json();
        
        setTitle(news.title);
        setContent(news.content);
        setPublished(news.isPublished);
        if (news.image) {
          setImagePreview(news.image);
          setOriginalImage(news.image);
        }
      } catch (error) {
        console.error('Errore:', error);
        toast.error('Errore durante il recupero della news');
        router.push('/admin/news');
      } finally {
        setIsFetching(false);
      }
    };

    fetchNews();
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'immagine non può superare i 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error('Titolo e contenuto sono obbligatori');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Determina se l'immagine è stata modificata
      const imageData = imagePreview !== originalImage ? imagePreview : undefined;
      
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          image: imageData,
          isPublished: published,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante l\'aggiornamento della news');
      }
      
      toast.success('News aggiornata con successo');
      router.refresh();
      router.push('/admin/news');
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante l\'aggiornamento della news');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modifica News</h1>
        <Link 
          href="/admin/news"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Torna all'elenco
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titolo
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Inserisci il titolo della news"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Contenuto
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
              placeholder="Inserisci il contenuto della news"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Immagine
            </label>
            {imagePreview ? (
              <div className="relative w-full h-48 mb-2 border rounded-md overflow-hidden">
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  title="Rimuovi immagine"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center justify-center text-gray-500"
                >
                  <FaImage size={24} className="mb-2" />
                  <span>Carica un'immagine</span>
                  <span className="text-xs mt-1">Max 5MB</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
              Pubblicata
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="mr-2" />
              {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 