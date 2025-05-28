import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    // Controlla se c'è un parametro di setup_key che corrisponde a quello in .env
    const url = new URL(request.url);
    const setupKey = url.searchParams.get('setup_key');
    
    if (!setupKey || setupKey !== process.env.SETUP_KEY) {
      return NextResponse.json(
        { error: 'Non autorizzato. Chiave di setup non valida o mancante.' }, 
        { status: 401 }
      );
    }
    
    const result = await initializeDatabase();
    
    if (result.success) {
      return NextResponse.json({ 
        message: 'Database inizializzato con successo', 
        success: true 
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        error: 'Errore durante l\'inizializzazione del database', 
        message: result.error,
        success: false 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Errore durante l\'inizializzazione:', error);
    return NextResponse.json({ 
      error: 'Errore durante l\'inizializzazione del database',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
      success: false 
    }, { status: 500 });
  }
} 