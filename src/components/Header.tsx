'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getSiteConfig } from '@/lib/utils';

interface SiteConfig {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSiteConfig = async () => {
      const config = await getSiteConfig();
      setSiteConfig(config);
    };

    fetchSiteConfig();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
    { name: 'Annate', href: '/annate' },
    { name: 'Live', href: '/live' },
    { name: 'Contatti', href: '/contatti' },
  ];

  const logoUrl = siteConfig?.logo || '/logo-placeholder.png';
  const primaryColor = siteConfig?.primaryColor || '#1f2937';
  const secondaryColor = siteConfig?.secondaryColor || '#ef4444';

  return (
    <header 
      className="shadow-md" 
      style={{ backgroundColor: primaryColor }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image 
                src={logoUrl} 
                alt={siteConfig?.siteName || 'FC Borghetto'} 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white font-bold text-xl">{siteConfig?.siteName || 'FC Borghetto'}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`text-white hover:text-opacity-80 font-medium ${
                  pathname === item.href ? 'border-b-2' : ''
                }`}
                style={{ borderColor: pathname === item.href ? secondaryColor : 'transparent' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Navigation Button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden mt-4 py-4 border-t border-gray-700"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`text-white hover:text-opacity-80 font-medium ${
                    pathname === item.href ? 'border-l-4 pl-2' : 'pl-3'
                  }`}
                  style={{ borderColor: pathname === item.href ? secondaryColor : 'transparent' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 