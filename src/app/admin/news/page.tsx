'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { formatDate } from '@/lib/utils';

interface News {
  _id: string;
  title: string;
  content: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchNews = async (page = 1, filter = 'all') => {
    try {
      setIsLoading(true);
      
      let url = `/api/news?page=${page}&limit=${pagination.limit}`;
      if (filter !== 'all') {
        url += `&isPublished=${filter === 'published'}`;
      }
      
      const response = await fetch(url, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error('Errore durante il recupero delle news');
      }
      
      const data = await response.json();
      setNews(data.news);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante il recupero delle news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(pagination.page, filter);
  }, [filter]);

  const handlePageChange = (page: number) => {
    fetchNews(page, filter);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa news?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/news?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione della news');
      }
      
      toast.success('News eliminata con successo');
      router.refresh();
      fetchNews(pagination.page, filter);
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante l\'eliminazione della news');
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error('Errore durante l\'aggiornamento della news');
      }
      
      toast.success(`News ${!currentStatus ? 'pubblicata' : 'nascosta'} con successo`);
      router.refresh();
      fetchNews(pagination.page, filter);
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore durante l\'aggiornamento della news');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione News</h1>
        <Link 
          href="/admin/news/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Nuova News
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Elenco News</h2>
          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-sm text-gray-600">Filtra:</label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value="all">Tutte</option>
              <option value="published">Pubblicate</option>
              <option value="draft">Bozze</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nessuna news trovata
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Titolo</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Stato</th>
                  <th className="px-4 py-2 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {item.image && (
                          <div className="relative w-12 h-12 mr-3 rounded-md overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.title} 
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="truncate max-w-xs">{item.title}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.isPublished ? 'Pubblicata' : 'Bozza'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleTogglePublished(item._id, item.isPublished)}
                          className={`p-1 rounded-md ${
                            item.isPublished 
                              ? 'text-yellow-500 hover:bg-yellow-100' 
                              : 'text-green-500 hover:bg-green-100'
                          }`}
                          title={item.isPublished ? 'Nascondi' : 'Pubblica'}
                        >
                          {item.isPublished ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <Link
                          href={`/admin/news/edit/${item._id}`}
                          className="p-1 text-blue-500 hover:bg-blue-100 rounded-md"
                          title="Modifica"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded-md"
                          title="Elimina"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 