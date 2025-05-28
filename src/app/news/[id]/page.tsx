'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { FaArrowLeft } from 'react-icons/fa';

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

interface News {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/news/${id}`, { cache: 'no-store' });
        
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            throw new Error('Errore nel caricamento della news');
          }
          return;
        }
        
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Errore:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">News non trovata</h2>
          <p className="text-gray-600 mb-8">La news che stai cercando non esiste o è stata rimossa.</p>
          <Link href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Torna all'elenco delle news
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Si è verificato un errore</h2>
          <p className="text-gray-600 mb-8">Non è stato possibile caricare la news richiesta.</p>
          <Link href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Torna all'elenco delle news
          </Link>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">News non disponibile</h2>
          <p className="text-gray-600 mb-8">La news potrebbe essere stata rimossa o non è più disponibile.</p>
          <Link href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Torna all'elenco delle news
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Torna alle news
        </Link>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {news.image && (
            <div className="relative h-64 w-full md:h-80">
              <Image 
                src={news.image} 
                alt={news.title} 
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
            <p className="text-gray-500 mb-6">{formatDate(news.createdAt)}</p>
            
            <div className="prose max-w-none">
              {news.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 