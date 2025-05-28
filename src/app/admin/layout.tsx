'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FaCog, FaNewspaper, FaUsers, FaVideo, FaEnvelope, FaPalette, FaSignOutAlt, FaBars, FaTimes, FaHome } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <FaHome /> },
    { name: 'Homepage', href: '/admin/configurazione', icon: <FaCog /> },
    { name: 'News', href: '/admin/news', icon: <FaNewspaper /> },
    { name: 'Annate', href: '/admin/annate', icon: <FaUsers /> },
    { name: 'Live', href: '/admin/live', icon: <FaVideo /> },
    { name: 'Contatti', href: '/admin/contatti', icon: <FaEnvelope /> },
    { name: 'Tema', href: '/admin/tema', icon: <FaPalette /> },
  ];

  // Skip rendering if we're on the login page or initialize page
  if (pathname === '/admin/login' || pathname === '/admin/initialize') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={handleSignOut} className="text-white">
          <FaSignOutAlt size={20} />
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-sm">
          <nav className="px-4 py-2">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white h-screen fixed md:sticky top-0 left-0 z-30 shadow-md transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-20'
          } hidden md:block`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <h1 className={`font-bold text-blue-600 ${isSidebarOpen ? 'block' : 'hidden'}`}>
              Admin Panel
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!isSidebarOpen ? item.name : undefined}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {isSidebarOpen && item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <span className="mr-3">
                    <FaSignOutAlt />
                  </span>
                  {isSidebarOpen && 'Logout'}
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-6 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300`}>
          {children}
        </main>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
} 