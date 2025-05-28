import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

// GET /api/news - Ottiene tutte le news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parametri di paginazione e filtri
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const isPublished = searchParams.get('isPublished') === 'true';
    
    // Validazione dei parametri
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 20 ? limit : 6;
    const skip = (validPage - 1) * validLimit;
    
    const { db } = await connectToDatabase();
    
    // Costruisci la query in base ai filtri
    const filter: any = {};
    
    // Mostra solo news pubblicate se richiesto
    if (isPublished) {
      filter.isPublished = true;
    }
    
    // Conta il totale di documenti che soddisfano i filtri
    const total = await db.collection('news').countDocuments(filter);
    
    // Ottieni le news con paginazione
    const news = await db.collection('news')
      .find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .toArray();
    
    // Calcola informazioni sulla paginazione
    const totalPages = Math.ceil(total / validLimit);
    
    return NextResponse.json({
      news,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Errore durante il recupero delle news:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle news' },
      { status: 500 }
    );
  }
}

// POST /api/news - Crea una nuova news
export async function POST(request: NextRequest) {
  try {
    // Utilizzo corretto di getServerSession in Next.js 15
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const data = await request.json();
    
    // Valida i dati obbligatori
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Titolo e contenuto sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Se c'è un'immagine base64, caricala su Cloudinary
    let imageUrl = data.image;
    
    if (data.image && data.image.startsWith('data:')) {
      try {
        const uploadResult = await uploadImage(data.image);
        imageUrl = uploadResult.url;
      } catch (imageError) {
        console.error('Errore dettagliato durante il caricamento dell\'immagine:', imageError);
        return NextResponse.json(
          { error: 'Errore durante il caricamento dell\'immagine' },
          { status: 500 }
        );
      }
    }
    
    // Crea la news
    const newsDoc = {
      title: data.title,
      content: data.content,
      image: imageUrl,
      isPublished: data.isPublished || false,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('news').insertOne(newsDoc);
    
    // Revalidate paths to update UI
    revalidatePath('/admin/news');
    revalidatePath('/news');
    
    return NextResponse.json({ 
      _id: result.insertedId,
      ...newsDoc
    }, { status: 201 });
  } catch (error) {
    console.error('Errore completo durante la creazione della news:', error);
    return NextResponse.json(
      { error: `Errore durante la creazione della news: ${error instanceof Error ? error.message : 'Errore sconosciuto'}` },
      { status: 500 }
    );
  }
}

// PUT /api/news - Aggiorna lo stato di pubblicazione di più news
export async function PUT(request: NextRequest) {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    const data = await request.json();
    
    // Verifica che siano forniti gli ID e lo stato
    if (!data.ids || !Array.isArray(data.ids) || data.isPublished === undefined) {
      return NextResponse.json(
        { error: 'IDs e stato di pubblicazione sono obbligatori' },
        { status: 400 }
      );
    }
    
    // Converti stringhe di ID in ObjectId
    const objectIds = data.ids.map((id: string) => new ObjectId(id));
    
    // Aggiorna lo stato di pubblicazione di tutte le news selezionate
    const result = await db.collection('news').updateMany(
      { _id: { $in: objectIds } },
      { 
        $set: { 
          isPublished: data.isPublished,
          updatedAt: new Date()
        } 
      }
    );
    
    // Revalidate paths to update UI
    revalidatePath('/admin/news');
    revalidatePath('/news');
    
    return NextResponse.json({
      modified: result.modifiedCount,
      success: true
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento delle news:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento delle news' },
      { status: 500 }
    );
  }
}

// DELETE /api/news?id=... - Elimina una news
export async function DELETE(request: NextRequest) {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID non valido' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Trova la news da eliminare
    const news = await db.collection('news').findOne({ _id: new ObjectId(id) });
    
    if (!news) {
      return NextResponse.json(
        { error: 'News non trovata' },
        { status: 404 }
      );
    }
    
    // Elimina la news
    await db.collection('news').deleteOne({ _id: new ObjectId(id) });
    
    // Revalidate paths to update UI
    revalidatePath('/admin/news');
    revalidatePath('/news');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore durante l\'eliminazione della news:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione della news' },
      { status: 500 }
    );
  }
} 