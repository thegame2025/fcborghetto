import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "./mongodb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Versione client-safe che usa fetch API
export async function getSiteConfig() {
  try {
    // Solo quando eseguito sul server
    if (typeof window === 'undefined') {
      const { db } = await connectToDatabase();
      const config = await db.collection('site_config').findOne({});
      return config || {};
    } 
    // In esecuzione sul client
    else {
      const response = await fetch('/api/site-config');
      if (!response.ok) {
        throw new Error('Errore durante il recupero della configurazione');
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Errore durante il recupero della configurazione del sito:', error);
    return {};
  }
}

export async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/api/auth/signin");
  }

  return session;
}

// Questo dovrebbe essere chiamato solo sul server
export async function initializeDatabase() {
  if (typeof window !== 'undefined') {
    console.error('initializeDatabase non può essere chiamato dal client');
    return { 
      success: false, 
      error: 'Questa funzione può essere chiamata solo dal server' 
    };
  }

  try {
    const { db } = await connectToDatabase();
    
    // Verifica se esiste già una configurazione del sito
    const existingConfig = await db.collection('site_config').findOne({});
    
    if (!existingConfig) {
      // Crea configurazione predefinita
      await db.collection('site_config').insertOne({
        siteName: 'FC Borghetto',
        logo: null,
        primaryColor: '#1f2937',
        secondaryColor: '#ef4444',
        accentColor: '#f59e0b',
        homeTitle: 'Benvenuti nel sito del FC Borghetto',
        homeDescription: 'Una squadra di calcio con una grande passione per lo sport e la comunità.',
        homeImage: null,
        address: 'Via Roma 123, Borghetto, IT',
        email: 'info@fcborghetto.it',
        phone: '+39 123 456 7890',
        mapCoordinates: [45.44, 10.99],
        facebookUrl: 'https://facebook.com',
        instagramUrl: 'https://instagram.com',
        youtubeUrl: null,
        liveStreamUrl: null,
        liveStreamActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('Configurazione del sito inizializzata con successo');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del database:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Errore sconosciuto' 
    };
  }
} 