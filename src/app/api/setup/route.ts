import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { initializeDatabase } from '@/lib/utils';

// Questa API è utilizzata solo una volta per inizializzare il database con un utente admin
// e una configurazione di base del sito
export async function POST(req: NextRequest) {
  try {
    // Controlla se è presente la chiave di setup
    const setupKey = req.headers.get('x-setup-key');
    
    if (!setupKey || setupKey !== process.env.SETUP_KEY) {
      return NextResponse.json(
        { error: 'Non autorizzato. Chiave di setup non valida o mancante.' }, 
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Verifica se esiste già un amministratore
    const adminExists = await db.collection('users').findOne({ role: 'admin' });
    
    if (adminExists) {
      return NextResponse.json({ error: 'L\'amministratore esiste già' }, { status: 400 });
    }
    
    // Ottieni i dati dell'amministratore dal corpo della richiesta
    const data = await req.json();
    const { username, password } = data;
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username e password sono obbligatori' }, { status: 400 });
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: 'La password deve contenere almeno 8 caratteri' }, { status: 400 });
    }
    
    // Criptare la password
    const hashedPassword = await hash(password, 12);
    
    // Inizializza il database con le configurazioni predefinite
    await initializeDatabase();
    
    // Crea l'utente amministratore
    const result = await db.collection('users').insertOne({
      username,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Amministratore creato con successo',
      userId: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Errore durante la configurazione:', error);
    return NextResponse.json({ 
      error: 'Errore durante la configurazione', 
      message: error instanceof Error ? error.message : 'Errore sconosciuto' 
    }, { status: 500 });
  }
} 