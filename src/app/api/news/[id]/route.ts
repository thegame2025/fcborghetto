import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

// GET /api/news/[id] - Ottiene una singola news
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID non valido' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const news = await db.collection('news').findOne({ _id: new ObjectId(id) });
    
    if (!news) {
      return NextResponse.json(
        { error: 'News non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('Errore durante il recupero della news:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero della news' },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - Aggiorna una singola news
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID non valido' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Prima verifica che la news esista
    const existingNews = await db.collection('news').findOne({ _id: new ObjectId(id) });
    
    if (!existingNews) {
      return NextResponse.json(
        { error: 'News non trovata' },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    
    console.log('Dati ricevuti per aggiornamento:', data);
    
    // Se la richiesta contiene solo isPublished, non richiedere titolo e contenuto
    if (Object.keys(data).length === 1 && data.isPublished !== undefined) {
      // Aggiorna solo lo stato di pubblicazione
      await db.collection('news').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            isPublished: data.isPublished,
            updatedAt: new Date()
          } 
        }
      );
    } else {
      // Valida i dati obbligatori
      if (!data.title && !data.content) {
        return NextResponse.json(
          { error: 'Titolo e contenuto sono obbligatori' },
          { status: 400 }
        );
      }
      
      // Aggiorna la news
      await db.collection('news').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...data,
            updatedAt: new Date()
          } 
        }
      );
    }
    
    // Revalidate paths to update UI
    revalidatePath('/admin/news');
    revalidatePath(`/admin/news/edit/${id}`);
    revalidatePath('/news');
    revalidatePath(`/news/${id}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della news:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento della news' },
      { status: 500 }
    );
  }
} 