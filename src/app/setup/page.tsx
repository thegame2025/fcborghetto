'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the initialize page
    router.push('/admin/initialize');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Reindirizzamento in corso...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Se non vieni reindirizzato automaticamente, 
          <a href="/admin/initialize" className="text-blue-600 hover:underline"> clicca qui</a>
        </p>
      </div>
    </div>
  );
} 