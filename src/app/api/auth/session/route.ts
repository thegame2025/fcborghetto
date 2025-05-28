import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session) {
      return NextResponse.json({
        authenticated: true,
        session,
      });
    } else {
      return NextResponse.json({
        authenticated: false,
        message: "Non autenticato",
      });
    }
  } catch (error) {
    console.error("Errore nel recuperare la sessione:", error);
    return NextResponse.json({
      authenticated: false,
      error: "Errore nel recuperare la sessione",
      details: error instanceof Error ? error.message : "Errore sconosciuto"
    }, { status: 500 });
  }
} 