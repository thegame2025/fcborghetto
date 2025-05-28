'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getSiteConfig } from '@/lib/utils';

interface SiteConfig {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
  email: string;
  phone: string;
  facebookUrl: string;
  instagramUrl: string;
}

export default function Footer() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      const config = await getSiteConfig();
      setSiteConfig(config);
    };

    fetchSiteConfig();
  }, []);

  const primaryColor = siteConfig?.primaryColor || '#1f2937';
  const secondaryColor = siteConfig?.secondaryColor || '#ef4444';
  
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: primaryColor }} className="text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{siteConfig?.siteName || 'FC Borghetto'}</h3>
            <p className="mb-2">
              La squadra di calcio della nostra comunità.
            </p>
            <div className="flex space-x-4 mt-4">
              {siteConfig?.facebookUrl && (
                <a 
                  href={siteConfig.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-opacity-80"
                >
                  <FaFacebook size={24} />
                </a>
              )}
              {siteConfig?.instagramUrl && (
                <a 
                  href={siteConfig.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-opacity-80"
                >
                  <FaInstagram size={24} />
                </a>
              )}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Link utili</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-opacity-80">Home</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-opacity-80">News</Link>
              </li>
              <li>
                <Link href="/annate" className="hover:text-opacity-80">Annate</Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-opacity-80">Live</Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-opacity-80">Contatti</Link>
              </li>
            </ul>
          </div>
          
          {/* Contatti */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contatti</h3>
            {siteConfig?.address && (
              <div className="flex items-start space-x-2 mb-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>{siteConfig.address}</span>
              </div>
            )}
            {siteConfig?.email && (
              <div className="flex items-center space-x-2 mb-2">
                <FaEnvelope />
                <a 
                  href={`mailto:${siteConfig.email}`} 
                  className="hover:text-opacity-80"
                >
                  {siteConfig.email}
                </a>
              </div>
            )}
            {siteConfig?.phone && (
              <div className="flex items-center space-x-2">
                <FaPhone />
                <a 
                  href={`tel:${siteConfig.phone}`} 
                  className="hover:text-opacity-80"
                >
                  {siteConfig.phone}
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; {currentYear} {siteConfig?.siteName || 'FC Borghetto'}. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
} 