'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-toastify';

interface News {
  _id: string;
  title: string;
  content: string;
  image?: string;
  isPublished: boolean;
  publishedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (page: number) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/news?page=${page}&limit=${pagination.limit}&isPublished=true`);
      
      if (!response.ok) {
        throw new Error('Errore durante il recupero delle news');
      }
      
      const data = await response.json();
      
      setNews(data.news || []);
      setPagination({
        ...pagination,
        page: data.pagination.page,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      });
    } catch (error) {
      setError('Si è verificato un errore durante il caricamento delle news');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchNews(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">News</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">Nessuna news disponibile al momento.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {item.image && (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{formatDate(item.publishedAt)}</p>
                  <p className="text-gray-700 mb-4">{truncateContent(item.content)}</p>
                  <Link 
                    href={`/news/${item._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Leggi di più
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex space-x-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 