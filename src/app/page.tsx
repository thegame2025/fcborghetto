'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaNewspaper, FaVideo } from 'react-icons/fa';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import NewsCard from '@/components/NewsCard';

interface News {
  _id: string;
  title: string;
  content: string;
  image?: string;
  publishedAt: string;
  isPublished: boolean;
}

export default function HomePage() {
  const { config: siteConfig, isLoading: isConfigLoading } = useSiteConfig();
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsNewsLoading(true);
        
        const response = await fetch('/api/news?limit=3&isPublished=true', { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error('Errore durante il recupero delle news');
        }
        
        const newsData = await response.json();
        console.log('News ricevute nella homepage:', newsData.news);
        setLatestNews(newsData.news || []);
      } catch (error) {
        console.error('Errore:', error);
        setError('Errore durante il caricamento delle news');
      } finally {
        setIsNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const isLoading = isConfigLoading || isNewsLoading;

  // Debug log
  useEffect(() => {
    // Rimossi log di debug per produzione
  }, [siteConfig]);

  // Get the primary color from siteConfig or use a default
  const primaryColor = siteConfig?.primaryColor || '#1f2937';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative h-[70vh] w-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${siteConfig?.homeImage || "/images/placeholder.jpg"}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8 py-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg">
              {siteConfig?.homeTitle || 'Benvenuti nel sito del FC Borghetto'}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-shadow-md">
              {siteConfig?.homeDescription || 'Una squadra di calcio con una grande passione per lo sport e la comunità.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/news" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                Ultime Notizie
              </Link>
              <Link href="/contatti" className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors">
                Contattaci
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Ultime Notizie</h2>
            <Link href="/news" className="text-red-600 hover:text-red-700 font-medium flex items-center">
              Tutte le notizie <span className="ml-2">→</span>
            </Link>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
              {error}
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <NewsCard
                  key={news._id}
                  id={news._id}
                  title={news.title}
                  content={news.content}
                  image={news.image}
                  publishedAt={news.publishedAt}
                  truncateLength={40}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Nessuna notizia disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Live Stream Section */}
      <section className="py-16 px-4 text-white" style={{ backgroundColor: primaryColor }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Segui le nostre partite in diretta</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Non perderti neanche un minuto delle nostre partite. Seguici in diretta streaming quando disponibile.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link href="/live" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-medium transition-colors flex items-center text-lg">
              <FaVideo className="mr-3" />
              Vai alla diretta
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">{siteConfig?.aboutTitle || 'Chi siamo'}</h2>
              <p className="text-gray-600 mb-6">
                {siteConfig?.aboutDescription || 
                  'FC Borghetto è una squadra di calcio con una grande passione per lo sport e la comunità. Fondata con l\'obiettivo di promuovere i valori dello sport e del fair play, la nostra squadra è composta da giocatori determinati e appassionati.'}
              </p>
              <Link href="/annate" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                Scopri le nostre annate
              </Link>
            </div>
            {/* Team Image */}
            <div className="md:order-2 w-full md:w-1/2">
              <div className="relative w-full h-[300px] md:h-[400px]">
                <Image 
                  src={siteConfig?.aboutImage || siteConfig?.homeImage || "/images/placeholder.jpg"}
                  alt="FC Borghetto Team" 
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
